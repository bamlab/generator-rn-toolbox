const Base = require('yeoman-generator').Base;

class FastlaneGenerator extends Base {
  prompting() {
    return this.prompt([{
      type    : 'companyName',
      name    : 'companyName',
      message : 'Your company name',
      default : 'My Company',
    },
    {
      type    : 'input',
      name    : 'appName',
      message : 'Your app name',
      default : 'My Awesome App',
    },
    {
      type    : 'input',
      name    : 'projectName',
      message : 'Your react native app directory name',
      default : 'MyAwesomeApp',
    },
    {
      type    : 'input',
      name    : 'stagingAppId',
      message : 'Your app id for staging',
      default : 'com.mycompany.app.staging',
    },
    {
      type    : 'input',
      name    : 'prodAppId',
      message : 'Your app id for prod',
      default : 'com.mycompany.app',
    },
    {
      type    : 'input',
      name    : 'matchGit',
      message : 'Your git repo for match',
      default : 'git@github.com:mycompany/certificates.git',
    },
    {
      type    : 'input',
      name    : 'appleId',
      message : 'Your apple id',
      default : 'dev@mycompany.com',
    },
    {
      type    : 'input',
      name    : 'stagingAppleTeamId',
      message : 'The developer.apple.com team id for staging certificates',
      default : 'XXXXXXXXXX',
    },
    {
      type    : 'input',
      name    : 'prodAppleTeamId',
      message : 'The developer.apple.com team id for prod certificates',
      default : 'XXXXXXXXXX',
    },
    {
      type    : 'input',
      name    : 'itunesTeamId',
      message : 'The itunesconnect.apple.com team id',
      default : 'XXXXXXXX',
    },
    {
      type    : 'input',
      name    : 'keystorePassword',
      message : 'Your keystore password',
      default : '*********',
    },
    {
      type    : 'input',
      name    : 'hockeyAppToken',
      message : 'A valid HockeyApp token',
    }]).then((answers) => {
      this.answers = answers;
      this.answers.lowerCaseProjectName = answers.projectName.toLowerCase();
    });
  }

  install() {
    this._createKeystore();
    this.spawnCommand('bundle', ['install'], {
      cwd: this.destinationPath(),
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('fastlane/*'),
      this.destinationPath('fastlane')
    );
    this.fs.copyTpl(
      this.templatePath('environment/*'),
      this.destinationPath('environment')
    );
    this.fs.copyTpl(
      this.templatePath('fastlane/.*'),
      this.destinationPath('fastlane'),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('Gemfile'),
      this.destinationPath('Gemfile')
    );
    this.fs.copyTpl(
      this.templatePath('strings.xml'),
      this.destinationPath('android/app/src/main/res/values/strings.xml')
    );
    this._extendGitignore();
    this._extendGradle();
    this._activateManualSigning();
  }

  _extendGitignore() {
    const content = this.fs.read(this.destinationPath('.gitignore'));
    this.fs.copyTpl(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore'),
      { content }
    );
  }

  _extendGradle() {
    let config = this.fs.read(this.destinationPath('android/app/build.gradle'));
    // Change the app id
    config = config.replace(
      /applicationId ".*"/,
      'applicationId System.getenv("GRADLE_APP_IDENTIFIER")'
    );
    // Add the release signingConfig
    config = config.replace(
      /(buildTypes {\n\s*release {(?:\n.*)+?)(\n\s*})/m,
      '$1\n            signingConfig signingConfigs.release$2'
    );
    // Add the signingConfig
    const gradleSigningTemplate = this.fs.read(this.templatePath('gradleSigning'));
    config = config.replace(
      /(})(\n\s*buildTypes)/m,
      `$1\n${gradleSigningTemplate}$2`
    );
    // Add the default params
    config = config.replace(
      /\nandroid {\n/m,
      `\ndef appId = System.getenv("GRADLE_APP_IDENTIFIER") ?: 'com.${this.answers.lowerCaseProjectName}.debug'\ndef appName = System.getenv("GRADLE_APP_NAME") ?: '${this.answers.appName} Debug'\n\nandroid {\n`
    );
    // Add the appName var
    config = config.replace(
      /(buildTypes {)(\s*release {\n)/m,
      '$1\n        debug {\n            resValue "string", "app_name", appName\n        }$2            resValue "string", "app_name", appName\n'
    );
    // Output the file
    this.fs.write(this.destinationPath('android/app/build.gradle'), config);
  }

  _activateManualSigning() {
    let config = this.fs.read(this.destinationPath(`ios/${this.answers.projectName}.xcodeproj/project.pbxproj`));

    // Manual signing
    config = config.replace(
      /(TargetAttributes = {(?:\n.*)+?TestTargetID = )(.+?)(;\n.*\n)(.+)/m,
      '$1$2$3          $2 = {\n            ProvisioningStyle = Manual;\n          };\n$4'
    );

    // Distribution code signing Release
    config = config.replace(
      /(Release.*(?:\n.+){3}ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;)/m,
      '$1\n        CODE_SIGN_IDENTITY = "iPhone Distribution";\n        DEVELOPMENT_TEAM = "";'
    );

    // Developer code signing Debug
    config = config.replace(
      /(Debug.*(?:\n.+){3}ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;)/m,
      '$1\n        CODE_SIGN_IDENTITY = "iPhone Developer";\n        DEVELOPMENT_TEAM = "";'
    );

    this.fs.write(this.destinationPath(`ios/${this.answers.projectName}.xcodeproj/project.pbxproj`), config);
  }

  _createKeystore() {
    const path = `android/app/${this.answers.lowerCaseProjectName}.keystore`;
    if (!this.fs.exists(this.destinationPath(path))) {
      this.spawnCommand('keytool', [
        '-genkey',
        '-v',
        '-dname', `OU=${this.answers.companyName}`,
        '-keystore', path,
        '-alias', this.answers.lowerCaseProjectName,
        '-keyalg', 'RSA',
        '-keysize', '2048',
        '-validity', '10000',
        '-storepass', this.answers.keystorePassword,
        '-keypass', this.answers.keystorePassword,
      ]);
    }
  }

  end() {
    this.config.set('fastlane', true);
    this.config.save();
  }
}

module.exports = FastlaneGenerator;

const Base = require('yeoman-generator');

class FastlaneGenerator extends Base {
  initializing() {
    this.composeWith('rn-toolbox:checkversion');
  }

  prompting() {
    const config = this.fs.readJSON(this.destinationPath('package.json'));
    return this.prompt([{
      type: 'input',
      name: 'projectName',
      message: 'Please confirm the project name',
      default: config.name,
    }, {
      type    : 'confirm',
      name    : 'commitKeystore',
      message : 'Commit keystore files?',
      default : true,
    }]).then((answers) => {
      this.answers = answers;
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

  install() {
    this.spawnCommand('bundle', ['install'], {
      cwd: this.destinationPath(),
    });
  }

  _extendGitignore() {
    let content = this.fs.read(this.destinationPath('.gitignore'));
    if (this.answers.commitKeystore) {
      content = content.replace('*.keystore', '');
    }

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
      'ProvisioningStyle = Automatic;',
      'ProvisioningStyle = Manual;'
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

  end() {
    this.config.set('fastlane', true);
    this.config.save();
  }
}

module.exports = FastlaneGenerator;

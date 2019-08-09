const Base = require('yeoman-generator');
require('colors');
const analytics = require('../../analytics');

class FastlaneGenerator extends Base {
  initializing() {
    analytics.pageview('/fastlane-setup').send();
    this.composeWith('rn-toolbox:checkversion');
  }

  prompting() {
    const config = this.fs.readJSON(this.destinationPath('package.json'));
    return this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Please confirm the project name',
        default: config.name,
      },
      {
        type: 'confirm',
        name: 'commitKeystore',
        message: 'Commit keystore files?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'useSecretsArchive',
        message:
          'Would you like to use an encrypted archive to store secret files and keys?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'useDeploymentScript',
        message: 'Would you like to use a deployment script?',
        default: true,
      },
    ]).then(answers => {
      this.answers = answers;
      this.answers.lowerCaseProjectName = answers.projectName.toLowerCase();
      if (answers.useSecretsArchive && answers.useDeploymentScript) {
        this.config.set('circleci-ready', true);
        this.config.save();
      }
    });
  }

  writing() {
    const config = this.fs.readJSON(this.destinationPath('package.json'));
    this.fs.copyTpl(
      this.templatePath('fastlane/*'),
      this.destinationPath('fastlane')
    );
    this.fs.copyTpl(
      this.templatePath('env'),
      this.destinationPath('fastlane/.env')
    );
    this.fs.copyTpl(
      this.templatePath('environment/*'),
      this.destinationPath('src/environment')
    );
    this.fs.copyTpl(
      this.templatePath('Gemfile'),
      this.destinationPath('Gemfile')
    );
    this.fs.copyTpl(
      this.templatePath('strings.xml'),
      this.destinationPath('android/app/src/main/res/values/strings.xml')
    );

    if (this.answers.useSecretsArchive) {
      this.fs.copyTpl(
        this.templatePath('secrets-scripts/pack-secrets.sh'),
        this.destinationPath(`secrets-scripts/pack-secrets.sh`),
        this.answers
      );
      this.fs.copyTpl(
        this.templatePath('secrets-scripts/unpack-secrets.sh'),
        this.destinationPath(`secrets-scripts/unpack-secrets.sh`),
        this.answers
      );
      config.scripts['pack-secrets'] = './secrets-scripts/pack-secrets.sh';
      config.scripts['unpack-secrets'] = './secrets-scripts/unpack-secrets.sh';
    }

    if (this.answers.useDeploymentScript) {
      this.fs.copyTpl(
        this.templatePath('deploy.sh'),
        this.destinationPath('deploy.sh')
      );
      config.scripts.deploy = './deploy.sh';
    }

    this.fs.writeJSON(this.destinationPath('package.json'), config, 'utf-8');

    this._extendGitignore();
    this._extendGradle();
    this._activateManualSigning();
  }

  install() {
    const bundling = this.spawnCommand('bundle', ['install'], {
      cwd: this.destinationPath(),
    });

    bundling.on('error', () => {
      this.log.error(
        'Unable to run bundle install step. Please make sure you have bundler installed (gem install bundler)'
          .bgRed.white.bold
      );
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
    // Add the release signingConfig
    config = config.replace(
      /(buildTypes {\n\s*release {(?:\n.*)+?)(\n\s*})/m,
      '$1\n            signingConfig signingConfigs.release$2'
    );
    // Add the signingConfig
    const gradleSigningTemplate = this.fs.read(
      this.templatePath('gradleSigning')
    );
    config = config.replace(
      /(})(\n\s*buildTypes)/m,
      `$1\n${gradleSigningTemplate}$2`
    );
    // Add the appName var
    config = config.replace(
      /(buildTypes {)(\s*release {\n)/m,
      '$1\n        debug {\n            resValue "string", "app_name", appName\n        }$2            resValue "string", "app_name", appName\n'
    );
    // Change the app id
    config = config.replace(
      /applicationId ".*"/,
      'applicationId _applicationId'
    );
    // Replace the versionCode
    config = config.replace(/versionCode .*/, 'versionCode _versionCode');
    // Replace the versionName
    config = config.replace(/versionName .*/, 'versionName _versionName');
    // Add the default params
    config = config.replace(
      /\nandroid {\n/m,
      `\ndef _applicationId = System.getenv("GRADLE_APP_IDENTIFIER") ?: 'com.${
        this.answers.lowerCaseProjectName
      }.debug'\ndef appName = System.getenv("GRADLE_APP_NAME") ?: '${
        this.answers.projectName
      } debug'\ndef _versionCode = (System.getenv("ANDROID_VERSION_CODE") ?: "1") as Integer\ndef _versionName = System.getenv("ANDROID_VERSION_NAME") ?: "1.0.0"\n\nandroid {\n`
    );
    // Output the file
    this.fs.write(this.destinationPath('android/app/build.gradle'), config);
  }

  _activateManualSigning() {
    let config = this.fs.read(
      this.destinationPath(
        `ios/${this.answers.projectName}.xcodeproj/project.pbxproj`
      )
    );

    // Manual signing
    config = config.replace(
      /ProvisioningStyle = Automatic;/g,
      'ProvisioningStyle = Manual;'
    );
    config = config.replace(
      /(TargetAttributes = {(?:\n.*?)+?TestTargetID = )(.+?)(;\n.*\n)(.+)/m,
      '$1$2$3          $2 = {\n            ProvisioningStyle = Manual;\n          };\n$4'
    );

    // Distribution code signing Release
    config = config.replace(
      /(Release.*(?:\n.+){3}ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;)/m,
      '$1\n        CODE_SIGN_IDENTITY = "iPhone Distribution";\n        "CODE_SIGN_IDENTITY[sdk=iphoneos*]" = "iPhone Distribution";\n        DEVELOPMENT_TEAM = "";'
    );

    // Developer code signing Debug
    config = config.replace(
      /(Debug.*(?:\n.+){3}ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;)/m,
      '$1\n        CODE_SIGN_IDENTITY = "iPhone Developer";\n        "CODE_SIGN_IDENTITY[sdk=iphoneos*]" = "iPhone Developer";\n        DEVELOPMENT_TEAM = "";'
    );

    this.fs.write(
      this.destinationPath(
        `ios/${this.answers.projectName}.xcodeproj/project.pbxproj`
      ),
      config
    );
  }

  end() {
    this.config.set('fastlane', true);
    this.config.save();
  }
}

module.exports = FastlaneGenerator;

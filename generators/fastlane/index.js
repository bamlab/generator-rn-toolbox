var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  prompting: function() {
    return this.prompt([{
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
      name    : 'appName',
      message : 'Your react native app directory name',
      default : 'example',
    },
    {
      type    : 'input',
      name    : 'matchGit',
      message : 'Your git repo for match',
      default : '',
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
      message : 'A valid HockeyApp token'
    }]).then(function (answers) {
      this.answers = answers;
      this.answers.lowerCaseAppName = answers.appName.toLowerCase();
    }.bind(this));
  },
  install: function () {
    this._createKeystore();
    // this.spawnCommand('bundle install'); TO BE FIXED
  },
  writing: function () {
    this.fs.copyTpl(
      this.templatePath('.env.dist'),
      this.destinationPath('fastlane/.env.dist'),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('.env'),
      this.destinationPath('fastlane/.env'),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('.env.staging'),
      this.destinationPath('fastlane/.env.staging'),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('.env.prod'),
      this.destinationPath('fastlane/.env.prod'),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('Fastfile'),
      this.destinationPath('fastlane/Fastfile')
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
  },
  _extendGitignore: function() {
    var content = this.fs.read(this.destinationPath('.gitignore'))
    this.fs.copyTpl(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore'),
      { content: content }
    );
  },
  _extendGradle: function() {
    var config = this.fs.read(this.destinationPath('android/app/build.gradle'));
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
    var gradleSigningTemplate = this.fs.read(this.templatePath('gradleSigning'));
    config = config.replace(
      /(})(\n\s*buildTypes)/m,
      "$1\n" + gradleSigningTemplate + "$2"
    );
    // Add the default params
    config = config.replace(
      /\nandroid {\n/m,
      "\ndef appId = System.getenv(\"GRADLE_APP_IDENTIFIER\") ?: 'com." + this.answers.lowerCaseAppName + ".debug'\ndef appName = System.getenv(\"GRADLE_APP_NAME\") ?: '" + this.answers.appName + " Debug'\n\nandroid {\n"
    );
    // Add the appName var
    config = config.replace(
      /(buildTypes {)(\s*release {\n)/m,
      '$1\n        debug {\n            resValue "string", "app_name", appName\n        }$2            resValue "string", "app_name", appName\n'
    );
    // Output the file
    this.fs.write(this.destinationPath('android/app/build.gradle'), config);
  },
  _createKeystore: function() {
    var path = 'android/app/' + this.answers.lowerCaseAppName + '.keystore';
    if(!this.fs.exists(this.destinationPath(path))) {
      this.spawnCommand('keytool', [
        '-genkey',
        '-v',
        '-dname', 'OU=BAM',
        '-keystore', path,
        '-alias', this.answers.lowerCaseAppName,
        '-keyalg', 'RSA',
        '-keysize', '2048',
        '-validity', '10000',
        '-storepass', this.answers.keystorePassword,
        '-keypass', this.answers.keystorePassword,
      ]);
    }
  },
});

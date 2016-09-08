var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  prompting: function() {
    return this.prompt([{
      type    : 'input',
      name    : 'appId',
      message : 'Your app id',
      default : 'tech.bam.example.staging',
    },
    {
      type    : 'input',
      name    : 'appName',
      message : 'Your react native app directory name',
      default : 'example',
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
      this.log('app id', answers.appId);
      this.answers = answers;
      this.answers.lowerCaseAppName = answers.appName.toLowerCase();
      this.log('HockeyApp token', answers.hockeyAppToken);
    }.bind(this));
  },
  install: function () {
    this._createKeystore();
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
      this.templatePath('Fastfile'),
      this.destinationPath('fastlane/Fastfile')
    );
    this.fs.copyTpl(
      this.templatePath('Gymfile'),
      this.destinationPath('fastlane/Gymfile'),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('Matchfile'),
      this.destinationPath('fastlane/Matchfile')
    );
    this.fs.copyTpl(
      this.templatePath('Appfile'),
      this.destinationPath('fastlane/Appfile')
    );
    this._extendGitignore();
    this._extendGradle();
  },
  _extendGitignore: function() {
    var content = this.fs.read(this.destinationPath('.gitignore'))
    this.fs.copyTpl(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore'),
      { content: content }
    );
  },
  _extendGradle: function() {
    var config = this.fs.read(this.destinationPath('android/app/build.gradle'));
    // Change the app id
    config = config.replace(/applicationId ".*"/, 'applicationId "testinf.bam"');
    // Add the release signingConfig
    config = config.replace(/(buildTypes {\n\s*release {(?:\n.*)+?)(\n\s*})/m, '$1\n            signingConfig signingConfigs.release$2');
    // Add the signingConfig
    var gradleSigningTemplate = this.fs.read(this.templatePath('gradleSigning'));
    config = config.replace(/(})(\n\s*buildTypes)/m, "$1\n" + gradleSigningTemplate + "$2");
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

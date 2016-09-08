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
  writing: {
    copy: function () {
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
      this.fs.copyTpl(
        this.templatePath('build.gradle'),
        this.destinationPath('android/app/build.gradle')
      );
    },
    extendGitignore: function() {
      var content = this.fs.read(this.destinationPath('.gitignore'))
      this.fs.copyTpl(
        this.templatePath('.gitignore'),
        this.destinationPath('.gitignore'),
        { content: content }
      );
    },
    createKeystore: function() {
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
  },
});

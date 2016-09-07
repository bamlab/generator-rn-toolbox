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
      name    : 'hockeyAppToken',
      message : 'A valid HockeyApp token'
    }]).then(function (answers) {
      this.log('app id', answers.appId);
      this.answers = answers;
      this.log('HockeyApp token', answers.hockeyAppToken);
    }.bind(this));
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
  }
});

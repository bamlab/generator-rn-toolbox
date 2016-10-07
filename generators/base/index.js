var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  prompting: function() {
    return this.prompt([{
      type    : 'input',
      name    : 'appName',
      message : 'Your react native app directory name',
      default : 'example',
    }]).then(function (answers) {
      this.answers = answers;
    }.bind(this));
  },
  install: function () {
    this.npmInstall([
      'react-native-router-flux',
    ], { saveExact: true });
  },
  writing: function () {
    this.fs.copyTpl(
      this.templatePath('**/*.js'),
      this.destinationPath(''),
      this.answers
    );
    this.fs.copy(
      this.templatePath('src/assets/*'),
      this.destinationPath('src/assets')
    );
  },
});

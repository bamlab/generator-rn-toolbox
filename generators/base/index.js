const Base = require('yeoman-generator').Base;
var generators = require('yeoman-generator');

class BaseGenerator extends Base {
  prompting() {
    return this.prompt([{
      type    : 'input',
      name    : 'appName',
      message : 'Your react native app directory name',
      default : 'example',
    }]).then((answers) => {
      this.answers = answers;
    });
  }

  install() {
    this.npmInstall([
      'react-native-router-flux',
    ], { saveExact: true });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('**/*.js'),
      this.destinationPath(''),
      this.answers
    );
    this.fs.copy(
      this.templatePath('src/assets/*'),
      this.destinationPath('src/assets')
    );
  }
}

module.exports = BaseGenerator;

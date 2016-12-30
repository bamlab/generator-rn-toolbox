const Base = require('yeoman-generator').Base;
const yarnInstall = require('yarn-install');

class BaseGenerator extends Base {
  prompting() {
    const config = this.fs.readJSON(this.destinationPath('package.json'));
    return this.prompt([{
      type    : 'input',
      name    : 'appName',
      message : 'Your react native app directory name',
      default : config.name,
    }]).then((answers) => {
      this.answers = answers;
    });
  }

  install() {
    yarnInstall([
      'babel-preset-react-native-stage-0',
      '@exponent/ex-navigation',
    ], { cwd: this.destinationRoot() });
  }

  writing() {
    this.fs.delete(this.destinationPath('__tests__'));
    this.fs.copyTpl(
      this.templatePath('**/*.js'),
      this.destinationPath(''),
      this.answers
    );
    this.fs.copy(
      this.templatePath('src/assets/*'),
      this.destinationPath('src/assets')
    );
    this.fs.copyTpl(
      this.templatePath('babelrc'),
      this.destinationPath('.babelrc')
    );
  }

  end() {
    this.config.set('base', true);
    this.config.save();
  }
}

module.exports = BaseGenerator;

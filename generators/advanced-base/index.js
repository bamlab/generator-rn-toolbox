const Base = require('yeoman-generator');
const analytics = require('../../analytics');

class BaseGenerator extends Base {
  initializing() {
    analytics.pageview('/advanced-base').send();
    this.composeWith(require.resolve('../checkversion'));
  }

  prompting() {
    const config = this.fs.readJSON(this.destinationPath('package.json'));
    return this.prompt([
      {
        type: 'input',
        name: 'appName',
        message: 'Your react native app directory name',
        default: config.name,
      },
    ]).then(answers => {
      this.answers = answers;
    });
  }

  install() {
    this.yarnInstall(
      [
        'babel-preset-react-native-stage-0',
        'react-navigation',
        'react-native-vector-icons',
        'react-native-i18n',
      ],
      { cwd: this.destinationRoot() }
    ).then(() => {
      this.spawnCommand('react-native', ['link']);
    });
  }

  writing() {
    this.fs.delete(this.destinationPath('__tests__'));
    this.fs.delete(this.destinationPath('App.js'));
    this.fs.copyTpl(
      this.templatePath('**/*.js'),
      this.destinationPath(''),
      this.answers
    );
    this.fs.copy(this.templatePath('**/*.json'), this.destinationPath(''));
    this.fs.copy(this.templatePath('**/*.png'), this.destinationPath(''));
    this.fs.copy(this.templatePath('**/*.jpg'), this.destinationPath(''));
    this.fs.copyTpl(
      this.templatePath('babelrc'),
      this.destinationPath('.babelrc')
    );
  }

  end() {
    this.config.set('advanced-base', true);
    this.config.save();
  }
}

module.exports = BaseGenerator;

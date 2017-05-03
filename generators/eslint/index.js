const Base = require('yeoman-generator');

class ESLintGenerator extends Base {
  initializing() {
    this.composeWith('rn-toolbox:checkversion');
  }

  install() {
    this.yarnInstall([
      'babel-core@6.23.1',
      'babel-eslint@7.1.1',
      'babel-preset-react-native@1.9.1',
      'eslint@3.15.0',
      'eslint-config-airbnb@14.1.0',
      'eslint-plugin-import@2.2.0',
      'eslint-plugin-jsx-a11y@3.0.2',
      'eslint-plugin-react@6.10.0',
    ], {
      dev: true,
      cwd: this.destinationRoot(),
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('eslintrc'),
      this.destinationPath('.eslintrc')
    );
    this.fs.copyTpl(
      this.templatePath('eslintignore'),
      this.destinationPath('.eslintignore')
    );
    this.fs.extendJSON('package.json', {
      scripts: { 'test:lint': 'eslint . --quiet' },
    }, null, 2);
  }

  end() {
    this.config.set('eslint', true);
    this.config.save();
  }
}

module.exports = ESLintGenerator;

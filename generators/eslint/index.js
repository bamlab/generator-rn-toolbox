const Base = require('yeoman-generator').Base;
const yarnInstall = require('yarn-install');

class ESLintGenerator extends Base {
  install() {
    yarnInstall([
      'babel-core',
      'babel-eslint',
      'babel-preset-react-native',
      'eslint',
      'eslint-config-airbnb',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y@^3.0.2',
      'eslint-plugin-react',
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

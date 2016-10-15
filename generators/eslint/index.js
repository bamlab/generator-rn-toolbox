var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  install: function() {
    this.npmInstall([
      'babel-core',
      'babel-eslint',
      'babel-preset-react-native',
      'eslint',
      'eslint-config-airbnb',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react',
    ], { 'saveDev': true, 'saveExact': true });
  },

  writing: function() {
    this.fs.copyTpl(
      this.templatePath('.eslintrc'),
      this.destinationPath('.eslintrc')
    );
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc')
    );
    this.fs.copyTpl(
      this.templatePath('.eslintignore'),
      this.destinationPath('.eslintignore')
    );
    this.fs.extendJSON('package.json', {
      scripts: {
        lint: 'eslint . --quiet',
      }
    }, null, 2);
  },

  end: function() {
    this.config.set('eslint', true);
    this.config.save();
  }
});
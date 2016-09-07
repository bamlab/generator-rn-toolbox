var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  installEslint: function() {
    this.npmInstall([
      'babel-core',
      'babel-eslint',
      'eslint',
      'eslint-config-airbnb',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react',
    ], { 'saveDev': true, 'saveExact': true });
  },

  copyEslintTemplates: function() {
    this.fs.copyTpl(
      this.templatePath('.eslintrc'),
      this.destinationPath('.eslintrc')
    );
    this.fs.copyTpl(
      this.templatePath('.eslintignore'),
      this.destinationPath('.eslintignore')
    );
  }
});
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  installJest: function() {
    this.npmInstall([
      'jest-cli',
      'npm-run-all',
      'babel-jest',
    ], { 'saveDev': true, 'saveExact': true });
  },

  updatePackageJson: function() {
    this.fs.extendJSON('package.json', {
      scripts: {
        lint: 'eslint . --quiet',
        unit: 'jest',
        test: 'run-p -c lint unit',
      },
      jest: {
        moduleNameMapper: {
          '^[./a-zA-Z0-9$_-]+\\.(jpg|png|gif|eot|svg|ttf|woff|woff2|mp4|webm)$': '<rootDir>/jest/FileStub.js',
        },
      }
    }, null, 2)
  },

  copyStubs: function() {
    this.fs.copyTpl(
      this.templatePath('FileStub.js'),
      this.destinationPath('jest/FileStub.js')
    );
    this.fs.copyTpl(
      this.templatePath('firstTest.js'),
      this.destinationPath('__tests__/firstTest.js')
    );
  }
});
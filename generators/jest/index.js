const Base = require('yeoman-generator').Base;

class JestGenerator extends Base {
  writing() {
    this.fs.copyTpl(
      this.templatePath('FileStub.js'),
      this.destinationPath('jest/FileStub.js')
    );
    if (this.config.get('base')) {
      this.fs.copyTpl(
        this.templatePath('Button.js'),
        this.destinationPath('src/components/__tests__/Button.js')
      );
    } else {
      this.fs.copyTpl(
        this.templatePath('firstTest.js'),
        this.destinationPath('__tests__/firstTest.js')
      );
    }
    this.fs.extendJSON('package.json', {
      scripts: {
        unit: 'jest',
        test: `run-p -c unit${this.config.get('eslint') ? ' lint' : ''}`,
      },
      jest: {
        moduleNameMapper: {
          '^[./a-zA-Z0-9$_-]+\\.(jpg|png|gif|eot|svg|ttf|woff|woff2|mp4|webm)$': '<rootDir>/jest/FileStub.js',
        },
      }
    }, null, 2)
  }

  install() {
    this.npmInstall([
      'npm-run-all'
    ], { 'saveDev': true, 'saveExact': true });
  }

  end() {
    this.config.set('jest', true);
    this.config.save();
  }
};

module.exports = JestGenerator;

const Base = require('yeoman-generator');
const analytics = require('../../analytics');

class JestGenerator extends Base {
  initializing() {
    analytics.pageview('/jest').send();
    this.composeWith('rn-toolbox:checkversion');
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('FileStub.js'),
      this.destinationPath('jest/FileStub.js')
    );
    if (this.config.get('base')) {
      this.fs.copyTpl(
        this.templatePath('Button.test.js'),
        this.destinationPath('src/components/Button.test.js')
      );
    } else {
      this.fs.copyTpl(
        this.templatePath('firstTest.js'),
        this.destinationPath('__tests__/firstTest.js')
      );
    }
    this.fs.extendJSON(
      'package.json',
      {
        scripts: {
          'test:unit': 'jest',
          test: `${
            this.config.get('lint') ? 'npm run test:lint && ' : ''
          }npm run test:unit`,
        },
        jest: {
          moduleNameMapper: {
            '^[./a-zA-Z0-9$_-]+\\.(jpg|png|gif|eot|svg|ttf|woff|woff2|mp4|webm)$':
              '<rootDir>/jest/FileStub.js',
          },
        },
      },
      null,
      2
    );
  }

  end() {
    this.config.set('jest', true);
    this.config.save();
  }
}

module.exports = JestGenerator;

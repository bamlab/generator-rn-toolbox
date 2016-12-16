const Base = require('yeoman-generator').Base;

class BitriseGenerator extends Base {
  initializing() {
    if (!this.config.get('fastlane')) {
      this.log.error('You need to run `yo rn-toolbox:fastlane` first.');
    }
  }

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'reactNativeDirectory',
      message: 'Path to the react native project relative to the root of the repository',
      required: true,
      default: '.',
    }]).then((answers) => {
      this.answers = answers;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('bitrise.common.yml'),
      this.destinationPath('bitrise/bitrise.common.yml'),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('bitrise.android.yml'),
      this.destinationPath('bitrise/bitrise.android.yml'),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('bitrise.ios.yml'),
      this.destinationPath('bitrise/bitrise.ios.yml'),
      this.answers
    );
  }
}

module.exports = BitriseGenerator;

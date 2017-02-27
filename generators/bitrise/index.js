const Base = require('yeoman-generator');

class BitriseGenerator extends Base {
  initializing() {
    this.composeWith('rn-toolbox:checkversion');
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
      this.templatePath('bitrise.yml'),
      this.destinationPath('bitrise.yml'),
      this.answers
    );
  }
}

module.exports = BitriseGenerator;

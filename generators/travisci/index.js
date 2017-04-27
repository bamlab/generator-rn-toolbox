const Base = require('yeoman-generator');

class CircleGenerator extends Base {
  initializing() {
    // this.composeWith('rn-toolbox:checkversion');
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('travis.yml'),
      this.destinationPath('.travis.yml')
    );
  }

  end() {
    this.config.set('travis', true);
    this.config.save();
  }
}

module.exports = CircleGenerator;

const Base = require('yeoman-generator');
const analytics = require('../../analytics');

class CircleGenerator extends Base {
  initializing() {
    analytics.pageview('/travisci').send();
    this.composeWith('rn-toolbox:checkversion');
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

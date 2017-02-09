const { Base } = require('yeoman-generator');

class CircleGenerator extends Base {
  writing() {
    this.fs.copyTpl(
      this.templatePath('circle.yml'),
      this.destinationPath('circle.yml')
    );
  }

  end() {
    this.config.set('circle', true);
    this.config.save();
  }
}

module.exports = CircleGenerator;

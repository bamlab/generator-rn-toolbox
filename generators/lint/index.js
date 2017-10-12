const Base = require('yeoman-generator');

class LintGenerator extends Base {
  initializing() {
    this.composeWith('rn-toolbox:checkversion');
  }

  install() {
    this.yarnInstall([
      'prettier',
      'eslint',
      'eslint-config-universe',
    ], {
      dev: true,
      cwd: this.destinationRoot(),
    });

    this.spawnCommand('yarn', ['test:lint', '--', '--fix'], {
      cwd: this.destinationPath(),
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('eslintrc'),
      this.destinationPath('.eslintrc')
    );
    this.fs.copyTpl(
      this.templatePath('eslintignore'),
      this.destinationPath('.eslintignore')
    );
    this.fs.copyTpl(
      this.templatePath('prettierrc'),
      this.destinationPath('.prettierrc')
    );
    this.fs.extendJSON('package.json', {
      scripts: { 'test:lint': 'eslint . --quiet' },
    }, null, 2);
  }

  end() {
    this.config.set('lint', true);
    this.config.save();
  }
}

module.exports = LintGenerator;

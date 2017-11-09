const Base = require('yeoman-generator');

class CommitsGenerator extends Base {
  initializing() {
    this.composeWith('rn-toolbox:checkversion');
  }

  writing() {
    this.fs.extendJSON(
      'package.json',
      {
        scripts: {
          commitmsg: 'validate-commit-msg',
          commit: 'git-cz',
        },
        config: {
          commitizen: {
            path: './node_modules/cz-conventional-changelog',
          },
        },
      },
      null,
      2
    );
  }

  install() {
    this.yarnInstall(
      [
        'commitizen',
        'cz-conventional-changelog',
        'husky',
        'validate-commit-msg',
      ],
      {
        dev: true,
        cwd: this.destinationRoot(),
      }
    );
  }

  end() {
    this.config.set('commits', true);
    this.config.save();
  }
}

module.exports = CommitsGenerator;

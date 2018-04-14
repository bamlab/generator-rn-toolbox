const Base = require('yeoman-generator');
const path = require('path');
const fs = require('fs');

const generatorList = fs
  .readdirSync(path.join(__dirname, '..'))
  .filter(generatorName => generatorName !== 'app');

class BaseGenerator extends Base {
  prompting() {
    return this.prompt([
      {
        type: 'list',
        name: 'generator',
        message: 'which generator do you want to run',
        choices: generatorList,
      },
    ]).then(answers => {
      this.generator = answers.generator;
    });
  }

  main() {
    this.composeWith(
      `rn-toolbox:${this.generator}`,
      {},
      {
        local: require.resolve(path.join('..', this.generator)),
      }
    );
  }
}

module.exports = BaseGenerator;

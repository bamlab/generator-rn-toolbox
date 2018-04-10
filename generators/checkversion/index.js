const Base = require('yeoman-generator');
require('colors');
const checkVersion = require('./checkUpdate');

class CheckVersionGenerator extends Base {
  initializing() {
    return checkVersion()
      .then(isUpdated => {
        if (!isUpdated)
          this.log.error(
            "You do not have the latest version of this generator\nIt is recommended to update it using 'npm i -g generator-rn-toolbox'"
              .bgRed.white.bold
          );
      })
      .catch(() => {
        this.log.error(
          'Unable to check for updates please check your network'.bgRed.white
            .bold
        );
      });
  }
}

module.exports = CheckVersionGenerator;

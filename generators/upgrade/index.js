const Base = require('yeoman-generator');
const downloadFileSync = require('download-file-sync');
require('colors');
const versions = require('./versions.js');

const baseAppName = 'RnDiffApp';
const baseLowercaseAppName = 'rndiffapp';
const patchFileName = 'upgrade-rn.patch';
const patchTypes = {
  APPLY: 'git apply (prefered)',
  PATCH: 'patch',
};

class UpgradeGenerator extends Base {

  initializing() {
    this.conflicter.force = true;
    const config = this.fs.readJSON(this.destinationPath('package.json'));

    if (!config.dependencies || !config.dependencies['react-native']) {
      throw new Error('React Native dependency not detected');
    }

    const rnVersionId = config.dependencies['react-native'].replace(/[\^~]/g, '');
    const rnVersionIndex = versions.findIndex(version => (version.id === rnVersionId));

    if (rnVersionIndex === -1) {
      console.log(`Your React Native version (${rnVersionId}) is not compatible with this tool`.red);
      process.exit(1);
    }

    if (rnVersionIndex === versions.length - 1) {
      console.log('You already have the latest upgradable version'.red);
      process.exit(1);
    }

    const appName = config.name;

    this.data = {
      rnVersionId,
      rnNextVersion: versions[rnVersionIndex + 1],
      appName,
      lowercaseAppName: appName.toLowerCase(),
    };

    console.log(`Detected app name: ${this.data.appName} [${this.data.lowercaseAppName}]`.green.underline);
    console.log(`Found version ${this.data.rnVersionId} of react-native`.green);
    console.log(`Next version is ${this.data.rnNextVersion.id}`.green);
  }

  prompting() {
    return this.prompt([{
      type    : 'list',
      name    : 'patchType',
      message : 'Choose your merge method',
      choices : [patchTypes.APPLY, patchTypes.PATCH],
      default : patchTypes.APPLY,
    }]).then((answers) => {
      this.data.patchType = answers.patchType;
    });
  }

  writing() {
    // Patch file
    console.log('Generating patch file'.green);
    let content = downloadFileSync(`https://github.com/ncuillery/rn-diff/compare/rn-${this.data.rnVersionId}...rn-${this.data.rnNextVersion.id}.diff`);
    content = content.replace(new RegExp(baseAppName, 'g'), this.data.appName);
    content = content.replace(new RegExp(baseLowercaseAppName, 'g'), this.data.lowercaseAppName);
    this.fs.write(this.destinationPath(patchFileName), content);

    // package.json
    if (this.data.rnNextVersion.packageExtension) {
      this.fs.extendJSON('package.json', this.data.rnNextVersion.packageExtension);
    }
  }

  install() {
    console.log('Installing new react version'.green);
    this.spawnCommandSync('npm', ['install', ...this.data.rnNextVersion.npmList, '--save', '--save-exact']);

    console.log('Preparing 3way merge'.green);
    this.spawnCommandSync('git', ['remote', 'add', 'rn-diff', 'https://github.com/ncuillery/rn-diff.git']);
    this.spawnCommandSync('git', ['fetch', 'rn-diff'], { silent: true });

    console.log('Executing 3way merge'.green);
    if (this.data.patchType === patchTypes.APPLY) {
      this.spawnCommandSync('git', ['apply', patchFileName, '--exclude=package.json', '-p', '2', '--3way']);
    } else {
      this.spawnCommand('patch', ['-p2', '--forward', '<', patchFileName]);
    }
  }

  end() {
    console.log('Cleaning up...'.green);
    this.fs.delete(this.destinationPath(patchFileName));
    if (this.data.patchType === patchTypes.PATCH) {
      this.fs.delete(this.destinationPath('package.json.orig'));
      this.fs.delete(this.destinationPath('package.json.rej'));
    }
    this.spawnCommandSync('git', ['remote', 'rm', 'rn-diff']);
    console.log(`React Native ${this.data.rnNextVersion.id} installed`.green);
  }
}

module.exports = UpgradeGenerator;

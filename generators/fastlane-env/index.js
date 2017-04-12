const Base = require('yeoman-generator');
const randomString = require('randomstring');
require('colors');

const deploymentPlatforms = [{
  name: 'HockeyApp',
  value: 'hockeyapp',
}, {
  name: 'AppStore',
  value: 'appstore',
}];
const certificatesTypes = [{
  name: 'Adhoc',
  value: 'adhoc',
}, {
  name: 'In House (Enterprise only)',
  value: 'enterprise',
}];

class FastlaneEnvGenerator extends Base {
  initializing() {
    this.composeWith('rn-toolbox:checkversion');
    if (!this.config.get('fastlane')) {
      this.log.error('Running fastlane setup is required to use the environments. You can run it with yo rn-toolbox:fastlane-setup'.red.bold);
    }
  }

  prompting() {
    const config = this.fs.readJSON(this.destinationPath('package.json'));
    return this.prompt([{
      type: 'input',
      name: 'projectName',
      message: 'Please confirm the project name',
      default: config.name,
    }, {
      type: 'input',
      name: 'environmentName',
      message: 'The name for this new environment (lowercase, no space)',
      default: 'myenv',
    }, {
      type: 'input',
      name: 'repoGitBranch',
      message: 'The name of your repository Git branch for the environment just set',
      default: 'staging',
    }, {
      type: 'input',
      name: 'companyName',
      message: 'The name of the company which will be publishing this application',
      default: 'My Company',
    }, {
      type: 'input',
      name: 'appName',
      message: 'The app name for this environment',
      default: 'My App',
    }, {
      type: 'input',
      name: 'appId',
      message: 'The App Id for this environment',
      default: answers => `com.${answers.companyName.toLowerCase().replace(' ', '')}.${answers.projectName}.${answers.environmentName}`,
    }, {
      type: 'list',
      name: 'deploymentPlatform',
      message: 'Which platform will you use for deployment?',
      choices: deploymentPlatforms,
    }, {
      type: 'list',
      name: 'certificateType',
      message: 'The type of certificate you will be using',
      choices: certificatesTypes,
      when: answers => answers.deploymentPlatform === 'hockeyapp',
    }, {
      type    : 'input',
      name    : 'matchGit',
      message : 'Your git repo for match',
      default : 'git@github.com:mycompany/certificates.git',
    }, {
      type    : 'input',
      name    : 'matchBranch',
      message : 'The branch you want to use for match',
      default : 'master',
    }, {
      type    : 'input',
      name    : 'appleTeamId',
      message : 'The developer.apple.com team id for the certificates',
      default : 'XXXXXXXXXX',
    }, {
      type    : 'input',
      name    : 'itunesTeamName',
      message : 'The itunesconnect.apple.com team name',
      default : 'MyCompany',
      when: answers => answers.deploymentPlatform === 'appstore',
    }, {
      type    : 'input',
      name    : 'appleId',
      message : 'Your apple id',
      default : 'dev@mycompany.com',
    }, {
      type    : 'input',
      name    : 'keystorePassword',
      message : 'Your keystore password',
      default : randomString.generate(),
    }, {
      type    : 'input',
      name    : 'hockeyAppToken',
      message : 'A valid HockeyApp token',
      when: answers => answers.deploymentPlatform === 'hockeyapp',
    }]).then((answers) => {
      this.answers = answers;
      this.answers.lowerCaseProjectName = answers.projectName.toLowerCase();
      // Default certificateType to appstore if platform is appstore
      if (this.answers.deploymentPlatform === 'appstore') {
        this.answers.certificateType = 'appstore';
      }
    });
  }

  install() {
    this._createKeystore();
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('fastlane/env'),
      this.destinationPath(`fastlane/.env.${this.answers.environmentName}`),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('fastlane/env.secret'),
      this.destinationPath(`fastlane/.env.${this.answers.environmentName}.secret`),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('environment/index.js'),
      this.destinationPath(`environment/index.${this.answers.environmentName}.js`),
      this.answers
    );
  }

  _createKeystore() {
    const path = `android/app/${this.answers.lowerCaseProjectName}.${this.answers.environmentName}.keystore`;
    if (!this.fs.exists(this.destinationPath(path))) {
      this.spawnCommandSync('keytool', [
        '-genkey',
        '-v',
        '-dname', `OU=${this.answers.companyName}`,
        '-keystore', path,
        '-alias', this.answers.lowerCaseProjectName,
        '-keyalg', 'RSA',
        '-keysize', '2048',
        '-validity', '10000',
        '-storepass', this.answers.keystorePassword,
        '-keypass', this.answers.keystorePassword,
      ]);
    } else {
      this.log('Keystore already exists, skipping...'.yellow);
    }
  }

  end() {
    this.log('Environment has been created, please run'.green);
    this.log(`bundle exec fastlane ios setup --env=${this.answers.environmentName}`.green.bold);
    this.log('to create the provisioning profiles'.green);
  }
}

module.exports = FastlaneEnvGenerator;

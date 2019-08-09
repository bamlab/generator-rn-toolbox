const Base = require('yeoman-generator');
const randomString = require('randomstring');
const analytics = require('../../analytics');
require('colors');

const deploymentPlatforms = [
  { name: 'AppCenter', value: 'appcenter' },
  { name: 'AppStore', value: 'appstore' },
  { name: 'HockeyApp (deprecated)', value: 'hockeyapp' },
];
const certificatesTypes = [
  { name: 'Adhoc', value: 'adhoc' },
  { name: 'In House (Enterprise only)', value: 'enterprise' },
];
const cocoaPodsInstallCommands = [
  { commandName: 'sudo', args: ['gem', 'install', 'cocoapods'] },
  { commandName: 'pod', args: ['repo', 'update'], options: { cwd: 'ios' } },
];
const reactNativeLinkAppcenterCommands = [
  { commandName: 'react-native', args: ['link', 'appcenter'] },
  { commandName: 'react-native', args: ['link', 'appcenter-analytics'] },
  { commandName: 'react-native', args: ['link', 'appcenter-crashes'] },
];
const reactNativeLinkCodepushCommands = [
  { commandName: 'react-native', args: ['link', 'react-native-code-push'] },
];
const installAppCenterFastlanePluginCommands = [
  { commandName: 'fastlane', args: ['add_plugin', 'appcenter'] },
];
const installLoadJsonFastlanePluginCommands = [
  { commandName: 'fastlane', args: ['add_plugin', 'load_json'] },
];
const installNokogiriCommands = [
  { commandName: 'bundle', args: ['add', 'nokogiri'] },
];
const installGpgCommands = [{ commandName: 'brew', args: ['install', 'gpg'] }];

class FastlaneEnvGenerator extends Base {
  initializing() {
    analytics.pageview('/fastlane-env').send();
    this.composeWith('rn-toolbox:checkversion');
    if (!this.config.get('fastlane')) {
      this.log.error(
        'Running fastlane setup is required to use the environments. You can run it with yo rn-toolbox:fastlane-setup'
          .red.bold
      );
    }
  }

  prompting() {
    const config = this.fs.readJSON(this.destinationPath('package.json'));
    return this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message:
          'Please confirm the react-native project name (as in react-native-init <PROJECT_NAME>)',
        default: config.name,
      },
      {
        type: 'input',
        name: 'environmentName',
        message: 'The name for this new environment (lowercase, no space)',
        default: 'myenv',
      },
      {
        type: 'input',
        name: 'repoGitBranch',
        message:
          'The name of your repository Git branch for the environment just set',
        default: answers => answers.environmentName,
      },
      {
        type: 'input',
        name: 'companyName',
        message:
          'The name of the company which will be publishing this application (used to generate android Keystore)',
        default: 'My Company',
      },
      {
        type: 'list',
        name: 'deploymentPlatform',
        message: 'Which platform will you use for deployment?',
        choices: deploymentPlatforms,
      },
      {
        type: 'input',
        name: 'appName',
        message: 'The app name for this environment',
        default: 'My App',
      },
      {
        type: 'input',
        name: 'appId',
        message: 'The App Id for this environment',
        default: answers =>
          `com.${answers.companyName.toLowerCase().replace(' ', '')}.${
            answers.projectName
          }.${answers.environmentName}`,
      },
      {
        type: 'list',
        name: 'certificateType',
        message: 'The type of certificate you will be using',
        choices: certificatesTypes,
        when: answers =>
          ['hockeyapp', 'appcenter'].includes(answers.deploymentPlatform),
      },
      {
        type: 'input',
        name: 'matchGit',
        message: 'Your git repo for match',
        default: 'git@github.com:mycompany/certificates.git',
      },
      {
        type: 'input',
        name: 'matchBranch',
        message: 'The branch you want to use for match',
        default: 'master',
      },
      {
        type: 'input',
        name: 'appleTeamId',
        message: 'The developer.apple.com team id for the certificates',
        default: 'XXXXXXXXXX',
      },
      {
        type: 'input',
        name: 'itunesTeamName',
        message: 'The appstoreconnect.apple.com team name',
        default: 'MyCompany',
        when: answers => answers.deploymentPlatform === 'appstore',
      },
      {
        type: 'input',
        name: 'appstoreConnectAppleId',
        message:
          'An AppstoreConnect Apple Id (good practice: ID should have "developer" access - only allowed to upload builds). Can be entered later in fastlane/env.<environment>',
        when: answers => answers.deploymentPlatform === 'appstore',
      },
      {
        type: 'input',
        name: 'appleId',
        message:
          'Your apple id (should be admin on the Apple Developer Portal)',
        default: 'dev@mycompany.com',
      },
      {
        type: 'input',
        name: 'keystorePassword',
        message: 'Your keystore password',
        default: randomString.generate(),
        validate: input => {
          if (input.includes(' ')) return 'No whitespace allowed';
          return true;
        },
      },
      {
        type: 'input',
        name: 'hockeyAppToken',
        message: 'A valid HockeyApp token',
        when: answers => answers.deploymentPlatform === 'hockeyapp',
      },

      {
        type: 'input',
        name: 'androidPlayStoreJsonKeyPath',
        message:
          'A Google Play JSON Key relative path. Can be entered later in fastlane/env.<environment>',
        when: answers => answers.deploymentPlatform === 'appstore',
      },
      {
        type: 'confirm',
        name: 'useCodePush',
        message: 'Will you deploy with Appcenter CodePush on this environment?',
      },
      {
        type: 'input',
        name: 'appCenterUsername',
        message: 'A valid App Center Username',
        when: answers =>
          answers.deploymentPlatform === 'appcenter' || answers.useCodePush,
      },
      {
        type: 'input',
        name: 'appCenterToken',
        message: 'A valid App Center API token',
        when: answers =>
          answers.deploymentPlatform === 'appcenter' || answers.useCodePush,
      },
      {
        type: 'input',
        name: 'iosAppCenterId',
        message:
          'The iOS project id on AppCenter for this environment, should be different than Android and not contain spaces',
        default: answers =>
          `${answers.appName.replace(/ /g, '')}-ios-${answers.environmentName}`,
        when: answers =>
          answers.deploymentPlatform === 'appcenter' || answers.useCodePush,
      },
      {
        type: 'input',
        name: 'androidAppCenterId',
        message:
          'The Android project id on AppCenter for this environment, should be different than iOS and not contain spaces',
        default: answers =>
          `${answers.appName.replace(/ /g, '')}-android-${
            answers.environmentName
          }`,
        when: answers =>
          answers.deploymentPlatform === 'appcenter' || answers.useCodePush,
      },
      {
        type: 'input',
        name: 'iosCodePushDeploymentKey',
        message:
          "Your iOS CodePush deployment key (can be entered later in fastlane/env.<environment>.secret if the App and Deployments don't exist yet in Appcenter)",
        when: answers => answers.useCodePush,
      },
      {
        type: 'input',
        name: 'androidCodePushDeploymentKey',
        message:
          "Your Android CodePush deployment key (can be entered later in fastlane/env.<environment>.secret if the App and Deployments don't exist yet in Appcenter)",
        when: answers => answers.useCodePush,
      },
      {
        type: 'input',
        name: 'iosCodePushDeploymentName',
        message:
          "Your iOS CodePush deployment name (can be entered later in fastlane/env.<environment> if the App and Deployments don't exist yet in Appcenter)",
        when: answers => answers.useCodePush,
      },
      {
        type: 'input',
        name: 'androidCodePushDeploymentName',
        message:
          "Your Android CodePush deployment name (can be entered later in fastlane/env.<environment> if the App and Deployments don't exist yet in Appcenter)",
        when: answers => answers.useCodePush,
      },
      {
        type: 'confirm',
        name: 'useAppcenterSDK',
        message:
          'Will you be using Appcenter Analytics and Crash reporting on this environment?',
      },
      {
        type: 'input',
        name: 'iosAppcenterAppSecret',
        message:
          "Your AppCenter app secret for the ios App (can be entered later in fastlane/env.<environment> if the App doesn't exist yet in Appcenter)",
        when: answers => answers.useAppcenterSDK,
      },
      {
        type: 'input',
        name: 'androidAppcenterAppSecret',
        message:
          "Your AppCenter app secret for the Android App (can be entered later in fastlane/env.<environment> if the app doesn't exist yet in Appcenter)",
        when: answers => answers.useAppcenterSDK,
      },
    ]).then(answers => {
      this.answers = answers;
      this.answers.lowerCaseProjectName = answers.projectName.toLowerCase();
      // Default certificateType to appstore if platform is appstore
      if (this.answers.deploymentPlatform === 'appstore') {
        this.answers.certificateType = 'appstore';
      }
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('fastlane/env'),
      this.destinationPath(`fastlane/.env.${this.answers.environmentName}`),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('fastlane/env.secret'),
      this.destinationPath(
        `fastlane/.env.${this.answers.environmentName}.secret`
      ),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath('environment/index.js'),
      this.destinationPath(
        `src/environment/index.${this.answers.environmentName}.js`
      ),
      this.answers
    );
  }

  install() {
    // Create Keystore file
    this._createKeystore();

    // Install AppCenter Fastlane Plugin
    if (this.answers.deploymentPlatform === 'appcenter') {
      this._runInstallCommandsWithErrorMessages(
        installAppCenterFastlanePluginCommands,
        'the App Center Fastlane plugin',
        'fastlane add_plugin appcenter'
      );
    }

    // Install CodePush npm library
    if (this.answers.useCodePush) {
      this.yarnInstall(['react-native-code-push'], {
        cwd: this.destinationRoot(),
      });
      this._runInstallCommandsWithErrorMessages(
        installNokogiriCommands,
        'Nokogiri (xml manipulation)',
        'bundle add nokogiri'
      );
      this.log(
        'Appcenter CodePush configuration was added to your project for this environment.'
      );
    }

    // Install App Center npm libraries
    if (this.answers.useAppcenterSDK) {
      this.yarnInstall(
        ['appcenter', 'appcenter-analytics', 'appcenter-crashes'],
        { cwd: this.destinationRoot() }
      );
      this._runInstallCommandsWithErrorMessages(
        installLoadJsonFastlanePluginCommands,
        'the load_json Fastlane plugin',
        'fastlane add_plugin load_json'
      );
      this.log(
        'Appcenter Analytics and Crash reporting configuration were added to your project for this environment.'
      );
    }

    // Install gpg if secrets archive is needed
    if (this.answers.useSecretsArchive) {
      this._runInstallCommandsWithErrorMessages(
        installGpgCommands,
        'gpg',
        'brew install gpg'
      );
      this.log('GPG was added in order to encrypt the secrets archive.');
    }
  }

  end() {
    this._reactNativeLinkDependencies();
    if (this.answers.useCodePush) {
      this.log(
        'CodePush has been linked but you might need to remove it from PodFile and link the binary manually in Xcode for it to work properly on iOS (see CodePush docs).'
          .magenta.bold
      );
      this.log(
        'CodePush config has been added but you still need to wrap your js entry point with the library + config (see CodePush docs).'
          .green.bold
      );
    }
    this.log('Environment has been created, please run'.green);
    this.log(
      `bundle exec fastlane ios setup --env=${this.answers.environmentName}`
        .green.bold
    );
    this.log('to create the provisioning profiles'.green);
  }

  _reactNativeLinkDependencies() {
    // Link AppCenter CodePush
    if (this.answers.useCodePush) {
      this.log(
        'Linking AppCenter CodePush for you...\nPLEASE LEAVE THE KEY FIELDS BLANK.'
          .magenta.bold
      );
      this._runInstallCommandsWithErrorMessages(
        reactNativeLinkCodepushCommands,
        'AppCenter CodePush',
        'react-native link react-native-code-push'
      );
    }

    if (this.answers.useAppcenterSDK) {
      this.log('Installing CocoaPods (please provide sudo password)...');
      this._runInstallCommandsWithErrorMessages(
        cocoaPodsInstallCommands,
        'CocoaPods',
        'sudo gem install cocoapods && cd ios && pod init && pod repo update.'
      );
    }

    // Link AppCenter SDK
    if (this.answers.useAppcenterSDK) {
      this.log(
        'Linking AppCenter SDK for you...\nPLEASE LEAVE THE "SECRETS" FIELDS BLANK.'
          .magenta.bold
      );
      this._runInstallCommandsWithErrorMessages(
        reactNativeLinkAppcenterCommands,
        'AppCenter SDK libraries',
        'react-native link appcenter && react-native link appcenter-analytics && react-native link appcenter-crashes'
      );
    }
  }

  _runInstallCommandsWithErrorMessages(
    commands,
    library,
    manualInstallationCommand
  ) {
    const results = commands.map(command =>
      this.spawnCommandSync(
        command.commandName,
        command.args || [],
        command.options || {}
      )
    );
    for (let i = 0; i < results.length; i += 1) {
      if (results[i].error) {
        this.log(
          `Configuration went well but there was an error while installing ${library}. Please install it manually with \`${manualInstallationCommand}\`. Then rerun the generator.`
            .red.bold
        );
        throw results[i].error;
      }
      break;
    }
  }

  _createKeystore() {
    const path = `android/app/${this.answers.lowerCaseProjectName}.${
      this.answers.environmentName
    }.keystore`;
    if (!this.fs.exists(this.destinationPath(path))) {
      this.spawnCommandSync('keytool', [
        '-genkey',
        '-v',
        '-dname',
        `OU=${this.answers.companyName}`,
        '-keystore',
        path,
        '-alias',
        this.answers.lowerCaseProjectName,
        '-keyalg',
        'RSA',
        '-keysize',
        '2048',
        '-validity',
        '10000',
        '-storepass',
        this.answers.keystorePassword,
        '-keypass',
        this.answers.keystorePassword,
      ]);
    } else {
      this.log('Keystore already exists, skipping...'.yellow);
    }
  }
}

module.exports = FastlaneEnvGenerator;

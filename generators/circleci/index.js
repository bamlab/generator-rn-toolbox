const Base = require('yeoman-generator');
require('colors');
const glob = require('glob');
const analytics = require('../../analytics');

// Command creators
const getPassphraseAliasForEnvironment = environment =>
  `${environment.envName.toUpperCase()}_SECRETS_PASSPHRASE`;
const getUnpackCommandForEnvironment = environment =>
  `sudo yarn unpack-secrets -e ${
    environment.envName
  } -p \${${getPassphraseAliasForEnvironment(environment)}}`;
const getCodePushCommandForEnvironment = environment =>
  `yarn deploy -t soft -e ${environment.envName}`;
const getAndroidHardDeployCommandForEnvironment = environment =>
  `yarn deploy -t hard -o android -e ${environment.envName}`;
const getIosHardDeployCommandForEnvironment = environment =>
  `yarn deploy -t hard -o ios -e ${environment.envName}`;

class CircleGenerator extends Base {
  initializing() {
    analytics.pageview('/circleci').send();
    this.composeWith('rn-toolbox:checkversion');
    if (!this.config.get('fastlane'))
      this.log.error(
        'You need to run `yo rn-toolbox:fastlane` first.'.red.bold
      );

    if (!this.config.get('circleci-ready'))
      this.log.error(
        'You need to have the deployment script and secrets archive from fastlane-setup to use this generator. Get them by running yo rn-toolbox:fastlane-setup.'
          .red.bold
      );
  }

  prompting() {
    const config = this.fs.readJSON(this.destinationPath('package.json'));
    const envFilepaths = glob.sync('fastlane/.env.*', {
      ignore: 'fastlane/.env.*.*',
    });
    const environments = envFilepaths.map(filePath => {
      const split = filePath.split('/');
      const envName = split[split.length - 1].split('.')[2];
      const fileString = this.fs.read(filePath);
      const envGitBranch = fileString
        .split("REPO_GIT_BRANCH='")[1]
        .split("'")[0];
      return {
        envName,
        envGitBranch,
      };
    });
    if (environments.length === 0)
      this.log.error(
        'You need at least one environment setup with fastlane-env to run this generator. Run yo rn-toolbox:fastlane-env.'
          .red.bold
      );

    const prompts = [
      {
        type: 'input',
        name: 'projectName',
        message:
          'Please confirm the react-native project name (as in react-native-init <PROJECT_NAME>)',
        required: true,
        default: config.name,
      },
      {
        type: 'input',
        name: 'reactNativeDirectory',
        message:
          'Path to the React Native project relative to the root of the repository (no trailing slash)',
        required: true,
        default: '.',
      },
    ];

    return this.prompt(prompts).then(answers => {
      this.answers = answers;
      this.environments = environments;
    });
  }

  writing() {
    // Command creators
    const numberOfEnvironments = this.environments.length;
    const getPerEnvironmentCommand = commandGetter => {
      let switchString = '';
      this.environments.forEach((environment, index) => {
        const prefix = index === 0 ? 'if' : 'elif';
        const suffix = index === numberOfEnvironments - 1 ? 'fi' : '';
        if (index > 0) switchString += '';
        switchString += `${prefix} [ "\${CIRCLE_BRANCH}" == "${
          environment.envGitBranch
        }" ];
            then
              ${commandGetter(environment)}
            ${suffix}`;
      });
      return switchString;
    };
    const getForAllEnvironmentsCommand = command => {
      let ifStatement = `if [ "\${CIRCLE_BRANCH}" == "${
        this.environments[0].envGitBranch
      }" ]`;
      this.environments.slice(1).forEach(environment => {
        ifStatement += `|| [ "\${CIRCLE_BRANCH}" == "${environment.envName}" ]`;
      });
      ifStatement += ';';

      return `${ifStatement}
            then
              ${command}
            fi`;
    };

    // Commands
    const unpackSecretsCommand = getPerEnvironmentCommand(
      getUnpackCommandForEnvironment
    );
    const installAppcenterCommand = getForAllEnvironmentsCommand(`echo 'export PATH=$(yarn global bin):$PATH' >> $BASH_ENV
              source $BASH_ENV
              yarn global add appcenter-cli
              appcenter login --token \${FL_APPCENTER_API_TOKEN} --quiet`);
    const codepushCommand = getPerEnvironmentCommand(
      getCodePushCommandForEnvironment
    );
    const androidHardDeployCommand = getPerEnvironmentCommand(
      getAndroidHardDeployCommandForEnvironment
    );
    const iosHardDeployCommand = getPerEnvironmentCommand(
      getIosHardDeployCommandForEnvironment
    );
    let branchesOnlyCommand = '';
    this.environments.forEach(environment => {
      branchesOnlyCommand += `
                - ${environment.envGitBranch}`;
    });

    // Create final config.yml file  :-)
    this.fs.copyTpl(
      this.templatePath('config.yml'),
      this.destinationPath('.circleci/config.yml'),
      {
        ...this.answers,
        prefixRN: path => `${this.answers.reactNativeDirectory}/${path || ''}`,
        unpackSecretsCommand,
        installAppcenterCommand,
        codepushCommand,
        androidHardDeployCommand,
        iosHardDeployCommand,
        branchesOnlyCommand,
      }
    );
  }

  end() {
    this.log(
      `Custom config.yml created. Re-run yo rn-toolbox:circleci anytime to re-generate the file with latest environments information.`
        .green.bold
    );
    this.log(
      `Please make sure that CircleCI has access to your MATCH repo using 'Checkout ssh Keys' section in settings. Good practice: Github account should have readonly access and only to this repo.`
        .magenta.bold
    );
    this.log(
      `Please make sure that all of the following environment variables have been added in the Circle-CI console's Environment Variables section:`
        .magenta.bold
    );
    this.log(
      [
        'FL_APPCENTER_API_TOKEN',
        'MATCH_PASSWORD',
        'FASTLANE_PASSWORD (<- password of AppstoreConnect Apple ID)',
      ]
        .concat(this.environments.map(getPassphraseAliasForEnvironment))
        .join(', ').magenta.bold
    );
    this.config.set('circleci', true);
    this.config.save();
  }
}

module.exports = CircleGenerator;

#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
require('colors');
const path = require('path');
const spawn = require('cross-spawn');
const helpers = require('yeoman-test');

const appName = 'AdvancedTestApp';

function createProject() {
  console.log('## Creating project ##'.cyan);
  spawn.sync('react-native', ['init', appName], {
    cwd: __dirname,
    stdio: 'inherit',
  });
}

function installEslint() {
  console.log('## Installing Eslint ##'.cyan);
  return helpers
    .run(path.join(__dirname, 'generators/eslint'))
    .cd(path.join(__dirname, appName))
    .withOptions({ skipInstall: false })
    .toPromise();
}

function installBase() {
  console.log('## Installing Base Project ##'.cyan);
  return helpers
    .run(path.join(__dirname, 'generators/advanced-base'))
    .cd(path.join(__dirname, appName))
    .withOptions({ skipInstall: false })
    .withPrompts({ appName })
    .toPromise();
}

function installJest() {
  console.log('## Installing Jest ##'.cyan);
  return helpers
    .run(path.join(__dirname, 'generators/jest'))
    .cd(path.join(__dirname, appName))
    .withOptions({ skipInstall: false })
    .withPrompts({ appName })
    .toPromise();
}

function installFastlane() {
  console.log('## Installing Fastlane ##'.cyan);
  return helpers
    .run(path.join(__dirname, 'generators/fastlane'))
    .cd(path.join(__dirname, appName))
    .withOptions({ skipInstall: false })
    .withPrompts({
      companyName: 'BAM',
      appName,
      projectName: appName,
      stagingAppId: 'tech.bam.rntest.staging',
      prodAppId: 'tech.bam.rntest',
      matchGit: process.env.RN_MATCH_GIT,
      appleId: process.env.RN_APPLE_ID,
      stagingAppleTeamId: process.env.RN_STAGING_APPLE_TEAM_ID,
      prodAppleTeamId: process.env.RN_PROD_APPLE_TEAM_ID,
      itunesTeamId: process.env.RN_ITUNES_TEAM_ID,
      keystorePassword: 'TestTest',
      hockeyAppToken: process.env.RN_HOCKEY_APP_TOKEN,
    })
    .toPromise();
}

function installBitrise() {
  console.log('## Installing Bitrise ##'.cyan);
  return helpers
    .run(path.join(__dirname, 'generators/bitrise'))
    .cd(path.join(__dirname, appName))
    .withOptions({ skipInstall: false })
    .withPrompts({
      reactNativeDirectory: '.',
      androidProdAppId: 'tech.bam.rntest',
    })
    .toPromise();
}

function testProject() {
  console.log('## Testing Project ##'.cyan);
  spawn.sync('npm', ['test'], {
    cwd: path.join(__dirname, appName),
    stdio: 'inherit',
  });
}

createProject();
installBase().then(installJest).then(testProject);

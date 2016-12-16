# Bitrise setup for continuous deployment

:warning: ***Having set up Fastlane with `yo rn-toolbox:fastlane` is a requirement***

## 3 files?

After testing a single build for both platforms (`bitrise/bitrise.common.yml`) we were still disappointed with the deployment time. In order to obtain a faster build we decided on splitting the builds between iOS and Android.

Thus you will now find after running the generator 2 extra files `bitrise/bitrise.ios.yml` which should be run on an XCode 8 stack and `bitrise/bitrise.android.yml` which should be run on a linux stack.

This allows parallel builds and running the Android build on a Ubuntu stack is now faster as the Android SDK is preinstalled.

## 1/ Create new apps on Bitrise

### Setting up SSH

When asked *Do you need to use an additional private repository?*, select *I need to*.  
Add the ssh key to a Github account that has access to both your project repository and your match certificates repository.

We recommend creating a bot/machine Github account for this. [See here](https://developer.github.com/guides/managing-deploy-keys/#machine-users) for more info on *machine user*.

### Project build configuration

- Select *Other/Manual* and choose an XCode 8 stack for the iOS (or common) build.
- Select *Other/Manual* and choose an Android & Docker on Ubuntu stack for the Android build.

## 2/ Setup a deployment workflow

### Generate the bitrise.yml files

Run anywhere:
```
yo rn-toolbox:bitrise
```

This will generate `bitrise/bitrise.common.yml`, `bitrise/bitrise.ios.yml` and `bitrise/bitrise.android.yml` in your current folder.

You can copy-paste them in your Bitrise app workflow editor.

### Add secret environment variables

- You need to provide the following secret variables in order for the build to run successfuly
  - `MATCH_PASSWORD`
  - `GRADLE_KEYSTORE_PASSWORD` (Android only, found in the *.env* file)
  - `GRADLE_KEYSTORE_ALIAS_PASSWORD` (Android only, found in the *.env* file)
  - `FL_HOCKEY_API_TOKEN` (found in the *.env* file)

## 3/ Enjoy :balloon:

Sit back and relax, you can now enjoy your first deployment build!

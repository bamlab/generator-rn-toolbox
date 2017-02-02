# Bitrise setup for continuous deployment

:warning: ***Having set up Fastlane with `yo rn-toolbox:fastlane` is a requirement***

## 1/ Setup a deployment workflow

### Generate the bitrise.yml files

Run anywhere:
```
yo rn-toolbox:bitrise
```

This will generate `bitrise/bitrise.yml`.

Commit and push this bitrise.yml file.

## 2/ Create a new app on Bitrise

### Setting up SSH

When asked *Do you need to use an additional private repository?*, select *I need to*.  
Add the ssh key to a Github account that has access to both your project repository and your match certificates repository.

We recommend creating a bot/machine Github account for this. [See here](https://developer.github.com/guides/managing-deploy-keys/#machine-users) for more info on *machine user*.

### Project build configuration

- Select *Other/Manual* and choose a Xamarin XCode build.

### Add secret environment variables

- You need to provide the following secret variables in order for the build to run successfuly
  - `MATCH_PASSWORD`
  - `GRADLE_KEYSTORE_PASSWORD` (Android only, found in the *.env* file)
  - `GRADLE_KEYSTORE_ALIAS_PASSWORD` (Android only, found in the *.env* file)
  - `FL_HOCKEY_API_TOKEN` (found in the *.env* file)

## 3/ Enjoy :balloon:

Sit back and relax, you can now enjoy your first deployment build!

## Testing

This generator also contains a Test pipe but no trigger to run it. If you want you can add one but we strongly recommend using [TravisCI](../travisci/README.md) instead to run your tests.

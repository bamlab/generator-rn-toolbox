# Bitrise setup for continuous deployment

:warning: ***Having set up Fastlane with `yo rn-toolbox:fastlane-setup` is a requirement***

This will:
* upload your app to HockeyApp on every push to the `staging` branch
* upload your app to TestFlight and optionally Android Beta on every push to the `master` branch

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

- You need to provide the following secret variables in order for the build to run successfully
  - `MATCH_PASSWORD`
  - `GRADLE_KEYSTORE_PASSWORD` (Found in the *.env* file)
  - `GRADLE_KEYSTORE_ALIAS_PASSWORD` (Found in the *.env* file)
  - `FL_HOCKEY_API_TOKEN` (Found in the *.env* file)
  
### Setup Android Beta deployment

If you want to deploy to Android Beta:

1. head over to the [Google Play Developers Console](https://play.google.com/apps/publish)
2. go to Settings > API Access

If you already have a `Services accounts` section with an e-mail and a link to see the authorizations, 
skip to **9**. Else:

3. if needed, accept the terms and conditions
4. if needed, click the `Create a project` button
5. under `Services accounts`, click `Authorize access`
6. check :
  * Visibility
  * Edit store listing, pricing & distribution
  * Manage Production APKs
  * Manage Alpha & Beta APKs
  * Manage Alpha & Beta users
7. submit
8. come back to Settings > API Access
9. under `Services accounts`, click `Show in Google Developers Console`.
10. click `Create credentials` and `Service account key`.
11. select `Compute Engine default service account` and JSON
12. once you validate, your API key should be downloaded on your computer

Now that you have your API key:

13. head over to Bitrise, edit your workflow, and go to the `Code signing & Files` section
14. at the bottom of the page, click `Add another File`
15. select `Generic file`
16. enter the unique id `GOOGLE_KEY`
17. upload the JSON key
18. save the workflow

## 3/ Enjoy :balloon:

Sit back and relax, you can now enjoy your first deployment build!

## Testing

This generator also contains a Test pipe but no trigger to run it. If you want you can add one but we strongly recommend using [TravisCI](../travisci/README.md) instead to run your tests.

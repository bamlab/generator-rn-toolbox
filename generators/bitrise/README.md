# Bitrise setup for continuous deployment

:warning: ***Having set up Fastlane with `yo rn-toolbox:fastlane` is a requirement***

## 1/ Create a new app on Bitrise

### Setting up SSH

When asked *Do you need to use an additional private repository?*, select *I need to*.  
Add the ssh key to a Github account that has access to both your project repository and your match certificates repository.

We recommend creating a bot/machine Github account for this. [See here](https://developer.github.com/guides/managing-deploy-keys/#machine-users) for more info on *machine user*.

### Project build configuration

Select *Other/Manual* and choose an XCode 8 stack.

## 2/ Setup a deployment workflow

### Generate the bitrise.yml

Run anywhere:
```
yo rn-toolbox:bitrise
```

This will generate a `bitrise.yml` in your current folder.

You can copy-paste it in your Bitrise app workflow editor.

### Add secret environment variables

- You have to provide to Bitrise all the secret environment variables which are stored in your fastlane/.env file
- You also need to provide a `MATCH_PASSWORD` secret variable

## 3/ Enjoy :balloon:

Sit back and relax, you can now enjoy your first deployment build!

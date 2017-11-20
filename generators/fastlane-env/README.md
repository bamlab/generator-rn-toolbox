# Fastlane Environment Generator

## Usage

### 1. Create a new Environment
```
yo rn-toolbox:fastlane-env
```

### 2. Generate the provisioning profiles
```
bundle exec fastlane ios setup --env=<myenv>
```

### 3. AppStore Setup (Appstore Deployment only)

> :warning: AppStore deployment will require [app icons](../assets/README.md) to be setup

- Right now iTunes Connect automatic app creation has been disabled due to issues and will necessitate manual setup
  - Head to [iTunes Connect](https://itunesconnect.apple.com/)
  - Create a new app using the app id you provided

### 4. Visual Studio App Center Setup (AppCenter Deployment only)

App Center is the successor of HockeyApp.

- Create an account on mobile.azure.com
- Get your username at the bottom left of the welcome screen
- Follow the steps to get a working [API Token](https://docs.microsoft.com/en-us/appcenter/api-docs/)
- Choose `AppCenter` as deployment method in this generator

### 4. Deploy your app
***:warning: Automatic Play Store deployment is not yet available (PR welcome!)***
```
bundle exec fastlane ios deploy --env=<myenv>
bundle exec fastlane android deploy --env=<myenv>
```

## More

> ### Centralizing environment variables
> 
> You might want to share some environment variables accross multiple environments. In order to do so, simply create a `.env` file, remove the variable you want to share in all the environment files and add it in the `.env` one.
> 
> On setup, only version names are centralized in the `.env` file

> ### Adding a new device to the iOS provisioning profiles
>
> The `ios setup --env=<myenv>` task mentionned above has been setup to allow you to regenerate your certificates in case you add a new device. Just run it again to include the new devices.

## Troubleshooting

> ### **Setup or build error** *"Cloning GitHub repo"* takes too long:
>
> If you have never initiated connection with GitHub and it is not yet trusted. Enter `ssh -T git@github.com` and type 'yes' when you are asked if you trust Github.com

> ### **Build error** *"The provisioning profile doesn't match the bundle ID"*:
>
> PRODUCT_BUNDLE_IDENTIFIER is probably specified for release in your pbxproj file and fastlane can't override it. Delete the line from your pbxproj file.

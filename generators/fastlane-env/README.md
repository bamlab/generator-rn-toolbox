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
- AppStore deployment will require app icons to be setup
- Right now iTunes Connect automatic app creation has been disabled due to issues and will necessitate manual setup
  - Head to [iTunes Connect](https://itunesconnect.apple.com/)
  - Create a new app using the app id you provided

### 4. Deploy your app
***:warning: Automatic Play Store deployment is not yet available (PR welcome!)***
```
bundle exec fastlane ios deploy --env=<myenv>
bundle exec fastlane android deploy --env=<myenv>
```

## More

### Centralizing environment variables
You might want to share some environment variables accross multiple environments. In order to do so, simply create a `.env` file, remove the variable you want to share in all the environment files and add it in the `.env` one.

Example:
```
// .env
[Add] ANDROID_VERSION_NAME='1.0.0'

// .env.staging
[Remove] ANDROID_VERSION_NAME='1.0.0'

// .env.prod
[Remove] ANDROID_VERSION_NAME='1.0.0'
```

### Adding a new device to the iOS provisioning profiles
The `ios setup --env=<myenv>` task mentionned above has been setup to allow you to regenerate your certificates in case you add a new device. Just run it again to include the new devices.

## Troubleshooting

If 'Cloning GitHub repo' takes too long: the reason might be that you have never initiated connection with GitHub and it is not yet trusted. Enter `git clone git@github.com:bamlab/certificates.git` and type 'yes' when you are asked if you trust Github.com

# Assets setup

You need `imagemagick` installed to use this generator.

On a mac, you can install it with `brew`:
```
brew install imagemagick
```

## Generate icons
You'll need an image for your icon with a size of more than **192px** (psd is supported).

Then run:
```
yo rn-toolbox:assets --icon icon.png
```
Answer yes when asked about overwriting.

That's it! :balloon:  
Icons have been generated in different sizes and integrated in your project.

## Generate splashscreens

You'll need an image for your splash with a size of more than **2208** (psd is supported).

### iOS

In XCode, click on your target.  
Then, in the tab **general**,
- click on *Use Asset Catalog** and then **migrate**
- delete **LaunchScreen** in the input

![Xcode](https://raw.githubusercontent.com/bamlab/generator-rn-toolbox/master/generators/assets/xcode.png)

Then run:
```
yo rn-toolbox:assets --splash splash.psd --ios
```

You're all set! :dancer:

***IMPORTANT:*** You will need to uninstall the app from device/emulator first before seeing the changes.

## Android

:warning: The command is only generating splash assets for now on Android.

## Run the command only for a platform
You can select the platform you want to generate assets for. For instance:
```
yo rn-toolbox:assets --icon icon.png --android
yo rn-toolbox:assets --splash splash.psd --ios
```

## Hide Splashscreen from JS code

You can use [react-native-splash-screen](https://github.com/crazycodeboy/react-native-splash-screen) for iOS.

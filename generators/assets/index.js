const fs = require('fs');
const Base = require('yeoman-generator');
const imageGenerator = require('./imageGenerator');
const getPixelColor = require('./getPixelColor');
require('colors');

class ResourcesGenerator extends Base {
  constructor(...args) {
    super(...args);

    this.option('icon', {
      type: asset => asset,
      desc: 'Icon source',
    });
    this.option('alternativeIcon', {
      type: asset => asset,
      desc: 'Alternative icon source',
    });
    this.option('deleteAlternativeIcon', {
      type: asset => asset,
      desc: 'Delete Alternative icon',
    });
    this.option('splash', {
      type: asset => asset,
      desc: 'Splashscreen source',
    });
    this.option('android', {
      desc: 'Build for Android',
    });
    this.option('iOS', {
      desc: 'Build for iOS',
    });
    this.option('android-notification-icon', {
      type: asset => asset,
      desc: 'Notification icon source',
    });
    this.option('store', {
      desc: 'Generate Stores assets',
    });
    this.option('projectName', {
      type: asset => asset,
      desc: 'Name of your react-native project',
    });
    this.option('assetsOutputPath', {
      type: asset => asset,
      desc: 'Name of your react-native project',
      default: '.',
    });
    this.option('androidSrcDirectory', {
      type: asset => asset,
      desc: 'The directory under `src` to save the assets',
      default: 'main',
    });
    this.option('assetName', {
      type: asset => asset,
      desc: 'The name of the asset'
    });
  }

  initializing() {
    this.composeWith('rn-toolbox:checkversion');
  }

  prompting() {
    let prompts = []
    const config = this.fs.readJSON(this.destinationPath('package.json'));
    if (!config) {
      this.log.error(
        "Could not read 'package.json' from current directory. Are you inside a React Native project?"
          .red
      );
      process.exit(1);
    }
    if (!this.options.projectName)
      prompts.push({
        type: 'input',
        name: 'projectName',
        message: 'Name of your react-native project',
        required: true,
        default: config.name,
      })
    else
      this.projectName = this.options.projectName;
    if ((this.options.alternativeIcon || this.options.deleteAlternativeIcon) && (!this.options.assetName || this.options.assetName == "" || this.options.assetName == true))
      prompts.push({
        type: 'input',
        name: 'assetName',
        message: 'Name of your alternative icon',
        required: true,
        default: null,
      })

    if (prompts.length == 0) {
      return Promise.resolve();
    }
    else return this.prompt(prompts).then(answers => {
        if ((this.options.alternativeIcon || this.options.deleteAlternativeIcon) && !this.options.assetName && !answers.assetName) {
          this.log.error(
            "Alternative icon name required"
              .red
          );
          process.exit(1);
        }
        if (answers.projectName)
          this.projectName = answers.projectName
        else
          this.projectName = this.options.projectName
        if (answers.assetName)
          this.options.assetName = answers.assetName;
      });
  }

  writing() {
    this._checkOSToBuildFor();
    this._checkAssets();

    return Promise.all([
      this._setupIosIcons(),
      this._setupIosAlternativeIcons(),
      this._deleteIosAlternativeIcons(),
      this._setupAndroidIcons(),
      this._setupAndroidAlternativeIcons(),
      this._setupAndroidNotificationIcons(),
      this._deleteAndroidAlternativeIcons(),
      this._setupIosSplashScreen(),
      this._setupAndroidSplashScreen(),
      this._setupStoresAssets(),
    ]);
  }

  _checkOSToBuildFor() {
    this.android = this.options.android || !this.options.ios;
    this.ios = this.options.ios || !this.options.android;
  }

  _checkAssets() {
    this._checkAsset('icon');
    this._checkAsset('splash');
    this._checkAsset('android-notification-icon');
  }

  _checkAsset(optionName) {
    const assetPath = this.options[optionName];

    if (assetPath && !fs.existsSync(assetPath)) {
      this.log.error(`${optionName} could not be found`);
      this.options[optionName] = null;
    }
  }

  _setupIosIcons() {
    let assetName = this.options.assetName ? this.options.assetName : 'AppIcon'

    if (!this.ios || !this.options.icon) return null;

    const iosIconFolder = `${this.options.assetsOutputPath}/ios/${
      this.projectName
    }/Images.xcassets/${assetName}.appiconset`;

    this.fs.copyTpl(
      this.templatePath('ios/AppIconsetContents.json'),
      this.destinationPath(`${iosIconFolder}/Contents.json`)
    );

    return imageGenerator.generateIosIcons(this.options.icon, iosIconFolder);
  }

  _setupIosAlternativeIcons() {
    if (!this.ios || !this.options.alternativeIcon) return null;
    const iosFolder = `${this.options.assetsOutputPath}/ios`;
    return imageGenerator.generateIosAlternativeIcons(
      this.options.alternativeIcon,
      iosFolder,
      this.projectName,
      this.options.assetName
    );
  }
  _deleteIosAlternativeIcons() {
    if (!this.ios || !this.options.deleteAlternativeIcon) return null;
    const iosFolder = `${this.options.assetsOutputPath}/ios`;
    return imageGenerator.deleteIosAlternativeIcons(
      iosFolder,
      this.projectName,
      this.options.assetName
    );
  }

  _setupAndroidIcons() {
    if (!this.android || !this.options.icon) return null;
    return imageGenerator.generateAndroidIcons(
      this.options.icon,
      this.options.assetsOutputPath,
      this.options.androidSrcDirectory
    );
  }

  _setupAndroidAlternativeIcons() {
    if (!this.android || !this.options.alternativeIcon) return null;
    return imageGenerator.generateAndroidAlternativeIcons(
      this.options.alternativeIcon,
      this.options.assetsOutputPath,
      this.options.androidSrcDirectory,
      this.options.assetName,
      this.projectName
    );
  }
  _deleteAndroidAlternativeIcons() {
    if (!this.android || !this.options.deleteAlternativeIcon) return null;
    return imageGenerator.deleteAndroidAlternativeIcons(
      this.options.assetsOutputPath,
      this.options.androidSrcDirectory,
      this.options.assetName,
      this.projectName
    );
  }

  _setupAndroidNotificationIcons() {
    if (!this.options['android-notification-icon']) return null;
    return imageGenerator.generateAndroidNotificationIcons(
      this.options['android-notification-icon'],
      this.options.assetsOutputPath,
      this.options.androidSrcDirectory
    );
  }

  _setupIosSplashScreen() {
    if (!this.ios || !this.options.splash) return null;

    const iosSplashFolder = `${this.options.assetsOutputPath}/ios/${
      this.projectName
    }/Images.xcassets/LaunchImage.launchimage`;

    this.fs.copyTpl(
      this.templatePath('ios/LaunchImageLaunchimageContents.json'),
      `${iosSplashFolder}/Contents.json`
    );

    const pbxprojPath = this.destinationPath(
      `ios/${this.projectName}.xcodeproj/project.pbxproj`
    );
    this.fs.write(
      pbxprojPath,
      this.fs
        .read(pbxprojPath)
        .replace(
          /(\s*)?ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;(?:(\s*)(ASSETCATALOG_COMPILER_LAUNCHIMAGE_NAME = LaunchImage;)?)*/g,
          `$1ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;$1ASSETCATALOG_COMPILER_LAUNCHIMAGE_NAME = LaunchImage;$1`
        )
    );

    const plistPath = this.destinationPath(
      `ios/${this.projectName}/Info.plist`
    );
    this.fs.write(
      plistPath,
      this.fs
        .read(plistPath)
        .replace('<key>UILaunchStoryboardName</key>', '')
        .replace('<string>LaunchScreen</string>', '')
    );

    return imageGenerator.generateIosSplashScreen(
      this.options.splash,
      iosSplashFolder
    );
  }

  _setupAndroidSplashScreen() {
    if (!this.android || !this.options.splash) return null;

    const getTopLeftPixelColor = getPixelColor(this.options.splash, 1, 1);

    return getTopLeftPixelColor.then(splashBackgroundColor => {
      this.fs.copyTpl(
        this.templatePath('android/colors.xml'),
        `${this.options.assetsOutputPath}/android/app/src/${
          this.options.androidSrcDirectory
        }/res/values/colors.xml`,
        { splashBackgroundColor }
      );
      this.fs.copyTpl(
        this.templatePath('android/launch_screen_bitmap.xml'),
        `${this.options.assetsOutputPath}/android/app/src/${
          this.options.androidSrcDirectory
        }/res/drawable/launch_screen_bitmap.xml`
      );

      this.fs.copyTpl(
        this.templatePath('android/styles.xml'),
        `${this.options.assetsOutputPath}/android/app/src/${
          this.options.androidSrcDirectory
        }/res/values/styles.xml`
      );

      return imageGenerator.generateAndroidSplashScreen(
        this.options.splash,
        this.options.assetsOutputPath,
        this.options.androidSrcDirectory
      );
    });
  }

  _setupStoresAssets() {
    if (!this.options.store) return null;

    const resizePromises = [];

    if (this.android && this.options.icon) {
      resizePromises.push(
        imageGenerator.generatePlayStoreIcon(this.options.icon)
      );
    }
    if (this.ios && this.options.icon) {
      resizePromises.push(imageGenerator.generateItunesIcon(this.options.icon));
    }
    if (this.android && this.options.splash) {
      resizePromises.push(
        imageGenerator.generatePlayStoreImage(this.options.splash)
      );
    }

    return Promise.all(resizePromises);
  }
}

module.exports = ResourcesGenerator;

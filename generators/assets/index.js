const fs = require('fs');
const Base = require('yeoman-generator');
const imageGenerator = require('./imageGenerator');

class ResourcesGenerator extends Base {
  constructor(...args) {
    super(...args);
    this.option('icon', {
      desc: 'Icon source',
    });
    this.option('splash', {
      desc: 'Splashscreen source',
    });
    this.option('android', {
      desc: 'Build for Android',
    });
    this.option('iOS', {
      desc: 'Build for iOS',
    });
    this.option('android-notification-icon', {
      desc: 'Notification icon source',
    });
    this.option('store', {
      desc: 'Generate Stores assets',
    });
  }

  prompting() {
    const config = this.fs.readJSON(this.destinationPath('package.json'));
    return this.prompt([{
      type: 'input',
      name: 'projectName',
      message: 'Name of your react-native project',
      required: true,
      default: config.name,
    }]).then((answers) => {
      this.answers = answers;
    });
  }

  writing() {
    this._checkOSToBuildFor();
    this._checkAssets();

    return Promise.all([
      this._setupIosIcons(),
      this._setupAndroidIcons(),
      this._setupAndroidNotificationIcons(),
      this._setupIosSplashScreen(),
      this._setupAndroidSplashScreen(),
      this._setupStoresAssets(),
    ]);
  }

  _checkOSToBuildFor() {
    this.android = this.android || !this.ios;
    this.ios = this.ios || !this.android;
  }

  _checkAssets() {
    this._checkAsset('icon');
    this._checkAsset('splash');
    this._checkAsset('android-notification-icon');
  }

  _checkAsset(optionName) {
    const assetPath = this[optionName];

    if (assetPath && !fs.existsSync(assetPath)) {
      this.log.error(`${this[optionName]} could not be found`);
      this[optionName] = null;
    }
  }

  _setupIosIcons() {
    if (!this.ios || !this.icon) return null;

    const iosIconFolder = `ios/${this.answers.projectName}/Images.xcassets/AppIcon.appiconset`;

    this.fs.copyTpl(
      this.templatePath('AppIconsetContents.json'),
      this.destinationPath(`${iosIconFolder}/Contents.json`)
    );

    return imageGenerator.generateIosIcons(
      this.icon,
      iosIconFolder
    );
  }

  _setupAndroidIcons() {
    if (!this.android || !this.icon) return null;
    return imageGenerator.generateAndroidIcons(this.icon);
  }

  _setupAndroidNotificationIcons() {
    if (!this['android-notification-icon']) return null;
    return imageGenerator.generateAndroidNotificationIcons(this['android-notification-icon']);
  }

  _setupIosSplashScreen() {
    if (!this.ios || !this.splash) return null;

    const iosSplashFolder = `ios/${this.answers.projectName}/Images.xcassets/LaunchImage.launchimage`;

    this.fs.copyTpl(
      this.templatePath('LaunchImageLaunchimageContents.json'),
      `${iosSplashFolder}/Contents.json`
    );

    return imageGenerator.generateIosSplashScreen(
      this.splash,
      iosSplashFolder
    );
  }

  _setupAndroidSplashScreen() {
    if (!this.android || !this.splash) return null;
    return imageGenerator.generateAndroidSplashScreen(this.splash);
  }

  _setupStoresAssets() {
    if (!this.store) return null;

    const resizePromises = [];

    if (this.android && this.icon) {
      resizePromises.push(imageGenerator.generatePlayStoreIcon(this.icon));
    }
    if (this.ios && this.icon) {
      resizePromises.push(imageGenerator.generateItunesIcon(this.icon));
    }
    if (this.android && this.splash) {
      resizePromises.push(imageGenerator.generatePlayStoreImage(this.splash));
    }

    return Promise.all(resizePromises);
  }
}

module.exports = ResourcesGenerator;

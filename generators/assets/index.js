const Base = require('yeoman-generator').Base;
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
  }

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'projectName',
      message: 'Name of your react-native project',
      required: true,
    }]).then((answers) => {
      this.answers = answers;
    });
  }

  writing() {
    return Promise.all([
      this._checkOSToBuildFor(),
      this._setupIosIcons(),
      this._setupAndroidIcons(),
      this._setupAndroidNotificationIcons(),
      this._setupIosSplashScreen(),
      this._setupAndroidSplashScreen(),
    ]);
  }

  _checkOSToBuildFor() {
    this.android = this.options.android || !this.options.ios;
    this.ios = this.options.ios || !this.options.android;
  }

  _setupIosIcons() {
    if (!this.ios || !this.options.icon) return null;

    const iosIconFolder = `ios/${this.answers.projectName}/Images.xcassets/AppIcon.appiconset`;

    this.fs.copyTpl(
      this.templatePath('AppIconsetContents.json'),
      this.destinationPath(`${iosIconFolder}/Contents.json`)
    );

    return imageGenerator.generateIosIcons(
      this.options.icon,
      iosIconFolder
    );
  }

  _setupAndroidIcons() {
    if (!this.android || !this.options.icon) return null;
    return imageGenerator.generateAndroidIcons(this.options.icon);
  }

  _setupAndroidNotificationIcons() {
    if (!this.options['android-notification-icon']) return null;
    return imageGenerator.generateAndroidNotificationIcons(this.options['android-notification-icon']);
  }

  _setupIosSplashScreen() {
    if (!this.ios || !this.options.splash) return null;

    const iosSplashFolder = `ios/${this.answers.projectName}/Images.xcassets/LaunchImage.launchimage`;

    this.fs.copyTpl(
      this.templatePath('LaunchImageLaunchimageContents.json'),
      `${iosSplashFolder}/Contents.json`
    );

    return imageGenerator.generateIosSplashScreen(
      this.options.splash,
      iosSplashFolder
    );
  }

  _setupAndroidSplashScreen() {
    if (!this.android || !this.options.splash) return null;
    return imageGenerator.generateAndroidSplashScreen(this.options.splash);
  }
}

module.exports = ResourcesGenerator;

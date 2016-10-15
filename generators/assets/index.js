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

  checkOSToBuildFor() {
    this.android = this.options.android || !this.options.ios;
    this.ios = this.options.ios || !this.options.android;
  }

  setupIosIcons() {
    if (!this.ios || !this.options.icon) return;

    const iosIconFolder = `ios/${this.answers.projectName}/Images.xcassets/AppIcon.appiconset`;

    this.fs.copyTpl(
      this.templatePath('AppIconsetContents.json'),
      this.destinationPath(`${iosIconFolder}/Contents.json`)
    );

    imageGenerator.generateIosIcons(
      this.options.icon,
      iosIconFolder
    );
  }

  setupAndroidIcons() {
    if (!this.android || !this.options.icon) return;
    imageGenerator.generateAndroidIcons(this.options.icon);
  }

  setupIosSplashScreen() {
    if (!this.ios || !this.options.splash) return;

    const iosSplashFolder = `ios/${this.answers.projectName}/Images.xcassets/LaunchImage.launchimage`;

    this.fs.copyTpl(
      this.templatePath('LaunchImageLaunchimageContents.json'),
      `${iosSplashFolder}/Contents.json`
    );

    imageGenerator.generateIosSplashScreen(
      this.options.splash,
      iosSplashFolder
    );
  }

  setupAndroidSplashScreen() {
    if (!this.android || !this.options.splash) return;
    imageGenerator.generateAndroidSplashScreen(this.options.splash);
  }
}

module.exports = ResourcesGenerator;

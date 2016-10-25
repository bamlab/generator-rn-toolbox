const Base = require('yeoman-generator').Base;

class TestGenerator extends Base {
  writing() {
    this._activateManualSigning();
  }

  _activateManualSigning() {
    let config = this.fs.read(this.destinationPath(`ios/TestApp.xcodeproj/project.pbxproj`));

    // Manual signing
    config = config.replace(
      /(TargetAttributes = {(?:\n.*)+?TestTargetID = )(.+?)(;\n.*\n)(.+)/m,
      '$1$2$3               $2 = {\n                  ProvisioningStyle = Manual;\n               };\n$4'
    );

    // Developer code signing Release
    config = config.replace(
      /(Release.*(\n.+?)+ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;)/m,
      '$1\n            CODE_SIGN_IDENTITY = "iPhone Distribution";\n            DEVELOPMENT_TEAM = "";'
    );

    // Developer code signing Debug
    config = config.replace(
      /(Debug.*(\n.+?)+ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;)/m,
      '$1\n            CODE_SIGN_IDENTITY = "iPhone Developer";\n            DEVELOPMENT_TEAM = "";'
    );

    
  }
}

module.exports = TestGenerator;

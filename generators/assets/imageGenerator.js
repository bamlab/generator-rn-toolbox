const gm = require('gm').subClass({ imageMagick: true });
const fs = require('fs-extra');
const path = require('path');
const Promise = require('bluebird');
require('colors');

Promise.promisifyAll(gm.prototype);

/* eslint-disable no-multi-spaces */
const iosIconSizes = [
  { size: 20,  multipliers: [1, 2, 3] },
  { size: 29,  multipliers: [1, 2, 3] },
  { size: 40,  multipliers: [1, 2, 3] },
  { size: 50,  multipliers: [1, 2] },
  { size: 57,  multipliers: [1, 2] },
  { size: 60,  multipliers: [2, 3] },
  { size: 72,  multipliers: [1, 2] },
  { size: 76,  multipliers: [1, 2] },
  { size: 83.5, multipliers: [2] },
];

const androidIconSizes = [
  { value: 36,  density: 'ldpi' },
  { value: 48,  density: 'mdpi' },
  { value: 72,  density: 'hdpi' },
  { value: 96,  density: 'xhdpi' },
  { value: 144, density: 'xxhdpi' },
  { value: 192, density: 'xxxhdpi' },
];

const androidSplashSizes = [
  { width: 320,   height: 240,   density: 'land-ldpi' },
  { width: 480,   height: 320,   density: 'land-mdpi' },
  { width: 800,   height: 480,   density: 'land-hdpi' },
  { width: 1280,  height: 720,   density: 'land-xhdpi' },
  { width: 1600,  height: 960,   density: 'land-xxhdpi' },
  { width: 1920,  height: 1280,  density: 'land-xxxhdpi' },
  { width: 240,   height: 320,   density: 'port-ldpi' },
  { width: 320,   height: 480,   density: 'port-mdpi' },
  { width: 480,   height: 800,   density: 'port-hdpi' },
  { width: 720,   height: 1280,  density: 'port-xhdpi' },
  { width: 960,   height: 1600,  density: 'port-xxhdpi' },
  { width: 1280,  height: 1920,  density: 'port-xxxhdpi' },
];

// See http://iconhandbook.co.uk/reference/chart/android/
const androidNotificationIconSizes = [
  { value: 24, density: 'ldpi' },
  { value: 24, density: 'mdpi' },
  { value: 36, density: 'hdpi' },
  { value: 48, density: 'xhdpi' },
  { value: 72, density: 'xxhdpi' },
  { value: 96, density: 'xxxhdpi' },
];

const iosSplashSizes = [
  { name: 'Default-568h@2x',           width: 640,   height: 1136 },
  { name: 'Default-667h@2x',           width: 750,   height: 1334 },
  { name: 'Default-Portrait-736h@3x',  width: 1242,  height: 2208 },
  { name: 'Default-Landscape-736h@3x', width: 2208,  height: 1242 },
  { name: 'Default-Landscape@2x',      width: 2048,  height: 1536 },
  { name: 'Default-Landscape',         width: 1024,  height: 768 },
  { name: 'Default-Portrait@2x',       width: 1536,  height: 2048 },
  { name: 'Default-Portrait',          width: 768,   height: 1024 },
  { name: 'Default@2x',                width: 640,   height: 960 },
];

const itunesIconSize =
  { name: 'itunes-icon.png', value: 500 }
;

const playStoreIconSize =
  { name: 'play-store-icon.png', value: 512 }
;

const playStoreImageSize =
  { name: 'play-store-image.png', width: 1024, height: 500 }
;
/* eslint-enable no-multi-spaces */

const getResizedImageGraphic = (sourcePath, width, height) => {
  const maxSize = Math.max(width, height);

  return gm(path.normalize(sourcePath)).resize(maxSize, maxSize)
    .gravity('center')
    .crop(
      width,
      height,
      height > width ? ((height - width) / 2) : 0,
      width > height ? ((width - height) / 2) : 0
    );
};

const checkImageIsSquare = sourcePath =>
  gm(path.normalize(sourcePath)).sizeAsync().then((size) => {
    if (size.width !== size.height) {
      console.log('Please use a square image'.red);
      process.exit(1);
    }
  });

const generateResizedAssets = (sourcePath, destinationPath, width, givenHeight) => {
  const height = givenHeight || width;

  const directory = path.dirname(destinationPath);
  if (!fs.existsSync(directory)) {
    fs.mkdirpSync(directory);
  }

  const psdSafeSourcePath = `${sourcePath}${sourcePath.split('.').pop() === 'psd' ? '[0]' : ''}`;

  return checkImageIsSquare(psdSafeSourcePath)
    .then(() => getResizedImageGraphic(psdSafeSourcePath, width, height)
      .writeAsync(path.normalize(destinationPath))
      .then(() => console.log(`Wrote ${destinationPath}`))
    );
};

const generateIosIcons = (iconSource, iosIconFolder) =>
  Promise.all(iosIconSizes.map(size =>
    Promise.all(size.multipliers.map(multiplier =>
      generateResizedAssets(
        iconSource,
        `${iosIconFolder}/icon-${size.size}@${multiplier}x.png`,
        size.size * multiplier
      )
    ))
  ));


const generateAndroidIcons = iconSource =>
  Promise.all(androidIconSizes.map(size =>
    generateResizedAssets(
      iconSource,
      `android/app/src/main/res/mipmap-${size.density}/ic_launcher.png`,
      size.value
    )
  ));

const generateIosSplashScreen = (splashSource, iosSplashFolder) =>
  Promise.all(iosSplashSizes.map(size =>
    generateResizedAssets(
      splashSource,
      `${iosSplashFolder}/${size.name}.png`,
      size.width,
      size.height
    )
  ));

const generateAndroidSplashScreen = splashSource =>
  androidSplashSizes.map(size =>
    generateResizedAssets(
      splashSource,
      `android/app/src/main/res/drawable-${size.density}/launch_screen.png`,
      size.width,
      size.height
    )
  );

const generateAndroidNotificationIcons = iconSource =>
  androidNotificationIconSizes.map(size =>
    generateResizedAssets(
      iconSource,
      `android/app/src/main/res/mipmap-${size.density}/ic_notification.png`,
      size.value
    )
  );

const generatePlayStoreIcon = iconSource =>
  generateResizedAssets(iconSource, playStoreIconSize.name, playStoreIconSize.value);

const generateItunesIcon = iconSource =>
  generateResizedAssets(iconSource, itunesIconSize.name, itunesIconSize.value);

const generatePlayStoreImage = iconSource =>
  generateResizedAssets(
    iconSource,
    playStoreImageSize.name,
    playStoreImageSize.width,
    playStoreImageSize.height
  );

module.exports = {
  generateIosSplashScreen,
  generateAndroidIcons,
  generateIosIcons,
  generateAndroidSplashScreen,
  generateAndroidNotificationIcons,
  generatePlayStoreIcon,
  generateItunesIcon,
  generatePlayStoreImage,
};

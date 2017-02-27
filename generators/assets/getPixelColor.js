const gm = require('gm').subClass({ imageMagick: true });
const color = require('color-js');

const imageMagickColorToHex = imageMagickColor =>
  color(imageMagickColor.replace('s', '')).toString();

module.exports = (imagePath, x, y) =>
  new Promise((resolve, reject) =>
    gm(imagePath)
      .crop(x, y)
      .identify('%[pixel:s]', (error, imageMagickColor) => {
        if (error) return reject(error);
        return resolve(imageMagickColorToHex(imageMagickColor));
      })
  );

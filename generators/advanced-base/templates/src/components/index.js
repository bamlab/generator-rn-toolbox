/**
 * @providesModule components
 */

/**
 * This syntax prevent circular import
 * prevent some break in hot reaload
 * and optimize the number of file imported
 */
module.exports = {
  get Page() {
    return require('./Page').default;
  },
  get Button() {
    return require('./Button').default;
  },
  get TextInput() {
    return require('./TextInput').default;
  },
  get SecondaryFlatButton() {
    return require('./SecondaryFlatButton').default;
  },
  get ProfileHeader() {
    return require('./ProfileHeader').default;
  },
  get ButtonCard() {
    return require('./ButtonCard').default;
  },
  get Touchable() {
    return require('./Touchable').default;
  },
};

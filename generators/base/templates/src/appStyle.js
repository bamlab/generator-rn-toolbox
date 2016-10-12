import { Platform } from 'react-native';

const navbarOffset = Platform.OS === 'ios' ? 20 : 0;
const navbarBaseHeight = Platform.OS === 'ios' ? 44 : 54;

export const appStyle = {
  navbar: {
    offset: navbarOffset,
    baseHeight: navbarBaseHeight,
    height: navbarBaseHeight + navbarOffset,
  },
  font: {
    fontSize: {
      small: 11,
      default: 13,
      big: 15,
      large: 17,
      huge: 20,
    },
  },
  colors: {
    primary: '#05A5D1',
    lightText: '#FAFAFA',
    background: '#F5FCFF',
  },
  margins: {
    inner: 10,
    outer: 25,
  },
  dimensions: {
    touchableHeight: 48,
    visibleButtonHeight: 36,
  },
};

export default appStyle;

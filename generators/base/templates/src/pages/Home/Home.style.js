// @flow

import { StyleSheet, Text, View } from 'react-native';
import theme from '<%= appName %>/src/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    ...theme.fonts.header,
    textAlign: 'center',
    margin: theme.grid.x1,
  },
  instructions: {
    ...theme.fonts.default,
    textAlign: 'center',
    color: theme.colors.darkGray,
    marginBottom: theme.grid.x1,
  },
});

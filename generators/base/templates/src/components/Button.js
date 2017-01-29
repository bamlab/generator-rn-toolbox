import React, { PropTypes } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

import appStyle from '<%= appName %>/src/appStyle';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: appStyle.dimensions.touchableHeight,
    marginVertical: appStyle.grid.x1,
  },
  button: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    height: appStyle.dimensions.visibleButtonHeight,
    backgroundColor: appStyle.colors.primary,
    paddingHorizontal: appStyle.grid.x1,
  },
  text: {
    textAlign: 'center',
    color: appStyle.colors.lightText,
    fontSize: appStyle.font.size.default,
  },
});

const Button = props => (
  <TouchableOpacity onPress={props.onPress} style={styles.container}>
    <View style={styles.button}>
      <Text style={[styles.text]}>{props.children.toUpperCase()}</Text>
    </View>
  </TouchableOpacity>
);

Button.propTypes = {
  children: PropTypes.string,
  onPress: PropTypes.func,
  buttonType: PropTypes.string,
};

Button.defaultProps = {
  children: null,
  onPress: () => {},
};

export default Button;

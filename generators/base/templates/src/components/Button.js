// @flow

import React, { PureComponent, PropTypes } from 'react';
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

class Button extends PureComponent {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={styles.container}>
        <View style={styles.button}>
          <Text style={[styles.text]}>{this.props.children.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  children: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

Button.defaultProps = {
  onPress: () => {},
};

export default Button;

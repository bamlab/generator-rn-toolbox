// @flow
import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';

import Touchable from './Touchable';

import theme from 'theme';

export type Props = {
  text?: string,
  onPress: () => void,
  children?: React.Element<*>,
  style?: any,
  textStyle?: any,
};

type DefaultProps = {
  onPress: () => void,
};

class Button extends Component<DefaultProps, Props, void> {
  static defaultProps: DefaultProps = {
    onPress: () => {},
  };

  render() {
    const { style, text, textStyle, children, ...rest } = this.props;
    const content = text
      ? <Text style={[styles.text, textStyle]}>
          {text.toUpperCase()}
        </Text>
      : children;

    return (
      <Touchable style={[styles.button, style]} {...rest}>
        {content}
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    height: 40,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginVertical: 8,
  },
  text: {
    ...theme.fonts.button,
    color: theme.colors.overPrimary,
    textAlign: 'center',
  },
});

export default Button;

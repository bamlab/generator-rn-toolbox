// @flow
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import theme from 'theme';

import Button from './Button';
import type { Props } from './Button';

class SecondaryFlatButton extends Component<void, Props, void> {
  render() {
    return (
      <Button
        style={styles.button}
        textStyle={styles.textStyle}
        borderless
        useForeground
        {...this.props}
      />
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
  },
  textStyle: {
    ...theme.fonts.secondaryFlatButton,
  },
});

export default SecondaryFlatButton;

/* @flow */

/**
 * TouchableItem renders a touchable that looks native on both iOS and Android.
 *
 * It provides an abstraction on top of TouchableNativeFeedback and
 * TouchableOpacity.
 *
 * On iOS you can pass the props of TouchableOpacity, on Android pass the props
 * of TouchableNativeFeedback.
 */
import React, { Component, Children } from 'react';
import { Platform, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';

const ANDROID_VERSION_LOLLIPOP = 21;

type Props = {
  onPress?: Function,
  delayPressIn?: number,
  borderless?: boolean,
  pressColor?: ?string,
  activeOpacity?: number,
  children?: React.Element<*>,
  style?: any,
  disabled?: ?boolean,
  disabledOpacity?: number,
  useOpacity?: boolean,
};

type DefaultProps = {
  pressColor: ?string,
  activeOpacity: number,
  disabled: ?boolean,
  disabledOpacity: number,
};

export default class Touchable extends Component<DefaultProps, Props, void> {
  static defaultProps: DefaultProps = {
    pressColor: 'rgba(0, 0, 0, .32)',
    activeOpacity: 0.7,
    disabled: false,
    disabledOpacity: 0.4,
    useOpacity: false,
  };

  render() {
    const { style, onPress, disabled, disabledOpacity, useOpacity, ...rest } = this.props;
    const disabableOnPress = disabled ? undefined : onPress;
    const finalStyle = [{ opacity: disabled ? disabledOpacity : 1 }, style];

    if (Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP && !useOpacity) {
      return (
        <TouchableNativeFeedback
          delayPressIn={0}
          background={TouchableNativeFeedback.Ripple(this.props.pressColor, this.props.borderless)}
          {...rest}
          style={null}
          onPress={disabableOnPress}
        >
          <View style={finalStyle}>
            {Children.only(this.props.children)}
          </View>
        </TouchableNativeFeedback>
      );
    }

    return (
      <TouchableOpacity {...rest} onPress={disabableOnPress}>
        <View style={finalStyle}>
          {this.props.children}
        </View>
      </TouchableOpacity>
    );
  }
}

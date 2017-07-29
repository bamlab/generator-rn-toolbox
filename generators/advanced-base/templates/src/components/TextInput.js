import React, { Component, PropTypes } from 'react';

import { Text, TextInput as RNTextInput, View, StyleSheet } from 'react-native';
import theme from 'theme';

type Props = {
  errorMessage?: string,
  type: 'name' | 'text' | 'email' | 'password' | 'digits' | 'numeric',
  containerStyle?: PropTypes.number,
  style?: StyleSheet.Styles | Array<StyleSheet.Styles>,
};

class TextInput extends Component<void, Props, void> {
  getTypeProps() {
    switch (this.props.type) {
      case 'name':
        return {
          autoCorrect: false,
        };
      case 'email':
        return {
          autoCorrect: false,
          keyboardType: 'email-address',
          autoCapitalize: 'none',
        };
      case 'password':
        return {
          autoCorrect: false,
          secureTextEntry: true,
        };
      case 'digits': {
        return {
          keyboardType: 'phone-pad',
        };
      }
      case 'numeric': {
        return {
          keyboardType: 'numeric',
        };
      }
      default:
        return {};
    }
  }

  clear() {
    this.refs.textinputRef.clear();
  }

  focus() {
    this.refs.textinputRef.focus();
  }

  render() {
    const { errorMessage, containerStyle, style, type, ...inputProps } = this.props;
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.fieldContainer,
            errorMessage ? styles.fieldContainerError : {},
            containerStyle,
          ]}
        >
          <RNTextInput
            ref="textinputRef"
            {...this.getTypeProps()}
            style={[styles.fieldText, style]}
            underlineColorAndroid="transparent"
            placeholderTextColor={theme.fonts.placeholder.color}
            {...inputProps}
          />
        </View>
        {errorMessage &&
          <Text style={styles.error}>
            {errorMessage}
          </Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  fieldContainer: {
    alignSelf: 'stretch',
    height: 48,
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 1,
    borderColor: theme.colors.grayLighter,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  fieldContainerError: {
    borderColor: theme.colors.error,
  },
  fieldText: {
    backgroundColor: 'transparent',
    flex: 1,
    ...theme.fonts.input,
  },
  error: {
    textAlign: 'right',
    color: theme.colors.error,
    backgroundColor: 'transparent',
  },
});

export default TextInput;

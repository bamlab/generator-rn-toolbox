// @flow
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';

import { Page, Button, TextInput, SecondaryFlatButton } from 'components';
import theme from 'theme';
import I18n from 'lib/i18n';

type Props = {
  navigation: any,
};

class Login extends Component<void, Props, void> {
  _goToHomePage() {
    // @see https://github.com/react-community/react-navigation/issues/1127
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'dashboard' })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <Page backgroundImage={theme.images.landing} style={styles.page}>
        <View>
          <TextInput type="email" placeholder={I18n.t('user.form.email')} />
          <TextInput
            type="password"
            placeholder={I18n.t('user.form.password')}
          />

          <Button
            onPress={() => this._goToHomePage()}
            text={I18n.t('login.login')}
          />
          <SecondaryFlatButton
            onPress={() => this.props.navigation.navigate('signup')}
            text={I18n.t('login.signup')}
          />
        </View>
      </Page>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 50,
  },
});

export default Login;

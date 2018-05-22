// @flo
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';

import type { NavigationTabScreenOptions } from 'react-navigation';
import { Page, Button, TextInput } from 'components';
import theme from 'theme';
import I18n from 'lib/i18n';

type Props = {
  navigator: any,
};

class Signup extends Component<void, Props, void> {
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
      <Page>
        <View style={styles.container}>
          <TextInput type="name" placeholder={I18n.t('user.form.firstname')} />
          <TextInput type="name" placeholder={I18n.t('user.form.lastname')} />
          <TextInput type="email" placeholder={I18n.t('user.form.email')} />
          <TextInput
            type="password"
            placeholder={I18n.t('user.form.password')}
          />

          <Button
            onPress={() => this._goToHomePage()}
            text={I18n.t('signup.signup')}
          />
        </View>
      </Page>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Signup;

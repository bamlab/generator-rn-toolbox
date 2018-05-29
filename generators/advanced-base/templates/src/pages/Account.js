// @flow
import React, { Component } from 'react';

import { NavigationActions, StackActions } from 'react-navigation';
import type { NavigationTabScreenOptions } from 'react-navigation';

import { Page, ProfileHeader, ButtonCard } from 'components';

import I18n from 'lib/i18n';

type Props = {
  navigation: any,
};

class Account extends Component<void, Props, void> {
  _logout() {
    // @see https://github.com/react-community/react-navigation/issues/1127
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'landing' })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <Page noPadding noNavBar>
        <ProfileHeader user={{ firstName: 'John', lastName: 'Doe' }} />
        <ButtonCard
          onPress={() => this._logout()}
          text={I18n.t('account.logout')}
        />
      </Page>
    );
  }
}
export default Account;

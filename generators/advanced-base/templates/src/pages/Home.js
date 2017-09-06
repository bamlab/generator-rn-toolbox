// @flow
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { NavigationTabScreenOptions } from 'react-navigation';
import { Page } from 'components';
import theme from 'theme';
import I18n from 'lib/i18n';

type Props = {
  navigation: any,
};

class Home extends Component<void, Props, void> {
  render() {
    return (
      <Page>
        <View style={styles.container}>
          <Text style={styles.title}>
            {I18n.t('home.text')}
          </Text>
        </View>
      </Page>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...theme.fonts.pageTitle,
  },
});

export default Home;

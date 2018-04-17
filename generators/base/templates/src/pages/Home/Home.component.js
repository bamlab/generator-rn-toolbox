// @flow

import React, { Component } from 'react';
import { Platform, Text, View } from 'react-native';

import { Page } from '<%= appName %>/src/components';

import styles from './Home.style';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class Home extends Component {
  static navigationOptions = {
    title: 'Home',
  };
  props: PropsType;

  render() {
    return (
      <Page>
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Welcome to React Native!
          </Text>
          <Text style={styles.instructions}>
            This is the Home page
          </Text>
          <Text style={styles.instructions}>
            {instructions}
          </Text>
        </View>
      </Page>
    );
  }
}

type PropsType = {
  navigation: any,
};

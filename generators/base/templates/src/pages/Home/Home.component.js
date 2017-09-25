// @flow

import React, { Component } from 'react';
import { Text, View } from 'react-native';

import { Page } from '<%= appName %>/src/components';

import styles from './Home.style';

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
            Double tap R on your keyboard to reload,{'\n'}
            Shake or press menu button for dev menu
          </Text>
        </View>
      </Page>
    );
  }
}

type PropsType = {
  navigation: any,
};

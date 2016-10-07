import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Page } from '<%= appName %>/src/components';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

const Infos = () => (
  <Page>
    <View style={styles.container}>
      <Text style={styles.welcome}>
        This is the Infos Page
      </Text>
      <Text style={styles.instructions}>
        It means you have a working router
      </Text>
      <Text style={styles.instructions}>
        Double tap R on your keyboard to reload,{'\n'}
        Shake or press menu button for dev menu
      </Text>
    </View>
  </Page>
);

export default Infos;

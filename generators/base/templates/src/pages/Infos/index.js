import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Page } from '<%= appName %>/src/components';
import appStyle from '<%= appName %>/src/appStyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: appStyle.font.size.huge,
    textAlign: 'center',
    margin: appStyle.grid.x1,
  },
  instructions: {
    textAlign: 'center',
    color: appStyle.colors.darkGray,
    marginBottom: appStyle.grid.x1,
  },
});

type PropsType = {
  navigation: any,
};

class Infos extends Component {
  static navigationOptions = {
    title: 'Infos',
  };
  props: PropsType;

  render() {
    return (
      <Page>
        <View style={styles.container}>
          <Text style={styles.welcome}>
            This is the Infos page
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
  }
 }

export default Infos;

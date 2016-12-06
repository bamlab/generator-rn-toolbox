import React, { components } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withNavigation } from '@exponent/ex-navigation';

import Router from '<%= appName %>/src/Router.js';
import { Page, Button } from '<%= appName %>/src/components';

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

type PropsType = {
  navigator: any,
};

@withNavigation
class Home extends Component {
  static route = {
    navigationBar: {
      title: 'Home',
    },
  }

  _goToInfos = () => {
    this.props.navigator.push(Router.getRoute('infos'));
  }

  props: PropsType;

  render() {
    return (
      <Page>
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Welcome to React Native!
          </Text>
          <Text style={styles.instructions}>
            This is page the home
          </Text>
          <Text style={styles.instructions}>
            Double tap R on your keyboard to reload,{'\n'}
            Shake or press menu button for dev menu
          </Text>
          <Button onPress={this._goToInfos}>Go to the Info page</Button>
        </View>
      </Page>
    );
  }
}


export default Home;

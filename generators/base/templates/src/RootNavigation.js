// @flow

import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';

import { StackNavigator, addNavigationHelpers, NavigationActions } from 'react-navigation';

import * as Pages from '<%= appName %>/src/pages';

export const AppNavigator = StackNavigator({
  home: {
    screen: Pages.Home,
  },
});

class App extends React.Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }
  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav,
        })}
      />
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
});

const AppWithNavigationState = connect(mapStateToProps)(App);

export default AppWithNavigationState;
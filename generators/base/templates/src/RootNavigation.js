// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { StackNavigator, addNavigationHelpers } from 'react-navigation';

import * as Pages from '<%= appName %>/src/pages';
import { navListener } from '<%= appName %>/src/modules/Nav/module';

export const AppNavigator = StackNavigator({
  home: {
    screen: Pages.Home,
  },
});

class App extends React.Component {
  render() {
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav,
          addListener: navListener,
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

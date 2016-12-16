import React, { Component } from 'react';
import { NavigationProvider, StackNavigation } from '@exponent/ex-navigation';

import Router from '<%= appName %>/src/Router.js';

class Scenes extends Component {
  render() {
    return (
      <NavigationProvider router={Router}>
        <StackNavigation initialRoute={Router.getRoute('home')} />
      </NavigationProvider>
    );
  }
}

export default Scenes;

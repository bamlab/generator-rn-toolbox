// @flow

import { createStore } from 'redux';
import enhancer from '<%= appName %>/src/modules/rootEnhancer';
import reducers from '<%= appName %>/src/modules/rootReducer';

export default () => createStore(reducers, enhancer);

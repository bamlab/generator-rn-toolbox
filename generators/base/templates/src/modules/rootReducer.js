// @flow

import { combineReducers } from 'redux';

import { appReducer } from './App';
import { navReducer } from './Nav';

const rootReducer = combineReducers({
  app: appReducer,
  nav: navReducer,
});

export default rootReducer;

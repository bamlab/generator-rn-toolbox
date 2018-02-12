// @flow

import { applyMiddleware } from 'redux';
import { navMiddleware } from './Nav';

const rootEnhancer = applyMiddleware(navMiddleware);

export default rootEnhancer;

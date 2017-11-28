import { createStore } from 'redux'
import reducers from '<%= appName %>/src/modules/reducers';

export default () => {
  return createStore(reducers)
}
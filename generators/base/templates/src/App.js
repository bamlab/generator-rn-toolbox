import { StackNavigator } from 'react-navigation';

import * as Pages from '<%= appName %>/src/pages';

export default App = StackNavigator({
  home: {
    screen: Pages.Home,
  },
  infos: {
    screen: Pages.Infos,
  },
}, {
  initialRouteName: 'home',
});

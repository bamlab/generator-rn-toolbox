import {
  createRouter,
} from '@exponent/ex-navigation';

import * as Pages from '<%= appName %>/src/pages';

export default createRouter(() => ({
  home: () => Pages.Home,
  infos: () => Pages.Infos,
}));

// @flow weak
import I18n from 'react-native-i18n';
import translations from '<%= appName %>/translations';

I18n.fallbacks = true;
I18n.translations = translations;
I18n.defaultLocale = 'en';

I18n.has = key => I18n.locale in translations && key in translations[I18n.locale];

export default I18n;

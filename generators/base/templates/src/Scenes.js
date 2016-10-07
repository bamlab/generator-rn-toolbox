import React from 'react';
import { StyleSheet } from 'react-native';
import { Scene, Router, ActionConst } from 'react-native-router-flux';

import * as Pages from '<%= appName %>/src/pages';
import { LogoTitle } from '<%= appName %>/src/components';
import backChevron from '<%= appName %>/src/assets/back_chevron.png';

import appStyle from '<%= appName %>/src/appStyle';

const styles = StyleSheet.create({
  header: {
    backgroundColor: appStyle.colors.primary,
    borderBottomWidth: 0,
  },
  title: {
    color: appStyle.colors.lightText,
  },
});

const Scenes = () => (
  <Router>
    <Scene
      key="root"
      titleStyle={styles.title}
      navigationBarStyle={styles.header}
      backButtonImage={backChevron}
    >
      <Scene
        key="home"
        type={ActionConst.RESET}
        component={Pages.Home}
        renderTitle={LogoTitle}
        initial
      />
      <Scene
        key="infos"
        component={Pages.Infos}
        title="Infos"
      />
    </Scene>
  </Router>
);

export default Scenes;

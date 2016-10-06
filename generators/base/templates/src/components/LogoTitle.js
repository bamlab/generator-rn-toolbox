import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import logo from '<%= appName %>/src/assets/logo.png';
import appStyle from '<%= appName %>/src/appStyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: appStyle.navbar.offset,
  },
  image: {
    height: appStyle.navbar.baseHeight - 8,
    resizeMode: 'contain',
  },
});

const LogoTitle = () => (
  <View style={styles.container}>
    <Image source={logo} style={styles.image} />
  </View>
);

export default LogoTitle;

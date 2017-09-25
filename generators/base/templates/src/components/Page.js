// @flow

import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import theme from '<%= appName %>/src/theme';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});

export default (props: PropsType) => (
  <View
    style={[styles.page, {
      paddingTop: props.noNavBar ? 0 : theme.grid.x2,
      paddingHorizontal: props.noMargin ? 0 : theme.grid.x3,
      backgroundColor: props.backgroundColor,
    }]}
  >
    {props.children}
  </View>
);

type PropsType = {
  children: React$Element<*> | React$Element<*>[],
  noMargin: boolean,
  noNavBar: boolean,
  backgroundColor: string,
};

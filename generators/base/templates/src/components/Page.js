import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import appStyle from '<%= appName %>/src/appStyle';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});

const Page = props => (
  <View
    style={[styles.page, {
      paddingTop: props.noNavBar ? 0 : appStyle.grid.x2,
      paddingHorizontal: props.noMargin ? 0 : appStyle.grid.x3,
      backgroundColor: props.backgroundColor,
    }]}
  >
    {props.children}
  </View>
);

Page.propTypes = {
  children: PropTypes.node,
  noMargin: PropTypes.bool,
  noNavBar: PropTypes.bool,
  backgroundColor: PropTypes.string,
};

Page.defaultProps = {
  children: null,
  noMargin: false,
  noNavBar: false,
  backgroundColor: appStyle.colors.color,
};

export default Page;

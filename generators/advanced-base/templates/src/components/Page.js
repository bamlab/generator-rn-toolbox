import React, { Component } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import theme from 'theme';

type Props = {
  children: React.Element<*>,
  noPadding: boolean,
  noNavBar: boolean,
  backgroundColor: string,
  style?: any,
  backgroundImage?: any,
};

type DefaultProps = {
  children: React.Element<*>,
  noPadding: boolean,
  noNavBar: boolean,
  backgroundColor: string,
};

class Page extends Component<DefaultProps, Props, void> {
  static defaultProps: DefaultProps = {
    children: null,
    noPadding: false,
    noNavBar: false,
    backgroundColor: theme.colors.background,
  };

  render() {
    const containerStyle = StyleSheet.flatten([
      styles.page,
      {
        paddingTop: this.props.noNavBar ? 0 : 16,
        paddingHorizontal: this.props.noPadding ? 0 : 32,
        backgroundColor: this.props.backgroundColor,
      },
      this.props.style,
    ]);

    return (
      <View style={containerStyle}>
        {this.props.backgroundImage &&
          <Image source={this.props.backgroundImage} style={styles.image} resizeMode="cover" />}
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default Page;

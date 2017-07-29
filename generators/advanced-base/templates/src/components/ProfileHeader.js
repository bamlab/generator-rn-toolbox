// @flow
import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Page, Touchable } from 'components';
import theme from 'theme';

type Props = {
  user: ?Object,
  onPress: ?Function,
};

class ProfileHeader extends Component<void, Props, void> {
  render() {
    const { user } = this.props;

    return (
      <View style={styles.container}>
        <Touchable onPress={this.props.onPress} useOpacity>
          <View style={styles.imageContainer}>
            <Image source={theme.images.defaultUserImage} style={styles.userImage} />
            <View style={styles.imageOverlay}>
              {user
                ? <Icon name="pencil" color="white" size={25} />
                : <ActivityIndicator style={{ alignSelf: 'center' }} color="white" />}
            </View>
          </View>
        </Touchable>
        {user &&
          <View>
            <Text style={styles.name}>
              {user.firstName} {user.lastName}
            </Text>
          </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 16,
  },
  imageContainer: {
    marginHorizontal: Page.DEFAULT_PADDING,
  },
  userImage: {
    height: 70,
    width: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'white',
  },
  name: {
    color: 'white',
    marginTop: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    height: 70,
    width: 70,
    borderRadius: 35,

    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileHeader;

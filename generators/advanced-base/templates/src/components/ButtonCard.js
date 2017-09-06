// @flow
import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Touchable } from 'components';
import theme from 'theme';

type Props = {
  text: string,
  onPress: ?Function,
};

class ButtonCard extends PureComponent<void, Props, void> {
  render() {
    return (
      <Touchable onPress={this.props.onPress} style={styles.card}>
        <View style={styles.contentContainer}>
          <Text style={styles.text}>
            {this.props.text}
          </Text>
          <Icon name="chevron-right" size={30} />
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    alignSelf: 'stretch',
    paddingHorizontal: theme.defaultPadding / 2,
  },
  contentContainer: {
    borderBottomWidth: 1,
    borderColor: theme.colors.grayLighter,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 55,
  },
  text: {
    ...theme.fonts.button,
  },
});

export default ButtonCard;

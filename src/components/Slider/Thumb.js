import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../../theme/color';

const THUMB_RADIUS = 12;

const Thumb = () => {
  return <View style={styles.root} />;
};

const styles = StyleSheet.create({
  root: {
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    borderWidth: 2,
    elevation: 3,
    margin: 4,
    borderColor: Colors.primary,
    backgroundColor: '#ffffff',
  },
});

export default memo(Thumb);

import {StyleSheet, View} from 'react-native';
import React from 'react';
import {ActivityIndicator} from '@react-native-material/core';
import {Colors} from '../theme/color';

export default function AppLoader({v}) {
  if (v === 'v2') {
    return (
      <View style={[styles.body, styles.overlaybody, {marginHorizontal: -20}]}>
        <ActivityIndicator color={Colors.primary} size={'large'} />
      </View>
    );
  }

  return (
    <View style={styles.body}>
      <ActivityIndicator color={Colors.primary} size={'large'} />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingBottom: 70,
    minHeight: 200,
  },
  overlaybody: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0, 0.3)',
  },
});

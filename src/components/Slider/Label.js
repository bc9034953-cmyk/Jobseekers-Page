import React, {memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Label = ({text, prefix, ...restProps}) => {
  return (
    <View style={styles.root} {...restProps}>
      <Text style={styles.text}>
        {prefix}
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    color: '#000',
  },
});

export default memo(Label);

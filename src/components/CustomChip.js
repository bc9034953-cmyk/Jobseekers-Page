import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import themeStyle from '../theme/style';

const CustomChip = ({
  label,
  color = '#6B7280',
  variant = 'filled',
  labelStyle = {},
  style = {},
  numberOfLines = 1,
}) => {
  // Create light background color by adding transparency
  const lightBgColor = variant === 'filled' ? color + '15' : 'transparent';

  const chipStyle = [
    styles.chip,
    {
      backgroundColor: lightBgColor,
      borderColor: color,
      borderWidth: variant === 'outlined' ? 1 : 0,
    },
    style,
  ];

  const textStyle = [themeStyle.r12, styles.label, {color: color}, labelStyle];

  return (
    <View style={chipStyle}>
      <Text
        style={textStyle}
        numberOfLines={numberOfLines}
        ellipsizeMode="tail">
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  label: {
    textAlign: 'center',
    textTransform: 'capitalize',
    lineHeight: 18,
  },
});

export default CustomChip;

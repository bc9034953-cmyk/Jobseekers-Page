import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import style from '../theme/style';
import {ActivityIndicator, MD2Colors} from 'react-native-paper';
import {Colors} from '../theme/color';

export default function Button({
  onPress,
  v,
  icon,
  isLoading,
  styles,
  labelStyle,
  loaderColor = Colors.white,
  disabled,
  variant,
  ...props
}) {
  const isOutlined = variant === 'outlined';

  if (v === 'v3') {
    return (
      <TouchableOpacity
        {...props}
        disabled={isLoading || disabled}
        style={[myStyles.button3, {...styles}]}
        onPress={onPress}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
          }}>
          {isLoading && (
            <ActivityIndicator
              animating={true}
              color={loaderColor}
              size={14}
              hidesWhenStopped={false}
            />
          )}

          {icon && !isLoading && <View>{icon}</View>}
          <Text style={[style.m13, myStyles.btnText, {...labelStyle}]}>
            {props.children}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (v === 'v2') {
    return (
      <TouchableOpacity
        disabled={isLoading}
        onPress={onPress}
        style={[
          myStyles.button2,
          myStyles[isOutlined ? `outlined_${v}` : ''],
          {...styles, opacity: isLoading ? 0.7 : 1},
        ]}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: isLoading ? 8 : 5,
          }}>
          {isLoading && (
            <ActivityIndicator
              animating={true}
              color={MD2Colors.white}
              size={18}
              hidesWhenStopped={false}
            />
          )}

          {!isLoading && <View style={{marginTop: 3}}>{icon}</View>}

          <Text
            style={[
              style.r14,
              {color: isOutlined ? Colors.primary : Colors.white, marginTop: 3},
            ]}>
            {props.children}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      disabled={isLoading}
      onPress={onPress}
      style={[style.btn, {...styles, opacity: isLoading ? 0.7 : 1}]}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 8,
        }}>
        {isLoading && (
          <ActivityIndicator
            animating={true}
            color={MD2Colors.white}
            size={18}
            hidesWhenStopped={false}
          />
        )}
        <Text style={[style.btntxt, {marginBottom: -8}]}>{props.children}</Text>
      </View>
    </TouchableOpacity>
  );
}

const myStyles = StyleSheet.create({
  button2: {
    backgroundColor: Colors.primary,
    padding: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  outlined_v2: {
    borderColor: Colors.primary,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  outlined_text_v2: {
    color: Colors.primary,
  },
  button3: {
    padding: 8,
    borderRadius: 30,
    paddingHorizontal: 17,
    backgroundColor: '#ebe9fd',
    maxWidth: 170,
    width: 'auto',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    lineHeight: 18,
    color: Colors.txt,
  },
});

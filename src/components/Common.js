import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../theme/color';
import style from '../theme/style';
import Icon from 'react-native-vector-icons/Ionicons';
import {Linking} from 'react-native';

export const {width, height} = Dimensions.get('window');

export const AttributeWithIcon = ({source, value, styles, iconSize = 18}) => {
  if (!value) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        gap: 8,
        minWidth: width / 2 - 60,
        ...styles,
      }}>
      {source && (
        <Image
          source={source}
          resizeMode="contain"
          style={{height: 20, width: iconSize, tintColor: Colors.primary}}
        />
      )}
      <Text style={[style.m14, {color: '#212121'}]}>{value}</Text>
    </View>
  );
};

export const IconRow = ({
  image,
  name,
  value,
  iconName,
  selectable = true,
  linking,
  isHiddenValue,
  onViewUserDetails,
  isLoading,
}) => {
  if (!value && !isHiddenValue) {
    return null;
  }

  const renderValue = () => {
    if (isLoading) {
      return (
        <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
          <Text
            style={[
              style.m14,
              {color: Colors.primary, textDecorationLine: 'underline'},
            ]}>
            View Details
          </Text>
          <ActivityIndicator
            size={16}
            color={Colors.primary}
            style={{marginTop: -5}}
          />
        </View>
      );
    }

    if (isHiddenValue) {
      return (
        <TouchableOpacity onPress={onViewUserDetails}>
          <Text
            style={[
              style.m14,
              {color: Colors.primary, textDecorationLine: 'underline'},
            ]}>
            View Details
          </Text>
        </TouchableOpacity>
      );
    }

    if (linking) {
      return (
        <Pressable onPress={() => Linking.openURL(value)}>
          <Text style={[style.m16, {color: Colors.txt}]} selectable={true}>
            {value}
          </Text>
        </Pressable>
      );
    }

    return (
      <Text style={[style.m16, {color: Colors.txt}]} selectable={selectable}>
        {value}
      </Text>
    );
  };

  return (
    <View style={{flexDirection: 'row', marginTop: 15}}>
      <View
        style={{
          height: 50,
          width: 50,
          borderColor: '#E2E8F0',
          borderWidth: 1,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {iconName ? (
          <Icon name={iconName} size={24} color={Colors.primary} />
        ) : (
          <Image
            source={image}
            resizeMode="cover"
            style={{height: 25, width: 25, tintColor: Colors.primary}}
          />
        )}
      </View>

      <View style={{marginLeft: 15, flex: 1}}>
        <Text style={[style.r14, {color: '#6F6F6F'}]}>{name}</Text>

        {renderValue()}
      </View>
    </View>
  );
};

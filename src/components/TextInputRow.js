import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { Fragment, useState } from 'react';
import style from '../theme/style';
import { Colors } from '../theme/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ErrorMessage = ({ error }) => {
  return (
    error && (
      <Text style={{ color: 'red', marginTop: 5, marginLeft: 18 }}>
        {error}
      </Text>
    )
  );
};

export default function TextInputRow({
  formData,
  setFormData,
  value,
  name,
  placeholder,
  icon,
  errors,
  setErrors,
  type,
  maxLength,
  multiline = true,
  numberOfLines = 4,
  keyboardType = 'default',
  v,
  label,
  editable = true,
  rightIcon,
  autoCapitalize = 'sentences', // sentences, none, words, characters
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const getErrors = () => {
    return typeof errors === 'object' && errors[name]
      ? { name, error: errors[name] }
      : undefined;
  };

  const inputBorderColor = getErrors()?.name
    ? Colors.danger
    : isFocused === name
    ? Colors.primary
    : Colors.bord;

  const onChangeText = (field, newValue) => {
    if (field === getErrors()?.name) {
      setErrors({});
    }
    setFormData({ ...formData, [field]: newValue });
  };

  // type == password then showing password field
  if (type === 'password') {
    return (
      <Fragment>
        <View
          style={[
            style.inputContainer,
            {
              marginTop: 20,
              borderColor: inputBorderColor,
            },
          ]}>
          <MaterialIcons
            name="lock-outline"
            size={22}
            color={Colors.disable2}
          />
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={Colors.disable2}
            secureTextEntry={!isPasswordVisible}
            selectionColor={Colors.icon}
            onFocus={() => setIsFocused(name)}
            value={value}
            onBlur={() => setIsFocused(false)}
            onChangeText={newValue => onChangeText(name, newValue)}
            style={[style.m16, styles.input]}
            autoCapitalize={autoCapitalize}
          />

          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Ionicons
              name={!isPasswordVisible ? 'eye-off' : 'eye'}
              color={Colors.disable}
              size={20}
            />
          </TouchableOpacity>
        </View>

        <ErrorMessage error={getErrors()?.error} />
      </Fragment>
    );
  }

  if (type === 'textarea') {
    return (
      <>
        <TextInput
          placeholder={placeholder}
          multiline={multiline}
          value={value}
          textAlignVertical="top"
          numberOfLines={numberOfLines}
          placeholderTextColor={Colors.disable2}
          onFocus={() => setIsFocused(name)}
          onBlur={() => setIsFocused(false)}
          selectionColor={Colors.icon}
          onChangeText={newValue => onChangeText(name, newValue)}
          maxLength={maxLength}
          style={[
            style.m16,
            {
              color: Colors.active,
              marginLeft: 5,
              flex: 1,
              borderRadius: 15,
              borderColor: inputBorderColor,
              borderWidth: 1,
              paddingHorizontal: 20,
              paddingVertical: 15,
              marginTop: 10,
            },
          ]}
        />

        <ErrorMessage error={getErrors()?.error} />
      </>
    );
  }

  if (v === 'v2') {
    return (
      <View style={{ marginTop: 15 }}>
        <Text style={[style.m15, styles.label]}>{label}</Text>
        <TextInput
          placeholder={placeholder}
          {...props}
          value={value}
          keyboardType={keyboardType}
          placeholderTextColor={Colors.disable2}
          onFocus={() => setIsFocused(name)}
          onBlur={() => setIsFocused(false)}
          selectionColor={Colors.icon}
          onChangeText={newValue => onChangeText(name, newValue)}
          maxLength={maxLength}
          editable={editable}
          autoCapitalize={autoCapitalize}
          style={[
            style.r14,
            {
              color: Colors.active,
              marginLeft: 5,
              borderRadius: 10,
              borderColor: inputBorderColor,
              backgroundColor: !editable ? Colors.iconbg : 'transparent',
              borderWidth: 1,
              paddingHorizontal: 12,
              paddingRight: rightIcon ? 40 : 12,
            },
          ]}
        />

        {rightIcon && (
          <View style={{ position: 'absolute', top: 40, right: 15 }}>
            {rightIcon}
          </View>
        )}

        <ErrorMessage error={getErrors()?.error} />
      </View>
    );
  }

  return (
    <Fragment>
      <View
        style={[
          style.inputContainer,
          {
            marginTop: 20,
            borderColor: inputBorderColor,
          },
        ]}>
        {icon}
        <TextInput
          {...props}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={Colors.disable2}
          selectionColor={Colors.icon}
          onFocus={() => setIsFocused(name)}
          value={value}
          onBlur={() => setIsFocused(false)}
          onChangeText={newValue => onChangeText(name, newValue)}
          style={[style.m16, styles.input]}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
        />
      </View>

      <ErrorMessage error={getErrors()?.error} />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  input: {
    color: Colors.active,
    flex: 1,
    marginBottom: -8,
    marginLeft: 10,
  },
  label: {
    color: Colors.txt,
    marginLeft: 5,
    marginBottom: 0,
  },
});

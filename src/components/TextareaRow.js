import React, {Fragment, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Colors} from '../theme/color';
import style from '../theme/style';

const ErrorMessage = ({error}) => {
  return (
    error && (
      <Text style={{color: 'red', marginTop: 5, marginLeft: 18}}>{error}</Text>
    )
  );
};

export default function TextareaRow({
  formData,
  setFormData,
  value,
  name,
  placeholder,
  errors,
  setErrors,
  maxLength,
  multiline = true,
  numberOfLines = 4,
  v,
  label,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const getErrors = () => {
    return typeof errors === 'object' && errors[name]
      ? {name, error: errors[name]}
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
    setFormData({...formData, [field]: newValue});
  };

  if (v === 'v2') {
    return (
      <View style={{marginTop: 15}}>
        <Text style={[style.m15, styles.label]}>{label}</Text>
        <TextInput
          placeholder={placeholder}
          multiline={multiline}
          value={value}
          numberOfLines={numberOfLines}
          placeholderTextColor={Colors.disable2}
          onFocus={() => setIsFocused(name)}
          onBlur={() => setIsFocused(false)}
          selectionColor={Colors.icon}
          onChangeText={newValue => onChangeText(name, newValue)}
          maxLength={maxLength}
          textAlignVertical="top"
          style={[
            style.r14,
            {
              color: Colors.active,
              marginLeft: 5,
              borderRadius: 10,
              borderColor: inputBorderColor,
              borderWidth: 1,
              paddingHorizontal: 12,
              paddingVertical: 15,
            },
          ]}
        />

        <ErrorMessage error={getErrors()?.error} />
      </View>
    );
  }

  return (
    <Fragment>
      <TextInput
        placeholder={placeholder}
        multiline={multiline}
        value={value}
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
            borderRadius: 30,
            borderColor: inputBorderColor,
            borderWidth: 1,
            paddingHorizontal: 20,
            marginTop: 10,
          },
        ]}
      />

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

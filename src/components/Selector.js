import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../theme/color';
import style from '../theme/style';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';

const ErrorMessage = ({error}) => {
  return (
    error && (
      <Text style={{color: 'red', marginTop: 5, marginLeft: 18}}>{error}</Text>
    )
  );
};

export default function Selector({
  formData,
  setFormData,
  value,
  name,
  placeholder,
  errors,
  setErrors,
  data,
  v,
  label,
  loading = false,
  alphabeticalOrder = true,
}) {
  const [isFocused, setIsFocused] = useState(false);

  let dropdownData = data;

  if (alphabeticalOrder) {
    dropdownData = data?.sort((a, b) => a?.title.localeCompare(b?.title)) || [];
  }

  const highlightMatchingText = (title, searchText) => {
    const index = title.toLowerCase().indexOf(searchText.toLowerCase());
    if (index === -1) {
      return <Text>{title}</Text>;
    }

    const beforeMatch = title.substring(0, index);
    const matchText = title.substring(index, index + searchText.length);
    const afterMatch = title.substring(index + searchText.length);

    return (
      <Text>
        {beforeMatch}
        <Text style={{color: Colors.txt}}>{matchText}</Text>
        {afterMatch}
      </Text>
    );
  };

  const getErrors = () => {
    return typeof errors === 'object' && errors[name]
      ? {name, error: errors[name]}
      : undefined;
  };
  const error = getErrors();

  const inputBorderColor = error?.name
    ? Colors.danger
    : isFocused === name
    ? Colors.primary
    : Colors.bord;

  const handleSelect = e => {
    if (name === error?.name) {
      setErrors({});
    }

    setFormData({...formData, [name]: e?.id});
  };

  return (
    <View style={{marginTop: 15}}>
      <Text style={[style.m15, styles.label]}>{label}</Text>
      <AutocompleteDropdown
        inputHeight={50}
        clearOnFocus={false}
        closeOnBlur={false}
        closeOnSubmit={false}
        dataSet={dropdownData}
        initialValue={value?.toString() || ''}
        loading={loading}
        ItemSeparatorComponent={''}
        onBlur={() => setIsFocused(true)}
        onFocus={() => setIsFocused(true)}
        textInputProps={{
          placeholder: placeholder,
          placeholderTextColor: Colors.disable,
          style: {
            fontSize: 14,
            color: Colors.txt,
            fontFamily: 'Poppins-Regular',
          },
        }}
        inputContainerStyle={[
          styles.inputContainerStyle,
          {borderColor: inputBorderColor},
        ]}
        renderItem={(item, text) => {
          return (
            <Text style={[style.m14, styles.DDItem]}>
              {highlightMatchingText(item.title, text)}
            </Text>
          );
        }}
        onSelectItem={handleSelect}
      />
      <ErrorMessage error={error?.error} />
    </View>
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
  inputContainerStyle: {
    color: Colors.active,
    marginLeft: 5,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
  },
  DDItem: {
    color: Colors.disable1,
    paddingHorizontal: 17,
    paddingVertical: 8,
  },
});

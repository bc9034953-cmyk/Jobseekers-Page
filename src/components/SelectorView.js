import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Colors } from '../theme/color';
import style from '../theme/style';

const ErrorMessage = ({ error }) => {
  return (
    error && (
      <Text style={{ color: 'red', marginTop: 5, marginLeft: 18 }}>
        {error}
      </Text>
    )
  );
};

const SelectorView = ({
  data,
  formData,
  setFormData,
  value,
  name,
  placeholder,
  errors,
  setErrors,
  label,
  searchPlaceholder = 'Search...',
  showSearch,
  showAlphabetical = true,
  dropdownPosition = 'auto',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  let dropdownData = data;

  if (showAlphabetical) {
    dropdownData =
      data?.sort((a, b) => a?.label?.localeCompare(b?.label)) || [];
  }

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={[style.m14, styles.dropdownItem]}>{item.label}</Text>
      </View>
    );
  };

  const getErrors = () => {
    return typeof errors === 'object' && errors[name]
      ? { name, error: errors[name] }
      : undefined;
  };
  const error = getErrors();

  const inputBorderColor = error?.name
    ? Colors.danger
    : isFocused === name
    ? Colors.primary
    : Colors.bord;

  const handleSelect = item => {
    if (name === error?.name) {
      setErrors({});
    }
    setFormData({ ...formData, [name]: item?.value });
    setIsFocused(false);
  };

  const renderEmpty = () => {
    return (
      <Text style={[style.m14, { textAlign: 'center', paddingVertical: 10 }]}>
        Nothing found
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[style.m15, styles.label]}>{label}</Text>

      <Dropdown
        style={[styles.dropdown, { borderColor: inputBorderColor }]}
        placeholderStyle={[styles.placeholderStyle]}
        selectedTextStyle={[style.m14, styles.selectedTextStyle]}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={dropdownData}
        maxHeight={270}
        containerStyle={[style.shadow, styles.containerStyle]}
        fontFamily="Poppins-Regular"
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        search={showSearch}
        searchPlaceholder={searchPlaceholder}
        dropdownPosition={dropdownPosition}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleSelect}
        renderItem={renderItem}
        flatListProps={{ ListEmptyComponent: renderEmpty() }}
      />

      <ErrorMessage error={error?.error} />
    </View>
  );
};

export default SelectorView;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 5,
    marginTop: 10,
  },
  containerStyle: { marginTop: 8, borderRadius: 10, marginBottom: 10 },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    color: 'red',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    color: Colors.txt,
    marginLeft: 5,
    marginBottom: 0,
  },
  placeholderStyle: {
    fontSize: 14,
    color: Colors.disable,
    paddingHorizontal: 5,
  },
  selectedTextStyle: {
    color: Colors.txt,
    paddingHorizontal: 5,
    fontFamily: 'Poppins-Regular',
  },
  dropdownItem: {
    color: Colors.disable1,
    paddingHorizontal: 17,
    paddingVertical: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 45,
    fontSize: 14,
    color: Colors.txt,
    borderRadius: 8,
  },
});

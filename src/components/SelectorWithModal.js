import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import { Colors } from '../theme/color';
import style from '../theme/style';
import SelectorModal from './SelectorModal';

const ErrorMessage = ({ error }) => {
  return (
    error && (
      <Text style={{ color: 'red', marginTop: 5, marginLeft: 18 }}>
        {error}
      </Text>
    )
  );
};

export default function SelectorWithModal({
  formData,
  setFormData,
  value,
  name,
  placeholder,
  errors,
  setErrors,
  data = [],
  label,
  loading = false,
  creatable = false,
  searchPlaceholder = 'Search',
  searchable = false,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getErrors = () => {
    return typeof errors === 'object' && errors[name]
      ? { name, error: errors[name] }
      : undefined;
  };
  const error = getErrors();

  const getDisplayValue = () => {
    if (!value) return placeholder || 'Select option';

    // First check in the provided data
    const selectedItem = data.find(
      item => item.id === value || item.value === value,
    );

    if (selectedItem) {
      return selectedItem.title || selectedItem.label;
    }

    // If not found in data, it might be a custom item
    if (value) {
      return value;
    }

    return placeholder || 'Select option';
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSelect = item => {
    if (name === error?.name) {
      setErrors({});
    }
    setFormData({ ...formData, [name]: item.id || item.value });
  };

  return (
    <View style={{ marginTop: 15 }}>
      <Text style={[style.m15, styles.label]}>{label}</Text>

      <TouchableOpacity
        style={[styles.inputContainer, error?.name && styles.errorInput]}
        onPress={handleOpenModal}
        activeOpacity={0.7}>
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {getDisplayValue()}
        </Text>
        <Icon name="chevron-down" size={20} color={Colors.disable} />
      </TouchableOpacity>

      <ErrorMessage error={error?.error} />

      <SelectorModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        data={data}
        value={value}
        onSelect={handleSelect}
        label={label}
        creatable={creatable}
        loading={loading}
        searchPlaceholder={searchPlaceholder}
        formData={formData}
        setFormData={setFormData}
        name={name}
        searchable={searchable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: Colors.txt,
    marginLeft: 5,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.bord,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginLeft: 5,
  },
  errorInput: {
    borderColor: Colors.danger,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    color: Colors.txt,
    fontFamily: 'Poppins-Regular',
  },
  placeholderText: {
    color: Colors.disable,
  },
});

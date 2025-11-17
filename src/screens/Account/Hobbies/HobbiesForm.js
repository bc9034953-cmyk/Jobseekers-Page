import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../../theme/color';
import style from '../../../theme/style';
import { getParsedJson, showSuccess } from '../../../utils';
import { usersApiSlice } from '../../users-api-slice';
import { setUserData } from '../../users-slice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HobbiesForm({ isVisible, setIsVisible }) {
  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;
  const dispatch = useDispatch();

  const [inputHobby, setInputHobby] = useState('');
  const [hobbiesList, setHobbiesList] = useState([]);
  const [validationError, setValidationError] = useState('');

  const additionalDetails = getParsedJson(customer?.additional_fields, null);

  const existingHobbies = useMemo(() => {
    return additionalDetails?.hobbies || '';
  }, [additionalDetails]);

  const [updateProfile, { isLoading }] =
    usersApiSlice.useUpdateProfileMutation();

  useEffect(() => {
    if (isVisible) {
      // Load existing hobbies when modal opens
      const hobbiesArray = existingHobbies
        ? existingHobbies
            .split('\n')
            .map(hobby => hobby.trim())
            .filter(hobby => hobby)
        : [];
      setHobbiesList(hobbiesArray);
      setInputHobby('');
      setValidationError('');
    }
  }, [isVisible, existingHobbies]);

  const handleAddHobby = () => {
    const hobby = inputHobby.trim();
    if (!hobby) {
      setValidationError('Please enter a hobby');
      return;
    }
    if (hobbiesList.includes(hobby)) {
      setValidationError('This hobby is already added');
      return;
    }
    setHobbiesList([...hobbiesList, hobby]);
    setInputHobby('');
    setValidationError('');
  };

  const handleRemoveHobby = hobbyToRemove => {
    setHobbiesList(hobbiesList.filter(hobby => hobby !== hobbyToRemove));
  };

  const handleInputChange = text => {
    setInputHobby(text);
    if (validationError) {
      setValidationError('');
    }
    // Check if user typed a comma
    if (text.includes(',')) {
      const hobby = text.replace(',', '').trim();
      if (hobby && !hobbiesList.includes(hobby)) {
        setHobbiesList([...hobbiesList, hobby]);
        setInputHobby('');
        setValidationError('');
      } else if (hobby && hobbiesList.includes(hobby)) {
        setValidationError('This hobby is already added');
        setInputHobby('');
      }
    }
  };

  const handleSave = async () => {
    if (hobbiesList.length === 0) {
      setValidationError('Please add at least one hobby');
      return;
    }

    try {
      const payload = {
        id: customer?.id,
        name: customer?.name,
        AdditionalFields: {
          ...additionalDetails,
          hobbies: hobbiesList.join('\n'),
        },
      };

      const response = await updateProfile(payload).unwrap();

      if (response) {
        dispatch(
          setUserData({
            token: userData?.token,
            customer: response,
          }),
        );
        showSuccess('Hobbies updated successfully.');
        setIsVisible(false);
        setHobbiesList([]);
        setInputHobby('');
        setValidationError('');
      }
    } catch (error) {
      setValidationError(error?.data?.message || 'Failed to update hobbies');
    }
  };

  const handleCancel = () => {
    setIsVisible(false);
    setHobbiesList([]);
    setInputHobby('');
    setValidationError('');
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleCancel}
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[style.s18, { color: Colors.txt }]}>Hobbies</Text>

          <Text style={[style.r12, { color: Colors.txt }]}>
            Add your hobbies and interests to showcase your personality to
            potential employers.
          </Text>
        </View>

        <View style={styles.content}>
          {/* Input Section */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputHobby}
                onChangeText={handleInputChange}
                placeholder="Enter a hobby"
                onSubmitEditing={handleAddHobby}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={[
                  styles.addButton,
                  { display: inputHobby.trim() ? 'flex' : 'none' },
                ]}
                onPress={handleAddHobby}
                disabled={!inputHobby.trim()}>
                <Icon name="plus" size={20} color={Colors.divider} />
              </TouchableOpacity>
            </View>
            {validationError ? (
              <Text style={styles.errorText}>{validationError}</Text>
            ) : null}
          </View>

          {/* Hobbies Pills Section */}
          {hobbiesList.length > 0 && (
            <View style={{ flex: 1, marginTop: 5 }}>
              <View style={styles.pillsContainer}>
                {hobbiesList.map((hobby, index) => (
                  <View key={index} style={styles.pill}>
                    <Text style={[style.r12, { color: Colors.txt }]}>
                      {hobby}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveHobby(hobby)}>
                      <Icon name="close" size={16} color={Colors.txt} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {hobbiesList.length === 0 && (
            <View style={styles.emptyState}>
              <Text
                style={[style.r12, { color: Colors.txt, textAlign: 'center' }]}>
                No hobbies added yet. Start by adding your first hobby above.
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={[style.m14, { color: Colors.primary }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, { opacity: isLoading ? 0.7 : 1 }]}
              onPress={handleSave}
              disabled={isLoading}>
              <Text style={[style.m14, { color: Colors.white }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputSection: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 30,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.txt,
  },
  addButton: {
    padding: 5,
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 12,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    backgroundColor: Colors.primary + '15',
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  removeButton: {
    padding: 2,
    marginLeft: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  bottomBar: {
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: Colors.white,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 22,
    flexDirection: 'row',
  },
  cancelBtn: {
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 18,
  },
});

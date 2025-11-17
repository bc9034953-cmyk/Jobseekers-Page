import {AppBar} from '@react-native-material/core';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button';
import TextInputRow from '../../components/TextInputRow';
import {Colors} from '../../theme/color';
import style from '../../theme/style';
import {showError, showSuccess} from '../../utils';
import {usersApiSlice} from '../users-api-slice';

export default function NewPass() {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const [changePassword, {isLoading}] =
    usersApiSlice.useChangePasswordMutation();

  const handleSubmit = async () => {
    if (!formData?.new_password) {
      setErrors({new_password: 'Password must be at least 8 characters long'});
      return;
    }

    if (formData?.confirm_password !== formData?.new_password) {
      setErrors({
        confirm_password: 'New password and confirm password does not match',
      });
      return;
    }

    try {
      const response = await changePassword({
        new_password: formData?.new_password,
      }).unwrap();

      if (response?.message) {
        showSuccess(response?.message);
      }
    } catch (error) {
      showError(error);
    }
  };

  return (
    <SafeAreaView style={[style.area, {backgroundColor: Colors.bg}]}>
      <StatusBar
        backgroundColor={Colors.bg}
        translucent={false}
        barStyle={'dark-content'}
      />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={[style.main, {backgroundColor: Colors.bg, marginTop: 10}]}>
          <AppBar
            color={Colors.bg}
            elevation={0}
            leading={
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[style.icon]}>
                <Icon name="arrow-back" size={24} color={'#6C6C6C'} />
              </TouchableOpacity>
            }
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{marginTop: 10}}>
            <Text style={[style.m22, {color: Colors.txt, marginTop: 10}]}>
              Change Password
            </Text>

            <TextInputRow
              name="new_password"
              placeholder="Enter new password"
              formData={formData}
              setFormData={setFormData}
              value={formData?.password}
              type="password"
              errors={errors}
              setErrors={setErrors}
            />

            <TextInputRow
              name="confirm_password"
              placeholder="Confirm new password"
              formData={formData}
              setFormData={setFormData}
              value={formData?.password}
              type="password"
              errors={errors}
              setErrors={setErrors}
            />

            <Button
              isLoading={isLoading}
              styles={{marginTop: 20}}
              onPress={handleSubmit}>
              UPDATE
            </Button>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

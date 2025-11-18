import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TextInputRow from '../../components/TextInputRow';
import {Colors} from '../../theme/color';
import style from '../../theme/style';
import ScreenLayout from '../ScreenLayout';
import {usersApiSlice} from '../users-api-slice';
import {showError, showSuccess, detectLoginMethod} from '../../utils';
import Button from '../../components/Button';
import useAsyncStorage from '../../utils/useAsyncStorage';

export default function Forgot() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [forgotEmailPassword, {isLoading: emailLoading}] =
    usersApiSlice.useForgotEmailPasswordMutation();

  const [forgotMobilePassword, {isLoading: mobileLoading}] =
    usersApiSlice.useForgotMobilePasswordMutation();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: '',
  });

  const {value: lastLoggedInUsername} = useAsyncStorage(
    'last_logged_in_username',
    true,
  );

  const isLoading = emailLoading || mobileLoading;

  useEffect(() => {
    if (lastLoggedInUsername) {
      setFormData(_prev => ({username: lastLoggedInUsername}));
    }
  }, [isFocused, lastLoggedInUsername]);

  const handleSubmit = async () => {
    if (!formData?.username) {
      setErrors({username: 'Please enter your email or mobile number'});
      return;
    }

    const loginMethod = detectLoginMethod(formData?.username);
    if (!loginMethod) {
      setErrors({
        username: 'Please enter a valid email address or mobile number',
      });
      return;
    }

    try {
      let response;

      if (loginMethod === 'email') {
        response = await forgotEmailPassword({
          email: formData?.username,
        }).unwrap();
      } else {
        response = await forgotMobilePassword({
          mobile_number: formData?.username,
        }).unwrap();
      }

      if (response?.message) {
        showSuccess(response?.message, 5000);

        if (loginMethod === 'email') {
          navigation.navigate('Otp', {email: formData?.username});
        } else {
          navigation.navigate('Otp', {mobile: formData?.username});
        }
      }
    } catch (error) {
      showError(error);
    }
  };

  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 10}}>
        <Text style={[style.m22, {color: Colors.txt, marginTop: 10, fontSize : 30, textAlign : 'center', fontWeight : 'bold'}]}>
          Forgot Password?
        </Text>
        <Text style={[style.r16, {color: Colors.disable1 , textAlign : 'center'}]}>
          Please enter the email address or mobile number associated with your
          account
        </Text>

        <TextInputRow
          name="username"
          placeholder="Email or Mobile Number"
          formData={formData}
          setFormData={setFormData}
          value={formData?.username}
          icon={
            <Icon name="person-outline" size={20} color={Colors.disable2} />
          }
          errors={errors}
          setErrors={setErrors}
          autoCapitalize="none"
        />

        <Button
          styles={{marginTop: 30, marginBottom: 20}}
          onPress={handleSubmit}
          isLoading={isLoading}>
          SEND OTP
        </Button>
      </ScrollView>
    </ScreenLayout>
  );
}

import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import OtpInputs from 'react-native-otp-inputs';
import { Colors } from '../../theme/color';
import style from '../../theme/style';
import ScreenLayout from '../ScreenLayout';
import { usersApiSlice } from '../users-api-slice';
import Button from '../../components/Button';
import { showError, showSuccess, detectLoginMethod } from '../../utils';
import { ActivityIndicator } from 'react-native-paper';
import ResendOTP from '../../components/ResendOtp';
import TextInputRow from '../../components/TextInputRow';

export default function Otp(props) {
  const navigation = useNavigation();
  const params = props?.route?.params;
  const [resendLoading, setResendLoading] = useState(false);

  const [changePasswordUsingOtp, { isLoading: changePasswordLoading }] =
    usersApiSlice.useChangePasswordUsingOtpMutation();

  const [otpValue, setOtpValue] = useState(null);
  const [formData, setFormData] = useState({
    new_password: '',
    retype_password: '',
  });
  const [errors, setErrors] = useState({});

  const isLoading = changePasswordLoading;

  // Determine if this is email or mobile verification
  const isEmailVerification = params?.email;
  const isMobileVerification = params?.mobile;
  const username = params?.email || params?.mobile;
  const loginMethod = detectLoginMethod(username);

  const handleSubmit = async () => {
    if (!otpValue || otpValue?.length < 6) {
      showError('Please enter a 6 digit OTP!');
      return;
    }

    if (!formData?.new_password) {
      setErrors({ new_password: 'Please enter new password' });
      return;
    }

    if (!formData?.retype_password) {
      setErrors({ retype_password: 'Please retype password' });
      return;
    }

    if (formData?.new_password !== formData?.retype_password) {
      setErrors({ retype_password: 'Passwords do not match' });
      return;
    }

    if (formData?.new_password.length < 8) {
      setErrors({
        new_password: 'Password must be at least 8 characters long',
      });
      return;
    }

    try {
      const response = await changePasswordUsingOtp({
        field_value: username,
        otp: otpValue,
        new_password: formData?.new_password,
      }).unwrap();

      if (response?.message) {
        showSuccess(response?.message, 7000);
        navigation.navigate('Login');
      }
    } catch (error) {
      showError(error);
    }
  };

  const getVerificationText = () => {
    if (loginMethod === 'email') {
      return (
        <Text style={[style.r14, { color: Colors.disable1, marginTop: 5 }]}>
          Please enter verification code sent to email address{' '}
          <Text style={[style.m14, { color: Colors.active }]}>{username}</Text>{' '}
          and set your new password
        </Text>
      );
    } else {
      return (
        <Text style={[style.r14, { color: Colors.disable1, marginTop: 5 }]}>
          Please enter verification code sent to mobile number{' '}
          <Text style={[style.m14, { color: Colors.active }]}>{username}</Text>{' '}
          and set your new password
        </Text>
      );
    }
  };

  return (
    <ScreenLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 10 }}
        keyboardShouldPersistTaps="always">
        <Text style={[style.m22, { color: Colors.txt, marginTop: 10 }]}>
          Reset Password
        </Text>

        {getVerificationText()}

        <OtpInputs
          Clipboard={Clipboard}
          numberOfInputs={6}
          autoFocus
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            gap: 10,
            maxWidth: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          textAlign="center"
          handleChange={setOtpValue}
          inputStyles={{
            textAlign: 'center',
            height: 50,
            width: 45,
            borderRadius: 12,
            fontSize: 20,
            color: Colors.txt,
            borderColor: Colors.bord,
            borderWidth: 1,
            marginTop: 20,
            alignItems: 'center',
            fontFamily: 'Poppins-SemiBold',
            padding: 0,
          }}
        />

        <View style={{ marginTop: 20, minHeight: 50 }}>
          {resendLoading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <ResendOTP
              maxTime={60}
              email={isEmailVerification ? username : undefined}
              mobile={isMobileVerification ? username : undefined}
              resendLoading={resendLoading}
              setResendLoading={setResendLoading}
            />
          )}
        </View>

        <Text style={[style.m18, { color: Colors.txt, marginTop: 30 }]}>
          Set New Password
        </Text>

        <TextInputRow
          name="new_password"
          placeholder="New Password"
          formData={formData}
          setFormData={setFormData}
          value={formData?.new_password}
          type="password"
          errors={errors}
          setErrors={setErrors}
          autoCapitalize="none"
        />

        <TextInputRow
          name="retype_password"
          placeholder="Retype Password"
          formData={formData}
          setFormData={setFormData}
          value={formData?.retype_password}
          type="password"
          errors={errors}
          setErrors={setErrors}
          autoCapitalize="none"
        />

        <Button
          styles={{ marginTop: 50, marginBottom: 20 }}
          onPress={handleSubmit}
          isLoading={isLoading}>
          UPDATE
        </Button>
      </ScrollView>
    </ScreenLayout>
  );
}

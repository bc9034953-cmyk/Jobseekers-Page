import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import OtpInputs from 'react-native-otp-inputs';
import { Colors } from '../../theme/color';
import style from '../../theme/style';
import ScreenLayout from '../ScreenLayout';
import { usersApiSlice } from '../users-api-slice';
import Button from '../../components/Button';
import { showError, showSuccess } from '../../utils';
import { useDispatch } from 'react-redux';
import { setAuthToken, setUserData } from '../users-slice';
import { ActivityIndicator } from 'react-native-paper';
import ResendOTP from '../../components/ResendOtp';

export default function VerifyEmail(props) {
  const navigation = useNavigation();
  const params = props?.route?.params;
  const dispatch = useDispatch();
  const onVerificationSuccess = props?.onVerificationSuccess;

  const [resendLoading, setResendLoading] = useState(false);

  const [verifyEmailOtp, { isLoading }] =
    usersApiSlice.useVerifyEmailOtpMutation();

  const [forgotEmailPassword] = usersApiSlice.useForgotEmailPasswordMutation();
  const [customerDetails, { isLoading: customerDetailsLoading }] =
    usersApiSlice.useCustomerDetailsMutation();

  const hasLoading = isLoading || customerDetailsLoading;

  const sendEmailOtp = useCallback(() => {
    forgotEmailPassword({ email: params?.email })
      .then(result => {
        console.log('result::', result);
      })
      .catch(err => {
        console.log('error while sending the otp::', err);
      });
  }, [forgotEmailPassword, params?.email]);

  useEffect(() => {
    sendEmailOtp();
  }, [sendEmailOtp]);

  const [otpValue, setOtpValue] = useState(null);

  const handleSubmit = async () => {
    if (!otpValue || otpValue?.length < 6) {
      showError('Please enter a 6 digit OTP!');
      return;
    }

    try {
      const response = await verifyEmailOtp({
        email: params?.email,
        email_verification_otp: otpValue,
      }).unwrap();

      if (response?.customer?.id) {
        dispatch(setUserData(response));
        dispatch(setAuthToken(response?.token));

        const customerResponse = await customerDetails(
          response?.customer?.id,
        ).unwrap();

        if (customerResponse) {
          dispatch(setUserData({ ...response, customer: customerResponse }));

          if (onVerificationSuccess) {
            onVerificationSuccess();
          } else {
            showSuccess('Login successful');

            setTimeout(() => {
              if (navigation?.replace) {
                navigation?.replace('MyTabs', { screen: 'Account' });
              } else {
                navigation.navigate('MyTabs', { screen: 'Account' });
              }
            }, 1000);
          }
        }
      }
    } catch (error) {
      showError(error);
    }
  };

  return (
    <ScreenLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 10 }}
        keyboardShouldPersistTaps="always">
        <Text style={[style.m22, { color: Colors.txt, marginTop: 10 }]}>
          Verify Email
        </Text>
        <Text style={[style.r14, { color: Colors.disable1, marginTop: 5 }]}>
          An OTP has been sent to your email address{' '}
          <Text style={[style.m14, { color: Colors.active }]}>
            {params?.email}
          </Text>
          . Please verify your email to continue using your account.
        </Text>

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
              email={params?.email}
              resendLoading={resendLoading}
              setResendLoading={setResendLoading}
            />
          )}
        </View>

        <Button
          styles={{ marginTop: 50, marginBottom: 20 }}
          onPress={handleSubmit}
          isLoading={hasLoading}>
          VERIFY
        </Button>
      </ScrollView>
    </ScreenLayout>
  );
}

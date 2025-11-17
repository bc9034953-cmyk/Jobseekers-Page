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
import ResendOTP from '../../components/ResendOtp';
import Clipboard from '@react-native-clipboard/clipboard';

export default function VerifyMobile(props) {
  const navigation = useNavigation();
  const params = props?.route?.params;
  const dispatch = useDispatch();
  const onVerificationSuccess = props?.onVerificationSuccess;

  const [resendLoading, setResendLoading] = useState(false);

  const [verifyMobileOtp, { isLoading }] =
    usersApiSlice.useVerifyMobileOtpMutation();

  const [forgotMobilePassword] =
    usersApiSlice.useForgotMobilePasswordMutation();
  const [customerDetails, { isLoading: customerDetailsLoading }] =
    usersApiSlice.useCustomerDetailsMutation();

  const hasLoading = isLoading || customerDetailsLoading;

  const sendMobileOtp = useCallback(() => {
    forgotMobilePassword({ mobile_number: params?.mobile })
      .then(result => {
        console.log('result::', result);
      })
      .catch(err => {
        console.log('error while sending the otp::', err);
      });
  }, [forgotMobilePassword, params?.mobile]);

  useEffect(() => {
    sendMobileOtp();
  }, [sendMobileOtp]);

  const [otpValue, setOtpValue] = useState(null);

  const handleSubmit = async () => {
    if (!otpValue || otpValue?.length < 6) {
      showError('Please enter a 6 digit OTP!');
      return;
    }

    try {
      const response = await verifyMobileOtp({
        mobile_number: params?.mobile,
        mobile_verification_otp: otpValue,
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

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await forgotMobilePassword({ mobile_number: params?.mobile });
      showSuccess('OTP sent successfully!');
    } catch (error) {
      showError(error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <ScreenLayout backScreen="Login" showBackButton={true}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ marginTop: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[style.m22, { color: Colors.txt, marginTop: 20 }]}>
            Verify Mobile Number
          </Text>
        </View>

        <Text style={[style.r16, { color: Colors.disable1 }]}>
          We have sent a verification code to your mobile number{' '}
          <Text style={[style.m16, { color: Colors.txt, marginTop: 10 }]}>
            {params?.mobile}
          </Text>
        </Text>

        <View style={{ marginTop: 30 }}>
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
            handleChange={code => setOtpValue(code)}
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
        </View>

        <Button
          isLoading={hasLoading}
          onPress={handleSubmit}
          styles={{ marginTop: 30, marginBottom: 20 }}>
          VERIFY
        </Button>

        <ResendOTP
          onResend={handleResendOtp}
          isLoading={resendLoading}
          mobile={params?.mobile}
          maxTime={60}
        />
      </ScrollView>
    </ScreenLayout>
  );
}

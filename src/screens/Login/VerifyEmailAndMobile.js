import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/color';
import style from '../../theme/style';
import {
  isEmailVerified,
  isMobileVerified,
  detectLoginMethod,
} from '../../utils';
import { usersApiSlice } from '../users-api-slice';
import { showError, showSuccess } from '../../utils';
import Button from '../../components/Button';
import OtpInputs from 'react-native-otp-inputs';
import Clipboard from '@react-native-clipboard/clipboard';
import ScreenLayout from '../ScreenLayout';
import FeatherIcon from 'react-native-vector-icons/Feather';
import ResendOTP from '../../components/ResendOtp';
import { setAuthToken, setUserData } from '../users-slice';
import { useDispatch } from 'react-redux';

const VerifyEmailAndMobile = props => {
  const navigation = useNavigation();
  const params = props?.route?.params;
  const formData = params?.formData;
  const userData = params?.userData;
  const onVerificationComplete = params?.onVerificationComplete;
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState('mobile'); // "mobile" or "email"
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpValue, setOtpValue] = useState('');

  const [forgotEmailPassword] = usersApiSlice.useForgotEmailPasswordMutation();
  const [resendMobileOtp] = usersApiSlice.useResendMobileOtpMutation();
  const [verifyEmailOtp, { isLoading: emailLoading }] =
    usersApiSlice.useVerifyEmailOtpMutation();
  const [verifyMobileOtp, { isLoading: mobileLoading }] =
    usersApiSlice.useVerifyMobileOtpMutation();

  const isLoading = emailLoading || mobileLoading;

  // Determine which verifications are needed
  const needsEmailVerification = userData && !isEmailVerified(userData);
  const needsMobileVerification = userData && !isMobileVerified(userData);

  // Set initial step based on what needs verification
  useEffect(() => {
    if (needsMobileVerification) {
      setCurrentStep('mobile');
    } else if (needsEmailVerification) {
      setCurrentStep('email');
    }
  }, [needsMobileVerification, needsEmailVerification]);

  const sendEmailOtp = useCallback(() => {
    if (needsEmailVerification) {
      // Extract email from username if it's an email, otherwise use the username
      const email =
        detectLoginMethod(formData?.username) === 'email'
          ? formData?.username
          : userData?.customer?.email;

      forgotEmailPassword({ email })
        .then(result => {
          console.log('Email OTP sent:', result);
          showSuccess('Email OTP sent successfully!');
        })
        .catch(err => {
          console.log('Email OTP error:', err);
          showError('Failed to send email OTP');
        });
    }
  }, [
    formData?.username,
    needsEmailVerification,
    userData,
    forgotEmailPassword,
  ]);

  const sendMobileOtp = useCallback(() => {
    if (needsMobileVerification && userData?.customer?.mobile_number) {
      resendMobileOtp({ mobile_number: userData?.customer?.mobile_number })
        .then(result => {
          console.log('Mobile OTP sent:', result);
          showSuccess('Mobile OTP sent successfully!');
        })
        .catch(err => {
          console.log('Mobile OTP error:', err);
          showError('Failed to send mobile OTP');
        });
    }
  }, [needsMobileVerification, userData, resendMobileOtp]);

  useEffect(() => {
    if (currentStep === 'mobile' && needsMobileVerification) {
      sendMobileOtp();
    } else if (currentStep === 'email' && needsEmailVerification) {
      sendEmailOtp();
    }
  }, [
    currentStep,
    sendMobileOtp,
    sendEmailOtp,
    needsMobileVerification,
    needsEmailVerification,
  ]);

  // Clear OTP input when step changes
  useEffect(() => {
    setOtpValue('');
  }, [currentStep]);

  const handleVerify = async () => {
    if (!otpValue || otpValue?.length < 6) {
      showError('Please enter a 6 digit OTP!');
      return;
    }

    try {
      if (currentStep === 'mobile') {
        await verifyMobileOtp({
          mobile_number: userData?.customer?.mobile_number,
          mobile_verification_otp: otpValue,
        }).unwrap();

        setMobileVerified(true);
        showSuccess('Mobile number verified successfully!');
        setOtpValue('');

        if (needsEmailVerification) {
          setOtpValue('');
          setCurrentStep('email');
        } else {
          if (onVerificationComplete) {
            onVerificationComplete();
          } else {
            navigation.navigate('MyTabs', { screen: 'Account' });
          }
        }
      } else if (currentStep === 'email') {
        const email =
          detectLoginMethod(formData?.username) === 'email'
            ? formData?.username
            : userData?.customer?.email;

        const response = await verifyEmailOtp({
          email: email,
          email_verification_otp: otpValue,
        }).unwrap();

        setEmailVerified(true);
        showSuccess('Email verified successfully!');
        setOtpValue('');

        dispatch(setUserData(response));
        dispatch(setAuthToken(response?.token));

        if (onVerificationComplete) {
          onVerificationComplete();
        } else {
          navigation.navigate('MyTabs', { screen: 'Account' });
        }
      }
    } catch (error) {
      showError(error);
    }
  };

  const renderStepIndicator = () => {
    const showMobileStep = needsMobileVerification;
    const showEmailStep = needsEmailVerification;

    // Only show stepper when both verifications are needed
    if (!showMobileStep || !showEmailStep) {
      return null;
    }

    return (
      <View style={styles.stepperContainer}>
        <View style={styles.stepperCard}>
          <View style={styles.stepIndicator}>
            <View
              style={[
                styles.stepNumber,
                mobileVerified
                  ? styles.completedStepNumber
                  : currentStep === 'mobile'
                  ? styles.activeStepNumber
                  : styles.inactiveStepNumber,
              ]}>
              {mobileVerified ? (
                <FeatherIcon name="check" size={16} color={Colors.white} />
              ) : (
                <Text
                  style={[
                    styles.stepNumberText,
                    {
                      color:
                        currentStep === 'mobile' ? Colors.white : Colors.txt,
                    },
                  ]}>
                  1
                </Text>
              )}
            </View>
            <Text style={styles.stepLabel}>Mobile</Text>
          </View>

          <View style={styles.stepLine} />

          <View style={styles.stepIndicator}>
            <View
              style={[
                styles.stepNumber,
                emailVerified
                  ? styles.completedStepNumber
                  : currentStep === 'email'
                  ? styles.activeStepNumber
                  : styles.inactiveStepNumber,
              ]}>
              {emailVerified ? (
                <FeatherIcon name="check" size={16} color={Colors.white} />
              ) : (
                <Text
                  style={[
                    styles.stepNumberText,
                    {
                      color:
                        currentStep === 'email' ? Colors.white : Colors.txt,
                    },
                  ]}>
                  2
                </Text>
              )}
            </View>
            <Text style={styles.stepLabel}>Email</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    const isMobileStep = currentStep === 'mobile';
    const contactInfo = isMobileStep
      ? userData?.customer?.mobile_number
      : detectLoginMethod(formData?.username) === 'email'
      ? formData?.username
      : userData?.customer?.email;

    return (
      <View style={styles.contentContainer}>
        <Text style={[style.m22, { color: Colors.txt, marginTop: 20 }]}>
          Verify {isMobileStep ? 'Mobile Number' : 'Email Address'}
        </Text>

        <Text style={styles.description}>
          We have sent a verification code to your{' '}
          {isMobileStep ? 'mobile number' : 'email address'}{' '}
        </Text>

        <Text style={styles.contactInfo}>{contactInfo}</Text>

        <View style={styles.otpContainer}>
          <OtpInputs
            key={currentStep}
            Clipboard={Clipboard}
            numberOfInputs={6}
            autoFocus
            style={styles.otpInputs}
            textAlign="center"
            autofillFromClipboard
            handleChange={setOtpValue}
            inputStyles={styles.otpInput}
          />
        </View>

        <View style={{ width: '100%' }}>
          <Button
            styles={styles.verifyButton}
            onPress={handleVerify}
            isLoading={isLoading}>
            VERIFY
          </Button>
        </View>

        <ResendOTP
          maxTime={60}
          email={
            currentStep === 'email'
              ? detectLoginMethod(formData?.username) === 'email'
                ? formData?.username
                : userData?.customer?.email
              : undefined
          }
          mobile={
            currentStep === 'mobile'
              ? userData?.customer?.mobile_number
              : undefined
          }
          resendLoading={false}
          setResendLoading={() => {}}
        />
      </View>
    );
  };

  if (!formData?.username || !userData) {
    return null;
  }

  return (
    <ScreenLayout backScreen="Login" showBackButton={true}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ marginTop: 10 }}>
        {renderStepIndicator()}
        {renderContent()}
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = {
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  stepTitle: {
    ...style.m16,
    color: Colors.txt,
    marginBottom: 10,
  },
  description: {
    ...style.r14,
    color: Colors.disable1,
    textAlign: 'center',
  },
  contactInfo: {
    ...style.m14,
    color: Colors.primary,
    marginBottom: 20,
  },
  otpContainer: {
    width: '100%',
    marginBottom: 30,
  },
  otpInputs: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 10,
    maxWidth: 300,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  otpInput: {
    textAlign: 'center',
    height: 45,
    width: 40,
    borderRadius: 10,
    fontSize: 18,
    color: Colors.txt,
    borderColor: Colors.bord,
    borderWidth: 1,
    alignItems: 'center',
    fontFamily: 'Poppins-SemiBold',
    padding: 0,
  },
  verifyButton: {
    marginBottom: 15,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  stepperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 250,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
  },
  stepNumber: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumberText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepLabel: {
    ...style.r12,
    color: Colors.txt,
  },
  stepLine: {
    height: 2,
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: Colors.icon,
  },
  activeStepNumber: {
    backgroundColor: Colors.primary,
  },
  inactiveStepNumber: {
    backgroundColor: Colors.divider,
    color: Colors.txt,
  },
  completedStepNumber: {
    backgroundColor: Colors.green,
  },
};

export default VerifyEmailAndMobile;

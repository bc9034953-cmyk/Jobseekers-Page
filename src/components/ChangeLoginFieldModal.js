import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {Colors} from '../theme/color';
import style from '../theme/style';
import Button from './Button';
import {showError, showSuccess, validateEmail, isValidMobile} from '../utils';
import {usersApiSlice} from '../screens/users-api-slice';
import {useDispatch} from 'react-redux';
import {setUserData, setAuthToken} from '../screens/users-slice';
import OtpInputs from 'react-native-otp-inputs';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/Ionicons';

const ChangeLoginFieldModal = ({
  openModal,
  setOpenModal,
  field, // "email" or "mobile_number"
  currentValue,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState('input'); // "input" or "otp"
  const [newValue, setNewValue] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const [changeLoginField] = usersApiSlice.useChangeLoginFieldMutation();
  const [changeLoginFieldConfirmation] =
    usersApiSlice.useChangeLoginFieldConfirmationMutation();

  const toggleModal = () => {
    setOpenModal(!openModal);
    // Reset state when modal is closed
    if (openModal) {
      setStep('input');
      setNewValue('');
      setOtp('');
      setLoading(false);
      setOtpLoading(false);
      setRemainingTime(0);
      setCanResend(false);
    }
  };

  // Timer for resend OTP
  useEffect(() => {
    let timer;
    if (remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [remainingTime]);

  const handleSubmitNewValue = async () => {
    if (!newValue) {
      showError(
        `Please enter your new ${
          field === 'email' ? 'email' : 'mobile number'
        }`,
      );
      return;
    }

    if (field === 'email') {
      const emailValidation = validateEmail(newValue);
      if (emailValidation) {
        showError(emailValidation);
        return;
      }
    }

    if (field === 'mobile_number') {
      if (!isValidMobile(newValue)) {
        showError('Please enter a valid mobile number');
        return;
      }
    }

    // Check if new value is same as current
    if (newValue === currentValue) {
      showError(
        `New ${
          field === 'email' ? 'email' : 'mobile number'
        } cannot be the same as current ${
          field === 'email' ? 'email' : 'mobile number'
        }`,
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        field: field,
        new_value: newValue,
      };

      const response = await changeLoginField(payload).unwrap();

      if (response?.message) {
        showSuccess(response.message);
        setStep('otp');
        setRemainingTime(60); // Start 60 second timer
        setCanResend(false);
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      showError('Please enter OTP');
      return;
    }

    if (otp.length < 6) {
      showError('Please enter a valid 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    try {
      const payload = {
        field: field,
        otp: otp,
      };

      const response = await changeLoginFieldConfirmation(payload).unwrap();

      if (response?.token) {
        const {token, customer} = response;

        // Update Redux store with new customer data
        dispatch(setUserData({token, customer}));
        dispatch(setAuthToken(token));

        if (onSuccess) {
          onSuccess(newValue);
        }
        showSuccess(
          `${
            field === 'email' ? 'Email' : 'Mobile number'
          } updated successfully!`,
        );
        toggleModal();
      }
    } catch (error) {
      showError(error);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) {
      return;
    }

    setOtpLoading(true);
    try {
      const payload = {
        field: field,
        new_value: newValue,
      };

      const response = await changeLoginField(payload).unwrap();

      if (response?.message) {
        showSuccess('OTP resent successfully');
        setRemainingTime(60);
        setCanResend(false);
      }
    } catch (error) {
      showError(error);
    } finally {
      setOtpLoading(false);
    }
  };

  const getFieldLabel = () => {
    return field === 'email' ? 'Email Address' : 'Mobile Number';
  };

  const getFieldPlaceholder = () => {
    return field === 'email'
      ? 'Enter your new email address'
      : 'Enter your new mobile number';
  };

  const getFieldType = () => {
    return field === 'email' ? 'email-address' : 'number-pad';
  };

  const renderInputStep = () => (
    <View style={{padding: 20}}>
      <View style={{alignItems: 'center', marginBottom: 20}}>
        <Text style={[style.m18, {color: Colors.txt, marginBottom: 10}]}>
          Change {getFieldLabel()}
        </Text>
        <Text
          style={[style.r14, {color: Colors.disable1, textAlign: 'center'}]}>
          Enter your new {field === 'email' ? 'email' : 'mobile number'}. An OTP
          will be sent for verification.
        </Text>
      </View>

      <View style={{marginBottom: 15}}>
        <Text style={[style.m14, {color: Colors.txt, marginBottom: 8}]}>
          Current {getFieldLabel()}
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: Colors.bord,
            borderRadius: 8,
            padding: 12,
            color: Colors.disable1,
            backgroundColor: Colors.iconbg,
          }}
          value={currentValue}
          editable={false}
        />
      </View>

      <View style={{marginBottom: 20}}>
        <Text style={[style.m14, {color: Colors.txt, marginBottom: 8}]}>
          New {getFieldLabel()} *
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: Colors.bord,
            borderRadius: 8,
            padding: 12,
            color: Colors.txt,
          }}
          placeholder={getFieldPlaceholder()}
          value={newValue}
          onChangeText={setNewValue}
          keyboardType={getFieldType()}
        />
      </View>

      <Button onPress={handleSubmitNewValue} isLoading={loading}>
        Send OTP
      </Button>
    </View>
  );

  const renderOtpStep = () => (
    <View style={{padding: 20}}>
      <View style={{alignItems: 'center', marginBottom: 20}}>
        <Text style={[style.m18, {color: Colors.txt, marginBottom: 10}]}>
          Verify OTP
        </Text>
        <Text
          style={[style.r14, {color: Colors.disable1, textAlign: 'center'}]}>
          An OTP has been sent to{' '}
          <Text style={{fontWeight: 'bold'}}>{currentValue}</Text>. Please enter
          the 6-digit code to verify your new{' '}
          {field === 'email' ? 'email' : 'mobile number'}.
        </Text>
      </View>

      <View style={{marginBottom: 20}}>
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
          handleChange={setOtp}
          inputStyles={{
            textAlign: 'center',
            height: 50,
            width: 45,
            borderRadius: 12,
            fontSize: 20,
            color: Colors.txt,
            borderColor: Colors.bord,
            borderWidth: 1,
            alignItems: 'center',
            fontFamily: 'Poppins-SemiBold',
            padding: 0,
          }}
        />
      </View>

      <View style={{marginBottom: 20, alignItems: 'center'}}>
        {remainingTime > 0 ? (
          <Text style={[style.r14, {color: Colors.disable1}]}>
            You can resend the OTP in{' '}
            <Text style={{fontWeight: 'bold'}}>{remainingTime}</Text> seconds
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResendOtp} disabled={otpLoading}>
            <Text style={[style.r14, {color: Colors.primary}]}>
              {otpLoading ? 'Resending...' : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Button onPress={handleVerifyOtp} isLoading={otpLoading}>
        Verify & Update
      </Button>

      <TouchableOpacity
        onPress={() => setStep('input')}
        style={{alignItems: 'center', marginTop: 15}}>
        <Text style={[style.r14, {color: Colors.primary}]}>
          ← Back to change {field === 'email' ? 'email' : 'mobile number'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={openModal}
      transparent={true}
      animationType="slide"
      onRequestClose={toggleModal}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 12,
            width: '90%',
            maxWidth: 400,
            maxHeight: '80%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: Colors.bord,
            }}>
            <View />
            <TouchableOpacity onPress={toggleModal}>
              <Icon name="close" size={24} color={Colors.txt} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {step === 'input' ? renderInputStep() : renderOtpStep()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ChangeLoginFieldModal;

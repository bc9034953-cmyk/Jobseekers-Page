import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import TextInputRow from '../../components/TextInputRow';
import { Colors } from '../../theme/color';
import style from '../../theme/style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  isValidMobile,
  showError,
  showSuccess,
  validateEmail,
} from '../../utils';
import { usersApiSlice } from '../users-api-slice';
import Button from '../../components/Button';
import useAsyncStorage from '../../utils/useAsyncStorage';
import Configs from '../../utils/Configs';
import ScreenLayout from '../ScreenLayout';

export default function Signup() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [signup, { isLoading }] = usersApiSlice.useSignupMutation();

  const [formData, setFormData] = useState({
    password: '',
    name: '',
    email: '',
    mobile_number: '',
    confirm_password: '',
    customer_type: 2,
  });

  const [errors, setErrors] = useState({});
  const [iagree, setIagree] = useState(false);

  const { value: customerType, fetchData } = useAsyncStorage(
    Configs.USER_TYPE_STORAGE_KEY,
  );

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [fetchData, isFocused]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      customer_type: customerType,
    }));
  }, [isFocused, customerType]);

  const handleSignup = async () => {
    if (!formData?.name) {
      setErrors({ name: 'Please enter your full name' });
      return;
    }

    if (!isValidMobile(formData.mobile_number)) {
      setErrors({ mobile_number: 'Please enter a valid mobile number' });
      return;
    }

    if (validateEmail(formData?.email)) {
      setErrors({ email: validateEmail(formData?.email) });
      return;
    }

    if (!formData?.password) {
      setErrors({ password: 'Please enter your password' });
      return;
    } else if (formData.password.length < 8) {
      setErrors({ password: 'Password should be at least 8 characters' });
      return;
    } else if (formData.password !== formData.confirm_password) {
      setErrors({
        confirm_password: 'Password and confirm password do not match',
      });
      return;
    }

    if (!iagree) {
      showError('Please agree to the terms and conditions');
      return;
    }

    try {
      // Store email for last logged in
      AsyncStorage.setItem('last_logged_in_username', formData.email);

      const response = await signup(formData).unwrap();

      if (response) {
        showSuccess('Signup successful');

        // Navigate to verification screen with user data
        navigation.navigate('VerifyEmailAndMobile', {
          formData: {
            username: formData.email, // Use email as username for verification
          },
          userData: { customer: response },
          onVerificationComplete: () => {
            showSuccess('Account verified successfully!');
            setTimeout(() => {
              navigation.navigate('MyTabs', { screen: 'Account' });
            }, 1000);
          },
        });
      }
    } catch (error) {
      console.log('signup error::', error);
      showError(error);
    }
  };

  const customerTypeName = customerType === 1 ? 'Employer' : 'Candidate';

  return (
    <ScreenLayout title={customerTypeName}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ marginTop: 10 }}>
        <Text style={[style.m22, { color: Colors.txt, marginTop: 10 }]}>
          Create an Account
        </Text>
        <Text style={[style.r16, { color: Colors.disable1 }]}>
          Please fill registration form below
        </Text>

        <TextInputRow
          placeholder="Full Name"
          name="name"
          formData={formData}
          setFormData={setFormData}
          value={formData?.name}
          icon={<FeatherIcon name="user" size={20} color={Colors.disable2} />}
          errors={errors}
          setErrors={setErrors}
        />

        <TextInputRow
          placeholder="Mobile Number"
          type="number"
          formData={formData}
          setFormData={setFormData}
          value={formData?.mobile_number}
          name="mobile_number"
          icon={<FeatherIcon name="phone" size={20} color={Colors.disable2} />}
          errors={errors}
          setErrors={setErrors}
          maxLength={10}
          keyboardType="number-pad"
        />

        <TextInputRow
          name="email"
          placeholder="Email"
          formData={formData}
          setFormData={setFormData}
          value={formData?.email}
          icon={<Icon name="mail-outline" size={20} color={Colors.disable2} />}
          errors={errors}
          setErrors={setErrors}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInputRow
          formData={formData}
          setFormData={setFormData}
          value={formData?.password}
          name="password"
          type="password"
          placeholder="Password"
          errors={errors}
          setErrors={setErrors}
        />

        <TextInputRow
          formData={formData}
          setFormData={setFormData}
          type="password"
          value={formData?.confirm_password}
          name="confirm_password"
          placeholder="Confirm Password"
          errors={errors}
          setErrors={setErrors}
        />

        {/* Terms and Conditions Checkbox */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, iagree && styles.checkboxChecked]}
            onPress={() => setIagree(!iagree)}>
            {iagree && (
              <FeatherIcon name="check" size={16} color={Colors.white} />
            )}
          </TouchableOpacity>
          <View style={styles.checkboxTextContainer}>
            <Text style={styles.checkboxText}>
              I agree to the{' '}
              <Text
                onPress={() => {
                  navigation.navigate('CmsPage', {
                    title: 'Terms & Condition',
                    url_slug: 'terms-and-conditions',
                  });
                }}
                style={styles.termsLink}>
                Terms and conditions
              </Text>
            </Text>
          </View>
        </View>

        <Button
          onPress={handleSignup}
          styles={{ marginTop: 30, marginBottom: 20 }}
          isLoading={isLoading}
          disabled={!iagree}>
          SIGN UP
        </Button>

        <View
          style={[
            style.divider,
            { backgroundColor: '#F3ECF8', marginVertical: 20 },
          ]}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
            justifyContent: 'center',
            marginTop: 30,
          }}>
          <Text
            style={[
              style.r14,
              { color: Colors.disable2, textAlign: 'center' },
            ]}>
            Already a member?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[style.m14, style.textLink]}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = {
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.disable2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxTextContainer: {
    flex: 1,
    marginTop: 2,
  },
  checkboxText: {
    ...style.r14,
    color: Colors.disable1,
    lineHeight: 20,
  },
  termsLink: {
    ...style.m14,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
};

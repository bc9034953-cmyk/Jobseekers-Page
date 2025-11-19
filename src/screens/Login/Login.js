import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import Button from '../../components/Button';
import TextInputRow from '../../components/TextInputRow';
import { Colors } from '../../theme/color';
import style from '../../theme/style';
import {
  detectLoginMethod,
  isEmailVerified,
  isMobileVerified,
  showError,
  showSuccess,
} from '../../utils';
import Configs from '../../utils/Configs';
import useAsyncStorage from '../../utils/useAsyncStorage';
import ScreenLayout from '../ScreenLayout';
import { usersApiSlice } from '../users-api-slice';
import { setAuthToken, setUserData } from '../users-slice';

export default function Login() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const [login, { isLoading: loginLoading }] = usersApiSlice.useLoginMutation();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    customer_type: 2,
  });
  const [errors, setErrors] = useState({});

  const { value: customerType, fetchData } = useAsyncStorage(
    Configs.USER_TYPE_STORAGE_KEY,
  );
  const { value: lastLoggedInUsername } = useAsyncStorage(
    'last_logged_in_username',
    true,
  );

  const [customerDetails, { isLoading: customerDetailsLoading }] =
    usersApiSlice.useCustomerDetailsMutation();

  const isLoading = loginLoading || customerDetailsLoading;

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [fetchData, isFocused]);

  useEffect(() => {
    if (lastLoggedInUsername) {
      setFormData(prev => ({ ...prev, username: lastLoggedInUsername }));
    }

    if (customerType) {
      setFormData(prev => ({
        ...prev,
        customer_type: customerType,
      }));
    }
  }, [isFocused, customerType, lastLoggedInUsername]);

  // TODO: Remove this after testing
  // useEffect(() => {
  //   if (isFocused) {
  //     if (customerType === 1) {
  //       setFormData({
  //         username: 'asaifindia+emp@gmail.com',
  //         password: 'P12345678',
  //         customer_type: 1,
  //       });
  //     } else {
  //       setFormData({
  //         username: 'asaifindia+1@gmail.com',
  //         password: 'P12345678',
  //         customer_type: 2,
  //       });
  //     }

  //     console.warn('testing credentials set');
  //   }
  // }, [isFocused, customerType]);

  const handleLogin = async () => {
    if (!formData?.username) {
      setErrors({ username: 'Please enter your email or mobile number' });
      return;
    }

    const loginMethod = detectLoginMethod(formData?.username);
    if (!loginMethod) {
      setErrors({
        username: 'Please enter a valid email address or mobile number',
      });
      return;
    }

    if (!formData?.password) {
      setErrors({ password: 'Please enter your password' });
      return;
    }

    if (formData?.password?.length < 8) {
      setErrors({ password: 'Password should be at least 8 characters' });
      return;
    }

    try {
      // Store username for last logged in (both email and mobile)
      AsyncStorage.setItem('last_logged_in_username', formData.username);

      const response = await login({
        username: formData.username,
        password: formData.password,
        login_method: loginMethod,
        customer_type: formData.customer_type,
      }).unwrap();

      if (response?.customer?.customer_type !== formData.customer_type) {
        showError('Please select correct customer type');
        return;
      }

      // Check if user needs verification (email or mobile)
      const needsEmailVerification = response && !isEmailVerified(response);
      const needsMobileVerification = response && !isMobileVerified(response);

      if (needsEmailVerification || needsMobileVerification) {
        // If both email and mobile need verification, navigate to the combined screen
        if (needsEmailVerification && needsMobileVerification) {
          navigation.navigate('VerifyEmailAndMobile', {
            formData: formData,
            userData: response,
            onVerificationComplete: () => {
              showSuccess('Account verified successfully!');
              setTimeout(() => {
                navigation.navigate('MyTabs', { screen: 'Account' });
              }, 1000);
            },
          });
          return;
        }

        // If only one needs verification, navigate to the specific screen
        if (loginMethod === 'email') {
          navigation.navigate('VerifyEmail', { email: formData?.username });
        } else {
          navigation.navigate('VerifyMobile', { mobile: formData?.username });
        }
        return;
      }

      if (response?.customer?.customer_type === formData.customer_type) {
        dispatch(setUserData(response));
        dispatch(setAuthToken(response?.token));

        if (response?.customer?.id) {
          const customerResponse = await customerDetails(
            response?.customer?.id,
          ).unwrap();

          if (customerResponse) {
            dispatch(setUserData({ ...response, customer: customerResponse }));
            showSuccess('Login successful');
            setTimeout(() => {
              navigation.navigate('MyTabs', { screen: 'Account' });
            }, 1000);
          }
        }
      }
    } catch (error) {
      console.log('login error::', error);
      showError(error);
    }
  };

  const homeIconButton = () => {
    return (
      <Pressable
        style={{
          paddingVertical: 10,
          paddingLeft: 30,
          paddingRight: 10,
          marginRight: -10,
        }}
        onPress={() => navigation.navigate('MyTabs')}>
        <FeatherIcon name="home" size={20} color={Colors.disable2} />
      </Pressable>
    );
  };

  return (
    <ScreenLayout
      backScreen="On1"
      imageSource={require('../../../assets/image/swap.png')}
      title={customerType === 1 ? 'Employer' : 'Candidate'}
      rightIconComp={homeIconButton()}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ marginTop: 10 }}>
        <View style={{ width: '100%', alignItems: 'center' }}>
           <Text
           style={[
              style.m22,
               { 
                 color: Colors.txt,
                 marginTop: 20,
                 fontSize: 30,
                 fontWeight: "bold",
                 textAlign: 'center'  // optional
               }
            ]}
               >
                    Sign In
           </Text>
        </View>

        <Text style={[style.r16, { color: Colors.disable1 ,textAlign: 'center' }]}>
          Please sign in to your registered account
        </Text>

        <TextInputRow
          name="username"
          placeholder="Email or Mobile Number"
          formData={formData}
          setFormData={setFormData}
          value={formData?.username}
          icon={<FeatherIcon name="user" size={20} color={Colors.disable2} />}
          errors={errors}
          setErrors={setErrors}
          autoCapitalize="none"
         
          
        />

        <TextInputRow
          name="password"
          placeholder="Password"
          formData={formData}
          setFormData={setFormData}
          value={formData?.password}
          type="password"
          errors={errors}
          setErrors={setErrors}
          icon={<FeatherIcon name="lock" size={20} color={Colors.disable2} />}
          autoCapitalize="none"
          showEyeIcon={true}
        />

      <View>
        
      </View>
       <View style={{ alignItems: 'center' }}>
  <Button
    isLoading={isLoading}
    onPress={handleLogin}
    styles={{
      marginTop: 30,
      marginBottom: 20,
      borderRadius: 6,
      width: 266,
      height: 50,
    }}>
    LOGIN
  </Button>
</View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={[style.r14, { color: Colors.disable2 }]}>
            Forgot your password ?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
            <Text
              style={[style.m14, { color: Colors.primary, marginLeft: 10 }]}>
              Reset here
            </Text>
          </TouchableOpacity>
        </View>

        {/* <Text
              style={[
                style.r14,
                {color: Colors.disable2, textAlign: 'center', marginTop: 30},
              ]}>
              Or sign in with
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <View style={[style.btnoutline, {width: width / 3.5}]}>
                <Image
                  source={require('../../../assets/image/a1.png')}
                  resizeMode="stretch"
                  style={{height: 30, width: 30}}
                />
              </View>
              <View
                style={[
                  style.btnoutline,
                  {marginLeft: 15, width: width / 3.5},
                ]}>
                <Image
                  source={require('../../../assets/image/a2.png')}
                  resizeMode="stretch"
                  style={{height: 30, width: 30}}
                />
              </View>
            </View> */}

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
            marginTop: 40,
          }}>
          <Text
            style={[
              style.r14,
              { color: Colors.disable2, textAlign: 'center' },
            ]}>
            Don't have any account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text
              style={[
                style.m14,
                {
                  color: Colors.primary,
                  textAlign: 'center',
                  textDecorationLine: 'underline',
                  marginLeft: 8,
                },
              ]}>
              SIGN UP
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}




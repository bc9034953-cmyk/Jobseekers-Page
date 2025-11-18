import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Button from '../../components/Button';
import {Colors} from '../../theme/color';
import style from '../../theme/style';
import Configs from '../../utils/Configs';
import useAsyncStorage from '../../utils/useAsyncStorage';
import ScreenLayout from '../ScreenLayout';
import { height, width } from '../../theme';



// choose your Account type screen 1

export default function On1() {
  const navigation = useNavigation();

  const {value: customerType, fetchData} = useAsyncStorage(
    Configs.USER_TYPE_STORAGE_KEY,
  );

  const onUserTypeSelect = type => {
    AsyncStorage.setItem(Configs.USER_TYPE_STORAGE_KEY, type);
    fetchData();
  };

  return (
    <ScreenLayout showAppBar={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={[
            style.title,
            {color: Colors.txt, marginTop: 80, paddingRight: 50, textAlign : "center", fontSize : 30},
          ]}>
          Choose Your Account Type
        </Text>
        <Text style={[style.r14, {color: Colors.disable1, marginTop: 0, textAlign : "center"}]}>
          Are you looking for a new job or looking for new employee ?
        </Text>

        <View style={{padding: 5, marginTop: 15}}>
          <TouchableOpacity
            onPress={() => onUserTypeSelect('2')}
            style={[
              style.shadow,
              {
                backgroundColor: Colors.bg,
                shadowColor: Colors.active,
                padding: 15,
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 24,
                borderWidth: 1,
                borderColor:
                  customerType === 2 ? Colors.primary : 'transparent',
              },
            ]}>
            <Image
              source={require('../../../assets/image/lookingForJob.png')}
              resizeMode="stretch"
              style={{height: 77, width: 77}}
            />
            <View style={{marginLeft: 10, flex: 1}}>
              <Text style={[style.s16, {color: Colors.primary}]}>
                I NEED A JOB
              </Text>
              <Text style={[style.r14, {color: Colors.txt, marginTop: 3}]}>
                Finding a job here never been easier than before
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{padding: 5, marginTop: 15, marginBottom: 20}}>
          <TouchableOpacity
            onPress={() => onUserTypeSelect('1')}
            style={[
              style.shadow,
              {
                backgroundColor: Colors.bg,
                shadowColor: Colors.active,
                padding: 15,
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 24,
                borderWidth: 1,
                borderColor:
                  customerType === 1 ? Colors.primary : 'transparent',
              },
            ]}>
            <Image
              source={require('../../../assets/image/Recruiter.png')}
              resizeMode="stretch"
              style={{height: 77, width: 77}}
            />
            <View style={{marginLeft: 10, flex: 1}}>
              <Text style={[style.s16, {color: Colors.primary}]}>
                I WANT TO HIRE
              </Text>
              <Text style={[style.r14, {color: Colors.txt, marginTop: 3}]}>
                Let’s recruit your great candidate faster here{' '}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {customerType && (
          
          <Button
  styles={{
    marginTop: 5,
    borderRadius: 6,
    width: 266,
    height: 55,
    alignItems: "center",
    alignSelf: "center"   // 🔥 THIS WILL FIX IT
  }}
  onPress={() => navigation.navigate('Login')}
>
  Next
</Button>
        )}

        {/* TODO: remove later  */}
        {/* <Button
          onPress={() => {
            AsyncStorage.removeItem(Configs.USER_TYPE_STORAGE_KEY);
            AsyncStorage.removeItem('has_introduction_completed');

            fetchData();
          }}
          styles={{marginTop: 50}}>
          Remove
        </Button> */}
      </ScrollView>
    </ScreenLayout>
  );
}

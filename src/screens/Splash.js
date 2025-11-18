import {ImageBackground, SafeAreaView, StatusBar} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import style from '../theme/style';
import {Colors} from '../theme/color';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import useAsyncStorage from '../utils/useAsyncStorage';
import Configs from '../utils/Configs';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Splash() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [showIntroScreen, setShowIntroScreen] = useState(false);

  const userData = useSelector(state => state.users);
  const {value: customerType} = useAsyncStorage(Configs.USER_TYPE_STORAGE_KEY);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleNavigate = useCallback(() => {
    if (showIntroScreen) {
      navigation.navigate('Introduction');
      return;
    }

    if (!customerType) {
      navigation.navigate('On1');
      return;
    }

    if (userData?.authToken) {
      navigation.navigate('MyTabs');
    } else if (customerType) {
      navigation.navigate('Login');
    }
  }, [customerType, showIntroScreen, navigation, userData?.authToken]);

  useEffect(() => {
    if (!loading) {
      handleNavigate();
    }
  }, [handleNavigate, loading]);

  useEffect(() => {
    const fetchAsyncStorage = async () => {
      const hasIntroCompleted = await AsyncStorage.getItem(
        'has_introduction_completed',
      );
      setShowIntroScreen(hasIntroCompleted !== 'yes');
    };

    if (isFocused) {
      fetchAsyncStorage();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={[style.area, {backgroundColor: Colors.bg}]}>
      <StatusBar
        backgroundColor={Colors.bg}
        translucent={false}
        barStyle={'dark-content'}
      />

      <ImageBackground
        source={require('../../assets/image/newSlashScreen.png')}
        resizeMode="cover"
        style={{flex: 1}}
      />
    </SafeAreaView>
  );
}

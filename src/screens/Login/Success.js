import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../../theme/color';
import style from '../../theme/style';
import ScreenLayout from '../ScreenLayout';
import {useDispatch, useSelector} from 'react-redux';
import {setCheckoutRedirectPath} from '../users-slice';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default function Success(props) {
  const navigation = useNavigation();
  const params = props?.route?.params;
  const dispatch = useDispatch();

  const screenData = {
    title: params?.title || 'You are successfull registered!',
    description:
      params?.description || 'Nice to see you again. Let’s find your Job',
    btnText: params?.btnText || "LET'S GO",
    btnLink: params?.btnLink || 'MyTabs',
    redirectParams: params?.redirectParams || {},
  };

  const checkoutRedirectPath = useSelector(
    state => state.users.checkoutRedirectPath,
  );

  const onNavigation = () => {
    navigation.navigate(screenData?.btnLink, screenData.redirectParams);

    if (checkoutRedirectPath?.name) {
      dispatch(setCheckoutRedirectPath({}));
    }
  };

  return (
    <ScreenLayout showBackIcon={false}>
      <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 50}}>
        <Image
          source={require('../../../assets/image/a3.png')}
          resizeMode="stretch"
          style={{
            height: height / 5,
            width: width / 2.3,
            alignSelf: 'center',
            marginTop: 40,
          }}
        />

        <Text
          style={[
            style.m22,
            {color: Colors.txt, marginTop: 30, textAlign: 'center'},
          ]}>
          {screenData?.title}
        </Text>
        <Text
          style={[
            style.r16,
            {
              color: Colors.disable1,
              textAlign: 'center',
              marginTop: 10,
            },
          ]}>
          {screenData?.description}
        </Text>

        <TouchableOpacity
          onPress={onNavigation}
          style={[style.btn, {marginTop: 40, marginBottom: 20}]}>
          <Text style={[style.btntxt, {marginBottom: -8}]}>
            {screenData?.btnText}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenLayout>
  );
}

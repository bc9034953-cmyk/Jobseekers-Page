import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {Colors} from '../../theme/color';
import style from '../../theme/style';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default function IntroItem({item}) {
  return (
    <SafeAreaView style={{width: width}}>
      <StatusBar
        backgroundColor={Colors.bg}
        translucent={false}
        barStyle={'dark-content'}
      />
      <View
        style={{flex: 1, backgroundColor: Colors.bg, justifyContent: 'center'}}>
        <Image
          source={item.bg}
          style={{
            width: width / 1.5,
            height: height / 3,
            resizeMode: 'stretch',
            alignSelf: 'center',
          }}
        />
      </View>
      <View
        style={{paddingHorizontal: 20, flex: 0.7, backgroundColor: Colors.bg}}>
        <Text
          style={[style.title, {textAlign: 'center', color: Colors.active}]}>
          {item.title}
        </Text>
        <Text
          style={[
            style.r14,
            {color: Colors.disable, textAlign: 'center', marginTop: 15},
          ]}>
          {item.subtitle}
        </Text>
      </View>
    </SafeAreaView>
  );
}

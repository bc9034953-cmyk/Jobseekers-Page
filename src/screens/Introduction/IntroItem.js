import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { Colors } from '../../theme/color';
import style from '../../theme/style';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const RenderColoredTitle = ({ item }) => {

  const titleStyle = [
    style.title,
    {
      textAlign: "left",      // 🔥 ALL screens left aligned
      color: Colors.active,
      fontSize: 40,
      lineHeight: 48,
      fontWeight: 'bold',
    },
  ];

  if (item.id === 1) {
    return (
      <Text style={titleStyle}>
        Find Your{"\n"}
        <Text style={{ color: "#7A44FF" }}>Dream Job</Text>{"\n"}
        Here!
      </Text>
    );
  }

  if (item.id === 2) {
    return (
      <Text style={titleStyle}>
        <Text style={{ color: "#7A44FF" }}>Everything</Text>{" "}
        You Need In One App
      </Text>
    );
  }

  if (item.id === 3) {
    return (
      <Text style={titleStyle}>
        Get Selected For Your Dream{"\n"}
        <Text style={{ color: "#7A44FF" }}> Job.</Text>
      </Text>
    );
  }

  return null;
};

export default function IntroItem({ item }) {
  return (
    <SafeAreaView style={{ width: width }}>
      <StatusBar
        backgroundColor={Colors.bg}
        translucent={false}
        barStyle={'dark-content'}
      />

      {/* IMAGE */}
      <View
        style={{ flex: 1, backgroundColor: Colors.bg, justifyContent: 'center' }}>
        <Image
          source={item.bg}
          style={{
            width: width / 1.5,
            height: height / 3,
            alignSelf: 'center',
          }}
        />
      </View>

      {/* TEXT AREA */}
      <View
        style={{
          paddingHorizontal: 20,
          flex: 0.7,
          backgroundColor: Colors.bg,
        }}>

       
        <View
          style={{
            width: '100%',          
            alignSelf: 'flex-start' 
          }}>
          <RenderColoredTitle item={item} />
        </View>

        {/* SUBTITLE */}
        <Text
          style={[
            style.r14,
            {
              color: Colors.disable,
              textAlign: 'left',     // 🔥 Subtitle also left aligned
              marginTop: 15,
            },
          ]}>
          {item.subtitle}
        </Text>
      </View>
    </SafeAreaView>
  );
}

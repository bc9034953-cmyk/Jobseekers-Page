import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Platform,
  Pressable,
} from 'react-native';
import React, {useState, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import style from '../../theme/style';
import {Colors} from '../../theme/color';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppBar} from '@react-native-material/core';
import {getParsedJson} from '../../utils';
import {useSelector} from 'react-redux';
import Configs from '../../utils/Configs';
import {StyleSheet} from 'react-native';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default function Profile() {
  const navigation = useNavigation();

  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;

  const customerAdditional = getParsedJson(customer?.additional_fields, null);
  const profilePicture = customerAdditional
    ? {
        uri: `${Configs.DATA_URL}/customers/120x120-${customerAdditional?.profile_picture}`,
      }
    : require('../../../assets/image/bb.png');

  return (
    <SafeAreaView style={[style.area, {backgroundColor: Colors.bg}]}>
      <StatusBar
        backgroundColor={Colors.bg}
        translucent={false}
        barStyle={'dark-content'}
      />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={[style.main, {backgroundColor: Colors.bg}]}>
          <AppBar
            color={Colors.bg}
            title="Account"
            centerTitle={true}
            titleStyle={[style.subtitle, {color: Colors.txt}]}
            elevation={0}
            leading={<View />}
            trailing={
              <TouchableOpacity>
                <Icon name="ellipsis-vertical" size={24} color={'#6C6C6C'} />
              </TouchableOpacity>
            }
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{marginTop: 10}}>
            <View
              style={{
                height: 90,
                width: 90,
                alignSelf: 'center',
                marginTop: 10,
                borderRadius: 50,
              }}>
              <Image
                style={{width: '100%', height: '100%', borderRadius: 50}}
                source={profilePicture}
                resizeMode="cover"
              />

              <Pressable style={styles.edit}>
                <Icons name="pencil" />
              </Pressable>
            </View>

            <Text
              style={[
                style.subtitle,
                {color: Colors.txt, marginTop: 10, textAlign: 'center'},
              ]}>
              {customer?.name}
            </Text>

            {!customerAdditional?.designation ? (
              <Pressable>
                <Text style={[style.r15, styles.emptyDesignation]}>
                  Add Profile Headline
                </Text>
              </Pressable>
            ) : (
              <Text
                style={[
                  style.r16,
                  {color: '#10152080', textAlign: 'center', lineHeight: 18},
                ]}>
                {customerAdditional?.designation}
              </Text>
            )}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                marginTop: 20,
              }}>
              <Image
                source={require('../../../assets/image/a5.png')}
                resizeMode="stretch"
                style={{width: 68, height: 68}}
              />
              <Image
                source={require('../../../assets/image/a6.png')}
                resizeMode="stretch"
                style={{width: 68, height: 68}}
              />
              <Image
                source={require('../../../assets/image/a7.png')}
                resizeMode="stretch"
                style={{width: 68, height: 68}}
              />
            </View>

            <View
              style={{
                backgroundColor: Colors.primary,
                borderRadius: 14,
                paddingVertical: 15,
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <View style={{flex: 1}}>
                <Text style={[style.s18, {color: Colors.secondary}]}>
                  My Resume
                </Text>
                <Text style={[style.r14, {color: Colors.secondary}]}>
                  david_resume.pdf
                </Text>
              </View>
              <Icon
                name="ellipsis-vertical"
                size={24}
                color={Colors.secondary}
              />
            </View>

            {/* <Text style={[style.m18, {color: Colors.txt, marginTop: 20}]}>
              Skill
            </Text> */}

            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <View
                style={{
                  backgroundColor: '#EAE4F6',
                  borderRadius: 30,
                  height: height / 6.5,
                  width: width / 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('../../../assets/image/a8.png')}
                  resizeMode="stretch"
                  style={{height: 60, width: 60}}
                />
                <Text
                  style={[
                    style.m16,
                    {
                      color: Colors.active,
                      textAlign: 'center',
                      marginTop: 15,
                      lineHeight: 20,
                    },
                  ]}>
                  PHP
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: '#EAE4F6',
                  borderRadius: 30,
                  height: height / 6.5,
                  width: width / 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('../../../assets/image/a9.png')}
                  resizeMode="stretch"
                  style={{height: 60, width: 60}}
                />
                <Text
                  style={[
                    style.m16,
                    {
                      color: Colors.active,
                      textAlign: 'center',
                      marginTop: 15,
                      lineHeight: 20,
                    },
                  ]}>
                  JAVA
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: '#EAE4F6',
                  borderRadius: 30,
                  height: height / 6.5,
                  width: width / 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('../../../assets/image/a10.png')}
                  resizeMode="stretch"
                  style={{height: 60, width: 60}}
                />
                <Text
                  style={[
                    style.m16,
                    {
                      color: Colors.active,
                      textAlign: 'center',
                      marginTop: 15,
                      lineHeight: 20,
                    },
                  ]}>
                  MySQL
                </Text>
              </View>
            </View> */}

            {/* <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20,marginBottom:20}}>
                            <View style={{backgroundColor:'#EAE4F6',borderRadius:30,height:height/6.5,width:width/4,alignItems:'center',justifyContent:'center'}}>
                                <Image source={require('../../../assets/image/a11.png')} resizeMode='stretch' style={{height:60,width:60}}></Image>
                                <Text style={[style.m16,{color:Colors.active,textAlign:'center',marginTop:15,lineHeight:20}]}>React N</Text>
                            </View>
                            <View style={{backgroundColor:'#EAE4F6',borderRadius:30,height:height/6.5,width:width/4,alignItems:'center',justifyContent:'center'}}>
                                <Image source={require('../../../assets/image/a12.png')} resizeMode='stretch' style={{height:60,width:60}}></Image>
                                <Text style={[style.m16,{color:Colors.active,textAlign:'center',marginTop:15,lineHeight:20}]}>CSS</Text>
                            </View>
                            <View style={{width:width/4}}></View>
                        </View> */}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  edit: {
    width: 22,
    height: 22,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.bord,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
  },
  emptyDesignation: {
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

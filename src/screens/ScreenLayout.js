import {AppBar} from '@react-native-material/core';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../theme/color';
import style from '../theme/style';
import AppLoader from '../components/AppLoader';
import {Image} from 'react-native';

export default function ScreenLayout({
  title,
  rightIconComp,
  showBackIcon = true,
  centerTitle,
  backScreen,
  isLoading,
  showAppBar = true,
  backIconName = 'arrow-back',
  imageSource,
  statusBarBgColor = Colors.bg,
  ...props
}) {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={[style.area, {backgroundColor: Colors.bg}]}>
      <StatusBar
        backgroundColor={statusBarBgColor}
        translucent={false}
        barStyle={'dark-content'}
      />

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View
          style={[
            style.main,
            {
              backgroundColor: Colors.bg,
              marginTop: Platform.OS === 'ios' ? 10 : 0,
            },
          ]}>
          {showAppBar && (
            <AppBar
              color={Colors.bg}
              elevation={0}
              title={title}
              centerTitle={centerTitle}
              style={{marginHorizontal: -5}}
              titleStyle={[style.subtitle, {color: Colors.txt}]}
              leading={
                showBackIcon && (
                  <TouchableOpacity
                    onPress={() =>
                      backScreen
                        ? navigation.navigate(backScreen)
                        : navigation.goBack()
                    }
                    style={[style.icon]}>
                    {imageSource ? (
                      <Image
                        source={imageSource}
                        style={{
                          width: 24,
                          height: 24,
                          tintColor: Colors.active,
                        }}
                      />
                    ) : (
                      <Icon
                        name={backIconName}
                        size={24}
                        color={Colors.active}
                      />
                    )}
                  </TouchableOpacity>
                )
              }
              trailing={rightIconComp}
            />
          )}

          {isLoading ? <AppLoader /> : props.children}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

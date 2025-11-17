import { View, Text, Dimensions, TouchableOpacity, FlatList, SafeAreaView, ImageBackground, KeyboardAvoidingView, StatusBar, Image, ScrollView } from 'react-native'
import React, { useState, useContext, useRef } from 'react'
import { Colors } from '../../theme/color'
import style from '../../theme/style'
import { useNavigation } from '@react-navigation/native'
import { Avatar } from 'react-native-paper'
import { AppBar } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import PhoneInput from 'react-native-phone-number-input';

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function Phone() {
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('')
    const phoneInput = useRef(null);

    const [s1, sets1] = useState(false)
    const [s2, sets2] = useState(false)
    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.bg }]}>
            <StatusBar backgroundColor={Colors.bg} translucent={false} barStyle={'dark-content'} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null} >
                <View style={[style.main, { backgroundColor: Colors.bg, marginTop: 10 }]}>

                    <AppBar
                        color={Colors.bg}
                        elevation={0}
                        leading={<TouchableOpacity onPress={() => navigation.navigate('VId')} style={[style.icon]}>
                            <Icon name='arrow-back' size={24} color={Colors.active} />
                        </TouchableOpacity>}
                    />

                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>

                        <Text style={[style.m22, { color: Colors.txt, marginTop: 10 }]}>Phone Number</Text>
                        <Text style={[style.r16, { color: Colors.disable1, marginTop: 5 }]}>Your identity helps you discover new people and opportunities</Text>

                        <PhoneInput
                            selectionColor={Colors.primary}
                            ref={phoneInput}
                            defaultValue={phoneNumber}
                            defaultCode="IN"
                            layout="first"
                            codeTextStyle={{ color: Colors.txt }}
                            textInputProps={{ placeholderTextColor: '#9E9E9E' }}
                            textInputStyle={{ color: Colors.txt }}
                            containerStyle={{
                                height: 64,
                                width: '100%',
                                borderColor: Colors.primary,
                                borderRadius: 50,
                                borderWidth: 1,
                                backgroundColor: Colors.bg,
                                marginTop: 20,
                                marginBottom:20
                            }}
                            textContainerStyle={{
                                paddingVertical: 0,
                                borderRadius: 50,
                                backgroundColor: Colors.bg
                            }}
                            onChangeFormattedText={text => {
                                setPhoneNumber(text);
                            }}
                        />

                    </ScrollView>

                    <TouchableOpacity onPress={() => navigation.navigate('Otp')}
                        style={[style.btn, { marginVertical: 20 }]}>
                        <Text style={[style.btntxt]}>CONTINUE</Text>
                    </TouchableOpacity>


                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
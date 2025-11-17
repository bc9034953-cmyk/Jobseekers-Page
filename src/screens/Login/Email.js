import { View, Text, FlatList, SafeAreaView, Dimensions, StatusBar, KeyboardAvoidingView, ImageBackground, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native'
import React, { useState, useContext, } from 'react'
import { useNavigation } from '@react-navigation/native'
import style from '../../theme/style'
import { Colors } from '../../theme/color'
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppBar } from '@react-native-material/core';

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function Email() {
    const navigation = useNavigation();
    const [isFocused, setIsFocused] = useState(false)
    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.bg }]}>
            <StatusBar backgroundColor='transparent' translucent={true} barStyle={'dark-content'} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View style={[style.main, { backgroundColor: Colors.bg, marginTop: 30 }]}>
                    <AppBar
                        color={Colors.bg}
                        elevation={0}
                        leading={<TouchableOpacity onPress={() => navigation.navigate('VId')} style={[style.icon]}>
                            <Icon name='arrow-back' size={24} color={'#6C6C6C'} />
                        </TouchableOpacity>}
                    />


                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>

                        <Text style={[style.m22, { color: Colors.txt, marginTop: 10 }]}>Email Address</Text>
                        <Text style={[style.r16, { color: Colors.disable1 }]}>Your identity helps you discover new people and opportunities</Text>

                        <View style={[style.inputContainer, { marginTop: 40, borderColor: isFocused === 'Email' ? Colors.primary : Colors.bord, }]}>
                            <Icon name='mail-outline' size={20} color={Colors.disable2}></Icon>
                            <TextInput placeholder='Email'
                                placeholderTextColor={Colors.disable2}
                                selectionColor={Colors.primary}
                                onFocus={() => setIsFocused('Email')}
                                onBlur={() => setIsFocused(false)}
                                style={[style.m16, { color: Colors.active, flex: 1, marginBottom: -8, marginLeft: 10, }]}
                            />
                        </View>



                        <TouchableOpacity onPress={() => navigation.navigate('Otp')}
                            style={[style.btn, { marginTop: 40, marginBottom: 20 }]}>
                            <Text style={[style.btntxt, { marginBottom: -8 }]}>VERIFY YOUR EMAIL</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
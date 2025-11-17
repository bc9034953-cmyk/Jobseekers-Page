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


export default function VId() {
    const navigation = useNavigation();
    const [isFocused, setIsFocused] = useState(false)
    const [isFocused1, setIsFocused1] = useState(false)

    var myBoolean = true;

    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.bg }]}>
            <StatusBar backgroundColor='transparent' translucent={true} barStyle={'dark-content'} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View style={[style.main, { backgroundColor: Colors.bg, marginTop: 30 }]}>
                    <AppBar
                        color={Colors.bg}
                        elevation={0}
                        leading={<TouchableOpacity onPress={() => navigation.navigate('Signup')} style={[style.icon]}>
                            <Icon name='arrow-back' size={24} color={'#6C6C6C'} />
                        </TouchableOpacity>}
                    />

                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>

                        <Text style={[style.m22, { color: Colors.txt, marginTop: 10 }]}>Verify your identity</Text>
                        <Text style={[style.r16, { color: Colors.disable1 }]}>Your identity helps you discover new people and opportunities</Text>

                        <TouchableOpacity
                            onPress={()=> myBoolean=true} 
                            style={[style.inputContainer, { marginTop: 40 ,borderColor:Colors.bord}]}>
                            <Icon name='mail-outline' size={20} color={Colors.active}></Icon>
                            <View style={{ flex: 1, marginLeft: 15 }}>
                                <Text style={[style.s14, { color: Colors.active }]}>Email</Text>
                                <Text style={[style.r11, { color: Colors.disable1, lineHeight: 13 }]}>Verify with your email</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={()=> myBoolean=false}

                            style={[style.inputContainer, { marginTop: 25,borderColor:Colors.bord }]}>
                            <Icon name='call-outline' size={20} color={Colors.active}></Icon>
                            <View style={{ flex: 1, marginLeft: 15 }}>
                                <Text style={[style.s14, { color: Colors.active }]}>Phone Number</Text>
                                <Text style={[style.r11, { color: Colors.disable1, lineHeight: 13 }]}>Verify with your phone number</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                if (myBoolean === true)
                                    navigation.navigate('Email')
                                else
                                    navigation.navigate('Phone')
                            }}
                            style={[style.btn, { marginTop: 50, marginBottom: 20 }]}>
                            <Text style={[style.btntxt, { marginBottom: -8 }]}>CONTINUE</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
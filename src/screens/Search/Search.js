import { View, Text, Dimensions, TouchableOpacity, FlatList, SafeAreaView, ImageBackground, KeyboardAvoidingView, StatusBar, Image, ScrollView, TextInput } from 'react-native'
import React, { useState, useContext, useRef } from 'react'
import { Colors } from '../../theme/color'
import style from '../../theme/style'
import { useNavigation } from '@react-navigation/native'
import { Avatar } from 'react-native-paper'
import { AppBar } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function Search() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.bg }]}>
            <StatusBar backgroundColor={Colors.bg} translucent={false} barStyle={'dark-content'} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null} >
                <View style={[style.main, { backgroundColor: Colors.bg, marginTop: 10 }]}>

                    <View style={[style.inputContainer, { height: 58, }]}>
                        <TouchableOpacity onPress={()=>navigation.navigate('SActive')}>
                            <Icon name='search' size={24} color={Colors.active} />
                        </TouchableOpacity>
                        <TextInput placeholder='Search job here...' placeholderTextColor={Colors.disable2}
                            selectionColor={Colors.primary}
                            style={[style.r14, { color: Colors.active, marginLeft: 5, flex: 1 }]}
                        />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>

                        <TouchableOpacity onPress={()=>navigation.navigate('JobDetail')}
                        style={{ flexDirection: 'row', marginTop: 20 }} >
                            <Image source={require('../../../assets/image/s12.png')} resizeMode='stretch' style={{ height: 55, width: 55 }} />
                            <View style={{ marginLeft: 10, flex: 1 }}>
                                <Text style={[style.r12, { color: '#212121' }]}>Highspeed Studios</Text>
                                <Text style={[style.s16, { color: Colors.active }]}>Junior Software Engineer</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <Image source={require('../../../assets/image/s10.png')} resizeMode='stretch' style={{ height: 24, width: 24 }} />
                                    <Text style={[style.m14, { color: '#212121', marginLeft: 8 }]}>$500 - $1,000</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <Image source={require('../../../assets/image/s13.png')} resizeMode='stretch' style={{ height: 24, width: 24 }} />
                                    <Text style={[style.m14, { color: '#212121', marginLeft: 8 }]}>Jakarta, Indonesia</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>navigation.navigate('JobDetail')}
                        style={{ flexDirection: 'row', marginTop: 30 }} >
                            <Image source={require('../../../assets/image/s14.png')} resizeMode='stretch' style={{ height: 55, width: 55 }} />
                            <View style={{ marginLeft: 10, flex: 1 }}>
                                <Text style={[style.r12, { color: '#212121' }]}>Lunar Djaja Corp.</Text>
                                <Text style={[style.s16, { color: Colors.active }]}>Database Engineer</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <Image source={require('../../../assets/image/s10.png')} resizeMode='stretch' style={{ height: 24, width: 24 }} />
                                    <Text style={[style.m14, { color: '#212121', marginLeft: 8 }]}>$500 - $1,000</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <Image source={require('../../../assets/image/s13.png')} resizeMode='stretch' style={{ height: 24, width: 24 }} />
                                    <Text style={[style.m14, { color: '#212121', marginLeft: 8 }]}>London, United Kingdom</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>navigation.navigate('JobDetail')}
                        style={{ flexDirection: 'row', marginTop: 30, marginBottom: 20 }} >
                            <Image source={require('../../../assets/image/s15.png')} resizeMode='stretch' style={{ height: 55, width: 55 }} />
                            <View style={{ marginLeft: 10, flex: 1 }}>
                                <Text style={[style.r12, { color: '#212121' }]}>Darkseer Studios</Text>
                                <Text style={[style.s16, { color: Colors.active }]}>Senior Software Engineer</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <Image source={require('../../../assets/image/s10.png')} resizeMode='stretch' style={{ height: 24, width: 24 }} />
                                    <Text style={[style.m14, { color: '#212121', marginLeft: 8 }]}>$500 - $1,000</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <Image source={require('../../../assets/image/s13.png')} resizeMode='stretch' style={{ height: 24, width: 24 }} />
                                    <Text style={[style.m14, { color: '#212121', marginLeft: 8 }]}>Medan, Indonesia</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
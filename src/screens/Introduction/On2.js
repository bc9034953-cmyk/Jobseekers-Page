import { View, Text, Dimensions, TouchableOpacity, FlatList, SafeAreaView, ImageBackground, KeyboardAvoidingView, StatusBar, Image, ScrollView } from 'react-native'
import React, { useState, useContext } from 'react'
import { Colors } from '../../theme/color'
import style from '../../theme/style'
import { useNavigation } from '@react-navigation/native'
import { Avatar } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function On2() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.bg }]}>
            <StatusBar backgroundColor="transparent" translucent={true} barStyle={'dark-content'} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null} >
                <View style={[style.main, { backgroundColor: Colors.bg }]}>
                    <Text style={[style.s22, { color: Colors.txt, marginTop: Platform.OS === 'ios' ? 10 : 30 }]}>What type of Job Your Looking For?</Text>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>

                        <View style={{ padding: 5, marginTop: 10 }}>
                            <TouchableOpacity style={[style.shadow, { backgroundColor: Colors.bg, shadowColor: Colors.active, padding: 15, borderRadius: 30, flexDirection: 'row', alignItems: 'center' }]}>
                                <Image source={require('../../../assets/image/s1.png')} resizeMode='stretch' style={{ height: 30, width: 30 }} />
                                <Text style={[style.r15, { color: Colors.txt1 ,marginLeft:10,flex:1}]}>Designer</Text>
                           <Icon name='checkbox' size={24} color={Colors.primary}/>
                            </TouchableOpacity>
                        </View>

                        <View style={{ padding: 5, marginTop: 10 }}>
                            <TouchableOpacity style={[style.shadow, { backgroundColor: Colors.bg, shadowColor: Colors.active, padding: 15, borderRadius: 30, flexDirection: 'row', alignItems: 'center' }]}>
                                <Image source={require('../../../assets/image/s2.png')} resizeMode='stretch' style={{ height: 30, width: 30 }} />
                                <Text style={[style.r15, { color: Colors.txt1 ,marginLeft:10,flex:1}]}>Developer</Text>
                           <Icon name='checkbox' size={24} color={Colors.primary}/>
                            </TouchableOpacity>
                        </View>

                        <View style={{ padding: 5, marginTop: 10 }}>
                            <TouchableOpacity style={[style.shadow, { backgroundColor: Colors.bg, shadowColor: Colors.active, padding: 15, borderRadius: 30, flexDirection: 'row', alignItems: 'center' }]}>
                                <Image source={require('../../../assets/image/s3.png')} resizeMode='stretch' style={{ height: 34, width: 34 }} />
                                <Text style={[style.r15, { color: Colors.txt1 ,marginLeft:10,flex:1}]}>Marketing</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ padding: 5, marginTop: 10 }}>
                            <TouchableOpacity style={[style.shadow, { backgroundColor: Colors.bg, shadowColor: Colors.active, padding: 15, borderRadius: 30, flexDirection: 'row', alignItems: 'center' }]}>
                                <Image source={require('../../../assets/image/s4.png')} resizeMode='stretch' style={{ height: 30, width: 30 }} />
                                <Text style={[style.r15, { color: Colors.txt1 ,marginLeft:10,flex:1}]}>Management</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ padding: 5, marginTop: 10 }}>
                            <TouchableOpacity style={[style.shadow, { backgroundColor: Colors.bg, shadowColor: Colors.active, padding: 15, borderRadius: 30, flexDirection: 'row', alignItems: 'center' }]}>
                                <Image source={require('../../../assets/image/s5.png')} resizeMode='stretch' style={{ height: 30, width: 30 }} />
                                <Text style={[style.r15, { color: Colors.txt1 ,marginLeft:10,flex:1}]}>Research and Analytics</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ padding: 5, marginTop: 10 ,marginBottom:20}}>
                            <TouchableOpacity style={[style.shadow, { backgroundColor: Colors.bg, shadowColor: Colors.active, padding: 15, borderRadius: 30, flexDirection: 'row', alignItems: 'center' }]}>
                                <Image source={require('../../../assets/image/s6.png')} resizeMode='stretch' style={{ height: 30, width: 30 }} />
                                <Text style={[style.r15, { color: Colors.txt1 ,marginLeft:10,flex:1}]}>Information Technology</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                    <TouchableOpacity onPress={()=>navigation.navigate('On3')}
                    style={[style.btn,{marginVertical:20}]}>
                        <Text style={[style.btntxt]}>PROCEED</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
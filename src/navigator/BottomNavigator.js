/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, Text} from 'react-native';
// import Home from '../screens/Home';
import {Colors} from '../theme/color';
import style from '../theme/style';
import Home from '../screens/Home/Home';
// import Chat from '../screens/Message/Chat';
// import Search from '../screens/Search/Search';
import Applications from '../screens/Candidate/Applications';
import SavedJobs from '../screens/Candidate/SavedJobs';
import Account from '../screens/Account';
import SavedCandidates from '../screens/Employer/SavedCandidates';
import {useSelector} from 'react-redux';
import {isUserEmployer} from '../utils';
import CandidateApplications from '../screens/Employer/CandidateApplications';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  const userData = useSelector(state => state.users.data);

  return (
    <Tab.Navigator
      detachInactiveScreens
      screenOptions={{
        tabBarStyle: {
          height: 70,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#FFFFFF',
          paddingBottom: 10,
        },
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarShowLabel: true,
          tabBarIcon: ({focused, color}) => {
            return (
              <Image
                source={require('../../assets/image/t1.png')}
                resizeMode="stretch"
                style={{
                  height: 24,
                  width: 24,
                  marginTop: 5,
                  tintColor: focused ? Colors.primary : '#ADADAD',
                }}
              />
            );
          },
          tabBarLabel: ({focused, color}) => {
            return (
              <Text
                numberOfLines={1}
                style={[
                  style.r12,
                  {fontSize: 13, color: focused ? Colors.primary : '#ADADAD'},
                ]}>
                Home
              </Text>
            );
          },
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Applications"
        component={
          isUserEmployer(userData) ? CandidateApplications : Applications
        }
        options={{
          tabBarShowLabel: true,
          tabBarIcon: ({focused, color}) => {
            return (
              <Image
                source={require('../../assets/image/t2.png')}
                resizeMode="stretch"
                style={{
                  height: 24,
                  width: 24,
                  marginTop: 5,
                  tintColor: focused ? Colors.primary : '#ADADAD',
                }}
              />
            );
          },
          tabBarLabel: ({focused, color}) => {
            return (
              <Text
                numberOfLines={1}
                style={[
                  style.r12,
                  {fontSize: 13, color: focused ? Colors.primary : '#ADADAD'},
                ]}>
                Applications
              </Text>
            );
          },
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Saved"
        component={isUserEmployer(userData) ? SavedCandidates : SavedJobs}
        options={{
          tabBarShowLabel: true,
          tabBarItemStyle: {
            flex: 0.8,
          },
          tabBarIcon: ({focused, color}) => {
            return (
              <Image
                source={require('../../assets/image/t5.png')}
                resizeMode="stretch"
                style={{
                  height: 24,
                  width: 24,
                  marginTop: 5,
                  tintColor: focused ? Colors.primary : '#ADADAD',
                }}
              />
            );
          },
          tabBarLabel: ({focused, color}) => {
            return (
              <Text
                numberOfLines={1}
                style={[
                  style.r12,
                  {fontSize: 13, color: focused ? Colors.primary : '#ADADAD'},
                ]}>
                Saved
              </Text>
            );
          },
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarShowLabel: true,
          tabBarIcon: ({focused, color}) => {
            return (
              <Image
                source={require('../../assets/image/t4.png')}
                resizeMode="stretch"
                style={{
                  height: 24,
                  width: 24,
                  marginTop: 5,
                  tintColor: focused ? Colors.primary : '#ADADAD',
                }}
              />
            );
          },
          tabBarLabel: ({focused, color}) => {
            return (
              <Text
                numberOfLines={1}
                style={[
                  style.r12,
                  {fontSize: 13, color: focused ? Colors.primary : '#ADADAD'},
                ]}>
                Account
              </Text>
            );
          },
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

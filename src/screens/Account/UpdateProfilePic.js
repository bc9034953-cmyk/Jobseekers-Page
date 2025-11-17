/* eslint-disable react/no-unstable-nested-components */
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../theme/color';
import {
  getFirstChar,
  getParsedJson,
  getTimeBasedGreeting,
  getUserPayload,
  showError,
} from '../../utils';
import { Avatar } from '@react-native-material/core';
import { useDispatch, useSelector } from 'react-redux';
import Configs from '../../utils/Configs';
import Icons from 'react-native-vector-icons/Octicons';
import style from '../../theme/style';
import PhotoUploaderModal from '../../components/PhotoUploaderModal';
import { setUserData } from '../users-slice';
import { usersApiSlice } from '../users-api-slice';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function UpdateProfilePic({ v }) {
  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;
  const additionalDetails = getParsedJson(customer?.additional_fields, null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const profilePicture = additionalDetails
    ? {
        uri: `${Configs.DATA_URL}/customers/${additionalDetails?.profile_picture}`,
      }
    : require('../../../assets/image/user.png');

  const [modalVisible, setModalVisible] = useState(false);

  const [updateProfile, { isLoading: updateLoading }] =
    usersApiSlice.useUpdateProfileMutation();

  const handleUpdateProfile = async data => {
    const file = data?.files?.length ? data?.files[0] : {};

    if (file) {
      try {
        const payload = getUserPayload(userData);
        const updatedPayload = {
          ...payload,
          AdditionalFields: {
            ...payload.AdditionalFields,
            profile_picture: file?.name,
          },
        };

        const response = await updateProfile(updatedPayload).unwrap();

        if (response) {
          dispatch(
            setUserData({
              token: userData.token,
              customer: response,
            }),
          );

          setModalVisible(false);
        }
      } catch (error) {
        showError(error);
      }
    }
  };

  const handleOpenModal = () => {
    if (userData?.token) {
      setModalVisible(true);
    } else {
      navigation.navigate('Login');
    }
  };

  const ProfileAvatar = ({ size = 90 }) => {
    return (
      <View style={[styles.profilePicWrapper, { height: size, width: size }]}>
        <Pressable onPress={handleOpenModal}>
          <Avatar
            size={size}
            image={profilePicture}
            color="#eee"
            imageStyle={{ borderWidth: 1, borderColor: Colors.bord }}
            label={getFirstChar(customer?.name)}
            labelStyle={{ color: Colors.disable }}
            initials={false}
          />

          <View style={styles.edit}>
            <Icons name="pencil" color={Colors.txt} />
          </View>
        </Pressable>
      </View>
    );
  };

  if (v === 'v2') {
    return (
      <>
        <Pressable
          style={styles.mainWrapper}
          onPress={() =>
            navigation.navigate(userData?.token ? 'Profile' : 'Login')
          }>
          <ProfileAvatar size={65} />
          <View style={{ width: width - 150 }}>
            <Text style={[style.m15, { color: Colors.white }]}>
              {customer?.name || 'Hi, Guest'}
            </Text>
            <Text style={[style.r13, { color: Colors.white, opacity: 0.8 }]}>
              {customer?.email || `${getTimeBasedGreeting()}`}
            </Text>
          </View>
        </Pressable>

        <PhotoUploaderModal
          isVisible={modalVisible}
          setModalVisible={setModalVisible}
          updateLoading={updateLoading}
          handleAfterSuccess={handleUpdateProfile}
        />
      </>
    );
  }

  return (
    <>
      <View style={styles.profilePicWrapper}>
        <Pressable onPress={handleOpenModal}>
          <Avatar
            size={90}
            image={profilePicture}
            color="#eee"
            imageStyle={{ borderWidth: 1, borderColor: Colors.bord }}
            label={getFirstChar(customer?.name)}
            labelStyle={{ color: Colors.disable }}
            initials={false}
          />

          <View style={styles.edit}>
            <Icons name="pencil" color={Colors.txt} />
          </View>
        </Pressable>
      </View>

      <PhotoUploaderModal
        isVisible={modalVisible}
        setModalVisible={setModalVisible}
        updateLoading={updateLoading}
        handleAfterSuccess={handleUpdateProfile}
      />

      <Text
        style={[
          style.subtitle,
          { color: Colors.txt, marginTop: 10, textAlign: 'center' },
        ]}>
        {customer?.name || 'Guest'}
      </Text>
      {additionalDetails?.designation && (
        <Text
          style={[
            style.r16,
            { color: '#10152080', textAlign: 'center', lineHeight: 18 },
          ]}>
          {additionalDetails?.designation}
        </Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 15,
  },
  profilePicWrapper: {
    alignSelf: 'center',
    borderRadius: 50,
  },
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

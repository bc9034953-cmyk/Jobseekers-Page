import {Chip} from '@react-native-material/core';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../theme/color';
import style from '../theme/style';
import {getUserImage, toArray} from '../utils';
import CandidateBookmark from './CandidateBookmark';

export default function SingleSavedCandidateItem({details}) {
  const navigation = useNavigation();

  const candidate = details?.candidate;
  const candidateAdditional = details?.candidate_additional_fields;

  const skills = candidateAdditional
    ? toArray(candidateAdditional?.skills, ',')
    : [];

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('CandidateDetails', {id: candidate?.id})
      }
      style={{
        flexDirection: 'row',
        marginTop: 15,
        paddingBottom: 20,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      }}>
      <Image
        source={getUserImage(candidateAdditional?.profile_picture)}
        resizeMode="stretch"
        style={{height: 55, width: 55, borderRadius: 50}}
      />
      <View style={{marginLeft: 10, flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: '80%'}}>
            <Text
              style={[
                style.s16,
                {color: Colors.active, textTransform: 'capitalize'},
              ]}>
              {candidate?.name}
            </Text>
          </View>

          <View style={{marginTop: 5}}>
            <CandidateBookmark candidate={candidate} iconSize={20} />
          </View>
        </View>
        {candidateAdditional?.designation && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Image
              source={require('../../assets/image/s13.png')}
              resizeMode="stretch"
              style={{height: 18, width: 18}}
            />
            <Text style={[style.m14, {color: '#212121', marginLeft: 8}]}>
              {candidateAdditional?.designation}
            </Text>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Image
            source={require('../../assets/image/s19.png')}
            resizeMode="stretch"
            style={{height: 20, width: 20, tintColor: Colors.primary}}
          />
          <Text style={[style.m14, {color: '#212121', marginLeft: 8}]}>
            {candidateAdditional?.location || 'India'}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 6,
            marginTop: 10,
            flexWrap: 'wrap',
          }}>
          {skills?.map((skill, index) => (
            <Chip
              label={skill}
              key={index + '-' + skill}
              labelStyle={{fontSize: 11, fontFamily: 'Poppins-Regular'}}
              style={{height: 25}}
              contentContainerStyle={{height: 25}}
              variant="filled"
              color={Colors.txt2}
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

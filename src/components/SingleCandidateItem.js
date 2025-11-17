import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/color';
import style from '../theme/style';
import {
  getParsedJson,
  getSalaryAmount,
  getUserImage,
  getWorkExpText,
  toArray,
  getTimeAgo,
  isUserActive,
} from '../utils';
import CandidateBookmark from './CandidateBookmark';
import useGetJobLocation from './useGetJobLocation';
import { AttributeWithIcon } from './Common';
import CustomChip from './CustomChip';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SingleCandidateItem({ candidate }) {
  const navigation = useNavigation();

  const { getLocation } = useGetJobLocation();

  const candidateAdditional = getParsedJson(candidate?.additional_fields);

  const skills = candidateAdditional
    ? toArray(candidateAdditional?.skills, ',')
    : [];

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('CandidateDetails', { id: candidate?.id })
      }
      style={{
        flexDirection: 'row',
        marginTop: 15,
        paddingBottom: 20,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      }}>
      <View style={{ position: 'relative' }}>
        {isUserActive(candidate?.last_login_date) && (
          <View
            style={{
              position: 'absolute',
              width: 16,
              height: 16,
              borderWidth: 3,
              borderColor: Colors.white,
              backgroundColor: Colors.green,
              borderRadius: 50,
              top: 0,
              right: 0,
              zIndex: 1,
            }}
          />
        )}
        <Image
          source={getUserImage(candidateAdditional?.profile_picture)}
          resizeMode="stretch"
          style={{ height: 55, width: 55, borderRadius: 50 }}
        />
      </View>
      <View style={{ marginLeft: 10, flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '80%' }}>
            <Text
              style={[
                style.s16,
                { color: Colors.active, textTransform: 'capitalize' },
              ]}>
              {candidate?.name}
            </Text>
          </View>

          <View style={{ marginTop: -5 }}>
            <CandidateBookmark candidate={candidate} iconSize={20} />
          </View>
        </View>

        <AttributeWithIcon
          source={require('../../assets/image/s13.png')}
          value={candidateAdditional?.designation}
          styles={{ marginLeft: 1, marginBottom: 4 }}
          iconSize={17}
        />

        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, rowGap: 5 }}>
          <AttributeWithIcon
            value={getLocation(candidateAdditional?.location)}
            source={require('../../assets/image/s19.png')}
          />

          <AttributeWithIcon
            value={getWorkExpText(candidateAdditional?.total_work_experience)}
            source={require('../../assets/image/s23.png')}
          />

          <AttributeWithIcon
            value={getSalaryAmount(
              candidateAdditional?.expected_salary_per_month,
              'm',
            )}
            source={require('../../assets/image/s10.png')}
          />

          <AttributeWithIcon
            value={candidateAdditional?.job_type}
            source={require('../../assets/image/s20.png')}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 6,
            marginTop: 10,
            flexWrap: 'wrap',
          }}>
          {skills?.slice(0, 10)?.map((skill, index) => (
            <CustomChip
              label={skill}
              key={index + '-' + skill}
              variant="filled"
              color={Colors.txt2}
            />
          ))}
        </View>

        {candidate?.last_login_date && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              marginTop: 8,
            }}>
            <Icon name="access-time" size={14} color={Colors.txt2} />
            <Text
              style={[
                style.r11,
                {
                  color: Colors.txt2,
                  lineHeight: 18,
                },
              ]}>
              Active {getTimeAgo(candidate?.last_login_date)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

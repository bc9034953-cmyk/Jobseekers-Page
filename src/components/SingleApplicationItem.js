import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../theme/color';
import style from '../theme/style';
import {getCompanyLogo, getUserImage, showError, showSuccess} from '../utils';
import useGetJobLocation from './useGetJobLocation';
import {Divider} from '@react-native-material/core';
import Button from './Button';
import Feather from 'react-native-vector-icons/Feather';
import {jobsApplicationsApiSlice} from '../screens/api-slices/job-applications-api-slice';

const width = Dimensions.get('window').width;

const StatusButton = ({status}) => {
  if (status === 'Pending') {
    return;
  }

  const btnColor = status === 'Shortlisted' ? Colors.primary : Colors.red;

  return (
    <Button
      v="v3"
      disabled={true}
      icon={
        <Feather
          name={status === 'Shortlisted' ? 'check' : 'x'}
          color={btnColor}
          size={16}
        />
      }
      styles={{
        backgroundColor: Colors.white,
        borderColor: btnColor,
        borderWidth: 1,
        width: width / 2 - 50,
        alignSelf: 'flex-end',
        marginTop: 10,
      }}
      labelStyle={{color: btnColor}}>
      {status}
    </Button>
  );
};

export default function SingleApplicationItem({details}) {
  const navigation = useNavigation();
  const {getLocation} = useGetJobLocation();

  const [updateApplicationStatus, {isLoading, isFetching}] =
    jobsApplicationsApiSlice.useUpdateApplicationStatusMutation();

  const candidate = details?.candidate;
  const candidateAdditional = details?.candidate_additional_fields;
  const company = details?.company;
  const job = details?.job;

  const [reviewStatus, setReviewStatus] = useState('');

  const handleReviewApplication = useCallback(
    async (id, status) => {
      if (isLoading || isFetching) {
        return;
      }
      try {
        setReviewStatus(status);

        const response = await updateApplicationStatus({id, status}).unwrap();

        if (response?.message) {
          const message =
            status === 'Rejected'
              ? 'Application rejected'
              : 'Application shortlisted successfully';
          showSuccess(message);
        }
      } catch (error) {
        showError(error);
      }
    },
    [isFetching, isLoading, updateApplicationStatus],
  );

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('JobDetail', {job})}
        style={styles.cardInner}>
        <Image
          source={getCompanyLogo(company?.logo)}
          resizeMode="stretch"
          defaultSource={require('../../assets/image/company-logo.png')}
          style={{height: 55, width: 55, borderRadius: 8}}
        />
        <View style={{marginLeft: 15, flex: 1}}>
          <Text style={[style.r12, {color: '#212121'}]}>{company?.name}</Text>
          <Text style={[style.s16, {color: Colors.active}]}>
            {job?.job_title}
          </Text>
        </View>
      </TouchableOpacity>

      <Divider color={'#eee'} style={{marginBottom: 17, marginTop: 10}} />

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CandidateDetails', {id: candidate?.id})
        }
        style={styles.cardInner}>
        <Image
          source={getUserImage(candidateAdditional?.profile_picture)}
          resizeMode="stretch"
          style={{height: 55, width: 55, borderRadius: 50}}
        />
        <View style={{marginLeft: 15, flex: 1}}>
          <Text style={[style.s16, {color: Colors.active}]}>
            {candidate?.name}
          </Text>

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
              {getLocation(details?.job_location_id) || 'India'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {details?.message && (
        <Text style={[style.r12, {marginTop: 10, marginBottom: 10}]}>
          <Text style={[style.m12, {color: Colors.txt}]}>
            Candidate Message:
          </Text>{' '}
          {details?.message}
        </Text>
      )}

      {details?.status === 'Pending' && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 10,
          }}>
          <Button
            v="v3"
            onPress={() => handleReviewApplication(details?.id, 'Rejected')}
            styles={{
              backgroundColor: Colors.white,
              borderWidth: 1,
              borderColor: Colors.red,
              width: width / 2 - 50,
            }}
            isLoading={isLoading && reviewStatus === 'Rejected'}
            loaderColor={Colors.red}
            labelStyle={{color: Colors.red}}>
            Reject
          </Button>

          <Button
            v="v3"
            onPress={() => handleReviewApplication(details?.id, 'Shortlisted')}
            styles={{
              backgroundColor: Colors.primary,
              borderColor: Colors.primary,
              borderWidth: 1,
              width: width / 2 - 50,
            }}
            isLoading={isLoading && reviewStatus === 'Shortlisted'}
            labelStyle={{color: Colors.white}}>
            Shortlist
          </Button>
        </View>
      )}

      <StatusButton status={details?.status} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 15,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  cardInner: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  button: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 30,
    paddingHorizontal: 17,
    backgroundColor: '#ebe9fd',
    maxWidth: 170,
    width: 'auto',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    lineHeight: 18,
    color: Colors.txt,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: 0,
    backgroundColor: Colors.red,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.white,
  },
  editBtn: {
    backgroundColor: '#ebe9fd',
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

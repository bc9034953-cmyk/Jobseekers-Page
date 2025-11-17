import { Spacer } from '@react-native-material/core';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialDesignIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon6 from 'react-native-vector-icons/FontAwesome6';

import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../theme/color';
import style from '../../theme/style';
import {
  displayAmount,
  getLocationById,
  getParsedJson,
  getWorkExpText,
} from '../../utils';
import ScreenLayout from '../ScreenLayout';
import { jobsApiSlice } from '../api-slices/jobs-api-slice';
import { usersApiSlice } from '../users-api-slice';
import Qualifications from './Qualifications';
import ResumeUploader from './ResumeUploader';
import UpdateProfilePic from './UpdateProfilePic';
import WorkExperience from './WorkExperience';
import ProfileMeter from './ProfileMeter';
import KeySkills from './KeySkills';
import Hobbies from './Hobbies';
import Languages from './Languages';
import Certifications from './Certifications';
import { setUserData } from '../users-slice';

const InfoItemRow = ({ value, icon, image, customIcon, emptyValue = '' }) => {
  const navigation = useNavigation();

  const DynamicIcon = customIcon || Icons;

  const onPress = () => {
    navigation.navigate('ProfileForm');
  };

  return (
    <View style={styles.itemRow}>
      {icon ? (
        <DynamicIcon name={icon} size={18} color={Colors.txt} />
      ) : (
        <Image
          source={image}
          style={{ width: 17, height: 17, tintColor: Colors.txt1 }}
        />
      )}

      {value ? (
        <Text style={[style.r13, { color: Colors.txt }]}>{value}</Text>
      ) : (
        <TouchableOpacity
          style={[style.r13, { color: Colors.txt }]}
          onPress={onPress}>
          <Text style={[style.r13, { color: Colors.primary }]}>
            {emptyValue}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function Profile() {
  const navigation = useNavigation();

  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const { refetch } = usersApiSlice.useGetCustomerDetailsQuery(customer?.id);

  const additionalDetails = getParsedJson(customer?.additional_fields, null);

  const { data: jobLocations } = jobsApiSlice.useGetJobLocationsQuery();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch()
      .then(res => {
        if (res?.data?.id) {
          dispatch(setUserData({ ...userData, customer: res?.data }));
        }
      })
      .finally(() => setRefreshing(false));
  }, [refetch, dispatch, userData]);

  return (
    <ScreenLayout title="Profile">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ marginTop: 10 }}>
        <UpdateProfilePic />

        <ProfileMeter />

        <ResumeUploader additionalDetails={additionalDetails} />
        <View style={styles.boxContainer}>
          <View
            style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={[style.m16, { color: Colors.txt }]}>
              Basic Details
            </Text>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate('ProfileForm')}>
              <FontAwesomeIcon6
                name="pen-to-square"
                size={17}
                color={Colors.txt}
              />
            </TouchableOpacity>
          </View>

          <InfoItemRow
            image={require('../../../assets/image/s23.png')}
            value={getWorkExpText(additionalDetails?.total_work_experience)}
            emptyValue="Add Work Experience"
          />

          <InfoItemRow
            image={require('../../../assets/image/s19.png')}
            value={
              additionalDetails?.location
                ? getLocationById(jobLocations, additionalDetails?.location)
                : null
            }
            emptyValue="Add Location"
          />

          <InfoItemRow icon={'phone-outline'} value={customer?.mobile_number} />

          <InfoItemRow icon={'email-outline'} value={customer?.email} />

          <InfoItemRow
            icon={'currency-rupee'}
            value={
              additionalDetails?.current_salary_per_month &&
              displayAmount(additionalDetails?.current_salary_per_month)
            }
            customIcon={MaterialDesignIcons}
            emptyValue="Add Salary"
          />
        </View>

        <KeySkills />

        <Qualifications />
        <WorkExperience />
        <Certifications />
        <Hobbies />
        <Languages />
        <Spacer h={40} />
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.divider,
    marginTop: 20,
    position: 'relative',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 15,
  },
  editBtn: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -15,
    top: -15,
  },
});

import { Spacer } from '@react-native-material/core';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../../components/Button';
import { Colors } from '../../../theme/color';
import style from '../../../theme/style';
import ScreenLayout from '../../ScreenLayout';
import BasicDetails from './BasicDetails';
import AdditionalDetails from './AdditionalDetails';
import { useDispatch, useSelector } from 'react-redux';
import { getParsedJson, showError, showSuccess } from '../../../utils';
import { usersApiSlice } from '../../users-api-slice';
import { setUserData } from '../../users-slice';
import { useNavigation } from '@react-navigation/native';

const width = Dimensions.get('window').width;

export default function ProfileForm() {
  const [activeTab, setActiveTab] = useState('Basic');
  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const customerAdditional = getParsedJson(customer?.additional_fields, null);

  const initial_state = {
    name: customer?.name || '',
    email: customer?.email || '',
    mobile_number: customer?.mobile_number || '',
    date_of_birth: customerAdditional?.date_of_birth || '',
    gender: customerAdditional?.gender || '',
    marital_status: customerAdditional?.marital_status || '',
    fathers_name: customerAdditional?.fathers_name || '',
    job_type: customerAdditional?.job_type || '',
    total_work_experience: customerAdditional?.total_work_experience || '',
    details: customerAdditional?.details || '',
    languages_known: customerAdditional?.languages_known || '',
    location: customerAdditional?.location || '',
    designation: customerAdditional?.designation || '',
    current_salary_per_month:
      customerAdditional?.current_salary_per_month || '',
    expected_salary_per_month:
      customerAdditional?.expected_salary_per_month || '',
    skills: customerAdditional?.skills || '',
    facebook_url: customerAdditional?.facebook_url || '',
    twitter_url: customerAdditional?.twitter_url || '',
    linkedin_url: customerAdditional?.linkedin_url || '',
    whatsapp_number: customerAdditional?.whatsapp_number || '',
    profile_picture: customerAdditional?.profile_picture || '',
    hobbies: customerAdditional?.hobbies || '',
    permanent_address: customerAdditional?.permanent_address || '',
    present_address: customerAdditional?.present_address || '',
    state: customerAdditional?.state || '',
    same_as_permanent_address:
      customerAdditional?.same_as_permanent_address || '',
  };

  const [formData, setFormData] = useState(initial_state);

  const [errors, setErrors] = useState({});

  const isBasicTabActive = activeTab === 'Basic' ? 'tabActive' : '';

  const [updateProfile, { isLoading }] =
    usersApiSlice.useUpdateProfileMutation();

  const onFormSubmit = async () => {
    if (!formData.name) {
      setErrors({ name: 'Please enter your name' });
      setActiveTab('Basic');
      return;
    }

    if (!formData.date_of_birth) {
      setErrors({ date_of_birth: 'Please select your date of birth' });
      setActiveTab('Basic');
      return;
    }

    if (!formData.gender) {
      setErrors({ gender: 'Please select your gender' });
      setActiveTab('Basic');
      return;
    }

    if (!formData.marital_status) {
      setErrors({ marital_status: 'Please select your marital status' });
      setActiveTab('Basic');
      return;
    }

    if (!formData.job_type) {
      setErrors({ job_type: 'Please select your job type' });
      setActiveTab('Basic');
      return;
    }

    if (!formData.total_work_experience) {
      setErrors({
        total_work_experience: 'Please select your work experience',
      });
      setActiveTab('Basic');
      return;
    }

    if (!formData.designation) {
      setErrors({ designation: 'Please select your designation' });
      setActiveTab('Basic');
      return;
    }

    if (!formData.location) {
      setErrors({ location: 'Please select your location' });
      setActiveTab('Basic');
      return;
    }

    if (!formData.current_salary_per_month) {
      setErrors({
        current_salary_per_month: 'Please enter your current salary',
      });
      setActiveTab('Basic');
      return;
    }

    try {
      const payload = {
        id: customer?.id,
        name: formData?.name,
        AdditionalFields: {
          date_of_birth: formData?.date_of_birth || '',
          gender: formData?.gender || '',
          marital_status: formData?.marital_status || '',
          fathers_name: formData?.fathers_name || '',
          job_type: formData?.job_type || '',
          total_work_experience: formData?.total_work_experience || '',
          details: formData?.details,
          languages_known: formData?.languages_known,
          skills: formData?.skills,
          location: formData?.location,
          designation: formData?.designation,
          current_salary_per_month: formData?.current_salary_per_month,
          expected_salary_per_month: formData?.expected_salary_per_month,
          facebook_url: formData?.facebook_url,
          twitter_url: formData?.twitter_url,
          linkedin_url: formData?.linkedin_url,
          whatsapp_number: formData?.whatsapp_number,
          profile_picture: formData?.profile_picture,
          hobbies: formData?.hobbies || '',
          permanent_address: formData?.permanent_address || '',
          present_address: formData?.present_address || '',
          state: formData?.state || '',
          same_as_permanent_address: formData?.same_as_permanent_address || '',
          resume: customerAdditional?.resume || '',
          resume_size: customerAdditional?.resume_size?.toString() || '',
        },
      };

      const response = await updateProfile(payload).unwrap();

      if (response) {
        dispatch(
          setUserData({
            token: userData?.token,
            customer: response,
          }),
        );
        showSuccess('Profile updated successfully.');
        navigation.navigate('Profile');
      }
    } catch (error) {
      showError(error);
    }
  };

  return (
    <ScreenLayout title="Edit Profile">
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <TouchableOpacity
          onPress={() => setActiveTab('Basic')}
          style={[styles.tab, styles[isBasicTabActive ? 'tabActive' : '']]}>
          <Text
            style={[
              style.m13,
              styles.tabTxt,
              styles[isBasicTabActive ? 'tabTxtActive' : ''],
            ]}>
            Basic Details
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('Additional')}
          style={[styles.tab, styles[!isBasicTabActive ? 'tabActive' : '']]}>
          <Text
            style={[
              style.m13,
              styles.tabTxt,
              styles[!isBasicTabActive ? 'tabTxtActive' : ''],
            ]}>
            Additional Details
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isBasicTabActive ? (
          <BasicDetails
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        ) : (
          <AdditionalDetails
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        )}

        <Spacer h={30} />

        <Button onPress={onFormSubmit} isLoading={isLoading}>
          Update Profile
        </Button>

        <Spacer h={30} />
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  tab: {
    width: width / 2 - 25,
    backgroundColor: Colors.divider,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabTxt: {
    color: Colors.txt,
  },
  tabTxtActive: {
    color: '#fff',
  },
});

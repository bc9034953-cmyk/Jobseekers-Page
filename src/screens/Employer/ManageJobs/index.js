import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import ScreenLayout from '../../ScreenLayout';
import { useSelector } from 'react-redux';
import AppLoader from '../../../components/AppLoader';
import { Colors } from '../../../theme/color';
import style from '../../../theme/style';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { jobsApiSlice } from '../../api-slices/jobs-api-slice';
import SingleJobItem from '../../../components/SingleJobItem';
import { isUserEmployer, showError, showSuccess } from '../../../utils';
import EmptyJobSec from './EmptyJobSec';
import { companiesApiSlice } from '../../api-slices/companies-api-slice';
import Tabs from '../../../components/Tabs';

export default function ManageJobs({ route }) {
  const userData = useSelector(state => state.users.data);
  const navigation = useNavigation();
  const params = route?.params;
  const [activeTab, setActiveTab] = useState('Active');

  const { data: companies } = companiesApiSlice.useGetCompaniesQuery(
    {
      'JobCompaniesSearch[employer_id]': userData?.customer?.id,
    },
    { skip: !isUserEmployer(userData) },
  );

  const handlePostJob = () => {
    if (companies?.length === 0) {
      showError('You have no company yet. Please create a company first.');

      navigation.navigate('CompanyForm');
      return;
    }

    navigation.navigate('JobForm');
  };

  const { data, isLoading } = jobsApiSlice.useGetJobsQuery({
    'JobsSearch[employer_id]': userData?.customer?.id,
    ...(params?.companyId && {
      'JobsSearch[job_company_id]': params?.companyId,
    }),
  });
  const activeJobs = data?.filter(job => job.is_active === 1);
  const disabledJobs = data?.filter(job => job.is_active === 0);

  const tabData = [
    { label: `Active (${activeJobs?.length || 0})`, value: 'Active' },
    { label: `Disabled (${disabledJobs?.length || 0})`, value: 'Disabled' },
  ];

  const [updateJob, { isLoading: updateLoading }] =
    jobsApiSlice.useUpdateJobMutation();

  const handleActiveToggle = async job => {
    const isActive = job?.is_active === 1;

    const callAPi = async () => {
      try {
        const payload = {
          id: job?.id,
          data: {
            is_active: isActive ? 0 : 1,
          },
        };
        const response = await updateJob(payload).unwrap();

        if (response) {
          showSuccess(
            `Job ${isActive ? 'deactivated' : 'activated'}  successfully.`,
          );
        }
      } catch (error) {
        showError(error);
      }
    };

    if (!isActive) {
      callAPi();
      return;
    }

    Alert.alert(
      'Deactivate Job',
      `Are you sure you want to deactivate "${job?.job_title}" job?`,
      [
        {
          text: 'NO',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => callAPi(),
        },
      ],
    );
  };

  const renderBody = () => {
    if (isLoading) {
      return <AppLoader />;
    }

    const currentJobs = activeTab === 'Active' ? activeJobs : disabledJobs;

    if (currentJobs?.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text
            style={[style.m14, { color: Colors.disable, textAlign: 'center' }]}>
            No {activeTab.toLowerCase()} jobs found
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        {currentJobs?.map(job => (
          <SingleJobItem
            job={job}
            key={job?.id}
            showActionButtons={true}
            handleActiveToggle={handleActiveToggle}
          />
        ))}
      </ScrollView>
    );
  };

  if (isLoading) {
    return (
      <ScreenLayout title="Manage Jobs">
        <AppLoader />
      </ScreenLayout>
    );
  }

  if (data?.length === 0 || !data) {
    return (
      <ScreenLayout title="Manage Jobs">
        <EmptyJobSec handlePostJob={handlePostJob} />
      </ScreenLayout>
    );
  }

  return (
    <>
      {updateLoading && <AppLoader v="v2" />}

      <ScreenLayout title="Manage Jobs" backScreen="MyTabs">
        <Tabs
          tabData={tabData}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />

        {renderBody()}

        <View style={styles.floatBtnContainer}>
          <Pressable onPress={handlePostJob} style={styles.floatBtn}>
            <Entypo name="plus" size={20} color={Colors.white} />
            <Text style={[style.r14, { color: Colors.white, marginTop: 3 }]}>
              Post a new job
            </Text>
          </Pressable>
        </View>
      </ScreenLayout>
    </>
  );
}

const styles = StyleSheet.create({
  floatBtnContainer: {
    position: 'absolute',
    bottom: 25,
    width: '100%',
    alignItems: 'center',
  },
  floatBtn: {
    backgroundColor: Colors.primary,
    padding: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
});

import { Image, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenLayout from '../../ScreenLayout';
import { ScrollView } from 'react-native';
import Tabs from '../../../components/Tabs';
import { useSelector } from 'react-redux';
import { jobsApplicationsApiSlice } from '../../api-slices/job-applications-api-slice';
import SingleApplicationItem from '../../../components/SingleApplicationItem';
import { showError } from '../../../utils';
import AppLoader from '../../../components/AppLoader';
import { View } from 'react-native';
import { Colors } from '../../../theme/color';
import style from '../../../theme/style';
import { Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const tabData = [
  { label: 'All', value: 'All' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Shortlisted', value: 'Shortlisted' },
  { label: 'Rejected', value: 'Rejected' },
];

export default function CandidateApplications({ route }) {
  const [activeTab, setActiveTab] = useState('All');
  const params = route?.params;
  const isFocused = useIsFocused();
  const singleJobApplicationsPage = route?.name === 'CandidateApplications';

  const useData = useSelector(state => state.users.data);
  const customer = useData?.customer;

  const { data, isLoading, error, refetch, isFetching, isUninitialized } =
    jobsApplicationsApiSlice.useGetJobApplicationsQuery(
      {
        employer_id: customer?.id,
        ...(params?.jobId && {
          'JobApplicationsSearch[job_id]': params?.jobId,
        }),
      },
      {
        skip: !customer?.id,
      },
    );

  const filteredApplications =
    activeTab === 'All'
      ? data
      : data?.filter(item => item?.status === activeTab) || [];

  useEffect(() => {
    if (isFocused && !isUninitialized) {
      refetch();
    }
  }, [refetch, isFocused, isUninitialized]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <ScreenLayout
        title={`${!singleJobApplicationsPage ? 'All' : ''} Applications`}
        showBackIcon={singleJobApplicationsPage}
        centerTitle={!singleJobApplicationsPage}>
        <AppLoader />
      </ScreenLayout>
    );
  }

  const renderEmpty = () => {
    const getEmptyMessage = () => {
      if (activeTab === 'All') {
        return 'No applications received yet. Stay tuned for updates.';
      }

      if (activeTab === 'Pending') {
        return 'No pending applications to review.';
      }

      if (activeTab === 'Shortlisted') {
        return 'No applications have been shortlisted yet.';
      }

      if (activeTab === 'Rejected') {
        return 'No applications have been rejected.';
      }
    };

    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          paddingBottom: 70,
        }}>
        <Image
          source={require('../../../../assets/image/job.png')}
          style={{
            width: 80,
            height: 80,
            marginBottom: 8,
          }}
        />

        <Text style={[style.b18, { color: Colors.txt }]}>
          No applications found
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: Colors.txt,
            opacity: 0.8,
            textAlign: 'center',
          }}>
          {getEmptyMessage()}
        </Text>
      </View>
    );
  };

  return (
    <ScreenLayout
      title={`${!singleJobApplicationsPage ? 'All' : ''} Applications`}
      showBackIcon={singleJobApplicationsPage}
      centerTitle={!singleJobApplicationsPage}>
      <Tabs
        tabData={tabData}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        v="v2"
      />

      {filteredApplications?.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 10 }}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }>
          {filteredApplications?.map(item => (
            <SingleApplicationItem key={item?.id} details={item} />
          ))}
        </ScrollView>
      ) : (
        renderEmpty()
      )}
    </ScreenLayout>
  );
}

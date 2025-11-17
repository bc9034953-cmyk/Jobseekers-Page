import React, {useState} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../theme/color';
import style from '../../theme/style';
import {useSelector} from 'react-redux';
import {jobsApiSlice} from '../api-slices/jobs-api-slice';
import SingleJobItem from '../../components/SingleJobItem';
import {showError, showSuccess} from '../../utils';
import EmptyJobSec from '../Employer/ManageJobs/EmptyJobSec';
import {useNavigation} from '@react-navigation/native';

export default function HomeManageJobs({isUserEmployer}) {
  const navigation = useNavigation();
  const userData = useSelector(state => state.users.data);
  const {data, isLoading} = jobsApiSlice.useGetJobsQuery({
    'JobsSearch[employer_id]': userData?.customer?.id,
  });
  const topJobs = data?.slice(0, 5) || [];

  const [updatingStatusOfJob, setUpdatingStatusOfJob] = useState(null);

  const hasJobsPosted = topJobs?.length > 0;

  const [updateJob, {isLoading: updateLoading}] =
    jobsApiSlice.useUpdateJobMutation();

  const handleActiveToggle = async job => {
    const isActive = job?.is_active === 1;

    const callAPi = async () => {
      setUpdatingStatusOfJob(job?.id);

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

  if (!isUserEmployer || isLoading) {
    return null;
  }

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 18,
          gap: 15,
        }}>
        <Text
          style={[style.s18, {color: Colors.active, flex: 1, lineHeight: 24}]}>
          Your Job Openings
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate('ManageJobs')}>
            <Text style={[style.m14, {color: Colors.primary}]}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{marginTop: 3}}>
        {hasJobsPosted ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {topJobs?.map(job => (
              <SingleJobItem
                job={job}
                key={job?.id}
                showActionButtons={true}
                handleActiveToggle={handleActiveToggle}
                updateStatusLoading={
                  updateLoading && job?.id === updatingStatusOfJob
                }
              />
            ))}
          </ScrollView>
        ) : (
          <View style={{marginTop: 35}}>
            <EmptyJobSec showButton={false} />
          </View>
        )}
      </View>
    </View>
  );
}

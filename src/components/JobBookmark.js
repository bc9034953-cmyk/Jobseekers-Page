import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {useCallback} from 'react';
import {Colors} from '../theme/color';
import {jobsApiSlice} from '../screens/api-slices/jobs-api-slice';
import {showError, showSuccess} from '../utils';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

export default function JobBookmark({job, iconSize = 24}) {
  const [bookmarkJob, {isLoading}] = jobsApiSlice.useBookmarkJobMutation();
  const [removeBookmarkedJob, {isLoading: removeLoading}] =
    jobsApiSlice.useRemoveBookmarkedJobMutation();
  const {data} = jobsApiSlice.useGetBookmarkedJobsQuery();
  const navigation = useNavigation();

  const loading = removeLoading || isLoading;

  const userData = useSelector(state => state.users.data);
  const token = userData?.token;

  const hasBookmarkedJob = data?.find(item => item?.job?.id === job?.id);

  const handleBookmark = useCallback(async () => {
    if (!token) {
      navigation.navigate('Login');
      return;
    }

    if (loading) {
      return;
    }

    try {
      if (hasBookmarkedJob?.id) {
        await removeBookmarkedJob(hasBookmarkedJob?.id).unwrap();
      } else {
        const res = await bookmarkJob({job_id: job?.id}).unwrap();
        if (res) {
          showSuccess('Job saved successfully');
        }
      }
    } catch (err) {
      showError(err, 4000, navigation);
    }
  }, [
    bookmarkJob,
    hasBookmarkedJob?.id,
    job?.id,
    loading,
    navigation,
    removeBookmarkedJob,
    token,
  ]);

  if (!job?.id) {
    return null;
  }

  return (
    <TouchableOpacity onPress={handleBookmark}>
      <Icon
        name={hasBookmarkedJob ? 'bookmark' : 'bookmark-outline'}
        size={iconSize}
        color={Colors.primary}
      />
    </TouchableOpacity>
  );
}

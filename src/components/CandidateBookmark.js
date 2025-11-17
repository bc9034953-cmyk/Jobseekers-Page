import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {useCallback} from 'react';
import {Colors} from '../theme/color';
import {showError, showSuccess} from '../utils';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {candidateBookmarksApiSlice} from '../screens/api-slices/candidate-bookmarks-api-slice';
import {ActivityIndicator} from '@react-native-material/core';

export default function CandidateBookmark({candidate, iconSize = 24}) {
  const [bookmarkCandidate, {isLoading}] =
    candidateBookmarksApiSlice.useBookmarkCandidateMutation();

  const [removeBookmarkCandidate, {isLoading: removeLoading}] =
    candidateBookmarksApiSlice.useRemoveBookmarkCandidateMutation();
  const {data} = candidateBookmarksApiSlice.useGetBookmarkedCandidatesQuery();
  const navigation = useNavigation();

  const loading = removeLoading || isLoading;

  const userData = useSelector(state => state.users.data);
  const token = userData?.token;

  const hasBookmarkedCandidate = data?.find(
    item => item?.candidate?.id === candidate?.id,
  );

  const handleBookmark = useCallback(async () => {
    if (!token) {
      navigation.navigate('Login');
      return;
    }

    if (loading) {
      return;
    }

    try {
      if (hasBookmarkedCandidate?.id) {
        await removeBookmarkCandidate(hasBookmarkedCandidate?.id).unwrap();

        showSuccess('Candidate unsaved');
      } else {
        const res = await bookmarkCandidate({
          candidate_id: candidate?.id,
        }).unwrap();
        if (res) {
          showSuccess('Candidate saved successfully');
        }
      }
    } catch (err) {
      showError(err, 4000, navigation);
    }
  }, [
    bookmarkCandidate,
    hasBookmarkedCandidate?.id,
    candidate?.id,
    loading,
    navigation,
    removeBookmarkCandidate,
    token,
  ]);

  if (!candidate?.id) {
    return null;
  }

  if (loading) {
    return <ActivityIndicator size="small" color={Colors.primary} />;
  }

  return (
    <TouchableOpacity onPress={handleBookmark}>
      <Icon
        name={hasBookmarkedCandidate ? 'bookmark' : 'bookmark-outline'}
        size={iconSize}
        color={Colors.primary}
      />
    </TouchableOpacity>
  );
}

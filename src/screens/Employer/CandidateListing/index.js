import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppLoader from '../../../components/AppLoader';
import SingleCandidateItem from '../../../components/SingleCandidateItem';
import ScreenLayout from '../../ScreenLayout';
import { candidateBookmarksApiSlice } from '../../api-slices/candidate-bookmarks-api-slice';
import { usersApiSlice } from '../../users-api-slice';
import CandidateSearch from './CandidateSearch';
import style from '../../../theme/style';
import { Colors } from '../../../theme/color';
import CandidateFiltersModal from './CandidateFiltersModal';
import { useSelector } from 'react-redux';
import { loggedInWithin30Days } from '../../../utils';

let hasFirstTimeLoaded = false;

export default function CandidateListing() {
  const [query, setQuery] = useState('');

  const candidatesState = useSelector(state => state.candidates);
  const filterParams = candidatesState?.filterParams;
  const selectedFilters = candidatesState?.selectedFilters;

  const { data, isLoading, isFetching } = usersApiSlice.useGetCustomersQuery({
    type: 2,
    params: {
      'AdditionalFieldsSearch[is_required_fields_completed]': 'yes',
      'per-page': 1000,
      page: 1,
      'CustomersSearch[q]': query,
      sort: '-id',
      ...filterParams,
    },
  });

  const { data: bookmarkCandidates, isLoading: bookmarkLoading } =
    candidateBookmarksApiSlice.useGetBookmarkedCandidatesQuery();

  const getCandidatesByStatus = useCallback((candidates, filterStatus) => {
    let users = [];

    if (filterStatus === 'active') {
      candidates?.forEach(candidate => {
        if (loggedInWithin30Days(candidate?.last_login_date)) {
          users.push(candidate);
        }
      });
    } else {
      return candidates;
    }

    return users;
  }, []);

  const getBookmarkedCandiFirst = useCallback(
    candidates => {
      const newCandidates = [];
      const bookmarkedCandidatesMap = new Map();

      // Create a map for quick lookup of bookmarked candidates
      bookmarkCandidates?.forEach(bookmarked => {
        bookmarkedCandidatesMap.set(bookmarked?.candidate?.id, bookmarked);
      });

      // Add bookmarked candidates to the beginning of the new candidate list
      candidates?.forEach(item => {
        if (bookmarkedCandidatesMap.has(item?.id)) {
          newCandidates.unshift(item); // Add to the start of the array
        }
      });

      // Add non-bookmarked candidates to the end of the new candidate list
      candidates?.forEach(item => {
        if (!bookmarkedCandidatesMap.has(item?.id)) {
          newCandidates.push(item); // Add to the end of the array
        }
      });

      const candidateStatusFilters = selectedFilters?.find(
        filter => filter?.name === 'candidate_status',
      );

      if (candidateStatusFilters?.value === 'active') {
        return getCandidatesByStatus(
          newCandidates,
          candidateStatusFilters?.value,
        );
      }

      return newCandidates || [];
    },
    [bookmarkCandidates, getCandidatesByStatus, selectedFilters],
  );

  const candidatesLength = getBookmarkedCandiFirst(data)?.length;
  const candidateText = candidatesLength > 1 ? 'candidates' : 'candidate';

  const hasLoading = isLoading || bookmarkLoading;

  if (hasLoading && !hasFirstTimeLoaded) {
    return (
      <ScreenLayout title="Search Candidates">
        <AppLoader />
      </ScreenLayout>
    );
  }

  const renderListing = () => {
    if (hasLoading || isFetching) {
      return <AppLoader />;
    }

    if (!hasLoading && data?.length === 0) {
      return (
        <View style={styles.emptyView}>
          <Text style={[style.m16, { color: Colors.txt }]}>
            No candidates found
          </Text>
        </View>
      );
    }

    hasFirstTimeLoaded = true;

    return (
      <>
        <Text
          style={[
            style.m16,
            { color: Colors.txt, marginTop: 12, marginBottom: 5 },
          ]}>
          {candidatesLength} {candidateText} found
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 10 }}>
          {getBookmarkedCandiFirst(data)?.map(item => (
            <SingleCandidateItem key={item?.id} candidate={item} />
          ))}
        </ScrollView>
      </>
    );
  };

  return (
    <ScreenLayout title="Search Candidates">
      <CandidateSearch setQuery={setQuery} query={query} />
      <CandidateFiltersModal />

      {renderListing()}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
});

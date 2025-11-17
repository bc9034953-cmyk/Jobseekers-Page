import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Colors } from '../../theme/color';
import style from '../../theme/style';
import { usersApiSlice } from '../users-api-slice';
import Configs from '../../utils/Configs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenLayout from '../ScreenLayout';
import Icon from 'react-native-vector-icons/Ionicons';
import SingleCandidateItem from '../../components/SingleCandidateItem';
import AppLoader from '../../components/AppLoader';
import { getParsedJson } from '../../utils';

const EmptyComponent = () => (
  <View style={styles.emptyContainer}>
    <Icon name="person-outline" size={64} color={Colors.disable2} />
    <Text style={styles.emptyTitle}>No Recently Viewed Candidates</Text>
    <Text style={styles.emptySubtitle}>
      Candidates you view will appear here for easy access
    </Text>
  </View>
);

export default function RecentlyViewedCandidatesPage() {
  const { data: allCandidates, isLoading: allCandidatesLoading } =
    usersApiSlice.useGetCustomersQuery({
      type: 2,
      params: {
        'AdditionalFieldsSearch[is_required_fields_completed]': 'yes',
        'per-page': 1000,
        page: 1,
        sort: '-id',
      },
    });
  const isFocused = useIsFocused();
  const [viewedCandidates, setViewedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyViewedCandidates = async () => {
      if (isFocused) {
        try {
          setLoading(true);
          let recentlyViewed = [];

          // Read the candidates from AsyncStorage
          const storedCandidatesJson = await AsyncStorage.getItem(
            Configs.RECENTLY_VIEWED_CANDIDATES_STORAGE_KEY,
          );

          const recentlyViewedCandidateIds = getParsedJson(
            storedCandidatesJson,
            '[]',
          );

          // Retrieves a list of recently viewed candidate IDs from localStorage, if they exist
          recentlyViewedCandidateIds?.forEach(id => {
            const matchingCandidate = allCandidates?.find(
              candidate => candidate?.id === id,
            );

            // If a matching candidate is found, add it to the recentlyViewed array
            if (matchingCandidate) {
              recentlyViewed.push(matchingCandidate);
            }
          });

          setViewedCandidates(recentlyViewed);
        } catch (e) {
          console.error(
            'Failed to fetch recently viewed candidates from storage:',
            e,
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRecentlyViewedCandidates();
  }, [allCandidates, isFocused]);

  const renderCandidateItem = ({ item: candidate }) => {
    return <SingleCandidateItem candidate={candidate} />;
  };

  return (
    <ScreenLayout title="Recently Viewed Candidates" showBackIcon={true}>
      {loading || allCandidatesLoading ? (
        <AppLoader />
      ) : viewedCandidates.length === 0 ? (
        <EmptyComponent />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}>
          <FlatList
            data={viewedCandidates}
            renderItem={renderCandidateItem}
            keyExtractor={item => `recently-viewed-candidate-${item?.id}`}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 10 }}
          />
        </ScrollView>
      )}
    </ScreenLayout>
  );
}

const styles = {
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    ...style.s18,
    color: Colors.txt,
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    ...style.r14,
    color: Colors.disable2,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
};

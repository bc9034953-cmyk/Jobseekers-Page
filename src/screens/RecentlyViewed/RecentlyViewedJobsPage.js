import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Colors } from '../../theme/color';
import style from '../../theme/style';
import { jobsApiSlice } from '../api-slices/jobs-api-slice';
import Configs from '../../utils/Configs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenLayout from '../ScreenLayout';
import Icon from 'react-native-vector-icons/Ionicons';
import SingleJobItem from '../../components/SingleJobItem';
import AppLoader from '../../components/AppLoader';

const EmptyComponent = () => (
  <View style={styles.emptyContainer}>
    <Icon name="briefcase-outline" size={64} color={Colors.disable2} />
    <Text style={styles.emptyTitle}>No Recently Viewed Jobs</Text>
    <Text style={styles.emptySubtitle}>
      Jobs you view will appear here for easy access
    </Text>
  </View>
);

export default function RecentlyViewedJobsPage() {
  const { data: allJobs, isLoading: allJobsLoading } =
    jobsApiSlice.useGetJobsQuery();
  const isFocused = useIsFocused();
  const [viewedJobs, setViewedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyViewedJobs = async () => {
      if (isFocused) {
        try {
          setLoading(true);
          let recentlyViewed = [];

          // Read the jobs from AsyncStorage
          const storedJobsJson = await AsyncStorage.getItem(
            Configs.RECENTLY_VIEWED_JOBS_STORAGE_KEY,
          );

          const recentlyViewedJobIds = storedJobsJson
            ? JSON.parse(storedJobsJson)
            : [];

          // Retrieves a list of recently viewed job IDs from localStorage, if they exist
          recentlyViewedJobIds?.forEach(id => {
            const matchingJob = allJobs?.find(job => job?.id === id);

            // If a matching job is found, add it to the recentlyViewed array
            if (matchingJob) {
              recentlyViewed.push(matchingJob);
            }
          });

          setViewedJobs(recentlyViewed);
        } catch (e) {
          console.error(
            'Failed to fetch recently viewed jobs from storage:',
            e,
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRecentlyViewedJobs();
  }, [allJobs, isFocused]);

  const renderJobItem = ({ item: job }) => (
    <SingleJobItem
      job={job}
      jobTimeText="Posted"
      showActionButtons={false}
      handleActiveToggle={() => {}}
      updateStatusLoading={false}
    />
  );

  return (
    <ScreenLayout title="Recently Viewed Jobs" showBackIcon={true}>
      {loading || allJobsLoading ? (
        <AppLoader />
      ) : viewedJobs.length === 0 ? (
        <EmptyComponent />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}>
          <FlatList
            data={viewedJobs}
            renderItem={renderJobItem}
            keyExtractor={item => `recently-viewed-job-${item?.id}`}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    ...style.r14,
    color: Colors.txt,
  },
};

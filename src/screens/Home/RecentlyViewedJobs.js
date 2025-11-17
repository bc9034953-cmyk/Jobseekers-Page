import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../theme/color';
import style from '../../theme/style';
import { getCompanyLogo, getSalaryAmount } from '../../utils';
import { jobsApiSlice } from '../api-slices/jobs-api-slice';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Configs from '../../utils/Configs';
import AsyncStorage from '@react-native-async-storage/async-storage';
const width = Dimensions.get('screen').width;

export default function RecentlyViewedJobs({ isUserEmployer }) {
  const { data: allJobs } = jobsApiSlice.useGetJobsQuery();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [viewedJobs, setViewedJobs] = useState([]);

  useEffect(() => {
    const fetchRecentlyViewedJobs = async () => {
      if (isFocused) {
        try {
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
          // Handle errors, possibly by setting an error state
          console.error(
            'Failed to fetch recently viewed jobs from storage:',
            e,
          );
        }
      }
    };

    fetchRecentlyViewedJobs();
  }, [allJobs, isFocused]);

  if (viewedJobs?.length === 0 || isUserEmployer) {
    return null;
  }

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 18,
        }}>
        <Text style={[style.s18, { color: Colors.active, flex: 1 }]}>
          Recently Viewed Jobs
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('RecentlyViewedJobsPage')}>
            <Text style={[style.m14, { color: Colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginTop: 3 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}>
          {viewedJobs?.map(job => (
            <Pressable
              style={{ padding: 5, marginBottom: 10 }}
              key={`recently-viewed-job-${job?.id}`}
              onPress={() => navigation.navigate('JobDetail', { job })}>
              <View
                style={[
                  style.shadow,
                  {
                    padding: 12,
                    width: width / 1.3,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: Colors.bg,
                    shadowColor: Colors.active,
                    borderRadius: 15,
                    flex: 1,
                  },
                ]}>
                <View
                  style={{
                    height: 60,
                    width: 60,
                    backgroundColor: '#F8FAFC',
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={getCompanyLogo(job?.company?.logo)}
                    resizeMode="stretch"
                    style={{
                      height: 60,
                      width: 60,
                      borderRadius: 8,
                      marginTop: -7,
                    }}
                  />
                </View>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text
                    style={[style.s16, { color: Colors.active }]}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {job?.job_title}
                  </Text>
                  <Text style={[style.r12, { color: '#212121' }]}>
                    {job?.location?.name || 'India'}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                    }}>
                    <Image
                      source={require('../../../assets/image/s10.png')}
                      resizeMode="stretch"
                      style={{ height: 20, width: 20 }}
                    />
                    <Text
                      style={[
                        style.s14,
                        { color: Colors.primary, marginLeft: 5 },
                      ]}>
                      {getSalaryAmount(job)}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

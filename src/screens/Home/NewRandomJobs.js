import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SingleJobItem from '../../components/SingleJobItem';
import {Colors} from '../../theme/color';
import style from '../../theme/style';
import {jobsApiSlice} from '../api-slices/jobs-api-slice';
import {ActivityIndicator} from '@react-native-material/core';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {getJobsByType, titleCase} from '../../utils';

const TabPill = ({title, onPress, activeTab}) => {
  const isActive = activeTab === title?.toLowerCase();

  return (
    <TouchableOpacity
      style={[styles.tab, styles[isActive ? 'activeTab' : '']]}
      onPress={onPress}>
      <Text
        style={[
          style.r13,
          styles.tabText,
          styles[isActive ? 'activeTabText' : ''],
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default function NewRandomJobs({isUserEmployer}) {
  const {data, isLoading, refetch, isUninitialized} =
    jobsApiSlice.useGetJobsQuery();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState('recent jobs');

  let jobs = getJobsByType(data, activeTab);

  useEffect(() => {
    if (isFocused && !isUninitialized) {
      refetch();
    }
  }, [refetch, isFocused, isUninitialized]);

  if (isUserEmployer) {
    return null;
  }

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 15,
        }}>
        <Text style={[style.s18, {color: Colors.txt, flex: 1}]}>
          New & Random Jobs
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('JobListing')}>
          <Text style={[style.m14, {color: Colors.primary}]}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{gap: 6, marginTop: 10, marginBottom: 8}}>
        <TabPill
          title="Recent Jobs"
          activeTab={activeTab}
          onPress={() => setActiveTab('recent jobs')}
        />
        <TabPill
          title="Freelancer"
          activeTab={activeTab}
          onPress={() => setActiveTab('freelancer')}
        />
        <TabPill
          title="Part Time"
          activeTab={activeTab}
          onPress={() => setActiveTab('part time')}
        />
        <TabPill
          title="Full Time"
          activeTab={activeTab}
          onPress={() => setActiveTab('full time')}
        />
      </ScrollView>

      {isLoading && (
        <ActivityIndicator
          style={{marginTop: 30}}
          size={'large'}
          color={Colors.primary}
        />
      )}

      {jobs?.map(job => (
        <SingleJobItem job={job} key={`recent-job-${job?.id}`} />
      ))}

      {jobs?.length === 0 && (
        <View
          style={{
            marginTop: 50,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 40,
          }}>
          <Image
            source={require('../../../assets/image/job.png')}
            style={{width: 55, height: 55, marginBottom: 10}}
          />
          <Text style={[style.m15, {textAlign: 'center', color: Colors.txt}]}>
            Sorry, no jobs found
          </Text>
          <Text style={[style.m12, {textAlign: 'center'}]}>
            {titleCase(activeTab)} jobs is not available right now! Please try
            searching for another job types.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    padding: 7,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 30,
    paddingHorizontal: 17,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    lineHeight: 18,
    color: Colors.txt,
  },
  activeTabText: {
    color: Colors.white,
  },
});

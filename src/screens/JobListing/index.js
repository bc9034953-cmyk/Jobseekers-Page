import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import style from '../../theme/style';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {Colors} from '../../theme/color';
import {AppBar} from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import JobSearch from '../Home/JobSearch';
import {jobsApiSlice} from '../api-slices/jobs-api-slice';
import SingleJobItem from '../../components/SingleJobItem';
import JobFiltersModal from './JobFiltersModal';
import {useSelector} from 'react-redux';

export default function JobListing() {
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [keyword, setKeyword] = useState(null);
  const [loading, setLoading] = useState(true);

  const jobFilters = useSelector(state => state.jobFilters);
  const filterParams = jobFilters?.filterParams;

  const params = {
    ...filterParams,
    ...(keyword && {'JobsSearch[q]': keyword}),
    'per-page': 100,
  };

  const {
    data: jobs,
    isLoading,
    isFetching,
    refetch,
    isUninitialized,
  } = jobsApiSlice.useGetJobsQuery(params);

  useEffect(() => {
    if (isFocused && !isUninitialized) {
      refetch();
      setLoading(false);
    }
  }, [refetch, isFocused, isUninitialized]);

  useEffect(() => {
    if (route?.params?.keyword) {
      setKeyword(route.params.keyword);
    }
  }, [route]);

  const renderListing = () => {
    if (isLoading || isFetching || loading) {
      return (
        <View style={styles.main}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    if (jobs?.length === 0) {
      return (
        <View style={styles.main}>
          <Text style={[style.s15, styles.nothingFound]}>No results found</Text>
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {jobs?.map(job => (
          <SingleJobItem key={`job-${job?.id}`} job={job} />
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[style.area, {backgroundColor: Colors.bg}]}>
      <StatusBar
        backgroundColor={Colors.bg}
        translucent={false}
        barStyle={'dark-content'}
      />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={[style.main, {backgroundColor: Colors.bg, marginTop: 10}]}>
          <AppBar
            color={Colors.bg}
            elevation={0}
            title="Jobs for you"
            titleStyle={[style.subtitle, {color: Colors.txt}]}
            leading={
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[style.icon]}>
                <Icon name="arrow-back" size={24} color={Colors.active} />
              </TouchableOpacity>
            }
          />

          <JobSearch setQuery={setKeyword} query={keyword} />

          <JobFiltersModal />

          {renderListing()}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  nothingFound: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    textAlign: 'center',
  },
});

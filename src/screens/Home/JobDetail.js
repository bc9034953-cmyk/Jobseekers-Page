import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  AppBar,
  Chip,
  Divider,
} from '@react-native-material/core';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useRef} from 'react';
import {
  Image,
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
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../theme/color';
import style from '../../theme/style';
import {
  getCompanyLogo,
  getJobExperiences,
  getJobTypeChipColor,
  getLocationById,
  getSalaryAmount,
  isUserEmployer,
  scrollTo,
  showError,
  toArray,
} from '../../utils';
import Configs from '../../utils/Configs';
import useAsyncStorage from '../../utils/useAsyncStorage';
import {jobsApiSlice} from '../api-slices/jobs-api-slice';
import JobBookmark from '../../components/JobBookmark';
import ApplyJobModal from './ApplyJobModal';
import {useSelector} from 'react-redux';

const IconRow = ({icon, name, value}) => {
  if (!value) {
    return null;
  }
  return (
    <View style={{flexDirection: 'row', marginTop: 15}}>
      <View
        style={{
          height: 50,
          width: 50,
          backgroundColor: '#EAEAEA',
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={icon}
          resizeMode="cover"
          style={{height: 25, width: 25, tintColor: Colors.primary}}
        />
      </View>
      <View style={{marginLeft: 15, flex: 1}}>
        <Text style={[style.r14, {color: '#6F6F6F'}]}>{name}</Text>
        <Text style={[style.m16, {color: Colors.txt}]}>{value}</Text>
      </View>
    </View>
  );
};

const IconRow2 = ({image, iconName, name, value, onPress, hasLink}) => {
  if (!value) {
    return null;
  }

  return (
    <View style={{flexDirection: 'row', marginTop: 10}}>
      {iconName ? (
        <View
          style={{
            height: 45,
            width: 45,
            backgroundColor: Colors.iconbg,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name={iconName} size={24} color={'#b2b2b2'} />
        </View>
      ) : (
        <Image
          source={image}
          resizeMode="stretch"
          style={{height: 45, width: 45, borderRadius: 8}}
        />
      )}

      <View style={{marginLeft: 15, flex: 1}}>
        <Text style={[style.r14, {color: '#6F6F6F'}]}>{name}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
          <Text
            selectable
            style={[style.m16, {color: Colors.txt, width: '90%'}]}
            onPress={onPress}>
            {value}
          </Text>

          {hasLink && (
            <Icon
              name="chevron-forward"
              style={{marginTop: 3}}
              color={Colors.txt}
              size={16}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const getList = list => {
  let listArr = toArray(list, '\n');

  return listArr.map((h, index) => (
    <View
      key={'list-' + index}
      style={{
        flexDirection: 'row',
        marginTop: 8,
      }}>
      <Icon
        name="checkmark-circle"
        size={14}
        style={{marginTop: 3}}
        color={Colors.primary}
      />
      <Text style={[style.r14, {color: '#313131', marginLeft: 10, flex: 1}]}>
        {h}
      </Text>
    </View>
  ));
};

const getKeywords = list => {
  let listArr = toArray(list, ',');
  return listArr.map((h, index) => (
    <Chip key={'keywords-' + index} label={h} color={'#3f51b5'} />
  ));
};

export default function JobDetail({route}) {
  const navigation = useNavigation();
  const paramsJob = route?.params?.job;
  const scrollRef = useRef();

  const isFocused = useIsFocused();

  const userData = useSelector(state => state.users.data);

  const {
    data: details,
    isLoading,
    error,
    refetch,
    isUninitialized,
  } = jobsApiSlice.useGetJobDetailsQuery(paramsJob?.id);

  useEffect(() => {
    if (isFocused) {
      scrollTo(scrollRef);
    }
  }, [isFocused]);

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

  const {value: recentlyViewedJobs, loading} = useAsyncStorage(
    Configs.RECENTLY_VIEWED_JOBS_STORAGE_KEY,
  );

  const companyDetails = details?.company;

  useEffect(() => {
    if (!loading) {
      // Assume recentlyViewedJobs is a JSON string and parse it to get the array.
      const currentViewedJobs = recentlyViewedJobs || [];

      let newData = [...currentViewedJobs];

      // Check if paramsJob.id is defined and process accordingly.
      if (paramsJob && paramsJob.id) {
        // Convert to number as we're using parseInt later; consistency is key.
        const jobId = parseInt(paramsJob.id, 10);

        // If jobId is already in newData, remove it.
        newData = newData.filter(id => id !== jobId);

        // Then unshift jobId to make it the most recent.
        newData.unshift(jobId);
      }

      // Update AsyncStorage, handle the promise with a catch for errors.
      AsyncStorage.setItem(
        Configs.RECENTLY_VIEWED_JOBS_STORAGE_KEY,
        JSON.stringify(newData),
      ).catch(err => {
        console.error('Failed to update recently viewed jobs:', err);
      });
    }
  }, [loading, paramsJob, paramsJob.id, recentlyViewedJobs]);

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
        <View
          style={[
            style.main,
            {
              backgroundColor: Colors.bg,
              marginTop: Platform.OS === 'ios' ? 10 : 0,
            },
          ]}>
          <AppBar
            color={Colors.bg}
            elevation={0}
            title="Details"
            titleStyle={[style.subtitle, {color: Colors.txt}]}
            leading={
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[style.icon]}>
                <Icon name="arrow-back" size={24} color={Colors.active} />
              </TouchableOpacity>
            }
            trailing={
              !isUserEmployer(userData) && <JobBookmark job={details} />
            }
          />

          {isLoading ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                marginBottom: 80,
              }}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <>
              <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                style={{marginTop: 10}}>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <Image
                    source={getCompanyLogo(companyDetails?.logo)}
                    resizeMode="stretch"
                    style={{height: 88, width: 88, borderRadius: 8}}
                  />
                  <View style={{marginLeft: 10, flex: 1}}>
                    <Text style={[style.r14, {color: Colors.txt}]}>
                      {companyDetails?.name}
                    </Text>
                    <Text style={[style.s18, {color: Colors.txt}]}>
                      {details?.job_title}
                    </Text>

                    <View style={{flexDirection: 'row', gap: 5}}>
                      <Image
                        source={require('../../../assets/image/s22.png')}
                        resizeMode="contain"
                        style={{height: 17, width: 17}}
                      />
                      <Text style={[style.s12, {color: Colors.disable}]}>
                        Posted {moment(details?.created_at).fromNow()}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    marginTop: 10,
                    flexWrap: 'wrap',
                  }}>
                  {details?.job_type && (
                    <Chip
                      label={details?.job_type}
                      style={styles.chip}
                      labelStyle={{fontSize: 12}}
                      contentContainerStyle={styles.chip}
                      color={getJobTypeChipColor(details?.job_type)}
                    />
                  )}

                  {details?.job_position && (
                    <Chip
                      label={details?.job_position}
                      style={styles.chip}
                      labelStyle={{fontSize: 12}}
                      contentContainerStyle={styles.chip}
                      color={'#3f51b5'}
                    />
                  )}

                  {details?.job_priority?.toLowerCase() === 'high' && (
                    <Chip
                      label={'Urgent'}
                      style={styles.chip}
                      labelStyle={{fontSize: 12}}
                      contentContainerStyle={styles.chip}
                      color={'red'}
                    />
                  )}
                </View>

                <IconRow
                  name="Salary"
                  icon={require('../../../assets/image/s10.png')}
                  value={getSalaryAmount(details)}
                />

                <IconRow
                  name="Location"
                  icon={require('../../../assets/image/s19.png')}
                  value={details?.location?.name || 'India'}
                />

                <IconRow
                  name="Experience"
                  icon={require('../../../assets/image/s13.png')}
                  value={getJobExperiences(details)}
                />

                <IconRow
                  name="Employment type"
                  icon={require('../../../assets/image/s20.png')}
                  value={details?.job_type}
                />

                <IconRow
                  name="Number of openings"
                  icon={require('../../../assets/image/s21.png')}
                  value={details?.total_number_of_vacancies}
                />

                {details?.description && (
                  <>
                    <Text
                      style={[style.m18, {color: Colors.txt, marginTop: 30}]}>
                      Job Description
                    </Text>

                    <Text style={[style.r14, {color: '#313131', marginTop: 5}]}>
                      {details?.description}
                    </Text>
                  </>
                )}

                {details?.job_responsibilities && (
                  <>
                    <Text
                      style={[style.m18, {color: Colors.txt, marginTop: 30}]}>
                      Job Responsibilities
                    </Text>
                    {getList(details?.job_responsibilities)}
                  </>
                )}

                {details?.qualifications_required ? (
                  <>
                    <Text
                      style={[style.m18, {color: Colors.txt, marginTop: 30}]}>
                      Qualification
                    </Text>
                    {getList(details?.qualifications_required)}
                  </>
                ) : null}

                {details?.skills_and_experience ? (
                  <>
                    <Text
                      style={[style.m18, {color: Colors.txt, marginTop: 30}]}>
                      Skill & Experience
                    </Text>
                    {getList(details?.skills_and_experience)}
                  </>
                ) : null}

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginTop: 10,
                  }}>
                  {getKeywords(details?.search_keywords)}
                </View>

                <Divider style={{height: 1, marginTop: 15}} />

                <View style={{marginBottom: 40}}>
                  <Text style={[style.m18, {color: Colors.txt, marginTop: 15}]}>
                    About Company
                  </Text>

                  <IconRow2
                    image={getCompanyLogo(companyDetails?.logo)}
                    name="Name"
                    value={companyDetails?.name}
                    onPress={() =>
                      navigation.navigate('CDetail', {id: companyDetails?.id})
                    }
                    hasLink={true}
                  />

                  {companyDetails?.job_location_id && (
                    <IconRow2
                      iconName="location-outline"
                      name="Location"
                      value={getLocationById(companyDetails?.job_location_id)}
                    />
                  )}
                </View>
              </ScrollView>

              {!isUserEmployer(userData) && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.RBSheet.open()}
                    style={[style.btn, {flex: 1}]}>
                    <Text style={[style.btntxt]}>APPLY JOB</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>

        <ApplyJobModal job={details} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 32,
    justifyContent: 'center',
    minWidth: 100,
  },
});

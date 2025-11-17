/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppLoader from '../../components/AppLoader';
import useGetJobLocation from '../../components/useGetJobLocation';
import { Colors } from '../../theme/color';
import style from '../../theme/style';
import {
  getFileExtension,
  getParsedJson,
  getSalaryAmount,
  getTimeAgo,
  getUserImage,
  getWorkExpText,
  humanReadableSize,
  toArray,
  addHttps,
} from '../../utils';
import ScreenLayout from '../ScreenLayout';
import { usersApiSlice } from '../users-api-slice';
import { Chip } from '@react-native-material/core';
import Qualifications from '../Account/Qualifications';
import WorkExperience from '../Account/WorkExperience';
import { IconRow } from '../../components/Common';
import useViewCandidateDetails from '../../components/useViewCandidateDetails';
import useAsyncStorage from '../../utils/useAsyncStorage';
import Configs from '../../utils/Configs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Linking } from 'react-native';

import Certifications from '../Account/Certifications';

const width = Dimensions.get('window').width;

export default function CandidateDetails({ route }) {
  const { getLocation } = useGetJobLocation();

  const [
    getCustomerDetails,
    { fullCustomerDetails, isLoading: viewUserLoading, alertModal },
  ] = useViewCandidateDetails();

  const params = route?.params;

  const {
    data: details,
    isLoading,
    isFetching,
    refetch,
  } = usersApiSlice.useGetCustomerPublicDetailsQuery(params?.id, {
    skip: !params?.id,
  });

  const getAttributesList = item => {
    const list = toArray(item, ',');
    return list || [];
  };

  const handleSocialMediaPress = async (platform, url) => {
    try {
      // First, call getCustomerDetails to deduct credits
      const response = await getCustomerDetails(params?.id, 'viewDetails');

      if (!response) {
        return;
      }

      switch (platform) {
        case 'facebook':
        case 'twitter':
        case 'linkedin':
          const formattedUrl = addHttps(url);
          if (formattedUrl) {
            Linking.openURL(formattedUrl);
          }
          break;
        case 'whatsapp':
          const phoneNumber = url.replace(/[^0-9]/g, '');
          const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
          Linking.openURL(whatsappUrl);
          break;
        default:
          console.warn('Unknown social media platform:', platform);
      }
    } catch (error) {
      console.error('Error opening social media link:', error);
    }
  };

  const additionalDetails = getParsedJson(details?.additional_fields);
  const { value: recentlyViewedCandidates, loading } = useAsyncStorage(
    Configs.RECENTLY_VIEWED_CANDIDATES_STORAGE_KEY,
  );

  useEffect(() => {
    if (!loading) {
      // Assume recentlyViewedCandidates is a JSON string and parse it to get the array.
      const currentViewedCandidates = recentlyViewedCandidates || [];

      let newData = [...currentViewedCandidates];

      // Check if details.id is defined and process accordingly.
      if (details && details?.id) {
        // Convert to number as we're using parseInt later; consistency is key.
        const candidateId = parseInt(details?.id, 10);

        // If candidateId is already in newData, remove it.
        newData = newData.filter(id => id !== candidateId);

        // Then unshift candidateId to make it the most recent.
        newData.unshift(candidateId);
      }

      // Update AsyncStorage, handle the promise with a catch for errors.
      AsyncStorage.setItem(
        Configs.RECENTLY_VIEWED_CANDIDATES_STORAGE_KEY,
        JSON.stringify(newData),
      ).catch(err => {
        console.error('Failed to update recently viewed candidates:', err);
      });
    }
  }, [details, loading, recentlyViewedCandidates]);

  if (isLoading) {
    return (
      <ScreenLayout title="Candidate Details">
        <AppLoader />
      </ScreenLayout>
    );
  }

  if (!details) {
    return (
      <ScreenLayout title="Candidate Details">
        <View
          style={{
            flex: 0.9,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={[style.s22]}>Not Found</Text>

          <Text style={[style.m14]}>
            Sorry, Candidate not found for the given id.
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  const SingleFileItem = ({ fileName, fileSize, displayName, fieldType }) => {
    if (!fileName) {
      return null;
    }
    return (
      <View style={styles.fileMain}>
        <View style={styles.fileInnerLeft}>
          <View style={styles.fileIcon}>
            <Icon name="file1" size={20} />
          </View>

          <View>
            <Text style={[style.m15, { color: Colors.txt }]}>
              {displayName}
            </Text>
            <View style={styles.fileBottomWrapper}>
              <Text style={[style.r13, { color: Colors.txt }]}>
                {humanReadableSize(fileSize)}
              </Text>

              <View style={styles.extPill}>
                <Text style={[style.r10, styles.extText]}>
                  {getFileExtension(fileName)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Pressable
          style={{ padding: 8 }}
          onPress={() =>
            getCustomerDetails(params?.id, 'downloadResume', fieldType)
          }>
          <Icon name="download" size={20} />
        </Pressable>
      </View>
    );
  };

  return (
    <>
      {viewUserLoading && <AppLoader v="v2" />}
      <ScreenLayout
        title="Candidate Details"
        statusBarBgColor={viewUserLoading ? 'rgba(0,0,0, 0.3)' : null}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 10 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              gap: 10,
              marginBottom: 15,
            }}>
            <Image
              source={getUserImage(additionalDetails?.profile_picture)}
              resizeMode="contain"
              style={{ height: 88, width: 88, marginTop: 10, borderRadius: 50 }}
            />

            <View
              style={{
                marginTop: 20,
                width: width - 140,
              }}>
              <Text
                style={[style.subtitle, { color: Colors.txt, width: '100%' }]}>
                {details?.name}
              </Text>
              {additionalDetails?.designation && (
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 6,
                    paddingRight: 50,
                  }}>
                  <Image
                    source={require('../../../assets/image/s13.png')}
                    resizeMode="contain"
                    style={{ height: 18, width: 18 }}
                  />
                  <Text style={[style.m14, { color: Colors.txt }]}>
                    {additionalDetails?.designation}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <IconRow
            name="Phone"
            image={require('../../../assets/image/t6.png')}
            value={fullCustomerDetails?.mobile_number}
            isHiddenValue={!fullCustomerDetails}
            onViewUserDetails={() =>
              getCustomerDetails(params?.id, 'viewDetails')
            }
          />

          <IconRow
            name="Email"
            image={require('../../../assets/image/t3.png')}
            value={fullCustomerDetails?.email}
            isHiddenValue={!fullCustomerDetails}
            onViewUserDetails={() =>
              getCustomerDetails(params?.id, 'viewDetails')
            }
          />

          <IconRow
            name="Active"
            iconName="time-outline"
            value={
              details?.last_login_date
                ? getTimeAgo(details?.last_login_date)
                : null
            }
            onViewUserDetails={() =>
              getCustomerDetails(params?.id, 'viewDetails')
            }
          />

          <IconRow
            name="Location"
            image={require('../../../assets/image/s19.png')}
            value={getLocation(additionalDetails?.location)}
          />

          <IconRow
            name="Job Type"
            image={require('../../../assets/image/s20.png')}
            value={additionalDetails?.job_type}
          />

          <IconRow
            name="Salary"
            image={require('../../../assets/image/s10.png')}
            value={getSalaryAmount(
              additionalDetails?.expected_salary_per_month,
            )}
          />

          <IconRow
            name="Work Experience"
            image={require('../../../assets/image/s23.png')}
            value={getWorkExpText(additionalDetails?.total_work_experience)}
          />

          {/* Social Media Links */}
          {(additionalDetails?.facebook_url ||
            additionalDetails?.twitter_url ||
            additionalDetails?.linkedin_url ||
            additionalDetails?.whatsapp_number) && (
            <View style={styles.boxContainer}>
              <Text
                style={[style.m16, { color: Colors.txt, marginBottom: 12 }]}>
                Social Media
              </Text>

              <View style={styles.socialMediaContainer}>
                {additionalDetails?.facebook_url && (
                  <TouchableOpacity
                    onPress={() =>
                      handleSocialMediaPress(
                        'facebook',
                        additionalDetails.facebook_url,
                      )
                    }
                    style={styles.facebookButton}>
                    <Icon name="facebook-square" size={20} color="#fff" />
                  </TouchableOpacity>
                )}

                {additionalDetails?.twitter_url && (
                  <TouchableOpacity
                    onPress={() =>
                      handleSocialMediaPress(
                        'twitter',
                        additionalDetails.twitter_url,
                      )
                    }
                    style={styles.twitterButton}>
                    <Icon name="twitter" size={20} color="#fff" />
                  </TouchableOpacity>
                )}

                {additionalDetails?.linkedin_url && (
                  <TouchableOpacity
                    onPress={() =>
                      handleSocialMediaPress(
                        'linkedin',
                        additionalDetails.linkedin_url,
                      )
                    }
                    style={styles.linkedinButton}>
                    <Icon name="linkedin-square" size={20} color="#fff" />
                  </TouchableOpacity>
                )}

                {additionalDetails?.whatsapp_number && (
                  <TouchableOpacity
                    onPress={() =>
                      handleSocialMediaPress(
                        'whatsapp',
                        additionalDetails.whatsapp_number,
                      )
                    }
                    style={styles.whatsappButton}>
                    <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {(additionalDetails?.resume || additionalDetails?.cover_letter) && (
            <View style={styles.boxContainer}>
              <Text
                style={[style.m16, { color: Colors.txt, marginBottom: 12 }]}>
                Documents
              </Text>

              <SingleFileItem
                displayName={'Resume'}
                fileName={additionalDetails?.resume}
                fileSize={additionalDetails?.resume_size}
                fieldType="resume"
              />

              <SingleFileItem
                displayName={'Cover Letter'}
                fileName={additionalDetails?.cover_letter}
                fileSize={additionalDetails?.cover_letter_size}
                fieldType="cover_letter"
              />
            </View>
          )}

          <View style={styles.boxContainer}>
            <Text style={[style.m16, { color: Colors.txt }]}>About</Text>

            <Text style={[style.r13, { color: '#313131', marginTop: 10 }]}>
              {additionalDetails?.details || 'No details available.'}
            </Text>
          </View>

          {additionalDetails?.skills && (
            <View style={styles.boxContainer}>
              <Text style={[style.m16, { color: Colors.txt }]}>
                Professional Skills
              </Text>

              <View style={styles.chipWrapper}>
                {getAttributesList(additionalDetails?.skills)?.map(
                  (item, index) => (
                    <Chip
                      label={item}
                      labelStyle={{ fontSize: 12 }}
                      style={{ height: 'auto', paddingVertical: 4 }}
                      contentContainerStyle={{ height: 'auto' }}
                      pressEffect="none"
                      variant="filled"
                      color={'#3f51b5'}
                      key={`skills-${index}`}
                    />
                  ),
                )}
              </View>
            </View>
          )}

          {additionalDetails?.languages_known && (
            <View style={styles.boxContainer}>
              <Text style={[style.m16, { color: Colors.txt }]}>
                Spoken languages
              </Text>

              <View style={styles.chipWrapper}>
                {getAttributesList(additionalDetails?.languages_known)?.map(
                  (item, index) => (
                    <Chip
                      label={item}
                      labelStyle={{ fontSize: 12 }}
                      style={{ height: 'auto', paddingVertical: 4 }}
                      contentContainerStyle={{ height: 'auto' }}
                      variant="filled"
                      color={'#5E35B1'}
                      key={`skills-${index}`}
                      pressEffect="none"
                    />
                  ),
                )}
              </View>
            </View>
          )}

          <Qualifications userId={params?.id} />
          <WorkExperience userId={params?.id} />
          <Certifications userId={params?.id} />
        </ScrollView>

        {alertModal}
      </ScreenLayout>
    </>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.divider,
    marginTop: 20,
    position: 'relative',
  },
  chipWrapper: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 6,
    flexWrap: 'wrap',
  },
  fileMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fileInnerLeft: { flexDirection: 'row', gap: 10 },
  fileIcon: {
    borderWidth: 1,
    borderColor: Colors.divider,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 3,
  },
  fileBottomWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  extPill: {
    backgroundColor: Colors.divider,
    borderRadius: 15,
    paddingHorizontal: 8,
  },
  extText: {
    color: Colors.txt,
    textTransform: 'uppercase',
    marginBottom: -2,
  },
  socialMediaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flexWrap: 'wrap',
  },
  facebookButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  twitterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1DA1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkedinButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0077B5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

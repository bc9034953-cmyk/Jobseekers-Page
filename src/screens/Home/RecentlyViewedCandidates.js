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
import { getParsedJson, getUserImage } from '../../utils';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Configs from '../../utils/Configs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usersApiSlice } from '../users-api-slice';
import useGetJobLocation from '../../components/useGetJobLocation';
const width = Dimensions.get('screen').width;

export default function RecentlyViewedCandidates({ isUserEmployer }) {
  const { data: allCandidates } = usersApiSlice.useGetCustomersQuery({
    type: 2,
    params: {
      'AdditionalFieldsSearch[is_required_fields_completed]': 'yes',
      'per-page': 1000,
      page: 1,
      sort: '-id',
    },
  });
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { getLocation } = useGetJobLocation();

  const [viewedCandidates, setViewedCandidates] = useState([]);

  useEffect(() => {
    const fetchRecentlyViewedCandidates = async () => {
      if (isFocused) {
        try {
          let recentlyViewed = [];

          // Read the candidates from AsyncStorage
          const storedCandidatesJson = await AsyncStorage.getItem(
            Configs.RECENTLY_VIEWED_CANDIDATES_STORAGE_KEY,
          );

          const recentlyViewedCandidateIds = getParsedJson(
            storedCandidatesJson,
            '[]',
          );

          if (recentlyViewedCandidateIds?.length > 0) {
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
          }

          console.log('recentlyViewed::', recentlyViewed);

          setViewedCandidates(recentlyViewed);
        } catch (e) {
          // Handle errors, possibly by setting an error state
          console.error(
            'Failed to fetch recently viewed candidates from storage:',
            e,
          );
        }
      }
    };

    fetchRecentlyViewedCandidates();
  }, [allCandidates, isFocused]);

  const getAdditionalDetails = candidate => {
    return getParsedJson(candidate?.additional_fields);
  };

  const getProfilePicture = candidate => {
    const additionalDetails = getParsedJson(candidate?.additional_fields);

    return getUserImage(additionalDetails?.profile_picture);
  };

  if (viewedCandidates?.length === 0 || !isUserEmployer) {
    return null;
  }

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 18,
          gap: 15,
        }}>
        <Text
          style={[
            style.s18,
            { color: Colors.active, flex: 1, lineHeight: 24 },
          ]}>
          Recently Viewed Candidates
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('RecentlyViewedCandidatesPage')}>
            <Text style={[style.m14, { color: Colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginTop: 3 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}>
          {viewedCandidates?.map(candidate => (
            <Pressable
              style={{ padding: 5, marginBottom: 10, flex: 1 }}
              key={`recently-viewed-candidate-${candidate?.id}`}
              onPress={() =>
                navigation.navigate('CandidateDetails', { id: candidate?.id })
              }>
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
                    source={getProfilePicture(candidate)}
                    resizeMode="contain"
                    style={{
                      height: 60,
                      width: 60,
                      marginTop: -7,
                      borderRadius: 50,
                    }}
                  />
                </View>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text
                    style={[style.s16, { color: Colors.active }]}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {candidate?.name}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                    }}>
                    <Image
                      source={require('../../../assets/image/s19.png')}
                      resizeMode="contain"
                      style={{
                        height: 15,
                        width: 15,
                        tintColor: Colors.primary,
                      }}
                    />
                    <Text
                      style={[style.r12, { color: '#212121', marginLeft: 5 }]}>
                      {getLocation(getAdditionalDetails(candidate)?.location) ||
                        'India'}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 2,
                      paddingRight: 20,
                    }}>
                    <Image
                      source={require('../../../assets/image/s13.png')}
                      resizeMode="contain"
                      style={{ height: 15, width: 15 }}
                    />
                    <Text
                      style={[style.r12, { color: '#212121', marginLeft: 5 }]}>
                      {getAdditionalDetails(candidate)?.designation}
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

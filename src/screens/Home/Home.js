import { AppBar, Avatar, Badge, HStack } from '@react-native-material/core';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../theme/color';
import style from '../../theme/style';
import {
  getFirstChar,
  getParsedJson,
  getTimeBasedGreeting,
  getUnreadNotifications,
  isUserEmployer,
} from '../../utils';
import Configs from '../../utils/Configs';
import Banners from './Banners';
import NewRandomJobs from './NewRandomJobs';
import RecentlyViewedJobs from './RecentlyViewedJobs';
import { notificationsApiSlice } from '../api-slices/notifications-api-slice';
import { companiesApiSlice } from '../api-slices/companies-api-slice';
import { clearUserData } from '../users-slice';
import AppLoader from '../../components/AppLoader';
import { width } from '../../theme';
import RecentlyViewedCandidates from './RecentlyViewedCandidates';
import HomeManageJobs from './HomeManageJobs';
import WalletButton from './WalletButton';

export default function Home() {
  const navigation = useNavigation();

  const isFocused = useIsFocused();

  const userData = useSelector(state => state.users.data);
  const customer = userData?.customer;
  const authToken = userData?.token;

  const customerAdditional = getParsedJson(customer?.additional_fields, null);

  const {
    data: notifications,
    error,
    isLoading,
  } = notificationsApiSlice.useGetNotificationsQuery(
    {},
    { skip: !authToken || !isFocused, pollingInterval: 5000 },
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const notificationError = error?.data?.message;

    const hasSessionExpired = notificationError?.includes(
      'Your request was made with invalid credentials',
    );

    if (hasSessionExpired && authToken) {
      console.log('error home::', error);
      console.log('logout from home notification::');

      dispatch(clearUserData());
    }
  }, [error, dispatch, authToken]);

  const { data: companies, isLoading: companyLoading } =
    companiesApiSlice.useGetCompaniesQuery(
      {
        'JobCompaniesSearch[employer_id]': userData?.customer?.id,
      },
      { skip: !isUserEmployer(userData) },
    );

  const unreadNotificationsCount = authToken
    ? getUnreadNotifications(notifications)?.length
    : 0;

  const profilePicture = customerAdditional
    ? {
        uri: `${Configs.DATA_URL}/customers/120x120-${customerAdditional?.profile_picture}`,
      }
    : require('../../../assets/image/user.png');

  const navigateProfile = () => {
    let path = 'Profile';

    if (!userData?.token) {
      path = 'Login';
    }

    if (isUserEmployer(userData)) {
      path = 'EmpProfileForm';
    }

    navigation.navigate(path);
  };

  const navigateNotification = () => {
    if (authToken) {
      navigation.navigate('Notification');
    } else {
      navigation.navigate('Login');
    }
  };

  const handlePostJob = () => {
    navigation.navigate(companies?.length > 0 ? 'JobForm' : 'CompanyForm');
  };

  const searchNavigate = () => {
    navigation.navigate(
      isUserEmployer(userData) ? 'CandidateListing' : 'JobListing',
    );
  };

  const searchPlaceholder = () => {
    if (isUserEmployer(userData)) {
      return 'Search candidates';
    }

    return 'Search jobs';
  };

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.bg }]}>
      <StatusBar
        backgroundColor={Colors.bg}
        translucent={false}
        barStyle={'dark-content'}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View
          style={[style.main, { backgroundColor: Colors.bg, marginTop: 10 }]}>
          <AppBar
            color={Colors.bg}
            elevation={0}
            leading={
              <View
                style={{
                  width: width / (isUserEmployer(userData) ? 2.4 : 1.9),
                }}>
                <Text style={[style.m14, { color: Colors.active }]}>
                  {getTimeBasedGreeting()}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    style.apptitle,
                    { color: Colors.txt, lineHeight: 28 },
                  ]}>
                  {customer?.name || 'Guest'}
                </Text>
              </View>
            }
            trailing={
              <HStack style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={navigateNotification}>
                  <Icon name="notifications" size={28} color={Colors.active} />
                  <Badge
                    label={unreadNotificationsCount}
                    color={Colors.red}
                    style={{ position: 'absolute', right: -6, top: -6 }}
                    labelStyle={{ fontSize: 12 }}
                  />
                </TouchableOpacity>
                {isUserEmployer(userData) ? (
                  <WalletButton />
                ) : (
                  <Pressable
                    style={{ marginLeft: 13 }}
                    onPress={navigateProfile}>
                    <Avatar
                      size={42}
                      image={profilePicture}
                      color="#eee"
                      imageStyle={{ borderWidth: 1, borderColor: Colors.bord }}
                      label={getFirstChar(customer?.name)}
                      initials={false}
                    />
                  </Pressable>
                )}
              </HStack>
            }
          />

          <Pressable
            onPress={searchNavigate}
            unstable_pressDelay={0}
            style={[style.shadow, style.inputContainer, styles.inputContainer]}>
            <Icon name="search" size={24} color={Colors.active} />
            <TextInput
              placeholder={searchPlaceholder()}
              placeholderTextColor={Colors.disable2}
              selectionColor={Colors.primary}
              value={''}
              returnKeyType="search"
              editable={false}
              style={[style.r14, styles.input]}
            />
          </Pressable>

          {isLoading ? (
            <AppLoader />
          ) : (
            <>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}>
                <Banners isUserEmployer={isUserEmployer(userData)} />

                {/* For Candidate */}
                <RecentlyViewedJobs isUserEmployer={isUserEmployer(userData)} />
                <NewRandomJobs isUserEmployer={isUserEmployer(userData)} />

                {/* For Employer */}
                <RecentlyViewedCandidates
                  isUserEmployer={isUserEmployer(userData)}
                />
                <HomeManageJobs isUserEmployer={isUserEmployer(userData)} />
              </ScrollView>

              {isUserEmployer(userData) && !companyLoading && (
                <View style={styles.floatBtnContainer}>
                  <Pressable onPress={handlePostJob} style={styles.floatBtn}>
                    <Entypo name="plus" size={20} color={Colors.white} />
                    <Text
                      style={[
                        style.r14,
                        { color: Colors.white, marginTop: 3 },
                      ]}>
                      {companies?.length > 0
                        ? 'Post a new job'
                        : 'Create a company'}
                    </Text>
                  </Pressable>
                </View>
              )}
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  floatBtnContainer: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  floatBtn: {
    backgroundColor: Colors.primary,
    padding: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  input: {
    color: Colors.active,
    marginLeft: 5,
    marginTop: 4,
    flex: 1,
  },
  inputContainer: {
    height: 52,
    marginHorizontal: 5,
    backgroundColor: Colors.bg,
    shadowColor: Colors.active,
    marginTop: 10,
    marginBottom: 5,
  },
});

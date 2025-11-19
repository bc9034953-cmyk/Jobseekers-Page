import { AppBar, Avatar, Badge, HStack } from '@react-native-material/core';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect ,  useRef  } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Image,
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
import NotificationIcon from "../../../assets/image/notificationIcon.png";
import Footer from "../../components/Footer";



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
    : require('../../../assets/image/profileIconNew.png');

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

  const scrollRef = useRef(null);


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
          {/* <AppBar
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
          /> */}

          {/* 🔥 NEW COMPACT HEADER */}
<View style={styles.topHeader}>

  {/* 1️⃣ TOP ROW — LOGO + ICONS */}
  <View style={styles.topRow}>
    
    {/* LOGO */}
    <Image
      source={require('../../../assets/image/Jobseekerslogo.png')}
      style={[styles.logo, ] }
    />

    {/* ICONS RIGHT SIDE */}
    <View style={styles.rightIcons}>
      {/* <TouchableOpacity onPress={navigateNotification} style={styles.iconWrapper}>
        <Icon name="notifications" size={20} color={Colors.active} />

        {unreadNotificationsCount > 0 && (
          <View style={styles.badge}>
            <Text style={{ color: "#fff", fontSize: 10 }}>
              {unreadNotificationsCount}
            </Text>
          </View>
        )}
      </TouchableOpacity> */}

      <TouchableOpacity onPress={navigateNotification} style={styles.iconWrapper}>
  <Image
    source={NotificationIcon}
    style={{ width: 30, height: 30, resizeMode: "contain" }}
  />

  {unreadNotificationsCount > 0 && (
    <View style={styles.badge}>
      <Text style={{ color: "#fff", fontSize: 10 }}>
        {unreadNotificationsCount}
      </Text>
    </View>
  )}
</TouchableOpacity>

      <TouchableOpacity onPress={navigateProfile} style={styles.profileCircle}>
        <Image
          source={profilePicture}
          style={{ width: 35, height: 35, borderRadius: 18 }}
        />
      </TouchableOpacity>
    </View>

  </View>

  {/* 2️⃣ GREETING + NAME IN ONE LINE */}
  <Text style={styles.greetLine}>
    {getTimeBasedGreeting()}, <Text style={styles.nameText}>{customer?.name || "Guest"}</Text>
  </Text>

</View>


          

          <Pressable
            onPress={searchNavigate}
            unstable_pressDelay={0}
            style={[style.inputContainer, styles.inputContainer ]}>
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
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}>
                <Banners isUserEmployer={isUserEmployer(userData)} />

                {/* For Candidate */}
                <RecentlyViewedJobs isUserEmployer={isUserEmployer(userData)} />
                
                <NewRandomJobs 
                    isUserEmployer={isUserEmployer(userData)} 
                    scrollRef={scrollRef}
                   />
                {/* For Employer */}
                <RecentlyViewedCandidates
                  isUserEmployer={isUserEmployer(userData)}
                />
                <HomeManageJobs isUserEmployer={isUserEmployer(userData)} />
                  {/* ⭐ FOOTER ALWAYS AT END */}
                   <Footer />
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
    marginTop: 5,
    marginBottom: 5,
  },
  topHeader: {

  paddingHorizontal: 20,
  paddingTop: 15,
  paddingBottom: 20,
  borderBottomLeftRadius: 25,
  borderBottomRightRadius: 25,
},

topRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

logo: {
  width: 140,
  height: 40,
  resizeMode: "contain",
},

rightIcons: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
},

iconWrapper: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "#fff",
  justifyContent: "center",
  alignItems: "center",
},

badge: {
  position: "absolute",
  right: -3,
  top: -3,
  backgroundColor: "red",
  paddingHorizontal: 5,
  paddingVertical: 2,
  borderRadius: 10,
},

profileCircle: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "#d4cbcbff",
  justifyContent: "center",
  alignItems: "center",
},

greetLine: {
  marginTop: 1,
  fontSize: 18,
  color: "#554478",
  fontWeight: "600",
},

nameText: {
  color: Colors.txt,
  fontWeight: "bold",
  fontSize: 18,
},

});

// const RoleGrid = () => {
//   const items = [
//     { title: "Recent Jobs", color: "#E8F5E9" },       // light green
//     { title: "Full Time", color: "#EDE7F6" },         // lavender
//     { title: "Part Time", color: "#FFFDE7" },         // soft yellow
//     { title: "Freelancer", color: "#E3F2FD" },        // light blue
//   ];

//   return (
//     <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
//       <Text
//         style={{
//           fontSize: 20,
//           fontWeight: "700",
//           color: "#3b2b52",
//           marginBottom: 15,
//         }}
//       >
//         Find Your Perfect Role
//       </Text>

//       <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
//         {items.map((item, index) => (
//           <View
//             key={index}
//             style={{
//               width: "48%",
//               height: 110,
//               borderRadius: 18,
//               backgroundColor: item.color,
//               marginBottom: 12,
//               justifyContent: "center",
//               alignItems: "center",
//               shadowColor: "#000",
//               shadowOpacity: 0.05,
//               shadowRadius: 6,
//               shadowOffset: { width: 0, height: 3 },
//               elevation: 2,
//             }}
//           >
//             <Text style={{ fontSize: 18, fontWeight: "700", color: "#333" }}>
//               {item.title}
//             </Text>
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// };


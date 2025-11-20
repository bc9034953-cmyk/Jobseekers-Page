import React, { useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
  SafeAreaView,
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";

import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../../theme/color";
import style from "../../theme/style";

import {
  getParsedJson,
  getTimeBasedGreeting,
  getUnreadNotifications,
  isUserEmployer,
} from "../../utils";

import Configs from "../../utils/Configs";

import Banners from "./Banners";
import NewRandomJobs from "./NewRandomJobs";
import RecentlyViewedJobs from "./RecentlyViewedJobs";
import RecentlyViewedCandidates from "./RecentlyViewedCandidates";
import HomeManageJobs from "./HomeManageJobs";
import Footer from "../../components/Footer";
import AppLoader from "../../components/AppLoader";

import NotificationIcon from "../../../assets/image/notificationIcon.png";

import { notificationsApiSlice } from "../api-slices/notifications-api-slice";
import { companiesApiSlice } from "../api-slices/companies-api-slice";
import { clearUserData } from "../users-slice";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import { ScrollView } from "react-native-gesture-handler";


export default function Home() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const userData = useSelector((state) => state.users.data);
  const customer = userData?.customer;
  const authToken = userData?.token;

  const customerAdditional = getParsedJson(customer?.additional_fields);

  const {
    data: notifications,
    error,
    isLoading,
  } = notificationsApiSlice.useGetNotificationsQuery(
    {},
    { skip: !authToken || !isFocused, pollingInterval: 5000 }
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const msg = error?.data?.message;
    if (msg?.includes("invalid credentials") && authToken) {
      dispatch(clearUserData());
    }
  }, [error]);

  const unread = authToken ? getUnreadNotifications(notifications)?.length : 0;

  const { data: companies, isLoading: companyLoading } =
    companiesApiSlice.useGetCompaniesQuery(
      {
        "JobCompaniesSearch[employer_id]": userData?.customer?.id,
      },
      { skip: !isUserEmployer(userData) }
    );

  const profilePicture = customerAdditional?.profile_picture
    ? {
        uri: `${Configs.DATA_URL}/customers/120x120-${customerAdditional.profile_picture}`,
      }
    : require("../../../assets/image/profileIconNew.png");

  const navigateProfile = () => {
    let path = "Profile";
    if (!authToken) path = "Login";
    if (isUserEmployer(userData)) path = "EmpProfileForm";
    navigation.navigate(path);
  };

  const navigateNotification = () => {
    navigation.navigate(authToken ? "Notification" : "Login");
  };

  const searchNavigate = () => {
    navigation.navigate(
      isUserEmployer(userData) ? "CandidateListing" : "JobListing"
    );
  };

  const searchPlaceholder = isUserEmployer(userData)
    ? "Search candidates"
    : "Search jobs";

  const handlePostJob = () => {
    navigation.navigate(companies?.length ? "JobForm" : "CompanyForm");
  };

  const scrollRef = useRef(null);

  // ⭐ Greeting + Search Animation
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.bg }]}>
      <StatusBar backgroundColor={Colors.bg} barStyle="dark-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[style.main, { backgroundColor: Colors.bg }]}>


          {/* ⭐ ORIGINAL HEADER (UNCHANGED) */}
          <View style={styles.topHeader}>

            {/* ROW: Logo + Icons */}
            <View style={styles.topRow}>
              <Image
                source={require("../../../assets/image/Jobseekerslogo.png")}
                style={styles.logo}
              />

              <View style={styles.rightIcons}>
                <TouchableOpacity
                  onPress={navigateNotification}
                  style={styles.iconWrapper}
                >
                  <Image
                    source={NotificationIcon}
                    style={{ width: 26, height: 26 }}
                  />

                  {unread > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{unread}</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={navigateProfile}
                  style={styles.profileCircle}
                >
                  <Image
                    source={profilePicture}
                    style={styles.profileImg}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* ⭐ GREETING — fade + slide up */}
            <Animated.Text
              style={[
                styles.greetLine,
                {
                  opacity: scrollY.interpolate({
                    inputRange: [0, 40],
                    outputRange: [1, 0],
                    extrapolate: "clamp",
                  }),
                  transform: [
                    {
                      translateY: scrollY.interpolate({
                        inputRange: [0, 40],
                        outputRange: [0, -20],
                        extrapolate: "clamp",
                      }),
                    },
                  ],
                },
              ]}
            >
              {getTimeBasedGreeting()},{" "}
              <Text style={styles.nameText}>{customer?.name || "Guest"}</Text>
            </Animated.Text>

          </View>


          {/* ⭐ SEARCH BAR SLIDE UP */}
          <Animated.View
            style={[
              styles.searchWrapper,
              {
                marginTop: scrollY.interpolate({
                  inputRange: [0, 40],
                  outputRange: [8, -33],   // ⭐ more upward
                  extrapolate: "clamp",
                  }),

              },
            ]}
          >
            <Pressable
              onPress={searchNavigate}
              style={[style.inputContainer, styles.inputContainer]}
            >
              <Icon name="search" size={22} color={Colors.active} />
              <TextInput
                placeholder={searchPlaceholder}
                editable={false}
                placeholderTextColor={Colors.disable2}
                style={[style.r14, styles.input]}
              />
            </Pressable>
          </Animated.View>


          {/* ⭐ SCROLL CONTENT (UNCHANGED) */}
          <Animated.ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
          >
            <Banners isUserEmployer={isUserEmployer(userData)} />

            <RecentlyViewedJobs isUserEmployer={isUserEmployer(userData)} />

            <NewRandomJobs
              isUserEmployer={isUserEmployer(userData)}
              scrollRef={scrollRef}
            />

            <RecentlyViewedCandidates
              isUserEmployer={isUserEmployer(userData)}
            />

            <HomeManageJobs isUserEmployer={isUserEmployer(userData)} />

            <Footer />
          </Animated.ScrollView>


          {/* FLOAT BUTTON */}
          {isUserEmployer(userData) && !companyLoading && (
            <View style={styles.floatBtnContainer}>
              <Pressable onPress={handlePostJob} style={styles.floatBtn}>
                <Entypo name="plus" size={20} color="#fff" />
                <Text style={[style.r14, { color: "#fff" }]}>
                  {companies?.length ? "Post a new job" : "Create a company"}
                </Text>
              </Pressable>
              
            </View>

            
          )}

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


/* ------------------ STYLES (ORIGINAL + SLIDE EFFECT) ------------------ */

const styles = StyleSheet.create({
  topHeader: {
    paddingHorizontal: 2,
    marginTop : 3,
    paddingTop: 15,
    paddingBottom: 10,
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

  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },

  profileImg: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },

  badge: {
    position: "absolute",
    right: -3,
    top: -3,
    backgroundColor: "red",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },

  greetLine: {
    marginTop: 4,
    fontSize: 18,
    color: "#554478",
    fontWeight: "600",
  },

  nameText: {
    color: Colors.txt,
    fontWeight: "bold",
    fontSize: 18,
  },

  searchWrapper: {
    paddingHorizontal: 20,
  },

  inputContainer: {
    height: 52,
    backgroundColor: Colors.bg,
  
    marginBottom: 5,
  },

  input: {
    color: Colors.active,
    marginLeft: 6,
    flex: 1,
  },

  floatBtnContainer: {
    position: "absolute",
    bottom: 15,
    width: "100%",
    alignItems: "center",
  },

  floatBtn: {
    backgroundColor: Colors.primary,
    padding: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

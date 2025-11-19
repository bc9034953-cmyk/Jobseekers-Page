import React, { useEffect, useState, useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import SingleJobItem from "../../components/SingleJobItem";
import { Colors } from "../../theme/color";
import style from "../../theme/style";
import { jobsApiSlice } from "../api-slices/jobs-api-slice";
import { ActivityIndicator } from "@react-native-material/core";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { getJobsByType, titleCase } from "../../utils";

export default function NewRandomJobs({ isUserEmployer, scrollRef }) {
  const { data, isLoading, refetch, isUninitialized } =
    jobsApiSlice.useGetJobsQuery();

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState("recent jobs");

  const scrollAnim = useRef(new Animated.Value(0)).current;

  let jobs = getJobsByType(data, activeTab);

  // --------------------------
  // ⭐ SCROLL on TAB PRESS
  // --------------------------
  const handleTabPress = (type) => {
    setActiveTab(type);

    setTimeout(() => {
      scrollRef?.current?.scrollTo({
        y: 550,          // ⭐ Yaha se scroll hoga
        animated: true,
      });
    }, 150);
  };

  useEffect(() => {
    if (isFocused && !isUninitialized) {
      refetch();
    }
  }, [refetch, isFocused, isUninitialized]);

  useEffect(() => {
    Animated.timing(scrollAnim, {
      toValue: 21,
      duration: 180,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(scrollAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
    });
  }, [activeTab]);

  if (isUserEmployer) return null;

  return (
    <Animated.View style={{ paddingTop: scrollAnim }}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={[style.s18, { color: Colors.txt, flex: 1 }]}>
          New & Random Jobs
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("JobListing")}>
          <Text style={[style.m14, { color: Colors.primary }]}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* GRID FILTER UI */}
      <View style={{ marginTop: 15 }}>
        <View style={styles.gridContainer}>

          {/* CARD 1 */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabPress("recent jobs")}
            style={[
              styles.card,
              { backgroundColor: "#DFF8E1" },
              activeTab === "recent jobs" && styles.activeCard,
            ]}
          >
            <View style={styles.leftCol}>
              <Text style={styles.title}>Recent Jobs</Text>
              <Text style={styles.sub}>Latest openings</Text>
            </View>
            <Image
              source={require("../../../assets/image/RecentJob.png")}
              style={styles.cardImage}
            />
          </TouchableOpacity>

          {/* CARD 2 */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabPress("full time")}
            style={[
              styles.card,
              { backgroundColor: "#EEE7FF" },
              activeTab === "full time" && styles.activeCard,
            ]}
          >
            <View style={styles.leftCol}>
              <Text style={styles.title}>Full Time</Text>
              <Text style={styles.sub}>Career roles</Text>
            </View>
            <Image
              source={require("../../../assets/image/FulltimeJob.png")}
              style={styles.cardImage}
            />
          </TouchableOpacity>

          {/* CARD 3 */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabPress("part time")}
            style={[
              styles.card,
              { backgroundColor: "#FFF7C9" },
              activeTab === "part time" && styles.activeCard,
            ]}
          >
            <View style={styles.leftCol}>
              <Text style={styles.title}>Part Time</Text>
              <Text style={styles.sub}>Flexible shifts</Text>
            </View>
            <Image
              source={require("../../../assets/image/PartTimeJob.png")}
              style={styles.cardImage}
            />
          </TouchableOpacity>

          {/* CARD 4 */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabPress("freelancer")}
            style={[
              styles.card,
              { backgroundColor: "#E8F3FF" },
              activeTab === "freelancer" && styles.activeCard,
            ]}
          >
            <View style={styles.leftCol}>
              <Text style={styles.title}>Freelancer</Text>
              <Text style={styles.sub}>Work anywhere</Text>
            </View>
            <Image
              source={require("../../../assets/image/Freelancer.png")}
              style={styles.cardImage}
            />
          </TouchableOpacity>

        </View>
      </View>

      {/* LOADING */}
      {isLoading && (
        <ActivityIndicator
          style={{ marginTop: 30 }}
          size={"large"}
          color={Colors.primary}
        />
      )}

      {/* JOB LIST  first change */}
      {jobs?.slice(0, 20).map((job) => (
         <SingleJobItem job={job} key={`recent-job-${job?.id}`} />
          ))}

          {/* second step  */}
        <View style={{ marginTop: 20, marginBottom: 10, alignItems: "center" }}>
          <TouchableOpacity
          onPress={() => navigation.navigate("JobListing")}
           style={{
      backgroundColor: Colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 30,
      elevation: 3,
    }}
  >
    <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>
      View All Jobs →
    </Text>
  </TouchableOpacity>
</View>


      {/* EMPTY */}
      {jobs?.length === 0 && (
        <View style={styles.emptyBox}>
          <Image
            source={require("../../../assets/image/job.png")}
            style={{ width: 55, height: 55, marginBottom: 10 }}
          />
          <Text style={[style.m15, { color: Colors.txt }]}>
            Sorry, no jobs found
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    height: 120,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },

  activeCard: {
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },

  leftCol: {
    width: "55%",
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },

  sub: {
    fontSize: 12,
    color: "#555",
    marginTop: 3,
  },

  cardImage: {
     width: "38%",        // image card ka 38% part use karegi
     height: undefined,
     aspectRatio: 1,      // square image
     resizeMode: "contain",
  },

  emptyBox: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
});

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
import { getJobsByType } from "../../utils";

export default function NewRandomJobs({ isUserEmployer, scrollRef }) {
  const { data, isLoading, refetch, isUninitialized } =
    jobsApiSlice.useGetJobsQuery();

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState("recent jobs");

  const scrollAnim = useRef(new Animated.Value(0)).current;

  // ⭐ Category-wise counting
  const recentCount = getJobsByType(data, "recent jobs")?.length || 0;
  const fullTimeCount = getJobsByType(data, "full time")?.length || 0;
  const partTimeCount = getJobsByType(data, "part time")?.length || 0;
  const freelancerCount = getJobsByType(data, "freelancer")?.length || 0;

  let jobs = getJobsByType(data, activeTab);

  const handleTabPress = (type) => {
    setActiveTab(type);

    setTimeout(() => {
      scrollRef?.current?.scrollTo({
        y: 550,
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

          {/* CARD 1 — Recent Jobs */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabPress("recent jobs")}
            style={[
              styles.card,
              { backgroundColor: "#b9faddff" },
              activeTab === "recent jobs" && styles.activeCard,
            ]}
          >
            <View style={styles.leftCol}>
              <Text style={styles.title}>Recent Jobs</Text>
              <Text style={styles.count}>{recentCount} jobs</Text>
            </View>

            <Image
              source={require("../../../assets/image/RecentJob.png")}
              style={[styles.cardImage, { width: 80, height: 80 }]}
            />
          </TouchableOpacity>

          {/* CARD 2 — Full Time */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabPress("full time")}
            style={[
              styles.card,
              { backgroundColor: "#f8d69eff" },
              activeTab === "full time" && styles.activeCard,
            ]}
          >
            <View style={styles.leftCol}>
              <Text style={styles.title}>Full Time</Text>
              <Text style={styles.count}>{fullTimeCount} jobs</Text>
            </View>

            <Image
              source={require("../../../assets/image/FulltimeJob.png")}
              style={styles.cardImage}
            />
          </TouchableOpacity>

          {/* CARD 3 — Part Time */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabPress("part time")}
            style={[
              styles.card,
              { backgroundColor: "#8bb7f8ff" },
              activeTab === "part time" && styles.activeCard,
            ]}
          >
            <View style={styles.leftCol}>
              <Text style={styles.title}>Part Time</Text>
              <Text style={styles.count}>{partTimeCount} jobs</Text>
            </View>

            <Image
              source={require("../../../assets/image/PartTimeJob.png")}
              style={styles.cardImage}
            />
          </TouchableOpacity>

          {/* CARD 4 — Freelancer */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabPress("freelancer")}
            style={[
              styles.card,
              { backgroundColor: "#efd3fcff" },
              activeTab === "freelancer" && styles.activeCard,
            ]}
          >
            <View style={styles.leftCol}>
              <Text style={styles.title}>Freelancer</Text>
              <Text style={styles.count}>{freelancerCount} jobs</Text>
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

      {/* JOB LIST */}
      {jobs?.slice(0, 20).map((job) => (
        <SingleJobItem job={job} key={`recent-job-${job?.id}`} />
      ))}

      {/* VIEW ALL */}
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
    height: 80,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    position: "relative",
    overflow: "hidden",
  },

  activeCard: {
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    transform: [{ scale: 1.03 }],
  },

  leftCol: {
    width: "70%",
  },

  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222",
  },

  count: {
    fontSize: 10,
    color: "#000",
    marginTop: 3,
    fontWeight: "700",
  },

  cardImage: {
    width: 85,
    height: 85,
    resizeMode: "contain",
    position: "absolute",
    bottom: -10,
    right: -10,
  },
});

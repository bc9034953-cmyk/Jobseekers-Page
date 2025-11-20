import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Share,
  Linking,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import FooterImg from "../../assets/image/FooterImg.png";
import Footer2 from "../../assets/image/Footer2.png";
import ContactUs from "../screens/ContactUs"; // ✅ yahin import hota hai

const { width } = Dimensions.get("window");

export default function Footer() {

  const navigation = useNavigation();

  // ✅ Share function
  const handleShare = async () => {
    try {
      await Share.share({
        title: "JobSeekers Page",
        message: "Check out JobSeekers Page: https://jobseekerspage.com",
        url: "https://jobseekerspage.com",
      });
    } catch (error) {
      console.log("Share Error:", error);
    }
  };

  // ✅ Open social links
  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Could not open link");
    }
  };

  return (
    <View style={styles.footerContainer}>

      {/* ✅ Main Logo - SHARE */}
      <TouchableOpacity onPress={handleShare} activeOpacity={0.8}>
        <View style={styles.logoWrapper}>
          <Image source={FooterImg} style={styles.logoImage} />
        </View>
      </TouchableOpacity>

      {/* ✅ Secondary Logo - CONTACT US PAGE */}
      <TouchableOpacity
        onPress={() => navigation.navigate("ContactUs")}
        activeOpacity={0.8}
      >
        <View style={styles.logoWrapper}>
          <Image source={Footer2} style={styles.logoImage} />
        </View>
      </TouchableOpacity>

      {/* Divider line */}
      <View style={styles.line} />

      {/* ✅ Social Icons */}
      <View style={styles.socialRow}>

        <TouchableOpacity 
          onPress={() => openLink("https://www.facebook.com/jobseekerspagedotcom")}
          style={styles.iconCircle}
        >
          <Image source={require("../../assets/image/facebook.png")} style={styles.socialIcon} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => openLink("https://www.instagram.com/jobseekerspagedotcom/")}
          style={styles.iconCircle}
        >
          <Image source={require("../../assets/image/instagram.png")} style={styles.socialIcon} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => openLink("https://www.linkedin.com/company/jobseekerspage-com/posts/?feedView=all")}
          style={styles.iconCircle}
        >
          <Image source={require("../../assets/image/linkedin.png")} style={styles.socialIcon} />
        </TouchableOpacity>

      </View>

      <Text style={styles.copyText}>
        © 2024 JobSeekers Page. All Rights Reserved
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#f9fafb",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  logoWrapper: {
    width: width * 0.8,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  logoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  line: {
    width: "85%",
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 10,
  },

  socialRow: {
    flexDirection: "row",
    marginVertical: 10,
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
    elevation: 5,
  },

  socialIcon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },

  copyText: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 8,
  },
});

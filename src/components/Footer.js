import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import React from "react";
import FooterImg from "../../assets/image/FooterImg.png";

const { width } = Dimensions.get("window");

export default function Footer() {
  return (
    <View style={styles.footerContainer}>

      {/* Divider Line */}
      <View style={styles.line} />

      {/* Social Icons Row */}
      <View style={styles.socialRow}>
        <View style={styles.iconCircle}>
          <Image source={require("../../assets/image/facebook.png")} style={styles.socialIcon} />
        </View>

        <View style={styles.iconCircle}>
          <Image source={require("../../assets/image/instagram.png")} style={styles.socialIcon} />
        </View>

        <View style={styles.iconCircle}>
          <Image source={require("../../assets/image/linkedin.png")} style={styles.socialIcon} />
        </View>
      </View>

      {/* Logo */}
      <Image source={FooterImg} style={styles.footerLogo} />

      {/* Copyright */}
      <Text style={styles.copyText}>© 2024 JobSeekers • All Rights Reserved</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: width * 0.04,
    paddingBottom: width * 0.06,
    marginTop: width * 0.04,
  },

  line: {
    width: "90%",
    height: 1,
    backgroundColor: "#e5e7eb",
    marginBottom: width * 0.04,
  },

  socialRow: {
    flexDirection: "row",
    marginBottom: width * 0.05,
  },

  iconCircle: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.12,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.03,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },

  socialIcon: {
    width: "60%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: "contain",
  },

  footerLogo: {
    width: "70%",
    height: undefined,
    aspectRatio: 4,
    resizeMode: "contain",
    marginBottom: width * 0.03,
  },

  copyText: {
    color: "#9ca3af",
    fontSize: width * 0.03,
  },
});

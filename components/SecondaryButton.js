import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "../styles/style.js";

const SecondaryButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.btn, styles.btnSecondary]}
      onPress={onPress}
    >
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default SecondaryButton;

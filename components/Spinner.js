import React from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";

import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
export default Spinner = ({ title, description, isOpen }) => {
    return (
        <>
            <View
                style={!isOpen ? { display: "none" } : styles.indicatorBackdrop}
            >
                <View style={styles.indicatorWrap}>
                    <ActivityIndicator size="large" color="#3DB6D0" />
                    <Text style={styles.indicatorTitle}>{title}</Text>
                    <Text style={styles.indicatorText}>{description}</Text>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    indicatorBackdrop: {
        position: "absolute",
        height: vh(100),
        width: vw(100),
        backgroundColor: "rgba(0,0,0,0.8)",
        zIndex: 9999,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    indicatorWrap: {
        width: "80%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 18,
        backgroundColor: "#fff",
        paddingVertical: 32,
        borderRadius: 5,
    },
    indicatorTitle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        width: "90%",
    },
    indicatorText: {
        fontSize: 18,
        textAlign: "center",
        fontWeight: "normal",
        width: "90%",
    },
});

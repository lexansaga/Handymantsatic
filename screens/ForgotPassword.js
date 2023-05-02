import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, Image, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import ShowToast from "../components/Toast";
import Input from "../components/Input.js";
import styles from "../styles/style.js";

export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState("");

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Image
                source={require("../assets/logo.png")}
                style={pageStyles.image}
            />
            <Text style={pageStyles.pageTitle}>Forgot Password</Text>
            <Input
                style={pageStyles.gap}
                placeholder={"Enter Email"}
                value={email}
                onChangeText={setEmail}
                icon="user"
                keyboardType="email-address"
            />

            <View style={pageStyles.buttonWrapper}>
                <PrimaryButton title={"Reset Password"} />
                <SecondaryButton
                    title={"Back to Signin"}
                    onPress={() => {
                        navigation.navigate("Signin", { key: "value" });
                    }}
                    asdasdasd
                />
            </View>
        </View>
    );
}

const pageStyles = StyleSheet.create({
    pageTitle: {
        width: "100%",
        display: "flex",
        fontSize: 28,
        textTransform: "uppercase",
        justifyContent: "center",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 28,
        marginTop: 28,
        fontWeight: "bold",
        fontFamily: "Roboto",
    },
    buttonWrapper: {
        display: "flex",
        position: "relative",
        marginTop: 28,
        width: "100%",
        gap: 8,
    },
    image: {
        resizeMode: "contain",
        minHeight: 130,
        minWidth: 130,
        maxWidth: 300,
        maxHeight: 300,
    },
});

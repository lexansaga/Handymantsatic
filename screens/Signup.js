import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, Image, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import styles from "../styles/style.js";
import Input from "../components/Input.js";
import SecondaryButton from "../components/SecondaryButton";
import ShowToast from "../components/Toast";

export default function Signup({ navigation }) {
    const [
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    return (
        <View style={styles.container}>
            {/* <StatusBar style="auto" /> */}
            <Image
                source={require("../assets/logo.png")}
                style={pageStyles.image}
            />
            <Text style={pageStyles.pageTitle}>SIGN UP</Text>
            <Input
                placeholder={"Username"}
                value={email}
                onChangeText={setEmail}
                icon="user"
                keyboardType="email-address"
            />
            <Input
                placeholder={"Password"}
                value={password}
                onChangeText={setPassword}
                icon="lock"
                isPassword={true}
            />
            <Input
                placeholder={"Confirm Password"}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                icon="lock"
                isPassword={true}
            />
            <Text
                style={pageStyles.forgotPass}
                onPress={() => {
                    navigation.navigate("ForgotPassword", { key: "value" });
                }}
            >
                Forgot Password?
            </Text>
            <View style={pageStyles.buttonWrapper}>
                <PrimaryButton
                    title={"Sign Up"}
                    onPress={ShowToast("Sign Up")}
                />
                <SecondaryButton
                    title={"Back to Signin"}
                    onPress={() => {
                        navigation.navigate("Signin", { key: "value" });
                    }}
                />
            </View>
        </View>
    );
}

const pageStyles = StyleSheet.create({
    forgotPass: {
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        marginLeft: "auto",
        fontWeight: "bold",
    },
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

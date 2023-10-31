import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, Image, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import ShowToast from "../components/Toast";
import Input from "../components/Input.js";
import styles from "../styles/style.js";
import { IsTextEmpty } from "./Utils";
import {
    app,
    firestore,
    doc,
    getDoc,
    setDoc,
    database,
    databaseRef,
    get,
    set,
    child,
    auth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from "../config/firebase.config";

// import { } from "firebase/firestore";
export default function OneTimePin({ navigation }) {
    const [oneTimePin, setOneTimePin] = useState("");
    const [password, setPassword] = useState("");
    // const auth = getAuth(app);

    // const firestore = getFirestore(app);
    useEffect(() => {}, []);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Image
                source={require("../assets/logo.png")}
                style={pageStyles.image}
            />
            <Text style={pageStyles.pageTitle}>Enter One Time Pin</Text>
            <Input
                style={pageStyles.gap}
                placeholder={"One Time Pin"}
                value={oneTimePin}
                onChangeText={setOneTimePin}
                icon="key"
                keyboardType={"text"}
            />

            <View style={pageStyles.buttonWrapper}>
                <PrimaryButton title={"Submit"} onPress={() => {}} />
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

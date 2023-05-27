import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, Image, View, Picker } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import styles from "../styles/style.js";
import Input from "../components/Input.js";
import SecondaryButton from "../components/SecondaryButton";
import ShowToast from "../components/Toast";
import DropDownPicker from "react-native-dropdown-picker";
import { IsTextEmpty } from "../Utils";
import app from "../config/firebase.config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { getFirestore, doc, setDoc } from "firebase/firestore";
export default function Signup({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: "Client", value: "Client" },
        { label: "Service Provider", value: "ServiceProvider" },
    ]);

    const firestore = getFirestore(app);

    const auth = getAuth(app);

    function SignIn() {
        if (
            IsTextEmpty(value) ||
            IsTextEmpty(email) ||
            IsTextEmpty(password) ||
            IsTextEmpty(confirmPassword)
        ) {
            ShowToast("Fill up all the information!");
            return;
        }
        if (password !== confirmPassword) {
            ShowToast(`Password didn't Match`);
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                ShowToast("Sign Up Success!");
                navigation.navigate("Signin", { key: "value" });
                var uid = user.uid;
                console.log(uid);

                // Add a new document in collection "cities"
                await setDoc(
                    doc(firestore, "User", `${uid}`),
                    {
                        UID: uid,
                        Email: email,
                        Password: password,
                        Type: value,
                    },
                    { merge: true }
                );

                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log();
                console.log(`${errorCode} : ${errorMessage}`);
                // ..
            });
    }
    return (
        <View style={styles.container}>
            {/* <StatusBar style="auto" /> */}
            <Image
                source={require("../assets/logo.png")}
                style={pageStyles.image}
            />
            <Text style={pageStyles.pageTitle}>SIGN UP</Text>
            <View style={pageStyles.InputWrapper}>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    showArrowIcon={true}
                    listMode="MODAL"
                    placeholder="Select Type"
                    modalProps={{
                        animationType: "slide",
                        width: "50%",
                    }}
                    modalTitle="Select Type"
                    style={{
                        borderColor: "transparent",
                        borderRadius: 0,
                        backgroundColor: "#ededed",
                        marginLeft: 10,
                    }}
                />
                <Input
                    placeholder={"Email"}
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
            </View>
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
                    onPress={() => {
                        SignIn();
                    }}
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
    InputWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "center",
    },
});

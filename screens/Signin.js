import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, Image, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import ShowToast from "../components/Toast";
import Input from "../components/Input.js";
import styles from "../styles/style.js";
import { IsTextEmpty } from "../Utils";
import app from "../config/firebase.config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
export default function Signin({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    function Login() {
        if (IsTextEmpty(email) || IsTextEmpty(password)) {
            ShowToast("Fill up all the information!");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                ShowToast("Login Success!");

                setEmail("");
                setPassword("");
                var uid = user.uid;
                console.log(uid);

                const docRef = doc(firestore, "User", `${uid}`);
                const querySnapshot = await getDoc(docRef);
                var userType = String(querySnapshot.get("Type"));
                if (userType.includes("Client")) {
                    navigation.navigate("Client", { key: "value" });
                } else {
                    navigation.navigate("ServiceProvider", {
                        key: "value",
                    });
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                ShowToast("Login Failed!");
                console.log(`${errorCode} : ${errorMessage}`);
            });
    }
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Image
                source={require("../assets/logo.png")}
                style={pageStyles.image}
            />
            <Text style={pageStyles.pageTitle}>Sign in</Text>
            <Input
                style={pageStyles.gap}
                placeholder={"Username"}
                value={email}
                onChangeText={setEmail}
                icon="user"
                keyboardType="email-address"
            />
            <Input
                style={pageStyles.gap}
                placeholder={"Password"}
                value={password}
                onChangeText={setPassword}
                icon="lock"
                isPassword={true}
            />
            <Text
                style={[pageStyles.forgotPass, pageStyles.gap]}
                onPress={() => {
                    navigation.navigate("ForgotPassword", { key: "value" });
                }}
            >
                Forgot Password?
            </Text>

            <View style={pageStyles.buttonWrapper}>
                <PrimaryButton
                    title={"Sign In"}
                    onPress={() => {
                        Login();
                    }}
                />
                <SecondaryButton
                    title={"Create Account"}
                    onPress={() => {
                        navigation.navigate("Signup", { key: "value" });
                    }}
                />
            </View>
        </View>
    );
}
const SigninWithPassword = ({ navigation, email, password }) => {
    if (email == "service" || password == "service") {
        console.log("Service");
        ShowToast("Service");
        () => {
            navigation.navigate("ServiceProviderHome", {
                id: "1001",
                type: "service",
            });
        };
    } else {
        console.log("Client");
        ShowToast("Client");
        navigation.navigate("ClientHome", {
            id: "1001",
            type: "client",
        });
    }
};

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

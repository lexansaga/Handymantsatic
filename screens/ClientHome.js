import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    Image,
    View,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import ShowToast from "../components/Toast";
import Input from "../components/Input.js";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import Header from "../components/Header";

export default function ClientHome({ navigation }) {
    const [email, setEmail, password, setPassword] = useState("");

    return (
        <View>
            <StatusBar style="auto" />
            <Header />

            <ScrollView>
                <View style={styles.LandingContainer}>
                    <Text style={styles.SubHeader}>
                        Hi! <Text style={styles.Name}>Alex</Text>
                    </Text>
                    <Text style={styles.Header}>What service do you need?</Text>
                    <Image
                        source={require("../assets/worker.png")}
                        style={styles.LandingImage}
                    />
                </View>
            </ScrollView>

            <View style={styles.Section}>
                <Text
                    style={{
                        fontWeight: 800,
                        fontFamily: "Roboto",
                        fontSize: 20,
                        textTransform: "uppercase",
                    }}
                >
                    Category
                </Text>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 18,
                        gap: 8,
                    }}
                >
                    <Category
                        image={require("../assets/plumbing.png")}
                        name="Plumbing"
                    />
                    <Category
                        image={require("../assets/plumbing.png")}
                        name="Plumbing"
                    />
                    <Category
                        image={require("../assets/plumbing.png")}
                        name="Plumbing"
                    />
                    <Category
                        image={require("../assets/plumbing.png")}
                        name="Plumbing"
                    />
                    <Category
                        image={require("../assets/plumbing.png")}
                        name="Plumbing"
                    />
                    <Category
                        image={require("../assets/plumbing.png")}
                        name="Plumbing"
                    />
                    <Category
                        image={require("../assets/plumbing.png")}
                        name="Plumbing"
                    />
                </ScrollView>
            </View>
        </View>
    );
}
const Category = ({ image, name, onpress }) => {
    return (
        <TouchableOpacity onpress={onpress}>
            <View
                style={{
                    height: vw(27),
                    width: vw(27),
                    maxHeight: 120,
                    maxWidth: 120,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: 8,
                    backgroundColor: "#fff",
                    shadowColor: "#171717",
                    shadowOffset: { width: -2, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    marginRight: 8,
                }}
            >
                <Image
                    source={image}
                    style={{
                        resizeMode: "contain",
                        width: "90%",
                        height: "50%",
                    }}
                />
                <Text
                    style={{
                        textTransform: "uppercase",
                        fontSize: 18,
                        fontWeight: 600,
                        fontFamily: "Roboto",
                        textAlign: "center",
                    }}
                >
                    {name}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    LandingContainer: {
        height: vh(30),
        minHeight: 200,
        backgroundColor: "rgba(126, 181, 141,0.1)",
        display: "flex",
        paddingHorizontal: 28,
        justifyContent: "center",
        overflow: "visible",
    },
    Header: {
        fontSize: 30,
        fontWeight: 700,
        maxWidth: "60%",
        fontFamily: "Roboto",
    },
    SubHeader: {
        fontWeight: 500,
        fontSize: 22,
        fontFamily: "Roboto",
    },
    Name: {
        color: "#3DB6D0",
    },
    LandingImage: {
        position: "absolute",
        right: 20,
        height: "100%",
        resizeMode: "contain",
        zIndex: 10,
    },
    Section: {
        display: "flex",
        flexDirection: "column",
        paddingTop: 28,
        paddingHorizontal: 28,
    },
});

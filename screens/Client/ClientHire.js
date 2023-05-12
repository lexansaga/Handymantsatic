import React, { useState } from "react";
import { View, ScrollView, Text, Image, StyleSheet } from "react-native";
import Header from "../../components/Header";
import ClientHome, { ClientServiceFeed } from "./ClientHome";
import style from "../../styles/style";

import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
export default function ClientHire({ navigation, route }) {
    return (
        <View style={{ paddingBottom: 120 }}>
            <Header />
            <Image
                source={require("../../assets/profile.jpg")}
                style={styles.CoverImage}
            />
            <View style={styles.MainWrap}>
                <ScrollView>
                    <ClientServiceFeed
                        style={style.Info}
                        service={"Plumbing"}
                        name="John Doe"
                        price="P1000"
                    />
                    <View style={style.Section}>
                        <Text style={style.SectionTitle}>Who's John</Text>
                        <Text style={styles.Verbiage}>
                            With over a decade of experience in diagnosing and
                            fixing plumbing issues, I am confident in my ability
                            to provide comprehensive plumbing services that meet
                            the needs of any residential or commercial client.
                        </Text>
                    </View>
                    <View style={style.Section}>
                        <Text style={style.SectionTitle}>Work Profile</Text>
                        <View style={styles.WorkImageWrap}>
                            <Image
                                style={styles.WorkImage}
                                source={require("../../assets/blank.jpg")}
                            />
                            <Image
                                style={styles.WorkImage}
                                source={require("../../assets/blank.jpg")}
                            />
                            <Image
                                style={styles.WorkImage}
                                source={require("../../assets/blank.jpg")}
                            />
                            <Image
                                style={styles.WorkImage}
                                source={require("../../assets/blank.jpg")}
                            />
                            <Image
                                style={styles.WorkImage}
                                source={require("../../assets/blank.jpg")}
                            />
                            <Image
                                style={styles.WorkImage}
                                source={require("../../assets/blank.jpg")}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    CoverImage: {
        width: "100%",
        resizeMode: "cover",
        height: vh(25),
    },
    MainWrap: {
        borderTopLeftRadius: 30,
        borderTopEndRadius: 30,
        overflow: "hidden",
        marginTop: "-10%",
        zIndex: 2,
        backgroundColor: "#ffffff",
    },
    Verbiage: {
        fontSize: 16,
        lineHeight: 22,
    },
    WorkImageWrap: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 8,
    },
    WorkImage: {
        width: vw(25),
        height: vw(25),
        resizeMode: "contain",
    },
});

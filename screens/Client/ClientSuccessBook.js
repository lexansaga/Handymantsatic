import React, { useState } from "react";
import {
    Linking,
    View,
    ScrollView,
    Text,
    Image,
    StyleSheet,
} from "react-native";
import Header from "../../components/Header";
import ClientHome, { ClientServiceFeed } from "./ClientHome";
import Input from "../../components/Input";
import style from "../../styles/style";

import DatePicker from "react-native-date-picker";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import PrimaryButton from "../../components/PrimaryButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

export default function ClientSuccessBook({ navigation, route }) {
    const [name, contact, date, time, location] = useState("");
    const [dpOpen, dpSetOpen] = useState(false);
    const [dpDate, dpSetDate] = useState(new Date());

    return (
        <View
            style={{
                paddingBottom: 120,
                backgroundColor: "#fff",
            }}
        >
            <Header />

            <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                    source={require("../../assets/ClientServiceFeedProfile.png")}
                    style={styles.CoverImage}
                />
                <View style={styles.MainWrap}>
                    <ClientServiceFeed
                        style={style.Info}
                        service={"Plumbing"}
                        name="John Doe"
                        price="P1000"
                    />

                    <View style={[style.Section, styles.SBWrap]}>
                        <Image
                            source={require("../../assets/success_book.png")}
                        />
                        <Text style={styles.Title}>Booking Success</Text>
                        <View style={styles.TransactionWrap}>
                            <Text style={styles.TransactIDTitle}>
                                Transaction ID
                            </Text>
                            <Text style={styles.TransactID}>#ABC123</Text>
                        </View>

                        <View style={styles.KeepInTouch}>
                            <Text
                                style={[
                                    style.SectionTitle,
                                    { textAlign: "center", fontWeight: 400 },
                                ]}
                            >
                                Keep In Touch
                            </Text>
                            <View style={styles.KeepInTouchIconWrap}>
                                <TouchableOpacity>
                                    <Feather
                                        name={"phone-call"}
                                        size={30}
                                        color="#000"
                                        style={styles.KeepInTouchIcon}
                                        onPress={() => {
                                            this.dialCall(12345678901);
                                        }}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Feather
                                        name={"message-circle"}
                                        size={30}
                                        color="#000"
                                        style={styles.KeepInTouchIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <DatePicker
                        modal
                        open={dpOpen}
                        date={dpDate}
                        onConfirm={(dpDate) => {
                            dpSetOpen(false);
                            dpSetDate(dpDate);
                        }}
                        onCancel={() => {
                            dpSetOpen(false);
                        }}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const dialCall = (number) => {
    let phoneNumber = "";
    if (Platform.OS === "android") {
        phoneNumber = `tel:${number}`;
    } else {
        phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
};

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
    InputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginTop: 12,
    },
    SBWrap: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
    },
    Title: {
        fontSize: 24,
        textTransform: "uppercase",
        fontWeight: 600,
        marginTop: 6,
    },
    TransactionWrap: {
        backgroundColor: "#3DB6D0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: vw(100),
        paddingVertical: 16,
    },
    TransactIDTitle: {
        color: "#fff",
        textTransform: "uppercase",
    },
    TransactID: {
        color: "#fff",
        textTransform: "uppercase",
        fontSize: 28,
        fontWeight: 600,
    },

    KeepInTouch: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
    },
    KeepInTouchIconWrap: {
        display: "flex",
        flexDirection: "row",
        gap: 18,
    },
});

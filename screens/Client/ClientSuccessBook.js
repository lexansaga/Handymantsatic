import React, { useCallback, useEffect, useState } from "react";
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
import {
    auth,
    onAuthStateChanged,
    app,
    database,
    databaseRef,
    ref,
    child,
    get,
    push,
    update,
    UserInfo,
} from "../../config/firebase.config";
import { useIsFocused } from "@react-navigation/native";
import { DefaultProfile, PriceFormat, IDFormat } from "../Utils";
export default function ClientSuccessBook({ navigation, route }) {
    const [name, contact, date, time, location] = useState("");
    const [dpOpen, dpSetOpen] = useState(false);
    const [dpDate, dpSetDate] = useState(new Date());

    const [userInfo, setUserInfo] = useState({});
    const { Email, Name, Password, Profile, Type, UID } = userInfo;

    const { OrderID } = route.params;
    const [JobOrder, setJobOrder] = useState({});
    var JobOrderIDFormatted = IDFormat(OrderID);
    const getJobOrder = async () => {
        await get(child(databaseRef, `JobOrder/${OrderID}`))
            .then(async (snapshot) => {
                if (snapshot.exists()) {
                    const snap = snapshot.val();
                    const jobID = snap.JobID;
                    const userID = snap.UserID;
                    const Status = snap.Status;
                    await get(child(databaseRef, `Jobs/${jobID}`)).then(
                        async (job) => {
                            const snapJob = job.val();
                            const clientID = snapJob.ClientID;
                            const serviceProviderID = snapJob.ServiceProviderID;
                            await get(
                                child(databaseRef, `Users/${clientID}/`)
                            ).then(async (client) => {
                                const snapClient = client.val();
                                await get(
                                    child(
                                        databaseRef,
                                        `Users/${serviceProviderID}/`
                                    )
                                ).then(async (serviceProvider) => {
                                    const snapServiceProvider =
                                        serviceProvider.val();
                                    setJobOrder({
                                        Status,
                                        ServiceProvider: snapServiceProvider,
                                        Client: snapClient,
                                        Job: snapJob,
                                    });
                                });
                            });
                        }
                    );
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused == true) {
            getJobOrder();
            UserInfo().then((user) => {
                setUserInfo(user);
            });
            console.log(JobOrder);
        }
    }, [isFocused]);

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
                    source={{
                        uri: JobOrder.ServiceProvider.Profile
                            ? JobOrder.ServiceProvider.Profile
                            : DefaultProfile,
                    }}
                    style={styles.CoverImage}
                />
                <View style={styles.MainWrap}>
                    <ClientServiceFeed
                        style={style.Info}
                        service={JobOrder.ServiceProvider.ServiceOffered}
                        name={JobOrder.ServiceProvider.Name}
                        price={PriceFormat(JobOrder.Job.Price)}
                    />

                    <View style={[style.Section, styles.SBWrap]}>
                        <Image
                            source={require("../../assets/success_book.png")}
                        />
                        <Text style={styles.Title}>Booking Success</Text>
                        <Text style={styles.Content}>
                            {JobOrder.Job.Description}
                        </Text>
                        <View style={styles.TransactionWrap}>
                            <Text style={styles.TransactIDTitle}>
                                Transaction ID
                            </Text>
                            <Text style={styles.TransactID}>
                                {JobOrderIDFormatted}
                            </Text>
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
                                <TouchableOpacity
                                    onPress={() => {
                                        dialCall(
                                            JobOrder.ServiceProvider.Contact
                                        );
                                    }}
                                >
                                    <Feather
                                        name={"phone-call"}
                                        size={30}
                                        color="#000"
                                        style={styles.KeepInTouchIcon}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        SendMessage(
                                            JobOrder.ServiceProvider.Contact,
                                            ""
                                        );
                                        console.log("message");
                                    }}
                                >
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
const SendMessage = (phoneNumber, message) => {
    let url = `sms:${phoneNumber}${
        Platform.OS === "ios" ? "&" : "?"
    }body=${message}`;

    Linking.openURL(url);
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
    Content: {
        textAlign: "center",
        maxHeight: vw(90),
        fontSize: 16,
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

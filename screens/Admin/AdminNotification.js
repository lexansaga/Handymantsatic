import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    Image,
    View,
    Picker,
    StatusBar,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import PrimaryButton from "../../components/PrimaryButton.js";
import styles from "../../styles/style.js";
import Input from "../../components/Input.js";
import SecondaryButton from "../../components/SecondaryButton";
import DropDownPicker from "react-native-dropdown-picker";

import { confirmPasswordReset } from "firebase/auth";
import Header from "../../components/Header.js";
import {
    GetDataAxios,
    IsNullOrEmpty,
    IsNullOrEmptyFallback,
    PushNotification,
} from "../Utils.js";
import {
    child,
    database,
    databaseRef,
    firebaseBaseUrl,
    firestore,
    push,
    ref,
    set,
    update,
} from "../../config/firebase.config.js";
import { useIsFocused } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import StarRating from "../../components/StarRating.js";
import ShowToast from "../../components/Toast.js";

export default function AdminNotification({ navigation }) {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: "Global", value: "Global" },
        { label: "Client", value: "Client" },
        { label: "Service Provider", value: "ServiceProvider" },
    ]);

    const [refreshing, setRefreshing] = React.useState(false);

    const [notifications, setNotification] = useState({});
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            onRefresh();
        }
    }, [isFocused]);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        GetDataAxios(`${firebaseBaseUrl}/Notification.json`)
            .then((data) => {
                setNotification(data);
            })
            .catch((error) => {
                console.log(`Error ${error}`);
            });

        // console.log(notifications);
        console.log("Refresh");
        setTitle("");
        setMessage("");
        setValue("");
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <View style={{ marginTop: -20, paddingBottom: 120 }}>
            <StatusBar style="auto" />
            <View style={pageStyles.AdminHeader}>
                <Header isAdmin={true} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={styles.container}>
                    <Text style={pageStyles.pageTitle}>
                        CREATE NOTIFICATION
                    </Text>
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
                            placeholder={"Title"}
                            value={title}
                            onChangeText={setTitle}
                            icon="edit-2"
                            keyboardType="text"
                        />
                        <Input
                            placeholder={"Messsage"}
                            value={message}
                            onChangeText={setMessage}
                            icon="mail"
                            keyboardType="text"
                        />
                    </View>
                    <View style={pageStyles.buttonWrapper}>
                        <PrimaryButton
                            title={"Add Notification!"}
                            onPress={() => {
                                PushNotification(title, message, value);
                                ShowToast("Notification has been added!");
                                onRefresh();
                            }}
                        />
                    </View>
                </View>
                <View style={styles.Section}>
                    <View style={pageStyles.NotificationWrap}>
                        {Object.values(notifications).map((notification) => {
                            //     console.log(notification.ID);
                            return (
                                <View style={pageStyles.NotificationItem}>
                                    <View
                                        style={pageStyles.NotificationIconWrap}
                                    >
                                        <Feather
                                            name="bell"
                                            size={30}
                                            color={true ? "#fff" : "#000"}
                                            style={pageStyles.NotificationIcon}
                                        />
                                    </View>
                                    <View
                                        style={pageStyles.NotificationContent}
                                    >
                                        <Text
                                            style={pageStyles.NotificationTitle}
                                        >
                                            {notification.Title}
                                        </Text>
                                        <Text
                                            style={
                                                pageStyles.NotificationDescription
                                            }
                                        >
                                            {notification.Message}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        style={pageStyles.DeleteButton}
                                        onPress={() => {
                                            Alert.alert(
                                                "Delete Notification",
                                                "Are you sure you want to delete this notification?",
                                                [
                                                    {
                                                        text: "No",
                                                        onPress: () => {},
                                                        style: "cancel",
                                                    },
                                                    {
                                                        text: "Yes",
                                                        onPress: () => {
                                                            console.log(
                                                                "Press yes"
                                                            );
                                                            set(
                                                                child(
                                                                    databaseRef,
                                                                    `Notification/${notification.ID}`
                                                                ),
                                                                {}
                                                            );
                                                            onRefresh();
                                                        },
                                                    },
                                                ],
                                                {
                                                    cancelable: false,
                                                }
                                            );
                                        }}
                                    >
                                        <Feather
                                            name={"trash"}
                                            size={20}
                                            color={"#333 "}
                                        />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
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
    InputWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "center",
    },
    NotificationWrap: {
        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "center",
        gap: 8,
        marginTop: 18,
    },
    NotificationItem: {
        paddingVertical: 28,
        paddingHorizontal: 18,
        borderRadius: 8,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        gap: 18,
        backgroundColor: "#7EB58D33",
        width: "95%",
        marginHorizontal: "auto",
        float: "none",
    },
    NotificationIconWrap: {
        height: 60,
        width: 60,
        backgroundColor: "#7EB58D",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    },
    NotificationContent: {
        display: "flex",
        flexDirection: "column",
        width: 0,
        flexGrow: 1,
        flex: 1,
        gap: 8,
    },
    NotificationTitle: {
        fontSize: 18,
        fontWeight: 600,
        letterSpacing: 0.8,
        textTransform: "uppercase",
    },
    NotificationDescription: {
        fontSize: 17,
        lineHeight: 22,
        width: "100%",
        display: "flex",
        flexShrink: 1,
    },
    DeleteButton: {
        position: "absolute",
        right: 15,
        top: 15,
        alignItems: "flex-end",
        zIndex: 999999,
    },
});

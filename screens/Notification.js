import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { StyleSheet, View, Text, RefreshControl } from "react-native";
import { IDFormat, PriceFormat, DefaultProfile, IsNullOrEmpty } from "../Utils";
import { Feather } from "@expo/vector-icons";
import Header from "./../components/Header";
import {
    database,
    databaseRef,
    ref,
    child,
    get,
    UserInfo,
    push,
    update,
} from "./../config/firebase.config";

import { ClientFeed } from "./ServiceProvider/ServiceProviderHome";
import { ScrollView } from "react-native-gesture-handler";
import PrimaryButton from "./../components/PrimaryButton";
import SecondaryButton from "./../components/SecondaryButton";
import { useIsFocused } from "@react-navigation/native";

export default Notification = ({ navigation, route }) => {
    const [userInfo, setUserInfo] = useState({});
    const { Email, Name, Password, Profile, Type, UID } = userInfo;
    const [notifications, setNotification] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const getNotification = async () => {
        await get(child(databaseRef, `Notification/General/`)).then(
            (notification) => {
                let snapNotif = notification.val();
                let Notification = [];
                Object.values(snapNotif).map(async (notification) => {
                    Notification.push({
                        ID: notification.ID,
                        Title: notification.Title,
                        Message: notification.Message,
                        forWho: notification.forWho,
                    });
                });
                setNotification(Notification);
            }
        );
    };
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            onRefresh();
            console.log("Focused");
        }
    }, [isFocused]);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        console.log("Refresh");
        UserInfo().then((user) => {
            setUserInfo(user);
        });
        console.log(Type);
        getNotification();
        console.log(notifications);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    return (
        <View style={style.MainWrapper}>
            <Header profile={Profile} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={style.NotificationWrap}>
                    {Object.values(notifications).map((notification) => {
                        console.log(`${Type} : ${notification.forWho}`);
                        if (!Type.includes(notification.forWho)) {
                            return;
                        }
                        return (
                            <View style={style.NotificationItem}>
                                <View style={style.NotificationIconWrap}>
                                    <Feather
                                        name="bell"
                                        size={30}
                                        color={true ? "#fff" : "#000"}
                                        style={style.NotificationIcon}
                                    />
                                </View>
                                <View style={style.NotificationContent}>
                                    <Text style={style.NotificationTitle}>
                                        {notification.Title}
                                    </Text>
                                    <Text style={style.NotificationDescription}>
                                        {notification.Message}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

const style = StyleSheet.create({
    MainWrapper: {
        paddingBottom: 120,
    },
    NotificationWrap: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: 18,
    },
    NotificationItem: {
        paddingVertical: 28,
        paddingHorizontal: 28,
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
});

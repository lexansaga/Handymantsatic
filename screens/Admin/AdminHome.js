import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import styles from "../../styles/style";
import {
    StyleSheet,
    Text,
    Image,
    View,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import {
    database,
    databaseRef,
    ref,
    child,
    get,
    UserInfo,
    push,
    update,
    storage,
    firebaseBaseUrl,
} from "../../config/firebase.config";
import { useNavigation } from "@react-navigation/native";
import { DefaultProfile, IsNullOrEmpty } from "../Utils";
import axios from "axios";

export default function AdminHome({ navigation, route }) {
    const [refreshing, setRefreshing] = React.useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [users, setUsers] = useState({});
    const {
        Email,
        Name,
        Contact,
        Rate,
        Password,
        Profile,
        Type,
        UID,
        JobDescription,
        ServiceOffered,
        Address,
    } = userInfo;

    const getUsers = async () => {
        const url = `${firebaseBaseUrl}/Users.json`;
        const response = await axios.get(url);
        console.log(url);
        return response.data;
    };

    useEffect(() => {
        onRefresh();
    }, []);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // UserInfo().then((user) => {
        //     setUserInfo(user);
        // });
        getUsers().then((data) => {
            setUsers(data);
        });
        console.log(users);
        console.log("Refresh");
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <View style={{ marginTop: -20 }}>
            <StatusBar style="auto" />
            <Header profile={Profile} isAdmin={true} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={styles.Section}>
                    <Text style={styles.SectionTitle}>Users</Text>
                    <View style={style.UserWrapper}>
                        {Object.values(users).map((user) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate("AdminUsers", {
                                            ID: user.UID,
                                            Type: user.Type,
                                        });
                                    }}
                                >
                                    <View style={style.UserItem}>
                                        <View style={style.UserContent}>
                                            <Image
                                                source={{
                                                    uri: IsNullOrEmpty(
                                                        user.Profile
                                                    )
                                                        ? DefaultProfile
                                                        : user.Profile,
                                                }}
                                                style={style.UserImage}
                                            />
                                            <View style={style.UserInfo}>
                                                <Text style={style.UserName}>
                                                    {user.Name}
                                                </Text>
                                                <Text style={style.UserType}>
                                                    {user.Type}{" "}
                                                    {!IsNullOrEmpty(
                                                        user.ServiceOffered
                                                    )
                                                        ? ` | ${user.ServiceOffered}`
                                                        : ""}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const style = StyleSheet.create({
    UserWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    UserItem: {
        backgroundColor: "#7EB58D33",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 8,
    },
    UserContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
    },
    UserImage: {
        height: 60,
        width: 60,
        borderRadius: 8,
    },
    UserName: {
        fontWeight: 600,
        fontSize: 20,
        marginBottom: 4,
    },
    UserType: {
        fontWeight: 400,
        fontSize: 16,
        fontStyle: "italic",
    },
});

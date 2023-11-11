import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import Input from "./Input";
import { useNavigation } from "@react-navigation/native";
import { UserInfo } from "../config/firebase.config";
import { useEffect } from "react";
import { DefaultProfile, IsNullOrEmpty } from "../screens/Utils";
import { Keyboard } from "react-native";
export default function Header({
    navigation,
    nav,
    route,
    onPress,
    userProfile,
    isAdmin,
}) {
    // console.log(route);
    const sideNavigation = useNavigation();
    const [search, setSearch] = useState("");
    const [hasNotif, setHasNotif] = useState(false);
    const [hasMessage, setHasMessage] = useState(false);
    const [profile, setProfile] = useState("");
    const [uid, setUID] = useState("");

    const [userInfo, setUserInfo] = useState({});
    const { Email, Name, Password, Profile, Type, UID } = userInfo;

    useEffect(() => {
        // getUser();

        setProfile(DefaultProfile);
        UserInfo().then((user) => {
            setUserInfo(user);
            setProfile(user.Profile ? user.Profile : DefaultProfile);
            setUID(user.UID);
        });
    }, []);
    // console.log(profileImage);
    return (
        <View style={styles.HeaderContainer}>
            <TouchableOpacity
                onPress={
                    onPress != null
                        ? onPress
                        : () => sideNavigation.openDrawer()
                }
            >
                <Feather
                    name="menu"
                    size={25}
                    color="#000"
                    style={styles.Navbutton}
                />
            </TouchableOpacity>

            {!IsNullOrEmpty(isAdmin) || isAdmin == true ? (
                <>
                    <Text
                        style={{
                            fontSize: 18,
                            textAlign: "left",
                            alignSelf: "flex-start",
                            justifyContent: "flex-start",
                        }}
                    >
                        ADMINISTRATOR
                    </Text>
                </>
            ) : (
                <>
                    <Input
                        style={{
                            borderRadius: 18,
                            padding: 0,
                            backgroundColor: "red",
                        }}
                        placeholder="Search"
                        value={search}
                        onChangeText={setSearch}
                        isSearch={true}
                        onSubmitEditing={() => {
                            sideNavigation.navigate("Feed", {
                                SearchKey: search,
                            });
                            Keyboard.dismiss();
                        }}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 8,
                            alignItems: "center",
                        }}
                    >
                        <TouchableOpacity>
                            <Feather
                                name="send"
                                size={23}
                                color={hasMessage ? "#7EB58D" : "#000"}
                                style={styles.Navbutton}
                                onPress={() => {
                                    sideNavigation.navigate("ChatList", {
                                        key: "value",
                                    });
                                }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                sideNavigation.navigate("Notification", {
                                    key: "value",
                                });
                            }}
                        >
                            <Feather
                                name="bell"
                                size={25}
                                color={hasNotif ? "#7EB58D" : "#000"}
                                style={styles.Navbutton}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                sideNavigation.navigate("ClientHire");
                            }}
                        >
                            <Image
                                source={{
                                    uri: IsNullOrEmpty(userProfile)
                                        ? profile
                                        : userProfile,
                                }}
                                style={styles.Avatar}
                            />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    HeaderContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 48,
        paddingHorizontal: 18,
        gap: 8,
    },
    Avatar: {
        height: 35,
        width: 35,
        borderRadius: 50,
    },
});

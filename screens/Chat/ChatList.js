import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Dimensions,
    ScrollView,
    RefreshControl,
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
    Timestamp,
} from "../../config/firebase.config";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import Header from "../../components/Header";
import { useIsFocused } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import { AppTitle } from "../../components/General";
export default function ChatList({ navigation, route }) {
    const [userInfo, setUserInfo] = useState({});
    const [refreshing, setRefreshing] = React.useState(false);
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
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            onRefresh();
            console.log("Focused");
        }
    }, [isFocused]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        UserInfo().then((user) => {
            setUserInfo(user);
        });
        console.log("Refresh");
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    return (
        <View style={style.MainWrapper}>
            <Header profile={Profile} />

            <AppTitle hasContact={false} title={"Messages"} />
            {/* <Text style={style.Title}>Messages</Text> */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={style.LandingContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Chat", { MessageID: "ID" });
                        }}
                    >
                        <View style={style.Chat}>
                            <View style={style.chatHeader}>
                                <Avatar
                                    rounded
                                    title="Profile"
                                    source={{
                                        uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png",
                                    }}
                                    containerStyle={{
                                        height: 50,
                                        width: 50,
                                    }}
                                />
                                <Text style={[style.ClientName, style.Unread]}>
                                    John Doe
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const style = StyleSheet.create({
    mainWrapper: {
        width: vw(90),
        height: Dimensions.get("window").height - 80,
        marginLeft: "auto",
        marginRight: "auto",
    },
    Title: {
        fontSize: 20,
        paddingHorizontal: 18,
        paddingVertical: 12,
        fontWeight: 500,
    },
    Chat: {
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.1)",
    },
    chatHeader: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        paddingTop: 10,
        paddingBottom: 20,
        borderRadius: 50,
        overflow: "hidden",
    },
    ClientName: {
        fontSize: 20,
    },
    Unread: {
        fontWeight: 600,
    },
});

import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    Text,
    Image,
    StyleSheet,
    RefreshControl,
} from "react-native";
import Header from "../components/Header";
import ClientHome, { ClientServiceFeed } from "./Client/ClientHome";
import Input from "../components/Input";
import style from "../styles/style";
import {
    auth,
    onAuthStateChanged,
    app,
    database,
    databaseRef,
    orderBy,
    ref,
    child,
    get,
    UserInfo,
    push,
    update,
} from "../config/firebase.config";
import DatePicker from "react-native-date-picker";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import PrimaryButton from "../components/PrimaryButton";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
    DefaultProfile,
    IsNullOrEmpty,
    IsTextEmpty,
    NumberFormat,
    PriceFormat,
} from "./Utils";

import { Feather } from "@expo/vector-icons";
import StarRating from "../components/StarRating";
export default function Review() {
    const [review, setReview] = useState("");
    const [starRate, setStarRate] = useState(0);
    const [userInfo, setUserInfo] = useState({});
    const { Email, Name, Contact, Password, Profile, Type, UID } = userInfo;
    const [refreshing, setRefreshing] = React.useState(false);
    useEffect(() => {
        onRefresh();
    }, []);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        UserInfo().then((user) => {
            setUserInfo(user);
        });
        setStarRate(0);
        console.log("Refresh");
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const handleRatingPress = (newRating) => {
        setStarRate(newRating);
        console.log(`Selected rating: ${starRate}`);
    };
    return (
        <View style={styles.MainWrap}>
            <Header />
            <ScrollView
                showsVerticalScrollIndicator={false}
                automaticallyAdjustContentInsets={true}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Image
                    source={{
                        uri: Profile,
                    }}
                    style={styles.CoverImage}
                />
                <View style={style.Section}>
                    <Text style={style.SectionTitle}>
                        We Value Your Opinion!
                    </Text>
                    <Text style={styles.SectionSubTitle}>
                        Please use the form below to submit a review of our
                        practice. ​​​​​​​ We value your feedback and would
                        appreciate hearing about your experience along with{" "}
                        <Text style={{ fontWeight: 700, fontStyle: "italic" }}>
                            {Name}
                        </Text>
                    </Text>
                    <View style={styles.InputGroup}>
                        <Text style={styles.InputLabel}>
                            How would you like to rate{" "}
                            <Text
                                style={{ fontWeight: 700, fontStyle: "italic" }}
                            >
                                {Name}
                            </Text>{" "}
                            service?
                        </Text>
                        <View style={styles.StarRate}>
                            <StarRating
                                rate={3}
                                maxRating={5}
                                onRatingPress={handleRatingPress}
                            />
                        </View>
                        <View style={{ marginLeft: -12 }}>
                            <Input
                                multiline={true}
                                style={styles.Input}
                                placeholder={"Enter Message"}
                                value={review}
                                onChangeText={setReview}
                                icon="edit-2"
                                isPassword={false}
                                onPress={() => dpSetOpen(true)}
                            />
                        </View>

                        <Text></Text>
                        <PrimaryButton title={"Submit"} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    CoverImage: {
        width: "100%",
        resizeMode: "cover",
        height: vh(25),
        marginTop: 20,
    },
    SectionSubTitle: {
        fontSize: 18,
        lineHeight: 25,
        color: "#333",
    },
    InputLabel: {
        fontSize: 20,
        lineHeight: 25,
        color: "#333",
    },

    InputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginTop: 28,
    },
    Input: {
        marginLeft: -12,
    },
    StarRate: {
        display: "flex",
        flexDirection: "row",
        gap: 4,
        marginBottom: 12,
    },
});

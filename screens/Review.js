import React, { useState, useEffect, useLayoutEffect, useCallback } from "react";
import {
    View,
    ScrollView,
    Text,
    Image,
    StyleSheet,
    RefreshControl,
} from "react-native";
import axios from "axios";
import Header from "../components/Header";
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
    set,
    firebaseBaseUrl
} from "../config/firebase.config";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import PrimaryButton from "../components/PrimaryButton";

import StarRating from "../components/StarRating";
export default function Review({ navigation, route }) {

    const [review, setReview] = useState("");
    const [starRate, setStarRate] = useState(0);
    const [userInfo, setUserInfo] = useState({});
    const { Email, Name, Contact, Password, Profile, Type, UID } = userInfo;
    const [refreshing, setRefreshing] = React.useState(false);
    const [secondLoad, setSecondLoad] = useState(false);
    const ServiceProviderID = route.params.ID;
    console.log(`SID ${ServiceProviderID} : ${UID}`);

    const [serviceProviderInfo, setServiceProviderInfo] = useState({});
    const getToReviewInfo = async () => {
        const url = `${firebaseBaseUrl}/Users/${ServiceProviderID}.json`;
        const response = await axios.get(url);
        setServiceProviderInfo(response.data)
        console.log(url)
        console.log(serviceProviderInfo)
      
    };
    useEffect(()=>
    {
        UserInfo().then((user) => {
            setUserInfo(user);
        });
        console.log(userInfo)
    },[])
    useEffect(() => {
        getToReviewInfo();
        // onRefresh();
    }, []);
    const onRefresh = useCallback( () => {
        setRefreshing(true);
 
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
                                rate={starRate}
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
                        <PrimaryButton
                            title={"Submit"}
                            onPress={() => {
                                push(
                                    ref(
                                        database,
                                        `Reviews/${ServiceProviderID}/`
                                    ),
                                    {
                                        ReviewerID:UID,
                                        Name: Name,
                                        Review: review,
                                        Rate: starRate,
                                    }
                                );
                            }}
                        />
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

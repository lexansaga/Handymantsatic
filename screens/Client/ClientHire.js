import React, { useEffect, useState } from "react";
import {
    View,
    ScrollView,
    Text,
    Image,
    RefreshControl,
    StyleSheet,
    Platform,
    PermissionsAndroid,
    TouchableOpacity,
} from "react-native";
import Header from "../../components/Header";
import ClientHome, { ClientServiceFeed } from "./ClientHome";
import style from "../../styles/style";
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
import axios from "axios";

import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import PrimaryButton from "../../components/PrimaryButton";
import { useIsFocused } from "@react-navigation/native";
import { DefaultProfile, IsNullOrEmpty, PriceFormat } from "../Utils";
import { Feather } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";
import {
    uploadBytesResumable,
    ref as strRef,
    getDownloadURL,
} from "firebase/storage";
import ShowToast from "../../components/Toast";
import Spinner from "../../components/Spinner";
import StarRating from "../../components/StarRating";
export default function ClientHire({ navigation, route }) {
    const [userInfo, setUserInfo] = useState({});
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
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();
    const [profileLink, setProfileLink] = useState("");

    const [spinnerTitle, setSpinnerTitle] = useState("");
    const [isSpinnerShow, setSpinnerShow] = useState(false);
    const [reviews, setReviews] = useState({});

    const [image, setImage] = useState(null);

    let isServiceProvider = IsNullOrEmpty(Type)
        ? false
        : Type.includes("ServiceProvider");
    let isCLient = IsNullOrEmpty(Type) ? false : Type.includes("Client");

    useEffect(() => {}, []);
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
            console.log(user);
            getClientReviews(user.UID).then((data) => {
                setReviews(data);
                // console.log(reviews);
            });
        });
        console.log(UID);

        console.log("Refresh");
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const getClientReviews = async (ClientID) => {
        const url = `${firebaseBaseUrl}Reviews/${ClientID}.json`;
        const response = await axios.get(url);
        console.log(url);
        return response.data;
    };
    return (
        <View>
            <Spinner
                title={spinnerTitle}
                description={"Please wait while uploading image..."}
                isOpen={isSpinnerShow}
            />
            <Header userProfile={profileLink} />
            <Image
                source={{
                    uri: Profile ? Profile : DefaultProfile,
                }}
                style={styles.CoverImage}
            />
            <View style={styles.MainWrap}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "space-between",
                    }}
                    style={style.MainScroll}
                >
                    <View style={style.Section}>
                        <TouchableOpacity
                            style={styles.editBtn}
                            onPress={() => {
                                navigation.navigate("ProfileEdit", {
                                    UserInfo: userInfo,
                                });
                            }}
                        >
                            <Feather name={"edit"} size={18} color="#333" />
                        </TouchableOpacity>

                        <Text style={style.SectionTitle}>
                            Profile Information
                        </Text>
                        <View style={styles.InfoGroup}>
                            <Text style={styles.InfoTitle}>Name</Text>
                            <Text style={styles.InfoContent}>
                                {IsNullOrEmpty(Name) ? "Not set" : Name}
                            </Text>
                        </View>
                        {isServiceProvider ? (
                            <>
                                <View style={styles.InfoGroup}>
                                    <Text style={styles.InfoTitle}>
                                        Cover Letter
                                    </Text>
                                    <Text style={styles.InfoContent}>
                                        {IsNullOrEmpty(JobDescription)
                                            ? "Not set"
                                            : JobDescription}
                                    </Text>
                                </View>
                                <View style={styles.InfoGroup}>
                                    <Text style={styles.InfoTitle}>
                                        Service Offered
                                    </Text>
                                    <Text style={styles.InfoContent}>
                                        {IsNullOrEmpty(ServiceOffered)
                                            ? "Not set"
                                            : ServiceOffered}
                                    </Text>
                                </View>
                            </>
                        ) : (
                            <></>
                        )}
                        <View style={styles.InfoGroup}>
                            <Text style={styles.InfoTitle}>Contact</Text>
                            <Text style={styles.InfoContent}>
                                {IsNullOrEmpty(Contact) ? "Not set" : Contact}
                            </Text>
                        </View>
                        {isCLient ? (
                            <View style={styles.InfoGroup}>
                                <Text style={styles.InfoTitle}>Address</Text>
                                <Text style={styles.InfoContent}>
                                    {IsNullOrEmpty(Address)
                                        ? "Not set"
                                        : Address}
                                </Text>
                            </View>
                        ) : (
                            <></>
                        )}

                        {isServiceProvider ? (
                            <View style={styles.InfoGroup}>
                                <Text style={styles.InfoTitle}>Rate</Text>
                                <Text style={styles.InfoContent}>
                                    {IsNullOrEmpty(Rate)
                                        ? "Not set"
                                        : PriceFormat(Rate)}
                                </Text>
                            </View>
                        ) : (
                            <></>
                        )}
                        {/* <View style={styles.WorkImageWrap}>
                            <Image
                                style={styles.WorkImage}
                                source={require("../../assets/sample_image_1.jpg")}
                            />
                            <Image
                                style={styles.WorkImage}
                                source={require("../../assets/sample_image_2.jpg")}
                            />
                            <Image
                                style={styles.WorkImage}
                                source={require("../../assets/sample_image_3.jpg")}
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
                        </View> */}

                        <View style={styles.ReviewWrap}>
                            <Text style={style.SectionTitle}>Reviews</Text>
                            <View style={styles.ReviewItemWrap}>
                                {IsNullOrEmpty(reviews) ? (
                                    <Text style={styles.ReviewName}>
                                        No Reviews Yet!
                                    </Text>
                                ) : (
                                    Object.values(reviews).map((review) => {
                                        return (
                                            <View style={styles.ReviewItem}>
                                                <Text
                                                    style={styles.ReviewContent}
                                                >
                                                    {review.Review}
                                                </Text>
                                                <Text style={styles.ReviewName}>
                                                    {review.Name}
                                                </Text>
                                                <View style={styles.StarRate}>
                                                    <StarRating
                                                        rating={review.Rate}
                                                        maxRating={5}
                                                    />
                                                </View>
                                            </View>
                                        );
                                    })
                                )}
                            </View>
                        </View>
                    </View>
                    {/* <View style={style.Section}>
                        <PrimaryButton
                            title={"Hire John"}
                            onPress={() => {
                                navigation.navigate("Client Hire Form", {
                                    key: "value",
                                });
                            }}
                        />
                    </View> */}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    editBtn: {
        position: "absolute",
        right: 15,
        top: 15,
        zIndex: 2,
        backgroundColor: "rgba(0,0,0,0.1)",
        height: 45,
        width: 45,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
    },
    InfoGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: "#dedede",
    },
    InfoTitle: {
        fontSize: 17,
        fontWeight: 600,
    },

    InfoContent: {
        fontSize: 15,
        fontWeight: 400,
    },
    CoverImage: {
        width: "100%",
        resizeMode: "cover",
        height: vh(25),
    },
    MainWrap: {
        borderTopLeftRadius: 30,
        borderTopEndRadius: 30,
        // overflow: "hidden",
        marginTop: "-5%",
        zIndex: 2,
        height: vh(70),
        backgroundColor: "#fff",
    },
    MainScroll: {
        flex: 1,
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
    ReviewWrap: {
        marginTop: 28,
    },
    ReviewItemWrap: {
        marginTop: 18,
    },
    ReviewItem: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        borderBottomColor: "rgba(0,0,0,0.1)",
        borderBottomWidth: 2,
        marginBottom: 30,
        paddingBottom: 30,
    },
    ReviewName: { fontWeight: 500, fontSize: 20, fontStyle: "italic" },
    ReviewContent: { fontSize: 16, lineHeight: 25 },
    StarRate: {
        display: "flex",
        flexDirection: "row",
        gap: 4,
    },
});

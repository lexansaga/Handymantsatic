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
    Alert,
    Switch,
} from "react-native";
import Header from "../../components/Header";
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
    set,
} from "../../config/firebase.config";
import axios from "axios";
import StarRating from "../../components/StarRating";
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
import { Toast } from "reactstrap";
import AppAlert from "../../components/AppAlert";
export default function AdminUsers({ navigation, route }) {
    const [userInfo, setUserInfo] = useState({});
    const {
        Email,
        Name,
        Contact,
        Rate,
        Password,
        Profile,
        UID,
        JobDescription,
        ServiceOffered,
        Address,
        IsActive,
    } = userInfo;
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();
    const [profileLink, setProfileLink] = useState("");

    const [spinnerTitle, setSpinnerTitle] = useState("");
    const [isSpinnerShow, setSpinnerShow] = useState(false);
    const [reviews, setReviews] = useState({});
    const [isUserActive, setIsUserActive] = useState(
        IsActive ? IsActive : false
    );
    const toggleIsUserActive = () => {
        setIsUserActive(!isUserActive);
        update(child(databaseRef, `Users/${UID}/`), {
            IsActive: !isUserActive,
        });
        // console.log(isUserActive);
    };

    const [image, setImage] = useState(null);

    const ID = route.params.ID;
    const Type = route.params.Type;
    console.log(`This type ${ID}`);

    let isServiceProvider = IsNullOrEmpty(Type)
        ? false
        : Type.includes("ServiceProvider");
    let isCLient = IsNullOrEmpty(Type) ? false : Type.includes("Client");

    useEffect(() => {
        if (isFocused) {
            onRefresh();
            console.log("Focused");
        }
    }, [isFocused]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        UserInfo(ID).then((user) => {
            setUserInfo(user);
            setIsUserActive(user.IsActive);
            getClientReviews(user.UID).then((data) => {
                setReviews(data);
            });
        });

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
        <View style={{ marginTop: -20 }}>
            <Spinner
                title={spinnerTitle}
                description={"Please wait while uploading image..."}
                isOpen={isSpinnerShow}
            />
            <Header userProfile={profileLink} isAdmin={true} />

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
                        <View style={styles.btnActionWrap}>
                            <TouchableOpacity
                                style={[
                                    styles.actionButton,
                                    styles.actionButtonHasText,
                                ]}
                                onPress={() => {
                                    navigation.navigate("AdminReports", {
                                        ID: UID,
                                        Type: Type,
                                    });
                                }}
                            >
                                <Feather name={"flag"} size={18} color="#333" />
                                <Text>Reports</Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => {
                                    //     navigation.navigate("AdminReports");
                                    ShowToast(
                                        "Are you sure you want to delete this user?"
                                    );
                                }}
                            >
                                <Feather
                                    name={"trash-2"}
                                    size={18}
                                    color="#333"
                                />
                            </TouchableOpacity> */}
                        </View>

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
                            <>
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
                                <View style={styles.InfoGroup}>
                                    <Text style={styles.InfoTitle}>Rate</Text>
                                    <Text style={styles.InfoContent}>
                                        {IsNullOrEmpty(Rate)
                                            ? "Not set"
                                            : PriceFormat(Rate)}
                                    </Text>
                                </View>
                            </>
                        ) : (
                            <></>
                        )}

                        <View style={styles.InfoGroup}>
                            <Text style={styles.InfoTitle}>
                                Disable Account
                            </Text>
                            <Switch
                                trackColor={{
                                    false: "#767577",
                                    true: "#81b0ff",
                                }}
                                thumbColor={
                                    isUserActive ? "#f5dd4b" : "#f4f3f4"
                                }
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleIsUserActive}
                                value={isUserActive}
                            />
                        </View>

                        <View style={styles.ReviewWrap}>
                            <Text style={style.SectionTitle}>Reviews</Text>
                            <View style={styles.ReviewItemWrap}>
                                {IsNullOrEmpty(reviews) ? (
                                    <Text style={styles.ReviewName}>
                                        No Reviews Yet!
                                    </Text>
                                ) : (
                                    Object.entries(reviews).map(
                                        ([key, review]) => {
                                            return (
                                                <View style={styles.ReviewItem}>
                                                    <Text
                                                        style={
                                                            styles.ReviewContent
                                                        }
                                                    >
                                                        {review.Review}
                                                    </Text>
                                                    <Text
                                                        style={
                                                            styles.ReviewName
                                                        }
                                                    >
                                                        {review.Name}
                                                    </Text>
                                                    <View
                                                        style={styles.StarRate}
                                                    >
                                                        <StarRating
                                                            rating={review.Rate}
                                                            maxRating={5}
                                                        />
                                                    </View>
                                                    <View
                                                        style={
                                                            styles.ReviewBtnActionWrap
                                                        }
                                                    >
                                                        <TouchableOpacity
                                                            style={[
                                                                styles.actionButton,
                                                                styles.actionButtonHasText,
                                                                {
                                                                    backgroundColor:
                                                                        "#eb343133",
                                                                },
                                                            ]}
                                                            onPress={() => {
                                                                Alert.alert(
                                                                    "Delete Review",
                                                                    "Are you sure you want to delete this review?",
                                                                    [
                                                                        {
                                                                            text: "No",
                                                                            onPress:
                                                                                () => {},
                                                                            style: "cancel",
                                                                        },
                                                                        {
                                                                            text: "Yes",
                                                                            onPress:
                                                                                () => {
                                                                                    console.log(
                                                                                        "Press yes"
                                                                                    );
                                                                                    set(
                                                                                        child(
                                                                                            databaseRef,
                                                                                            `Reviews/${UID}/${key}`
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
                                                                name={"trash-2"}
                                                                size={18}
                                                                color="#333"
                                                            />
                                                            <Text>
                                                                Delete Review
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            );
                                        }
                                    )
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    ReviewBtnActionWrap: {
        position: "absolute",
        right: 15,
        bottom: 30,
        zIndex: 2,
        display: "flex",
        flexDirection: "row",
        gap: 8,
    },
    btnActionWrap: {
        position: "absolute",
        right: 15,
        top: 15,
        zIndex: 2,
        display: "flex",
        flexDirection: "row",
        gap: 8,
    },
    actionButton: {
        backgroundColor: "#eb343133",
        minHeight: 45,
        minWidth: 45,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
    },
    actionButtonHasText: {
        paddingHorizontal: 12,
        gap: 8,
        backgroundColor: "#7EB58D33",
    },
    InfoGroup: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
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

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
} from "../../config/firebase.config";

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
export default function AdminReports({ navigation, route }) {
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
    } = userInfo;
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();
    const [profileLink, setProfileLink] = useState("");

    const [spinnerTitle, setSpinnerTitle] = useState("");
    const [isSpinnerShow, setSpinnerShow] = useState(false);

    const [image, setImage] = useState(null);

    const Type = route.params.Type;
    console.log(`This type ${Type}`);

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
        UserInfo().then((user) => {
            setUserInfo(user);
        });
        console.log("Refresh");
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
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
                        <View style={styles.btnActionWrap}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => {
                                    navigation.navigate("ProfileEdit");
                                }}
                            >
                                <Feather
                                    name={"trash-2"}
                                    size={18}
                                    color="#333"
                                />
                            </TouchableOpacity>
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

                        <View style={styles.ReviewWrap}>
                            <Text style={style.SectionTitle}>Reports</Text>
                            <View style={styles.ReviewItemWrap}>
                                <View style={styles.ReviewItem}>
                                    <View style={styles.ReviewBtnActionWrap}>
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
                                                navigation.navigate(
                                                    "ProfileEdit"
                                                );
                                            }}
                                        >
                                            <Feather
                                                name={"trash-2"}
                                                size={18}
                                                color="#333"
                                            />
                                            <Text>Delete Report</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={styles.ReviewContent}>
                                        Ullamco quis mollit id minim proident
                                        cillum cupidatat ad eiusmod irure aute
                                        officia. Ut adipisicing aliquip aliquip
                                        veniam. Dolor nostrud labore voluptate
                                        nulla.
                                    </Text>
                                    <Text style={styles.ReviewName}>
                                        John Doe
                                    </Text>
                                </View>
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

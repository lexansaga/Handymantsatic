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
} from "../../config/firebase.config";

import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import PrimaryButton from "../../components/PrimaryButton";
import { useIsFocused } from "@react-navigation/native";
import { DefaultProfile } from "../Utils";

import * as ImagePicker from "expo-image-picker";
import {
    uploadBytesResumable,
    ref as strRef,
    getDownloadURL,
} from "firebase/storage";
import ShowToast from "../../components/Toast";
import Spinner from "../../components/Spinner";
export default function ClientHire({ navigation, route }) {
    const [userInfo, setUserInfo] = useState({});
    const { Email, Name, Password, Profile, Type, UID, JobDescription } =
        userInfo;
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();
    const [profileLink, setProfileLink] = useState("");

    const [spinnerTitle, setSpinnerTitle] = useState("");
    const [isSpinnerShow, setSpinnerShow] = useState(false);

    const [image, setImage] = useState(null);
    const uriToBlob = (uri) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                // return the blob
                resolve(xhr.response);
            };

            xhr.onerror = function () {
                // something went wrong
                reject(new Error("uriToBlob failed"));
            };
            // this helps us get a blob
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);

            xhr.send(null);
        });
    };
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        let file = await uriToBlob(result.assets[0].uri);
        console.log(result.assets[0]);
        let fileName = result.assets[0].uri.split("/").slice(-1);
        let fileExtension = result.assets[0].uri.split(".").slice(-1);
        const metadata = {
            contentType: "image/jpeg",
        };
        const storageRef = strRef(
            storage,
            `Assets/Profile/${Name}_${UID}.${fileExtension}/`
        );
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        await uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                setSpinnerTitle(`Uploading Image ${Math.round(progress)}%`);
                setSpinnerShow(true);
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                console.log("Error " + error);
                ShowToast("Upload failed : There's an error occured!");
            },
            async () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                await getDownloadURL(uploadTask.snapshot.ref).then(
                    (downloadURL) => {
                        console.log("File available at", downloadURL);

                        update(ref(database, `Users/${UID}/`), {
                            Profile: downloadURL,
                        });
                        setProfileLink(downloadURL);
                        onRefresh();
                        setSpinnerShow(false);
                    }
                );
            }
        );
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
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
        <View style={{ paddingBottom: 120 }}>
            <Spinner
                title={spinnerTitle}
                description={"Please wait while uploading image..."}
                isOpen={isSpinnerShow}
            />
            <Header userProfile={profileLink} />
            <TouchableOpacity
                onPress={() => {
                    pickImage();
                    console.log("Select photo");
                }}
            >
                <Image
                    source={{
                        uri: Profile ? Profile : DefaultProfile,
                    }}
                    style={styles.CoverImage}
                />
            </TouchableOpacity>
            <View style={styles.MainWrap}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <ClientServiceFeed
                        style={style.Info}
                        service={Name}
                        name={"Plumber"}
                        price=""
                    />
                    <View style={style.Section}>
                        <Text style={style.SectionTitle}>Job Description</Text>
                        <Text style={styles.Verbiage}>{JobDescription}</Text>
                    </View>
                    <View style={style.Section}>
                        <Text style={style.SectionTitle}>Work Profile</Text>
                        <View style={styles.WorkImageWrap}>
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
    CoverImage: {
        width: "100%",
        resizeMode: "cover",
        height: vh(25),
    },
    MainWrap: {
        borderTopLeftRadius: 30,
        borderTopEndRadius: 30,
        overflow: "hidden",
        marginTop: "-10%",
        zIndex: 2,
        backgroundColor: "#ffffff",
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
});

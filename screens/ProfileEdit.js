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
import Header from "../components/Header";
import ClientHome, { ClientServiceFeed } from "./Client/ClientHome";
import style from "../styles/style";
import {
    auth,
    database,
    databaseRef,
    ref,
    child,
    get,
    UserInfo,
    push,
    update,
    storage,
    sendPasswordResetEmail,
} from "../config/firebase.config";

import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import PrimaryButton from "../components/PrimaryButton";
import { useIsFocused } from "@react-navigation/native";
import { DefaultProfile, IsNullOrEmpty, NumberFormat } from "./Utils";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import {
    uploadBytesResumable,
    ref as strRef,
    getDownloadURL,
} from "firebase/storage";
import ShowToast from "../components/Toast";
import Spinner from "../components/Spinner";
import Input from "../components/Input";
import SecondaryButton from "../components/SecondaryButton";
export default function ProfileEdit({ navigation, route }) {
    const [userInfo, setUserInfo] = useState({});
    const {
        Email,
        Name,
        Password,
        Profile,
        Type,
        UID,
        JobDescription,
        ServiceOffered,
        Rate,
    } = userInfo;
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();
    const [profileLink, setProfileLink] = useState("");

    const [spinnerTitle, setSpinnerTitle] = useState("");
    const [isSpinnerShow, setSpinnerShow] = useState(false);

    const [image, setImage] = useState(null);

    const [dpOpen, dpSetOpen] = useState(false);
    const [dpDate, dpSetDate] = useState(new Date());

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);

    const [name, setName] = useState("");
    const [rate, setRate] = useState("");
    const [contact, setContact] = useState("");
    const [description, setDescription] = useState("");

    const getCategory = async () => {
        var categoryData = [];
        await get(child(databaseRef, `Category`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    var items = snapshot.val();
                    Object.values(items).map((item) => {
                        categoryData.push({
                            label: item.Name,
                            value: item.Name,
                        });
                    });

                    // console.log(categoryData);
                    setItems(categoryData);
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

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
        } else {
            setName("");
            setRate("");
            setDescription("");
            setValue("");
        }
    }, [isFocused]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        UserInfo().then((user) => {
            setUserInfo(user);
        });
        getCategory();
        setName(Name);
        setRate(Rate);
        setDescription(JobDescription);
        setValue(ServiceOffered);
        console.log("Refresh");
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    return (
        <View style={{ paddingBottom: 92 }}>
            <Spinner
                title={spinnerTitle}
                description={"Please wait while uploading image..."}
                isOpen={isSpinnerShow}
            />
            <Header userProfile={profileLink} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
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
                    <ClientServiceFeed
                        style={style.Info}
                        service={""}
                        name={""}
                        price=""
                    />
                    <View style={styles.PageSection}>
                        <Text style={style.SectionTitle}>
                            Profile Information
                        </Text>

                        <DropDownPicker
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            showArrowIcon={true}
                            listMode="MODAL"
                            placeholder="Service  Offered"
                            modalProps={{
                                animationType: "slide",
                                width: "50%",
                            }}
                            modalTitle="Select Type"
                            style={{
                                borderColor: "transparent",
                                borderRadius: 0,
                                backgroundColor: "#ededed",
                                marginLeft: 10,
                            }}
                        />
                        <Input
                            style={styles.input}
                            placeholder={"Name"}
                            value={name}
                            onChangeText={setName}
                            icon="user"
                            isPassword={false}
                        />
                        <Input
                            style={styles.input}
                            placeholder={"Contact (9123456789)"}
                            value={contact}
                            onChangeText={setContact}
                            icon="phone"
                            isPassword={false}
                        />

                        <Input
                            style={styles.input}
                            placeholder={"Rate"}
                            value={rate}
                            onChangeText={setRate}
                            icon="trello"
                            isPassword={false}
                        />
                        <Input
                            style={styles.input}
                            placeholder={"Description"}
                            value={description}
                            onChangeText={setDescription}
                            icon="book-open"
                            numberOfLines={4}
                            isPassword={false}
                            multiline={true}
                        />
                        <View style={styles.btnWrap}>
                            <PrimaryButton
                                title={"Save"}
                                onPress={() => {
                                    update(ref(database, `Users/${UID}/`), {
                                        Name: IsNullOrEmpty(name) ? name : Name,
                                        ServiceOffered: IsNullOrEmpty(value)
                                            ? ""
                                            : value,
                                        JobDescription: IsNullOrEmpty(
                                            description
                                        )
                                            ? ""
                                            : description,
                                        Rate: IsNullOrEmpty(rate) ? "" : rate,
                                        Contact: IsNullOrEmpty(
                                            NumberFormat(contact)
                                        )
                                            ? ""
                                            : NumberFormat(contact),
                                    });
                                    ShowToast("Data updated successfully!");
                                    navigation.navigate("ClientHire");
                                    onRefresh();
                                }}
                            />
                            <SecondaryButton
                                title={"Reset Password"}
                                onPress={() => {
                                    sendPasswordResetEmail(auth, Email)
                                        .then(() => {
                                            // Password reset email sent!
                                            // ..
                                            ShowToast(
                                                "Please check mail to reset password!   "
                                            );
                                        })
                                        .catch((error) => {
                                            const errorCode = error.code;
                                            const errorMessage = error.message;
                                            console.log(errorMessage);
                                            ShowToast(
                                                "An error occured while resseting password!"
                                            );
                                            // ..
                                        });
                                }}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    PageSection: {
        display: "flex",
        flexDirection: "column",
        paddingHorizontal: 18,
        paddingVertical: 28,
        paddingRight: 36,
        gap: 8,
    },
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
        height: "110%",
        zIndex: 2,
        backgroundColor: "#fff",
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
    btnWrap: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        width: "100%",
        marginTop: 72,
        left: 8,
    },
});

import React, { useEffect, useState } from "react";
import {
    View,
    ScrollView,
    Text,
    Image,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import style from "../styles/style";
import {
    UserInfo,
    auth,
    database,
    ref,
    update,
    storage,
} from "../config/firebase.config";
import PrimaryButton from "../components/PrimaryButton";
import { useIsFocused } from "@react-navigation/native";
import { IsNullOrEmptyFallback } from "./Utils";
import styles from "../styles/style";
import * as ImagePicker from "expo-image-picker";
import {
    uploadBytesResumable,
    ref as strRef,
    getDownloadURL,
} from "firebase/storage";
import ShowToast from "../components/Toast";
import Spinner from "../components/Spinner";
import { sendEmailVerification } from "firebase/auth";
import Modal from "../components/Modal";
import CustomModal from "../components/CustomModal";

export default function Verification({ navigation, route }) {
    const [userInfo, setUserInfo] = useState({});
    const { Email, Name, Password, Profile, Type, UID } = route.params;
    console.log(route.params);
    const { ValidID, NBI, Certificate1, Certificate2, Face } =
        IsNullOrEmptyFallback(route.params.Documents, {});
    const [validID, setValidID] = useState("");
    const [nbi, setNBI] = useState("");
    const [certificate1, setCertificate1] = useState("");
    const [certificate2, setCertificate2] = useState("");
    const [face, setFace] = useState("");

    const [spinnerTitle, setSpinnerTitle] = useState("");
    const [isSpinnerShow, setSpinnerShow] = useState(false);

    const [isModalShown, setIsModalShown] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const [modalImage, setModalImage] = useState("");
    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const [refreshing, setRefreshing] = useState(false);
    var blankImage =
        "https://firebasestorage.googleapis.com/v0/b/handymantastic-80f66.appspot.com/o/Assets%2FDocument%2Fblank-doc.png?alt=media&token=45edf5d4-0a30-4107-8622-bf41ccb8746e";

    const isFocus = useIsFocused();
    useEffect(() => {
        if (isFocus) {
            onRefresh();
        }
    }, [isFocus]);
    const onRefresh = () => {
        setRefreshing(true);

        UserInfo().then((user) => {
            setUserInfo(user);
        });
        //  setIsModalShown(false);
        console.log(UID);
        setValidID(IsNullOrEmptyFallback(ValidID, blankImage));
        setNBI(IsNullOrEmptyFallback(NBI, blankImage));
        setCertificate1(IsNullOrEmptyFallback(Certificate1, blankImage));
        setCertificate2(IsNullOrEmptyFallback(Certificate2, blankImage));
        setFace(IsNullOrEmptyFallback(Face, blankImage));

        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    const pickImage = async (documentName, setTo) => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            // aspect: [16, 9],
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
            `Assets/Document/${UID}_${documentName}.${fileExtension}/`
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
                setSpinnerTitle(`Processing Image ${Math.round(progress)}%`);
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
                        setSpinnerShow(false);
                        update(ref(database, `Users/${UID}/Documents/`), {
                            [`${documentName}`]: downloadURL,
                        });
                    }
                );
            }
        );
        if (!result.canceled) {
            //setImage(result.assets[0].uri);
            setTo(result.assets[0].uri);
        }
        if (result.canceled) {
            setTo(blankImage);
        }
    };
    return (
        <View
            style={[
                styles.Section,
                {
                    marginBottom: 20,
                },
            ]}
        >
            <CustomModal
                visible={modalVisible}
                closeModal={closeModal}
                modalContent={
                    <Image
                        source={{
                            uri: modalImage,
                        }}
                        style={{
                            height: "100%",
                            width: "100%",
                            resizeMode: "contain",
                        }}
                    />
                }
            />
            <Spinner
                title={spinnerTitle}
                description={"Please wait while processing the image..."}
                isOpen={isSpinnerShow}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Image
                    source={require("../assets/logo.png")}
                    style={pageStyles.image}
                />
                {/* <Text style={pageStyles.pageTitle}>Handymantastic</Text> */}
                <Text style={pageStyles.pageTitle}>Verify Account</Text>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                    }}
                >
                    <View style={pageStyles.DocumentSection}>
                        <Text
                            style={[style.SectionTitle, { textAlign: "left" }]}
                        >
                            Goverment ID
                        </Text>
                        <View style={pageStyles.DocumentImageWrap}>
                            <TouchableOpacity
                                onPress={() => {
                                    ShowToast("Please select Valid ID");
                                    pickImage("ValidID", setValidID);
                                }}
                                onLongPress={() => {
                                    console.log("Long Press");
                                    setModalImage(validID);
                                    openModal();
                                    console.log(isModalShown);
                                }}
                            >
                                <View style={pageStyles.ImageWrap}>
                                    <Image
                                        source={{
                                            uri: validID,
                                        }}
                                        style={pageStyles.DocumentImage}
                                    />
                                    <Text style={pageStyles.DocumentLabel}>
                                        Valid ID
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    ShowToast("Please select NBI");
                                    pickImage("NBI", setNBI);
                                }}
                                onLongPress={() => {
                                    console.log("Long Press");
                                    setModalImage(nbi);
                                    openModal();
                                    console.log(isModalShown);
                                }}
                            >
                                <View style={pageStyles.ImageWrap}>
                                    <Image
                                        source={{
                                            uri: nbi,
                                        }}
                                        style={pageStyles.DocumentImage}
                                    />
                                    <Text style={pageStyles.DocumentLabel}>
                                        NBI
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={pageStyles.DocumentSection}>
                        <Text
                            style={[style.SectionTitle, { textAlign: "left" }]}
                        >
                            Skills Certification
                        </Text>
                        <View style={pageStyles.DocumentImageWrap}>
                            <TouchableOpacity
                                onPress={() => {
                                    ShowToast(
                                        "Please select certificate related to your skill!"
                                    );
                                    pickImage("Certificate1", setCertificate1);
                                }}
                                onLongPress={() => {
                                    console.log("Long Press");
                                    setModalImage(certificate1);
                                    openModal();
                                    console.log(isModalShown);
                                }}
                            >
                                <View style={pageStyles.ImageWrap}>
                                    <Image
                                        source={{
                                            uri: certificate1,
                                        }}
                                        style={pageStyles.DocumentImage}
                                    />
                                    <Text style={pageStyles.DocumentLabel}>
                                        Certificate
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    ShowToast(
                                        "Please select certificate related to your skill!"
                                    );
                                    pickImage("Certificate2", setCertificate2);
                                }}
                                onLongPress={() => {
                                    console.log("Long Press");
                                    setModalImage(certificate2);
                                    openModal();
                                    console.log(isModalShown);
                                }}
                            >
                                <View style={pageStyles.ImageWrap}>
                                    <Image
                                        source={{
                                            uri: certificate2,
                                        }}
                                        style={pageStyles.DocumentImage}
                                    />
                                    <Text style={pageStyles.DocumentLabel}>
                                        Certificate
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={pageStyles.DocumentSection}>
                        <Text
                            style={[style.SectionTitle, { textAlign: "left" }]}
                        >
                            Facial Verification
                        </Text>
                        <View style={pageStyles.DocumentImageWrap}>
                            <TouchableOpacity
                                onPress={() => {
                                    ShowToast(
                                        "Please select certificate related to your skill!"
                                    );
                                    pickImage("Face", setFace);
                                }}
                                onLongPress={() => {
                                    console.log("Long Press");
                                    setModalImage(face);
                                    openModal();
                                    console.log(isModalShown);
                                }}
                            >
                                <View style={pageStyles.ImageWrap}>
                                    <Image
                                        source={{
                                            uri: face,
                                        }}
                                        style={pageStyles.DocumentImage}
                                    />
                                    <Text style={pageStyles.DocumentLabel}>
                                        Face
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={pageStyles.buttonWrapper}>
                    <PrimaryButton
                        title={"Submit for Verification"}
                        onPress={() => {
                            sendEmailVerification(auth.currentUser).then(() => {
                                ShowToast(
                                    "Please check mail and verify to log in"
                                );
                                Alert.alert(
                                    "Verify Account",
                                    "Documents has been submitted. Please check now your email for verifaction link and  Please wait for approval of the documents \n Thank you!",
                                    [
                                        {
                                            text: "Got it",
                                            onPress: () => {
                                                //Accept - Yes
                                                ShowToast("Sign Up Success!");
                                                navigation.navigate("Signin", {
                                                    key: "value",
                                                });
                                            },
                                        },
                                    ],
                                    {
                                        cancelable: false,
                                    }
                                );
                            });
                        }}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

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

const pageStyles = StyleSheet.create({
    PageSection: {
        display: "flex",
        flexDirection: "column",
        paddingHorizontal: 18,
        paddingVertical: 28,
        paddingRight: 36,
        gap: 8,
    },
    pageTitle: {
        width: "100%",
        display: "flex",
        fontSize: 28,
        textTransform: "uppercase",
        justifyContent: "center",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 28,
        marginTop: 18,
        fontWeight: "bold",
        fontFamily: "Roboto",
        textAlign: "center",
    },
    buttonWrapper: {
        display: "flex",
        position: "relative",
        marginTop: 28,
        width: "100%",
        gap: 8,
    },
    image: {
        resizeMode: "contain",
        minHeight: 130,
        minWidth: 130,
        maxWidth: 300,
        maxHeight: 300,
        alignSelf: "center",
    },
    DocumentSection: {
        marginBottom: 20,
    },
    DocumentImageWrap: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
    },
    DocumentImage: {
        height: 120,
        width: 120,
        resizeMode: "contain",
    },
    DocumentLabel: {
        textAlign: "center",
        fontSize: 18,
        marginTop: 12,
        maxWidth: 120,
    },
    CertificateName: {
        marginTop: 12,
        backgroundColor: "#dedede",
        color: "#000",
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderRadius: 10,
    },
});

import React, { useState } from "react";

import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Platform,
    PermissionsAndroid,
    Dimensions,
    ScrollView,
} from "react-native";

// Import Image Picker
// import ImagePicker from 'react-native-image-picker';
import * as ImagePicker from "expo-image-picker";

import { Avatar } from "react-native-elements";
import Input from "../components/Input";
import { Feather } from "@expo/vector-icons";
import Header from "../components/Header";

import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";

export default function Chat({ navigation, route }) {
    const [message, setMessage] = useState("");

    var [selectedImage, setSelectedImage] = useState(null);
    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            console.log(result.assets[0].uri);
        } else {
            alert("You did not select any image.");
        }
    };

    return (
        <View automaticallyAdjustContentInset={true}>
            <Header />
            <View style={styles.mainWrapper}>
                <View style={styles.chatHeader}>
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
                    <Text style={styles.ClientName}>John Doe</Text>
                </View>
                <ScrollView
                    style={styles.chatBody}
                    contentContainerStyle={{
                        flexGrow: 1,
                        flexDirection: "column-reverse",
                        justifyContent: "flex-end",
                    }}
                    automaticallyAdjustKeyboardInsets={true}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[styles.messageReceived, styles.message]}>
                        <Text>
                            Hello! I asm near at this store come and pick me up
                        </Text>
                    </View>
                    <View style={[styles.messageSent, styles.message]}>
                        <Text style={styles.messageSent}>
                            Hello! I asm near at this store come and pick me up
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.messageSent,
                            styles.message,
                            styles.messageImage,
                        ]}
                    >
                        {selectedImage != null ? (
                            <Image
                                source={{ uri: selectedImage }}
                                style={styles.chatImage}
                            />
                        ) : null}
                        {(selectedImage = useState(null))}
                    </View>
                </ScrollView>
                <View style={styles.chatCTA}>
                    <Input
                        style={styles.chatMessage}
                        placeholder={"Message"}
                        value={message}
                        onChangeText={setMessage}
                        icon={"edit-2"}
                    />
                    <TouchableOpacity
                        style={styles.chatBtnImage}
                        onPress={pickImageAsync}
                        title="Select Image"
                    >
                        <Feather
                            name="image"
                            size={30}
                            color="#000"
                            style={styles.inputIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.chatBtnImage}
                        onPress={pickImageAsync}
                        title="Select Image"
                    >
                        <Feather
                            name="camera"
                            size={30}
                            color="#000"
                            style={styles.inputIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const messageBorderRadius = 15;
const styles = StyleSheet.create({
    mainWrapper: {
        width: vw(90),
        height: Dimensions.get("window").height - 80,
        marginLeft: "auto",
        marginRight: "auto",
    },
    chatHeader: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.1)",
    },
    ClientName: {
        fontSize: 20,
    },
    chatBody: {
        paddingTop: 20,
        gap: 8,
        marginBottom: 80,
    },
    message: {
        paddingVertical: 18,
        paddingHorizontal: 16,
        maxWidth: "80%",
        marginBottom: 10,
    },
    messageReceived: {
        backgroundColor: "#E2E2E2",

        borderTopStartRadius: messageBorderRadius,
        borderTopEndRadius: messageBorderRadius,
        borderBottomStartRadius: 0,
        borderBottomEndRadius: messageBorderRadius,
    },
    messageSent: {
        alignSelf: "flex-end",
        backgroundColor: "#5ED0EA",
        color: "#fff",
        borderTopStartRadius: messageBorderRadius,
        borderTopEndRadius: messageBorderRadius,
        borderBottomStartRadius: messageBorderRadius,
        borderBottomEndRadius: 0,
    },
    messageImage: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
    },
    chatImage: {
        height: 100,
        width: 100,
        resizeMode: "cover",
    },
    chatCTA: {
        position: "absolute",
        bottom: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
    },
});

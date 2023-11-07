import React, { useEffect, useState } from "react";

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
    RefreshControl,
} from "react-native";

// Import Image Picker
// import ImagePicker from 'react-native-image-picker';
import * as ImagePicker from "expo-image-picker";

import { Avatar } from "react-native-elements";
import Input from "../../components/Input";
import { Feather } from "@expo/vector-icons";
import Header from "../../components/Header";

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
    firebaseBaseUrl,
} from "../../config/firebase.config";

import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import ShowToast from "../../components/Toast";
import { DefaultProfile, IsNullOrEmpty } from "../Utils";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";

export default function Chat({ navigation, route }) {
    const [message, setMessage] = useState("");

    const [userInfo, setUserInfo] = useState({});
    const { Email, Name, Password, Profile, Type, UID } = userInfo;
    const ReceiverID = route.params.ReceiverID;
    console.log(ReceiverID);
    const [refreshing, setRefreshing] = useState(false);
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

    const [participants, setParticipants] = useState({});
    const [chats, setChats] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    // async function getParticipants() {
    //     await get(child(databaseRef, "Messages/")).then((messages) => {
    //         if (messages.exists()) {
    //             const snapMessages = messages.val();
    //             for (const key in snapMessages) {
    //                 const eachMessages = snapMessages[key];
    //                 const MessagesParticipants = eachMessages.Participants;
    //                 const ReceiverClient = MessagesParticipants.find(
    //                     (MessagesParticipants) => MessagesParticipants !== UID
    //                 );
    //                 const SenderClient = MessagesParticipants.find(
    //                     (MessagesParticipants) => MessagesParticipants === UID
    //                 );
    //                 get(child(databaseRef, `Users/${ReceiverClient}/`)).then(
    //                     (receiver) => {
    //                         const snapReceiver = receiver.val();
    //                         // console.log(snapReceiver);

    //                         get(
    //                             child(databaseRef, `Users/${SenderClient}/`)
    //                         ).then((sender) => {
    //                             const snapSender = sender.val();
    //                             // console.log(snapSender);
    //                             const data = {
    //                                 Sender: snapSender,
    //                                 Receiver: snapReceiver,
    //                             };
    //                             const mergedDataString = JSON.stringify(
    //                                 data,
    //                                 null,
    //                                 2
    //                             );
    //                             // console.log(mergedDataString);
    //                             setParticipants(JSON.parse(mergedDataString));

    //                             console.log(participants);
    //                         });
    //                     }
    //                 );
    //             }
    //         }
    //     });
    // }

    const getParticipants = async () => {
        var data = {};
        var sender = {};
        var receiver = {};
        var messagesData = {};
        var url = `${firebaseBaseUrl}/Messages.json`;
        var messages = await axios.get(url);
        for (var key in messages.data) {
            if (key.includes(ReceiverID) && key.includes(UID)) {
                console.log(`Key : ${key}`);
                url = `${firebaseBaseUrl}/Messages/${key}.json`;
                var messagesData = await axios.get(url);
                var participants = messagesData.data.Participants;
                const ReceiverClient = participants.find(
                    (participants) => participants !== UID
                );
                const SenderClient = participants.find(
                    (participants) => participants === UID
                );
                var receiverURL = `${firebaseBaseUrl}/Users/${ReceiverClient}.json`;
                var senderURL = `${firebaseBaseUrl}/Users/${SenderClient}.json`;

                var receiverData = await axios.get(receiverURL);
                var senderData = await axios.get(senderURL);

                messagesData = messagesData.data;
                receiver = receiverData.data;
                sender = senderData.data;
            }

            // console.log(`Receiver ${ReceiverClient} | Sender : ${UID}`);
        }
        data = {
            ...messagesData,
            Receiver: receiver,
            Sender: sender,
        };
        const mergedDataString = JSON.stringify(data, null, 2);
        setChats(JSON.parse(mergedDataString));
        return JSON.parse(mergedDataString);
    };
    async function getMessages() {
        await get(child(databaseRef, "Messages/")).then(async (messages) => {
            if (messages.exists()) {
                const snapMessages = messages.val();
                for (const key in snapMessages) {
                    const eachMessages = snapMessages[key];
                    const snapChats = eachMessages.Messages;
                    setChats(snapChats);
                }
            }
        });
    }
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused == true) {
            onRefresh();

            async function fetch() {
                getParticipants().then((data) => {
                    console.log("data");
                    console.log(data);
                    setChats(data);
                });
            }
            fetch();
            console.log(chats);
        }
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        console.log("Refresh");
        UserInfo().then((user) => {
            setUserInfo(user);
        });

        // console.log(chats);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    return (
        <></>
        // <View automaticallyAdjustContentInset={true}>
        //     <Header />
        //     <View style={styles.mainWrapper}>
        //         <View style={styles.chatHeader}>
        //             <Avatar
        //                 rounded
        //                 title="Profile"
        //                 source={{
        //                     uri: IsNullOrEmpty(participants.Receiver.Profile)
        //                         ? DefaultProfile
        //                         : participants.Receiver.Profile,
        //                 }}
        //                 containerStyle={{
        //                     height: 50,
        //                     width: 50,
        //                 }}
        //             />
        //             <Text style={styles.ClientName}>
        //                 {participants.Receiver.Name}
        //             </Text>
        //         </View>
        //         <ScrollView
        //             style={styles.chatBody}
        //             contentContainerStyle={{
        //                 flexGrow: 1,
        //                 flexDirection: "column-reverse",
        //                 justifyContent: "flex-end",
        //             }}
        //             automaticallyAdjustKeyboardInsets={true}
        //             showsVerticalScrollIndicator={false}
        //             refreshControl={
        //                 <RefreshControl
        //                     refreshing={refreshing}
        //                     onRefresh={onRefresh}
        //                 />
        //             }
        //         >
        //             <View style={[styles.messageReceived, styles.message]}>
        //                 <Text>
        //                     Hello! I asm near at this store come and pick me up
        //                 </Text>
        //             </View>
        //             <View style={[styles.messageSent, styles.message]}>
        //                 <Text style={styles.messageSent}>
        //                     Hello! I asm near at this store come and pick me up
        //                 </Text>
        //             </View>
        //             <View
        //                 style={[
        //                     styles.messageSent,
        //                     styles.message,
        //                     styles.messageImage,
        //                 ]}
        //             >
        //                 {selectedImage != null ? (
        //                     <Image
        //                         source={{ uri: selectedImage }}
        //                         style={styles.chatImage}
        //                     />
        //                 ) : null}
        //                 {(selectedImage = useState(null))}
        //             </View>
        //         </ScrollView>
        //         <View style={styles.chatCTA}>
        //             <Input
        //                 style={styles.chatMessage}
        //                 placeholder={"Message"}
        //                 value={message}
        //                 onChangeText={setMessage}
        //                 onSubmitEditing={async () => {
        //                     var chatID = `${UID}|${ReceiverID}`;
        //                     var timeStamp = Date.now();
        //                     await update(ref(database, `Messages/${chatID}`), {
        //                         ChatID: chatID,
        //                         Participants: [
        //                             chatID.split("|")[0],
        //                             chatID.split("|")[1],
        //                         ],
        //                     });
        //                     await update(
        //                         ref(
        //                             database,
        //                             `Messages/${chatID}/Messages/${timeStamp}/`
        //                         ),
        //                         {
        //                             MessageID: "",
        //                             SenderID: UID,
        //                             ReceiverID: ReceiverID,
        //                             TimeStamp: timeStamp,
        //                             Content: message,
        //                         }
        //                     );
        //                 }}
        //                 icon={"edit-2"}
        //             />
        //             <TouchableOpacity
        //                 style={styles.chatBtnImage}
        //                 onPress={pickImageAsync}
        //                 title="Select Image"
        //             >
        //                 <Feather
        //                     name="image"
        //                     size={30}
        //                     color="#000"
        //                     style={styles.inputIcon}
        //                 />
        //             </TouchableOpacity>
        //             <TouchableOpacity
        //                 style={styles.chatBtnImage}
        //                 onPress={pickImageAsync}
        //                 title="Select Image"
        //             >
        //                 <Feather
        //                     name="camera"
        //                     size={30}
        //                     color="#000"
        //                     style={styles.inputIcon}
        //                 />
        //             </TouchableOpacity>
        //         </View>
        //     </View>
        // </View>
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

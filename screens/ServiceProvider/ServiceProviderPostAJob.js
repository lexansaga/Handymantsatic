import React, { useState } from "react";
import { View, ScrollView, Text, Image, StyleSheet } from "react-native";
import Header from "../../components/Header";
import Input from "../../components/Input";
import style from "../../styles/style";
import ShowToast from "../../components/Toast";
import DatePicker from "react-native-date-picker";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import PrimaryButton from "../../components/PrimaryButton";
import { AppTitle } from "../../components/General";
import DropDownPicker from "react-native-dropdown-picker";
import {
    app,
    auth,
    onAuthStateChanged,
    database,
    set,
    update,
    ref,
    push,
    get,
    child,
    databaseRef,
    UserInfo,
} from "../../config/firebase.config";
import { useEffect } from "react";
import { IsTextEmpty, PushNotification } from "../Utils";
export default function ServiceProviderPostAJob({ navigation, route }) {
    const [userInfo, setUserInfo] = useState({});
    const { Email, Name, Password, Profile, Type, UID } = userInfo;
    console.log(UID);
    const [serviceNeed, setServiceNeed] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");

    const [dpOpen, dpSetOpen] = useState(false);
    const [dpDate, dpSetDate] = useState(new Date());

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    useEffect(() => {
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

        getCategory();

        UserInfo().then((user) => {
            setUserInfo(user);
        });
    }, []);

    function PostAJob() {
        if (
            // IsTextEmpty(serviceNeed) ||
            IsTextEmpty(description) ||
            IsTextEmpty(price) ||
            IsTextEmpty(location) ||
            IsTextEmpty(value)
        ) {
            ShowToast("Fill up all the information!");
            return;
        }

        // var name = snap.Name;
        var save = push(ref(database, `Jobs`), {
            UserID: UID,
            Name: Name,
            ServiceNeed: value,
            Description: description,
            Price: price,
            Location: location,
            Category: value,
            Active: true,
            PostedBy: Email,
            ClientID: UID,
        });
        var saveKey = save.key;
        update(ref(database, `Jobs/${saveKey}`), {
            ID: saveKey,
        });
        console.log(saveKey);

        navigation.replace("Home", {
            Type: [`${Type}`],
        });

        PushNotification(
            null,
            "New Task Posted",
            `${Name} posted a new task. It may fit on you!`,
            "ServiceProvider"
        );
    }
    return (
        <View style={{ paddingBottom: 120 }}>
            <Header />
            <ScrollView automaticallyAdjustContentInsets={true}>
                <View style={[styles.MainWrap]}>
                    <AppTitle title={"Post A Job"} hasContact={false} />
                    <View style={style.Section}>
                        <Text style={style.SectionTitle}>Book Now!</Text>
                        <View style={styles.InputGroup}>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                showArrowIcon={true}
                                listMode="MODAL"
                                placeholder="Select Need"
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
                            {/* <Input
                                style={styles.Input}
                                placeholder={"Service Need"}
                                value={serviceNeed}
                                onChangeText={setServiceNeed}
                                icon="target"
                                isPassword={false}
                            /> */}

                            <Input
                                style={styles.Input}
                                placeholder={"Service Description"}
                                value={description}
                                onChangeText={setDescription}
                                icon="file-text"
                                isPassword={false}
                            />

                            <Input
                                style={styles.Input}
                                placeholder={"Price"}
                                value={price}
                                onChangeText={setPrice}
                                icon="tag"
                                isPassword={false}
                                keyboardType={"numeric"}
                            />
                            <Input
                                multiline={true}
                                style={styles.Input}
                                placeholder={"Location"}
                                value={location}
                                onChangeText={setLocation}
                                icon="map-pin"
                                isPassword={false}
                                onPress={() => dpSetOpen(true)}
                            />
                        </View>
                    </View>

                    <View style={style.Section}>
                        <PrimaryButton
                            title={"Post Now!"}
                            onPress={() => {
                                PostAJob();
                            }}
                        />
                    </View>

                    <DatePicker
                        modal
                        open={dpOpen}
                        date={dpDate}
                        onConfirm={(dpDate) => {
                            dpSetOpen(false);
                            dpSetDate(dpDate);
                        }}
                        onCancel={() => {
                            dpSetOpen(false);
                        }}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    MainWrap: {
        overflow: "hidden",
        zIndex: 2,
        backgroundColor: "#ffffff",
    },
    InputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginTop: 12,
    },
});

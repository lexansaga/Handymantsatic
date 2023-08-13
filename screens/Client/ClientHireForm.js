import React, { useState } from "react";
import { View, ScrollView, Text, Image, StyleSheet } from "react-native";
import Header from "../../components/Header";
import ClientHome, { ClientServiceFeed } from "./ClientHome";
import Input from "../../components/Input";
import style from "../../styles/style";

import DatePicker from "react-native-date-picker";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import PrimaryButton from "../../components/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { PriceFormat } from "../Utils";
export default function ClientHireForm({ navigation, route }) {
    // const [name, contact, date, time, location] = useState("");
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [dpOpen, dpSetOpen] = useState(false);
    const [dpDate, dpSetDate] = useState(new Date());
    const { UID, Name, Email, Type } = route.params;
    const {
        Active,
        Category,
        Description,
        ID,
        Location,
        ClientName,
        PostedBy,
        Price,
        ServiceNeed,
        UserID,
        Profile,
    } = route.params.JobInfo;
    // console.log(route.params);
    const sideNavigation = useNavigation();
    // setName(Name)
    return (
        <View style={{ paddingBottom: 120 }}>
            <Header />
            <ScrollView automaticallyAdjustContentInsets={true}>
                <Image source={{ uri: Profile }} style={styles.CoverImage} />
                <View style={styles.MainWrap}>
                    <ClientServiceFeed
                        image={null}
                        style={style.Info}
                        service={Category}
                        name={ClientName}
                        price={PriceFormat(Price)}
                    />

                    <View style={style.Section}>
                        <Text style={style.SectionTitle}>Book Now!</Text>
                        <View style={styles.InputGroup}>
                            <Input
                                style={styles.Input}
                                placeholder={"Name"}
                                value={name}
                                onChangeText={name}
                                icon="user"
                                isPassword={false}
                            />

                            <Input
                                style={styles.Input}
                                placeholder={"Contact"}
                                value={contact}
                                onChangeText={contact}
                                icon="phone"
                                isPassword={false}
                            />

                            <Input
                                style={styles.Input}
                                placeholder={"Date"}
                                value={date}
                                onChangeText={date}
                                icon="calendar"
                                isPassword={false}
                                onPress={() => dpSetOpen(true)}
                            />

                            <Input
                                style={styles.Input}
                                placeholder={"Time"}
                                value={time}
                                onChangeText={time}
                                icon="clock"
                                isPassword={false}
                                onPress={() => dpSetOpen(true)}
                            />
                            <Input
                                multiline={true}
                                style={styles.Input}
                                placeholder={"Location"}
                                value={location}
                                onChangeText={location}
                                icon="map-pin"
                                isPassword={false}
                                onPress={() => dpSetOpen(true)}
                            />
                        </View>
                    </View>

                    <View style={style.Section}>
                        <PrimaryButton
                            title={"Hire John!"}
                            onPress={() => {
                                navigation.navigate("ClientSuccessBook", {
                                    key: "value",
                                });
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
    InputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginTop: 12,
        marginLeft: -12,
    },
});

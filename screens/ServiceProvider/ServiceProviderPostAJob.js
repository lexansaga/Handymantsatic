import React, { useState } from "react";
import { View, ScrollView, Text, Image, StyleSheet } from "react-native";
import Header from "../../components/Header";
import Input from "../../components/Input";
import style from "../../styles/style";

import DatePicker from "react-native-date-picker";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import PrimaryButton from "../../components/PrimaryButton";
import { AppTitle } from "../../components/General";

export default function ServiceProviderPostAJob({ navigation, route }) {
    const [
        type,
        setType,
        description,
        setDescription,
        price,
        setPrice,
        location,
        setLocation,
    ] = useState("");
    const [dpOpen, dpSetOpen] = useState(false);
    const [dpDate, dpSetDate] = useState(new Date());

    return (
        <View style={{ paddingBottom: 120 }}>
            <Header />
            <ScrollView automaticallyAdjustContentInsets={true}>
                <View style={[styles.MainWrap]}>
                    <AppTitle title={"Post A Job"} hasContact={false} />
                    <View style={style.Section}>
                        <Text style={style.SectionTitle}>Book Now!</Text>
                        <View style={styles.InputGroup}>
                            <Input
                                style={styles.Input}
                                placeholder={"Service Type"}
                                value={type}
                                onChangeText={setType}
                                icon="target"
                                isPassword={false}
                            />

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
                                navigation.navigate("ServiceProviderHome", {
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

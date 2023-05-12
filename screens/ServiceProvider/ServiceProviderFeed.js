import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Header from "../../components/Header";
import { ClientFeed } from "../ServiceProvider/ServiceProviderHome";
import styles from "../../styles/style";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";

export default function ServiceProviderFeeds({ navigation }) {
    const [email, setEmail, password, setPassword] = useState("");

    return (
        <View style={{ paddingBottom: 120 }}>
            <StatusBar style="auto" />
            <Header />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* ClientServiceFeed - Start */}
                <View style={style.ServiceFeedWrap}>
                    <ClientFeed
                        name={"John Does"}
                        whatlooking={"Plumber"}
                        description={
                            "Lorem ipsum sit amet Lorem ipsum sit amet Lorem ipsum sit amet..."
                        }
                        onpress={() => {
                            navigation.navigate("ServiceProviderPostView", {
                                key: "value",
                            });
                        }}
                    />
                    <ClientFeed
                        name={"John Doe"}
                        whatlooking={"Plumber"}
                        description={"Lorem ipsum sit amet..."}
                    />
                    <ClientFeed
                        name={"John Doe"}
                        whatlooking={"Plumber"}
                        description={"Lorem ipsum sit amet..."}
                    />
                    <ClientFeed
                        name={"John Doe"}
                        whatlooking={"Plumber"}
                        description={"Lorem ipsum sit amet..."}
                    />
                    <ClientFeed
                        name={"John Doe"}
                        whatlooking={"Plumber"}
                        description={"Lorem ipsum sit amet..."}
                    />
                    <ClientFeed
                        name={"John Doe"}
                        whatlooking={"Plumber"}
                        description={"Lorem ipsum sit amet..."}
                    />
                </View>
                {/* ClientServiceFeed - End */}
            </ScrollView>
        </View>
    );
}

const style = StyleSheet.create({
    ServiceFeedWrap: {
        marginTop: 20,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "92%",
        alignSelf: "center",
    },
});

import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    Image,
    View,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { vw, vh, vmin, vmax } from "react-native-expo-viewport-units";
import Header from "../../components/Header";
import PrimaryButton from "../../components/PrimaryButton";
import { Feather } from "@expo/vector-icons";
import styles from "../../styles/style";
import { AppTitle } from "../../components/General";

export default function ServiceProviderPostView({ navigation }) {
    const [email, setEmail, password, setPassword] = useState("");

    return (
        <View style={{ paddingBottom: 120 }}>
            <StatusBar style="auto" />
            <Header />

            <ScrollView showsVerticalScrollIndicator={false}>
                <AppTitle
                    title={"Jane Mitchell"}
                    hasContact={true}
                    dialNo={12345678901}
                />

                <View style={styles.Section}>
                    <View style={style.Infogroup}>
                        <Text style={styles.SectionTitle}>Is Looking For?</Text>
                        <Text style={style.Answer}>PLUMBER</Text>
                    </View>
                    <View style={style.Infogroup}>
                        <Text style={styles.SectionTitle}>TASK</Text>
                        <Text style={style.Answer}>
                            I need help to unclogged my pipe and clean my
                            toilet.
                        </Text>
                    </View>

                    <View style={style.Infogroup}>
                        <Text style={styles.SectionTitle}>Est. Budget</Text>
                        <Text style={style.Answer}>500PHP - 2000PHP</Text>
                    </View>

                    <View style={style.Infogroup}>
                        <Text style={styles.SectionTitle}>Location</Text>
                        <Text style={style.Answer}>
                            Robert Robertson, 1234 NW Bobcat Lane, St. Robert,
                            MO 65584-5678
                        </Text>
                    </View>

                    <PrimaryButton
                        title={"Take Job"}
                        style={style.BtnTakeJob}
                        onPress={() => {
                            navigation.navigate("ClientSuccessBook"),
                                {
                                    key: "value",
                                };
                        }}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const style = StyleSheet.create({
    Infogroup: {
        marginBottom: 28,
    },
    Answer: {
        fontSize: 18,
        fontStyle: "italic",
        textTransform: "capitalize",
    },
});

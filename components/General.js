import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export const AppTitle = ({ title, hasContact, dialNo }) => {
    return (
        <View style={style.HeaderTitle}>
            <Text style={hasContact ? style.Title : style.NoIconTitle}>
                {title}
            </Text>
            <View
                style={
                    hasContact
                        ? style.KeepInTouchIconWrap
                        : {
                              display: "none",
                          }
                }
            >
                <TouchableOpacity>
                    <Feather
                        name={"phone-call"}
                        size={25}
                        color="#fff"
                        style={style.KeepInTouchIcon}
                        onPress={() => {
                            this.dialCall(dialNo);
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Feather
                        name={"message-circle"}
                        size={25}
                        color="#fff"
                        style={style.KeepInTouchIcon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    HeaderTitle: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 28,
        paddingVertical: 18,
        backgroundColor: "#FF9D38",
        marginTop: 8,
    },
    Title: {
        fontSize: 18,
        fontWeight: 500,
        color: "#fff",
        textTransform: "uppercase",
    },
    NoIconTitle: {
        fontSize: 18,
        fontWeight: 500,
        color: "#fff",
        width: "100%",
        textAlign: "center",
        textTransform: "uppercase",
    },
    KeepInTouchIconWrap: {
        display: "flex",
        flexDirection: "row",
        gap: 22,
    },
});

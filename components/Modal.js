import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { Feather } from "@expo/vector-icons";

export default function Modal({ content, isShown }) {
    const [ShowModal, setShowModal] = useState(isShown);

    console.log(`Open ${ShowModal}`);
    useEffect(() => {
        setShowModal(isShown);
    }, []);
    return (
        <View style={ShowModal == false ? { display: "none" } : style.Modal}>
            <View style={style.ModalBody}>
                <TouchableOpacity
                    onPress={() => {
                        setShowModal(false);
                        console.log(`Close ${ShowModal}`);
                    }}
                    style={style.ModalClose}
                >
                    <Feather name="x" size={25} color="#fff" />
                </TouchableOpacity>
                <View style={style.ModalContent}>{content}</View>
            </View>
        </View>
    );
}
const style = StyleSheet.create({
    Modal: {
        position: "absolute",
        top: 0,
        left: 0,
        height: vh(100),
        width: vw(100),
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 99999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    ModalBody: {
        height: "90%",
        width: "80%",
        maxHeight: 800,
        position: "absolute",
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    ModalContent: {
        height: "100%",
        width: "100%",
        overflow: "scroll",
    },

    ModalClose: {
        height: 50,
        width: 50,
        position: "absolute",
        top: -15,
        left: -15,
        backgroundColor: "#7EB58D",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
    },
});

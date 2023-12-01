import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { Feather } from "@expo/vector-icons";

const CustomModal = ({ visible, closeModal, modalContent }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={closeModal}
        >
            <View style={styles.Modal}>
                <View style={styles.ModalBody}>
                    <View style={styles.ModalContent}>{modalContent}</View>
                    <TouchableOpacity
                        onPress={closeModal}
                        style={styles.ModalClose}
                    >
                        <Feather name="x" size={25} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        marginBottom: 20,
        fontSize: 18,
    },
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
        display: "flex",
        flex: 1,
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
        display: "flex",
        flex: 1,
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

export default CustomModal;

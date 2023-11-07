import React from "react";
import { Alert } from "react-native";

const AppAlert = ({ title, message, textYes, textNo, onYes, onNo }) => {
    const handleConfirmation = () => {
        Alert.alert(
            title || "Confirmation",
            message || "Do you want to perform this action?",
            [
                {
                    text: textNo ? textNo : "No",
                    onPress: () => {
                        onNo && onNo();
                    },
                    style: "cancel",
                },
                {
                    text: textYes ? textYes : "Yes",
                    onPress: () => {
                        onYes && onYes();
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return handleConfirmation;
};

export default AppAlert;

import React from "react";
import { View, Text, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "../styles/style.js";
import { IsNullOrEmpty } from "../screens/Utils.js";

const Input = ({
    placeholder,
    value,
    multiline,
    numberOfLines,
    onChangeText,
    onPress,
    icon,
    keyboardType,
    isPassword,
    isSearch,
    isNumberOnly,
    onSubmitEditing,
    style,
}) => {
    return (
        <View
            style={
                IsNullOrEmpty(multiline)
                    ? [styles.inputContainer, { height: 50, maxHeight: 50 }]
                    : [styles.inputContainer]
            }
        >
            {icon && (
                <Feather
                    name={icon}
                    size={20}
                    color="#000"
                    style={styles.inputIcon}
                />
            )}
            <TextInput
                style={
                    isSearch
                        ? styles.inputSearch
                        : [
                              styles.input,
                              multiline
                                  ? {
                                        position: "relative",
                                        height: 100,
                                        verticalAlign: "top",
                                        paddingTop: 12,
                                        maxHeight: 100,
                                    }
                                  : {},
                          ]
                }
                secureTextEntry={isPassword}
                placeholder={placeholder}
                value={value}
                onChangeText={
                    isNumberOnly
                        ? (text) => setMyNumber(text?.replace(/[^0-9]/g, ""))
                        : onChangeText
                }
                keyboardType={keyboardType}
                onPress={onPress}
                multiline={multiline}
                onSubmitEditing={onSubmitEditing}
            />
        </View>
    );
};

export default Input;

import React from "react";
import { View, Text, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "../styles/style.js";

const Input = ({
    placeholder,
    value,
    multiline,
    onChangeText,
    onPress,
    icon,
    keyboardType,
    isPassword,
    isSearch,
    isNumberOnly,
}) => {
    return (
        <View style={styles.inputContainer}>
            {icon && (
                <Feather
                    name={icon}
                    size={20}
                    color="#000"
                    style={styles.inputIcon}
                />
            )}
            <TextInput
                style={isSearch ? styles.inputSearch : styles.input}
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
            />
        </View>
    );
};

export default Input;

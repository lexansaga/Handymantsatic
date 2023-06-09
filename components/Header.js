import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import Input from "./Input";
import { Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
export default function Header({ navigation, route }) {
    const sideNavigation = useNavigation();
    const [search, setSearch] = useState("");
    const [hasNotif] = useState(false);
    const [hasMessage] = useState(false);
    return (
        <View style={styles.HeaderContainer}>
            <TouchableOpacity onPress={() => sideNavigation.openDrawer()}>
                <Feather
                    name="menu"
                    size={25}
                    color="#000"
                    style={styles.Navbutton}
                />
            </TouchableOpacity>
            <Input
                style={{
                    borderRadius: 18,
                    padding: 0,
                    backgroundColor: "red",
                }}
                placeholder="Search"
                value={search}
                onChangeText={setSearch}
                isSearch={true}
            />
            <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
                <TouchableOpacity>
                    <Feather
                        name="send"
                        size={23}
                        color={hasMessage ? "#7EB58D" : "#000"}
                        style={styles.Navbutton}
                        onPress={() => {
                            sideNavigation.navigate("Chat", { key: "value" });
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Feather
                        name="bell"
                        size={25}
                        color={hasNotif ? "#7EB58D" : "#000"}
                        style={styles.Navbutton}
                    />
                </TouchableOpacity>
                <Avatar
                    rounded
                    title="Profile"
                    source={{
                        uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png",
                    }}
                    containerStyle={{ height: 30, width: 30 }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    HeaderContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 48,
        paddingHorizontal: 18,
        gap: 8,
    },
    Avatar: {
        height: 50,
    },
});

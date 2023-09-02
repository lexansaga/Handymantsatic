import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import TaskActive from "./TaskActive";
function CompletedTaskScreen() {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text>Completed!</Text>
        </View>
    );
}

function CancelledTaskScreen() {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text>Cancelled!</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();

export default function TaskScreen() {
    return (
        <NavigationContainer independent={true}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === "Active") {
                            iconName = focused ? "activity" : "activity";
                        } else if (route.name === "Completed") {
                            iconName = focused
                                ? "check-circle"
                                : "check-circle";
                        } else if (route.name === "Cancelled") {
                            iconName = focused ? "x-square" : "x-square";
                        }

                        // You can return any component that you like here!
                        return (
                            <Feather name={iconName} size={18} color={color} />
                        );
                    },
                    tabBarActiveTintColor: "#FF9D38",
                    tabBarInactiveTintColor: "gray",
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Completed" component={CompletedTaskScreen} />

                <Tab.Screen name="Active" component={TaskActive} />
                <Tab.Screen name="Cancelled" component={CancelledTaskScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const style = StyleSheet.create({
    LandingContainer: {
        minHeight: 200,
        display: "flex",
        gap: 12,
        paddingHorizontal: 18,
        paddingVertical: 20,
        paddingBottom: 120,
        justifyContent: "center",
        overflow: "visible",
        marginTop: 8,
    },
    taskItem: {
        backgroundColor: "#EEEEE4",
        borderRadius: 8,
    },
    taskID: {
        paddingVertical: 8,

        paddingHorizontal: 8,
        fontWeight: 500,
        textTransform: "uppercase",
        fontSize: 18,
        textAlign: "center",
        backgroundColor: "#7EB58D",
        color: "#fff",
        borderRadius: 8,
        marginBottom: 10,
    },
    btnActionWrap: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
        marginTop: 15,
        paddingBottom: 18,
        paddingHorizontal: 18,
    },
    forViewBtnActionWrap: {
        display: "none",
    },
});

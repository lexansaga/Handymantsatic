import * as React from "react";

import Header from "./components/Header";
import Home from "./screens/Home";
import Signin from "./screens/Signin";
import Signup from "./screens/Signup";
import ForgotPassword from "./screens/ForgotPassword";
import OneTimePin from "./screens/OneTimePin";

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const sideNavigation = useNavigation;
export default function App({ route }) {
    var isLoggedIn = true;
    return (
        <NavigationContainer independent={true}>
            <View style={style.watermark}>
                <Text style={style.watermarkText}>
                    This Project is Created by Alexander Saga
                </Text>
            </View>

            {/* <MainStack /> */}
            <Drawer.Navigator>
                {/* This screen can be accessible even if when user is not authenticated */}
                <Drawer.Screen
                    name="Main"
                    component={MainStack}
                    options={{ header: () => null }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

const MainStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                headerStyle: {
                    backgroundColor: "#ffffff",
                },
                cardStyle: { backgroundColor: "#fff" },
                contentStyle: {
                    backgroundColor: "#FFFFFF",
                },
            }}
        >
            <Stack.Screen
                name="Signin"
                component={Signin}
                options={{
                    title: "Signin",
                    header: () => {
                        null;
                    },
                }}
            />
            <Stack.Screen
                name="Signup"
                component={Signup}
                options={{ title: "Signup" }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{ title: "ForgotPassword" }}
            />
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ title: "Home" }}
            />
            <Stack.Screen
                name="OneTimePin"
                component={OneTimePin}
                options={{
                    title: "OneTimePin",
                    header: () => {
                        null;
                    },
                }}
            />
        </Stack.Navigator>
    );
};

const style = StyleSheet.create({
    watermark: {
        position: "absolute",
        pointerEvents: "none",
        bottom: 0,
        left: 0,
        zIndex: 1,
        height: "10%",
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        verticalAlign: "middle",
        paddingHorizontal: 18,
    },
    watermarkText: {
        textAlign: "center",
        color: "#fff",
        fontSize: 18,
        textTransform: "uppercase",
        fontWeight: 500,
    },
});

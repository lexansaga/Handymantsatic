import * as React from "react";

import Header from "./components/Header";
import Home from "./screens/Home";
import Signin from "./screens/Signin";
import Signup from "./screens/Signup";
import ForgotPassword from "./screens/ForgotPassword";

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
            <Text style={style.watermark}>
                This Project is Created by Alexander Saga
            </Text>
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
            initialRouteName="Signin"
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
                // options={{ title: "Signin", header: () => <Header /> }}
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
        </Stack.Navigator>
    );
};

const style = StyleSheet.create({
    watermark: {
        position: "absolute",
        pointerEvents: "none",
        bottom: 0,
        left: 0,
        zIndex: 9999,
        height: "10%",
        width: "100%",
        textAlign: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "none",
        justifyContent: "center",
        alignItems: "center",
        verticalAlign: "middle",
        color: "#fff",
        fontSize: 18,
        paddingHorizontal: 18,
        textTransform: "uppercase",
        fontWeight: 500,
    },
});

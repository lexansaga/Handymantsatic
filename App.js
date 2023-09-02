import * as React from "react";

import Header from "./components/Header";
import Home from "./screens/Home";
import Signin from "./screens/Signin";
import Signup from "./screens/Signup";
import ForgotPassword from "./screens/ForgotPassword";
import Chat from "./screens/Chat";

import Client from "./screens/Navigator/Client";
import ServiceProvider from "./screens/Navigator/ServiceProvider";

import ClientHome from "./screens/Client/ClientHome";
import ClientServiceFeeds from "./screens/Client/ClientServiceFeeds";
import ClientHireForm from "./screens/Client/ClientHireForm";
import ClientSuccessBook from "./screens/Client/ClientSuccessBook";

import ServiceProviderHome from "./screens/ServiceProvider/ServiceProviderHome";
import ServiceProviderFeeds from "./screens/ServiceProvider/ServiceProviderFeed";
import ServiceProviderPostView from "./screens/ServiceProvider/ServiceProviderPostView";
import ServiceProviderPostAJob from "./screens/ServiceProvider/ServiceProviderPostAJob";

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const sideNavigation = useNavigation;
export default function App({ route }) {
    var isLoggedIn = true;
    return (
        <NavigationContainer independent={true}>
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
            <Stack.Screen
                name="Client"
                component={Client}
                options={{ title: "Client" }}
            />
            <Stack.Screen
                name="Chat"
                component={Chat}
                options={{ title: "chat" }}
            />
        </Stack.Navigator>
    );
};

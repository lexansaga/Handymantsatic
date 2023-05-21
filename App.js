import * as React from "react";

import HomeScreen from "./screens/HomeScreen";
import Signin from "./screens/Signin";
import Signup from "./screens/Signup";
import ForgotPassword from "./screens/ForgotPassword";
import Chat from "./screens/Chat";

import ClientHome from "./screens/Client/ClientHome";
import ClientServiceFeeds from "./screens/Client/ClientServiceFeeds";
import ClientHireForm from "./screens/Client/ClientHireForm";
import ClientSuccessBook from "./screens/Client/ClientSuccessBook";

import ServiceProviderHome from "./screens/ServiceProvider/ServiceProviderHome";
import ServiceProviderFeeds from "./screens/ServiceProvider/ServiceProviderFeed";
import ServiceProviderPostView from "./screens/ServiceProvider/ServiceProviderPostView";
import ServiceProviderPostAJob from "./screens/ServiceProvider/ServiceProviderPostAJob";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export default function App() {
    return (
        <NavigationContainer independent={true}>
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
                    options={{ title: "Signin" }}
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
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{ title: "HomeScreen" }}
                />

                <Stack.Screen
                    name="Chat"
                    component={Chat}
                    options={{ title: "chat" }}
                />

                {/* Client Screens */}
                <Stack.Screen
                    name="ClientHome"
                    component={ClientHome}
                    options={{ title: "ClientHome" }}
                />
                <Stack.Screen
                    name="ClientHireForm"
                    component={ClientHireForm}
                    options={{ title: "Client Hire Form" }}
                />
                <Stack.Screen
                    name="ClientServiceFeed"
                    component={ClientServiceFeeds}
                    options={{ title: "ClientServiceFeed" }}
                />
                <Stack.Screen
                    name="ClientSuccessBook"
                    component={ClientSuccessBook}
                    options={{ title: "ClientSuccessBook" }}
                />

                {/* Service Provider Screens */}
                <Stack.Screen
                    name="ServiceProviderHome"
                    component={ServiceProviderHome}
                    options={{ title: "ServiceProviderHome" }}
                />
                <Stack.Screen
                    name="ServiceProviderFeeds"
                    component={ServiceProviderFeeds}
                    options={{ title: "ServiceProviderFeeds" }}
                />

                <Stack.Screen
                    name="ServiceProviderPostView"
                    component={ServiceProviderPostView}
                    options={{ title: "ServiceProviderPostView" }}
                />
                <Stack.Screen
                    name="ServiceProviderPostAJob"
                    component={ServiceProviderPostAJob}
                    options={{ title: "ServiceProviderPostAJob" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

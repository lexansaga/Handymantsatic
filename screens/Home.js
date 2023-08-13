import * as React from "react";

import Client from "./Navigator/Client";
import ServiceProvider from "./Navigator/ServiceProvider";

import ClientHome, { ClientServiceFeed } from "./Client/ClientHome";
import ClientServiceFeeds from "./Client/ClientServiceFeeds";
import ClientHire from "./Client/ClientHire";
import ClientHireForm from "./Client/ClientHireForm";
import ClientSuccessBook from "./Client/ClientSuccessBook";

import ServiceProviderHome from "./ServiceProvider/ServiceProviderHome";
import ServiceProviderFeeds from "./ServiceProvider/ServiceProviderFeed";
import ServiceProviderPostView from "./ServiceProvider/ServiceProviderPostView";
import ServiceProviderPostAJob from "./ServiceProvider/ServiceProviderPostAJob";

import Signin from "./Signin";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import Logout from "./Navigator/Logout";
import Chat from "./Chat";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
var globalRoute = null;
export default function Home({ navigation, route, props }) {
    //  console.log(route);
    globalRoute = route;
    const { Type } = route.params;
    const ClientType = Type.includes("Client");
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
                {ClientType ? (
                    <Stack.Screen
                        name="Client"
                        component={ClientStack}
                        initialParams={route.params}
                        options={{ header: () => null }}
                    ></Stack.Screen>
                ) : (
                    <Stack.Screen
                        name="ServiceProvider"
                        component={ServiceProviderStack}
                        initialParams={route.params}
                        options={{ header: () => null }}
                    ></Stack.Screen>
                )}

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
                    name="Chat"
                    component={Chat}
                    options={{ title: "Chat" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const ClientStack = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                overlayColor: "rgba(0,0,0,0.8)",
            }}
        >
            <Drawer.Screen
                name="Home"
                initialParams={globalRoute.params}
                component={ClientHome}
            ></Drawer.Screen>

            <Drawer.Screen
                name="Feed"
                initialParams={globalRoute.params}
                component={ClientServiceFeeds}
                options={{
                    animationTypeForReplace: "push",
                    animation: "slide_from_right",
                }}
            ></Drawer.Screen>

            <Drawer.Screen
                name="Client Hire"
                initialParams={globalRoute.params}
                component={ClientHire}
                options={{
                    drawerItemStyle: {
                        display: "none",
                    },
                }}
            ></Drawer.Screen>

            <Drawer.Screen
                name="Client Hire Form"
                initialParams={globalRoute.params}
                component={ClientHireForm}
                options={{
                    drawerItemStyle: {
                        display: "none",
                    },
                }}
            ></Drawer.Screen>

            <Drawer.Screen
                name="Client Success Book"
                initialParams={globalRoute.params}
                component={ClientSuccessBook}
                options={{
                    drawerItemStyle: {
                        display: "none",
                    },
                }}
            ></Drawer.Screen>
            <Drawer.Screen
                name="ServiceProviderPostAJob"
                initialParams={globalRoute.params}
                component={ServiceProviderPostAJob}
                options={{
                    drawerItemStyle: {
                        display: "none",
                    },
                }}
            ></Drawer.Screen>
            <Drawer.Screen name="Logout" component={Logout}></Drawer.Screen>
        </Drawer.Navigator>
    );
};

const ServiceProviderStack = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                overlayColor: "rgba(0,0,0,0.8)",
            }}
        >
            <Drawer.Screen
                name="Home"
                initialParams={globalRoute.params}
                component={ServiceProviderHome}
            ></Drawer.Screen>

            <Drawer.Screen
                name="Feed"
                initialParams={globalRoute.params}
                component={ServiceProviderFeeds}
            ></Drawer.Screen>
            <Drawer.Screen
                name="ServiceProviderPostView"
                initialParams={globalRoute.params}
                component={ServiceProviderPostView}
                options={{
                    drawerItemStyle: {
                        display: "none",
                    },
                }}
            ></Drawer.Screen>

            <Drawer.Screen
                name="ServiceProviderPostAJob"
                initialParams={globalRoute.params}
                component={ServiceProviderPostAJob}
                options={{
                    drawerItemStyle: {
                        display: "none",
                    },
                }}
            ></Drawer.Screen>

            <Drawer.Screen
                name="ClientSuccessBook"
                initialParams={globalRoute.params}
                component={ClientSuccessBook}
                options={{
                    drawerItemStyle: {
                        display: "none",
                    },
                }}
            ></Drawer.Screen>
            <Drawer.Screen name="Logout" component={Logout}></Drawer.Screen>
        </Drawer.Navigator>
    );
};

const MainStack = () => {
    return (
        <>
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
                name="ServiceProvider"
                component={ServiceProvider}
                options={{ title: "ServiceProvider" }}
            />
            <Stack.Screen
                name="Chat"
                component={Chat}
                options={{ title: "chat" }}
            />
        </>
    );
};

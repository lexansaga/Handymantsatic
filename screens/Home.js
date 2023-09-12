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
import ProfileEdit from "./ProfileEdit";

import TaskScreen from "./Task/TaskScreen";
import TaskActive from "./Task/TaskActive";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
var globalRoute = null;
export default function Home({ navigation, route, props }) {
    //  console.log(route);
    globalRoute = route;
    const { Type } = route.params;
    const ClientType = Type.includes("Client");
    console.log(Type);
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
                name="Task"
                initialParams={globalRoute.params}
                component={TaskTabbedNav}
            ></Drawer.Screen>
            <Drawer.Screen
                name="ServiceProviderPostView"
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
            <Drawer.Screen
                name="ClientHire"
                initialParams={globalRoute.params}
                component={ClientHire}
                options={{
                    drawerItemStyle: {
                        display: "none",
                    },
                }}
            ></Drawer.Screen>
            <Drawer.Screen
                name="ProfileEdit"
                initialParams={globalRoute.params}
                component={ProfileEdit}
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

const TaskTabbedNav = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Active") {
                        iconName = focused ? "activity" : "activity";
                    } else if (route.name === "Completed") {
                        iconName = focused ? "check-circle" : "check-circle";
                    } else if (route.name === "Cancelled") {
                        iconName = focused ? "x-square" : "x-square";
                    } else if (route.name === "Proposed") {
                        iconName = focused ? "coffee" : "coffee";
                    }

                    // You can return any component that you like here!
                    return <Feather name={iconName} size={18} color={color} />;
                },
                tabBarActiveTintColor: "#FF9D38",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >
            <Tab.Screen
                name="Active"
                initialParams={{ status: "Active" }}
                component={TaskActive}
            />
            <Tab.Screen
                name="Completed"
                initialParams={{ status: "Completed" }}
                component={TaskActive}
            />
            <Tab.Screen
                name="Cancelled"
                initialParams={{ status: "Cancelled" }}
                component={TaskActive}
            />
            <Tab.Screen
                name="Proposed"
                initialParams={{ status: "Proposed" }}
                component={TaskActive}
            />
        </Tab.Navigator>
    );
};

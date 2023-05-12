import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ClientHome from "./Client/ClientHome";
import ClientServiceFeeds from "./Client/ClientServiceFeeds";
import ClientHire from "./Client/ClientHire";
import ServiceProviderHome from "./ServiceProvider/ServiceProviderHome";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
export default function HomeScreen({ navigation, route, props }) {
    const { type } = route.params;

    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                overlayColor: "rgba(0,0,0,0.8)",
            }}
        >
            <Drawer.Screen
                name="Home"
                component={
                    type.includes("client") ? ClientHome : ServiceProviderHome
                }
            ></Drawer.Screen>

            <Drawer.Screen
                name="Client Service Feed"
                component={ClientServiceFeeds}
            ></Drawer.Screen>

            <Drawer.Screen
                name="Client Hire"
                component={ClientHire}
            ></Drawer.Screen>
        </Drawer.Navigator>
    );
}

import "react-native-gesture-handler";

import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ClientHome from "../Client/ClientHome";
import ClientServiceFeeds from "../Client/ClientServiceFeeds";
import ClientHire from "../Client/ClientHire";
import ClientHireForm from "../Client/ClientHireForm";
import ClientSuccessBook from "../Client/ClientSuccessBook";
import ServiceProviderHome from "../ServiceProvider/ServiceProviderHome";
import Logout from "./Logout";
const Drawer = createDrawerNavigator();
export default function ServiceProvider({ navigation, route, props }) {
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
                component={ServiceProviderHome}
            ></Drawer.Screen>

            <Drawer.Screen
                name="Feed"
                component={ClientServiceFeeds}
            ></Drawer.Screen>
            <Drawer.Screen name="Logout" component={Logout}></Drawer.Screen>
        </Drawer.Navigator>
    );
}

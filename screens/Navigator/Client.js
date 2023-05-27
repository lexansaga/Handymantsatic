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

const Drawer = createDrawerNavigator();
export default function Client({ navigation, route, props }) {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                overlayColor: "rgba(0,0,0,0.8)",
            }}
        >
            <Drawer.Screen name="Home" component={ClientHome}></Drawer.Screen>

            <Drawer.Screen
                name="Client Service Feed"
                component={ClientServiceFeeds}
            ></Drawer.Screen>

            <Drawer.Screen
                name="Client Hire"
                component={ClientHire}
            ></Drawer.Screen>

            <Drawer.Screen
                name="Client Hire Form"
                component={ClientHireForm}
            ></Drawer.Screen>

            <Drawer.Screen
                name="Client Success Book"
                component={ClientSuccessBook}
            ></Drawer.Screen>
        </Drawer.Navigator>
    );
}

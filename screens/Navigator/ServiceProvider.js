import "react-native-gesture-handler";

import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ClientHome from "../Client/ClientHome";
import ClientServiceFeeds from "../Client/ClientServiceFeeds";
import ClientHire from "../Client/ClientHire";
import ClientHireForm from "../Client/ClientHireForm";
import ClientSuccessBook from "../Client/ClientSuccessBook";
import ServiceProviderPostView from "../ServiceProvider/ServiceProviderPostView";
import ServiceProviderHome from "../ServiceProvider/ServiceProviderHome";
import Logout from "./Logout";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();
export default function ServiceProvider({ navigation, route, props }) {
    const { type } = route.params;

    const { UID, Name, Email, Type } = route.params;
    console.log(route);
    return (
        <NavigationContainer independent={true}>
            <Drawer.Navigator
                screenOptions={{
                    headerShown: false,
                    overlayColor: "rgba(0,0,0,0.8)",
                }}
            >
                <Drawer.Screen
                    name="Home"
                    initialParams={route.params}
                    component={ServiceProviderHome}
                ></Drawer.Screen>

                <Drawer.Screen
                    name="Feed"
                    initialParams={route.params}
                    component={ClientServiceFeeds}
                ></Drawer.Screen>
                <Drawer.Screen name="Logout" component={Logout}></Drawer.Screen>
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

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
import { Stacks } from "../../App";
const Drawer = createDrawerNavigator();
export default function Client({ navigation, route, props }) {
    const { UID, Name, Email, Type } = route.params;
    // console.log(route);
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                overlayColor: "rgba(0,0,0,0.8)",
            }}
        >
            <Drawer.Screen
                name="Home"
                initialParams={route.params}
                component={ClientHome}
            ></Drawer.Screen>

            <Drawer.Screen
                name="Feed"
                initialParams={route.params}
                component={ClientServiceFeeds}
                options={{
                    animationTypeForReplace: "push",
                    animation: "slide_from_right",
                }}
            ></Drawer.Screen>

            <Drawer.Screen
                name="Client Hire"
                initialParams={route.params}
                component={ClientHire}
                options={{
                    drawerItemStyle: {
                        display: "none",
                    },
                }}
            ></Drawer.Screen>

            <Drawer.Screen
                name="Client Hire Form"
                initialParams={route.params}
                component={ClientHireForm}
                options={{
                    drawerItemStyle: {
                        display: "none",
                    },
                }}
            ></Drawer.Screen>

            <Drawer.Screen
                name="Client Success Book"
                initialParams={route.params}
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
}

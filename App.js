import * as React from "react";
import Signin from "./screens/Signin";
import Signup from "./screens/Signup";
import ForgotPassword from "./screens/ForgotPassword";
import ClientHome from "./screens/Client/ClientHome";
import ClientServiceFeeds from "./screens/Client/ClientServiceFeeds";
import HomeScreen from "./screens/HomeScreen";
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
                    name="ClientHome"
                    component={ClientHome}
                    options={{ title: "ClientHome" }}
                />

                <Stack.Screen
                    name="ClientServiceFeed"
                    component={ClientServiceFeeds}
                    options={{ title: "ClientServiceFeed" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

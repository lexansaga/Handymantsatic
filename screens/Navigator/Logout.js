import React from "react";
import { auth, signOut } from "../../config/firebase.config";

export default function Logout({ navigation }) {
    signOut(auth)
        .then(() => {
            navigation.replace("Signin", {
                key: "value",
            });
        })
        .catch((error) => {
            // An error happened.
            console.error(error);
        });
}

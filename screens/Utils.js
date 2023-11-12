import { useState } from "react";
import { push, update, ref, database } from "../config/firebase.config";
import axios from "axios";
import { Platform } from "react-native";
import { Linking } from "react-native";

const DefaultProfile =
    "https://firebasestorage.googleapis.com/v0/b/handymantastic-80f66.appspot.com/o/Assets%2FProfile%2Fdefault-profile.jpg?alt=media&token=efe7ad46-1b02-464c-9a88-35a99009f263";

function PriceFormat(price) {
    return `₱${price}`;
}

function IsNullOrEmpty(value) {
    return value === null || value === undefined || value === "";
}
function IsNullOrEmptyFallback(value, fallback) {
    return value === null || value === undefined || value === ""
        ? fallback
        : value;
}

function IDFormat(value) {
    value = value ? value : "";
    return "#" + value.replace(/[^a-zA-Z]/g, "").slice(-6);
}

async function PushNotification(uid, title, message, forWho) {
    var save = await push(
        ref(
            database,
            `Notification/${IsNullOrEmpty(uid) ? `General` : `${uid}`}/`
        ),
        {
            Title: title,
            Message: message,
            forWho: IsNullOrEmpty(forWho) ? "" : forWho,
            IsRead: false,
        }
    );
    var saveKey = save.key;
    await update(
        ref(
            database,
            `Notification/${
                IsNullOrEmpty(uid) ? `General/${saveKey}` : `${uid}/${saveKey}`
            }/`
        ),
        {
            ID: saveKey,
        }
    );
}

function NumberFormat(phoneNumber) {
    if (IsNullOrEmpty(phoneNumber)) return false;
    // Remove any non-numeric characters from the input
    const numericPhoneNumber = phoneNumber.replace(/\D/g, "");

    // Check if the numericPhoneNumber has a valid length (10 digits)
    if (numericPhoneNumber.length === 10) {
        // Format the number as +639 12 345 6789
        return `+639 ${numericPhoneNumber.substring(
            1,
            3
        )} ${numericPhoneNumber.substring(3, 6)} ${numericPhoneNumber.substring(
            6
        )}`;
    } else {
        // If the input is not a valid phone number, return an error message or handle it as needed
        return false;
    }
}
function NumberFormatNotFormatted(phoneNumber) {
    return IsNullOrEmptyFallback(phoneNumber, "")
        .replaceAll("+63", "")
        .replaceAll(" ", "");
}
const IsTextEmpty = (text) => {
    return !text || text.trim().length === 0;
};
const IsTextEmptyFallback = (text, fallback) => {
    return IsNullOrEmpty(text) ? fallback : text;
};
const useBeforeRender = (callback, deps) => {
    const [isRun, setIsRun] = useState(false);

    if (!isRun) {
        callback();
        setIsRun(true);
    }
};

const GetDataAxios = async (path) => {
    const url = path;
    const response = await axios.get(url);
    return response.data;
};

const DialCall = (number) => {
    let phoneNumber = "";
    if (Platform.OS === "android") {
        phoneNumber = `tel:${number}`;
    } else {
        phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
};
const SendMessage = (phoneNumber, message) => {
    let url = `sms:${phoneNumber}${
        Platform.OS === "ios" ? "&" : "?"
    }body=${message}`;

    Linking.openURL(url);
};
export {
    DefaultProfile,
    PriceFormat,
    IsNullOrEmpty,
    IDFormat,
    NumberFormat,
    NumberFormatNotFormatted,
    IsTextEmpty,
    PushNotification,
    useBeforeRender,
    IsTextEmptyFallback,
    IsNullOrEmptyFallback,
    GetDataAxios,
    DialCall,
    SendMessage,
};

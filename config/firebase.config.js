// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    snapshotEqual,
} from "firebase/firestore";
import {
    getDatabase,
    ref,
    child,
    get,
    set,
    push,
    update,
    onValue,
    orderBy,
} from "firebase/database";
import { getStorage, uploadBytes } from "firebase/storage";
import { useState } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyAxLA8mZ8qkgkbcC0UosT178xLKGvTGwBA",
    authDomain: "handymantastic-80f66.firebaseapp.com",
    projectId: "handymantastic-80f66",
    storageBucket: "handymantastic-80f66.appspot.com",
    messagingSenderId: "523036321778",
    appId: "1:523036321778:web:5fdc9c5d82c5f8778ead6b",
    measurementId: "G-3E9E09B653",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth();
const database = getDatabase();
const databaseRef = ref(database);
const storage = getStorage();

async function getDataOnce(path) {
    var data = {};
    onValue(
        ref(database, path),
        (snapshot) => {
            data = { ...snapshot.val() };
            // console.log(data);
        },
        {
            onlyOnce: true,
        }
    );
    return data;
}
async function UserInfo() {
    const currentUserUID = auth.currentUser.uid;
    // console.error(currentUserUID);
    return await get(child(databaseRef, `Users/${currentUserUID}/`)).then(
        (snapshot) => {
            // console.log(snapshot.val());
            // setUserInfo(snapshot.val());
            return snapshot.val();
        }
    );
}

export {
    app,
    auth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    firestore,
    doc,
    getDoc,
    setDoc,
    database,
    databaseRef,
    child,
    onValue,
    ref,
    get,
    set,
    push,
    update,
    orderBy,
    getDataOnce,
    UserInfo,
    storage,
};

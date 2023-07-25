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
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import {
    getDatabase,
    ref,
    child,
    get,
    set,
    push,
    update,
} from "firebase/database";
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
const auth = getAuth(app);
const database = getDatabase();
const databaseRef = ref(database);
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
    ref,
    get,
    set,
    push,
    update,
};

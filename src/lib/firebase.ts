// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// =================================================================================
// TODO: Reemplaza este objeto con la configuración de tu propio proyecto de Firebase.
// Puedes encontrarla en la consola de Firebase:
// Configuración del proyecto > Tus apps > Configuración del SDK de Firebase > Config
// =================================================================================
const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyCW8UwbQ0-6zf-GLktC741xpVS-T3AL__E",
    authDomain: "resto-flow-app.firebaseapp.com",
    projectId: "resto-flow-app",
    storageBucket: "resto-flow-app.firebasestorage.app",
    messagingSenderId: "115823499590",
    appId: "1:115823499590:web:bbb401f9e64c1d323b6d47",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };

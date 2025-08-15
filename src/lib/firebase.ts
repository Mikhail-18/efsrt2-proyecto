// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// =================================================================================
// TODO: Reemplaza este objeto con la configuración de tu propio proyecto de Firebase.
// Puedes encontrarla en la consola de Firebase:
// Configuración del proyecto > Tus apps > Configuración del SDK de Firebase > Config
// =================================================================================
const firebaseConfig: FirebaseOptions = {
    apiKey: "AQUÍ_VA_TU_API_KEY",
    authDomain: "AQUÍ_VA_TU_AUTH_DOMAIN",
    projectId: "AQUÍ_VA_TU_PROJECT_ID",
    storageBucket: "AQUÍ_VA_TU_STORAGE_BUCKET",
    messagingSenderId: "AQUÍ_VA_TU_MESSAGING_SENDER_ID",
    appId: "AQUÍ_VA_TU_APP_ID",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };

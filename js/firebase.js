import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    initializeAppCheck,
    ReCaptchaV3Provider
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app-check.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-storage.js";

const firebaseConfig = {

    apiKey: "ТВОЙ_API_KEY",

    authDomain: "telegolub-app.firebaseapp.com",

    projectId: "telegolub-app",

    storageBucket: "telegolub-app.firebasestorage.app",

    messagingSenderId: "ТВОЙ_SENDER_ID",

    appId: "ТВОЙ_APP_ID"

};

const app = initializeApp(firebaseConfig);

/*
==========================================
App Check
==========================================
*/

initializeAppCheck(app, {

    provider: new ReCaptchaV3Provider(

        "ТВОЙ_SITE_KEY_RECAPTCHA"

    ),

    isTokenAutoRefreshEnabled: true

});

/*
==========================================
Firebase Services
==========================================
*/

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

export default app;

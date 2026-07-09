import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

/*
==========================================
Создание скрытого email
==========================================
*/

function usernameToEmail(username){

    return username.toLowerCase()+"@telegolub.app";

}

/*
==========================================
Проверка юзернейма
==========================================
*/

async function usernameExists(username){

    const q=query(

        collection(db,"users"),

        where("usernameLower","==",username.toLowerCase())

    );

    const snap=await getDocs(q);

    return !snap.empty;

}

/*
==========================================
Регистрация
==========================================
*/

window.register = async function(){

    const username=document
    .getElementById("registerUsername")
    .value
    .trim();

    const displayName=document
    .getElementById("registerName")
    .value
    .trim();

    const password=document
    .getElementById("registerPassword")
    .value;

    if(displayName.length<2){

        alert("Введите имя");

        return;

    }

    if(password.length<6){

        alert("Пароль минимум 6 символов");

        return;

    }

    const usernameRegex=/^[a-zA-Z0-9_]{4,32}$/;

    if(!usernameRegex.test(username)){

        alert("Юзернейм может содержать только буквы, цифры и _");

        return;

    }

    const reserved=[

        "admin",
        "telegram",
        "support",
        "system",
        "owner",
        "moderator",
        "root",
        "api",
        "null",
        "undefined",
        "settings",
        "profile",
        "login",
        "register",
        "me"

    ];

    if(reserved.includes(username.toLowerCase())){

        alert("Этот юзернейм недоступен");

        return;

    }

    if(await usernameExists(username)){

        alert("Юзернейм уже занят");

        return;

    }

    const email=usernameToEmail(username);

    const result=await createUserWithEmailAndPassword(

        auth,

        email,

        password

    );

    await setDoc(

        doc(db,"users",result.user.uid),

        {

            uid:result.user.uid,

            username:username,

            usernameLower:username.toLowerCase(),

            displayName:displayName,

            avatar:"",

            bio:"",

            premium:false,

            verified:false,

            coins:0,

            online:true,

            lastSeen:serverTimestamp(),

            createdAt:serverTimestamp()

        }

    );

    alert("Добро пожаловать в TeleGolub!");

}

/*
==========================================
Вход
==========================================
*/

window.login=async function(){

    const username=document

    .getElementById("loginUsername")

    .value

    .trim();

    const password=document

    .getElementById("loginPassword")

    .value;

    const email=usernameToEmail(username);

    await signInWithEmailAndPassword(

        auth,

        email,

        password

    );

}

/*
==========================================
Выход
==========================================
*/

window.logout=function(){

    signOut(auth);

}

/*
==========================================
Проверка входа
==========================================
*/

onAuthStateChanged(

    auth,

    async(user)=>{

        if(!user){

            location.href="login.html";

            return;

        }

        const snap=

        await getDoc(

            doc(db,"users",user.uid)

        );

        if(!snap.exists()) return;

        window.currentUser=snap.data();

    }

);

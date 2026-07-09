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

window.register=async function(){

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

    if(username.length<4){

        alert("Минимум 4 символа");

        return;

    }

    if(await usernameExists(username)){

        alert("Этот юзернейм уже занят");

        return;

    }

    const email=usernameToEmail(username);

    const result=

    await createUserWithEmailAndPassword(

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

            bio:"",

            avatar:"",

            online:true,

            verified:false,

            premium:false,

            coins:0,

            createdAt:serverTimestamp()

        }

    );

    alert("Аккаунт создан!");

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

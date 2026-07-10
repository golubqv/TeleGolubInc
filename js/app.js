import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

/*
==================================================
TeleGolub Application
==================================================
*/

window.TeleGolub = {

    user:null,

    initialized:false

};

/*
==================================================
Инициализация
==================================================
*/

async function init(){

    if(TeleGolub.initialized) return;

    TeleGolub.initialized=true;

    bindUI();

    console.log("TeleGolub started");

}

/*
==================================================
Элементы интерфейса
==================================================
*/

function bindUI(){

    const menu=document.querySelector(".menu");

    if(menu){

        menu.onclick=toggleSidebar;

    }

    const emoji=document.getElementById("emojiBtn");

    if(emoji){

        emoji.onclick=toggleEmoji;

    }

    const attach=document.getElementById("attachBtn");

    if(attach){

        attach.onclick=openFilePicker;

    }

    const voice=document.getElementById("voiceBtn");

    if(voice){

        voice.onclick=startVoiceRecording;

    }

}

/*
==================================================
Sidebar
==================================================
*/

function toggleSidebar(){

    document

        .querySelector(".sidebar")

        ?.classList.toggle("open");

}

/*
==================================================
Emoji
==================================================
*/

function toggleEmoji(){

    document

        .querySelector(".emoji-panel")

        ?.classList.toggle("show");

}

/*
==================================================
Файл
==================================================
*/

function openFilePicker(){

    document

        .getElementById("imagePicker")

        ?.click();

}

/*
==================================================
Голос
==================================================
*/

function startVoiceRecording(){

    if(window.startRecording){

        startRecording();

    }

}

/*
==================================================
Авторизация
==================================================
*/

onAuthStateChanged(

    auth,

    async(user)=>{

        if(!user){

            location.href="login.html";

            return;

        }

        TeleGolub.user=user;

        if(window.loadProfile){

            await loadProfile();

        }

        if(window.loadUsers){

            await loadUsers();

        }

        init();

    }

);

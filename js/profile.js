import { auth, db, storage } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-storage.js";

/*
==========================================
Загрузка профиля
==========================================
*/

window.loadProfile = async function () {

    const user = auth.currentUser;

    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) return;

    const data = snap.data();

    window.currentUser = data;

    if(document.getElementById("profileName"))
        document.getElementById("profileName").textContent = data.displayName;

    if(document.getElementById("profileUsername"))
        document.getElementById("profileUsername").textContent = "@"+data.username;

    if(document.getElementById("profileBio"))
        document.getElementById("profileBio").textContent =
            data.bio || "Нет описания";

    if(document.getElementById("profileCoins"))
        document.getElementById("profileCoins").textContent =
            data.coins || 0;

    if(document.getElementById("profileAvatar") && data.avatar){

        document.getElementById("profileAvatar").src = data.avatar;

    }

}

/*
==========================================
Изменить описание
==========================================
*/

window.saveBio = async function(){

    const bio = document
        .getElementById("bioInput")
        .value
        .trim();

    await updateDoc(

        doc(db,"users",auth.currentUser.uid),

        {

            bio:bio,

            updatedAt:serverTimestamp()

        }

    );

    await loadProfile();

}

/*
==========================================
Загрузка аватара
==========================================
*/

window.uploadAvatar = async function(file){

    if(!file) return;

    const storageRef = ref(

        storage,

        "avatars/"+auth.currentUser.uid

    );

    await uploadBytes(

        storageRef,

        file

    );

    const url = await getDownloadURL(storageRef);

    await updateDoc(

        doc(db,"users",auth.currentUser.uid),

        {

            avatar:url,

            updatedAt:serverTimestamp()

        }

    );

    await loadProfile();

}

/*
==========================================
Онлайн
==========================================
*/

window.setOnline = async function(state){

    if(!auth.currentUser) return;

    await updateDoc(

        doc(db,"users",auth.currentUser.uid),

        {

            online:state,

            lastSeen:serverTimestamp()

        }

    );

}

window.addEventListener("focus",()=>{

    setOnline(true);

});

window.addEventListener("blur",()=>{

    setOnline(false);

});

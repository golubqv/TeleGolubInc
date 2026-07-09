import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

/*
==========================================
Загрузка пользователей
==========================================
*/

window.loadUsers = async function () {

    const list = document.getElementById("chatList");

    if (!list) return;

    list.innerHTML = "";

    const users = await getDocs(collection(db, "users"));

    users.forEach((docSnap) => {

        const user = docSnap.data();

        if (user.uid === auth.currentUser.uid) return;

        const card = document.createElement("div");

        card.className = "chat";

        card.innerHTML = `

        <div class="avatar">

            ${user.displayName.charAt(0).toUpperCase()}

        </div>

        <div class="chat-content">

            <div class="chat-top">

                <h3>${user.displayName}</h3>

                <span>${user.online ? "🟢" : ""}</span>

            </div>

            <div class="chat-bottom">

                <p>@${user.username}</p>

            </div>

        </div>

        `;

        card.onclick = () => {

            createChat(user.uid);

        };

        list.appendChild(card);

    });

};

/*
==========================================
Поиск пользователей
==========================================
*/

window.searchUsers = async function (text) {

    text = text.trim().toLowerCase();

    const list = document.getElementById("chatList");

    list.innerHTML = "";

    if (text === "") {

        loadUsers();

        return;

    }

    const q = query(

        collection(db, "users"),

        where("usernameLower", ">=", text)

    );

    const snap = await getDocs(q);

    snap.forEach((docSnap) => {

        const user = docSnap.data();

        if (user.uid === auth.currentUser.uid) return;

        if (!user.usernameLower.startsWith(text)) return;

        const card = document.createElement("div");

        card.className = "chat";

        card.innerHTML = `

        <div class="avatar">

            ${user.displayName.charAt(0).toUpperCase()}

        </div>

        <div class="chat-content">

            <div class="chat-top">

                <h3>${user.displayName}</h3>

            </div>

            <div class="chat-bottom">

                <p>@${user.username}</p>

            </div>

        </div>

        `;

        card.onclick = () => {

            createChat(user.uid);

        };

        list.appendChild(card);

    });

};

/*
==========================================
Подключение поиска
==========================================
*/

const searchInput = document.querySelector(".search input");

if (searchInput) {

    searchInput.addEventListener("input", (e) => {

        searchUsers(e.target.value);

    });

}

/*
==========================================
Автозагрузка
==========================================
*/

auth.onAuthStateChanged?.((user) => {

    if (user) {

        loadUsers();

    }

});

import { auth, db } from "./firebase.js";
import { signOutUser } from "./auth.js";
import {
    collection,
    query,
    where,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const notLoggedIn = document.getElementById("notLoggedIn");
const wishesSection = document.getElementById("wishesSection");
const myWishesList = document.getElementById("myWishesList");
const userSummary = document.getElementById("userSummary");
const logoutBtn = document.getElementById("logoutBtn");

if(logoutBtn){
    logoutBtn.addEventListener("click", () => signOutUser());
}

onAuthStateChanged(auth, async (user) => {

    if(!user || user.isAnonymous){

        notLoggedIn.style.display = "block";
        wishesSection.style.display = "none";
        return;

    }

    notLoggedIn.style.display = "none";
    wishesSection.style.display = "block";

    userSummary.innerHTML = `
        <h2>👋 ${user.displayName || "Welcome"}</h2>
        <p>${user.email || ""}</p>
    `;

    myWishesList.innerHTML = "<p>Loading your wishes...</p>";

    try{

        const q = query(
            collection(db, "wishes"),
            where("ownerUid", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        if(snapshot.empty){

            myWishesList.innerHTML = "<p>Aapne abhi tak koi wish nahi banayi. Neeche se banaiye!</p>";
            return;

        }

        let html = "";

        snapshot.forEach(docSnap => {

            const data = docSnap.data();
            const date = data.createdAt && data.createdAt.toDate
                ? data.createdAt.toDate().toLocaleDateString()
                : "";

            html += `
                <div class="feedback-card">
                    <div class="feedback-card-header">
                        <h3>🎂 ${escapeHtml(data.recipientName || "Untitled Wish")}</h3>
                        <span class="feedback-stars">${data.status === "published" ? "✅ Published" : "📝 Draft"}</span>
                    </div>
                    <p class="feedback-date">Created: ${date}</p>
                    <p class="feedback-message">${escapeHtml(data.message || "")}</p>
                    <a href="wish.html?id=${docSnap.id}" class="secondary-btn" style="display:inline-block; text-decoration:none; margin-top:10px;">
                        View / Share Link
                    </a>
                </div>
            `;

        });

        myWishesList.innerHTML = html;

    } catch(err){

        console.error(err);
        myWishesList.innerHTML = "<p>❌ Wishes load nahi ho payin. Console check karein.</p>";

    }

});

function escapeHtml(str){
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

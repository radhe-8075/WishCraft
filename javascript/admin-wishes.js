import { auth, db } from "./firebase.js";
import {
    collection,
    query,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

/* ==========================
   PUT YOUR OWN GOOGLE ACCOUNT UID(S) HERE
   (Find it in Firebase Console -> Authentication -> Users,
   after you log in once via login.html on your site)
========================== */
const ADMIN_UIDS = [
    "PASTE_YOUR_UID_HERE"
];

const notAdmin = document.getElementById("notAdmin");
const notAdminMessage = document.getElementById("notAdminMessage");
const wishesSection = document.getElementById("wishesSection");
const totalSummary = document.getElementById("totalSummary");
const allWishesList = document.getElementById("allWishesList");
const searchBox = document.getElementById("searchBox");

let allWishesData = [];

onAuthStateChanged(auth, async (user) => {

    if(!user || user.isAnonymous){

        notAdminMessage.textContent = "Aap login nahi hain.";
        notAdmin.style.display = "block";
        wishesSection.style.display = "none";
        return;

    }

    if(!ADMIN_UIDS.includes(user.uid)){

        notAdminMessage.innerHTML = `Ye page sirf admin ke liye hai.<br><br>Aapka UID: <code>${user.uid}</code>`;
        notAdmin.style.display = "block";
        wishesSection.style.display = "none";
        return;

    }

    notAdmin.style.display = "none";
    wishesSection.style.display = "block";

    allWishesList.innerHTML = "<p>Loading all wishes...</p>";

    try{

        const q = query(collection(db, "wishes"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        allWishesData = [];

        snapshot.forEach(docSnap => {

            allWishesData.push({ id: docSnap.id, ...docSnap.data() });

        });

        totalSummary.innerHTML = `
            <h2>${allWishesData.length}</h2>
            <p>Total Wishes Created</p>
        `;

        renderWishes(allWishesData);

    } catch(err){

        console.error(err);
        allWishesList.innerHTML = "<p>❌ Wishes load nahi ho payin. Console check karein.</p>";

    }

});

function renderWishes(list){

    if(list.length === 0){

        allWishesList.innerHTML = "<p>Koi wish nahi mili.</p>";
        return;

    }

    let html = "";

    list.forEach(data => {

        const date = data.createdAt && data.createdAt.toDate
            ? data.createdAt.toDate().toLocaleString()
            : "";

        const shareLink = `${window.location.origin}/wish.html?id=${data.id}`;

        html += `
            <div class="feedback-card">
                <div class="feedback-card-header">
                    <h3>🎂 ${escapeHtml(data.recipientName || "Untitled")}</h3>
                    <span class="feedback-stars">${data.status === "published" ? "✅ Published" : "📝 Draft"}</span>
                </div>
                <p class="feedback-date">
                    Created: ${date} | From: ${escapeHtml(data.senderName || "-")}
                </p>
                <p class="feedback-message">${escapeHtml(data.message || "")}</p>
                <div class="admin-link-row">
                    <input type="text" readonly value="${shareLink}" class="admin-link-input">
                    <button class="secondary-btn copy-link-btn" data-link="${shareLink}">Copy Link</button>
                </div>
            </div>
        `;

    });

    allWishesList.innerHTML = html;

    document.querySelectorAll(".copy-link-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            navigator.clipboard.writeText(btn.dataset.link);
            btn.textContent = "✅ Copied!";
            setTimeout(() => { btn.textContent = "Copy Link"; }, 1500);

        });

    });

}

if(searchBox){

    searchBox.addEventListener("input", () => {

        const term = searchBox.value.toLowerCase();

        const filtered = allWishesData.filter(data =>
            (data.recipientName || "").toLowerCase().includes(term) ||
            (data.senderName || "").toLowerCase().includes(term)
        );

        renderWishes(filtered);

    });

}

function escapeHtml(str){
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

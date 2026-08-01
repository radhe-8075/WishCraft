import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/* ==========================
   CHANGE THIS PASSWORD
========================== */
const ADMIN_PASSWORD = "wishcraft2026";

const loginGate = document.getElementById("loginGate");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminPassword = document.getElementById("adminPassword");
const loginError = document.getElementById("loginError");
const feedbackDashboard = document.getElementById("feedbackDashboard");
const feedbackList = document.getElementById("feedbackList");
const feedbackSummary = document.getElementById("feedbackSummary");

if(adminLoginForm){

    adminLoginForm.addEventListener("submit", (e) => {

        e.preventDefault();

        if(adminPassword.value === ADMIN_PASSWORD){

            sessionStorage.setItem("wishcraftAdmin", "true");
            loginGate.style.display = "none";
            feedbackDashboard.style.display = "block";
            loadFeedback();

        } else {

            loginError.textContent = "❌ Wrong password.";

        }

    });

}

// Skip login if already unlocked this session
if(sessionStorage.getItem("wishcraftAdmin") === "true"){

    loginGate.style.display = "none";
    feedbackDashboard.style.display = "block";
    loadFeedback();

}

async function loadFeedback(){

    feedbackList.innerHTML = "<p>Loading feedback...</p>";

    try{

        const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if(snapshot.empty){

            feedbackList.innerHTML = "<p>No feedback yet.</p>";
            feedbackSummary.innerHTML = "";
            return;

        }

        let totalRating = 0;
        let count = 0;
        let html = "";

        snapshot.forEach(doc => {

            const data = doc.data();
            const stars = "⭐".repeat(data.rating || 0);
            const date = data.createdAt && data.createdAt.toDate
                ? data.createdAt.toDate().toLocaleString()
                : "";

            totalRating += (data.rating || 0);
            count++;

            html += `
                <div class="feedback-card">
                    <div class="feedback-card-header">
                        <h3>${escapeHtml(data.name || "Anonymous")}</h3>
                        <span class="feedback-stars">${stars}</span>
                    </div>
                    <p class="feedback-date">${date}</p>
                    <p class="feedback-message">${escapeHtml(data.message || "")}</p>
                </div>
            `;

        });

        feedbackList.innerHTML = html;

        const avgRating = count > 0 ? (totalRating / count).toFixed(1) : 0;

        feedbackSummary.innerHTML = `
            <h2>⭐ ${avgRating} / 5</h2>
            <p>${count} total feedback${count === 1 ? "" : "s"}</p>
        `;

    } catch(err){

        console.error(err);
        feedbackList.innerHTML = "<p>❌ Failed to load feedback. Check console for details.</p>";

    }

}

function escapeHtml(str){

    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;

}

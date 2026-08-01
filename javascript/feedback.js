import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/* ==========================
   Star Rating
========================== */

const stars = document.querySelectorAll("#starRating i");
const ratingInput = document.getElementById("feedbackRating");

let currentRating = 0;

function paintStars(value){

    stars.forEach(star => {

        if(Number(star.dataset.value) <= value){
            star.classList.remove("ri-star-line");
            star.classList.add("ri-star-fill");
        } else {
            star.classList.remove("ri-star-fill");
            star.classList.add("ri-star-line");
        }

    });

}

stars.forEach(star => {

    star.addEventListener("click", () => {

        currentRating = Number(star.dataset.value);
        ratingInput.value = currentRating;
        paintStars(currentRating);

    });

    star.addEventListener("mouseenter", () => {

        paintStars(Number(star.dataset.value));

    });

});

const starRatingBox = document.getElementById("starRating");

if(starRatingBox){

    starRatingBox.addEventListener("mouseleave", () => {

        paintStars(currentRating);

    });

}

/* ==========================
   EmailJS Notification
   (Replace these 3 values after creating a free account at emailjs.com)
========================== */

const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";

function sendEmailNotification(name, rating, message){

    if(typeof emailjs === "undefined") return;

    if(EMAILJS_PUBLIC_KEY.startsWith("YOUR_")) return; // not configured yet

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        rating: rating,
        message: message
    }).catch(err => console.warn("Email notification failed:", err));

}

/* ==========================
   Form Submit
========================== */

const feedbackForm = document.getElementById("feedback-form");
const feedbackStatus = document.getElementById("feedbackStatus");
const feedbackSubmitBtn = document.getElementById("feedbackSubmitBtn");

if(feedbackForm){

    feedbackForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name = document.getElementById("feedbackName").value.trim();
        const message = document.getElementById("feedbackMessage").value.trim();
        const rating = Number(ratingInput.value);

        if(rating === 0){
            alert("Please select a star rating.");
            return;
        }

        feedbackSubmitBtn.disabled = true;
        feedbackSubmitBtn.textContent = "Sending...";

        try{

            await addDoc(collection(db, "feedback"), {
                name: name,
                message: message,
                rating: rating,
                createdAt: serverTimestamp()
            });

            sendEmailNotification(name, rating, message);

            feedbackStatus.textContent = "✅ Thank you! Your feedback has been submitted.";
            feedbackStatus.classList.add("success");

            feedbackForm.reset();
            currentRating = 0;
            paintStars(0);

        } catch(err){

            console.error(err);
            feedbackStatus.textContent = "❌ Something went wrong. Please try again.";
            feedbackStatus.classList.add("error");

        }

        feedbackSubmitBtn.disabled = false;
        feedbackSubmitBtn.textContent = "💌 Submit Feedback";

    });

}

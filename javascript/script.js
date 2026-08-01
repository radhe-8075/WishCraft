console.log("WishCraft Loaded Successfully");
const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(link => {

    link.addEventListener("click", function(e) {

        e.preventDefault();

        const targetId = this.getAttribute("href");

        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: "smooth"
            });
        }

    });

});
const links = document.querySelectorAll(".nav-links a");

links.forEach(link => {

    link.addEventListener("click", () => {

        links.forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");

    });

});
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    item.addEventListener("click", () => {

        faqItems.forEach(faq => {
            if(faq !== item){
                faq.classList.remove("active");
            }
        });

        item.classList.toggle("active");

    });

});
window.addEventListener("scroll", () => {

    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});
const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {

    const target = +counter.dataset.target;
    let count = 0;

    const updateCounter = () => {

        const increment = Math.ceil(target / 100);

        if (count < target) {

            count += increment;

            if (count > target) {
                count = target;
            }

            counter.innerText = count;

            setTimeout(updateCounter, 20);

        }

    };

    updateCounter();

});
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll(){

    reveals.forEach(item => {

        const windowHeight = window.innerHeight;
        const elementTop = item.getBoundingClientRect().top;

        if(elementTop < windowHeight - 100){
            item.classList.add("active");
        }

    });

}

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();
const buttons = document.querySelectorAll("button");

buttons.forEach(button => {

    button.addEventListener("click", function(e){

        const circle = document.createElement("span");

        circle.classList.add("ripple");

        const size = Math.max(this.clientWidth, this.clientHeight);

        circle.style.width = size + "px";
        circle.style.height = size + "px";

        circle.style.left = (e.offsetX - size / 2) + "px";
        circle.style.top = (e.offsetY - size / 2) + "px";

        this.appendChild(circle);

        setTimeout(() => {
            circle.remove();
        }, 600);

    });

});
const topBtn = document.getElementById("topBtn");

if(topBtn){

    window.addEventListener("scroll", () => {

        topBtn.style.display = window.scrollY > 300 ? "flex" : "none";

    });

    topBtn.addEventListener("click", () => {

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

    });

}
window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (loader) {
        setTimeout(() => {
            loader.classList.add("loader-hide");
        }, 1000);
    }

});
const photoInput = document.getElementById("photoInput");


if(photoInput){

    photoInput.addEventListener("change", function(){

        const file = this.files[0];

    });

}
const themeCards = document.querySelectorAll(".theme-card");

function setSelectedTheme(theme) {

    const selectedCard = Array.from(themeCards).find(card => card.dataset.theme === theme);

    if (!selectedCard) {
        return false;
    }

    themeCards.forEach(card => {
        card.classList.toggle("active", card === selectedCard);
    });

    localStorage.setItem("selectedTheme", theme);
    return true;

}

if (themeCards.length > 0) {

    const storedTheme = localStorage.getItem("selectedTheme");
    const activeTheme = document.querySelector(".theme-card.active");

    setSelectedTheme(storedTheme) || setSelectedTheme(activeTheme?.dataset.theme);

}

themeCards.forEach(card => {

    card.addEventListener("click", () => {

        setSelectedTheme(card.dataset.theme);
    });

});
const dropArea = document.getElementById("dropArea");

if (dropArea && photoInput) {

    ["dragenter", "dragover"].forEach(eventName => {

        dropArea.addEventListener(eventName, (e) => {

            e.preventDefault();
            dropArea.classList.add("dragover");

        });

    });

    ["dragleave", "drop"].forEach(eventName => {

        dropArea.addEventListener(eventName, () => {

            dropArea.classList.remove("dragover");

        });

    });

    dropArea.addEventListener("drop", (e) => {

        e.preventDefault();

        if (e.dataTransfer.files.length > 0) {

            photoInput.files = e.dataTransfer.files;

            photoInput.dispatchEvent(new Event("change"));

        }

    });

}
const photoGallery = document.getElementById("photoGallery");

if(photoInput){

    photoInput.addEventListener("change", () => {

        photoGallery.innerHTML = "";

Array.from(photoInput.files).forEach(file => {

    const box = document.createElement("div");

    box.classList.add("gallery-item");

    const img = document.createElement("img");

    img.src = URL.createObjectURL(file);

    const removeBtn = document.createElement("button");

    removeBtn.type = "button";
    removeBtn.classList.add("remove-image");

    removeBtn.innerHTML = "×";

    removeBtn.addEventListener("click", () => {

        const remainingFiles = new DataTransfer();

        Array.from(photoInput.files).forEach(selectedFile => {
            if (selectedFile !== file) {
                remainingFiles.items.add(selectedFile);
            }
        });

        photoInput.files = remainingFiles.files;
        box.remove();

    });

    box.appendChild(img);

    box.appendChild(removeBtn);

    photoGallery.appendChild(box);

});

});

}
const wishForm = document.getElementById("wish-form");

if (wishForm) {

    wishForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name = document.getElementById("birthdayName").value.trim();
        const senderName = document.getElementById("senderName").value.trim();
        const birthdayDate = document.getElementById("birthdayDate").value;
        const message = document.getElementById("birthdayMessage").value.trim();
        const activeThemeCard = document.querySelector(".theme-card.active");
        const theme = activeThemeCard?.dataset.theme || localStorage.getItem("selectedTheme") || "pink";
        const files = Array.from(photoInput?.files || []);
        const submitButton = wishForm.querySelector('button[type="submit"]');
        const originalLabel = submitButton?.innerHTML;

        // Keep a local draft for previews, but publish the shareable version to Firebase.
        localStorage.setItem("birthdayName", name);
        localStorage.setItem("birthdayMessage", message);
        localStorage.setItem("selectedTheme", theme);
        localStorage.setItem("birthdayPhotos", JSON.stringify([]));
        localStorage.removeItem("paymentStatus");

        try {

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Creating your shareable wish...";
            }

            const { createShareableWish } = await import("./wish-service.js");
            const wishId = await createShareableWish({
                recipientName: name,
                senderName,
                birthdayDate,
                message,
                theme,
                files
            });

            const wishUrl = new URL("wish.html", window.location.href);
            wishUrl.searchParams.set("id", wishId);
            window.location.assign(wishUrl.href);

        } catch (error) {

            console.error("Could not create a shareable wish:", error);

            let errorMessage = "Wish create nahi ho payi. Firebase Firestore, Storage aur Anonymous Authentication enable karke phir try karein.";

            if (error?.name === "WishValidationError") {
                errorMessage = error.message;
            } else if (error?.code === "auth/operation-not-allowed") {
                errorMessage = "Firebase Console mein Anonymous Authentication enable karein.";
            } else if (error?.code === "auth/unauthorized-domain") {
                errorMessage = "Is website domain ko Firebase Authentication ke Authorized domains mein add karein.";
            } else if (error?.code === "permission-denied" || error?.code === "storage/unauthorized") {
                errorMessage = "Firebase rules deploy nahi hui hain. README ke deployment steps complete karein.";
            }

            alert(errorMessage);

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalLabel;
            }

        }

    });

}
const continueBtn = document.getElementById("continueBtn");

if(continueBtn){

    continueBtn.addEventListener("click", () => {

        window.location.href = "wish.html";

    });

}
const giftBtn = document.getElementById("giftBtn");
const surpriseMessage = document.getElementById("surpriseMessage");

if (giftBtn && surpriseMessage) {

    giftBtn.addEventListener("click", () => {

        giftBtn.classList.add("shake");

        setTimeout(() => {

            giftBtn.classList.remove("shake");

            giftBtn.classList.add("open");
            giftBtn.parentElement.classList.add("finished");

            surpriseMessage.classList.add("show");

            confetti({
                particleCount: 180,
                spread: 120,
                origin: { y: 0.6 }
            });

        }, 600);

    }, { once: true });

}
 
const wishName = document.getElementById("wishName");
const wishMessage = document.getElementById("wishMessage");

if (wishName && wishMessage) {

    const savedName = localStorage.getItem("birthdayName");
    const savedMessage = localStorage.getItem("birthdayMessage");

    if (savedName) {
        wishName.textContent = savedName;
    }

    if (savedMessage) {
        wishMessage.textContent = savedMessage;
    }

}
const wishSlides = document.getElementById("wishSlides");

if (wishSlides) {

    const photos = JSON.parse(localStorage.getItem("birthdayPhotos"));

    if (photos && photos.length > 0) {

        wishSlides.innerHTML = "";

        photos.forEach((photo, index) => {

    const card = document.createElement("div");

    card.classList.add("polaroid-card");
    const rotations = [-6, -4, -2, 2, 4, 6];

const randomRotation =
    rotations[Math.floor(Math.random() * rotations.length)];

if (window.innerWidth > 768) {
    card.style.transform = `rotate(${randomRotation}deg)`;
}

    const img = document.createElement("img");

    img.src = photo;

    const caption = document.createElement("p");

const savedName = localStorage.getItem("birthdayName") || "Friend";

caption.innerHTML = "❤️ Memories with " + savedName;

card.appendChild(img);

card.appendChild(caption);

wishSlides.appendChild(card);

});
    }
}
const wishPage = document.querySelector(".wish-page");

if(wishPage){

    const selectedTheme = localStorage.getItem("selectedTheme");

    if(selectedTheme === "pink"){

        wishPage.classList.add("pink-theme");

    }

    else if(selectedTheme === "royal"){

        wishPage.classList.add("royal-theme");

    }

    else if(selectedTheme === "kids"){

        wishPage.classList.add("kids-theme");

    }

}

const sharedWishId = new URLSearchParams(window.location.search).get("id");

function renderSharedWish(sharedWish) {

    const recipientName = sharedWish.recipientName || "Friend";
    const message = sharedWish.message || "Wishing you happiness, success and lots of beautiful memories.";
    const photos = Array.isArray(sharedWish.photoUrls) ? sharedWish.photoUrls : [];

    if (wishName) {
        wishName.textContent = recipientName;
    }

    if (wishMessage) {
        wishMessage.textContent = message;
    }

    if (wishPage) {
        wishPage.classList.remove("pink-theme", "royal-theme", "kids-theme");

        if (["pink", "royal", "kids"].includes(sharedWish.theme)) {
            wishPage.classList.add(`${sharedWish.theme}-theme`);
        }
    }

  if (wishSlides) {

    wishSlides.replaceChildren();

    photos.forEach(photo => {

        const card = document.createElement("div");
        card.classList.add("polaroid-card");

        // Mobile par rotate mat karo
        if (window.innerWidth > 768) {

            const rotations = [-6, -4, -2, 2, 4, 6];

            card.style.transform =
                `rotate(${rotations[Math.floor(Math.random() * rotations.length)]}deg)`;

        }

        const img = document.createElement("img");
        img.src = photo;
        img.alt = `${recipientName}'s birthday memory`;

        const caption = document.createElement("p");
        caption.textContent = `❤️ Memories with ${recipientName}`;

        card.appendChild(img);
        card.appendChild(caption);

        wishSlides.appendChild(card);

    });

}

    const sharedDownloadName = document.getElementById("downloadName");
    const sharedDownloadPhoto = document.getElementById("downloadPhoto");
    const sharedDownloadMessage = document.getElementById("downloadMessage");

    if (sharedDownloadName) {
        sharedDownloadName.textContent = `🎂 Happy Birthday ${recipientName}`;
    }

    if (sharedDownloadMessage) {
        sharedDownloadMessage.textContent = message;
    }

    if (sharedDownloadPhoto && photos.length > 0) {
        sharedDownloadPhoto.src = photos[0];
    }

    document.title = `Happy Birthday ${recipientName} | WishCraft`;

}

function showSharedWishLoadError() {

    if (wishName) {
        wishName.textContent = "Wish unavailable";
    }

    if (wishMessage) {
        wishMessage.textContent = "This wish could not be loaded. Please ask the sender for a new link.";
    }

}

if (sharedWishId) {

    if (wishMessage) {
        wishMessage.textContent = "Loading your birthday surprise...";
    }

    import("./wish-service.js")
        .then(({ getShareableWish }) => getShareableWish(sharedWishId))
        .then(sharedWish => {

            if (!sharedWish) {
                throw new Error("Wish not found");
            }

            renderSharedWish(sharedWish);

        })
        .catch(error => {

            console.error("Could not load the shared wish:", error);
            showSharedWishLoadError();

        });

}

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");

if (lightbox && lightboxImage && closeLightbox) {

    document.addEventListener("click", (e) => {

        if (e.target.matches(".polaroid-card img")) {

            lightbox.classList.add("active");

            lightboxImage.src = e.target.src;

        }

    });

    closeLightbox.addEventListener("click", () => {

        lightbox.classList.remove("active");

    });

    lightbox.addEventListener("click", (e) => {

        if (e.target === lightbox) {

            lightbox.classList.remove("active");

        }

    });

}
const pageLoader = document.getElementById("pageLoader");

if(pageLoader){

    window.addEventListener("load", () => {

        setTimeout(() => {

            pageLoader.classList.add("hide");

        }, 1200);

    });

}
const instagramBtn = document.getElementById("instagramBtn");

if (instagramBtn) {

    instagramBtn.addEventListener("click", async () => {

        const pageLink = window.location.href;

        await navigator.clipboard.writeText(pageLink);

        alert("✅ Link copied!\n\nNow open Instagram and paste the link in your Story or Bio.");

        window.open("https://www.instagram.com/", "_blank");

    });

}
/*==========================
      Payment Lock
==========================*/

function checkPayment(){

    if(localStorage.getItem("paymentStatus") !== "paid"){

        alert("🔒 Please complete the payment to unlock downloads.");

        return false;

    }

    return true;

}
/* ==========================
   Share Buttons
========================== */

const copyBtn = document.getElementById("copyBtn");
const whatsappBtn = document.getElementById("whatsappBtn");
const facebookBtn = document.getElementById("facebookBtn");
const telegramBtn = document.getElementById("telegramBtn");

const shareLink = window.location.href;

if(copyBtn){

    copyBtn.addEventListener("click", async ()=>{

    await navigator.clipboard.writeText(shareLink);

    alert("✅ Link Copied Successfully!");

});

}

if(whatsappBtn){

    whatsappBtn.addEventListener("click", ()=>{ 

        window.open(

            `https://wa.me/?text=${encodeURIComponent(
                "🎉 Check this amazing birthday surprise!\n\n"+shareLink
            )}`,

            "_blank"

        );

    });

}

if(facebookBtn){

    facebookBtn.addEventListener("click", ()=>{ 
        window.open(

            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`,

            "_blank"

        );

    });

}

if(telegramBtn){

    telegramBtn.addEventListener("click", ()=>{ 
        window.open(

            `https://t.me/share/url?url=${encodeURIComponent(shareLink)}`,

            "_blank"

        );

    });

}
/* ==========================
      Native Share
========================== */

const nativeShareBtn = document.getElementById("nativeShareBtn");

if(nativeShareBtn){

    nativeShareBtn.addEventListener("click", async ()=>{ 
        if(navigator.share){

            try{

                await navigator.share({

                    title:"WishCraft",

                    text:"🎉 Check this beautiful Birthday Website!",

                    url:window.location.href

                });

            }

            catch(err){

                console.log(err);

            }

        }

        else{

            alert("Your browser doesn't support Native Share.");

        }

    });

}
/* ==========================
        QR Code
========================== */

const qrCanvas = document.getElementById("qrCode");

if(qrCanvas){

    const qr = new QRious({

        element: qrCanvas,

        value: window.location.href,

        size:220

    });

}

const downloadQR = document.getElementById("downloadQR");

if(downloadQR){

    downloadQR.addEventListener("click",()=>{

    if(!checkPayment()) return;

    const image = qrCanvas.toDataURL("image/png");

    const link = document.createElement("a");

    link.href=image;

    link.download="WishCraft-QR.png";

    link.click();

});

}
/*==========================
 Premium Download Card
===========================*/

const downloadName = document.getElementById("downloadName");
const downloadPhoto = document.getElementById("downloadPhoto");
const downloadMessage = document.getElementById("downloadMessage");

if(downloadName && downloadPhoto && downloadMessage){

    // Name
    const savedName = localStorage.getItem("birthdayName");

    if(savedName){
        downloadName.innerText = "🎂 Happy Birthday " + savedName;
    }

    // Message
    const savedMessage = localStorage.getItem("birthdayMessage");

    if(savedMessage){
        downloadMessage.innerText = savedMessage;
    }

    // Photo
    const photos = JSON.parse(localStorage.getItem("birthdayPhotos"));

    if(photos && photos.length > 0){
        downloadPhoto.src = photos[0];
    }

}
/*==========================
 Download Premium Card
===========================*/

const downloadCardBtn = document.getElementById("downloadCard");

if(downloadCardBtn){

   downloadCardBtn.addEventListener("click",()=>{

    if(!checkPayment()) return;

    const card = document.getElementById("downloadCardBox");

    html2canvas(card,{
        scale:4,
        useCORS:true,
        backgroundColor:null
    }).then(canvas=>{

        const link=document.createElement("a");

        link.download="WishCraft-Birthday-Card.png";

        link.href=canvas.toDataURL("image/png");

        link.click();

    });

});

}
/*==========================
      Login Button
===========================*/

const loginBtn = document.getElementById("loginBtn");

if(loginBtn){

    loginBtn.addEventListener("click",()=>{

        alert(
`🚧 Login System

This feature is coming soon.

Firebase Authentication will be added in the next update of WishCraft.`
        );

    });

}
/*==========================
     Use Template
===========================*/

const useButtons = document.querySelectorAll(".use-btn");

useButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        const theme = button.dataset.theme;

        localStorage.setItem("selectedTheme",theme);

        window.location.href="create.html";

    });

});
/*==========================
     Preview Template
===========================*/

const previewButtons = document.querySelectorAll(".preview-btn");

previewButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        const theme = button.dataset.theme;

        localStorage.setItem("selectedTheme",theme);

        window.location.href="wish.html";

    });

});
/*==========================
      Payment Check
===========================*/


/*==========================
      Pricing Plans
===========================*/

const planButtons = document.querySelectorAll(".plan-btn");

planButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        localStorage.setItem("selectedPlan",button.dataset.plan);

        localStorage.setItem("selectedPrice",button.dataset.price);

        window.location.href="create.html";

    });

});
/*==========================
      Payment Plan
===========================*/


/*==========================
     Success Plan
===========================*/

const successPlan = document.getElementById("successPlan");
const successPrice = document.getElementById("successPrice");

if(successPlan && successPrice){

    const plan = localStorage.getItem("selectedPlan");
    const price = localStorage.getItem("selectedPrice");

    if(plan){
        successPlan.innerText = plan;
    }

    if(price){
        successPrice.innerText = "₹" + price;
    }

}

/*==========================
   Go To Payment
==========================*/

const goToPayment = document.getElementById("goToPayment");

if(goToPayment){

    goToPayment.addEventListener("click",()=>{

        const paymentUrl = new URL("payment.html", window.location.href);

        if (sharedWishId) {
            paymentUrl.searchParams.set("id", sharedWishId);
        }

        window.location.href = paymentUrl.href;

    });

}

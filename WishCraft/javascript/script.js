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

themeCards.forEach(card => {

    card.addEventListener("click", () => {

        themeCards.forEach(item => {
            item.classList.remove("active");
        });

        card.classList.add("active");
localStorage.setItem("selectedTheme", card.dataset.theme);
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

    removeBtn.classList.add("remove-image");

    removeBtn.innerHTML = "×";

    removeBtn.addEventListener("click", () => {

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

    wishForm.addEventListener("submit", (e) => {
        console.log("Form Submitted");

        e.preventDefault();

        const name = document.getElementById("birthdayName").value;

        const message = document.getElementById("birthdayMessage").value;
         localStorage.setItem("birthdayName", name);

        localStorage.setItem("birthdayMessage", message);
        const photos = [];
const files = Array.from(photoInput.files);

if(files.length === 0){

    window.location.href = "wish.html";

    return;

}

files.forEach(file => {

    const reader = new FileReader();

    reader.onload = function(e){

        photos.push(e.target.result);

        if(photos.length === files.length){

            localStorage.setItem("birthdayPhotos", JSON.stringify(photos));

            window.location.href = "wish.html";

        }

    };

    reader.readAsDataURL(file);

});

       

       // window.location.href = "wish.html";

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

card.style.transform = `rotate(${randomRotation}deg)`;

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

window.addEventListener("load", () => {

    confetti({

        particleCount: 250,
        spread: 150,
        origin: { y: 0.6 }

    });

});

const continueBtn = document.getElementById("continueBtn");

if (continueBtn) {

    continueBtn.addEventListener("click", () => {

        window.location.href = "index.html";

    });

}
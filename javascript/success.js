window.addEventListener("load", () => {

    confetti({

        particleCount: 250,
        spread: 150,
        origin: { y: 0.6 }

    });

});
/*==========================
      Success Details
===========================*/

const successPlan = document.getElementById("successPlan");
const successPrice = document.getElementById("successPrice");
const paidAmount = document.getElementById("paidAmount");
const sharedWishId = new URLSearchParams(window.location.search).get("id");

const plan = localStorage.getItem("selectedPlan");
const price = localStorage.getItem("selectedPrice");

if(plan){

    successPlan.innerText = plan;

}

if(price){

    successPrice.innerText = "₹" + price;

    paidAmount.innerText = "₹" + price;

}

const continueBtn = document.getElementById("continueBtn");

if (continueBtn) {

    continueBtn.addEventListener("click", () => {

        const wishUrl = new URL("wish.html", window.location.href);

        if (sharedWishId) {
            wishUrl.searchParams.set("id", sharedWishId);
        }

        window.location.href = wishUrl.href;

    });

}

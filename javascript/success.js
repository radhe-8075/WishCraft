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

        window.location.href = "wish.html";

    });

}
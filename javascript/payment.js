const paymentBtn = document.getElementById("paymentDoneBtn");
const paymentCheck = document.getElementById("paymentCheck");

if (paymentBtn && paymentCheck) {

    paymentBtn.addEventListener("click", () => {

        if (!paymentCheck.checked) {

            alert("Please complete the payment and tick the checkbox.");

            return;

        }

        paymentBtn.innerText = "Redirecting...";

paymentBtn.disabled = true;
localStorage.setItem("paymentStatus","paid");

setTimeout(() => {

    window.location.href = "success.html";

}, 1000);

        

    });

}
const summaryTheme = document.getElementById("summaryTheme");
const summaryPlan = document.getElementById("summaryPlan");
const summaryPrice = document.getElementById("summaryPrice");

if(summaryTheme && summaryPlan && summaryPrice){

    const theme = localStorage.getItem("selectedTheme");
    const plan = localStorage.getItem("selectedPlan");
    const price = localStorage.getItem("selectedPrice");

    if(theme){
        summaryTheme.innerText = theme;
    }

    if(plan){
        summaryPlan.innerText = plan;
    }

    if(price){
        summaryPrice.innerText = "₹" + price;
    }

}
/*==========================
      Selected Plan
===========================*/

const planName = document.getElementById("planName");
const planPrice = document.getElementById("planPrice");

if(planName && planPrice){

    const plan = localStorage.getItem("selectedPlan");
    const price = localStorage.getItem("selectedPrice");

    if(plan){
        planName.innerText = plan;
    }

    if(price){
        planPrice.innerText = "₹" + price;
    }

}
/*==========================
      Payment Amount
===========================*/

const upiAmount = document.getElementById("upiAmount");
const paymentLabel = document.getElementById("paymentLabel");

const price = localStorage.getItem("selectedPrice");

if(price){

    if(upiAmount){
        upiAmount.innerText = "₹" + price;
    }

    if(paymentLabel){
        paymentLabel.innerText =
        "I have successfully completed the ₹" + price + " payment.";
    }

}
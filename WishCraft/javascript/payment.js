const paymentBtn = document.getElementById("paymentDoneBtn");
const paymentCheck = document.getElementById("paymentCheck");

if (paymentBtn && paymentCheck) {

    paymentBtn.addEventListener("click", () => {

        if (!paymentCheck.checked) {

            alert("Please complete the payment and tick the checkbox.");

            return;

        }

        alert("Thank you for your payment ❤️");

        window.location.href = "success.html";

    });

}
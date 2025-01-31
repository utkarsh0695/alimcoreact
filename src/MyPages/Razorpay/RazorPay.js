import { toast } from "react-toastify";
import { generateOrderNumber } from "../../api/ticket";

export async function displayRazorpay(data, header) {
  if (data?.length > 0) {
    alert("Please fill mandatory fields with * on it");
  } else {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    const body = {
        ticket_id:data?.ticket_id||null,
        order_id:data?.order_id||null
    }
    toast.error("hit order api")
    const order = await generateOrderNumber(body,header)
    // console.log("order",order)
    const options = {
      key: `rzp_test_tgWgOfXw8Z4eKf`,
      amount: `100000`,
      currency: `INR`,
      name: "ALIMCO",
      description: "TICKET PAYMENT",
      // order_id: `KAJSKDJHARRRRRRRRRR97KJF`,
      handler: function (response) {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
      },
      prefill: {
        name: "Your Name",
        email: "your.email@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Your Address",
      },
      theme: {
        color: "#F37254",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
}

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

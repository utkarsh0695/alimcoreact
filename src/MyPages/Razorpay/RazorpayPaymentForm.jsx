import { useState } from "react";
import { toast } from "react-toastify";
import { generateOrderNumber } from "../../api/ticket";
import { Button } from "reactstrap";
import { LIVE_KEY, TEST_KEY_ID } from "../../Constant/MyConstants";
import { OrderUpdate } from "../../api/user";

export const RazorpayPaymentForm = ({
  data,
  mode,
  transaction_id,
  payment_date,
  handleClose,
  errors,
}) => {
  const userToken = localStorage.getItem("accessToken");
  const base_url = localStorage.getItem("base_url");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    amount: "",
    email: "",
    contact: "",
    notes: "",
    callbackUrl: `${base_url}/api/razorpay/callback`,
  });

  const [loading, setLoading] = useState(false); // For button loading state

  // Function to create order and then submit form
  const handlePayNow = async (e) => {
    e.preventDefault(); // Prevent the form from submitting immediately
    setLoading(true); // Show loading state while the API is called

    try {
      if (mode === "online") {
        const bodyData = {
          order_id: data?.id || null,
        };
        // Step 1: Call your backend API to create an order
        const response = await generateOrderNumber(bodyData, tokenHeader);
        if (response.data.status == "success") {
          // Assuming the response contains order_id and amount
          const { order_id, amount, email, contact, notes } =
            response?.data?.data;

          // Step 2: Update the order details in the state
          setOrderDetails((prevDetails) => ({
            ...prevDetails,
            orderId: order_id,
            amount: amount,
            email: email || "",
            contact: contact || "",
            notes: notes || "",
          }));

          // console.log(response);

          // return false;
          // Step 3: Submit the form programmatically
          setTimeout(() => {
            document.getElementById("razorpay-payment-form").submit();
          }, 100);
        } else if (response.data.status == "failed") {
          toast.error(response.data.message);
          setLoading(false);
        }
      } else if (mode === "cash") {
        const response = await OrderUpdate(
          {
            ...data,
            transaction_id: transaction_id,
            payment_method: mode,
            paid_amount: data?.grand_total,
            payment_date: payment_date,
          },
          tokenHeader
        );
        if (response.data.status === "success") {
          setLoading(false);
          toast.success(response.data.message);
          handleClose();
        } else {
          toast.error(response.data.message);
        }
      } else {
        console.log("error", errors);
      }
    } catch (error) {
      toast.error("something went wrong. please try again.");
    }
  };

  return (
    <>
      {/* Razorpay form */}
      <form
        id="razorpay-payment-form"
        method="POST"
        action="https://api.razorpay.com/v1/checkout/embedded"
      >
        <input type="hidden" name="key_id" value={TEST_KEY_ID} />
        <input type="hidden" name="order_id" value={orderDetails.orderId} />
        <input type="hidden" name="amount" value={orderDetails.amount} />{" "}
        {/* Amount in paisa */}
        <input type="hidden" name="name" value="HDFC Collect Now" />
        <input type="hidden" name="description" value="Enter description" />
        <input type="hidden" name="email" value={orderDetails.email} />
        <input type="hidden" name="contact" value={orderDetails.contact} />
        <input type="hidden" name="notes" value={orderDetails.notes} />
        <input
          type="hidden"
          name="callback_url"
          value={orderDetails.callbackUrl}
        />
      </form>
      <div className="text-center">
        <Button
          color="primary"
          className="mt-4"
          onClick={handlePayNow}
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </>
  );
};

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import successImg from "../../assets/images/success.gif";
import failedImg from "../../assets/images/failed.gif";
import { orderDetails } from "../../api/user";
import PreventBackButton from "./PreventBackButton";
import usePreventBackNavigation from "./usePreventBackNavigation";
import { verifyOrder } from "../../api/ticket";

const OrderSuccess = () => {
  const user = JSON.parse(localStorage.getItem("userDetail"));
  const userToken = localStorage.getItem("accessToken");
  const [isLoading, setIsLoading] = useState(true);
  usePreventBackNavigation();
  const location = useLocation();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(5);
  const [paymentDetails, setPaymentDetails] = useState({
    razorpay_payment_id: "",
    razorpay_order_id: "",
    razorpay_signature: "",
    error: null,
  });

  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  // if (!user?.token) {
  //   window.location.href = "https://octopod.co.in/payment/success";
  // } else {
  //   console.log("verify this url is open previously or not");
  //   const body = {
  //     razorpay_order_id: params?.razorpay_order_id || "",
  //   };
  //   verifyOrder(body, tokenHeader)
  //     .then((res) => {
  //       if (res.data.status == "success") {
  //         console.log("success", res.data.data);
  //       } else if (res.data.status == "expired") {
  //         //logout user
  //       } else if (res.data.status == "failed") {
  //         console.log("handle failed status and redirect user to ");
  //         window.location.href = "https://octopod.co.in/payment/success";
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("something went wrong!", err);
  //     });
  // }
  useEffect(() => {
    // Extract query parameters from the URL

    const params = getQueryParams(location.search);

    if (!user?.token) {
      window.location.href = "https://octopod.co.in/payment/success";
    } else {
      const body = {
        razorpay_order_id: params?.razorpay_order_id || "",
      };
      if (location?.pathname == "/order-success") {
        verifyOrder(body, tokenHeader)
          .then((res) => {
            if (res.data.status == "success") {
              if (res.data.data.exists) {
                window.location.href = "https://octopod.co.in/payment/success";
              } else {
                setIsLoading(false);
              }
            } else if (res.data.status == "expired") {
              //logout user
              localStorage.clear();
              navigate("/login");
            } else if (res.data.status == "failed") {
              window.location.href = "https://octopod.co.in/payment/success";
            }
          })
          .catch((err) => {
            console.log("something went wrong!", err);
          });
      }else{
        setIsLoading(false)
      }
    }

    if (
      !params.razorpay_payment_id ||
      !params.razorpay_order_id ||
      !params.razorpay_signature
    ) {
      // If any of the required parameters are missing, handle error
      setPaymentDetails((prev) => ({
        ...prev,
        error: params.error_description || "Payment verification failed.",
      }));
    } else {
      // If all parameters are present, update the state
      setPaymentDetails((prev) => ({
        ...params,
        error: null, // No error
      }));
    }
  }, [location]);

  // Function to extract query parameters from URL
  const getQueryParams = (search) => {
    const params = new URLSearchParams(search);
    return {
      razorpay_payment_id: params.get("razorpay_payment_id"),
      razorpay_order_id: params.get("razorpay_order_id"),
      razorpay_signature: params.get("razorpay_signature"),
      error_code: params.get("error_code"), // if Razorpay sends an error code
      error_description: params.get("error_description"), // if Razorpay sends an error description
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    // redirect to home page when the timer reaches 0
    if (timer === 0) {
      navigate("/purchase/all-purchase", {
        state: `${paymentDetails?.error ? "failed" : "success"}`,
      });
    }
    // clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <>
      <PreventBackButton error={paymentDetails?.error} />
      {user?.token && !isLoading ? (
        <div className="row m-0">
          <div className="col-12 p-0">
            <div className="card h-100 d-flex mt-5">
              <div className="card-body">
                <div
                  className="login-main d-flex justify-content-center align-items-center"
                  style={{ height: "560px" }}
                >
                  <form className="theme-form">
                    <div className="text-center">
                      <div className="success-animation">
                        {paymentDetails?.error ? (
                          <img
                            alt="failed-order"
                            width={"150px"}
                            height={"150px"}
                            src={failedImg}
                          />
                        ) : (
                          <img
                            width={"200px"}
                            height={"200px"}
                            src={successImg}
                          />
                        )}
                      </div>
                      {paymentDetails.error ? (
                        <div>
                          <h4 className="text-danger mb-3 mt-3">
                            Payment Failed
                          </h4>
                          <p>Error: {paymentDetails.error}</p>
                        </div>
                      ) : (
                        <h4 className="text-success mb-3 mt-3">
                          Payment Successful! !
                        </h4>
                      )}

                      {paymentDetails?.error ? (
                        <> </>
                      ) : (
                        <>
                          {" "}
                          <h6>
                            Order ID:{" "}
                            <strong style={{ color: "#797be5" }}>
                              {paymentDetails.razorpay_order_id}
                            </strong>
                          </h6>
                          <h6>
                            Transaction ID:{" "}
                            <strong style={{ color: "#797be5" }}>
                              {paymentDetails.razorpay_payment_id}
                            </strong>
                          </h6>
                        </>
                      )}
                      <p style={{ textAlign: "center" }}>
                        You will be redirected to the purchase order page in{" "}
                        <b
                          style={{
                            color: `${
                              paymentDetails?.error ? "crimson" : "green"
                            }`,
                          }}
                        >
                          {timer}{" "}
                        </b>{" "}
                        seconds.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default OrderSuccess;

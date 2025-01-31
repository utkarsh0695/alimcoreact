// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { validateTokenAPI } from "../api/auth";

// const events = ["load", "mousemove", "mousedown", "click", "scroll", "keypress"];

// const AppLogout = ({ children }) => {
//   const token = localStorage.getItem("accessToken");
//   const navigate = useNavigate();
//   let timer;
//   const tokenHeader = {
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + `${token}`,
//     },
//   };

//   // this function sets the timer that logs out the user after 10 secs
//   const handleLogoutTimer = () => {
//     timer = setTimeout(() => {
//       // clears any pending timer.
//       resetTimer();
//       // Listener clean up. Removes the existing event listener from the window
//       Object.values(events).forEach((item) => {
//         window.removeEventListener(item, resetTimer);
//       });
//       // logs out user
//       logoutAction("session expired! due to inactivity");
//     }, 3600000); //! 3,600,000ms = 1hrs. You can change the time.
//   };

//   // this resets the timer if it exists.
//   const resetTimer = () => {
//     if (timer) clearTimeout(timer);
//   };

//   // when component mounts, it adds an event listeners to the window
//   // each time any of the event is triggered, i.e on mouse move, click, scroll, keypress etc, the timer to logout user after 24hrs of inactivity resets.
//   // However, if none of the event is triggered within 10 secs, that is app is inactive, the app automatically logs out.
//   useEffect(() => {
//     if (token) {
//       validateToken();
//       Object.values(events).forEach((item) => {
//         window.addEventListener(item, () => {
//           resetTimer();
//           handleLogoutTimer();
//         });
//       });
//     } else {
//       logoutAction("token not found!");
//     }
//   }, []);

//   // logs out user by clearing out auth token in localStorage and redirecting url to /login page.
//   const logoutAction = (msg) => {
//     localStorage.clear();
//     toast.error(msg);
//     navigate("/login");
//   };

//   // Function to validate token via API
//   const validateToken = async () => {
//     try {
//       const res = await validateTokenAPI({}, tokenHeader);
//       if (res?.data?.status === "failed") {
//         logoutAction(res?.data?.message);
//       }
//     } catch (error) {
//       logoutAction("Error validating token");
//     }
//   };

//   return children;
// };

// export default AppLogout;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validateTokenAPI } from "../api/auth";

const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];

const AppLogout = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  let timer;
  const [isLoggedOut, setIsLoggedOut] = useState(false); // State to track if user is logged out
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${token}`,
    },
  };

  // this function sets the timer that logs out the user after inactivity
  const handleLogoutTimer = () => {
    timer = setTimeout(() => {
      // clears any pending timer.
      resetTimer();
      // Listener clean up. Removes the existing event listener from the window
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
      // logs out user
      logoutAction("Session expired! Due to inactivity");
    }, 900000); // 15min (900000ms)
  };
  // this resets the timer if it exists.
  const resetTimer = () => {
    if (timer) clearTimeout(timer);
  };

  // Adds event listeners to reset the timer based on user activity
  useEffect(() => {
    if (token) {
      validateToken();
      Object.values(events).forEach((item) => {
        window.addEventListener(item, () => {
          resetTimer();
          handleLogoutTimer();
        });
      });
    } else {
      logoutAction("Token not found!");
    }
    // Cleanup: Remove event listeners when component unmounts
    return () => {
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
    };
  }, []);

  // Logs out user by clearing out auth token in localStorage and redirecting to /login
  const logoutAction = (msg) => {
    if (!isLoggedOut) {
      // Check if the user is already logged out
      localStorage.clear();
      setIsLoggedOut(true); // Set logout state to true to prevent future toasts
      toast.error(msg);
      navigate("/login");
    }
  };

  // Function to validate token via API
  const validateToken = async () => {
    try {
      const res = await validateTokenAPI({}, tokenHeader);
      if (res?.data?.status === "failed") {
        logoutAction(res?.data?.message);
      }
    } catch (error) {
      logoutAction("Error validating token");
    }
  };

  return children;
};

export default AppLogout;

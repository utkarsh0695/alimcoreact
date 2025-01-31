// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const PreventBackButton = (props) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handlePopState = (event) => {
//       event.preventDefault();
//       navigate(`${props?.error ? '/order-failed' : '/order-success'}`); // Redirect to your success page
//     };

//     window.addEventListener('popstate', handlePopState);

//     return () => {
//       window.removeEventListener('popstate', handlePopState);
//     };
//   }, [navigate]);

//   return null;
// };

// export default PreventBackButton;
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PreventBackButton = (props) => {
  useEffect(() => {
    // Push the current URL to the history stack
    window.history.pushState(null, null, window.location.href);

    // Listen for back button presses
    const handlePopState = () => {
      window.history.forward(); // Force the user to move forward again
    };

    // Attach the popstate event listener to handle browser back button clicks
    window.addEventListener("popstate", handlePopState);

    return () => {
      // Cleanup the event listener when the component unmounts
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  

  return null;
};

export default PreventBackButton;


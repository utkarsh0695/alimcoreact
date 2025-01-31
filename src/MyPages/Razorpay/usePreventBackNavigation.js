// import { useEffect } from 'react';

// const usePreventBackNavigation = () => {
//   useEffect(() => {
//     const hasReloaded = sessionStorage.getItem('hasReloaded');
    
//     // If page hasn't been reloaded yet, reload it and set the flag
//     if (!hasReloaded) {
//       sessionStorage.setItem('hasReloaded', 'true');
//       window.location.reload(true); // Force reload without cache
//       console.log("reloaded");
      
//     }

//     // Push the current state to the history stack
//     window.history.pushState(null, '', window.location.href);

//     // Listen for the popstate event, which is fired when the user clicks the back or forward button
//     const handlePopState = (event) => {
   
        
//       // Re-push the current state when they try to go back
//       window.history.pushState(null, '', window.location.href);
//     };

//     window.addEventListener('popstate', handlePopState);

//     return () => {
//       window.removeEventListener('popstate', handlePopState); // Cleanup event listener
//     };
//   }, []);
// };

// export default usePreventBackNavigation;

import { useEffect } from 'react';

const usePreventBackNavigation = () => {
  useEffect(() => {
    const hasReloaded = sessionStorage.getItem('hasReloaded');
    
    // If the page hasn't been reloaded yet, reload it and set the flag
    if (!hasReloaded) {
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.reload(true); // Force reload without cache
    }

    // Save the current URL (including search parameters)
    const currentUrl = window.location.href;

    // Push the current state to the history stack, preserving the URL with search parameters
    window.history.pushState(null, '', currentUrl);

    // Listen for the popstate event, which is fired when the user clicks the back or forward button
    const handlePopState = (event) => {
      // Re-push the current state when they try to go back
      window.history.pushState(null, '', currentUrl);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState); // Cleanup event listener
    };
  }, []);
};

export default usePreventBackNavigation;


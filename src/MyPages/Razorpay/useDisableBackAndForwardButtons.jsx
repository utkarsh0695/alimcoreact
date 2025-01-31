import { useEffect } from 'react';

const useDisableBackAndForwardButtons = () => {
  useEffect(() => {
    const handlePopState = (e) => {
      // Push a new state to prevent going back
      window.history.pushState(null, null, window.location.href);
    };

    // Override pushState and replaceState
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function () {
      originalPushState.apply(window.history, arguments);
      window.dispatchEvent(new Event('pushstate'));
    };

    window.history.replaceState = function () {
      originalReplaceState.apply(window.history, arguments);
      window.dispatchEvent(new Event('replacestate'));
    };

    // Add event listeners
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pushstate', handlePopState);
    window.addEventListener('replacestate', handlePopState);

    // Push a new state to the history stack to prevent initial back navigation
    window.history.pushState(null, null, window.location.href);

    // Cleanup event listeners on component unmount
    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pushstate', handlePopState);
      window.removeEventListener('replacestate', handlePopState);
    };
  }, []);
};

export default useDisableBackAndForwardButtons;

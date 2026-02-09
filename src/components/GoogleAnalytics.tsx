import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const GA_ID = 'G-KXRSCVDJY5';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const GoogleAnalytics = () => {
  const location = useLocation();
  const scriptLoaded = useRef(false);

  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;

    if (!scriptLoaded.current) {
      // Initialize dataLayer and gtag function
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());

      // Load the gtag.js script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);

      scriptLoaded.current = true;
    }

    // Send page view for every non-admin route change
    window.gtag('config', GA_ID, { page_path: location.pathname + location.search });
  }, [location, isAdmin]);

  return null;
};

export default GoogleAnalytics;

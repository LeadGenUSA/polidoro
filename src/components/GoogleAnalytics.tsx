import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const GA_ID = 'G-KXRSCVDJY5';
const CONSENT_KEY = 'cookie-consent';

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

  const loadGA = useCallback(() => {
    if (scriptLoaded.current) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    scriptLoaded.current = true;
  }, []);

  useEffect(() => {
    if (isAdmin) return;

    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') {
      loadGA();
      window.gtag('config', GA_ID, { page_path: location.pathname + location.search });
    }

    const onConsentUpdate = () => {
      if (localStorage.getItem(CONSENT_KEY) === 'accepted') {
        loadGA();
        window.gtag('config', GA_ID, { page_path: location.pathname + location.search });
      }
    };

    window.addEventListener('cookie-consent-updated', onConsentUpdate);
    return () => window.removeEventListener('cookie-consent-updated', onConsentUpdate);
  }, [location, isAdmin, loadGA]);

  return null;
};

export default GoogleAnalytics;

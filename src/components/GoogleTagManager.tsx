import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';

const GTM_ID = 'GTM-T3JB92H5';
const CONSENT_KEY = 'cookie-consent';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

const GoogleTagManager = () => {
  const location = useLocation();
  const scriptLoaded = useRef(false);
  const noscriptInjected = useRef(false);

  const isAdmin = location.pathname.startsWith('/admin');

  const loadGTM = useCallback(() => {
    if (scriptLoaded.current) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(script);

    // Add noscript fallback
    if (!noscriptInjected.current) {
      const noscript = document.createElement('noscript');
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
      iframe.height = '0';
      iframe.width = '0';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      noscript.appendChild(iframe);
      document.body.insertBefore(noscript, document.body.firstChild);
      noscriptInjected.current = true;
    }

    scriptLoaded.current = true;
  }, []);

  useEffect(() => {
    if (isAdmin) return;

    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') {
      loadGTM();
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'pageview',
        page_path: location.pathname + location.search,
      });
    }

    const onConsentUpdate = () => {
      if (localStorage.getItem(CONSENT_KEY) === 'accepted') {
        loadGTM();
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'pageview',
          page_path: location.pathname + location.search,
        });
      }
    };

    window.addEventListener('cookie-consent-updated', onConsentUpdate);
    return () => window.removeEventListener('cookie-consent-updated', onConsentUpdate);
  }, [location, isAdmin, loadGTM]);

  return null;
};

export default GoogleTagManager;

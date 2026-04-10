import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CONSENT_KEY = 'cookie-consent';


const GoogleTagManager = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;

    const grantConsent = () => {
      window.gtag?.('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
      });
    };

    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') {
      grantConsent();
    }

    // Push pageview
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'pageview',
      page_path: location.pathname + location.search,
    });

    const onConsentUpdate = () => {
      if (localStorage.getItem(CONSENT_KEY) === 'accepted') {
        grantConsent();
      }
    };

    window.addEventListener('cookie-consent-updated', onConsentUpdate);
    return () => window.removeEventListener('cookie-consent-updated', onConsentUpdate);
  }, [location, isAdmin]);

  return null;
};

export default GoogleTagManager;

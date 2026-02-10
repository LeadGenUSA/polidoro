import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

const CONSENT_KEY = 'cookie-consent';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    window.dispatchEvent(new Event('cookie-consent-updated'));
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    window.dispatchEvent(new Event('cookie-consent-updated'));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-primary-foreground p-4 shadow-large">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm">
          <Cookie className="w-5 h-5 shrink-0" />
          <p>
            We use cookies to analyze site traffic and improve your experience.{' '}
            <Link to="/privacy-policy" className="underline hover:text-secondary">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button variant="ghost" size="sm" onClick={handleDecline} className="text-primary-foreground hover:text-primary-foreground/80">
            Decline
          </Button>
          <Button variant="secondary" size="sm" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

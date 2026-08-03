import { useState, useEffect } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

// Cloudflare Turnstile Site Key (public - safe to store in code)
const TURNSTILE_SITE_KEY = '0x4AAAAAACbaweBfl9FA-5wp';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

const TurnstileWidget = ({ onVerify, onExpire, onError }: TurnstileWidgetProps) => {
  const [hasError, setHasError] = useState(false);

  // Patch window.turnstile.remove to prevent crash during unmount
  useEffect(() => {
    const patchTurnstile = () => {
      if (window.turnstile && typeof window.turnstile.remove !== 'function') {
        window.turnstile.remove = () => {};
      }
    };
    patchTurnstile();
    const interval = setInterval(patchTurnstile, 200);
    return () => clearInterval(interval);
  }, []);

  const handleError = () => {
    console.warn('Bot verification widget could not complete');
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <p className="text-xs text-muted-foreground">
        Bot verification could not load. Please refresh the page and try again.
      </p>
    );
  }

  return (
    <Turnstile
      siteKey={TURNSTILE_SITE_KEY}
      onSuccess={onVerify}
      onExpire={() => onExpire?.()}
      onError={handleError}
      options={{
        theme: 'light',
        size: 'normal',
      }}
    />
  );
};

export default TurnstileWidget;

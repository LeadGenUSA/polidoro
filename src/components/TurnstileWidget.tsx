import { Turnstile } from '@marsidev/react-turnstile';

// Cloudflare Turnstile Site Key (public - safe to store in code)
const TURNSTILE_SITE_KEY = '0x4AAAAAACbaweBfl9FA-5wp';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

const TurnstileWidget = ({ onVerify, onExpire }: TurnstileWidgetProps) => {
  return (
    <Turnstile
      siteKey={TURNSTILE_SITE_KEY}
      onSuccess={onVerify}
      onExpire={() => onExpire?.()}
      onError={() => onExpire?.()}
      options={{
        theme: 'light',
        size: 'normal',
      }}
    />
  );
};

export default TurnstileWidget;

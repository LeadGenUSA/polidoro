import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type TawkWindow = Window & typeof globalThis & {
  Tawk_API?: Record<string, unknown>;
  Tawk_LoadStart?: Date;
};

const TAWK_SCRIPT_ID = "tawkto-live-chat-script";
const TAWK_SRC = "https://embed.tawk.to/69e9175ecc1adc1c3390106b/1jmr86i45";

const cleanupTawk = () => {
  document.getElementById(TAWK_SCRIPT_ID)?.remove();

  document
    .querySelectorAll([
      'iframe[src*="tawk.to"]',
      'div[id^="tawk"]',
      'div[class*="tawk"]',
      'style[data-tawk]'
    ].join(","))
    .forEach((element) => element.remove());

  const tawkWindow = window as TawkWindow;
  delete tawkWindow.Tawk_API;
  delete tawkWindow.Tawk_LoadStart;
};

const LiveChatEmbed = () => {
  const location = useLocation();
  const isExcluded = location.pathname.startsWith("/blog") || location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isExcluded) {
      cleanupTawk();
      return;
    }

    if (document.getElementById(TAWK_SCRIPT_ID)) {
      return;
    }

    const tawkWindow = window as TawkWindow;
    tawkWindow.Tawk_API = tawkWindow.Tawk_API || {};
    tawkWindow.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.id = TAWK_SCRIPT_ID;
    script.async = true;
    script.src = TAWK_SRC;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    script.setAttribute("data-tawk", "true");
    document.body.appendChild(script);

    return () => {
      if (isExcluded) {
        cleanupTawk();
      }
    };
  }, [isExcluded, location.pathname]);

  return null;
};

export default LiveChatEmbed;
/// <reference types="vite/client" />

interface Window {
  gtag: (...args: unknown[]) => void;
  dataLayer: Record<string, unknown>[];
}

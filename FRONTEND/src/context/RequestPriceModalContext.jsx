import { createContext, useCallback, useContext, useMemo, useState } from "react";

// Single shared open/close state for the "Get in Touch" modal that the
// floating "Request Price" tab opens. Lets one modal component, mounted
// once in App.jsx, be triggered identically from any route (the homepage's
// own tab, and RequestPriceTab.jsx on every other page) instead of each
// page needing its own local popup implementation.
const RequestPriceModalContext = createContext(null);

export function RequestPriceModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  // `open`/`close` are referentially stable across renders (empty deps) on
  // purpose — LandingPage.jsx's 2-minute auto-popup effect depends on
  // `open`, and a new function identity every time `isOpen` toggles would
  // reset that timer any time the visitor manually opened/closed the modal
  // before the 2 minutes were up.
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return <RequestPriceModalContext.Provider value={value}>{children}</RequestPriceModalContext.Provider>;
}

export function useRequestPriceModal() {
  const ctx = useContext(RequestPriceModalContext);
  if (!ctx) {
    throw new Error("useRequestPriceModal must be used inside RequestPriceModalProvider");
  }
  return ctx;
}

import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ThankYouPage from "./pages/ThankYouPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ChatWidget from "./components/chat/ChatWidget";
import ScrollToTop from "./components/common/ScrollToTop";
import RequestPriceTab from "./components/common/RequestPriceTab";
import GetInTouchModal from "./components/common/GetInTouchModal";
import { RequestPriceModalProvider } from "./context/RequestPriceModalContext";

function App() {
  return (
    <RequestPriceModalProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-and-conditions" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <RequestPriceTab />
      <GetInTouchModal />
      <ChatWidget />
    </RequestPriceModalProvider>
  );
}

export default App;

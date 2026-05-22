import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ScanPage from "./pages/ScanPage";
import MarketplacePage from "./pages/MarketplacePage";
import ListingPage from "./pages/ListingPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DisassemblyPage from "./pages/DisassemblyPage";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import RefundPage from "./pages/RefundPage";

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafdfb] text-slate-800">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/list" element={<ListingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
          <Route path="/disassembly" element={<DisassemblyPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

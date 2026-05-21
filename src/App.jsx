import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ScanPage from "./pages/ScanPage";
import MarketplacePage from "./pages/MarketplacePage";
import ListingPage from "./pages/ListingPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DisassemblyPage from "./pages/DisassemblyPage";

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <footer className="py-6 text-center border-t border-[#e2ece6] text-[10px] text-slate-400 uppercase tracking-widest bg-white mt-auto">
        © {new Date().getFullYear()} EcoParts. Recycle. Reuse. Rebuild. Wiping Heavy Metals Out of Earth.
      </footer>
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

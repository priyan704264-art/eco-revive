import Scanner from "../components/Scanner";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, ArrowRight, Sparkles } from "lucide-react";

export default function ScanPage() {
  const [scannedComponents, setScannedComponents] = useState([]);

  return (
    <div className="min-h-screen pb-16 pt-6 bg-[#fafdfb] relative overflow-hidden">
      {/* Background glow backdrops (Light theme) */}
      <div className="absolute top-[10%] -left-[5%] w-[450px] h-[450px] opacity-20 bg-gradient-to-tr from-emerald-400 to-[#0F9D8A] rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10">
        <Scanner onComponentsSaved={setScannedComponents} />

        {/* Dynamic redirection shortcuts once components are saved */}
        {scannedComponents.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 mt-8 animate-fadeIn">
            <div className="bg-white border border-[#e2ece6] rounded-[2rem] p-8 shadow-xl shadow-[#0F9D8A]/5 space-y-4">
              <div className="flex items-center gap-2 text-[#0F9D8A] font-bold text-sm uppercase tracking-wider">
                <Sparkles size={16} />
                <span>Next Recovery Workstations</span>
              </div>
              <h3 className="text-xl font-black text-slate-800 leading-snug">
                Components saved successfully! View the safety guides or list them on the marketplace for instant cash.
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Link
                  to="/profile"
                  className="flex items-center justify-center gap-2 bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white py-4 rounded-xl font-bold transition shadow-lg shadow-[#0F9D8A]/20 active:scale-[0.98]"
                >
                  <User size={18} />
                  <span>View Vault & Extract Guides</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/marketplace"
                  className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-[#0F9D8A]/40 hover:bg-slate-50 text-slate-700 py-4 rounded-xl font-bold transition"
                >
                  <ShoppingCart size={18} className="text-slate-400" />
                  <span>Go to Marketplace</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

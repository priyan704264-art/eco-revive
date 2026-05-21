import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../lib/supabase";
import { User, Mail, Lock, MapPin, Sparkles, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Jaipur"];

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signUp(email, password, name, city || "Delhi");
      window.dispatchEvent(new Event("storage"));
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden bg-[#fafdfb]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#0F9D8A]/8 blur-[120px] pointer-events-none"></div>

      <div className="bg-white border border-[#e2ece6] rounded-3xl p-8 max-w-md w-full shadow-lg relative z-10 space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0F9D8A]/10 border border-[#0F9D8A]/20 flex items-center justify-center mx-auto mb-3 animate-float">
            <Sparkles className="text-[#0F9D8A] w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Create Recovery Profile</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Join regional hardware salvagers. Catalog components, reduce toxic e-waste, and trade inspected modules.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-600 text-center flex items-center justify-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                required
                placeholder="Priyanshu Kumar"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#f6faf8] border border-[#d1e8e2] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F9D8A] focus:bg-white text-sm transition"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#f6faf8] border border-[#d1e8e2] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F9D8A] focus:bg-white text-sm transition"
              />
            </div>
          </div>

          {/* Location / City Hub */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Local Trading Hub</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <select
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full pl-10 pr-8 py-3 bg-[#f6faf8] border border-[#d1e8e2] rounded-xl text-slate-700 focus:outline-none focus:border-[#0F9D8A] focus:bg-white text-sm transition appearance-none cursor-pointer"
              >
                <option value="">Select local city hub...</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Account Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Account Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#f6faf8] border border-[#d1e8e2] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F9D8A] focus:bg-white text-sm transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition shadow-md shadow-[#0F9D8A]/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {loading ? "Initializing Profile Vault..." : "Register Recovery Profile"}
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-[#e2ece6] text-center">
          <p className="text-xs text-slate-500">
            Already have a salvaging account?{" "}
            <Link to="/login" className="text-[#0F9D8A] hover:underline font-bold inline-flex items-center gap-0.5">
              <span>Sign In Here</span>
              <ArrowRight size={12} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

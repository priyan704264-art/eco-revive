import { Link } from "react-router-dom";
import { 
  Scan, ShoppingBag, ArrowRight, ShieldCheck, 
  Cpu, Leaf, Sparkles, User, Database, 
  ArrowUpRight, Heart, Star, CheckCircle, CreditCard, ShieldAlert
} from "lucide-react";

export default function Home() {
  // Stat Bar Items
  const stats = [
    {
      value: "25,000+",
      label: "Components Recovered",
      icon: (
        <svg className="w-6 h-6 text-[#0F9D8A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <path d="M9 9h6v6H9zM9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
        </svg>
      )
    },
    {
      value: "5,230 kg",
      label: "CO₂ Emissions Saved",
      icon: (
        <svg className="w-6 h-6 text-[#0F9D8A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z" className="opacity-20" />
        </svg>
      )
    },
    {
      value: "3,420 kg",
      label: "E-Waste Diverted",
      icon: (
        <svg className="w-6 h-6 text-[#0F9D8A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      )
    },
    {
      value: "10,000+",
      label: "Happy Users",
      icon: (
        <svg className="w-6 h-6 text-[#0F9D8A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    }
  ];

  // Component Categories (Custom SVGs)
  const components = [
    {
      name: "IC Chips",
      count: "1,250+ Items",
      icon: (
        <svg className="w-24 h-16" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Silicon body */}
          <rect x="25" y="20" width="70" height="40" rx="4" fill="#2d3748" />
          {/* Pins left */}
          <rect x="15" y="26" width="10" height="4" rx="1" fill="#cbd5e0" />
          <rect x="15" y="34" width="10" height="4" rx="1" fill="#cbd5e0" />
          <rect x="15" y="42" width="10" height="4" rx="1" fill="#cbd5e0" />
          <rect x="15" y="50" width="10" height="4" rx="1" fill="#cbd5e0" />
          {/* Pins right */}
          <rect x="95" y="26" width="10" height="4" rx="1" fill="#cbd5e0" />
          <rect x="95" y="34" width="10" height="4" rx="1" fill="#cbd5e0" />
          <rect x="95" y="42" width="10" height="4" rx="1" fill="#cbd5e0" />
          <rect x="95" y="50" width="10" height="4" rx="1" fill="#cbd5e0" />
          {/* Text/details on IC */}
          <circle cx="35" cy="30" r="2" fill="#718096" />
          <rect x="45" y="35" width="30" height="3" rx="1" fill="#4a5568" />
          <rect x="45" y="42" width="20" height="3" rx="1" fill="#4a5568" />
          {/* Corner highlights */}
          <rect x="26" y="21" width="68" height="1" fill="#718096" opacity="0.3" />
        </svg>
      )
    },
    {
      name: "Capacitors",
      count: "980+ Items",
      icon: (
        <svg className="w-24 h-16" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wire leads */}
          <line x1="60" y1="45" x2="60" y2="75" stroke="#a0aec0" strokeWidth="2" strokeLinecap="round" />
          <line x1="68" y1="45" x2="68" y2="70" stroke="#a0aec0" strokeWidth="2" strokeLinecap="round" />
          {/* Rubber base seal */}
          <ellipse cx="64" cy="45" rx="12" ry="4" fill="#4a5568" />
          {/* Cylinder body */}
          <rect x="52" y="10" width="24" height="34" rx="2" fill="#1a202c" />
          {/* Metallic Top cap */}
          <path d="M52 12C52 10.9 57.37 10 64 10C70.63 10 76 10.9 76 12V14H52V12Z" fill="#a0aec0" />
          {/* Negative terminal stripe */}
          <rect x="52" y="14" width="6" height="27" fill="#cbd5e0" />
          {/* Negative symbols inside stripe */}
          <rect x="54" y="18" width="2" height="1" fill="#4a5568" />
          <rect x="54" y="26" width="2" height="1" fill="#4a5568" />
          <rect x="54" y="34" width="2" height="1" fill="#4a5568" />
        </svg>
      )
    },
    {
      name: "Resistors",
      count: "1,100+ Items",
      icon: (
        <svg className="w-24 h-16" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wire lead extending straight through */}
          <line x1="15" y1="40" x2="105" y2="40" stroke="#cbd5e0" strokeWidth="2.5" strokeLinecap="round" />
          {/* Resistor ceramic body */}
          <rect x="35" y="30" width="50" height="20" rx="6" fill="#e2d9c8" stroke="#d6c3a5" strokeWidth="1" />
          {/* Resistor end caps */}
          <rect x="38" y="30" width="4" height="20" fill="#c4b295" />
          <rect x="78" y="30" width="4" height="20" fill="#c4b295" />
          {/* Color bands */}
          <rect x="47" y="30" width="3.5" height="20" fill="#9b2c2c" /> {/* Band 1: Brown/Red */}
          <rect x="55" y="30" width="3.5" height="20" fill="#1a202c" /> {/* Band 2: Black */}
          <rect x="63" y="30" width="3.5" height="20" fill="#dd6b20" /> {/* Band 3: Orange */}
          <rect x="73" y="30" width="3.5" height="20" fill="#d69e2e" /> {/* Band 4: Gold */}
        </svg>
      )
    },
    {
      name: "Motors",
      count: "620+ Items",
      icon: (
        <svg className="w-24 h-16" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Motor Shaft */}
          <rect x="95" y="37" width="15" height="6" rx="1" fill="#cbd5e0" />
          {/* Front Bearing Cap */}
          <rect x="85" y="30" width="10" height="20" rx="2" fill="#718096" />
          {/* Motor body cylinder */}
          <rect x="35" y="20" width="50" height="40" rx="6" fill="#a0aec0" />
          {/* Casing grooves */}
          <line x1="45" y1="20" x2="45" y2="60" stroke="#718096" strokeWidth="1.5" />
          <line x1="55" y1="20" x2="55" y2="60" stroke="#718096" strokeWidth="1.5" />
          <line x1="65" y1="20" x2="65" y2="60" stroke="#718096" strokeWidth="1.5" />
          <line x1="75" y1="20" x2="75" y2="60" stroke="#718096" strokeWidth="1.5" />
          {/* Back cap (plastic) */}
          <path d="M35 20C35 20 28 24 28 40C28 56 35 60 35 60V20Z" fill="#4a5568" />
          {/* Terminals */}
          <rect x="22" y="28" width="6" height="4" rx="1" fill="#dd6b20" />
          <rect x="22" y="48" width="6" height="4" rx="1" fill="#3182ce" />
        </svg>
      )
    },
    {
      name: "Sensors",
      count: "540+ Items",
      icon: (
        <svg className="w-24 h-16" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* PCB Board */}
          <rect x="25" y="15" width="70" height="50" rx="3" fill="#2f855a" stroke="#22543d" strokeWidth="1" />
          {/* Mounting holes */}
          <circle cx="30" cy="20" r="2" fill="#cbd5e0" />
          <circle cx="30" cy="60" r="2" fill="#cbd5e0" />
          <circle cx="90" cy="20" r="2" fill="#cbd5e0" />
          <circle cx="90" cy="60" r="2" fill="#cbd5e0" />
          {/* Sensor element (Ultrasonic/Optical receiver style) */}
          <circle cx="48" cy="40" r="10" fill="#4a5568" stroke="#cbd5e0" strokeWidth="1.5" />
          <circle cx="48" cy="40" r="6" fill="#1a202c" />
          <circle cx="72" cy="40" r="10" fill="#4a5568" stroke="#cbd5e0" strokeWidth="1.5" />
          <circle cx="72" cy="40" r="6" fill="#1a202c" />
          {/* Connector Pins */}
          <rect x="52" y="65" width="3" height="6" fill="#d69e2e" />
          <rect x="58" y="65" width="3" height="6" fill="#d69e2e" />
          <rect x="64" y="65" width="3" height="6" fill="#d69e2e" />
        </svg>
      )
    },
    {
      name: "Connectors",
      count: "760+ Items",
      icon: (
        <svg className="w-24 h-16" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Connector Body */}
          <rect x="20" y="25" width="80" height="30" rx="2" fill="#1a202c" />
          {/* Pin rows */}
          <rect x="25" y="30" width="4" height="8" rx="0.5" fill="#d69e2e" />
          <rect x="33" y="30" width="4" height="8" rx="0.5" fill="#d69e2e" />
          <rect x="41" y="30" width="4" height="8" rx="0.5" fill="#d69e2e" />
          <rect x="49" y="30" width="4" height="8" rx="0.5" fill="#d69e2e" />
          <rect x="57" y="30" width="4" height="8" rx="0.5" fill="#d69e2e" />
          <rect x="65" y="30" width="4" height="8" rx="0.5" fill="#d69e2e" />
          <rect x="73" y="30" width="4" height="8" rx="0.5" fill="#d69e2e" />
          <rect x="81" y="30" width="4" height="8" rx="0.5" fill="#d69e2e" />
          <rect x="89" y="30" width="4" height="8" rx="0.5" fill="#d69e2e" />
          {/* Bottom clips */}
          <path d="M15 35H20V45H15V35Z" fill="#a0aec0" />
          <path d="M100 35H105V45H100V35Z" fill="#a0aec0" />
          {/* Lock latches */}
          <path d="M40 20H45V25H40V20Z" fill="#1a202c" />
          <path d="M75 20H80V25H75V20Z" fill="#1a202c" />
        </svg>
      )
    }
  ];

  // How It Works Steps
  const steps = [
    {
      num: "1",
      title: "Scan",
      desc: "Scan your electronic item using our AI scanner",
      icon: (
        <div className="w-14 h-14 rounded-2xl bg-[#0F9D8A]/5 border border-[#0F9D8A]/20 flex items-center justify-center text-[#0F9D8A]">
          <Scan size={26} />
        </div>
      )
    },
    {
      num: "2",
      title: "Analyze",
      desc: "AI identifies components and estimates value",
      icon: (
        <div className="w-14 h-14 rounded-2xl bg-[#0F9D8A]/5 border border-[#0F9D8A]/20 flex items-center justify-center text-[#0F9D8A]">
          <Cpu size={26} />
        </div>
      )
    },
    {
      num: "3",
      title: "List or Recycle",
      desc: "List components for sale or send for recycling",
      icon: (
        <div className="w-14 h-14 rounded-2xl bg-[#0F9D8A]/5 border border-[#0F9D8A]/20 flex items-center justify-center text-[#0F9D8A]">
          <ShoppingBag size={26} />
        </div>
      )
    },
    {
      num: "4",
      title: "Earn & Impact",
      desc: "Earn money and contribute to a greener planet",
      icon: (
        <div className="w-14 h-14 rounded-2xl bg-[#0F9D8A]/5 border border-[#0F9D8A]/20 flex items-center justify-center text-[#0F9D8A]">
          <Leaf size={26} />
        </div>
      )
    }
  ];

  // Feature Highlights
  const features = [
    {
      title: "AI-Powered Scanning",
      desc: "Accurate component detection using advanced AI",
      icon: (
        <svg className="w-6 h-6 text-[#0F9D8A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="m10 15 5-3-5-3v6Z" fill="currentColor" className="opacity-10" />
          <path d="M12 2v20M2 12h20M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      )
    },
    {
      title: "Secure Payments",
      desc: "Safe & secure transactions with Razorpay",
      icon: (
        <svg className="w-6 h-6 text-[#0F9D8A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    },
    {
      title: "Quality Assurance",
      desc: "Tested & verified components for reliability",
      icon: (
        <svg className="w-6 h-6 text-[#0F9D8A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 11 2 2 4-4" />
        </svg>
      )
    },
    {
      title: "Eco-Friendly",
      desc: "Reduce e-waste and build a sustainable future",
      icon: (
        <svg className="w-6 h-6 text-[#0F9D8A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 2 5.5a7 7 0 0 1-7 7h-3M11 20H2" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-[#fafdfb] text-slate-800 font-sans min-h-screen relative overflow-hidden pb-16">
      
      {/* Organic background leaf decor elements (top right/left blurred shadows) */}
      <div className="absolute top-[8%] -right-[5%] w-[450px] h-[450px] opacity-10 bg-gradient-to-br from-emerald-400 to-[#0F9D8A] rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[35%] -left-[10%] w-[350px] h-[350px] opacity-10 bg-gradient-to-tr from-teal-400 to-[#0F9D8A] rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Subtle floating leafy SVG decorations */}
      <svg className="absolute top-[18%] left-[4%] w-12 h-12 text-[#0F9D8A] opacity-[0.06] animate-pulse" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 18H9v-2h6v2zm3-4H6V7h12v9z" className="hidden" />
        <path d="M21 3C19 2 17 2 15 2c-3.3 0-6 2.7-6 6c0 .7.1 1.4.4 2.1L2.1 17.4c-.6.6-.6 1.5 0 2.1c.3.3.7.4 1.1.4c.4 0 .8-.1 1.1-.4l7.3-7.3c.7.3 1.4.4 2.1.4c3.3 0 6-2.7 6-6c0-2-1-3-3-5zm-6 7c-2.2 0-4-1.8-4-4c0-.4.1-.8.2-1.2C12.3 5.4 13.6 6 15 6c2.2 0 4 1.8 4 4c0 .4-.1.8-.2 1.2c-1.1-.6-2.4-1.2-3.8-1.2z" />
      </svg>
      <svg className="absolute top-[55%] right-[3%] w-16 h-16 text-emerald-600 opacity-[0.05]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.5 2 2 6.5 2 12c0 2.8 1.1 5.3 3 7.1V22h4v-3h6v3h4v-2.9c1.9-1.8 3-4.3 3-7.1c0-5.5-4.5-10-10-10zm0 15c-2.8 0-5-2.2-5-5s2.2-5 5-5s5 2.2 5 5s-2.2 5-5 5z" className="hidden" />
        <path d="M17 2.001C15.9 2 13.9 3 12.9 4c-.9-1-2.9-2-4-2c-2.2 0-4 1.8-4 4c0 4.1 4 8.5 7.1 11.6c.3.3.6.4.9.4s.6-.1.9-.4c3.1-3.1 7.1-7.5 7.1-11.6c0-2.2-1.8-4-4-4zm-4.1 12.2c-2.2-2.2-5.4-5.7-5.9-7.2c.4-.3 1-.5 1.5-.5c1.1 0 2.2.8 3.1 1.7c.3.3.6.4.9.4s.6-.1.9-.4c.9-.9 2-1.7 3.1-1.7c.6 0 1.2.2 1.5.5c-.5 1.5-3.7 5-5.9 7.2z" />
      </svg>

      {/* Main Workspace Wrapper */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* 1. HERO SECTION */}
        <section className="pt-16 pb-16 lg:pt-24 lg:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Text & CTAs */}
          <div className="lg:col-span-5 space-y-7 animate-fadeIn">
            {/* Green sustainable pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F9D8A]/10 border border-[#0F9D8A]/20 text-xs font-bold text-[#0F9D8A] w-fit shadow-sm">
              <Leaf size={14} className="fill-[#0F9D8A]/20" />
              <span>Building a Sustainable Future</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-slate-900 leading-[1.1] max-w-xl">
              Turn E-Waste Into <span className="bg-gradient-to-r from-[#0F9D8A] to-emerald-600 bg-clip-text text-transparent">Value & Impact</span>
            </h1>

            {/* Subheadline */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-lg">
              Scan, recover, resell and recycle electronic components with our AI-powered platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/scan"
                className="px-7 py-4 bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white font-bold rounded-2xl text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-[#0F9D8A]/20 hover:shadow-[#0F9D8A]/35 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Scan size={18} />
                <span>Scan E-Waste Now</span>
              </Link>
              <Link
                to="/marketplace"
                className="px-7 py-4 border-2 border-[#0F9D8A] text-[#0F9D8A] hover:bg-[#0F9D8A]/5 font-bold rounded-2xl text-sm inline-flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <ShoppingBag size={18} />
                <span>Explore Marketplace</span>
              </Link>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center gap-3.5 pt-4">
              <div className="flex -space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                  alt="User avatar 1"
                  className="w-9 h-9 rounded-full border-2 border-[#fafdfb] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
                  alt="User avatar 2"
                  className="w-9 h-9 rounded-full border-2 border-[#fafdfb] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
                  alt="User avatar 3"
                  className="w-9 h-9 rounded-full border-2 border-[#fafdfb] object-cover"
                />
              </div>
              <p className="text-xs font-semibold text-slate-500">
                Trusted by <span className="text-[#0F9D8A] font-extrabold">10,000+ users</span> across India
              </p>
            </div>
          </div>

          {/* Right: Composite Graphics (Phone Mockup + Ewaste Bin + Floating Card) */}
          <div className="lg:col-span-7 relative flex justify-center items-center h-[520px] w-full mt-10 lg:mt-0">
            
            {/* 1. Plant sprouting background behind the cards */}
            <div className="absolute right-[8%] bottom-[5%] w-[160px] h-[220px] pointer-events-none z-0">
              <svg className="w-full h-full text-emerald-700/80 animate-pulse-subtle" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Sprout Stem */}
                <path d="M50 120 C50 90, 52 50, 65 25" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
                <path d="M50 120 C50 100, 40 70, 32 45" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
                {/* Sprout Leaves */}
                <path d="M65 25 C62 10, 80 5, 82 25 C82 35, 70 35, 65 25Z" fill="#34D399" />
                <path d="M32 45 C35 30, 15 28, 20 48 C20 58, 28 55, 32 45Z" fill="#059669" />
                <path d="M56 70 C62 55, 80 62, 72 75 C68 80, 60 76, 56 70Z" fill="#10B981" />
                {/* Little soil mound */}
                <path d="M30 115 C45 110, 55 110, 70 115" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>

            {/* 2. Green E-waste recycling bin from public asset */}
            <div className="absolute left-[5%] top-[10%] w-[260px] h-[260px] pointer-events-none drop-shadow-xl z-0 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <img
                src="/ewaste_recycling_bin_and_plant.png"
                alt="Green recycling bin filled with e-waste parts next to plant sprout"
                className="w-full h-full object-contain"
              />
            </div>

            {/* 3. Smartphone Mockup with AI Scanner */}
            <div className="absolute left-[33%] top-[4%] w-[235px] h-[480px] rounded-[36px] bg-slate-900 p-2.5 shadow-2xl border-4 border-slate-950 z-10 transform translate-x-2">
              {/* Internal Screen Area */}
              <div className="w-full h-full rounded-[28px] bg-slate-950 overflow-hidden flex flex-col justify-between text-white font-sans text-xs relative select-none">
                
                {/* Notch/Camera */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-b-xl z-20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                </div>

                {/* Scan Header */}
                <div className="pt-6 px-4 pb-2 border-b border-white/5 flex items-center justify-between text-[10px] tracking-wide text-slate-400 font-bold bg-slate-900/60 z-10">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Scan Result</span>
                  </div>
                  <span>Analysis Complete</span>
                </div>

                {/* Simulated Motherboard Scan Area */}
                <div className="flex-1 bg-slate-900/40 relative flex items-center justify-center p-2.5 overflow-hidden">
                  
                  {/* Motherboard Grid Drawing */}
                  <svg className="w-full h-full opacity-65 stroke-slate-850" viewBox="0 0 120 180" fill="none">
                    <rect x="10" y="10" width="100" height="160" rx="4" stroke="#1e293b" strokeWidth="2" />
                    <line x1="25" y1="10" x2="25" y2="170" stroke="#1e293b" strokeWidth="1" />
                    <line x1="85" y1="10" x2="85" y2="170" stroke="#1e293b" strokeWidth="1" />
                    <line x1="10" y1="60" x2="110" y2="60" stroke="#1e293b" strokeWidth="1" />
                    <line x1="10" y1="120" x2="110" y2="120" stroke="#1e293b" strokeWidth="1" />
                    {/* Chip block */}
                    <rect x="40" y="70" width="40" height="40" rx="3" fill="#1e293b" stroke="#334155" />
                    <circle cx="60" cy="90" r="10" fill="#334155" />
                    {/* Ports */}
                    <rect x="15" y="15" width="25" height="15" rx="1" fill="#334155" opacity="0.5" />
                    <rect x="80" y="15" width="25" height="15" rx="1" fill="#334155" opacity="0.5" />
                  </svg>

                  {/* Laser Scan line animation */}
                  <div className="absolute left-0 right-0 h-[2px] bg-emerald-500/50 shadow-md shadow-emerald-500 animate-bounce top-1/4"></div>

                  {/* 4 Bounding Boxes */}
                  {/* Capacitor */}
                  <div className="absolute top-[16%] left-[16%] border border-emerald-500 bg-emerald-500/5 px-1 rounded-[3px] text-[8px] font-bold text-emerald-400 scale-[0.85] pointer-events-none">
                    <span className="block border-b border-emerald-500/20 pb-0.5 font-black uppercase text-[5px]">Capacitor</span>
                    <span>980pF</span>
                  </div>
                  {/* IC Chip */}
                  <div className="absolute top-[38%] left-[34%] border border-emerald-500 bg-emerald-500/5 p-1 rounded-[3px] text-[8px] font-bold text-emerald-400 scale-[0.85] pointer-events-none">
                    <span className="block border-b border-emerald-500/20 pb-0.5 font-black uppercase text-[5px]">IC Chip</span>
                    <span>ATMEL328</span>
                  </div>
                  {/* Resistor */}
                  <div className="absolute bottom-[24%] left-[18%] border border-emerald-500 bg-emerald-500/5 px-1 rounded-[3px] text-[8px] font-bold text-emerald-400 scale-[0.85] pointer-events-none">
                    <span className="block border-b border-emerald-500/20 pb-0.5 font-black uppercase text-[5px]">Resistor</span>
                    <span>10kΩ</span>
                  </div>
                  {/* Connector */}
                  <div className="absolute bottom-[28%] right-[18%] border border-emerald-500 bg-emerald-500/5 px-1 rounded-[3px] text-[8px] font-bold text-emerald-400 scale-[0.85] pointer-events-none">
                    <span className="block border-b border-emerald-500/20 pb-0.5 font-black uppercase text-[5px]">Connector</span>
                    <span>Header</span>
                  </div>
                </div>

                {/* Scan Results details overlay */}
                <div className="p-3 bg-slate-900 border-t border-white/5 space-y-2 rounded-t-[20px] z-10 shadow-inner">
                  <div className="space-y-1 text-[11px] font-semibold text-slate-300">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Components Found</span>
                      <strong className="text-white font-extrabold">47</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Est. Value</span>
                      <strong className="text-emerald-400 font-extrabold">₹840</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>CO₂ Saved</span>
                      <strong className="text-[#0f9d8a] font-extrabold">12.3 kg</strong>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors">
                    View Details
                  </button>
                </div>

              </div>
            </div>

            {/* 4. Floating Analytics Impact Card */}
            <div className="absolute right-[5%] top-[15%] w-[215px] bg-white/95 border border-[#e2ece6] rounded-3xl p-5 shadow-2xl backdrop-blur-md z-20 space-y-4 hover:translate-y-[-4px] transition-transform duration-300 select-none">
              <h3 className="font-extrabold text-slate-900 text-xs tracking-tight border-b border-slate-100 pb-2">
                Your Impact This Month
              </h3>

              <div className="space-y-3 text-[11px] font-bold text-slate-600">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#0F9D8A]/10 border border-[#0F9D8A]/20 flex items-center justify-center text-[#0F9D8A]">
                    <Cpu size={12} />
                  </div>
                  <div>
                    <div className="text-slate-900 font-black leading-none">47</div>
                    <div className="text-[9px] text-slate-400 font-medium">Components Recovered</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                    <Leaf size={12} />
                  </div>
                  <div>
                    <div className="text-slate-900 font-black leading-none">12.3 kg</div>
                    <div className="text-[9px] text-slate-400 font-medium">CO₂ Emissions Saved</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-900 font-black leading-none">8.5 kg</div>
                    <div className="text-[9px] text-slate-400 font-medium">E-Waste Diverted</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#0f9d8a]/15 border border-[#0f9d8a]/20 flex items-center justify-center text-[#0F9D8A]">
                    <span className="font-extrabold text-[10px]">₹</span>
                  </div>
                  <div>
                    <div className="text-slate-900 font-black leading-none">₹840</div>
                    <div className="text-[9px] text-slate-400 font-medium">Earned</div>
                  </div>
                </div>
              </div>

              <Link
                to="/dashboard"
                className="flex items-center gap-1 text-[10px] text-[#0F9D8A] font-extrabold tracking-wider uppercase pt-2 border-t border-slate-100 hover:text-[#0c7c6c] transition-colors"
              >
                <span>View Full Impact</span>
                <ArrowRight size={12} />
              </Link>
            </div>

          </div>

        </section>

        {/* 2. STATS SECTION */}
        <section className="py-8 border-t border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, idx) => (
              <div 
                key={idx}
                className="bg-white/60 border border-[#e2ece6] rounded-3xl p-5 text-center flex flex-col items-center justify-center space-y-2.5 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0F9D8A]/5 border border-[#0F9D8A]/10 flex items-center justify-center shadow-inner">
                  {stat.icon}
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 block leading-tight">
                    {stat.value}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. POPULAR COMPONENTS SECTION */}
        <section className="py-16 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Shop Popular Components</span>
              </h2>
              <div className="w-10 h-1 bg-[#0F9D8A] rounded mt-2"></div>
            </div>
            
            <Link
              to="/marketplace"
              className="flex items-center gap-1 text-xs text-[#0F9D8A] font-bold tracking-wider uppercase hover:text-[#0c7c6c] transition-colors"
            >
              <span>View All Components</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Components Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {components.map((item, idx) => (
              <Link
                key={idx}
                to="/marketplace"
                className="bg-white border border-[#e2ece6] hover:border-[#0F9D8A]/30 rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-2xl hover:shadow-[#0F9D8A]/10 transition-all duration-300 transform hover:-translate-y-1 h-[175px] group"
              >
                {/* SVG Visual container */}
                <div className="flex-1 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  {item.icon}
                </div>
                
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-sm text-slate-800 group-hover:text-[#0F9D8A] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold">
                    {item.count}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. HOW IT WORKS SECTION */}
        <section className="py-16 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">How It Works</h2>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Simple steps towards a sustainable tomorrow</p>
            <div className="w-12 h-1 bg-[#0F9D8A] rounded mx-auto mt-2.5"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-4 group relative z-10">
                
                {/* Connecting arrow drawing (Desktop only, between steps) */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-7 left-[72%] w-[56%] h-[2px] border-t-2 border-dashed border-slate-200 pointer-events-none"></div>
                )}
                
                {/* Circular indicator container with icon */}
                <div className="relative">
                  {step.icon}
                  
                  {/* Step index circle */}
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-slate-900 border-2 border-[#fafdfb] rounded-full text-white text-[10px] font-black flex items-center justify-center shadow-md">
                    {step.num}
                  </span>
                </div>

                <div className="space-y-1.5 max-w-xs">
                  <h3 className="font-black text-base text-slate-800 group-hover:text-[#0F9D8A] transition-colors">
                    {step.num}. {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FEATURE HIGHLIGHTS SECTION */}
        <section className="py-8">
          <div className="bg-[#f0f7f3] border border-[#dcebe1] rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 shadow-sm">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#dcebe1] flex items-center justify-center shadow-sm">
                  {feature.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-sm text-slate-800">
                    {feature.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-xs md:max-w-none">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

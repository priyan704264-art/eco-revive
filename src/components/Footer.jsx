import { Link } from "react-router-dom";
import { Leaf, Mail, Github, Instagram, Twitter, ArrowRight, Cpu, ShoppingBag, Scan, Wrench, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const links = {
    Platform: [
      { label: "Scan E-Waste",       to: "/scan" },
      { label: "Marketplace",        to: "/marketplace" },
      { label: "Disassembly Guides", to: "/disassembly" },
      { label: "My Profile",         to: "/profile" },
    ],
    Company: [
      { label: "About ReCupare",  to: "/about" },
      { label: "How It Works",    to: "/how-it-works" },
      { label: "Impact Report",   to: "/profile" },
      { label: "Admin Panel",     to: "/admin" },
    ],
    Legal: [
      { label: "Privacy Policy",    to: "/privacy" },
      { label: "Terms of Service",  to: "/terms" },
      { label: "Refund Policy",     to: "/refund" },
      { label: "Cookie Policy",     to: "/privacy" },
    ],
  };

  return (
    <footer className="bg-slate-900 text-white mt-auto">

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="ReCupare" className="h-10 w-auto object-contain"
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
              <span className="hidden text-xl font-black text-[#0F9D8A]">ReCupare</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              India's first AI-powered e-waste recovery platform. Scan, recover, resell and recycle electronic components — reducing toxic waste one component at a time.
            </p>

            {/* Features pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: <Cpu size={11} />,        label: "AI Detection" },
                { icon: <ShieldCheck size={11} />, label: "Verified Sellers" },
                { icon: <Leaf size={11} />,        label: "Eco Impact" },
                { icon: <Wrench size={11} />,      label: "Disassembly Guides" },
              ].map(f => (
                <span key={f.label} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full">
                  <span className="text-[#0F9D8A]">{f.icon}</span>
                  {f.label}
                </span>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-1">
              {[
                { icon: <Github size={16} />,    href: "https://github.com/priyan704264-art/eco-revive", label: "GitHub" },
                { icon: <Instagram size={16} />, href: "#", label: "Instagram" },
                { icon: <Twitter size={16} />,   href: "#", label: "Twitter" },
                { icon: <Mail size={16} />,      href: "mailto:hello@recupare.in", label: "Email" },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#0F9D8A] border border-slate-700 hover:border-[#0F9D8A] flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section} className="space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">{section}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-slate-400 hover:text-[#0F9D8A] transition-colors flex items-center gap-1.5 group"
                    >
                      <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#0F9D8A] -ml-3 group-hover:ml-0" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            © {year} ReCupare. Made with <Heart size={11} className="text-rose-500 fill-rose-500" /> in India.
            Wiping Heavy Metals Out of Earth.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-500 font-bold">All systems operational</span>
          </div>
        </div>
      </div>

    </footer>
  );
}

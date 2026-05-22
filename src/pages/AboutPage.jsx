import { Link } from "react-router-dom";
import { Leaf, Cpu, ShieldCheck, Users, Recycle, ArrowRight, Target, Heart, Globe } from "lucide-react";

export default function AboutPage() {
  const team = [
    { name: "Aaryav", role: "Founder & CEO", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=aaryav" },
    { name: "Priyanshu", role: "Tech Lead", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=priyanshu" },
    { name: "Arjun", role: "Operations", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=arjun" },
  ];

  const values = [
    { icon: <Leaf size={22} className="text-[#0F9D8A]" />, title: "Sustainability First", desc: "Every decision we make is guided by its environmental impact. We exist to reduce e-waste, not just profit from it." },
    { icon: <ShieldCheck size={22} className="text-[#0F9D8A]" />, title: "Trust & Transparency", desc: "Verified sellers, graded components, and honest pricing. No hidden fees, no fake listings." },
    { icon: <Cpu size={22} className="text-[#0F9D8A]" />, title: "AI-Powered Accuracy", desc: "Our YOLO-based detection model identifies components with 95%+ accuracy, giving you real market valuations." },
    { icon: <Users size={22} className="text-[#0F9D8A]" />, title: "Community Driven", desc: "Built for India's growing maker, repair, and recycling community. Local hubs, local prices, local impact." },
  ];

  return (
    <div className="bg-[#fafdfb] min-h-screen">

      {/* Hero */}
      <section className="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F9D8A]/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F9D8A]/20 border border-[#0F9D8A]/30 text-xs font-bold text-[#0F9D8A]">
            <Leaf size={13} /> Our Story
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">
            We're on a mission to <span className="text-[#0F9D8A]">wipe heavy metals</span> out of Indian landfills
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            ReCupare was born from a simple observation — millions of working electronic components are thrown away every year in India because people don't know their value.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-4 py-16 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Target size={28} className="text-[#0F9D8A]" />, label: "Mission", text: "Make e-waste recovery accessible, profitable, and impactful for every Indian household and repair shop." },
            { icon: <Globe size={28} className="text-[#0F9D8A]" />, label: "Vision", text: "A circular electronics economy where no working component ever reaches a landfill." },
            { icon: <Heart size={28} className="text-[#0F9D8A]" />, label: "Impact", text: "25,000+ components recovered, 5,230 kg CO₂ saved, and 10,000+ users across India." },
          ].map(item => (
            <div key={item.label} className="bg-white border border-[#e2ece6] rounded-2xl p-6 space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#0F9D8A]/10 flex items-center justify-center">{item.icon}</div>
              <h3 className="font-black text-slate-800 text-lg">{item.label}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-white border-y border-[#e2ece6] py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">What We Stand For</h2>
            <p className="text-slate-500 text-sm mt-2">The principles that guide every feature we build</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(v => (
              <div key={v.title} className="flex gap-4 p-5 rounded-2xl border border-[#e2ece6] hover:border-[#0F9D8A]/30 hover:shadow-sm transition">
                <div className="w-11 h-11 rounded-xl bg-[#0F9D8A]/10 flex items-center justify-center flex-shrink-0">{v.icon}</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{v.title}</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4 py-16 space-y-10">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">The Team</h2>
          <p className="text-slate-500 text-sm mt-2">Building India's e-waste recovery future</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {team.map(m => (
            <div key={m.name} className="bg-white border border-[#e2ece6] rounded-2xl p-6 text-center space-y-3 shadow-sm w-48">
              <img src={m.avatar} alt={m.name} className="w-16 h-16 rounded-2xl mx-auto border-2 border-[#0F9D8A]/20" />
              <div>
                <p className="font-black text-slate-800">{m.name}</p>
                <p className="text-xs text-slate-400 font-medium">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#0F9D8A] to-emerald-600 py-14 px-4 text-center text-white">
        <h2 className="text-2xl sm:text-3xl font-black mb-3">Join the movement</h2>
        <p className="text-white/80 text-sm mb-6">Start recovering value from your e-waste today</p>
        <Link to="/scan" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#0F9D8A] font-black rounded-2xl text-sm hover:bg-slate-50 transition shadow-lg">
          Start Scanning <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}

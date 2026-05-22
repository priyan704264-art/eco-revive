import { Link } from "react-router-dom";
import { Scan, Cpu, ShoppingBag, Leaf, ArrowRight, CheckCircle, Wrench, Camera, Upload, Tag, IndianRupee } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01", icon: <Scan size={28} className="text-[#0F9D8A]" />,
      title: "Scan Your Device",
      desc: "Use your camera or upload a photo of your electronic device or circuit board. Our AI vision system powered by YOLO instantly identifies all recoverable components.",
      tips: ["Works with laptops, phones, PCBs, and more", "Upload any image — camera or gallery", "Results in under 5 seconds"],
    },
    {
      num: "02", icon: <Cpu size={28} className="text-[#0F9D8A]" />,
      title: "AI Analyzes Components",
      desc: "Our AI identifies each component, grades its condition (A/B/C), estimates its market value in INR, and flags any safety risks before extraction.",
      tips: ["95%+ detection accuracy", "Real-time market pricing", "Safety warnings included"],
    },
    {
      num: "03", icon: <Wrench size={28} className="text-[#0F9D8A]" />,
      title: "Follow Disassembly Guide",
      desc: "Get a step-by-step AI-generated guide in English and Hindi for safely extracting each component. Includes tools needed, safety warnings, and pro tips.",
      tips: ["Bilingual guides (English + Hindi)", "Tool requirements listed", "Safety-first approach"],
    },
    {
      num: "04", icon: <Tag size={28} className="text-[#0F9D8A]" />,
      title: "List on Marketplace",
      desc: "Save components to your inventory and list them on the marketplace in seconds. Set your price, add a description, and choose your city hub.",
      tips: ["3% platform fee only", "Sell or donate options", "City-based local trading"],
    },
    {
      num: "05", icon: <IndianRupee size={28} className="text-[#0F9D8A]" />,
      title: "Get Paid Securely",
      desc: "Buyers pay via Razorpay — India's most trusted payment gateway. Payments are verified and earnings tracked in your profile dashboard.",
      tips: ["Razorpay secured payments", "Instant payment verification", "Earnings tracked in profile"],
    },
    {
      num: "06", icon: <Leaf size={28} className="text-[#0F9D8A]" />,
      title: "Track Your Impact",
      desc: "Every component you recover earns you Eco Points and contributes to your personal impact score — CO₂ saved, e-waste diverted, and total earnings.",
      tips: ["CO₂ savings calculated", "Eco level system", "Monthly impact reports"],
    },
  ];

  return (
    <div className="bg-[#fafdfb] min-h-screen">

      {/* Hero */}
      <section className="bg-slate-900 text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F9D8A]/15 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F9D8A]/20 border border-[#0F9D8A]/30 text-xs font-bold text-[#0F9D8A]">
            Simple Process
          </div>
          <h1 className="text-3xl sm:text-5xl font-black">How ReCupare Works</h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From scan to sale in minutes. Here's exactly how the platform works.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        {steps.map((step, i) => (
          <div key={step.num} className={`flex flex-col md:flex-row gap-6 items-start ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
            {/* Number + icon */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#0F9D8A]/10 border border-[#0F9D8A]/20 flex items-center justify-center">
                {step.icon}
              </div>
              <span className="text-3xl font-black text-slate-200">{step.num}</span>
            </div>
            {/* Content */}
            <div className="flex-1 bg-white border border-[#e2ece6] rounded-2xl p-6 shadow-sm space-y-4 hover:border-[#0F9D8A]/30 hover:shadow-md transition">
              <h3 className="text-lg font-black text-slate-800">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              <ul className="space-y-1.5">
                {step.tips.map(tip => (
                  <li key={tip} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <CheckCircle size={13} className="text-[#0F9D8A] flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="bg-white border-y border-[#e2ece6] py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl font-black text-slate-800 text-center">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is it free to list components?", a: "Yes. Listing is completely free. We only charge a 3% platform fee when your component sells." },
              { q: "How accurate is the AI detection?", a: "Our YOLO-based model achieves 95%+ accuracy on common laptop and PC components. For rare components, Groq Vision AI provides additional analysis." },
              { q: "How do I get paid?", a: "Payments are processed via Razorpay. Once a buyer completes payment and it's verified, your earnings are tracked in your profile dashboard." },
              { q: "What if my component doesn't sell?", a: "You can keep it in your inventory indefinitely, update the price, or choose to donate it to a local repair shop." },
              { q: "Is it safe to disassemble electronics?", a: "Our guides include detailed safety warnings. Always power off devices, remove batteries, and use anti-static equipment before disassembly." },
            ].map(faq => (
              <div key={faq.q} className="border border-[#e2ece6] rounded-2xl p-5 space-y-2">
                <h4 className="font-bold text-slate-800 text-sm">{faq.q}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 text-center">
        <h2 className="text-2xl font-black text-slate-800 mb-3">Ready to start?</h2>
        <p className="text-slate-500 text-sm mb-6">It takes less than 2 minutes to scan your first device.</p>
        <Link to="/scan" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white font-black rounded-2xl text-sm transition shadow-lg shadow-[#0F9D8A]/20">
          Scan Now <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}

import { useState } from "react";
import { AlertTriangle, Wrench, ShieldAlert, ArrowRight, ArrowLeft, CheckCircle, Lightbulb, PlayCircle, X } from "lucide-react";

export default function DisassemblyGuide({ componentName, deviceType, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  // Mocked guide data
  const steps = [
    {
      title: "Preparation & Safety",
      titleHi: "तैयारी और सुरक्षा",
      desc: "Before starting, ensure the device is completely powered off and unplugged. Ground yourself using an anti-static wrist strap to prevent ESD damage.",
      descHi: "शुरू करने से पहले, सुनिश्चित करें कि डिवाइस पूरी तरह से बंद और अनप्लग है।",
      warning: "Always wear safety goggles. Batteries can explode if punctured.",
      tools: ["Anti-static strap", "Safety goggles", "Rubber mat"],
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Remove Outer Casing",
      titleHi: "बाहरी केसिंग निकालें",
      desc: "Locate the screws on the back panel. Carefully unscrew them using a Phillips #1 screwdriver. Keep screws organized on a magnetic mat.",
      descHi: "बैक पैनल पर स्क्रू ढूंढें और उन्हें सावधानी से खोलें।",
      warning: null,
      tools: ["Phillips #1 Screwdriver", "Magnetic Mat"],
      image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: `Locate ${componentName}`,
      titleHi: `${componentName} का पता लगाएँ`,
      desc: `Identify the ${componentName} on the main logic board. It is typically held down by retaining clips or a specialized bracket.`,
      descHi: `मदरबोर्ड पर ${componentName} को पहचानें।`,
      warning: "Do not touch the gold contact pins directly.",
      tools: ["Spudger", "Tweezers"],
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Disconnect & Extract",
      titleHi: "डिस्कनेक्ट करें और निकालें",
      desc: `Gently push the retaining clips outward to release the ${componentName}. Pull it out at a 30-degree angle. Place it inside an anti-static bag immediately.`,
      descHi: `क्लिप्स को बाहर की ओर धकेलें और ${componentName} को धीरे से बाहर निकालें।`,
      warning: "Applying too much force can snap the logic board.",
      tools: ["Anti-static bag"],
      image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[90vh] text-slate-800 font-sans border border-slate-100 relative">
      
      {/* Close Button */}
      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition">
          <X size={20} />
        </button>
      )}

      {/* Left Area: Media & Visuals */}
      <div className="w-full md:w-1/2 bg-slate-900 relative flex flex-col justify-between">
        
        <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-widest">Live Interactive Guide</span>
        </div>

        <div className="relative flex-1 h-[300px] md:h-auto overflow-hidden">
           <img 
             src={step.image} 
             alt={step.title} 
             className="w-full h-full object-cover opacity-80" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
           
           <button className="absolute inset-0 m-auto w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition transform hover:scale-110">
             <PlayCircle size={32} />
           </button>
        </div>

        <div className="p-6 md:p-8 relative z-10">
           <h4 className="text-[#0F9D8A] text-[10px] font-bold uppercase tracking-widest mb-2">Extraction Target</h4>
           <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
             {deviceType} • {componentName}
           </h2>
        </div>
      </div>

      {/* Right Area: Instructions & Controls */}
      <div className="w-full md:w-1/2 flex flex-col bg-white">
        
        {/* Progress Header */}
        <div className="px-8 pt-8 pb-4 border-b border-slate-100">
          <div className="flex justify-between items-end mb-3">
             <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">
               Step {currentStep + 1} of {steps.length}
             </span>
             <span className="text-xs font-bold text-[#0F9D8A]">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
             <div 
               className="h-full bg-gradient-to-r from-emerald-400 to-[#0F9D8A] transition-all duration-500 ease-out"
               style={{ width: `${progress}%` }}
             ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              {step.title}
            </h1>
            <h2 className="text-sm font-semibold text-slate-500 mt-1 flex items-center gap-2">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Hindi</span>
              {step.titleHi}
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-slate-700 leading-relaxed font-medium">
              {step.desc}
            </p>
            <p className="text-slate-500 text-sm leading-relaxed border-l-2 border-slate-200 pl-4 italic">
              {step.descHi}
            </p>
          </div>

          {/* Tools Required */}
          {step.tools && (
            <div className="bg-[#f0f7f3] border border-[#dcebe1] rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[#0F9D8A] uppercase tracking-wider flex items-center gap-1.5">
                <Wrench size={14} /> Tools Required
              </h4>
              <div className="flex flex-wrap gap-2">
                {step.tools.map((tool, i) => (
                  <span key={i} className="bg-white border border-[#dcebe1] text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-[#0F9D8A]"/> {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {step.warning && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex gap-3 shadow-sm">
              <AlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Safety Critical</h4>
                <p className="text-orange-800 text-sm font-medium leading-relaxed">{step.warning}</p>
              </div>
            </div>
          )}

          {/* Safety Tip Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3">
            <Lightbulb className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pro Tip</h4>
              <p className="text-slate-700 text-sm font-medium leading-relaxed">Take photos of the board before removing cables so you remember where they go during reassembly.</p>
            </div>
          </div>

        </div>

        {/* Footer Navigation Controls */}
        <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-5 py-2.5 rounded-xl text-slate-500 font-bold text-sm flex items-center gap-2 hover:bg-slate-100 transition disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft size={16} /> Previous
          </button>
          
          {currentStep === steps.length - 1 ? (
            <button
               onClick={onClose}
               className="px-6 py-2.5 rounded-xl bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#0F9D8A]/20 transition transform hover:-translate-y-0.5 active:scale-95"
            >
              Finish Guide <CheckCircle size={16} />
            </button>
          ) : (
            <button
               onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
               className="px-6 py-2.5 rounded-xl bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#0F9D8A]/20 transition transform hover:-translate-y-0.5 active:scale-95"
            >
              Next Step <ArrowRight size={16} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

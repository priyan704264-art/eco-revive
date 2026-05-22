import { useState, useEffect } from "react";
import { AlertTriangle, Wrench, ShieldAlert, ArrowRight, ArrowLeft, CheckCircle, Lightbulb, PlayCircle, X, Loader2 } from "lucide-react";
import { generateGuide } from "../lib/groq";

// Step image pool for visual variety
const STEP_IMAGES = [
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80",
];

export default function DisassemblyGuide({ componentName, deviceType, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [guideData, setGuideData] = useState(null);
  const [loadingGuide, setLoadingGuide] = useState(true);
  const [guideError, setGuideError] = useState(null);

  useEffect(() => {
    setCurrentStep(0);
    setLoadingGuide(true);
    setGuideError(null);
    setGuideData(null);

    generateGuide(deviceType, componentName)
      .then((result) => {
        if (result.success && result.guide) {
          setGuideData(result.guide);
        } else {
          setGuideError("Could not load guide. Please try again.");
        }
      })
      .catch(() => setGuideError("Failed to generate guide."))
      .finally(() => setLoadingGuide(false));
  }, [componentName, deviceType]);

  // Map guide steps to the internal format expected by the UI
  const steps = guideData
    ? guideData.steps.map((s, i) => ({
        title: s.title,
        titleHi: s.hindi_instruction ? s.hindi_instruction.split(".")[0] : s.title,
        desc: s.instruction,
        descHi: s.hindi_instruction || "",
        warning: s.safety_flag ? s.safety_note : null,
        tools: i === 0 ? (guideData.tools_needed || []) : [],
        tip: s.tip || null,
        image: STEP_IMAGES[i % STEP_IMAGES.length],
      }))
    : [];

  const step = steps[currentStep] || {};
  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[90vh] text-slate-800 font-sans border border-slate-100 relative">
      
      {/* Close Button */}
      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition">
          <X size={20} />
        </button>
      )}

      {/* Loading overlay */}
      {loadingGuide && (
        <div className="absolute inset-0 z-40 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-3xl">
          <Loader2 className="w-10 h-10 text-[#0F9D8A] animate-spin" />
          <p className="text-sm font-bold text-slate-600">Generating AI guide for <span className="text-[#0F9D8A]">{componentName}</span>…</p>
        </div>
      )}

      {/* Error overlay */}
      {guideError && !loadingGuide && (
        <div className="absolute inset-0 z-40 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-3xl p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-orange-400" />
          <p className="text-sm font-bold text-slate-600">{guideError}</p>
          {onClose && (
            <button onClick={onClose} className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition">
              Close
            </button>
          )}
        </div>
      )}

      {/* Left Area: Media & Visuals */}
      <div className="w-full md:w-1/2 bg-slate-900 relative flex flex-col justify-between">
        
        <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-widest">Live Interactive Guide</span>
        </div>

        <div className="relative h-[200px] sm:h-[260px] md:h-auto overflow-hidden">
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
           <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight">
             {deviceType} • {componentName}
           </h2>
        </div>
      </div>

      {/* Right Area: Instructions & Controls */}
      <div className="w-full md:w-1/2 flex flex-col bg-white">
        
        {/* Progress Header */}
        <div className="px-4 sm:px-8 pt-5 sm:pt-8 pb-4 border-b border-slate-100">
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-5 sm:space-y-6 custom-scrollbar">
          
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
          {step.tip && (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3">
              <Lightbulb className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pro Tip</h4>
                <p className="text-slate-700 text-sm font-medium leading-relaxed">{step.tip}</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Controls */}
        <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-slate-100 bg-white flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0 || steps.length === 0}
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
               disabled={steps.length === 0}
               className="px-6 py-2.5 rounded-xl bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#0F9D8A]/20 transition transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              Next Step <ArrowRight size={16} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

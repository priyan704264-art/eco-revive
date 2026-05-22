import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { enrichDetectedComponents } from "../lib/groq";
import { saveDevice, saveComponent, uploadComponentImage, updateImpact, getUser } from "../lib/supabase";
import {
  Camera, Upload, AlertTriangle, CheckCircle, RefreshCw,
  Box, Zap, Download, ShoppingBag, ShieldCheck, Activity,
  Target, Wifi, WifiOff, ChevronDown, ChevronUp, Tag
} from "lucide-react";
import DisassemblyGuide from "./DisassemblyGuide";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

// ── Step 1: Call YOUR YOLO model ──────────────────────────────────────────
async function runYOLODetection(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);
  const res = await fetch(`${BACKEND_URL}/detect`, {
    method: "POST",
    body: formData,
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`YOLO server error: ${res.status}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "YOLO detection failed");
  return data.predictions || [];
}

const GRADE_COLORS = {
  A: "bg-emerald-50 text-emerald-700 border-emerald-200",
  B: "bg-amber-50 text-amber-700 border-amber-200",
  C: "bg-rose-50 text-rose-700 border-rose-200",
};
const REUSE_COLORS = {
  High: "text-emerald-600 bg-emerald-50 border-emerald-100",
  Medium: "text-amber-600 bg-amber-50 border-amber-100",
  Low: "text-rose-500 bg-rose-50 border-rose-100",
};

export default function Scanner({ onComponentsSaved }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("idle");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Detection stages
  const [stage, setStage] = useState(""); // "yolo" | "groq" | "done" | "error"
  const [yoloPredictions, setYoloPredictions] = useState([]);
  const [components, setComponents] = useState([]);
  const [error, setError] = useState("");

  // Per-component state
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [activeGuide, setActiveGuide] = useState(null);

  // Save state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedComponents, setSavedComponents] = useState([]);

  const webcamRef = useRef(null);
  const fileRef = useRef(null);

  // ── Capture from webcam ──────────────────────────────────────────────────
  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    fetch(imageSrc)
      .then(r => r.blob())
      .then(blob => {
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        setImageFile(file);
        runDetection(file);
      });
    setMode("result");
  }, [webcamRef]);

  // ── Upload from file ─────────────────────────────────────────────────────
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImage(URL.createObjectURL(file));
    setMode("result");
    runDetection(file);
  };

  // ── MAIN DETECTION PIPELINE ──────────────────────────────────────────────
  // Step 1 → YOLO  →  Step 2 → Groq enrichment
  const runDetection = async (file) => {
    setStage("yolo");
    setError("");
    setComponents([]);
    setYoloPredictions([]);
    setSaved(false);
    setSavedComponents([]);

    let predictions = [];
    try {
      predictions = await runYOLODetection(file);
      setYoloPredictions(predictions);
    } catch (err) {
      setError(`❌ YOLO model unreachable: ${err.message}\n\nMake sure your Railway backend is running at:\n${BACKEND_URL}`);
      setStage("error");
      return;
    }

    if (predictions.length === 0) {
      setError("No components detected by the model. Try a clearer image of the circuit board.");
      setStage("error");
      return;
    }

    // Step 2 — Groq enrichment
    setStage("groq");
    const detectedClasses = [...new Set(predictions.map(p => p.class))];
    try {
      const enriched = await enrichDetectedComponents(detectedClasses);
      // Attach bounding box data from YOLO to each enriched component
      const withBoxes = enriched.map((comp, i) => {
        const match = predictions.find(p =>
          p.class.toLowerCase().includes(comp.name.toLowerCase().split(" ")[0].toLowerCase()) ||
          comp.name.toLowerCase().includes(p.class.toLowerCase())
        ) || predictions[i] || null;
        return { ...comp, box: match?.box || null, confidence: match?.confidence ? Math.round(match.confidence * 100) : 90 };
      });
      setComponents(withBoxes);
      setStage("done");
    } catch (err) {
      setError(`❌ Groq enrichment failed: ${err.message}`);
      setStage("error");
    }
  };

  // ── Save all to inventory ────────────────────────────────────────────────
  const saveToInventory = async () => {
    setSaving(true);
    try {
      const user = await getUser();
      if (!user) throw new Error("Please log in first!");
      let uploadedUrl = null;
      if (imageFile) uploadedUrl = await uploadComponentImage(imageFile, user.id);
      const device = await saveDevice({ user_id: user.id, type: "laptop/pc", photo_url: uploadedUrl, scan_result: components });
      const savedComps = [];
      for (const comp of components) {
        const s = await saveComponent({
          device_id: device.id, user_id: user.id,
          name: comp.name, hindi_name: comp.hindi_name,
          grade: comp.grade, reuse_potential: comp.reuse_potential,
          safety_risk: comp.safety_risk || "Safe",
          estimated_value_inr: comp.estimated_value_inr,
          image_url: uploadedUrl || "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=300&h=200&q=80",
          status: "in_inventory"
        });
        savedComps.push(s);
        await updateImpact(user.id, comp).catch(() => {});
      }
      setSavedComponents(savedComps);
      setSaved(true);
      if (onComponentsSaved) onComponentsSaved(components);
    } catch (err) {
      setError("Failed to save: " + err.message);
    }
    setSaving(false);
  };

  const reset = () => {
    setMode("idle"); setImage(null); setImageFile(null);
    setComponents([]); setYoloPredictions([]);
    setError(""); setSaved(false); setStage("");
    setExpandedIdx(null);
  };

  const totalValue = components.reduce((s, c) => s + (c.estimated_value_inr || 0), 0);
  const isLoading = stage === "yolo" || stage === "groq";

  return (
    <div className="font-sans px-4 sm:px-6 lg:px-8 flex flex-col items-center">

      {/* ── Header ── */}
      <header className="w-full max-w-[1400px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Target className="text-[#0F9D8A]" /> AI Vision Scanner
            <span className="text-[#0F9D8A] animate-pulse text-sm ml-1">● Live</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">
            YOLO Detection → Groq Enrichment Pipeline
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white border border-slate-100 rounded-xl px-3 py-2 flex flex-col items-end shadow-sm">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Model</span>
            <span className="text-xs font-black text-[#0F9D8A] flex items-center gap-1">
              <Wifi size={11} /> best.pt
            </span>
          </div>
          <div className="bg-white border border-slate-100 rounded-xl px-3 py-2 flex flex-col items-end shadow-sm">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Enrichment</span>
            <span className="text-xs font-black text-violet-500">Groq LLM</span>
          </div>
          {yoloPredictions.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-xl px-3 py-2 flex flex-col items-end shadow-sm">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Detections</span>
              <span className="text-xs font-black text-slate-800">{yoloPredictions.length}</span>
            </div>
          )}
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="w-full max-w-[1400px] flex flex-col lg:flex-row gap-6">

        {/* Viewfinder */}
        <div className="flex-1 bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm flex flex-col min-h-[460px]">

          {/* IDLE */}
          {mode === "idle" && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-8 text-center">
              <div className="w-24 h-24 rounded-3xl bg-[#0F9D8A]/5 border border-[#0F9D8A]/10 flex items-center justify-center">
                <Camera className="w-10 h-10 text-[#0F9D8A]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">Scan Your E-Waste</h2>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                  Point at a circuit board or component. Your YOLO model detects it, Groq enriches the data.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button onClick={() => setMode("camera")}
                  className="px-6 py-3 bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white font-bold rounded-2xl transition shadow-lg shadow-[#0F9D8A]/20 flex items-center justify-center gap-2">
                  <Camera size={17} /> Use Camera
                </button>
                <button onClick={() => fileRef.current.click()}
                  className="px-6 py-3 bg-white border border-slate-200 hover:border-[#0F9D8A]/40 text-slate-600 font-bold rounded-2xl transition flex items-center justify-center gap-2">
                  <Upload size={17} /> Upload Image
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </div>
            </div>
          )}

          {/* CAMERA */}
          {mode === "camera" && (
            <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden">
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />
              <div className="absolute inset-8 border-2 border-[#0F9D8A]/60 rounded-3xl pointer-events-none">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#0F9D8A] rounded-tl-3xl" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#0F9D8A] rounded-tr-3xl" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#0F9D8A] rounded-bl-3xl" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#0F9D8A] rounded-br-3xl" />
              </div>
              <div className="absolute bottom-6 flex gap-3">
                <button onClick={capturePhoto}
                  className="px-6 py-3 bg-[#0F9D8A] text-white font-bold rounded-full shadow-lg flex items-center gap-2 text-sm">
                  <Target size={15} /> Capture & Analyze
                </button>
                <button onClick={reset}
                  className="px-6 py-3 bg-white/90 text-slate-700 font-bold rounded-full text-sm">Cancel</button>
              </div>
            </div>
          )}

          {/* RESULT */}
          {mode === "result" && (
            <div className="flex-1 relative bg-slate-50 flex items-center justify-center overflow-hidden min-h-[300px]">
              {image && <img src={image} alt="Scan" className="w-full h-full object-contain" />}

              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                    <Activity className="w-8 h-8 text-[#0F9D8A] animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-slate-800 text-sm uppercase tracking-widest">
                      {stage === "yolo" ? "Running YOLO Detection..." : "Groq Enriching Data..."}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {stage === "yolo" ? `Sending to ${BACKEND_URL}/detect` : "Calling Groq LLM for component details"}
                    </p>
                  </div>
                  {/* Pipeline progress */}
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className={`px-3 py-1 rounded-full border ${stage === "yolo" ? "bg-[#0F9D8A] text-white border-[#0F9D8A]" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>
                      {stage === "yolo" ? "⟳ YOLO" : "✓ YOLO"}
                    </span>
                    <span className="text-slate-300">→</span>
                    <span className={`px-3 py-1 rounded-full border ${stage === "groq" ? "bg-violet-500 text-white border-violet-500" : "bg-slate-100 text-slate-400 border-slate-200"}`}>
                      {stage === "groq" ? "⟳ Groq" : "Groq"}
                    </span>
                  </div>
                </div>
              )}

              {/* Reset button */}
              <button onClick={reset}
                className="absolute top-4 left-4 bg-white/90 text-slate-600 p-2 rounded-xl border border-slate-200 hover:text-[#0F9D8A] transition shadow-sm z-20">
                <RefreshCw size={16} />
              </button>
            </div>
          )}
        </div>

        {/* ── Results sidebar ── */}
        {mode === "result" && !isLoading && (
          <div className="w-full lg:w-[480px] flex flex-col gap-4">

            {/* Error state */}
            {stage === "error" && (
              <div className="bg-white border border-rose-200 rounded-2xl p-6 space-y-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <WifiOff size={18} className="text-rose-500" />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-sm">Detection Failed</p>
                    <p className="text-[10px] text-slate-400 font-medium">Pipeline error</p>
                  </div>
                </div>
                <pre className="text-xs text-rose-600 bg-rose-50 rounded-xl p-3 whitespace-pre-wrap leading-relaxed border border-rose-100">
                  {error}
                </pre>
                <button onClick={reset}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition">
                  Try Again
                </button>
              </div>
            )}

            {/* Components list — each with its own actions */}
            {stage === "done" && components.length > 0 && (
              <>
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-black text-slate-800 flex items-center gap-2 text-base">
                      <Box size={18} className="text-[#0F9D8A]" />
                      {components.length} Components Detected
                    </h3>
                    <span className="text-xl font-black text-[#0F9D8A]">₹{totalValue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <span className="text-emerald-500">✓ YOLO</span>
                    <span>→</span>
                    <span className="text-violet-500">✓ Groq</span>
                    <span>→</span>
                    <span className="text-slate-500">{yoloPredictions.length} raw detections</span>
                  </div>
                </div>

                {/* Per-component cards */}
                <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                  {components.map((comp, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                      {/* Card header */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-slate-800 text-sm leading-snug">{comp.name}</h4>
                            {comp.hindi_name && (
                              <p className="text-[10px] text-slate-400 italic mt-0.5">{comp.hindi_name}</p>
                            )}
                          </div>
                          <span className="text-lg font-black text-[#0F9D8A] flex-shrink-0">₹{comp.estimated_value_inr}</span>
                        </div>

                        {/* Badges row */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${GRADE_COLORS[comp.grade] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                            Grade {comp.grade}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${REUSE_COLORS[comp.reuse_potential] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                            {comp.reuse_potential} Reuse
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-slate-50 text-slate-500 border-slate-200">
                            {comp.confidence}% conf
                          </span>
                          {comp.safety_risk && comp.safety_risk !== "Safe" && (
                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border bg-orange-50 text-orange-600 border-orange-200">
                              ⚠ {comp.safety_risk}
                            </span>
                          )}
                        </div>

                        {/* Safety note */}
                        {comp.safety_note && (
                          <p className="text-[10px] text-slate-500 mt-2 leading-relaxed bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-100">
                            💡 {comp.safety_note}
                          </p>
                        )}
                      </div>

                      {/* Per-component action buttons */}
                      <div className="border-t border-slate-100 grid grid-cols-3 divide-x divide-slate-100">
                        <button
                          onClick={() => setActiveGuide(comp)}
                          className="py-2.5 text-[10px] font-bold text-[#0F9D8A] hover:bg-[#0F9D8A]/5 transition flex items-center justify-center gap-1"
                        >
                          <Zap size={11} /> Guide
                        </button>
                        <button
                          onClick={() => {
                            const saved = savedComponents.find(s => s.name === comp.name);
                            if (saved) navigate("/list", { state: { component: saved } });
                            else setError("Save scan first, then list.");
                          }}
                          className="py-2.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1"
                        >
                          <Tag size={11} /> List
                        </button>
                        <button
                          onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                          className="py-2.5 text-[10px] font-bold text-slate-400 hover:bg-slate-50 transition flex items-center justify-center gap-1"
                        >
                          {expandedIdx === idx ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                          {expandedIdx === idx ? "Less" : "More"}
                        </button>
                      </div>

                      {/* Expanded details */}
                      {expandedIdx === idx && (
                        <div className="px-4 pb-4 pt-2 space-y-1.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-600">
                          {comp.location && <p><span className="font-bold text-slate-500">Location:</span> {comp.location}</p>}
                          {comp.removal_difficulty && <p><span className="font-bold text-slate-500">Removal:</span> {comp.removal_difficulty}</p>}
                          {comp.grade_reason && <p><span className="font-bold text-slate-500">Grade reason:</span> {comp.grade_reason}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Save + total actions */}
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Est. Value</span>
                    <span className="text-2xl font-black text-[#0F9D8A]">₹{totalValue}</span>
                  </div>
                  {!saved ? (
                    <button onClick={saveToInventory} disabled={saving}
                      className="w-full bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-[#0F9D8A]/20 flex items-center justify-center gap-2 disabled:opacity-50">
                      {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      {saving ? "Saving to Vault..." : "Save All to Inventory"}
                    </button>
                  ) : (
                    <div className="w-full bg-emerald-50 border border-emerald-100 text-emerald-600 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Saved! Click Guide or List on each component above.
                    </div>
                  )}
                  <button onClick={reset}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-2.5 rounded-xl font-bold text-sm transition border border-slate-200">
                    Scan Another
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Disassembly guide modal — per component */}
      {activeGuide && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-5xl relative h-[90vh]">
            <DisassemblyGuide
              componentName={activeGuide.name}
              deviceType="Laptop/PC"
              onClose={() => setActiveGuide(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

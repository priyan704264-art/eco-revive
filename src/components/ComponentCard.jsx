import { Wrench, Tag, ShieldCheck, Cpu, Database } from "lucide-react";

const GRADE_PILLS = {
  A: "bg-emerald-50 text-emerald-700 border-emerald-200",
  B: "bg-amber-50 text-amber-700 border-amber-200",
  C: "bg-rose-50 text-rose-700 border-rose-200",
};

const REUSE_COLORS = {
  High:   "text-emerald-600",
  Medium: "text-amber-600",
  Low:    "text-rose-500",
};

export default function ComponentCard({ component, onDisassemble, onList }) {
  return (
    <div className="bg-white border border-[#e2ece6] hover:border-[#0F9D8A]/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-[#0F9D8A]/10 transition-all duration-300 flex flex-col h-full group">
      {/* Component image header */}
      <div className="relative h-40 bg-slate-50 flex items-center justify-center overflow-hidden border-b border-[#e2ece6]">
        {component.image_url ? (
          <img
            src={component.image_url}
            alt={component.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <Cpu size={40} className="stroke-[1.5] mb-2" />
            <span className="text-xs uppercase tracking-widest font-bold">Hardware</span>
          </div>
        )}
        {/* Quality grade floating pill */}
        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-sm
          ${GRADE_PILLS[component.grade] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
          Grade {component.grade}
        </span>
      </div>

      {/* Card body details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
            <Database size={12} className="text-[#0F9D8A]" />
            <span>Inventory Item</span>
          </div>

          <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-[#0F9D8A] transition-colors">
            {component.name}
          </h3>
          {component.hindi_name && (
            <p className="text-xs text-slate-400 mt-1 font-medium italic">
              {component.hindi_name}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-[#f6faf8] rounded-xl p-2.5 border border-[#e2ece6]">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Est. Value</span>
              <span className="text-sm font-black text-[#0F9D8A]">₹{component.estimated_value_inr}</span>
            </div>
            <div className="bg-[#f6faf8] rounded-xl p-2.5 border border-[#e2ece6]">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Reuse Rate</span>
              <span className={`text-sm font-black ${REUSE_COLORS[component.reuse_potential] || "text-slate-600"}`}>
                {component.reuse_potential}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 space-y-2 pt-2 border-t border-[#e2ece6]">
          <button
            onClick={() => onDisassemble(component)}
            className="w-full py-2.5 rounded-xl border border-[#e2ece6] bg-white hover:bg-[#f6faf8] hover:border-[#0F9D8A]/30 text-slate-700 font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-1.5"
          >
            <Wrench size={13} className="text-[#0F9D8A]" />
            <span>Disassembly Guide</span>
          </button>
          
          {component.status === "in_inventory" && (
            <button
              onClick={() => onList(component)}
              className="w-full py-2.5 rounded-xl bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-1.5 shadow-md shadow-[#0F9D8A]/20 active:scale-[0.98]"
            >
              <Tag size={13} />
              <span>List on Marketplace</span>
            </button>
          )}

          {component.status === "listed" && (
            <div className="w-full py-2 bg-[#0F9D8A]/10 border border-[#0F9D8A]/20 text-[#0F9D8A] font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-1.5">
              <ShieldCheck size={14} />
              <span>Listed on Marketplace</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

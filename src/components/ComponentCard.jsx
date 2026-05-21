import { Wrench, Tag, ShieldCheck, Cpu, Database } from "lucide-react";

const GRADE_PILLS = {
  A: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  B: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  C: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function ComponentCard({ component, onDisassemble, onList }) {
  return (
    <div className="glass-panel border border-slate-700/40 hover:border-blue-500/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col h-full group">
      {/* Component image header */}
      <div className="relative h-40 bg-slate-950 flex items-center justify-center overflow-hidden">
        {component.image_url ? (
          <img
            src={component.image_url}
            alt={component.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-600">
            <Cpu size={40} className="stroke-[1.5] mb-2 text-slate-500 animate-pulse-subtle" />
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Hardware</span>
          </div>
        )}
        {/* Quality grade floating pill */}
        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-sm
          ${GRADE_PILLS[component.grade] || "bg-slate-800 text-slate-400 border-slate-700"}`}>
          Grade {component.grade}
        </span>
      </div>

      {/* Card body details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
            <Database size={12} className="text-blue-500" />
            <span>Inventory Item</span>
          </div>

          <h3 className="font-bold text-white text-base leading-snug group-hover:text-blue-400 transition-colors">
            {component.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium italic">
            {component.hindi_name}
          </p>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-850">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Est. Market Value</span>
              <span className="text-sm font-black text-emerald-400">₹{component.estimated_value_inr}</span>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-850">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Reuse Rate</span>
              <span className="text-sm font-black text-slate-200">{component.reuse_potential}</span>
            </div>
          </div>
        </div>

        {/* Action button drawers */}
        <div className="mt-5 space-y-2 pt-2 border-t border-slate-850">
          <button
            onClick={() => onDisassemble(component)}
            className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-100 font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-1.5"
          >
            <Wrench size={13} className="text-blue-400" />
            <span>Disassembly Guide</span>
          </button>
          
          {component.status === "in_inventory" && (
            <button
              onClick={() => onList(component)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-slate-100 font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10 active:scale-[0.98]"
            >
              <Tag size={13} className="text-white" />
              <span>List on Marketplace</span>
            </button>
          )}

          {component.status === "listed" && (
            <div className="w-full py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-1.5">
              <ShieldCheck size={14} />
              <span>Listed on Marketplace</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

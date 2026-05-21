import { useState } from "react";
import { Wrench, Cpu, HardDrive, Battery, Monitor, CircuitBoard, Wifi, Speaker } from "lucide-react";
import DisassemblyGuide from "../components/DisassemblyGuide";

const components = [
  { id: "ram",        name: "RAM / Memory",         icon: <Cpu size={22} />,         device: "Laptop/PC" },
  { id: "ssd",        name: "SSD / Hard Drive",      icon: <HardDrive size={22} />,   device: "Laptop/PC" },
  { id: "battery",    name: "Battery Pack",          icon: <Battery size={22} />,     device: "Laptop/PC" },
  { id: "screen",     name: "Display / LCD Panel",   icon: <Monitor size={22} />,     device: "Laptop/PC" },
  { id: "motherboard",name: "Motherboard",           icon: <CircuitBoard size={22} />,device: "Laptop/PC" },
  { id: "wifi",       name: "Wi-Fi Card",            icon: <Wifi size={22} />,        device: "Laptop/PC" },
  { id: "speaker",    name: "Speakers",              icon: <Speaker size={22} />,     device: "Laptop/PC" },
  { id: "cpu",        name: "CPU / Processor",       icon: <Cpu size={22} />,         device: "Laptop/PC" },
];

export default function DisassemblyPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-[#fafdfb] py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#0F9D8A]/10 border border-[#0F9D8A]/20 text-[#0F9D8A] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-2">
            <Wrench size={13} /> Step-by-Step Guides
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Disassembly Guide</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Select a component below to get a safe, step-by-step guide for extracting it from your device.
          </p>
        </div>

        {/* Component grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {components.map((comp) => (
            <button
              key={comp.id}
              onClick={() => setSelected(comp)}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border text-center transition group
                ${selected?.id === comp.id
                  ? "bg-[#0F9D8A]/10 border-[#0F9D8A] text-[#0F9D8A] shadow-sm"
                  : "bg-white border-[#e2ece6] text-slate-600 hover:border-[#0F9D8A]/40 hover:bg-[#0F9D8A]/5 hover:text-[#0F9D8A]"
                }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition
                ${selected?.id === comp.id
                  ? "bg-[#0F9D8A]/15"
                  : "bg-slate-100 group-hover:bg-[#0F9D8A]/10"
                }`}>
                {comp.icon}
              </div>
              <span className="text-xs font-bold leading-tight">{comp.name}</span>
            </button>
          ))}
        </div>

        {/* Guide panel */}
        {selected ? (
          <div className="rounded-3xl overflow-hidden shadow-xl border border-[#e2ece6]">
            <DisassemblyGuide
              componentName={selected.name}
              deviceType={selected.device}
              onClose={() => setSelected(null)}
            />
          </div>
        ) : (
          <div className="bg-white border border-dashed border-[#c5ddd5] rounded-3xl py-16 text-center space-y-3">
            <Wrench className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-slate-400 font-semibold text-sm">Select a component above to start the guide</p>
          </div>
        )}
      </div>
    </div>
  );
}

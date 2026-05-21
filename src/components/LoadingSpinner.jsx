import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Processing...", subtitle = "Please wait" }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="relative flex items-center justify-center mb-4">
        {/* Glow behind loader */}
        <div className="absolute w-16 h-16 rounded-full bg-blue-500/20 blur-xl animate-pulse-subtle"></div>
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin relative" />
      </div>
      <h3 className="text-lg font-semibold text-white tracking-wide">{message}</h3>
      {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}

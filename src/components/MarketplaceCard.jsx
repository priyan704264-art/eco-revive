import { ShoppingCart, MessageCircle, MapPin, Shield, User, Leaf } from "lucide-react";

const GRADE_BADGES = {
  A: "bg-emerald-100 text-emerald-700 border-emerald-200",
  B: "bg-blue-100 text-blue-700 border-blue-200",
  C: "bg-amber-100 text-amber-700 border-amber-200",
};

export default function MarketplaceCard({ listing, isOwner, onBuy, onChat }) {
  const gradeClass = GRADE_BADGES[listing.components?.grade] || "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <div className="bg-white border border-slate-100 hover:border-[#0F9D8A]/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#0F9D8A]/10 transition-all duration-300 flex flex-col justify-between h-full group relative">
      
      {/* Top badges floating over image */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md bg-white/90 ${gradeClass}`}>
          Grade {listing.components?.grade || "N/A"}
        </span>
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md border border-[#0F9D8A]/20 text-[#0F9D8A] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm" title="Eco Score">
          <Leaf size={10} />
          <span>98</span>
        </div>
      </div>

      <div>
        {/* Component snapshot container */}
        <div className="relative h-48 bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
          {listing.components?.image_url ? (
            <img
              src={listing.components.image_url}
              alt={listing.components?.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#f4faf7] to-[#e8f5f1] flex items-center justify-center text-[#0F9D8A] opacity-50">
               <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <line x1="9" y1="1" x2="9" y2="4"></line>
                <line x1="15" y1="1" x2="15" y2="4"></line>
                <line x1="9" y1="20" x2="9" y2="23"></line>
                <line x1="15" y1="20" x2="15" y2="23"></line>
                <line x1="20" y1="9" x2="23" y2="9"></line>
                <line x1="20" y1="14" x2="23" y2="14"></line>
                <line x1="1" y1="9" x2="4" y2="9"></line>
                <line x1="1" y1="14" x2="4" y2="14"></line>
              </svg>
            </div>
          )}
        </div>

        {/* Listing details body */}
        <div className="p-4">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-[#0F9D8A] transition-colors line-clamp-1">
              {listing.components?.name || "Hardware Component"}
            </h3>
          </div>
          
          <p className="text-[11px] text-slate-500 font-medium">
            {listing.components?.hindi_name}
          </p>

          {/* Listing description */}
          {listing.description && (
            <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
              {listing.description}
            </p>
          )}

          {/* Seller / City information details */}
          <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <User size={12} className="text-slate-400" />
                <span><span className="text-slate-700 font-semibold">{isOwner ? "You" : (listing.users?.name || "Verified Seller")}</span></span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                <MapPin size={10} className="text-[#0F9D8A]" />
                <span>{listing.city || listing.users?.city || "Delhi"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing and Action row */}
      <div className="px-4 pb-4 pt-3 flex items-center justify-between bg-slate-50/50">
        <div>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Price</span>
          <span className="text-lg font-black text-slate-900 leading-none">
            ₹{listing.price_inr}
          </span>
        </div>

        <div className="flex gap-2">
          {/* Chat with Seller Button */}
          {!isOwner && (
            <button
              onClick={(e) => { e.preventDefault(); onChat(listing); }}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-[#0F9D8A]/40 hover:text-[#0F9D8A] text-slate-600 transition-all duration-300 shadow-sm"
              title="Chat with Seller"
            >
              <MessageCircle size={16} />
            </button>
          )}

          {/* Purchase Button */}
          {isOwner ? (
            <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 border border-slate-200">
              <Shield size={14} />
              <span>Yours</span>
            </div>
          ) : (
            <button
              onClick={(e) => { e.preventDefault(); onBuy(listing); }}
              className="px-4 py-2 rounded-xl bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-[#0F9D8A]/20 active:scale-[0.98] flex items-center gap-1.5"
            >
              <ShoppingCart size={14} />
              <span>Buy Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

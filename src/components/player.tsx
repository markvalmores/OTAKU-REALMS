import React from "react";
import { PlayerStats } from "../types";
import { User } from "firebase/auth";
import { Shield, Heart, Coins, Activity, Sparkles, Film, Image as ImageIcon } from "lucide-react";

interface PlayerProps {
  stats: PlayerStats;
  user: User;
  charClass?: string;
  charName?: string;
  customAvatarUrl?: string;
  customBannerUrl?: string;
  customBannerType?: "image" | "video";
}

export default function Player({ 
  stats, 
  user, 
  charClass = "Warrior", 
  charName,
  customAvatarUrl,
  customBannerUrl,
  customBannerType = "image"
}: PlayerProps) {
  const displayName = charName || user.email?.split("@")[0] || "Unknown Otaku";

  // Hardcoded 30s video crop loop constraint
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.currentTime >= 30) {
      video.currentTime = 0;
      video.play().catch(err => console.log("Video replay:", err));
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-950 to-gray-900 border-2 border-orange-500/30 rounded-2xl shadow-xl overflow-hidden">
      {/* 1. VISUAL CUSTOM PROFILE BANNER SECTION */}
      {customBannerUrl ? (
        <div className="h-32 w-full bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-gray-800">
          {customBannerType === "video" ? (
            <video
              src={customBannerUrl}
              autoPlay
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.7)" }}
            />
          ) : (
            <img 
              src={customBannerUrl} 
              alt="Profile Banner" 
              className="w-full h-full object-cover" 
              style={{ filter: "brightness(0.7)" }}
            />
          )}
          
          {/* Subtle Banner Indicators */}
          <div className="absolute top-2 right-2 flex gap-1 z-10">
            {customBannerType === "video" ? (
              <span className="bg-red-950/80 text-red-400 border border-red-500/30 text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold flex items-center gap-0.5">
                <Film size={8} /> MP4 (30s limit)
              </span>
            ) : (
              <span className="bg-indigo-950/80 text-indigo-400 border border-indigo-500/30 text-[8px] font-mono px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5">
                <ImageIcon size={8} /> Image Banner
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="h-10 bg-gradient-to-r from-orange-600/20 to-purple-600/20 w-full border-b border-gray-800" />
      )}

      <div className="p-5 space-y-4">
        {/* Visual Identity banner */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              {customAvatarUrl ? (
                <div className="w-12 h-12 rounded-full border-2 border-orange-500 overflow-hidden bg-gray-950 flex-shrink-0 flex items-center justify-center shadow-lg -mt-10">
                  <img src={customAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-orange-500 flex items-center justify-center text-xl -mt-5">
                  {stats.status === "sick" ? "🤢" : stats.status === "injured" ? "🤕" : "🧙"}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-heading text-lg text-white flex items-center gap-1.5">
                {displayName}
                {stats.isOtakuPlus && (
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse">
                    VIP PLUS
                  </span>
                )}
              </h3>
              <span className="text-xs text-orange-400 font-mono font-bold uppercase">{charClass} Level 1</span>
            </div>
          </div>
          <Shield className="text-orange-500 animate-pulse" size={20} />
        </div>

        {/* Vital Stats details */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800 space-y-1">
            <span className="text-gray-500 block uppercase text-[10px]">Health Pool</span>
            <div className="flex items-center gap-1.5 text-red-400 font-bold">
              <Heart size={14} className="animate-pulse" /> {stats.hp} / {stats.maxHp} HP
            </div>
            <div className="w-full bg-gray-950 h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-red-500 h-full transition-all duration-300"
                style={{ width: `${(stats.hp / stats.maxHp) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800 space-y-1">
            <span className="text-gray-500 block uppercase text-[10px]">Net Wealth</span>
            <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
              <Coins size={14} /> ${stats.money}
            </div>
            <span className="text-[9px] text-gray-500">Coins accepted worldwide</span>
          </div>
        </div>

        {/* Sickness / Normal states tracker */}
        <div className="bg-gray-900/40 p-3 rounded-xl border border-gray-800 text-xs flex justify-between items-center">
          <span className="text-gray-400 font-mono">ENVIRONMENT STATUS:</span>
          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
            stats.status === "healthy" ? "bg-green-950/80 text-green-400 border border-green-500/20" :
            stats.status === "sick" ? "bg-amber-950/80 text-amber-400 border border-amber-500/20" :
            "bg-red-950/80 text-red-400 border border-red-500/20"
          }`}>
            {stats.status.toUpperCase()}
          </span>
        </div>

        {stats.isOtakuPlus && (
          <div className="p-2.5 bg-gradient-to-r from-yellow-600/10 to-amber-600/20 border border-yellow-500/20 rounded-xl flex items-center gap-2 text-[10px] text-yellow-400">
            <Sparkles size={14} className="animate-spin text-yellow-400" />
            <span><b>Premium Privileges:</b> +25% Speed boost & exclusive Otaku shop items are now active!</span>
          </div>
        )}
      </div>
    </div>
  );
}

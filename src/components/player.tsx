import React from "react";
import { PlayerStats } from "../types";
import { User } from "firebase/auth";
import { Shield, Heart, Coins, Activity, Sparkles } from "lucide-react";

interface PlayerProps {
  stats: PlayerStats;
  user: User;
  charClass?: string;
  charName?: string;
}

export default function Player({ stats, user, charClass = "Warrior", charName }: PlayerProps) {
  const displayName = charName || user.email?.split("@")[0] || "Unknown Otaku";

  return (
    <div className="bg-gradient-to-br from-gray-950 to-gray-900 border-2 border-orange-500/30 p-5 rounded-2xl shadow-xl space-y-4">
      {/* Visual Identity banner */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-orange-500 flex items-center justify-center text-xl">
            {stats.status === "sick" ? "🤢" : stats.status === "injured" ? "🤕" : "🧙"}
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
  );
}

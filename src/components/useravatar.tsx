import React, { useState } from "react";
import { Award, RefreshCw, Zap, Shield, Sparkles, User, Key, BookOpen } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export default function UserAvatarSystem() {
  const [activeGear, setActiveGear] = useState<string>("Lightweight Shuriken");
  const [xp, setXp] = useState<number>(3450);
  const [prestigeLevel, setPrestigeLevel] = useState<number>(1);
  const [isClassCustomized, setIsClassCustomized] = useState<boolean>(false);

  const gears = [
    "Lightweight Shuriken",
    "Damascus Wakizashi Sword",
    "Arcane Fire Sceptre",
    "Cybernetic Combat Gloves"
  ];

  const triggerXpGain = () => {
    setXp(prev => {
      const nextXp = prev + 350;
      soundManager.playLevelUp();
      if (nextXp >= 5000) {
        setPrestigeLevel(p => p + 1);
        alert(`🎉 PRESTIGE LEVEL UP: You achieved Prestige Rank ${prestigeLevel + 1}! Combat perks multiplier increased.`);
        return 0;
      } else {
        alert("⚔️ Combat Grind: Gained +350 XP from tactical simulation!");
        return nextXp;
      }
    });
  };

  return (
    <div className="bg-gray-900/90 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <User className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">User Identity Passport</h2>
            <p className="text-[10px] text-gray-400 font-mono">Manage custom equipment slots, prestige rating parameters, and check XP levels</p>
          </div>
        </div>
        <button
          onClick={triggerXpGain}
          className="bg-orange-600 hover:bg-orange-500 text-black text-[10px] font-mono px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold transition shadow-lg animate-pulse"
        >
          <Zap size={11} /> Simulate XP Gain (+350)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* User Badge Frame */}
        <div className="lg:col-span-5 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 p-5 rounded-2xl border border-gray-800 flex flex-col justify-between items-center relative text-center min-h-[220px] overflow-hidden">
          <div className="absolute top-2 left-2">
            <span className="bg-yellow-950 text-yellow-400 border border-yellow-500/20 text-[8px] font-mono px-1.5 py-0.5 rounded font-extrabold uppercase flex items-center gap-1">
              <Award size={10} className="animate-spin" /> Prestige Rank {prestigeLevel}
            </span>
          </div>

          <div className="w-16 h-16 rounded-full bg-orange-600/10 border-2 border-orange-500 flex items-center justify-center text-3xl font-black text-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.3)] mt-4">
            👤
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-white uppercase tracking-wider">Otaku Realm Citizen</p>
            <p className="text-[10px] font-mono text-gray-400">XP Progress: {xp} / 5000 pts</p>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full bg-gray-900 h-2.5 rounded-full overflow-hidden border border-gray-800 shadow-inner">
            <div 
              className="bg-gradient-to-r from-orange-600 to-yellow-400 h-full transition-all duration-300"
              style={{ width: `${(xp / 5000) * 100}%` }}
            />
          </div>
        </div>

        {/* Equipment Selector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-850 space-y-3">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest block font-bold">Active Weapon Slot Selection</span>
            <div className="grid grid-cols-2 gap-2">
              {gears.map(gear => {
                const isActive = activeGear === gear;
                return (
                  <button
                    key={gear}
                    onClick={() => {
                      setActiveGear(gear);
                      soundManager.playSpecial();
                    }}
                    className={`p-2 text-[10px] font-mono font-bold rounded-lg border transition text-left ${
                      isActive
                        ? "bg-orange-950/40 border-orange-500 text-orange-400 shadow"
                        : "bg-gray-900 border-gray-850 text-gray-500 hover:bg-gray-850"
                    }`}
                  >
                    ⚔️ {gear.split(" ")[0]} {gear.split(" ")[1] || ""}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-950 p-4 rounded-xl border border-gray-850 space-y-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Special Class Multipliers</span>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
              <div className="bg-gray-900 p-2 rounded border border-gray-850">
                <p className="text-gray-500">Attack Pow</p>
                <p className="text-white font-bold font-mono">{(1.2 * prestigeLevel).toFixed(1)}x</p>
              </div>
              <div className="bg-gray-900 p-2 rounded border border-gray-850">
                <p className="text-gray-500">Crit Rate</p>
                <p className="text-white font-bold font-mono">{Math.min(30, 8 + prestigeLevel * 2)}%</p>
              </div>
              <div className="bg-gray-900 p-2 rounded border border-gray-850">
                <p className="text-gray-500">Gold Bonus</p>
                <p className="text-emerald-400 font-bold font-mono">+{(prestigeLevel * 50)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

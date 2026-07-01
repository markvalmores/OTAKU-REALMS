import React, { useState } from "react";
import { soundManager } from "../lib/soundManager";
import { Sparkles, Star, Flame, Award, HelpCircle } from "lucide-react";

interface SoulStat {
  name: string;
  level: number;
  description: string;
  emoji: string;
  color: string;
}

const DEFAULT_SOULS: SoulStat[] = [
  { name: "Otaku Energy Core", level: 5, description: "Amplifies special anime spells & dynamic visual particle count.", emoji: "⚡", color: "from-orange-500 to-amber-500" },
  { name: "Ancient Wisdom", level: 3, description: "Decreases potion consumption cooldowns by 15%.", emoji: "🧠", color: "from-cyan-500 to-indigo-500" },
  { name: "Cosmic Karma", level: 8, description: "Improves rare weapon drop frequency from slimes.", emoji: "☯️", color: "from-pink-500 to-rose-500" },
  { name: "Mind Shield Defense", level: 4, description: "Protects memory cells against environmental toxic sickness.", emoji: "🛡️", color: "from-purple-500 to-indigo-600" },
  { name: "Aura Inner Power", level: 2, description: "Empowers melee hits. Unleashes standard multi-hit shockwaves.", emoji: "🔥", color: "from-emerald-500 to-teal-500" }
];

interface SoulProps {
  money: number;
  setMoney: React.Dispatch<React.SetStateAction<number>>;
}

export default function Soul({ money, setMoney }: SoulProps) {
  const [souls, setSouls] = useState<SoulStat[]>(DEFAULT_SOULS);

  const upgradeStat = (statName: string) => {
    const cost = 120;
    if (money < cost) {
      soundManager.playHit();
      alert(`❌ Insufficient gold! Upgrading soul traits requires $120 Coins.`);
      return;
    }

    soundManager.playLevelUp();
    setMoney(prev => prev - cost);
    setSouls(prev => prev.map(s => s.name === statName ? { ...s, level: s.level + 1 } : s));
    alert(`🌟 Soul Transmutation: ${statName} upgraded successfully!`);
  };

  return (
    <div className="bg-gray-950 border border-orange-500/30 p-4 rounded-2xl space-y-4">
      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
        <h3 className="font-heading text-sm text-white flex items-center gap-1.5">
          <Flame className="text-orange-500 animate-pulse" size={16} /> Celestial Soul Diagnostics
        </h3>
        <span className="text-[10px] text-gray-500 font-mono">Upgrade: $120</span>
      </div>

      <div className="space-y-3">
        {souls.map(stat => (
          <div key={stat.name} className="p-3 bg-gray-900/40 rounded-xl border border-gray-800 flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{stat.emoji}</span>
                <span className="text-xs font-bold text-white font-mono">{stat.name}</span>
                <span className="text-[9px] bg-orange-600 text-white px-1.5 py-0.5 rounded-full font-mono font-bold">
                  LVL {stat.level}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-sans leading-relaxed pr-2">{stat.description}</p>
            </div>

            <button
              onClick={() => upgradeStat(stat.name)}
              className="px-2.5 py-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 text-white rounded text-[9px] font-bold uppercase transition shrink-0"
            >
              Enhance
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

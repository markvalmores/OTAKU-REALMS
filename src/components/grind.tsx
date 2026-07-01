import React, { useState } from "react";
import { Flame, Star, Trophy, RefreshCw, Sparkles, Swords } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface GrindProps {
  onGainExp: (amount: number) => void;
  onAddMoney: (amount: number) => void;
}

export default function Grind({ onGainExp, onAddMoney }: GrindProps) {
  const [grindStreak, setGrindStreak] = useState(0);
  const [clickScale, setClickScale] = useState(1);
  const [slimeHealth, setSlimeHealth] = useState(100);
  const [slainCount, setSlainCount] = useState(0);

  const handleGrindClick = () => {
    soundManager.playSpecial();
    setClickScale(1.15);
    setTimeout(() => setClickScale(1), 100);

    const dmg = Math.floor(Math.random() * 15) + 10;
    setSlimeHealth(prev => {
      const next = prev - dmg;
      if (next <= 0) {
        // Slime defeated
        soundManager.playLevelUp();
        setSlainCount(c => c + 1);
        setGrindStreak(s => s + 1);
        onGainExp(25 + grindStreak * 2);
        onAddMoney(15 + grindStreak);
        return 100; // spawn next
      }
      return next;
    });
  };

  const handleResetStreak = () => {
    soundManager.playSpecial();
    setGrindStreak(0);
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Swords className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Cyber Slime Grinding Station</h2>
            <p className="text-[10px] text-gray-400 font-mono">Repetitively beat simulated slimes to extract core experience shards</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleResetStreak}
            className="p-1.5 bg-gray-950 border border-gray-800 text-gray-400 hover:text-white rounded-lg transition"
            title="Reset streak multiplier"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Grind Sandbox Grid */}
      <div className="bg-gray-950 rounded-2xl p-6 border border-gray-800 text-center space-y-5">
        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest block">ACTIVE TARGET COMBAT MODULE</span>

        {/* Interactive visual button representing the Slime */}
        <button
          onClick={handleGrindClick}
          style={{ transform: `scale(${clickScale})` }}
          className="mx-auto h-28 w-28 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-full flex items-center justify-center text-5xl cursor-pointer select-none transition-transform duration-75 shadow-lg relative border-4 border-orange-400/40"
        >
          👾
          <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse pointer-events-none" />
        </button>

        <div className="space-y-1 max-w-xs mx-auto">
          <div className="flex justify-between text-[10px] font-mono text-gray-400">
            <span>Slime HP</span>
            <span>{slimeHealth}/100</span>
          </div>
          <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-850">
            <div
              className="bg-red-500 h-full transition-all duration-75"
              style={{ width: `${slimeHealth}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono max-w-sm mx-auto border-t border-gray-900 pt-4">
          <div className="text-left">
            <span className="text-gray-500 block text-[9px] uppercase">Streak Multiplier</span>
            <span className="text-orange-400 font-extrabold">{grindStreak}x Boost</span>
          </div>
          <div className="text-right">
            <span className="text-gray-500 block text-[9px] uppercase">Slimes Purified</span>
            <span className="text-white font-extrabold">{slainCount} Slain</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-950/60 p-3 rounded-lg border border-gray-850 flex items-center gap-2.5">
        <Sparkles className="text-orange-400 shrink-0 animate-spin" size={14} />
        <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
          Beating slimes awards <span className="text-orange-400 font-bold">15+ Coins</span> and <span className="text-orange-400 font-bold">25+ EXP</span>. Accumulate streaks to augment payout ratios!
        </p>
      </div>
    </div>
  );
}

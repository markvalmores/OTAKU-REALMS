import React, { useState } from "react";
import { Sparkles, Trophy, Star, ShieldAlert, ArrowRight, Zap } from "lucide-react";
import { soundManager } from "../lib/soundManager";
import { gachaCharacters, GachaCharacter } from "./gachachara";

interface GachaProps {
  aniCash: number;
  onSpendAniCash: (amount: number) => boolean;
  pityCount: number;
  onIncrementPity: (amount: number) => void;
  onResetPity: () => void;
  onRewardCharacter: (name: string) => void;
}

export default function Gacha({
  aniCash,
  onSpendAniCash,
  pityCount,
  onIncrementPity,
  onResetPity,
  onRewardCharacter
}: GachaProps) {
  const [results, setResults] = useState<GachaCharacter[]>([]);
  const [isWarping, setIsWarping] = useState(false);

  const performSinglePull = () => {
    if (!onSpendAniCash(160)) {
      alert("Insufficient AniCash! 1 Pull costs 160 AC.");
      return;
    }

    soundManager.playSpecial();
    setIsWarping(true);

    setTimeout(() => {
      let pullResult: GachaCharacter;
      
      // Determine if S-Tier guaranteed (Pity at 80)
      const currentPity = pityCount + 1;
      const isGuaranteed = currentPity >= 80;

      if (isGuaranteed) {
        // Guaranteed 5-Star S-Tier
        const sTiers = gachaCharacters.filter(c => c.tier === 5);
        pullResult = sTiers[Math.floor(Math.random() * sTiers.length)];
        onResetPity();
      } else {
        const roll = Math.random();
        if (roll < 0.016) {
          // 1.6% S-Tier
          const sTiers = gachaCharacters.filter(c => c.tier === 5);
          pullResult = sTiers[Math.floor(Math.random() * sTiers.length)];
          onResetPity();
        } else if (roll < 0.116) {
          // 10% Epic
          const epics = gachaCharacters.filter(c => c.tier === 4);
          pullResult = epics[Math.floor(Math.random() * epics.length)];
          onIncrementPity(1);
        } else {
          // Rare
          const rares = gachaCharacters.filter(c => c.tier === 3);
          pullResult = rares[Math.floor(Math.random() * rares.length)];
          onIncrementPity(1);
        }
      }

      onRewardCharacter(pullResult.name);
      setResults([pullResult]);
      setIsWarping(false);
      soundManager.playLevelUp();
    }, 1500);
  };

  const performTenPulls = () => {
    if (!onSpendAniCash(1600)) {
      alert("Insufficient AniCash! 10 Pulls cost 1600 AC.");
      return;
    }

    soundManager.playSpecial();
    setIsWarping(true);

    setTimeout(() => {
      const tenResults: GachaCharacter[] = [];
      let tempPity = pityCount;

      for (let i = 0; i < 10; i++) {
        let pullResult: GachaCharacter;
        tempPity += 1;
        const isGuaranteed = tempPity >= 80;

        if (isGuaranteed) {
          const sTiers = gachaCharacters.filter(c => c.tier === 5);
          pullResult = sTiers[Math.floor(Math.random() * sTiers.length)];
          tempPity = 0;
        } else {
          const roll = Math.random();
          if (roll < 0.016) {
            const sTiers = gachaCharacters.filter(c => c.tier === 5);
            pullResult = sTiers[Math.floor(Math.random() * sTiers.length)];
            tempPity = 0;
          } else if (roll < 0.116) {
            const epics = gachaCharacters.filter(c => c.tier === 4);
            pullResult = epics[Math.floor(Math.random() * epics.length)];
          } else {
            const rares = gachaCharacters.filter(c => c.tier === 3);
            pullResult = rares[Math.floor(Math.random() * rares.length)];
          }
        }

        onRewardCharacter(pullResult.name);
        tenResults.push(pullResult);
      }

      // Update actual parent pity count
      if (tempPity === 0) {
        onResetPity();
      } else {
        onIncrementPity(tenResults.filter(r => r.tier !== 5).length);
      }

      setResults(tenResults);
      setIsWarping(false);
      soundManager.playLevelUp();
    }, 2200);
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="text-orange-500 animate-spin" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Temporal Warp Gacha portal</h2>
            <p className="text-[10px] text-gray-400 font-mono">Spend AniCash to pull legendary 5-Star celestial comrades and haoris</p>
          </div>
        </div>
        <div className="bg-gray-950 px-2.5 py-1 rounded-lg border border-gray-800 text-[10px] font-mono text-gray-300">
          AniCash: <span className="text-orange-400 font-bold">{aniCash} AC</span>
        </div>
      </div>

      {isWarping ? (
        <div className="bg-gray-950 p-10 rounded-2xl border border-orange-500/40 text-center space-y-4">
          <div className="relative h-16 w-16 mx-auto">
            <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-mono text-orange-400 font-bold animate-pulse uppercase">WARPING SPACE-TIME FABRICS...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Banner Hero Shot */}
          <div className="relative bg-gradient-to-r from-purple-950 to-orange-950 p-6 rounded-2xl border border-orange-500/30 overflow-hidden text-center sm:text-left">
            <div className="space-y-1.5 relative z-10">
              <span className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded uppercase font-bold font-mono">Special Limited Banner</span>
              <h3 className="text-lg font-black uppercase text-white font-mono">CELESTIAL ASCENSION WARP</h3>
              <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
                Massive drop rate boost for <span className="text-orange-400 font-bold">Admin Megumi (5★)</span> and <span className="text-orange-400 font-bold">Saitama_99 (5★)</span>!
              </p>
            </div>
            <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none select-none">
              🧙‍♀️
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={performSinglePull}
              className="py-3 bg-gray-950 hover:bg-orange-600/10 border border-gray-800 hover:border-orange-500/40 text-white rounded-xl text-xs font-mono font-bold uppercase transition flex flex-col items-center justify-center gap-1"
            >
              <span>1x Warp Pull</span>
              <span className="text-[10px] text-orange-400 font-normal">Costs 160 AC</span>
            </button>
            <button
              onClick={performTenPulls}
              className="py-3 bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-500 hover:to-amber-600 text-white rounded-xl text-xs font-mono font-bold uppercase transition flex flex-col items-center justify-center gap-1 shadow-lg"
            >
              <span>10x Warp Pulls</span>
              <span className="text-[10px] text-orange-200 font-normal">Costs 1600 AC</span>
            </button>
          </div>

          {/* Results display */}
          {results.length > 0 && (
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Warp Summoning Findings</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {results.map((char, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg border text-center space-y-1 bg-gray-900 ${
                      char.tier === 5 ? "border-amber-500 shadow-md" : char.tier === 4 ? "border-purple-500" : "border-gray-800"
                    }`}
                  >
                    <span className="text-3xl block">{char.avatar}</span>
                    <span className="text-[10px] font-bold text-gray-200 block truncate">{char.name}</span>
                    <div className="flex justify-center text-amber-500">
                      {Array.from({ length: char.tier }).map((_, idx) => (
                        <Star key={idx} size={8} className="fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

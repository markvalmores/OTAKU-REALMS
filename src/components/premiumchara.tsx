import React, { useState } from "react";
import { Sparkles, ShieldCheck, CreditCard, Star, Flame } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface PremiumCharaProps {
  onUnlockPremiumCharacter?: (name: string) => void;
  unlockedCharacters?: string[];
}

export default function PremiumChara({ onUnlockPremiumCharacter, unlockedCharacters = [] }: PremiumCharaProps) {
  const premiumRoster = [
    {
      name: "Tatsumaki Psycho",
      avatar: "🧙‍♀️",
      cost: 500, // AniCash
      combatPower: 25000,
      desc: "An S-Tier psychic powerhouse capable of pulling meteors from the sky to obliterate target sectors.",
      bonus: "+20% Damage Boost to all bosses"
    },
    {
      name: "Goku Ultra",
      avatar: "🔥",
      cost: 1000, // AniCash
      combatPower: 60000,
      desc: "The absolute zenith of combat. Mastered state of divine power with zero startup frame delays.",
      bonus: "Double combat coins drops globally"
    },
    {
      name: "Lelouch Geass Shogun",
      avatar: "👑",
      cost: 1500, // AniCash
      combatPower: 85000,
      desc: "Command tactical squads with standard absolute obedience commands. Disables hostile counters.",
      bonus: "Unlock Secret Dimensional Portals instantly"
    }
  ];

  const [aniCash, setAniCash] = useState(2000); // Simulated premium wallet balance

  const handlePurchase = (name: string, cost: number) => {
    if (unlockedCharacters.includes(name)) {
      alert("Comrade already deployed in your standard roster.");
      return;
    }
    if (aniCash >= cost) {
      soundManager.playLevelUp();
      setAniCash(prev => prev - cost);
      if (onUnlockPremiumCharacter) {
        onUnlockPremiumCharacter(name);
      }
      alert(`Success: Summoned and contracted Premium Ally [${name}]!`);
    } else {
      alert("Insufficient AniCash Premium balance. Recharge or exchange via the ledger.");
    }
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="text-orange-500 animate-spin" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Premium Celestial Allies</h2>
            <p className="text-[10px] text-gray-400 font-mono">Form direct premium contracts with ultimate gods and psy-commanders</p>
          </div>
        </div>
        <div className="bg-gray-950 px-2.5 py-1 rounded-lg border border-gray-800 text-[10px] font-mono text-gray-300">
          AniCash: <span className="text-orange-400 font-bold">{aniCash} AC</span>
        </div>
      </div>

      <div className="space-y-4">
        {premiumRoster.map((hero, i) => {
          const isUnlocked = unlockedCharacters.includes(hero.name);

          return (
            <div
              key={i}
              className="bg-gray-950 p-4 rounded-xl border border-gray-850 hover:border-orange-500/10 transition space-y-3"
            >
              <div className="flex gap-4 items-start">
                <span className="text-4xl bg-gray-900 h-14 w-14 border border-gray-800 rounded-xl flex items-center justify-center shrink-0">
                  {hero.avatar}
                </span>
                <div className="space-y-1 flex-grow">
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <div>
                      <h3 className="text-xs font-bold text-gray-200">{hero.name}</h3>
                      <span className="text-[9px] font-mono text-orange-400 font-bold">VIP Special Edition Contract</span>
                    </div>
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} size={10} className="fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-sans leading-relaxed">{hero.desc}</p>
                </div>
              </div>

              <div className="bg-gray-900/60 p-2.5 rounded-lg text-[10px] font-mono text-gray-400 border border-gray-850 flex items-center gap-2">
                <Flame size={12} className="text-orange-500 shrink-0" />
                <span>Buff: <strong className="text-orange-400">{hero.bonus}</strong></span>
              </div>

              <div className="pt-2 border-t border-gray-900 flex justify-between items-center flex-wrap gap-2 text-xs font-mono">
                <div>
                  <span className="text-[9px] text-gray-500 uppercase block">Summoning Fee</span>
                  <span className="text-sm font-bold text-orange-400">{hero.cost} AC</span>
                </div>

                {isUnlocked ? (
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Contract Signed ✓</span>
                ) : (
                  <button
                    onClick={() => handlePurchase(hero.name, hero.cost)}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded font-bold uppercase transition text-[10px]"
                  >
                    Deploy Ally
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from "react";
import { HelpCircle, Sparkles, Star, Award } from "lucide-react";

export default function GachaMechanic() {
  const rates = [
    { tier: "5★ Celestial S-Tier", rate: "1.6%", color: "text-orange-400 font-extrabold" },
    { tier: "4★ Epic Knight", rate: "10.0%", color: "text-purple-400 font-bold" },
    { tier: "3★ Rare Soldier", rate: "88.4%", color: "text-blue-400" }
  ];

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <HelpCircle className="text-orange-500" size={18} />
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-orange-400">Chronicle Warp Probability Rules</h2>
          <p className="text-[9px] text-gray-400 font-mono">Transparent probability mechanics and system audit documentation</p>
        </div>
      </div>

      <div className="space-y-3 font-mono text-[11px] leading-relaxed">
        <p className="text-gray-400">
          The Gacha system utilizes a pseudo-random seed generator optimized for absolute fairness and audited anti-skew guarantees.
        </p>

        <div className="bg-gray-950 p-3 rounded-lg border border-gray-850 space-y-2">
          <span className="text-[9px] text-gray-500 uppercase font-bold block border-b border-gray-900 pb-1">Probability Distribution</span>
          <div className="space-y-1.5">
            {rates.map((r, i) => (
              <div key={i} className="flex justify-between items-center text-[10px]">
                <span className={r.color}>{r.tier}</span>
                <span className="text-white font-bold">{r.rate}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-[10px] text-gray-400">
          <div className="flex gap-1.5">
            <span className="text-orange-500">✓</span>
            <p><strong>Soft Pity</strong>: Base S-Tier drop rates scale by 6% with each pull after the 70th pull.</p>
          </div>
          <div className="flex gap-1.5">
            <span className="text-orange-500">✓</span>
            <p><strong>Hard Pity</strong>: Guaranteed 5-Star on the 80th pull if not summoned earlier.</p>
          </div>
          <div className="flex gap-1.5">
            <span className="text-orange-500">✓</span>
            <p><strong>Duplicates</strong>: Duplicate characters automatically convert to 100 extra AniCash.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

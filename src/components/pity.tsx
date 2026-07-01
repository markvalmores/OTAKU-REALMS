import React from "react";
import { ShieldAlert, Info, Sparkles, HelpCircle } from "lucide-react";

interface PityProps {
  pityCount: number;
}

export default function Pity({ pityCount }: PityProps) {
  const guaranteedAt = 80;
  const remaining = Math.max(0, guaranteedAt - pityCount);
  const percent = Math.min(100, (pityCount / guaranteedAt) * 100);

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-5">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <ShieldAlert className="text-orange-500 animate-pulse" size={20} />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Chronicle Pity Ledger</h2>
          <p className="text-[10px] text-gray-400 font-mono">Guaranteed 5-Star celestial drop counter system diagnostics</p>
        </div>
      </div>

      <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-4">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-gray-400">Standard Limited Banner Pity</span>
          <span className="text-white font-bold">{pityCount} / {guaranteedAt} Pulls</span>
        </div>

        <div className="w-full bg-gray-900 h-3 rounded-full overflow-hidden border border-gray-850">
          <div
            className="bg-gradient-to-r from-orange-600 to-amber-500 h-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="text-center font-mono text-[11px]">
          {remaining === 0 ? (
            <span className="text-emerald-400 font-extrabold animate-pulse">
              ★ GUARANTEED CELESTIAL DROP ACTIVE ON NEXT PULL! ★
            </span>
          ) : (
            <span className="text-orange-300">
              Only <strong className="text-white">{remaining}</strong> more pulls until an absolute guaranteed <strong className="text-orange-400">5-Star Character</strong>!
            </span>
          )}
        </div>
      </div>

      <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-850 flex items-start gap-2.5">
        <Info className="text-orange-400 shrink-0 mt-0.5" size={14} />
        <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
          Pity system resets immediately upon pulling any legendary 5-Star item or character. High-probability rates scale dynamically after the 70th pull.
        </p>
      </div>
    </div>
  );
}

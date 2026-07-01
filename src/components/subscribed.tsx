import React, { useState } from "react";
import { Sparkles, Calendar, Zap, Gift, ShieldAlert } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface SubscribedProps {
  onAddMoney?: (amount: number) => void;
  onGrantMedicine?: () => void;
  expiryTimestamp?: number;
}

export default function Subscribed({ onAddMoney, onGrantMedicine, expiryTimestamp }: SubscribedProps) {
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "System: Welcome VIP comrade. Enjoy your specialized status benefits."
  ]);

  const activePrivileges = [
    { title: "2.0x Slime Coin Drop Rate", desc: "Permanent multiplier applied to sandboxed combat rewards." },
    { title: "Double Daily Quest Points", desc: "All completed story chapters return 2x normal values." },
    { title: "Universal Portal Access", desc: "Dimensional warp portals bypass standard tier unlocks." },
    { title: "High Fidelity Soundscapes", desc: "Exclusive synth sound models and soundscapes enabled." }
  ];

  const claimDailyBounty = () => {
    if (dailyClaimed) return;
    setDailyClaimed(true);
    soundManager.playLevelUp();
    
    if (onAddMoney) onAddMoney(500);
    if (onGrantMedicine) onGrantMedicine();

    setLogs(prev => [
      `Reward Claimed: Gained +500 Coins and +1 Celestial Health Elixir!`,
      ...prev
    ]);
  };

  const formattedExpiry = expiryTimestamp
    ? new Date(expiryTimestamp).toLocaleDateString()
    : "Lifetime Active Key";

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <Sparkles className="text-orange-500 animate-spin" size={20} />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">VIP Subscribed Core Status</h2>
          <p className="text-[10px] text-gray-400 font-mono">Verify active licenses and claim premium daily server provisions</p>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-700 p-4 rounded-xl border border-orange-500/30 flex justify-between items-center text-white">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-orange-200">License Authority</span>
          <h3 className="text-sm font-extrabold font-mono uppercase">Otaku+ Diamond Member</h3>
          <p className="text-[9px] text-orange-100 font-mono">Expires/Renews: {formattedExpiry}</p>
        </div>
        <div className="h-10 w-10 bg-black/30 border border-white/20 rounded-full flex items-center justify-center font-bold text-sm">
          VIP
        </div>
      </div>

      {/* Daily Claim Section */}
      <div className="bg-gray-950 p-4 rounded-xl border border-gray-800/60 space-y-3">
        <h3 className="text-xs font-bold text-gray-300 font-mono uppercase flex items-center gap-1.5">
          <Gift size={13} className="text-orange-400" /> Daily Elite Care Package
        </h3>
        <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
          As a registered VIP subscriber, you are authorized to pull a curated care bundle containing <span className="text-orange-400 font-bold">500 Coins</span> and a premium <span className="text-orange-400 font-bold">Health Elixir</span> every 24 hours.
        </p>
        {dailyClaimed ? (
          <div className="w-full py-2.5 bg-gray-900 border border-gray-800 text-gray-500 rounded-lg text-center font-mono text-xs font-bold uppercase">
            Bounty Claimed ✓ (Resets in 14 hours)
          </div>
        ) : (
          <button
            onClick={claimDailyBounty}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-mono font-bold uppercase text-xs tracking-wide transition shadow-lg"
          >
            Claim Daily Celestial Rewards
          </button>
        )}
      </div>

      {/* Active Buffs list */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Active VIP Server Modifiers</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {activePrivileges.map((p, i) => (
            <div key={i} className="bg-gray-950 p-3 rounded-lg border border-gray-800/80 space-y-1">
              <span className="text-[11px] font-bold text-orange-400 font-mono flex items-center gap-1">
                <Zap size={11} className="text-orange-500 animate-pulse" /> {p.title}
              </span>
              <p className="text-[10px] text-gray-400 font-sans leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono text-gray-500 uppercase">VIP Bounty Log Feed</span>
        <div className="bg-black/80 p-2.5 rounded-lg border border-gray-800 font-mono text-[9px] text-orange-400/80 space-y-1 max-h-24 overflow-y-auto leading-relaxed">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

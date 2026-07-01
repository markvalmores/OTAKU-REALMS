import React from "react";
import { soundManager } from "../lib/soundManager";
import { ShieldAlert, Sparkles, Wand2, Compass } from "lucide-react";

interface FreeRoamProps {
  onSpawnSlime: () => void;
  onGrantMoney: () => void;
  onWarpTo7Eleven: () => void;
}

export default function FreeRoam({ onSpawnSlime, onGrantMoney, onWarpTo7Eleven }: FreeRoamProps) {
  const handleAction = (type: string, fn: () => void) => {
    soundManager.playSpecial();
    fn();
    alert(`⚡ Sandbox trigger: "${type}" command successfully executed in active game world!`);
  };

  return (
    <div className="bg-gray-950 border border-orange-500/30 p-4 rounded-2xl space-y-4">
      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
        <h3 className="font-heading text-sm text-white flex items-center gap-1.5">
          <Wand2 className="text-orange-500" size={16} /> Sandbox World Emulators
        </h3>
        <span className="text-[10px] text-gray-500 font-mono">Developer debug tools</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        <button
          onClick={() => handleAction("Spawn Slime Bot", onSpawnSlime)}
          className="p-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-orange-500/60 rounded-xl text-left font-mono transition text-xs text-white flex justify-between items-center"
        >
          <span>👾 Spawn Enemy Slime Mob</span>
          <span className="text-[9px] bg-red-950/60 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold uppercase">Spawn</span>
        </button>

        <button
          onClick={() => handleAction("Gift $200 Gold Box", onGrantMoney)}
          className="p-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-orange-500/60 rounded-xl text-left font-mono transition text-xs text-white flex justify-between items-center"
        >
          <span>📦 Grant $200 Premium Gold Box</span>
          <span className="text-[9px] bg-amber-950/60 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase">Grant</span>
        </button>

        <button
          onClick={() => handleAction("Instant Teleport to 7-Eleven", onWarpTo7Eleven)}
          className="p-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-orange-500/60 rounded-xl text-left font-mono transition text-xs text-white flex justify-between items-center"
        >
          <span>🛒 Warp to 7-Eleven Landmark (35, 25)</span>
          <span className="text-[9px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">Warp</span>
        </button>
      </div>

      <div className="p-2.5 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-[10px] text-indigo-300 flex items-center gap-2 font-mono">
        <ShieldAlert size={14} className="text-indigo-400" />
        <span>Sandbox variables bypass the cloud databases. State changes exist in local memory logs.</span>
      </div>
    </div>
  );
}

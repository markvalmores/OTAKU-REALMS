import React from "react";
import { Compass, Sparkles, AlertTriangle } from "lucide-react";

interface GroundProps {
  playerPos: { x: number; y: number };
}

export default function Ground({ playerPos }: GroundProps) {
  // Determine floor tier relative to current coordinates
  const floorName = playerPos.y > 60 ? "Southern Glitch Ruins" : playerPos.x < 40 ? "Western 7-Eleven Alleyways" : "Central Nexus";

  return (
    <div className="bg-gray-950 border border-orange-500/30 p-4 rounded-2xl space-y-3.5">
      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
        <h3 className="font-heading text-sm text-white flex items-center gap-1.5">
          <Compass size={16} className="text-orange-400" /> Ground Floor Diagnostics
        </h3>
        <span className="text-[10px] text-gray-500 font-mono">Soil layer status</span>
      </div>

      <div className="space-y-2 text-xs font-mono text-gray-300">
        <div>Tile Domain: <b className="text-white">{floorName}</b></div>
        <div>Friction Factor: <b className="text-orange-400">0.92 (High Friction)</b></div>
        <div>Swamp Presence: <b className="text-red-400">Radioactive Toxins Detected at (45, 45)</b></div>
      </div>

      {playerPos.x > 35 && playerPos.x < 55 && playerPos.y > 35 && playerPos.y < 55 && (
        <div className="p-2.5 bg-red-950/40 border border-red-500/40 rounded-xl text-[10px] text-red-400 flex items-center gap-1.5 font-mono animate-pulse">
          <AlertTriangle size={14} /> Critical Sickness: Your character is standing inside the Toxic Swamp! Escape quickly!
        </div>
      )}
    </div>
  );
}

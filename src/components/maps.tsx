import React from "react";
import { Compass, ShieldAlert, Sparkles, MapPin, Eye, Star, ShoppingBag } from "lucide-react";

interface MapsProps {
  playerPos: { x: number; y: number };
  onTeleport?: (x: number, y: number) => void;
}

export default function Maps({ playerPos, onTeleport }: MapsProps) {
  // Landmarks coordinates list
  const landmarks = [
    { name: "7-Eleven Minimart", x: 35, y: 25, color: "bg-emerald-500", icon: "🛒" },
    { name: "Quest Guild Command", x: 65, y: 55, color: "bg-indigo-500", icon: "⛩️" },
    { name: "Bronze Chest Crate", x: 20, y: 50, color: "bg-amber-500", icon: "📦" },
    { name: "Premium Supply Box", x: 80, y: 30, color: "bg-yellow-500", icon: "📦" },
    { name: "Sludge Swamp Center", x: 45, y: 45, color: "bg-red-500", icon: "☠️" },
  ];

  const handleWarp = (x: number, y: number, name: string) => {
    if (onTeleport) {
      onTeleport(x, y);
      alert(`🔮 Dimensional Warp: Transferred immediately to coordinate site of ${name}!`);
    }
  };

  return (
    <div className="bg-gray-950 border border-orange-500/30 p-4 rounded-2xl space-y-4">
      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
        <h3 className="font-heading text-sm text-white flex items-center gap-1.5">
          <Compass className="text-orange-500 animate-pulse" size={16} /> Interactive Space Navigator
        </h3>
        <span className="text-[10px] text-gray-500 font-mono">Fast travel point map</span>
      </div>

      {/* Grid Coordinates Map visualizer */}
      <div className="relative aspect-video w-full bg-slate-900 border-2 border-orange-500/40 rounded-xl overflow-hidden p-2">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        {/* Render player icon */}
        <div 
          className="absolute z-20 w-3 h-3 rounded-full bg-orange-500 border border-white animate-ping"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: 'translate(-50%, -50%)' }}
        />
        <div 
          className="absolute z-20 w-2.5 h-2.5 rounded-full bg-orange-600 border border-white flex items-center justify-center text-[6px] font-bold text-white shadow"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: 'translate(-50%, -50%)' }}
          title="Your location"
        >
          P
        </div>

        {/* Render landmarks on map */}
        {landmarks.map(mark => (
          <div
            key={mark.name}
            onClick={() => handleWarp(mark.x, mark.y, mark.name)}
            className="absolute cursor-pointer p-1 rounded-lg bg-gray-900 border border-gray-800 hover:border-orange-500 flex items-center gap-1 text-[8px] font-mono font-bold text-white transition-all hover:scale-105"
            style={{ left: `${mark.x}%`, top: `${mark.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <span>{mark.icon}</span>
            <span className="hidden sm:inline">{mark.name.split(" ")[0]}</span>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-gray-500 text-center font-mono">
        💡 Double click or select any landmark tag to warp player instantly!
      </div>
    </div>
  );
}

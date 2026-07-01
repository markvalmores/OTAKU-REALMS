import React, { useState, useEffect } from "react";
import { Compass, Zap, Anchor, RefreshCw, Star, Play } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface PortalProps {
  playerPos: { x: number; y: number };
  onTeleport: (x: number, y: number) => void;
}

export default function Portal({ playerPos, onTeleport }: PortalProps) {
  const [selectedGate, setSelectedGate] = useState("shibuya_cyber");
  const [coordinateX, setCoordinateX] = useState("45");
  const [coordinateY, setCoordinateY] = useState("65");
  const [portalPower, setPortalPower] = useState(85);
  const [isWarping, setIsWarping] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "System: Dimensional Portal Gateways initialized.",
    "Engine: Void stabilizers at 100% capacity."
  ]);

  const gates = [
    { id: "shibuya_cyber", name: "Shibuya Cyber Intersection", x: 45, y: 65, type: "Sci-Fi", multiplier: "1.0x" },
    { id: "akihabara_neon", name: "Akihabara Neon Boulevard", x: 20, y: 35, type: "City", multiplier: "1.2x" },
    { id: "kyoto_fantasy", name: "Kyoto Fantasy Shrine", x: 80, y: 15, type: "Ancient", multiplier: "1.5x" },
    { id: "isekai_forest", name: "Isekai Whispering Forest", x: 10, y: 90, type: "Nature", multiplier: "1.8x" },
    { id: "soul_society", name: "Soul Society Rukongai", x: 90, y: 85, type: "Celestial", multiplier: "2.0x" },
  ];

  const handleGateWarp = (gate: typeof gates[0]) => {
    if (isWarping) return;
    setIsWarping(true);
    soundManager.playSpecial();
    setLogs(prev => [`Warping: Activating Gateway to ${gate.name}...`, ...prev]);

    setTimeout(() => {
      onTeleport(gate.x, gate.y);
      setLogs(prev => [`Success: Arrived at ${gate.name} (${gate.x}, ${gate.y})!`, ...prev]);
      setIsWarping(false);
      soundManager.playLevelUp();
    }, 1500);
  };

  const handleManualWarp = (e: React.FormEvent) => {
    e.preventDefault();
    if (isWarping) return;
    const x = parseInt(coordinateX) || 0;
    const y = parseInt(coordinateY) || 0;
    
    setIsWarping(true);
    soundManager.playSpecial();
    setLogs(prev => [`Warping: Opening custom portal coordinates x: ${x}, y: ${y}...`, ...prev]);

    setTimeout(() => {
      onTeleport(x, y);
      setLogs(prev => [`Success: Portal traversal completed to destination [${x}, ${y}].`, ...prev]);
      setIsWarping(false);
      soundManager.playLevelUp();
    }, 1500);
  };

  const chargePortal = () => {
    soundManager.playSpecial();
    setPortalPower(100);
    setLogs(prev => ["System: Portal core power cell supercharged!", ...prev]);
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <Compass className="text-orange-500 animate-spin" size={20} />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Dimensional Portal Chamber</h2>
          <p className="text-[10px] text-gray-400 font-mono">Warp between spatial nodes and legendary anime locations</p>
        </div>
      </div>

      {/* Power core status */}
      <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800 flex justify-between items-center">
        <div>
          <span className="text-[10px] text-gray-400 font-mono uppercase block">Void Energy Core Power</span>
          <span className="text-sm font-extrabold font-mono text-orange-400">{portalPower}% Charged</span>
        </div>
        <button
          onClick={chargePortal}
          className="px-3 py-1.5 bg-gray-900 border border-orange-500/30 hover:bg-orange-600 hover:text-white rounded-lg text-xs font-mono font-bold transition flex items-center gap-1"
        >
          <Zap size={12} className="text-orange-400 animate-pulse" /> Supercharge
        </button>
      </div>

      {/* Gateway list */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Available Dimensional Gateways</span>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {gates.map((g) => (
            <div
              key={g.id}
              className="bg-gray-950 p-3 rounded-xl border border-gray-800 hover:border-orange-500/30 flex justify-between items-center transition"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <Star size={11} className="text-orange-500" />
                  <span className="text-xs font-bold text-gray-200">{g.name}</span>
                </div>
                <div className="flex gap-2 text-[10px] text-gray-500 font-mono mt-0.5">
                  <span>Coords: ({g.x}, {g.y})</span>
                  <span>•</span>
                  <span>Zone: {g.type}</span>
                  <span>•</span>
                  <span>Exp Boost: {g.multiplier}</span>
                </div>
              </div>
              <button
                onClick={() => handleGateWarp(g)}
                disabled={isWarping}
                className="px-2.5 py-1.5 bg-orange-600/90 hover:bg-orange-500 disabled:bg-gray-800 text-white rounded-lg text-[10px] font-mono font-bold uppercase transition flex items-center gap-1"
              >
                <Play size={10} /> Warp
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Coordinates Form */}
      <form onSubmit={handleManualWarp} className="bg-gray-950 p-3.5 rounded-xl border border-gray-800 space-y-3">
        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block">Custom Coordinates Traversal</span>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] text-gray-500 uppercase font-mono block mb-1">X Coord (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={coordinateX}
              onChange={(e) => setCoordinateX(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-800 text-xs font-mono rounded text-white"
            />
          </div>
          <div>
            <label className="text-[9px] text-gray-500 uppercase font-mono block mb-1">Y Coord (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={coordinateY}
              onChange={(e) => setCoordinateY(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-800 text-xs font-mono rounded text-white"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isWarping}
          className="w-full py-2 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-800 text-white rounded-lg text-xs font-mono font-bold uppercase transition flex items-center justify-center gap-1.5"
        >
          <Compass size={13} />
          {isWarping ? "Portal Traversal in Progress..." : "Initiate Direct Coordinates Warp"}
        </button>
      </form>

      {/* Portal Logs */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono text-gray-500 uppercase">Warp Vector Logs</span>
        <div className="bg-black/80 p-2.5 rounded-lg border border-gray-800 font-mono text-[9px] text-orange-400/80 space-y-1 max-h-24 overflow-y-auto leading-relaxed">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

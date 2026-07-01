import React, { useState, useEffect } from "react";
import { soundManager } from "../lib/soundManager";
import { Flame, Sparkles, MoveDown } from "lucide-react";

export default function Gravity() {
  const [gravityCoeff, setGravityCoeff] = useState(9.8); // Standard Earth gravity m/s^2
  const [boxOffset, setBoxOffset] = useState(0); // Offset translation for simulation box
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gravityCoeff < 3) {
      setIsFloating(true);
      timer = setInterval(() => {
        setBoxOffset(prev => Math.max(-60, prev - 2));
      }, 50);
    } else {
      setIsFloating(false);
      timer = setInterval(() => {
        setBoxOffset(prev => Math.min(0, prev + 4));
      }, 30);
    }
    return () => clearInterval(timer);
  }, [gravityCoeff]);

  const handleGravityChange = (val: number) => {
    setGravityCoeff(val);
    soundManager.playDodge();
    if (val < 3) {
      soundManager.playSpecial();
    } else if (val > 15) {
      soundManager.playHit();
    }
  };

  return (
    <div className="bg-gray-950 border border-orange-500/30 p-4 rounded-2xl space-y-4 text-xs font-mono">
      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
        <h3 className="font-heading text-sm text-white flex items-center gap-1.5">
          <MoveDown className="text-orange-500 animate-bounce" size={16} /> Dynamic Gravity Engine
        </h3>
        <span className="text-[10px] bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded-full font-mono">
          {gravityCoeff.toFixed(1)} m/s²
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleGravityChange(1.6)}
          className={`py-1.5 rounded font-bold uppercase transition text-[10px] ${
            gravityCoeff === 1.6 ? 'bg-orange-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          🌙 Moon (1.6)
        </button>
        <button
          onClick={() => handleGravityChange(9.8)}
          className={`py-1.5 rounded font-bold uppercase transition text-[10px] ${
            gravityCoeff === 9.8 ? 'bg-orange-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          🌍 Earth (9.8)
        </button>
        <button
          onClick={() => handleGravityChange(24.8)}
          className={`py-1.5 rounded font-bold uppercase transition text-[10px] ${
            gravityCoeff === 24.8 ? 'bg-orange-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          🪐 Jupiter (24.8)
        </button>
      </div>

      {/* Fun physics simulation box */}
      <div className="relative h-24 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex items-end justify-center p-2">
        <div 
          className="w-10 h-10 rounded-lg bg-orange-500 border border-white flex items-center justify-center text-lg shadow-lg transition-transform duration-100"
          style={{ transform: `translateY(${boxOffset}px)` }}
        >
          📦
        </div>

        {isFloating && (
          <div className="absolute top-2 text-[8px] uppercase text-orange-400 font-bold animate-pulse flex items-center gap-1">
            <Sparkles size={10} className="animate-spin" /> ANTI-GRAVITY FLOATING STATE
          </div>
        )}
      </div>
    </div>
  );
}

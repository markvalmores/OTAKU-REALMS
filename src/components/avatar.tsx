import React, { useState } from "react";
import { Sliders, RefreshCw, Zap, Shield, Shirt, Sparkles, UserCheck } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export default function AvatarProfileSystem() {
  const [height, setHeight] = useState<number>(1.75); // 1.75 meters
  const [shoulderRatio, setShoulderRatio] = useState<number>(1.0);
  const [hairLength, setHairLength] = useState<number>(40);
  const [hairColor, setHairColor] = useState<string>("#e5e7eb");
  const [skinColor, setSkinColor] = useState<string>("#fed7aa"); // light orange tone
  const [activeOutfit, setActiveOutfit] = useState<string>("Standard Cyber Armor");
  const [glowIntensity, setGlowIntensity] = useState<number>(0.8);

  const outfitList = [
    "Standard Cyber Armor",
    "Midnight Shinobi Kimono",
    "Shibuya DJ Streetwear",
    "Heavy Exo-Tactical Plating"
  ];

  const handleReset = () => {
    setHeight(1.75);
    setShoulderRatio(1.0);
    setHairLength(40);
    setHairColor("#ea580c");
    setSkinColor("#fed7aa");
    setActiveOutfit("Standard Cyber Armor");
    setGlowIntensity(0.8);
    soundManager.playLevelUp();
    alert("🧙 Custom Customizer: Reverted all avatar biometric ratios to standard preset values!");
  };

  return (
    <div className="bg-gray-900/90 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <UserCheck className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Biometric Avatar Customizer</h2>
            <p className="text-[10px] text-gray-400 font-mono">Calibrate character heights, skeletal mesh sizing ratios, hair shaders, and custom neon decals</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="bg-gray-950 hover:bg-gray-850 text-gray-400 hover:text-white border border-gray-800 text-[10px] font-mono px-2 py-1 rounded flex items-center gap-1 transition"
        >
          <RefreshCw size={10} /> Reset Sliders
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left column: 2D Visual avatar proxy card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-gray-950 p-4 rounded-xl border border-gray-850 relative text-center space-y-3">
          <span className="text-[9px] font-mono text-emerald-400 absolute top-2 right-2 uppercase bg-emerald-950 px-1.5 border border-emerald-500/10 rounded font-bold">Mesh Verified</span>
          
          {/* Visual Avatar mockup reflecting colors */}
          <div className="w-[180px] h-[220px] bg-slate-900 rounded-xl relative border border-orange-500/15 overflow-hidden flex flex-col items-center justify-center space-y-3 p-4 shadow-inner">
            {/* Hair */}
            <div 
              className="w-16 h-12 rounded-t-full absolute top-12 transition duration-300"
              style={{ backgroundColor: hairColor, height: `${20 + hairLength / 2}px` }}
            />
            {/* Head */}
            <div 
              className="w-12 h-12 rounded-full z-10 transition duration-300" 
              style={{ backgroundColor: skinColor }}
            />
            {/* Torso/Armor with glow */}
            <div 
              className="w-20 rounded-b-2xl z-10 transition duration-300 flex items-center justify-center"
              style={{ 
                backgroundColor: activeOutfit === "Midnight Shinobi Kimono" ? "#1e1b4b" : activeOutfit === "Shibuya DJ Streetwear" ? "#0f172a" : activeOutfit === "Heavy Exo-Tactical Plating" ? "#475569" : "#ea580c",
                height: `${55 * height}px`,
                width: `${40 * shoulderRatio}px`,
                boxShadow: `0 0 ${glowIntensity * 20}px ${activeOutfit === "Standard Cyber Armor" ? "#ea580c" : "#818cf8"}`
              }}
            >
              <span className="text-[7.5px] font-mono text-white/50 text-center px-1 font-bold">ARMOR</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-bold text-white uppercase">{activeOutfit}</h3>
            <p className="text-[10px] font-mono text-gray-500">Biometric height index: {height.toFixed(2)} meters</p>
          </div>
        </div>

        {/* Right column: Config matrices */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-850 space-y-3.5">
            <span className="text-[10px] font-mono text-orange-400 uppercase font-bold block">🧙 Skeletal Ratios</span>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-gray-300">
                  <span>Character Height Offset</span>
                  <span className="text-orange-400 font-bold">{height.toFixed(2)} meters</span>
                </div>
                <input 
                  type="range" min="1.40" max="2.20" step="0.05" value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value))}
                  className="w-full accent-orange-500" 
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-gray-300">
                  <span>Shoulder Width Multiplier</span>
                  <span className="text-orange-400 font-bold">{shoulderRatio.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" min="0.75" max="1.50" step="0.05" value={shoulderRatio}
                  onChange={(e) => setShoulderRatio(parseFloat(e.target.value))}
                  className="w-full accent-orange-500" 
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-gray-300">
                  <span>Hair Shader length</span>
                  <span className="text-orange-400 font-bold">{hairLength} px</span>
                </div>
                <input 
                  type="range" min="10" max="100" value={hairLength}
                  onChange={(e) => setHairLength(parseInt(e.target.value))}
                  className="w-full accent-orange-500" 
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-950 p-4 rounded-xl border border-gray-850 space-y-3">
            <span className="text-[10px] font-mono text-orange-400 uppercase font-bold block">🎨 Material Shader Shading</span>
            
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <span className="text-[9px] text-gray-500 font-mono block">Hair Base Tint</span>
                <div className="grid grid-cols-4 gap-1">
                  {["#ea580c", "#38bdf8", "#ec4899", "#10b981", "#e5e7eb", "#a855f7"].map(col => (
                    <button
                      key={col}
                      onClick={() => {
                        setHairColor(col);
                        soundManager.playSpecial();
                      }}
                      className="w-full h-5 rounded-md border border-gray-800 transition"
                      style={{ backgroundColor: col, outline: hairColor === col ? "2px solid #ea580c" : "none" }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-gray-500 font-mono block">Skin Tone Tint</span>
                <div className="grid grid-cols-4 gap-1">
                  {["#fed7aa", "#ffedd5", "#fbcfe8", "#fbbf24", "#d97706", "#78350f"].map(col => (
                    <button
                      key={col}
                      onClick={() => {
                        setSkinColor(col);
                        soundManager.playSpecial();
                      }}
                      className="w-full h-5 rounded-md border border-gray-800 transition"
                      style={{ backgroundColor: col, outline: skinColor === col ? "2px solid #ea580c" : "none" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-850 space-y-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase font-bold block">👗 Select Outfit Slot</span>
            <div className="grid grid-cols-2 gap-1.5">
              {outfitList.map(outfit => (
                <button
                  key={outfit}
                  onClick={() => {
                    setActiveOutfit(outfit);
                    soundManager.playSpecial();
                  }}
                  className={`py-1.5 text-[9.5px] font-mono font-bold rounded-lg border transition ${
                    activeOutfit === outfit
                      ? "bg-amber-600 text-black border-amber-400"
                      : "bg-gray-900 text-gray-500 border-gray-850 hover:bg-gray-850"
                  }`}
                >
                  {outfit}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

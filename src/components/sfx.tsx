import React from "react";
import { soundManager } from "../lib/soundManager";
import { Volume2, Play, VolumeX, Radio } from "lucide-react";

export default function SFX() {
  const handleTrigger = (type: 'hit' | 'dodge' | 'special' | 'levelUp') => {
    if (type === 'hit') soundManager.playHit();
    if (type === 'dodge') soundManager.playDodge();
    if (type === 'special') soundManager.playSpecial();
    if (type === 'levelUp') soundManager.playLevelUp();
  };

  const soundboard = [
    { label: "⚔️ Melee Slash (Hit)", type: 'hit' as const, desc: "Standard attack swipe sample" },
    { label: "💨 Swift Dash (Dodge)", type: 'dodge' as const, desc: "Movement step audio sample" },
    { label: "🔮 Portal Warp (Special)", type: 'special' as const, desc: "Loot chest / dimension transition sound" },
    { label: "🌟 Transmutation (Upgrade)", type: 'levelUp' as const, desc: "Hero rank ascension melody" },
  ];

  return (
    <div className="bg-gray-950 border border-orange-500/30 p-4 rounded-2xl space-y-4">
      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
        <h3 className="font-heading text-sm text-white flex items-center gap-1.5">
          <Volume2 className="text-orange-500 animate-bounce" size={16} /> Acoustic SFX Soundboard
        </h3>
        <span className="text-[10px] text-gray-500 font-mono">Analog synthesizer test</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {soundboard.map(snd => (
          <div 
            key={snd.label}
            onClick={() => handleTrigger(snd.type)}
            className="p-3 bg-gray-900 border border-gray-800 hover:border-orange-500/60 rounded-xl cursor-pointer transition text-left space-y-1"
          >
            <div className="text-xs font-bold text-white flex justify-between items-center">
              <span>{snd.label}</span>
              <Play size={10} className="text-orange-400" />
            </div>
            <p className="text-[9px] text-gray-500 font-sans">{snd.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

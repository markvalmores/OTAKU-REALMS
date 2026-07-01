import React, { useState } from "react";
import { Sparkles, Edit3, Check, Star, RefreshCw } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface NamesProps {
  charName: string;
  onSaveName: (name: string) => void;
}

export default function Names({ charName, onSaveName }: NamesProps) {
  const [name, setName] = useState(charName);
  const [selectedTitle, setSelectedTitle] = useState("Vanguard Recruit");

  const prefixes = ["Kuro", "Sasuke", "Shana", "Tohsaka", "Sakuragi", "Yuki", "Kirito", "Goku", "Mikasa", "Lelouch", "Asuka"];
  const suffixes = ["Slayer", "Shinobi", "Archmage", "Beater", "Uchiha", "Dragneel", "Valkyrie", "Shinigami", "Titan"];
  
  const titles = [
    "Vanguard Recruit",
    "Celestial Champion",
    "S-Tier Otaku Warrior",
    "Void Wanderer",
    "Legendary Ronin",
    "Rogue Demon Hunter"
  ];

  const handleGenerateRandomName = () => {
    soundManager.playSpecial();
    const pre = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suf = suffixes[Math.floor(Math.random() * suffixes.length)];
    const randomName = `${pre}_${suf}`;
    setName(randomName);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSaveName(name);
    soundManager.playLevelUp();
    alert(`Success: Your hero identity is now updated to [${name}]!`);
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <Sparkles className="text-orange-500 animate-spin" size={20} />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Identity Name Generator</h2>
          <p className="text-[10px] text-gray-400 font-mono">Roll randomized legendary names and customize your active character titles</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Name Input & Generator Button */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Hero Persona ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
              placeholder="Enter custom identity"
              className="flex-grow p-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-orange-500/50"
            />
            <button
              type="button"
              onClick={handleGenerateRandomName}
              className="px-3 bg-gray-950 border border-gray-800 hover:border-orange-500/30 text-gray-300 rounded-xl transition flex items-center gap-1 text-xs"
            >
              <RefreshCw size={13} className="animate-spin text-orange-400" /> Roll
            </button>
          </div>
          <span className="text-[9px] text-gray-500 font-mono block">Supports letters, digits, and underscores.</span>
        </div>

        {/* Title selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Acquired Celestial Title</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {titles.map((title, i) => {
              const isSelected = selectedTitle === title;
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => { setSelectedTitle(title); soundManager.playSpecial(); }}
                  className={`p-2.5 rounded-xl border text-[11px] font-mono text-left transition flex items-center justify-between ${
                    isSelected
                      ? "bg-orange-950/20 border-orange-500/50 text-orange-400 font-extrabold"
                      : "bg-gray-950 border-gray-800 text-gray-400 hover:border-orange-500/10"
                  }`}
                >
                  <span>{title}</span>
                  {isSelected && <Star size={10} className="text-orange-500 fill-orange-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-mono font-bold uppercase text-xs tracking-wider transition flex items-center justify-center gap-1.5"
        >
          <Edit3 size={13} /> Update Character Persona
        </button>
      </form>
    </div>
  );
}

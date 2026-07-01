import React, { useState } from "react";
import { Sliders, RefreshCw, Zap, Shield, Eye, Trash2, Copy, Plus, Check, Star } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export interface AvatarCatalogItem {
  id: string;
  name: string;
  className: string;
  level: number;
  combatRating: number;
  equippedWeapons: string[];
  rarity: "Standard" | "Epic" | "Legendary";
}

export default function AvatarsCatalog() {
  const [selectedAvatar, setSelectedAvatar] = useState<string>("chara_kuro");
  const [avatars, setAvatars] = useState<AvatarCatalogItem[]>([
    { id: "chara_kuro", name: "Kuro Bladekeeper", className: "Shinobi Assassin", level: 25, combatRating: 1240, equippedWeapons: ["Saber", "Kunai"], rarity: "Epic" },
    { id: "chara_sakura", name: "Sakura Blossom", className: "Divine Priestess", level: 18, combatRating: 980, equippedWeapons: ["Sceptre", "Staff"], rarity: "Standard" },
    { id: "chara_cyber", name: "Cyber Samurai 2077", className: "Heavy Mech Warrior", level: 42, combatRating: 2500, equippedWeapons: ["Plasma Katana", "Blaster"], rarity: "Legendary" },
    { id: "chara_neko", name: "Mimi Neko", className: "Arcane Mage", level: 31, combatRating: 1820, equippedWeapons: ["Grimoire"], rarity: "Epic" },
  ]);

  const activeAvatar = avatars.find(a => a.id === selectedAvatar) || avatars[0];

  const handleClone = (chara: AvatarCatalogItem) => {
    const clone: AvatarCatalogItem = {
      ...chara,
      id: `chara_clone_${Date.now()}`,
      name: `${chara.name} (Clone)`,
      level: 1,
      combatRating: Math.floor(chara.combatRating * 0.6)
    };
    setAvatars(prev => [...prev, clone]);
    soundManager.playLevelUp();
    alert(`⚡ Clone Success: "${chara.name}" successfully duplicated inside the Avatar slots bank!`);
  };

  const handleDelete = (id: string, name: string) => {
    if (avatars.length <= 1) {
      alert("⚠️ Error: You must preserve at least one active Avatar profile!");
      return;
    }
    setAvatars(prev => prev.filter(a => a.id !== id));
    setSelectedAvatar(avatars[0].id);
    soundManager.playHit();
    alert(`🗑️ Deletion Complete: Removed "${name}" database logs successfully.`);
  };

  const handleCreateNew = () => {
    const fresh: AvatarCatalogItem = {
      id: `chara_custom_${Date.now()}`,
      name: "Neo Wanderer " + (avatars.length + 1),
      className: "Cyber Rogue",
      level: 1,
      equippedWeapons: ["Bronze Dagger"],
      combatRating: 100,
      rarity: "Standard"
    };
    setAvatars(prev => [...prev, fresh]);
    setSelectedAvatar(fresh.id);
    soundManager.playLevelUp();
    alert(`🧙 Character Generated: Created slot "${fresh.name}" successfully!`);
  };

  return (
    <div className="bg-gray-900/90 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Star className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Character Roster Catalog</h2>
            <p className="text-[10px] text-gray-400 font-mono">Select, clone, create, and delete multiple custom avatar entries from the central database</p>
          </div>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-orange-600 hover:bg-orange-500 text-black text-[10px] font-mono px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold transition shadow-lg"
        >
          <Plus size={12} /> Create Avatar preset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Avatars List */}
        <div className="lg:col-span-6 space-y-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Rigged Avatars Database</span>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {avatars.map((chara) => {
              const isSelected = chara.id === selectedAvatar;
              return (
                <div
                  key={chara.id}
                  onClick={() => {
                    setSelectedAvatar(chara.id);
                    soundManager.playSpecial();
                  }}
                  className={`p-3 rounded-xl border font-mono transition cursor-pointer flex justify-between items-center ${
                    isSelected 
                      ? "bg-orange-950/40 border-orange-500 text-orange-400 shadow-lg" 
                      : "bg-gray-950 border-gray-850 text-gray-400 hover:bg-gray-900 hover:border-gray-800"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-bold text-white">{chara.name}</span>
                      <span className={`text-[8px] border px-1 rounded uppercase font-bold ${
                        chara.rarity === "Legendary" ? "bg-amber-950 text-amber-400 border-amber-500/20 animate-pulse" : chara.rarity === "Epic" ? "bg-purple-950 text-purple-400 border-purple-500/20" : "bg-gray-900 text-gray-400 border-gray-800"
                      }`}>
                        {chara.rarity}
                      </span>
                    </div>
                    <div className="flex gap-4 text-[9px] text-gray-500">
                      <span>Level: {chara.level}</span>
                      <span>•</span>
                      <span>Class: {chara.className}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleClone(chara)}
                      title="Clone Slot"
                      className="p-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-850 rounded text-gray-400 hover:text-white transition"
                    >
                      <Copy size={11} />
                    </button>
                    <button
                      onClick={() => handleDelete(chara.id, chara.name)}
                      title="Delete Slot"
                      className="p-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-950 rounded text-red-400 transition"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed active avatar profile matrix */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-850 space-y-3 font-mono">
            <span className="text-[10px] text-orange-400 uppercase font-bold block border-b border-gray-900 pb-1.5">📊 Slot Stats: {activeAvatar.name}</span>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-gray-500 block">Class Specialization</span>
                <span className="text-white font-bold">{activeAvatar.className}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-500 block">Experience Level</span>
                <span className="text-white font-bold">Lvl {activeAvatar.level} / 100</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-500 block">Combat Rating Power</span>
                <span className="text-orange-400 font-bold">{activeAvatar.combatRating.toLocaleString()} PTS</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-500 block">Starting Arsenal</span>
                <span className="text-cyan-400 font-bold truncate">{activeAvatar.equippedWeapons.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

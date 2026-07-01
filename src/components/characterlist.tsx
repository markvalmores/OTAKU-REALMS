import React, { useState } from "react";
import { Search, Star, Swords, RefreshCw, Flame } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface CharacterListProps {
  onSelectCharacter?: (name: string) => void;
  activeCharacter?: string;
}

export default function CharacterList({ onSelectCharacter, activeCharacter }: CharacterListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const characters = [
    { name: "Kuro Shinobi", role: "Assassin", level: 45, power: 3400, avatar: "🥷", quote: "Strike fast, disappear into shadows." },
    { name: "Goku Warrior", role: "Warrior", level: 80, power: 12000, avatar: "🔥", quote: "Let's push our limits together!" },
    { name: "Megumi Chan", role: "Sorcerer", level: 99, power: 15000, avatar: "🧙‍♀️", quote: "Creating alternate lines of logic." },
    { name: "Saitama Shogun", role: "Warrior", level: 85, power: 12500, avatar: "🧑‍🦲", quote: "One strike is usually enough." },
    { name: "Tohsaka Rin", role: "Sorcerer", level: 32, power: 2200, avatar: "👧", quote: "Mana grids successfully tuned." }
  ];

  const filtered = characters.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || c.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSelect = (name: string) => {
    soundManager.playSpecial();
    if (onSelectCharacter) {
      onSelectCharacter(name);
    } else {
      alert(`Active Hero set to: ${name}`);
    }
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <Swords className="text-orange-500 animate-pulse" size={20} />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Roster Registry Index</h2>
          <p className="text-[10px] text-gray-400 font-mono">Index, evaluate, and marshal active characters into battle formations</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-[9px] text-gray-500 uppercase font-mono block mb-1">Search Database</label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Goku"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pl-8 bg-gray-950 border border-gray-800 rounded-lg text-white text-xs focus:outline-none"
            />
            <Search className="absolute left-2.5 top-3 text-gray-500" size={12} />
          </div>
        </div>
        <div>
          <label className="text-[9px] text-gray-500 uppercase font-mono block mb-1">Filter Profession</label>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); soundManager.playSpecial(); }}
            className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-white text-xs focus:outline-none"
          >
            <option value="All">All</option>
            <option value="Warrior">Warrior</option>
            <option value="Sorcerer">Sorcerer</option>
            <option value="Assassin">Assassin</option>
          </select>
        </div>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {filtered.map((char, i) => {
          const isActive = activeCharacter === char.name;

          return (
            <div
              key={i}
              className={`bg-gray-950 p-3 rounded-xl border flex justify-between items-center transition ${
                isActive ? "border-orange-500 shadow-md" : "border-gray-850 hover:border-gray-800"
              }`}
            >
              <div className="flex gap-3">
                <span className="text-3xl bg-gray-900 h-12 w-12 border border-gray-800 rounded-xl flex items-center justify-center shrink-0">
                  {char.avatar}
                </span>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-gray-200">{char.name}</h3>
                  <p className="text-[10px] text-gray-500 font-sans italic">"{char.quote}"</p>
                  <div className="flex gap-2 text-[9px] text-orange-400 font-mono">
                    <span>Lvl {char.level}</span>
                    <span>•</span>
                    <span>{char.role}</span>
                    <span>•</span>
                    <span>{char.power.toLocaleString()} CP</span>
                  </div>
                </div>
              </div>

              <div>
                {isActive ? (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1">
                    Active ✓
                  </span>
                ) : (
                  <button
                    onClick={() => handleSelect(char.name)}
                    className="px-2.5 py-1 bg-gray-800 hover:bg-orange-600/20 text-gray-200 hover:text-white rounded text-[10px] font-mono uppercase transition border border-gray-700 hover:border-orange-500/30"
                  >
                    Select
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

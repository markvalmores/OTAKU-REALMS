import React, { useState } from "react";
import { soundManager } from "../lib/soundManager";
import { User, ShieldAlert, Sparkles, Star, Users } from "lucide-react";

interface AnimeChar {
  id: string;
  name: string;
  class: string;
  avatar: string;
  specialMove: string;
  cost: number;
  unlocked: boolean;
}

const DEFAULT_CHARACTERS: AnimeChar[] = [
  { id: "mage_rin", name: "Rin Tohsaka", class: "Mage", avatar: "🧙‍♀️", specialMove: "Jewel Storm Blast", cost: 0, unlocked: true },
  { id: "swordsman_kirito", name: "Kazuto 'Kirito' Kirigaya", class: "Warrior", avatar: "🤺", specialMove: "Dual Starburst Stream", cost: 250, unlocked: false },
  { id: "ninja_naruto", name: "Naruto Uzumaki", class: "Ninja", avatar: "🦊", specialMove: "Sage Rasengan Whirlwind", cost: 500, unlocked: false },
  { id: "cyber_motoko", name: "Major Motoko", class: "Cyber Assassin", avatar: "🤖", specialMove: "Ghost-Hacking Strike", cost: 1000, unlocked: false }
];

interface CharactersProps {
  money: number;
  setMoney: React.Dispatch<React.SetStateAction<number>>;
  onSelectCharacter?: (avatar: string, charClass: string, name: string) => void;
}

export default function Characters({ money, setMoney, onSelectCharacter }: CharactersProps) {
  const [characterList, setCharacterList] = useState<AnimeChar[]>(DEFAULT_CHARACTERS);
  const [selectedId, setSelectedId] = useState("mage_rin");

  const handleUnlock = (char: AnimeChar) => {
    if (money < char.cost) {
      soundManager.playHit();
      alert(`❌ Insufficient gold coins! You need $${char.cost} to hire ${char.name}. Open chests or defeat slimes to earn money!`);
      return;
    }

    soundManager.playLevelUp();
    setMoney(prev => prev - char.cost);
    setCharacterList(prev => prev.map(c => c.id === char.id ? { ...c, unlocked: true } : c));
    alert(`✨ Unlocked ${char.name}! You can now deploy them into the Realms.`);
  };

  const handleSelect = (char: AnimeChar) => {
    if (!char.unlocked) return;
    setSelectedId(char.id);
    soundManager.playSpecial();
    if (onSelectCharacter) {
      onSelectCharacter(char.avatar, char.class, char.name);
    }
    alert(`🧙 Character Switch: Deployed ${char.name} as your active avatar!`);
  };

  return (
    <div className="bg-gray-950 border border-orange-500/30 p-4 rounded-2xl space-y-4">
      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
        <h3 className="font-heading text-sm text-white flex items-center gap-1.5">
          <Users className="text-orange-500" size={16} /> Anime Hero Rosters
        </h3>
        <span className="text-[10px] text-gray-500">Deployable Avatars</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {characterList.map(char => {
          const isSelected = selectedId === char.id;
          return (
            <div
              key={char.id}
              onClick={() => char.unlocked && handleSelect(char)}
              className={`p-3 rounded-xl bg-gray-900 border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected 
                  ? 'border-orange-500 bg-gray-800/80 shadow' 
                  : char.unlocked 
                    ? 'border-gray-800 hover:border-gray-700' 
                    : 'border-gray-950 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-2xl mb-1">{char.avatar}</span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />}
              </div>

              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-white truncate">{char.name}</h4>
                <div className="text-[9px] text-orange-400 font-mono font-bold uppercase">{char.class}</div>
                <div className="text-[8px] text-gray-400 font-mono italic truncate">Move: {char.specialMove}</div>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-800/60 flex justify-between items-center">
                {char.unlocked ? (
                  <span className="text-[8px] font-mono font-bold text-emerald-400">UNLOCKED</span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnlock(char);
                    }}
                    className="w-full py-1 text-center bg-orange-600 hover:bg-orange-500 text-white font-bold rounded text-[8px] transition uppercase"
                  >
                    Hire: ${char.cost}
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

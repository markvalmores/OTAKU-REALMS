import React from "react";
import { Sparkles, Star, ShieldAlert } from "lucide-react";

export interface GachaCharacter {
  id: string;
  name: string;
  avatar: string;
  tier: 3 | 4 | 5;
  role: string;
  quote: string;
  power: number;
}

export const gachaCharacters: GachaCharacter[] = [
  { id: "megumi", name: "Admin Megumi", avatar: "🧙‍♀️", tier: 5, role: "Sorcerer Elite", quote: "Creating digital timelines is trivial work.", power: 15000 },
  { id: "saitama", name: "Saitama_99", avatar: "🧑‍🦲", tier: 5, role: "Brawler God", quote: "I just wanted to buy discounted cabbage.", power: 12000 },
  { id: "kirito", name: "Kirito_Beater", avatar: "🗡️", tier: 4, role: "Assassin Master", quote: "There are limits to single-sword methods.", power: 8500 },
  { id: "asuka", name: "Asuka Langley", avatar: "👱‍♀️", tier: 4, role: "Mage Shogun", quote: "Who are you calling a low-ranking pilot?", power: 7200 },
  { id: "kamina", name: "Kamina Gurren", avatar: "🕶️", tier: 4, role: "Warrior Leader", quote: "Pierce the celestial firmaments with your drill!", power: 6900 },
  { id: "rin", name: "Tohsaka Rin", avatar: "👧", tier: 3, role: "Sorcerer Apprentice", quote: "Prepare your mana reservoirs, comrade.", power: 4200 },
  { id: "shana", name: "Shana Flame", avatar: "👩", tier: 3, role: "Fire Samurai", quote: "Urusai Urusai Urusai!", power: 3900 }
];

export default function GachaChara() {
  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <Sparkles className="text-orange-500 animate-spin" size={20} />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Chronicle Character Database</h2>
          <p className="text-[10px] text-gray-400 font-mono">Detailed indices of characters summonable via temporal warp portals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
        {gachaCharacters.map((char) => (
          <div
            key={char.id}
            className="bg-gray-950 p-3.5 rounded-xl border border-gray-850 flex items-start gap-3 hover:border-orange-500/15 transition"
          >
            <div className="text-3xl bg-gray-900 h-12 w-12 rounded-xl border border-gray-800 flex items-center justify-center shrink-0">
              {char.avatar}
            </div>
            <div className="space-y-1 flex-grow">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-gray-200">{char.name}</span>
                <div className="flex text-amber-500">
                  {Array.from({ length: char.tier }).map((_, idx) => (
                    <Star key={idx} size={10} className="fill-amber-500 text-amber-500" />
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-orange-400 font-mono block">{char.role} • {char.power.toLocaleString()} CP</span>
              <p className="text-[10px] text-gray-500 italic font-sans">"{char.quote}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

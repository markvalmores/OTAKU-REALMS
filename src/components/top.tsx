import React from "react";
import { Star, ShieldAlert, Heart, Eye, MessageSquare } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export default function Top() {
  const elite = [
    {
      name: "Admin_Megumi",
      avatar: "🧙‍♀️",
      title: "Celestial Archmage",
      tag: "DEVELOPER",
      color: "from-red-900/40 to-orange-950/40 border-red-500/30",
      textColor: "text-red-400",
      quote: "Creating infinite digital universes with pure TypeScript streams.",
      level: 99,
      soulRating: "150,000 SP"
    },
    {
      name: "Saitama_99",
      avatar: "🧑‍🦲",
      title: "One Punch Shogun",
      tag: "HALL OF FAME",
      color: "from-yellow-900/40 to-amber-950/40 border-yellow-500/30",
      textColor: "text-yellow-400",
      quote: "I just fought five Level 100 slimes. They all vanished in one strike.",
      level: 85,
      soulRating: "120,000 SP"
    },
    {
      name: "Asuka_Langley",
      avatar: "👩‍🦰",
      title: "Eva Empress",
      tag: "VIP DIAMOND",
      color: "from-purple-900/40 to-indigo-950/40 border-purple-500/30",
      textColor: "text-purple-400",
      quote: "What are you? An idiot? Secure Otaku+ today and catch up with me!",
      level: 62,
      soulRating: "75,000 SP"
    }
  ];

  const handleInspect = (name: string) => {
    soundManager.playSpecial();
    alert(`Inspecting Hall of Fame record for ${name}...`);
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <Star className="text-yellow-500 animate-spin" size={20} />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Celestial Hall of Fame</h2>
          <p className="text-[10px] text-gray-400 font-mono">The highest echelon of warriors, developers, and speedrunners</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {elite.map((hero, i) => (
          <div
            key={i}
            className={`bg-gradient-to-r p-4 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${hero.color}`}
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl bg-black/40 h-16 w-16 rounded-2xl border border-gray-800 flex items-center justify-center shrink-0">
                {hero.avatar}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-gray-100 font-mono">{hero.name}</h3>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded border border-gray-800 bg-black/50 font-bold uppercase ${hero.textColor}`}>
                    {hero.tag}
                  </span>
                </div>
                <span className="text-xs text-orange-400 font-bold block font-mono">{hero.title}</span>
                <p className="text-[11px] text-gray-400 italic max-w-xs leading-relaxed font-sans">
                  "{hero.quote}"
                </p>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col justify-between sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-gray-800/60 pt-3 sm:pt-0 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">Character Power</span>
                <span className="text-xs font-bold text-white">LVL {hero.level} / {hero.soulRating}</span>
              </div>
              <div className="flex gap-1.5 self-end sm:self-auto">
                <button
                  onClick={() => handleInspect(hero.name)}
                  className="p-1.5 bg-black/40 border border-gray-800 hover:border-orange-500/30 rounded text-gray-400 hover:text-white transition"
                >
                  <Eye size={12} />
                </button>
                <button
                  onClick={() => { soundManager.playSpecial(); alert(`Sending DM to ${hero.name}`); }}
                  className="p-1.5 bg-black/40 border border-gray-800 hover:border-orange-500/30 rounded text-gray-400 hover:text-white transition"
                >
                  <MessageSquare size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

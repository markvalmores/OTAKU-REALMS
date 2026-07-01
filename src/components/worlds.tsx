import React, { useState } from "react";
import { soundManager } from "../lib/soundManager";
import { Compass, Sparkles, Globe, MapPin, Radio } from "lucide-react";

interface World {
  id: string;
  name: string;
  description: string;
  dangerLevel: "Peaceful" | "Moderate" | "Extremely Toxic" | "Weeb Chaos";
  bgColor: string;
  emoji: string;
}

const DEFAULT_WORLDS: World[] = [
  {
    id: "shibuya_cyber",
    name: "Cyber Shibuya 2099",
    description: "Futuristic neon sprawl haunted by glitchy rogue programmers and anime code bots.",
    dangerLevel: "Moderate",
    bgColor: "from-purple-900 to-indigo-950",
    emoji: "🌆"
  },
  {
    id: "shinigami_valley",
    name: "Shinigami Hollows",
    description: "Shadow-laden battlefield where samurai anime souls duel with heavy soul swords.",
    dangerLevel: "Weeb Chaos",
    bgColor: "from-red-950 to-slate-950",
    emoji: "⛩️"
  },
  {
    id: "otaku_high",
    name: "Otaku Academy Grounds",
    description: "The peaceful classroom and rooftop courtyard starting zone. Sickness is rare.",
    dangerLevel: "Peaceful",
    bgColor: "from-emerald-950 to-teal-900",
    emoji: "🏫"
  },
  {
    id: "sludge_wasteland",
    name: "Toxic Sludge Core",
    description: "Extreme radioactive marshland where stepping into swamps induces toxic poison.",
    dangerLevel: "Extremely Toxic",
    bgColor: "from-green-950 to-yellow-950",
    emoji: "🤢"
  }
];

interface WorldsProps {
  currentWorldId?: string;
  onTravelWorld?: (worldId: string) => void;
}

export default function Worlds({ currentWorldId = "otaku_high", onTravelWorld }: WorldsProps) {
  const [activeId, setActiveId] = useState(currentWorldId);

  const handleTravel = (world: World) => {
    setActiveId(world.id);
    soundManager.playLevelUp();
    if (onTravelWorld) {
      onTravelWorld(world.id);
    }
    alert(`🛸 Hyperspace Jump successful! Entered: "${world.name}"`);
  };

  return (
    <div className="bg-gray-950 border border-orange-500/30 p-4 rounded-2xl space-y-4">
      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
        <h3 className="font-heading text-sm text-white flex items-center gap-1.5">
          <Globe className="text-orange-500 animate-spin" size={16} /> Anime Dimensions Spindle
        </h3>
        <span className="text-[10px] bg-indigo-900/40 text-indigo-400 px-2 py-0.5 rounded-full font-mono">
          4 SERVERS LIVE
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {DEFAULT_WORLDS.map(world => {
          const isActive = activeId === world.id;
          return (
            <div
              key={world.id}
              className={`p-3 rounded-xl bg-gradient-to-r ${world.bgColor} border transition-all ${
                isActive 
                  ? 'border-orange-500 shadow-lg scale-[1.01]' 
                  : 'border-gray-800 hover:border-gray-700 opacity-85 hover:opacity-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{world.emoji}</span>
                  <div>
                    <h4 className="font-bold text-xs text-white">{world.name}</h4>
                    <span className={`text-[8px] font-mono font-bold ${
                      world.dangerLevel === 'Peaceful' ? 'text-green-400' :
                      world.dangerLevel === 'Moderate' ? 'text-sky-400' :
                      world.dangerLevel === 'Extremely Toxic' ? 'text-green-500' : 'text-red-400 animate-pulse'
                    }`}>
                      DANGER: {world.dangerLevel.toUpperCase()}
                    </span>
                  </div>
                </div>

                {isActive ? (
                  <span className="flex items-center gap-1 text-[8px] font-mono bg-orange-600 text-white px-2 py-0.5 rounded uppercase font-bold animate-pulse">
                    <Radio size={10} /> Occupying
                  </span>
                ) : (
                  <button
                    onClick={() => handleTravel(world)}
                    className="text-[9px] bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-2.5 py-1 rounded transition"
                  >
                    Warp Gate
                  </button>
                )}
              </div>
              <p className="text-[10px] text-gray-300 mt-2 font-sans leading-relaxed">{world.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

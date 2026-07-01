import React, { useState } from "react";
import { Award, Trophy, Star, Shield, Search } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export default function Ranking() {
  const [activeMetric, setActiveMetric] = useState<"level" | "money" | "soul" | "wins">("level");
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("All");

  const [leaderboard] = useState([
    { rank: 1, name: "Admin_Megumi", class: "Sorcerer", level: 99, money: 85000, soul: 150000, wins: 412, badge: "Developer" },
    { rank: 2, name: "Saitama_99", class: "Warrior", level: 85, money: 24000, soul: 120000, wins: 389, badge: "Hero" },
    { rank: 3, name: "Kirito_Beater", class: "Assassin", level: 74, money: 18500, soul: 98000, wins: 245, badge: "Legend" },
    { rank: 4, name: "Asuka_Langley", class: "Mage", level: 62, money: 12000, soul: 75000, wins: 152, badge: "Otaku+" },
    { rank: 5, name: "Kamina_Gurren", class: "Warrior", level: 55, money: 8900, soul: 62000, wins: 118, badge: "Leader" },
    { rank: 6, name: "Lelouch_VI", class: "Sorcerer", level: 48, money: 15000, soul: 58000, wins: 98, badge: "Tactician" }
  ]);

  const classes = ["All", "Warrior", "Mage", "Assassin", "Sorcerer"];

  const handleMetricChange = (metric: "level" | "money" | "soul" | "wins") => {
    setActiveMetric(metric);
    soundManager.playSpecial();
  };

  const filtered = leaderboard
    .filter(player => {
      const matchName = player.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchClass = classFilter === "All" || player.class === classFilter;
      return matchName && matchClass;
    })
    .sort((a, b) => {
      if (activeMetric === "level") return b.level - a.level;
      if (activeMetric === "money") return b.money - a.money;
      if (activeMetric === "soul") return b.soul - a.soul;
      return b.wins - a.wins;
    });

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <Trophy className="text-orange-500 animate-bounce" size={20} />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Global Highscores & Rankings</h2>
          <p className="text-[10px] text-gray-400 font-mono">Real-time database records of legendary heroes and developers</p>
        </div>
      </div>

      {/* Sorting Tabs */}
      <div className="grid grid-cols-4 gap-1 border-b border-gray-850 pb-3">
        {(["level", "money", "soul", "wins"] as const).map((metric) => (
          <button
            key={metric}
            onClick={() => handleMetricChange(metric)}
            className={`py-1.5 rounded-lg text-[10px] font-bold font-mono uppercase transition ${
              activeMetric === metric ? "bg-orange-600 text-white shadow" : "bg-gray-950 text-gray-500 hover:bg-gray-850"
            }`}
          >
            {metric}
          </button>
        ))}
      </div>

      {/* Filters Form */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-[9px] text-gray-500 uppercase font-mono block mb-1">Search Name</label>
          <input
            type="text"
            placeholder="e.g. Saitama"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-white text-xs focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[9px] text-gray-500 uppercase font-mono block mb-1">Filter Class</label>
          <select
            value={classFilter}
            onChange={(e) => { setClassFilter(e.target.value); soundManager.playSpecial(); }}
            className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-white text-xs focus:outline-none"
          >
            {classes.map((cls, i) => (
              <option key={i} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Highscores list */}
      <div className="bg-gray-950 rounded-xl border border-gray-800/60 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-850 text-[9px] uppercase font-mono text-gray-500">
              <th className="p-2.5 text-center">Rank</th>
              <th className="p-2.5">Comrade</th>
              <th className="p-2.5 text-center">Class</th>
              <th className="p-2.5 text-right uppercase">{activeMetric}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900/60 font-mono text-[11px]">
            {filtered.map((player, idx) => {
              const displayVal =
                activeMetric === "level" ? `Lvl ${player.level}` :
                activeMetric === "money" ? `${player.money}c` :
                activeMetric === "soul" ? `${player.soul.toLocaleString()} SP` :
                `${player.wins} Wins`;

              return (
                <tr key={idx} className="hover:bg-gray-900/40">
                  <td className="p-2.5 text-center">
                    {player.rank === 1 ? (
                      <Trophy size={14} className="text-yellow-500 mx-auto" />
                    ) : player.rank === 2 ? (
                      <Trophy size={14} className="text-gray-400 mx-auto" />
                    ) : player.rank === 3 ? (
                      <Trophy size={14} className="text-amber-600 mx-auto" />
                    ) : (
                      <span className="text-gray-500">#{player.rank}</span>
                    )}
                  </td>
                  <td className="p-2.5">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-gray-200">{player.name}</span>
                      {player.badge === "Developer" && <span className="text-[8px] bg-red-900 text-red-400 px-1 rounded font-bold uppercase">DEV</span>}
                    </div>
                  </td>
                  <td className="p-2.5 text-center text-gray-400 text-[10px]">
                    {player.class}
                  </td>
                  <td className="p-2.5 text-right font-extrabold text-orange-400">
                    {displayVal}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

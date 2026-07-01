import React, { useState } from "react";
import { UserPlus, UserMinus, Search, Heart, Send, Sparkles } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface FollowProps {
  money: number;
  onSendGift: (cost: number) => void;
}

export default function Follow({ money, onSendGift }: FollowProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [followedList, setFollowedList] = useState([
    { name: "Saitama_99", class: "Warrior", activity: "Exploring Shibuya Cyber", isFollowing: true, level: 42 },
    { name: "Asuka_Langley", class: "Mage", activity: "Customizing Avatar Gear", isFollowing: true, level: 25 },
    { name: "Kirito_Beater", class: "Assassin", activity: "Fighting Boss Slimes", isFollowing: false, level: 35 },
    { name: "Tohsaka_Rin", class: "Sorcerer", activity: "Offline", isFollowing: false, level: 18 }
  ]);

  const toggleFollow = (index: number) => {
    soundManager.playSpecial();
    const updated = [...followedList];
    updated[index].isFollowing = !updated[index].isFollowing;
    setFollowedList(updated);
  };

  const handleSendGift = (name: string) => {
    if (money < 50) {
      alert("Insufficient balance to buy gift. Requires 50 Coins.");
      return;
    }
    soundManager.playLevelUp();
    onSendGift(50);
    alert(`🎁 Success: Gifted 50 Coins worth of health elixirs to ${name}!`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSpecial();
  };

  const filtered = followedList.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <Heart className="text-orange-500 animate-pulse" size={20} />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Social Comrade Network</h2>
          <p className="text-[10px] text-gray-400 font-mono">Follow online players, track locations, and exchange gift bundles</p>
        </div>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search username (e.g. Saitama)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2.5 pl-9 bg-gray-950 border border-gray-800 rounded-xl text-xs focus:outline-none focus:border-orange-500/50"
          />
          <Search className="absolute left-3 top-3 text-gray-500" size={13} />
        </div>
      </form>

      {/* List of comrades */}
      <div className="space-y-3">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Player Status Feed</span>
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {filtered.map((user, i) => (
            <div
              key={i}
              className="bg-gray-950 p-3 rounded-xl border border-gray-800 hover:border-orange-500/10 flex justify-between items-center transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${user.activity === "Offline" ? "bg-gray-600" : "bg-emerald-500 animate-ping"}`} />
                  <span className="text-xs font-bold text-gray-200">{user.name}</span>
                  <span className="text-[9px] font-mono text-orange-400">LVL {user.level}</span>
                </div>
                <div className="flex gap-2 text-[10px] text-gray-500 font-mono">
                  <span>Class: {user.class}</span>
                  <span>•</span>
                  <span>{user.activity}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleFollow(i)}
                  className={`p-2 rounded-lg transition ${
                    user.isFollowing ? "bg-gray-800 text-orange-400 border border-gray-750" : "bg-orange-600 text-white hover:bg-orange-500"
                  }`}
                >
                  {user.isFollowing ? <UserMinus size={13} /> : <UserPlus size={13} />}
                </button>
                {user.activity !== "Offline" && (
                  <button
                    onClick={() => handleSendGift(user.name)}
                    className="px-2.5 bg-gray-950 border border-gray-800 hover:border-orange-500/30 text-gray-300 rounded-lg text-[10px] font-mono font-bold uppercase transition flex items-center gap-1"
                  >
                    <Send size={9} /> Gift 50c
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

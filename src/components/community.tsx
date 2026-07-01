import React, { useState } from "react";
import { Users, FileText, Plus, MessageSquare, Award, ArrowUpRight } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface CommunityProps {
  onAddMoney?: (amount: number) => void;
}

export default function Community({ onAddMoney }: CommunityProps) {
  const [activeSubTab, setActiveSubTab] = useState<"clans" | "board" | "raids">("clans");
  const [clans, setClans] = useState([
    { name: "Slayers of Shibuya", leader: "Kirito_Beater", members: 45, soulPower: 89000, desc: "Primary faction dedicated to cleansing cyber anomalies." },
    { name: "Akihabara Maid Force", leader: "Asuka_Langley", members: 32, soulPower: 65000, desc: "Cosplay commandos fighting with the power of love and lattes." },
    { name: "Uchiha Descendants", leader: "Itachi_Fan01", members: 18, soulPower: 41000, desc: "A dark rogue syndicate harnessing cursed flame elements." }
  ]);

  const [posts, setPosts] = useState([
    { id: 1, title: "Official Otaku Realms Patch Notes v1.42", author: "DevMegumi", replies: 28, likes: 89, date: "Today" },
    { id: 2, title: "Guide: Best places to farm Soul Shards", author: "Lvl100Mage", replies: 14, likes: 45, date: "Yesterday" },
    { id: 3, title: "Are there any active players from the Philippines?", author: "GamerPinoy", replies: 8, likes: 12, date: "2 days ago" }
  ]);

  // Faction Create Forms State
  const [newClanName, setNewClanName] = useState("");
  const [newClanDesc, setNewClanDesc] = useState("");
  const [joinedClan, setJoinedClan] = useState<string | null>(null);

  const handleCreateClan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClanName.trim()) return;
    soundManager.playSpecial();

    const newClan = {
      name: newClanName,
      leader: "You",
      members: 1,
      soulPower: 2500,
      desc: newClanDesc || "No description provided."
    };

    setClans(prev => [...prev, newClan]);
    setJoinedClan(newClanName);
    setNewClanName("");
    setNewClanDesc("");
    soundManager.playLevelUp();
  };

  const joinClan = (name: string) => {
    soundManager.playLevelUp();
    setJoinedClan(name);
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Users className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Community & Clans Alliance</h2>
            <p className="text-[10px] text-gray-400 font-mono">Form squads, organize guild expeditions, and post guides</p>
          </div>
        </div>
      </div>

      {/* Sub tabs navigation */}
      <div className="grid grid-cols-3 gap-2 border-b border-gray-800 pb-3">
        {(["clans", "board", "raids"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveSubTab(tab); soundManager.playSpecial(); }}
            className={`py-2 rounded-lg text-xs font-bold font-mono uppercase transition ${
              activeSubTab === tab ? "bg-orange-600 text-white shadow" : "bg-gray-950 text-gray-500 hover:bg-gray-850"
            }`}
          >
            {tab === "clans" ? "🏰 Clans" : tab === "board" ? "📋 Forum" : "⚔️ raids"}
          </button>
        ))}
      </div>

      {/* Factions list tab */}
      {activeSubTab === "clans" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Top Performing Clans</span>
            {joinedClan && (
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                Member of: {joinedClan}
              </span>
            )}
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {clans.map((clan, i) => (
              <div key={i} className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-gray-200">{clan.name}</h3>
                    <p className="text-[10px] text-gray-500 font-mono">Leader: {clan.leader} • {clan.members} members</p>
                  </div>
                  {joinedClan === clan.name ? (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Member ✓</span>
                  ) : (
                    <button
                      onClick={() => joinClan(clan.name)}
                      className="px-2.5 py-1 bg-gray-800 border border-gray-700 hover:border-orange-500/30 text-gray-200 rounded text-[10px] font-mono font-bold uppercase"
                    >
                      Join
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 font-sans leading-relaxed">{clan.desc}</p>
                <div className="flex justify-between items-center text-[9px] font-mono text-orange-400">
                  <span>Soul Rating: {clan.soulPower.toLocaleString()} SP</span>
                </div>
              </div>
            ))}
          </div>

          {/* Create custom clan */}
          <form onSubmit={handleCreateClan} className="bg-gray-950 p-3.5 rounded-xl border border-gray-800 space-y-3">
            <span className="text-xs font-mono text-gray-300 uppercase tracking-wider block">Found Custom Clan</span>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Clan Name (e.g. Kyoto Ronins)"
                value={newClanName}
                onChange={(e) => setNewClanName(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-gray-800 text-xs font-sans rounded text-white"
              />
              <textarea
                placeholder="Clan Motto / Focus Description"
                value={newClanDesc}
                onChange={(e) => setNewClanDesc(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-gray-800 text-xs font-sans rounded text-white h-16 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded font-mono font-bold uppercase text-xs transition flex items-center justify-center gap-1"
            >
              <Plus size={13} /> Deploy Clan Alliance (Costs 100c)
            </button>
          </form>
        </div>
      )}

      {/* Discussion Board tab */}
      {activeSubTab === "board" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Otaku Alliance Forums</span>
            <button
              onClick={() => { soundManager.playSpecial(); alert("Write post feature simulated!"); }}
              className="px-2.5 py-1 bg-orange-600/90 hover:bg-orange-500 text-white rounded text-[10px] font-mono font-bold uppercase transition flex items-center gap-1"
            >
              <FileText size={10} /> Post Thread
            </button>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-950 p-3 rounded-xl border border-gray-800/80 hover:border-orange-500/20 transition flex justify-between items-center cursor-pointer">
                <div>
                  <h3 className="text-xs font-bold text-gray-200 hover:text-orange-400 transition">{post.title}</h3>
                  <div className="flex gap-2 text-[10px] text-gray-500 font-mono mt-1">
                    <span>By {post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                </div>
                <div className="flex gap-3 text-[10px] font-mono text-gray-400">
                  <span className="flex items-center gap-1"><MessageSquare size={10} /> {post.replies}</span>
                  <span className="flex items-center gap-1"><ArrowUpRight size={10} className="text-orange-500" /> {post.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raids / Cooperative missions tab */}
      {activeSubTab === "raids" && (
        <div className="space-y-3 font-mono text-xs">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block">Active Clan Raid Deployments</span>
          
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3">
            <div className="flex justify-between items-center border-b border-gray-900 pb-2">
              <h3 className="font-bold text-orange-400">👿 Ancient Kyuubi Summon</h3>
              <span className="text-[10px] px-1.5 bg-rose-950 text-rose-400 rounded border border-rose-500/20 uppercase font-bold">Raid Boss</span>
            </div>
            <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
              Assemble a squad of 4 players with a combined Soul Rating over <span className="text-orange-400 font-bold">30,000 SP</span> to challenge the fox demon at the Kyoto fantasy shrine.
            </p>
            <div className="flex justify-between items-center text-[10px] pt-1">
              <span>Time Left: <span className="text-orange-500 font-bold">14h 23m</span></span>
              <span>Loot Pool: <span className="text-emerald-400 font-bold">2,500 Coins + 1 Rare Ring</span></span>
            </div>
            <button
              onClick={() => { soundManager.playSpecial(); alert("Searching for active raid parties..."); }}
              className="w-full py-2 bg-rose-900/90 hover:bg-rose-800 text-white rounded font-bold uppercase transition text-xs"
            >
              ⚔️ Search for Raid Parties
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

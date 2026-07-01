import React from "react";
import { 
  User, Globe, Compass, Users, Flame, Settings, ShieldAlert, Award,
  Heart, MessageSquare, Share2, Sparkles, Trophy, Mic, Eye, Server, RefreshCw,
  Briefcase, TrendingUp, Swords, Coins, BookOpen, HelpCircle, Shirt, Crown, List
} from "lucide-react";

interface MenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
}

export default function Menu({ activeTab, setActiveTab, isAdmin }: MenuProps) {
  const categories = [
    {
      title: "🚘 GTA Free Roam Sandbox",
      items: [
        { id: "vrm", label: "VRM Avatar Engine", icon: Shirt },
        { id: "glb", label: "GLB Environment Mesh", icon: Globe },
        { id: "stages", label: "GTA Stages Hub", icon: Compass },
      ]
    },
    {
      title: "🎮 Game Operations",
      items: [
        { id: "player", label: "Player Stats", icon: User },
        { id: "worlds", label: "Warp Servers", icon: Globe },
        { id: "worldslist", label: "Realms Directory", icon: Compass },
        { id: "characterlist", label: "Roster Indices", icon: List },
        { id: "settings", label: "Launcher Config", icon: Settings },
      ]
    },
    {
      title: "⚙️ Jobs & Grind",
      items: [
        { id: "jobs", label: "Career Jobs", icon: Briefcase },
        { id: "earn", label: "Earn Tasks", icon: TrendingUp },
        { id: "grind", label: "Slime Grinding", icon: Swords },
        { id: "anicash", label: "Wallet Exchange", icon: Coins },
      ]
    },
    {
      title: "🔮 Warp & Collectibles",
      items: [
        { id: "gacha", label: "Warp Gacha", icon: Sparkles },
        { id: "gachachara", label: "Collectible DB", icon: BookOpen },
        { id: "gachamechanic", label: "Rates & Rules", icon: HelpCircle },
        { id: "pity", label: "Pity Ledger", icon: ShieldAlert },
      ]
    },
    {
      title: "👗 Wardrobe & Specials",
      items: [
        { id: "clothes", label: "Wardrobe Outfit", icon: Shirt },
        { id: "premiumchara", label: "Premium Allies", icon: Crown },
      ]
    },
    {
      title: "🌍 Social Sector",
      items: [
        { id: "follow", label: "Social Allies", icon: Heart },
        { id: "chats", label: "Tactical Chats", icon: MessageSquare },
        { id: "community", label: "Clans Alliance", icon: Users },
        { id: "invite", label: "Invite Allies", icon: Share2 },
      ]
    },
    {
      title: "💎 Premium Otaku+",
      items: [
        { id: "otakuplus", label: "VIP Shop", icon: Sparkles },
        { id: "subscribed", label: "VIP Panel", icon: Award },
        { id: "ranking", label: "Highscores", icon: Trophy },
        { id: "top", label: "Hall of Fame", icon: Eye },
      ]
    },
    {
      title: "🎙️ Comms & Identity",
      items: [
        { id: "mic", label: "Voice Mic", icon: Mic },
        { id: "names", label: "Hero Generator", icon: RefreshCw },
      ]
    }
  ];

  return (
    <div className="bg-gray-950 border border-orange-500/30 p-4 rounded-2xl space-y-4 shadow-xl">
      {categories.map((cat, catIdx) => (
        <div key={catIdx} className="space-y-1.5">
          <span className="text-[10px] font-mono text-orange-400/80 uppercase tracking-widest font-extrabold block">
            {cat.title}
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {cat.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isActive 
                      ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg border-orange-500/40' 
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-850 border-gray-950'
                  }`}
                >
                  <Icon size={12} className={isActive ? "text-white animate-pulse" : "text-gray-500"} />
                  <span className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {isAdmin && (
        <div className="pt-2 border-t border-gray-900">
          <button
            onClick={() => setActiveTab("admin")}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'admin'
                ? 'bg-red-800 text-white border-red-500'
                : 'bg-red-950/20 text-red-400 hover:bg-red-950/40 border-red-500/20'
            }`}
          >
            <ShieldAlert size={14} className="animate-pulse" />
            <span className="text-[11px] whitespace-nowrap font-extrabold uppercase">Admin Terminal</span>
          </button>
        </div>
      )}
    </div>
  );
}

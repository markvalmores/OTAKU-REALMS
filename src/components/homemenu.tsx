import React, { useState } from "react";
import { soundManager } from "../lib/soundManager";
import { Play, Flame, HelpCircle, Laptop, ShieldCheck, HelpCircle as HelpIcon, Music, Radio, Volume2, User, KeyRound } from "lucide-react";

interface HomeMenuProps {
  onStartStoryMode: () => void;
  onStartFreeRoam: () => void;
  onSelectTab: (tab: string) => void;
  userEmail?: string;
  onLogout: () => void;
  isAdmin: boolean;
}

const CINEMATIC_PLAYLIST = [
  { name: "Otaku Realms Tokyo Synth", length: "3:42", genre: "Chiptune Lofi" },
  { name: "Shibuya Drift Electro Waves", length: "2:15", genre: "Synthwave Beat" },
  { name: "Shinigami Hollows Heavy Choir", length: "4:05", genre: "Epic Metal Rock" },
  { name: "Ramen Stall Quiet Raindrops", length: "5:12", genre: "Ambient Relaxation" }
];

export default function HomeMenu({
  onStartStoryMode,
  onStartFreeRoam,
  onSelectTab,
  userEmail,
  onLogout,
  isAdmin
}: HomeMenuProps) {
  const [activeSelectIndex, setActiveSelectIndex] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlayingSong, setIsPlayingSong] = useState(true);

  const menuOptions = [
    { label: "⚔️ LAUNCH STORY CAMPAIGN", action: onStartStoryMode, description: "Engage in the sacred anime questline, reclaim Tokyo realms from poisonous anomalies, and earn legendary badges." },
    { label: "🗺️ SANDBOX FREE ROAM", action: onStartFreeRoam, description: "Unrestricted world testing. Spawn infinite mobs, teleport instantly to 7-Eleven mart landmarks, and collect lootboxes." },
    { label: "🧙 HERO PROFILE & ANATOMY", action: () => onSelectTab("player"), description: "View your physical body parts condition, health pools, stats growth, and sub-anatomy integrity." },
    { label: "⚙️ GAME CONTROL OPTIMIZATIONS", action: () => onSelectTab("settings"), description: "Configure custom keyboard re-binders, adjust volume gain, and activate Low or ULTRAKILL graphics presets." },
  ];

  const handleSongPlay = (idx: number) => {
    setCurrentSongIndex(idx);
    setIsPlayingSong(true);
    soundManager.playLevelUp();
  };

  return (
    <div className="bg-gray-950 border-4 border-orange-600 rounded-3xl p-6 md:p-10 space-y-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Background artwork decoration (Not copyrighted, custom stylized) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-[70px] pointer-events-none" />

      {/* Top Banner section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-5 z-10 gap-3">
        <div>
          <h2 className="text-4xl md:text-5xl font-heading tracking-tighter text-orange-500 font-black uppercase flex items-center gap-2">
            OTAKU REALMS <span className="text-[12px] bg-orange-600 text-white px-2.5 py-0.5 rounded-full tracking-wider font-mono">LIVE BUILD v2.0</span>
          </h2>
          <p className="text-gray-400 text-xs font-mono max-w-xl">
            Welcome back, <b className="text-white">{userEmail || "Otaku Knight"}</b>. Device hardware drivers successfully loaded.
          </p>
        </div>

        <button 
          onClick={onLogout}
          className="px-4 py-1.5 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded text-xs font-mono transition"
        >
          Sign Out Account
        </button>
      </div>

      {/* Main Grid: Left Column (Sliding options like GTA V), Right Column (Radio/Stats info) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10">
        
        {/* Left Column (Sliding GTA V inspired options) */}
        <div className="lg:col-span-2 space-y-3.5">
          {menuOptions.map((opt, idx) => {
            const isHovered = activeSelectIndex === idx;
            return (
              <div 
                key={opt.label}
                onMouseEnter={() => {
                  setActiveSelectIndex(idx);
                  soundManager.playDodge();
                }}
                onClick={opt.action}
                className={`p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer flex justify-between items-center ${
                  isHovered 
                    ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white border-orange-500 shadow-xl scale-[1.01]' 
                    : 'bg-gray-900/60 text-gray-300 border-gray-800 hover:bg-gray-900'
                }`}
              >
                <div className="space-y-1 pr-4">
                  <h3 className={`font-heading text-base font-bold uppercase tracking-tight ${isHovered ? 'text-white' : 'text-orange-400'}`}>
                    {opt.label}
                  </h3>
                  <p className="text-[11px] opacity-80 leading-relaxed font-sans">{opt.description}</p>
                </div>
                <Play size={16} className={`shrink-0 ${isHovered ? 'text-white animate-bounce' : 'text-gray-600'}`} />
              </div>
            );
          })}
        </div>

        {/* Right Column (Acoustics & Radio playlist soundtrack controller) */}
        <div className="space-y-4">
          <div className="bg-gray-900/40 border border-orange-500/20 rounded-2xl p-4 space-y-3.5">
            <h4 className="text-xs font-bold text-orange-400 flex items-center gap-1.5 uppercase tracking-wide border-b border-gray-800/80 pb-2">
              <Radio className="text-orange-500 animate-pulse" size={14} /> OTAKU FM SOUNDTRACKS
            </h4>

            <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 flex items-center justify-between text-xs font-mono text-gray-300">
              <div className="flex items-center gap-2">
                <Music size={14} className="text-orange-400 animate-bounce" />
                <div>
                  <div className="text-[11px] font-bold text-white truncate max-w-[120px]">{CINEMATIC_PLAYLIST[currentSongIndex].name}</div>
                  <div className="text-[9px] text-gray-500">{CINEMATIC_PLAYLIST[currentSongIndex].genre}</div>
                </div>
              </div>
              <span className="text-[9px] bg-orange-950/60 text-orange-400 border border-orange-500/10 px-2 py-0.5 rounded uppercase">
                {isPlayingSong ? "PLAYING" : "MUTED"}
              </span>
            </div>

            <div className="space-y-1">
              {CINEMATIC_PLAYLIST.map((song, sIdx) => {
                const isSelected = currentSongIndex === sIdx;
                return (
                  <div 
                    key={song.name}
                    onClick={() => handleSongPlay(sIdx)}
                    className={`p-2 rounded-lg text-xs font-mono flex justify-between items-center cursor-pointer border transition ${
                      isSelected 
                        ? 'bg-orange-950/50 text-orange-400 border-orange-500/30' 
                        : 'bg-transparent text-gray-400 border-transparent hover:bg-gray-900/60'
                    }`}
                  >
                    <div className="truncate max-w-[150px]">
                      {sIdx + 1}. {song.name}
                    </div>
                    <span className="text-[10px] text-gray-500">{song.length}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 text-[10px] text-gray-400 space-y-1.5 font-mono">
            <div>GPU/CPU CORE DRIVER: <b className="text-emerald-400">100% OPERATIONAL</b></div>
            <div>CONSOLE CONTROLLER: <b className="text-indigo-400">XBOX INPUT EMULATION</b></div>
            <div>STATUS POOL: <b className="text-amber-400">NORMAL</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}

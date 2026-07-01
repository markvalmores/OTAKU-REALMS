import React, { useState } from "react";
import { Globe, ShieldAlert, Sparkles, Star, Settings, CheckCircle, RefreshCw, Cpu } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export interface InstanceSettings {
  globalMultiplier: number;
  ramenPayout: number;
  securityPayout: number;
  cafePayout: number;
  guildPayout: number;
  shibuyaActive: boolean;
  akihabaraActive: boolean;
  kyotoActive: boolean;
  customWorldName1: string;
  customWorldName2: string;
  customWorldName3: string;
}

interface WorldsListProps {
  currentWorldId: string;
  onTravelWorld: (id: string) => void;
  instanceSettings: InstanceSettings;
  onUpdateSettings: (settings: InstanceSettings) => void;
}

export default function WorldsList({ currentWorldId, onTravelWorld, instanceSettings, onUpdateSettings }: WorldsListProps) {
  const [showOwnerConfig, setShowOwnerConfig] = useState(false);

  const realms = [
    {
      id: "shibuya_cyber",
      name: instanceSettings.customWorldName1 || "Shibuya Cyber Sector",
      description: "Neon filled intersections crowded with holographic billboards and rogue glitched scripts.",
      difficulty: "Starter Node",
      rewardBonus: `${(instanceSettings.globalMultiplier * 1.0).toFixed(1)}x Base Drops`,
      bg: "border-blue-500/20",
      active: instanceSettings.shibuyaActive
    },
    {
      id: "akihabara_neon",
      name: instanceSettings.customWorldName2 || "Akihabara Neon Plaza",
      description: "Electronic alleys packed with game arcades, cosplay factions, and high-frequency synth music.",
      difficulty: "Intermediate",
      rewardBonus: `${(instanceSettings.globalMultiplier * 1.5).toFixed(1)}x Multiplier`,
      bg: "border-purple-500/20",
      active: instanceSettings.akihabaraActive
    },
    {
      id: "kyoto_fantasy",
      name: instanceSettings.customWorldName3 || "Kyoto Fantasy Shrine",
      description: "Sacred cherry blossoms and ancient pagodas where powerful demon fox spirits manifest.",
      difficulty: "Advanced Chaos",
      rewardBonus: `${(instanceSettings.globalMultiplier * 2.0).toFixed(1)}x Ultimate Drops`,
      bg: "border-orange-500/20",
      active: instanceSettings.kyotoActive
    }
  ];

  const handleTravel = (id: string) => {
    soundManager.playSpecial();
    onTravelWorld(id);
    alert(`Initiating dimensional teleportation grid warp. Calibrating frequency...`);
  };

  const handleFieldChange = (key: keyof InstanceSettings, value: any) => {
    onUpdateSettings({
      ...instanceSettings,
      [key]: value
    });
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Globe className="text-orange-500 animate-spin" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Universal Realm Directory</h2>
            <p className="text-[10px] text-gray-400 font-mono">Warp between available reality domains and capture special sector bonuses</p>
          </div>
        </div>

        <button
          onClick={() => {
            setShowOwnerConfig(!showOwnerConfig);
            soundManager.playSpecial();
          }}
          className="px-3 py-1 bg-gray-950 hover:bg-orange-600/20 border border-gray-850 hover:border-orange-500/30 text-[10px] font-mono text-orange-400 rounded-lg transition flex items-center gap-1.5"
        >
          <Settings size={12} className="animate-spin text-orange-500" />
          {showOwnerConfig ? "Hide Owner Config" : "Instance Settings"}
        </button>
      </div>

      {showOwnerConfig && (
        <div className="bg-gray-950 p-4 rounded-xl border border-orange-500/20 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-gray-900 pb-2">
            <Cpu className="text-orange-500" size={14} />
            <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 font-bold">🛠️ Instance Owner Control Matrix</span>
          </div>

          {/* World Name overrides */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Configure Instance Worlds</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <label className="text-[9px] text-gray-500 font-mono block">Shibuya Sector Title</label>
                <input
                  type="text"
                  value={instanceSettings.customWorldName1}
                  onChange={(e) => handleFieldChange("customWorldName1", e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-850 rounded text-xs font-mono text-white focus:outline-none focus:border-orange-500/40"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-gray-500 font-mono block">Akihabara Plaza Title</label>
                <input
                  type="text"
                  value={instanceSettings.customWorldName2}
                  onChange={(e) => handleFieldChange("customWorldName2", e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-850 rounded text-xs font-mono text-white focus:outline-none focus:border-orange-500/40"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-gray-500 font-mono block">Kyoto Shrine Title</label>
                <input
                  type="text"
                  value={instanceSettings.customWorldName3}
                  onChange={(e) => handleFieldChange("customWorldName3", e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-850 rounded text-xs font-mono text-white focus:outline-none focus:border-orange-500/40"
                />
              </div>
            </div>
          </div>

          {/* Job Payout configurations */}
          <div className="space-y-3 pt-2 border-t border-gray-900">
            <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Custom Occupational Wage Rates</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="space-y-1">
                <label className="text-[9px] text-gray-500 font-mono block">Ramen Shop (AC)</label>
                <input
                  type="number"
                  value={instanceSettings.ramenPayout}
                  onChange={(e) => handleFieldChange("ramenPayout", Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full p-2 bg-gray-900 border border-gray-850 rounded text-xs font-mono text-white focus:outline-none focus:border-orange-500/40"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-gray-500 font-mono block">Cyber Security (AC)</label>
                <input
                  type="number"
                  value={instanceSettings.securityPayout}
                  onChange={(e) => handleFieldChange("securityPayout", Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full p-2 bg-gray-900 border border-gray-850 rounded text-xs font-mono text-white focus:outline-none focus:border-orange-500/40"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-gray-500 font-mono block">Maid Cafe (AC)</label>
                <input
                  type="number"
                  value={instanceSettings.cafePayout}
                  onChange={(e) => handleFieldChange("cafePayout", Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full p-2 bg-gray-900 border border-gray-850 rounded text-xs font-mono text-white focus:outline-none focus:border-orange-500/40"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-gray-500 font-mono block">Isekai Guild (AC)</label>
                <input
                  type="number"
                  value={instanceSettings.guildPayout}
                  onChange={(e) => handleFieldChange("guildPayout", Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full p-2 bg-gray-900 border border-gray-850 rounded text-xs font-mono text-white focus:outline-none focus:border-orange-500/40"
                />
              </div>
            </div>
          </div>

          {/* Global multipliers */}
          <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-gray-900">
            <div className="space-y-1">
              <label className="text-[9px] text-gray-500 font-mono block">Global Gold/Exp multiplier</label>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={instanceSettings.globalMultiplier}
                onChange={(e) => handleFieldChange("globalMultiplier", parseFloat(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="text-right text-[10px] font-mono text-orange-400 font-bold">{instanceSettings.globalMultiplier.toFixed(1)}x</div>
            </div>

            <div className="flex gap-2 items-center justify-end h-full pt-4">
              <span className="text-[9px] text-emerald-400 font-mono bg-emerald-950/20 px-2 py-1 rounded border border-emerald-500/20">
                Instance Settings Active ✓
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {realms.map((realm) => {
          const isActive = currentWorldId === realm.id;

          return (
            <div
              key={realm.id}
              className={`bg-gray-950 p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition ${realm.bg} ${
                isActive ? "border-orange-500 shadow-md" : ""
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs font-bold text-gray-200">{realm.name}</h3>
                  <span className="text-[8px] bg-gray-900 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase font-mono">
                    {realm.difficulty}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-sans leading-relaxed max-w-md">{realm.description}</p>
                <div className="text-[9px] font-mono text-orange-400 uppercase flex items-center gap-1">
                  <Sparkles size={10} /> {realm.rewardBonus}
                </div>
              </div>

              <div>
                {isActive ? (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block text-right">
                    Current Location ✓
                  </span>
                ) : (
                  <button
                    onClick={() => handleTravel(realm.id)}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold uppercase text-[10px] rounded transition whitespace-nowrap"
                  >
                    Initiate Warp
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

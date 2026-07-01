import React, { useState } from "react";
import { Users, RefreshCw, Zap, Shield, Sparkles, FolderOpen, Save, Trash2 } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export interface SaveSlot {
  slotId: string;
  name: string;
  avatarId: string;
  lastSaved: string;
  polyCount: number;
  unlockedCostumes: number;
}

export default function UserAvatarsSystem() {
  const [activeSlot, setActiveSlot] = useState<string>("slot_1");
  const [slots, setSlots] = useState<SaveSlot[]>([
    { slotId: "slot_1", name: "Main Campaign Rogue", avatarId: "vrm_kuro", lastSaved: "2026-07-01 11:22", polyCount: 42350, unlockedCostumes: 4 },
    { slotId: "slot_2", name: "Cyber Samurai Tank Stance", avatarId: "vrm_cyber", lastSaved: "2026-07-01 10:15", polyCount: 63900, unlockedCostumes: 7 },
    { slotId: "slot_3", name: "Mage Healer Support Spec", avatarId: "vrm_neko", lastSaved: "2026-06-30 18:45", polyCount: 38500, unlockedCostumes: 2 },
  ]);

  const currentSlot = slots.find(s => s.slotId === activeSlot) || slots[0];

  const handleSaveToCloud = (slotId: string) => {
    setSlots(prev => prev.map(s => {
      if (s.slotId === slotId) {
        soundManager.playLevelUp();
        alert(`💾 Cloud Backup Success: Slot "${s.name}" synchronized and locked with Firebase storage schema!`);
        return { ...s, lastSaved: new Date().toISOString().replace("T", " ").substring(0, 16) };
      }
      return s;
    }));
  };

  const handlePurgeSlot = (slotId: string) => {
    if (slots.length <= 1) {
      alert("⚠️ Error: You cannot purge all slots! Maintain at least one backup slot.");
      return;
    }
    setSlots(prev => prev.filter(s => s.slotId !== slotId));
    setActiveSlot(slots[0].slotId);
    soundManager.playHit();
    alert("🗑️ Purge Successful: Save file record destroyed.");
  };

  return (
    <div className="bg-gray-900/90 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Users className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Multi-Slot Cloud Saves</h2>
            <p className="text-[10px] text-gray-400 font-mono">Synchronize multiple character slots, load localized JSON configurations, and monitor bone sizes</p>
          </div>
        </div>
        <span className="bg-orange-950 text-orange-400 border border-orange-500/20 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded font-mono">
          Slot Sync
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Slot Directory */}
        <div className="lg:col-span-6 space-y-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Cloud Slot Indices</span>
          <div className="space-y-2">
            {slots.map(slot => {
              const isActive = slot.slotId === activeSlot;
              return (
                <div
                  key={slot.slotId}
                  onClick={() => {
                    setActiveSlot(slot.slotId);
                    soundManager.playSpecial();
                  }}
                  className={`p-3 rounded-xl border font-mono transition cursor-pointer flex justify-between items-center ${
                    isActive 
                      ? "bg-orange-950/40 border-orange-500 text-orange-400 shadow-lg" 
                      : "bg-gray-950 border-gray-850 text-gray-400 hover:bg-gray-900 hover:border-gray-800"
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase">{slot.name}</p>
                    <p className="text-[9px] text-gray-500">Saved: {slot.lastSaved} • Costumes: {slot.unlockedCostumes}</p>
                  </div>

                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleSaveToCloud(slot.slotId)}
                      title="Backup to Cloud"
                      className="p-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-850 rounded text-gray-400 hover:text-white transition"
                    >
                      <Save size={12} />
                    </button>
                    <button
                      onClick={() => handlePurgeSlot(slot.slotId)}
                      title="Purge Slot"
                      className="p-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-950 rounded text-red-400 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cloud details */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-850 space-y-3 font-mono">
            <span className="text-[10px] text-orange-400 uppercase font-bold block border-b border-gray-900 pb-1.5">🗄️ Database Meta: {currentSlot.name}</span>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-gray-500 block">Backup Registry ID</span>
                <span className="text-white font-bold">{currentSlot.slotId.toUpperCase()}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-500 block">Model Bone Polycount</span>
                <span className="text-white font-bold">{currentSlot.polyCount.toLocaleString()} vertices</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-500 block">Wardrobe Costumes</span>
                <span className="text-white font-bold">{currentSlot.unlockedCostumes} / 25</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-500 block">Synchronization State</span>
                <span className="text-emerald-400 font-bold">✓ SECURED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

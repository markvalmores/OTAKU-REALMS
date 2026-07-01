import React, { useState } from "react";
import { soundManager } from "../lib/soundManager";
import { Settings as SettingsIcon, Sliders, Keyboard, ShieldCheck, Gamepad2 } from "lucide-react";

interface KeyBindings {
  up: string;
  down: string;
  left: string;
  right: string;
  interact: string;
  attack: string;
}

interface SettingsProps {
  graphicsPreset: 'Low' | 'Midrange' | 'High' | 'Ultrakill';
  setGraphicsPreset: (preset: 'Low' | 'Midrange' | 'High' | 'Ultrakill') => void;
  keyMap: KeyBindings;
  setKeyMap: React.Dispatch<React.SetStateAction<KeyBindings>>;
}

export default function Settings({
  graphicsPreset,
  setGraphicsPreset,
  keyMap,
  setKeyMap,
}: SettingsProps) {
  const [editControls, setEditControls] = useState(false);
  const [rebindingAction, setRebindingAction] = useState<keyof KeyBindings | null>(null);
  const [volume, setVolume] = useState(80);

  const handlePresetSelect = (preset: 'Low' | 'Midrange' | 'High' | 'Ultrakill') => {
    setGraphicsPreset(preset);
    soundManager.playSpecial();
  };

  const handleRebind = (action: keyof KeyBindings, code: string) => {
    setKeyMap(prev => ({ ...prev, [action]: code }));
    setRebindingAction(null);
    soundManager.playSpecial();
  };

  return (
    <div className="bg-gray-950 border border-orange-500/30 p-4 rounded-2xl space-y-4">
      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
        <h3 className="font-heading text-sm text-white flex items-center gap-1.5">
          <SettingsIcon className="text-orange-500 animate-spin" size={16} /> Device & Engine Optimizers
        </h3>
        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
          <ShieldCheck size={12} /> GPU/CPU 100% SUPPORTED
        </span>
      </div>

      {/* Graphics Presets selection */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">Graphics render pipe</label>
        <div className="grid grid-cols-4 gap-1.5">
          {(['Low', 'Midrange', 'High', 'Ultrakill'] as const).map(preset => (
            <button
              key={preset}
              onClick={() => handlePresetSelect(preset)}
              className={`py-2 px-1 rounded text-[10px] font-bold uppercase transition ${
                graphicsPreset === preset 
                  ? 'bg-orange-600 text-white shadow' 
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
        <p className="text-[9px] text-gray-500 font-sans italic">
          {graphicsPreset === 'Low' && "👾 Minimal battery consumption mode. Stable 30fps."}
          {graphicsPreset === 'Midrange' && "🎮 Safe standard layout. Perfect balance."}
          {graphicsPreset === 'High' && "✨ Beautiful visual enhancements with physical trace particles."}
          {graphicsPreset === 'Ultrakill' && "💥 MAX PERFORMANCE. Uncapped framerates, chromatic filter, visual shakes."}
        </p>
      </div>

      {/* Volume sliders */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] uppercase font-mono text-gray-400">
          <span>Acoustic Wave Gain</span>
          <span>{volume}%</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume} 
          onChange={(e) => {
            const v = Number(e.target.value);
            setVolume(v);
            soundManager.playSpecial();
          }} 
          className="w-full accent-orange-500" 
        />
      </div>

      {/* Keyboard Config Rebinding */}
      <div className="space-y-2 border-t border-gray-900 pt-3">
        <div className="flex justify-between items-center mb-1">
          <label className="text-[10px] uppercase font-mono tracking-wider text-gray-400 flex items-center gap-1">
            <Keyboard size={12} /> Key mappings setup
          </label>
          <button
            onClick={() => {
              setEditControls(!editControls);
              setRebindingAction(null);
            }}
            className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold transition ${
              editControls ? 'bg-orange-600 text-white' : 'bg-gray-900 text-orange-400'
            }`}
          >
            {editControls ? "Done Customizing" : "Customize keys"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
          {Object.entries(keyMap).map(([action, key]) => (
            <div key={action} className="bg-gray-900 p-2 rounded border border-gray-800/40 flex justify-between items-center">
              <span className="capitalize text-gray-500">{action}:</span>
              {editControls ? (
                <button
                  onClick={() => setRebindingAction(action as keyof KeyBindings)}
                  className={`px-1.5 py-0.5 rounded text-[9px] transition ${
                    rebindingAction === action ? 'bg-pink-600 text-white animate-pulse' : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {rebindingAction === action ? "Tap Key" : key}
                </button>
              ) : (
                <span className="text-orange-400 font-bold bg-gray-950 px-1.5 py-0.5 rounded">{key}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

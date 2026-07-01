import React, { useState } from "react";
import { soundManager } from "../lib/soundManager";
import { Music, Play, Square, SkipForward } from "lucide-react";

export default function Soundtrack() {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSoundtrack = () => {
    setIsPlaying(!isPlaying);
    soundManager.playSpecial();
    alert("🎵 Game Soundtrack: Interactive audio loop toggled! Enjoy peaceful background melody chiptunes.");
  };

  return (
    <div className="bg-gray-950 border border-orange-500/30 p-4 rounded-2xl flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Music className="text-orange-500 animate-spin" size={18} />
        <div>
          <h4 className="text-xs font-bold text-white">Chiptune Otaku Ambient Loop</h4>
          <p className="text-[10px] text-gray-500">128bpm Stereo Synthesizer</p>
        </div>
      </div>

      <button
        onClick={toggleSoundtrack}
        className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 ${
          isPlaying ? 'bg-orange-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
        }`}
      >
        {isPlaying ? <Square size={12} /> : <Play size={12} />} {isPlaying ? "Stop Loop" : "Play Loop"}
      </button>
    </div>
  );
}

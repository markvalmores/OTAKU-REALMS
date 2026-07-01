import React, { useState, useEffect } from "react";
import { Play, Pause, FastForward, Film, Settings, RefreshCw, Layers, ShieldCheck, Zap, Sliders, Music } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export default function AnimationSystem() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activePose, setActivePose] = useState<string>("Idle Breath");
  const [frameRate, setFrameRate] = useState<number>(60);
  const [transitionDuration, setTransitionDuration] = useState<number>(0.25);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [currentFrame, setCurrentFrame] = useState<number>(0);

  // Playback timeline tick
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 100);
    }, 1000 / frameRate);
    return () => clearInterval(interval);
  }, [isPlaying, frameRate]);

  const handlePoseChange = (pose: string) => {
    setActivePose(pose);
    soundManager.playSpecial();
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    soundManager.playHit();
  };

  return (
    <div className="bg-gray-900/90 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Film className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Bone Animation & Blend Tree</h2>
            <p className="text-[10px] text-gray-400 font-mono">Control skeletal frame interpolations, transition limits, and inverse kinematics states</p>
          </div>
        </div>
        <span className="bg-orange-950 text-orange-400 border border-orange-500/20 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded font-mono">
          Rig Animators
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Playback Timeline Monitor */}
        <div className="lg:col-span-5 bg-gray-950 p-4 rounded-xl border border-gray-850 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center border-b border-gray-900 pb-2">
            <span className="text-[9px] font-mono text-gray-500 uppercase font-bold">Timeline Frame Graph</span>
            <span className="text-orange-400 text-[10px] font-mono font-bold">Frame: {currentFrame} / 99</span>
          </div>

          {/* Graphical representation of the active keyframes */}
          <div className="h-28 flex items-end gap-0.5 bg-slate-950 border border-orange-500/10 rounded-lg p-2 overflow-hidden relative">
            <div className="absolute inset-x-0 top-3 text-center pointer-events-none">
              <span className="text-[14px] font-bold font-mono text-white tracking-wide uppercase bg-black/60 px-2 py-1 rounded">
                🏃 {activePose}
              </span>
            </div>

            {/* Simulated audio-visual skeletal waves */}
            {Array.from({ length: 44 }).map((_, i) => {
              const activeRatio = (currentFrame % 44) === i;
              const heightPercentage = Math.sin((i / 5) + (currentFrame * 0.15)) * 40 + 55;
              return (
                <div 
                  key={i}
                  className={`flex-1 transition-all duration-75 ${
                    activeRatio 
                      ? "bg-gradient-to-t from-orange-600 to-yellow-400 h-[90%]" 
                      : "bg-gray-800 h-[60%]"
                  }`}
                  style={{ height: `${heightPercentage}%` }}
                />
              );
            })}
          </div>

          {/* Timeline Action Bar */}
          <div className="flex justify-between items-center gap-2">
            <button
              onClick={togglePlayback}
              className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-bold uppercase transition flex items-center justify-center gap-1.5 ${
                isPlaying 
                  ? "bg-red-950/60 text-red-400 border border-red-500/20 hover:bg-red-900/40" 
                  : "bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-900/40"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause size={12} />
                  <span>Pause Sequence</span>
                </>
              ) : (
                <>
                  <Play size={12} />
                  <span>Play Sequence</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setCurrentFrame(0);
                soundManager.playSpecial();
              }}
              className="px-2.5 py-1.5 bg-gray-900 hover:bg-gray-850 border border-gray-850 text-gray-400 hover:text-white rounded-lg text-xs font-mono transition"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        {/* Blending controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Locomotion States</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Idle Breath", emoji: "🧘" },
                { name: "Sprinting Loop", emoji: "🏃" },
                { name: "Saber Slash", emoji: "⚔️" },
                { name: "Supercar Drive", emoji: "🚘" }
              ].map(pose => (
                <button
                  key={pose.name}
                  onClick={() => handlePoseChange(pose.name)}
                  className={`py-2 text-[10px] font-mono font-bold rounded-lg border transition flex items-center justify-center gap-2 ${
                    activePose === pose.name
                      ? "bg-orange-600 text-white border-orange-400 shadow-md"
                      : "bg-gray-950 text-gray-400 border-gray-850 hover:bg-gray-900"
                  }`}
                >
                  <span>{pose.emoji}</span>
                  <span>{pose.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-850 space-y-3.5">
            <span className="text-[10px] font-mono text-orange-400 uppercase font-bold block">🦴 Rig Interpolator Variables</span>

            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>Blend Frame Rate Target</span>
                  <span className="text-orange-400 font-bold">{frameRate} FPS</span>
                </div>
                <div className="flex gap-1.5">
                  {[24, 30, 60, 120].map(fps => (
                    <button
                      key={fps}
                      onClick={() => {
                        setFrameRate(fps);
                        soundManager.playSpecial();
                      }}
                      className={`flex-1 py-1 text-[9.5px] font-mono font-bold rounded border transition ${
                        frameRate === fps 
                          ? "bg-orange-600/20 text-orange-400 border-orange-500/40" 
                          : "bg-gray-900 text-gray-500 border-gray-850 hover:bg-gray-800"
                      }`}
                    >
                      {fps}fps
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>Cross-Fade Blending Time</span>
                  <span className="text-orange-400 font-bold">{transitionDuration.toFixed(2)} seconds</span>
                </div>
                <input 
                  type="range" min="0.05" max="1.0" step="0.05" value={transitionDuration}
                  onChange={(e) => setTransitionDuration(parseFloat(e.target.value))}
                  className="w-full accent-orange-500" 
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>Time-Dilation Speed</span>
                  <span className="text-orange-400 font-bold">{speedMultiplier.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" min="0.25" max="2.5" step="0.25" value={speedMultiplier}
                  onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-orange-500" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

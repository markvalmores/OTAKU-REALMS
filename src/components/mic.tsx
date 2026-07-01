import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Radio, Settings, ShieldAlert } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export default function VoiceMic() {
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [inputLevel, setInputLevel] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState("Default Realtek High Definition Audio");
  const [micGain, setMicGain] = useState(70);
  const [voiceThreshold, setVoiceThreshold] = useState(25);
  const [transmissionMode, setTransmissionMode] = useState<"Voice" | "PTT">("Voice");
  const [pttKey, setPttKey] = useState("V");
  const [isEchoCancellation, setIsEchoCancellation] = useState(true);
  const [isNoiseSuppression, setIsNoiseSuppression] = useState(true);

  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isMicEnabled) {
      // Simulate active micro-acoustic signal
      const updateLevel = () => {
        const base = transmissionMode === "Voice" ? 10 : 0;
        const noise = Math.random() * 30;
        const voice = Math.sin(Date.now() / 200) * Math.cos(Date.now() / 50) * 40;
        const finalVal = Math.max(0, Math.min(100, Math.floor(base + noise + (voice > 0 ? voice : 0))));
        setInputLevel(finalVal);
        animationRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } else {
      setInputLevel(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isMicEnabled, transmissionMode]);

  const toggleMic = () => {
    const newState = !isMicEnabled;
    setIsMicEnabled(newState);
    soundManager.playSpecial();
  };

  const devices = [
    "Default Realtek High Definition Audio",
    "Yeti Stereo Microphone (USB)",
    "HyperX QuadCast S Studio Mic",
    "Logitech G PRO X Wireless Gaming Headset Mic"
  ];

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <Mic className={`text-orange-500 ${isMicEnabled ? "animate-bounce" : ""}`} size={20} />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Tactical Voice Comm Core</h2>
          <p className="text-[10px] text-gray-400 font-mono">Calibrate microphone codecs and voice channel acoustics</p>
        </div>
      </div>

      {/* Mic Quick Toggle & Meter */}
      <div className="bg-gray-950 p-4 rounded-xl border border-gray-800/60 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] text-gray-400 font-mono uppercase block">Hardware Channel State</span>
            <span className={`text-xs font-bold font-mono ${isMicEnabled ? "text-emerald-400 animate-pulse" : "text-rose-500"}`}>
              {isMicEnabled ? "🎙️ CHANNEL BROADCASTING" : "🔇 CHANNEL MUTED"}
            </span>
          </div>
          <button
            onClick={toggleMic}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 ${
              isMicEnabled ? "bg-rose-600 text-white" : "bg-orange-600 text-white"
            }`}
          >
            {isMicEnabled ? <MicOff size={13} /> : <Mic size={13} />}
            {isMicEnabled ? "Mute Mic" : "Unmute Mic"}
          </button>
        </div>

        {/* Level Indicator Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-gray-500">
            <span>Input Gain DB Level</span>
            <span>{inputLevel}%</span>
          </div>
          <div className="h-2.5 w-full bg-gray-900 rounded-full overflow-hidden flex gap-[2px] p-[2px]">
            {Array.from({ length: 20 }).map((_, i) => {
              const isActive = (i / 20) * 100 < inputLevel;
              const isOverThreshold = (i / 20) * 100 >= voiceThreshold;
              let barColor = "bg-orange-500/10";
              if (isActive) {
                if (isOverThreshold) barColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
                else barColor = "bg-yellow-500";
              }
              return <div key={i} className={`flex-grow h-full rounded-sm transition-all duration-75 ${barColor}`} />;
            })}
          </div>
          <div className="flex justify-between text-[8px] font-mono text-gray-600">
            <span>0% (Quiet)</span>
            <span className="text-emerald-400/80">Threshold Gate ({voiceThreshold}%)</span>
            <span>100% (Clipping)</span>
          </div>
        </div>
      </div>

      {/* Select Device */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Input Audio Capture Device</label>
        <select
          value={selectedDevice}
          onChange={(e) => {
            setSelectedDevice(e.target.value);
            soundManager.playSpecial();
          }}
          className="w-full p-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs font-mono text-gray-300 focus:outline-none focus:border-orange-500/50"
        >
          {devices.map((device, i) => (
            <option key={i} value={device}>{device}</option>
          ))}
        </select>
      </div>

      {/* Voice Transmission Configurations */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Transmission Mode</label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => { setTransmissionMode("Voice"); soundManager.playSpecial(); }}
              className={`py-1.5 text-[10px] font-bold font-mono uppercase rounded-lg border ${
                transmissionMode === "Voice" ? "bg-orange-600 text-white border-orange-500" : "bg-gray-950 text-gray-500 border-gray-800"
              }`}
            >
              Voice Act
            </button>
            <button
              onClick={() => { setTransmissionMode("PTT"); soundManager.playSpecial(); }}
              className={`py-1.5 text-[10px] font-bold font-mono uppercase rounded-lg border ${
                transmissionMode === "PTT" ? "bg-orange-600 text-white border-orange-500" : "bg-gray-950 text-gray-500 border-gray-800"
              }`}
            >
              PTT (Key)
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-gray-400 uppercase block mb-1">PTT Key Bind</label>
          <input
            type="text"
            value={pttKey}
            onChange={(e) => setPttKey(e.target.value.toUpperCase().slice(-1))}
            className="w-full p-1.5 bg-gray-950 border border-gray-800 rounded-lg text-center font-mono text-xs uppercase font-extrabold text-orange-400"
          />
        </div>
      </div>

      {/* Gain & Gates */}
      <div className="space-y-3 bg-gray-950 p-3.5 rounded-xl border border-gray-800">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-gray-400">
            <span>Hardware Digital Mic Gain</span>
            <span className="text-orange-400 font-bold">{micGain}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={micGain}
            onChange={(e) => setMicGain(parseInt(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-gray-400">
            <span>Voice Activation Gate Threshold</span>
            <span className="text-orange-400 font-bold">{voiceThreshold}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={voiceThreshold}
            onChange={(e) => setVoiceThreshold(parseInt(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>
      </div>

      {/* DSP Effects */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Acoustics DSP Audio Effects</span>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <label className="flex items-center gap-2 p-2.5 bg-gray-950 rounded-lg border border-gray-800 cursor-pointer hover:border-orange-500/20">
            <input
              type="checkbox"
              checked={isEchoCancellation}
              onChange={() => setIsEchoCancellation(!isEchoCancellation)}
              className="accent-orange-500"
            />
            <span>Acoustic Echo Canc.</span>
          </label>
          <label className="flex items-center gap-2 p-2.5 bg-gray-950 rounded-lg border border-gray-800 cursor-pointer hover:border-orange-500/20">
            <input
              type="checkbox"
              checked={isNoiseSuppression}
              onChange={() => setIsNoiseSuppression(!isNoiseSuppression)}
              className="accent-orange-500"
            />
            <span>Noise Suppression</span>
          </label>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Compass, Sparkles, MapPin, Star, AlertTriangle, Shield, Eye, ShieldAlert, Zap, CloudRain, Sun, Moon } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export interface GameStage {
  id: string;
  name: string;
  difficulty: string;
  weather: string;
  timeOfDay: string;
  trafficLevel: "None" | "Sparse" | "Dense" | "Apocalyptic Chaos";
}

interface StagesProps {
  onTravelStage: (stage: GameStage) => void;
  activeStage: GameStage;
}

export default function StagesSystem({ onTravelStage, activeStage }: StagesProps) {
  const [wantedLevel, setWantedLevel] = useState<number>(0);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("None");
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [isEngineOn, setIsEngineOn] = useState<boolean>(false);
  const [weatherCondition, setWeatherCondition] = useState<string>("Sunny");
  const [dayCycle, setDayCycle] = useState<string>("Daytime");

  const stageOptions: GameStage[] = [
    { id: "stage_lscyber", name: "Los Santos Cyber Highways", difficulty: "Rookie", weather: "Sunny", timeOfDay: "Daytime", trafficLevel: "Dense" },
    { id: "stage_shibuya", name: "Shibuya City Neon Block", difficulty: "Moderate", weather: "Rainy", timeOfDay: "Midnight", trafficLevel: "Apocalyptic Chaos" },
    { id: "stage_kyoto", name: "Kyoto Ancient Palace Grid", difficulty: "Challenging", weather: "Windy", timeOfDay: "Golden Hour", trafficLevel: "Sparse" },
    { id: "stage_desert", name: "Grand Canyon Sand Dunes", difficulty: "Extreme", weather: "Dusty", timeOfDay: "Sunset", trafficLevel: "None" },
  ];

  // Sirens Flasher effect for Wanted Level > 0
  const [sirenTick, setSirenTick] = useState<boolean>(false);
  useEffect(() => {
    if (wantedLevel === 0) return;
    const interval = setInterval(() => {
      setSirenTick(prev => !prev);
    }, 450);
    return () => clearInterval(interval);
  }, [wantedLevel]);

  // Handle active driving speedometer ticker
  useEffect(() => {
    if (!isEngineOn || selectedVehicle === "None") {
      setCurrentSpeed(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentSpeed(prev => {
        const baseMax = selectedVehicle === "Futuristic Lightbike" ? 180 : selectedVehicle === "Stealth Supercar" ? 220 : selectedVehicle === "Military Tank" ? 65 : 45;
        const targetSpeed = baseMax + Math.floor(Math.random() * 10) - 5;
        // Accelerate smoothly
        if (prev < targetSpeed) return Math.min(targetSpeed, prev + 25);
        return prev;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isEngineOn, selectedVehicle]);

  const handleVehicleSpawn = (vehicle: string) => {
    setSelectedVehicle(vehicle);
    setIsEngineOn(true);
    soundManager.playSpecial();
    alert(`🏎️ GTA Trigger: Custom vehicles loaded. ${vehicle} successfully spawned! Engine initialized.`);
  };

  const handleWarpCoord = (x: number, y: number, name: string) => {
    soundManager.playSpecial();
    alert(`📍 Dimensional Warp Grid: Teleporting instantly to ${name} coordinate coordinates (${x}, ${y})!`);
  };

  const triggerPoliceSiren = () => {
    setWantedLevel(prev => {
      const nextLevel = Math.min(5, prev + 1);
      soundManager.playHit();
      alert(`🚨 GTA WANTED LEVEL ACQUIRED: You are now at ${nextLevel} Star Wanted Level! Dispatching police sirens.`);
      return nextLevel;
    });
  };

  const clearWantedLevel = () => {
    setWantedLevel(0);
    soundManager.playLevelUp();
    alert(`😇 Bribe Paid / Crimes Cleared: Wanted level restored to 0 Stars. Police departments standing down.`);
  };

  return (
    <div className={`bg-gray-900/90 p-5 rounded-2xl border transition duration-300 text-gray-100 space-y-6 ${
      wantedLevel > 0 
        ? sirenTick 
          ? "border-red-600/60 shadow-[0_0_15px_rgba(220,38,38,0.4)]" 
          : "border-blue-600/60 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
        : "border-orange-500/20"
    }`}>
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Compass className="text-orange-500 animate-spin" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">GTA-Style Stages & Mission Hub</h2>
            <p className="text-[10px] text-gray-400 font-mono">Select high-end free roam maps, summon vehicles, control environments, and escape police patrols</p>
          </div>
        </div>
        <span className="bg-orange-950 text-orange-400 border border-orange-500/20 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded font-mono">
          Stage Manager
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Stage Selector List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block font-bold">Select Active World Stage</label>
            <div className="space-y-2">
              {stageOptions.map((stg) => {
                const isSelected = activeStage.id === stg.id;
                return (
                  <button
                    key={stg.id}
                    onClick={() => {
                      onTravelStage(stg);
                      soundManager.playLevelUp();
                    }}
                    className={`w-full p-3.5 text-left rounded-xl border font-mono transition flex justify-between items-center ${
                      isSelected 
                        ? "bg-gradient-to-r from-orange-950/60 via-amber-950/20 to-gray-950 border-orange-500 text-orange-400 shadow-lg" 
                        : "bg-gray-950 border-gray-850 text-gray-400 hover:bg-gray-900 hover:border-gray-800"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold flex items-center gap-1.5 text-white">
                        <span>🗺️ {stg.name}</span>
                        <span className="text-[8px] bg-gray-900 border border-gray-800 px-1 rounded-sm text-gray-500">{stg.difficulty}</span>
                      </div>
                      <div className="flex gap-4 text-[9px] text-gray-500">
                        <span>Weather: {weatherCondition}</span>
                        <span>•</span>
                        <span>Time: {dayCycle}</span>
                        <span>•</span>
                        <span>Traffic: {stg.trafficLevel}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="bg-orange-600 text-black text-[9px] font-black uppercase px-2 py-1 rounded-lg">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Environmental parameters modifier */}
          <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-850 space-y-3">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider block font-bold">☀️ Weather & Hour Matrix</span>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] text-gray-500 font-mono block">Atmosphere Preset</span>
                <div className="flex gap-1">
                  {[
                    { id: "Sunny", icon: <Sun size={12} className="text-amber-500" /> },
                    { id: "Rainy", icon: <CloudRain size={12} className="text-sky-500" /> }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setWeatherCondition(item.id);
                        soundManager.playSpecial();
                      }}
                      className={`flex-1 py-1.5 text-[10px] font-mono font-bold rounded border transition flex items-center justify-center gap-1 ${
                        weatherCondition === item.id 
                          ? "bg-orange-600/20 text-orange-400 border-orange-500/40" 
                          : "bg-gray-900 text-gray-500 border-gray-850 hover:bg-gray-850"
                      }`}
                    >
                      {item.icon}
                      <span>{item.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-gray-500 font-mono block">Time Dimension</span>
                <div className="flex gap-1">
                  {[
                    { id: "Daytime", icon: <Sun size={12} className="text-yellow-400" /> },
                    { id: "Midnight", icon: <Moon size={12} className="text-indigo-400" /> }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setDayCycle(item.id);
                        soundManager.playSpecial();
                      }}
                      className={`flex-1 py-1.5 text-[10px] font-mono font-bold rounded border transition flex items-center justify-center gap-1 ${
                        dayCycle === item.id 
                          ? "bg-orange-600/20 text-orange-400 border-orange-500/40" 
                          : "bg-gray-900 text-gray-500 border-gray-850 hover:bg-gray-850"
                      }`}
                    >
                      {item.icon}
                      <span>{item.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Wanted Level & Vehicles */}
        <div className="lg:col-span-6 space-y-4">
          {/* Wanted levels */}
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-850 space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-red-500 uppercase tracking-wider block font-bold flex items-center gap-1.5 animate-pulse">
                <AlertTriangle size={12} /> GTA Wanted Status
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={16} 
                    className={`${wantedLevel >= star ? "text-yellow-400 fill-yellow-400 animate-bounce" : "text-gray-700"}`} 
                  />
                ))}
              </div>
            </div>

            <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-lg flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-white uppercase">Siren Dispatcher Alerts</p>
                <p className="text-[9px] text-gray-400 font-mono">
                  {wantedLevel === 0 && "Peaceful: Local patrol cruisers standing down."}
                  {wantedLevel === 1 && "Alert: Cruisers patrolling highway borders."}
                  {wantedLevel === 2 && "Wanted: SWAT units reinforcing roadblocks."}
                  {wantedLevel >= 3 && "CRITICAL DANGER: Helicopters and armored tanks dispatched."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-1.5">
                <button
                  onClick={triggerPoliceSiren}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-extrabold font-mono text-[9px] rounded uppercase tracking-wider transition"
                >
                  +1 Star
                </button>
                {wantedLevel > 0 && (
                  <button
                    onClick={clearWantedLevel}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold font-mono text-[9px] rounded uppercase tracking-wider transition"
                  >
                    Bribe Police
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Custom Vehicles Garage */}
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-850 space-y-3">
            <div className="flex justify-between items-center border-b border-gray-900 pb-1.5">
              <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider block font-bold flex items-center gap-1.5">
                <Zap size={12} /> Spawn GTA Sandbox Vehicle
              </span>
              {selectedVehicle !== "None" && (
                <span className="text-[9px] text-emerald-400 font-mono">Active: {selectedVehicle}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Futuristic Lightbike", emoji: "🏍️", speed: "180 km/h" },
                { name: "Stealth Supercar", emoji: "🏎️", speed: "220 km/h" },
                { name: "Military Tank", emoji: "🚀", speed: "65 km/h" },
                { name: "Hoverboard Pro", emoji: "🛹", speed: "45 km/h" }
              ].map((vehicle) => {
                const isActive = selectedVehicle === vehicle.name;
                return (
                  <button
                    key={vehicle.name}
                    onClick={() => handleVehicleSpawn(vehicle.name)}
                    className={`p-2 rounded-xl text-left font-mono border transition flex items-center justify-between ${
                      isActive
                        ? "bg-orange-600/20 border-orange-500 text-white shadow-md"
                        : "bg-gray-900 border-gray-850 text-gray-400 hover:bg-gray-850 hover:border-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{vehicle.emoji}</span>
                      <div className="space-y-0.5">
                        <div className="text-[10.5px] font-bold text-white">{vehicle.name.split(" ")[1] || vehicle.name}</div>
                        <div className="text-[8px] text-gray-500">Max: {vehicle.speed}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedVehicle !== "None" && (
              <div className="pt-2 border-t border-gray-900 flex justify-between items-center flex-wrap gap-2">
                <div className="space-y-1">
                  <span className="text-[9px] text-gray-500 font-mono block uppercase">Digital Speedometer</span>
                  <div className="font-mono text-lg font-black text-orange-400">
                    {currentSpeed} <span className="text-[10px] text-gray-500">KM/H</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsEngineOn(!isEngineOn);
                    soundManager.playSpecial();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold border uppercase transition ${
                    isEngineOn 
                      ? "bg-red-950/60 text-red-400 border-red-500/20 hover:bg-red-900/40" 
                      : "bg-emerald-950/60 text-emerald-400 border-emerald-500/20 hover:bg-emerald-900/40"
                  }`}
                >
                  {isEngineOn ? "🛑 Stop Engine" : "🔑 Start Engine"}
                </button>
              </div>
            )}
          </div>

          {/* Coordinate fast warp points */}
          <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-850 space-y-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase block font-bold">📍 Quick Landmarks Warp</span>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
              <button
                onClick={() => handleWarpCoord(35, 25, "7-Eleven Mart")}
                className="py-1 bg-gray-900 hover:bg-gray-850 border border-gray-850 rounded text-gray-300 text-left px-2"
              >
                🛒 7-Eleven Minimart (35, 25)
              </button>
              <button
                onClick={() => handleWarpCoord(65, 55, "Story Quest Guild")}
                className="py-1 bg-gray-900 hover:bg-gray-850 border border-gray-850 rounded text-gray-300 text-left px-2"
              >
                📜 Story Quest Guild (65, 55)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

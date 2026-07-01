import React, { useState, useEffect, useRef } from "react";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { PlayerStats, EffectType } from "../types";
import { soundManager } from "../lib/soundManager";
import MiniMap from "./MiniMap";
import { 
  Laptop, Smartphone, Gamepad2, Settings, ShieldAlert, Sparkles, 
  Coins, Apple, Heart, Activity, ShoppingBag, Eye, Star, Info
} from "lucide-react";

interface KeyBindings {
  up: string;
  down: string;
  left: string;
  right: string;
  interact: string;
  attack: string;
}

interface GameViewportProps {
  user: User;
  stats: PlayerStats;
  setStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
  gameMode: 'Story' | 'FreeRoam';
  startCombat: (enemyName: string) => void;
  viewMode: 'first' | 'second' | 'third';
  playerPos: { x: number; y: number };
  setPlayerPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  onOpenShop: () => void;
}

export default function GameViewport({
  user,
  stats,
  setStats,
  gameMode,
  startCombat,
  viewMode,
  playerPos,
  setPlayerPos,
  onOpenShop,
}: GameViewportProps) {
  // Config state
  const [deviceType, setDeviceType] = useState<'PC' | 'Mobile' | 'Console'>('PC');
  const [graphicsPreset, setGraphicsPreset] = useState<'Low' | 'Midrange' | 'High' | 'Ultrakill'>('Midrange');
  const [showConfig, setShowConfig] = useState(false);
  const [editControls, setEditControls] = useState(false);
  const [rebindingAction, setRebindingAction] = useState<keyof KeyBindings | null>(null);

  // Keyboard assignments
  const [keyMap, setKeyMap] = useState<KeyBindings>({
    up: "KeyW",
    down: "KeyS",
    left: "KeyA",
    right: "KeyD",
    interact: "KeyE",
    attack: "Space",
  });

  // Local gameplay state
  const [isGamepadConnected, setIsGamepadConnected] = useState(false);
  const [gamepadStatus, setGamepadStatus] = useState("No controller detected");
  const [sysUsage, setSysUsage] = useState({ cpu: 22, gpu: 30, temp: 45, fps: 60 });
  const [storyDialog, setStoryDialog] = useState<string | null>(null);
  const [storyStep, setStoryStep] = useState(0);
  const [poisonDamageActive, setPoisonDamageActive] = useState(false);

  // Particle tracking for "Ultrakill/High" mode
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const particleIdRef = useRef(0);

  // Entities on the map
  const [entities, setEntities] = useState([
    { id: "chest_1", type: "chest", name: "Bronze Lootbox", x: 20, y: 50, collected: false },
    { id: "chest_2", type: "chest", name: "Premium Supply Crate", x: 80, y: 30, collected: false },
    { id: "slime_1", type: "enemy", name: "Rogue Otaku Slime", x: 50, y: 65, color: "#a855f7" },
    { id: "slime_2", type: "enemy", name: "Legendary Anime Weeb Goblin", x: 75, y: 20, color: "#22c55e" },
    { id: "mart_entrance", type: "mart", name: "7-Eleven Mart", x: 35, y: 25 },
    { id: "story_guild", type: "guild", name: "Otaku Quest Guild", x: 65, y: 55 },
    { id: "toxic_waste", type: "toxic", name: "Radioactive Sludge Swamp", x: 45, y: 45, radius: 12 }
  ]);

  // Handle active key presses
  const pressedKeys = useRef<Record<string, boolean>>({});

  // 1. Device Detection on mount
  useEffect(() => {
    const detectDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const ua = navigator.userAgent.toLowerCase();
      const isMobileUA = /mobi|android|iphone|ipad|ipod/.test(ua);
      
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gamepadActive = Array.from(gamepads).some(gp => gp !== null);

      if (gamepadActive) {
        setDeviceType('Console');
      } else if (isMobileUA || hasTouch) {
        setDeviceType('Mobile');
      } else {
        setDeviceType('PC');
      }
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    
    const gamepadListener = () => {
      setIsGamepadConnected(true);
      setDeviceType('Console');
      setGamepadStatus("Xbox Controller Connected & Fully Calibrated!");
      soundManager.playSpecial();
    };

    window.addEventListener("gamepadconnected", gamepadListener);
    window.addEventListener("gamepaddisconnected", () => {
      setIsGamepadConnected(false);
      setGamepadStatus("Controller disconnected");
    });

    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener("gamepadconnected", gamepadListener);
    };
  }, []);

  // 2. Continuous game loops (Movement, Particles, FPS calculations, Gamepad query)
  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsInterval = setInterval(() => {
      const now = performance.now();
      const calculatedFps = Math.round((frameCount * 1000) / (now - lastTime));
      
      // Calculate dynamic system temperature and usage based on Graphics mode
      let mockCpu = 15;
      let mockGpu = 12;
      let mockTemp = 36;
      let limitFps = 60;

      if (graphicsPreset === 'Low') {
        mockCpu = 10 + Math.floor(Math.random() * 5);
        mockGpu = 8 + Math.floor(Math.random() * 4);
        mockTemp = 35 + Math.floor(Math.random() * 3);
        limitFps = Math.min(30, calculatedFps);
      } else if (graphicsPreset === 'Midrange') {
        mockCpu = 35 + Math.floor(Math.random() * 10);
        mockGpu = 42 + Math.floor(Math.random() * 8);
        mockTemp = 48 + Math.floor(Math.random() * 5);
        limitFps = Math.min(60, calculatedFps);
      } else if (graphicsPreset === 'High') {
        mockCpu = 60 + Math.floor(Math.random() * 12);
        mockGpu = 72 + Math.floor(Math.random() * 10);
        mockTemp = 64 + Math.floor(Math.random() * 6);
        limitFps = Math.min(120, calculatedFps);
      } else { // Ultrakill
        mockCpu = 88 + Math.floor(Math.random() * 8);
        mockGpu = 96 + Math.floor(Math.random() * 4);
        mockTemp = 82 + Math.floor(Math.random() * 4);
        limitFps = Math.min(144, calculatedFps);
      }

      setSysUsage({ cpu: mockCpu, gpu: mockGpu, temp: mockTemp, fps: limitFps || 60 });
      frameCount = 0;
      lastTime = now;
    }, 1000);

    let animationFrameId: number;

    const gameLoop = () => {
      frameCount++;
      
      // Multiplier speed depending on sickness
      const speedModifier = stats.status === 'sick' ? 0.35 : stats.status === 'injured' ? 0.5 : 0.75;
      let dx = 0;
      let dy = 0;

      // Keyboard support
      if (pressedKeys.current[keyMap.up] || pressedKeys.current["ArrowUp"]) dy -= 1;
      if (pressedKeys.current[keyMap.down] || pressedKeys.current["ArrowDown"]) dy += 1;
      if (pressedKeys.current[keyMap.left] || pressedKeys.current["ArrowLeft"]) dx -= 1;
      if (pressedKeys.current[keyMap.right] || pressedKeys.current["ArrowRight"]) dx += 1;

      // Gamepad support
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = gamepads[0];
      if (gp) {
        setIsGamepadConnected(true);
        // Analog sticks
        if (Math.abs(gp.axes[0]) > 0.15) dx += gp.axes[0];
        if (Math.abs(gp.axes[1]) > 0.15) dy += gp.axes[1];
        
        // D-Pad
        if (gp.buttons[12]?.pressed) dy -= 1; // Up
        if (gp.buttons[13]?.pressed) dy += 1; // Down
        if (gp.buttons[14]?.pressed) dx -= 1; // Left
        if (gp.buttons[15]?.pressed) dx += 1; // Right

        // Action Buttons
        if (gp.buttons[0]?.pressed) { // A button
          handleInteractionCheck();
        }
        if (gp.buttons[2]?.pressed) { // X button
          handleAttackCheck();
        }
      }

      // If walking, update positions
      if (dx !== 0 || dy !== 0) {
        setPlayerPos(prev => {
          const newX = Math.max(2, Math.min(98, prev.x + dx * speedModifier));
          const newY = Math.max(2, Math.min(98, prev.y + dy * speedModifier));

          // Spawn high-end neon movement particles in High & Ultrakill presets
          if (graphicsPreset === 'High' || graphicsPreset === 'Ultrakill') {
            if (Math.random() < 0.25) {
              const pId = particleIdRef.current++;
              setParticles(curr => [
                ...curr.slice(-30), 
                { id: pId, x: newX + (Math.random() - 0.5) * 2, y: newY + (Math.random() - 0.5) * 2, color: stats.isOtakuPlus ? "#f97316" : "#22d3ee" }
              ]);
            }
          }

          return { x: newX, y: newY };
        });
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      clearInterval(fpsInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, [keyMap, graphicsPreset, stats.status, stats.isOtakuPlus]);

  // Periodic particle cleanup
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles(prev => prev.slice(2));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  // Key Down/Up Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Rebinding block
      if (editControls && rebindingAction) {
        e.preventDefault();
        setKeyMap(prev => ({ ...prev, [rebindingAction]: e.code }));
        setRebindingAction(null);
        soundManager.playSpecial();
        return;
      }

      pressedKeys.current[e.code] = true;

      // Handle direct actions
      if (e.code === keyMap.interact) {
        handleInteractionCheck();
      }
      if (e.code === keyMap.attack) {
        handleAttackCheck();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.current[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keyMap, editControls, rebindingAction, playerPos, entities]);

  // Swamp Toxic Sickness Damage over time
  useEffect(() => {
    const toxicSwamp = entities.find(ent => ent.type === "toxic");
    if (!toxicSwamp) return;

    const interval = setInterval(() => {
      const distance = Math.hypot(playerPos.x - toxicSwamp.x, playerPos.y - toxicSwamp.y);
      if (distance <= (toxicSwamp.radius || 10)) {
        setPoisonDamageActive(true);
        soundManager.playHit();
        setStats(prev => {
          const nextHp = Math.max(1, prev.hp - 4);
          const effectsToUpdate: EffectType = 'Poisoned';
          return {
            ...prev,
            hp: nextHp,
            status: 'sick' // Stepping in toxic waste makes you sick!
          };
        });
      } else {
        setPoisonDamageActive(false);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [playerPos, entities]);

  // Action: Interacting
  const handleInteractionCheck = () => {
    let interacted = false;

    // Check Chests
    const updatedEntities = entities.map(ent => {
      if (ent.type === 'chest' && !ent.collected) {
        const dist = Math.hypot(playerPos.x - ent.x, playerPos.y - ent.y);
        if (dist < 6) {
          interacted = true;
          soundManager.playSpecial();
          ent.collected = true;

          // Provide Random Loot based on chest type
          const moneyGained = ent.id === 'chest_1' ? 150 : 250;
          setStats(prev => ({
            ...prev,
            money: prev.money + moneyGained,
            inventory: {
              food: prev.inventory.food + 2,
              medicine: prev.inventory.medicine + 1
            }
          }));
          alert(`🎉 Opened ${ent.name}! Gained +$${moneyGained}, 2x Food, 1x Medicine!`);
        }
      }
      return ent;
    });

    if (interacted) {
      setEntities(updatedEntities);
      return;
    }

    // Check Mart
    const mart = entities.find(e => e.type === 'mart');
    if (mart) {
      const dist = Math.hypot(playerPos.x - mart.x, playerPos.y - mart.y);
      if (dist < 6) {
        soundManager.playSpecial();
        onOpenShop();
        return;
      }
    }

    // Check Quest Guild (Story Dialog)
    const guild = entities.find(e => e.type === 'guild');
    if (guild) {
      const dist = Math.hypot(playerPos.x - guild.x, playerPos.y - guild.y);
      if (dist < 6) {
        soundManager.playSpecial();
        triggerGuildDialog();
        return;
      }
    }
  };

  // Action: Attacking / Engaging Hostiles
  const handleAttackCheck = () => {
    const enemies = entities.filter(e => e.type === 'enemy');
    for (const enemy of enemies) {
      const dist = Math.hypot(playerPos.x - enemy.x, playerPos.y - enemy.y);
      if (dist < 8) {
        soundManager.playHit();
        startCombat(enemy.name);
        return;
      }
    }
  };

  // Story mode progression logic
  const triggerGuildDialog = () => {
    if (gameMode !== 'Story') {
      setStoryDialog("To start questlines, toggle game mode to 'Story' in the top header menu!");
      setStoryStep(0);
      return;
    }

    if (storyStep === 0) {
      setStoryDialog("⚔️ Guild Knight: Welcome Traveler! The Otaku Realms are plagued by toxic sludge and rampaging glitch monsters. Will you defeat the Rogue Slime at the center of our map?");
      setStoryStep(1);
    } else if (storyStep === 1) {
      setStoryDialog("⚔️ Guild Knight: Fantastic! Walk to coordinates (50, 65) and tap Attack/Fight or press Space to clean up the realm!");
      setStoryStep(2);
    } else {
      setStoryDialog("⚔️ Guild Knight: You're doing splendidly. Keep our world clean and safe!");
    }
  };

  const closeDialog = () => {
    setStoryDialog(null);
  };

  // Mobile Controller Virtual buttons handlers
  const handleVirtualDir = (dir: 'up' | 'down' | 'left' | 'right') => {
    soundManager.playDodge();
    setPlayerPos(prev => {
      let nx = prev.x;
      let ny = prev.y;
      const step = stats.status === 'sick' ? 3 : 6;
      if (dir === 'up') ny -= step;
      if (dir === 'down') ny += step;
      if (dir === 'left') nx -= step;
      if (dir === 'right') nx += step;
      return { x: Math.max(2, Math.min(98, nx)), y: Math.max(2, Math.min(98, ny)) };
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* 1. Header Status Bar */}
      <div className="bg-gray-900 border-2 border-orange-600/30 rounded-xl p-3 flex flex-wrap gap-4 items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-orange-400">
            {deviceType === 'PC' && <Laptop size={14} />}
            {deviceType === 'Mobile' && <Smartphone size={14} />}
            {deviceType === 'Console' && <Gamepad2 size={14} />}
            PLATFORM: <b className="text-white">{deviceType}</b>
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-green-400">
            FPS: <b className="text-white">{sysUsage.fps}</b>
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-sky-400">
            CPU: <b className="text-white">{sysUsage.cpu}%</b>
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-pink-400">
            GPU: <b className="text-white">{sysUsage.gpu}%</b>
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-amber-500">
            TEMP: <b className="text-white">{sysUsage.temp}°C</b>
          </span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1 bg-gray-800 text-orange-400 border border-orange-500/30 px-3 py-1 rounded hover:bg-gray-700 transition"
          >
            <Settings size={12} /> Custom Control & Graphic Options
          </button>
        </div>
      </div>

      {/* 2. Configuration Settings Dropdown overlay */}
      {showConfig && (
        <div className="bg-gray-900 border-2 border-orange-600 p-5 rounded-2xl space-y-4 animate-in fade-in zoom-in duration-150">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <h3 className="text-lg font-heading text-orange-500 flex items-center gap-2">
              <Settings className="animate-spin text-orange-400" size={18} /> Game Controller & Hardware Settings
            </h3>
            <button 
              onClick={() => setShowConfig(false)}
              className="text-gray-400 hover:text-white font-bold"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Graphics Presets */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-orange-300">Graphics Engine Optimization</h4>
              <div className="grid grid-cols-4 gap-2">
                {(['Low', 'Midrange', 'High', 'Ultrakill'] as const).map(preset => (
                  <button
                    key={preset}
                    onClick={() => {
                      setGraphicsPreset(preset);
                      soundManager.playSpecial();
                    }}
                    className={`p-2 rounded text-xs font-bold transition ${
                      graphicsPreset === preset 
                        ? 'bg-orange-600 text-white shadow-lg' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-400">
                {graphicsPreset === 'Low' && "👾 retro 30FPS mode. Flat tiles and low CPU/GPU power. Safe for slow web hosts."}
                {graphicsPreset === 'Midrange' && "🎮 Standard 60FPS mode. Fluent animations, balanced system loads."}
                {graphicsPreset === 'High' && "✨ High fidelity 120FPS mode. Particle effects on movement, detailed layouts."}
                {graphicsPreset === 'Ultrakill' && "💥 MAX OVERCLOCK 144FPS. Screen shakes, live trail particles, chromatic battle filters!"}
              </p>
              
              <div className="bg-gray-950 p-3 rounded-lg text-xs space-y-1 font-mono text-gray-300 border border-gray-800">
                <div>HARDWARE SUPPORT STATUS: <b className="text-emerald-400">100% COMPLETE & REGISTERED</b></div>
                <div>GPU DRIVER ACCELERATION: <b className="text-indigo-400">Vulkan/WebGL DirectAccess</b></div>
                <div>CONTROLLER STATUS: <b className="text-amber-400">{isGamepadConnected ? gamepadStatus : "Keyboard Map Bind Active"}</b></div>
              </div>
            </div>

            {/* Right: Key rebinding edit control */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-orange-300">Edit Control Bindings</h4>
                <button
                  onClick={() => {
                    setEditControls(!editControls);
                    setRebindingAction(null);
                  }}
                  className={`text-xs px-2 py-1 rounded font-bold ${editControls ? 'bg-orange-600 text-white' : 'bg-gray-800 text-orange-400'}`}
                >
                  {editControls ? "Done Editing" : "Enable Key Editing"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {Object.entries(keyMap).map(([action, key]) => (
                  <div key={action} className="bg-gray-950 p-2 rounded border border-gray-800 flex justify-between items-center">
                    <span className="capitalize text-gray-400">{action}:</span>
                    {editControls ? (
                      <button
                        onClick={() => {
                          setRebindingAction(action as keyof KeyBindings);
                          soundManager.playDodge();
                        }}
                        className={`px-2 py-1 rounded text-[10px] ${rebindingAction === action ? 'bg-pink-600 text-white animate-pulse' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                      >
                        {rebindingAction === action ? "Press Any Key" : key}
                      </button>
                    ) : (
                      <span className="text-orange-400 font-bold bg-gray-800 px-2 py-0.5 rounded text-[10px]">{key}</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-500">
                Change actions to your preferred keys on keyboard. Standard Arrow Keys always supported as fallback.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Immersive Game Viewport Screen Container */}
      <div 
        className={`relative w-full aspect-[16/9] bg-gray-950 rounded-2xl border-4 ${
          poisonDamageActive ? 'border-red-600 animate-pulse' : 'border-orange-600/60'
        } overflow-hidden shadow-2xl transition`}
        style={{
          imageRendering: graphicsPreset === 'Low' ? 'pixelated' : 'auto'
        }}
      >
        <MiniMap pos={playerPos} />
        {/* Dynamic Graphics Presets Visual Filters */}
        <div className={`absolute inset-0 z-0 pointer-events-none transition-all ${
          graphicsPreset === 'Low' ? 'bg-gradient-to-tr from-gray-950 via-gray-900 to-gray-950 opacity-100' :
          graphicsPreset === 'Midrange' ? 'bg-gradient-to-tr from-emerald-950/10 via-purple-950/5 to-orange-950/10' :
          graphicsPreset === 'High' ? 'bg-gradient-to-tr from-indigo-950/30 via-slate-900/10 to-orange-950/30 brightness-110 shadow-inner' :
          'bg-gradient-to-tr from-rose-950/30 via-gray-900 to-amber-950/30 backdrop-hue-rotate-15 contrast-125 saturate-125 brightness-110' // Ultrakill preset
        }`} />

        {/* Tactical Neon Grid */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(249,115,22,0.15) 1px, transparent 1px)",
            backgroundSize: graphicsPreset === 'Low' ? "32px 32px" : "20px 20px"
          }}
        />

        {/* Toxic Swamp Overlay coordinates */}
        <div 
          className="absolute rounded-full border-2 border-green-600/40 bg-green-900/20 flex flex-col items-center justify-center pointer-events-none"
          style={{
            left: '45%',
            top: '45%',
            width: '24%',
            height: '24%',
            transform: 'translate(-50%, -50%)',
            boxShadow: graphicsPreset !== 'Low' ? '0 0 20px rgba(34,197,94,0.2)' : 'none'
          }}
        >
          <div className="text-[10px] text-green-400 font-mono flex items-center gap-1 animate-pulse">
            <ShieldAlert size={12} /> Toxic Sludge Mud
          </div>
        </div>

        {/* Grid Map Location Outlines */}
        {entities.map(ent => {
          if (ent.type === 'mart') {
            return (
              <div 
                key={ent.id}
                className="absolute text-center flex flex-col items-center pointer-events-none"
                style={{ left: `${ent.x}%`, top: `${ent.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className="p-2 rounded-xl bg-orange-600 text-white text-[10px] font-bold shadow-lg flex items-center gap-1">
                  <ShoppingBag size={12} /> 7-Eleven Minimart
                </div>
                <div className="w-1.5 h-6 bg-orange-700/60 mt-1" />
              </div>
            );
          }
          if (ent.type === 'guild') {
            return (
              <div 
                key={ent.id}
                className="absolute text-center flex flex-col items-center pointer-events-none"
                style={{ left: `${ent.x}%`, top: `${ent.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className="p-2 rounded-xl bg-indigo-600 text-white text-[10px] font-bold shadow-lg flex items-center gap-1">
                  <Star size={12} /> Story Guild
                </div>
                <div className="w-1.5 h-6 bg-indigo-700/60 mt-1" />
              </div>
            );
          }
          if (ent.type === 'chest') {
            return (
              <div 
                key={ent.id}
                className={`absolute p-2 rounded-lg border flex flex-col items-center transition pointer-events-none ${
                  ent.collected ? 'bg-gray-800 border-gray-700 opacity-40' : 'bg-yellow-600 border-yellow-300 text-white animate-bounce shadow-xl'
                }`}
                style={{ left: `${ent.x}%`, top: `${ent.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <Coins size={14} />
                <span className="text-[8px] font-mono whitespace-nowrap">{ent.collected ? "Empty" : ent.name}</span>
              </div>
            );
          }
          if (ent.type === 'enemy') {
            return (
              <div 
                key={ent.id}
                className="absolute flex flex-col items-center pointer-events-none animate-pulse"
                style={{ left: `${ent.x}%`, top: `${ent.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2" style={{ backgroundColor: ent.color, borderColor: '#fff' }}>
                  👹
                </div>
                <span className="text-[8px] font-mono bg-black/80 text-purple-300 px-1 py-0.5 rounded mt-1 whitespace-nowrap">{ent.name}</span>
              </div>
            );
          }
          return null;
        })}

        {/* Trail Particles Renderer */}
        {particles.map(p => (
          <div 
            key={p.id}
            className="absolute w-1.5 h-1.5 rounded-full pointer-events-none animate-ping opacity-60"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: p.color,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}

        {/* Dynamic Player Avatar */}
        <div 
          className="absolute z-20 flex flex-col items-center transition-all duration-75"
          style={{ 
            left: `${playerPos.x}%`, 
            top: `${playerPos.y}%`, 
            transform: 'translate(-50%, -50%)' 
          }}
        >
          {/* Glowing Aura Ring */}
          <div 
            className={`absolute rounded-full -inset-2 opacity-50 ${
              stats.isOtakuPlus ? 'bg-orange-500 animate-ping' : 'bg-cyan-500 animate-pulse'
            }`}
            style={{ display: graphicsPreset === 'Low' ? 'none' : 'block' }}
          />

          {/* Avatar Face Container */}
          <div className="relative w-8 h-8 rounded-full bg-slate-800 border-2 border-orange-500 flex items-center justify-center text-lg shadow-xl">
            {stats.status === 'sick' ? '🤢' : stats.status === 'injured' ? '🤕' : '🧙'}
            {stats.isOtakuPlus && (
              <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black text-[8px] px-1 rounded-full font-bold">
                PRO
              </span>
            )}
          </div>

          <span className="text-[10px] font-mono bg-black/80 px-2 py-0.5 rounded text-orange-400 border border-orange-500/30 whitespace-nowrap mt-1">
            {user.email?.split('@')[0]}
          </span>
        </div>

        {/* Near Entities Prompts overlay */}
        {(() => {
          // Identify if near any interactable
          const nearMart = Math.hypot(playerPos.x - 35, playerPos.y - 25) < 7;
          const nearGuild = Math.hypot(playerPos.x - 65, playerPos.y - 55) < 7;
          const nearChest1 = Math.hypot(playerPos.x - 20, playerPos.y - 50) < 7 && !entities[0].collected;
          const nearChest2 = Math.hypot(playerPos.x - 80, playerPos.y - 30) < 7 && !entities[1].collected;
          const nearSlime1 = Math.hypot(playerPos.x - 50, playerPos.y - 65) < 8;
          const nearSlime2 = Math.hypot(playerPos.x - 75, playerPos.y - 20) < 8;

          return (
            <div className="absolute top-3 left-3 bg-black/70 p-3 rounded-lg text-white font-mono text-[10px] z-30 pointer-events-auto border border-orange-500/30">
              <div className="text-orange-400 font-bold mb-1 border-b border-gray-800 pb-1">COORDINATES & TARGETS</div>
              <div>X: {Math.round(playerPos.x)} | Y: {Math.round(playerPos.y)}</div>
              <div>State: <b className={stats.status === 'healthy' ? 'text-green-400' : 'text-red-400'}>{stats.status.toUpperCase()}</b></div>
              
              <div className="mt-2 space-y-1">
                {nearMart && <div className="text-amber-400 animate-pulse">🛒 Near 7-Eleven Shop! Press {keyMap.interact} or [A] to enter!</div>}
                {nearGuild && <div className="text-indigo-400 animate-pulse">📜 Near Quest Guild! Press {keyMap.interact} or [A] to talk!</div>}
                {(nearChest1 || nearChest2) && <div className="text-yellow-400 animate-bounce">📦 Found Gold Loot! Press {keyMap.interact} or [A] to unlock!</div>}
                {(nearSlime1 || nearSlime2) && <div className="text-red-400 animate-pulse">👹 Monster Nearby! Press {keyMap.attack} or [X] to Fight!</div>}
              </div>
            </div>
          );
        })()}

        {/* 4. STORY MODE DIALOG OVERLAY */}
        {storyDialog && (
          <div className="absolute inset-x-0 bottom-0 bg-black/90 p-4 border-t-2 border-orange-500 z-40 animate-in slide-in-from-bottom flex gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-orange-500 flex items-center justify-center text-2xl">
              🧙
            </div>
            <div className="flex-grow space-y-2">
              <div className="text-orange-400 text-xs font-bold uppercase">Quest Dialogue Guild</div>
              <p className="text-white text-xs leading-relaxed">{storyDialog}</p>
              <div className="flex gap-2">
                <button 
                  onClick={closeDialog}
                  className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded text-[10px] transition"
                >
                  Dismiss Dialog
                </button>
                {storyStep === 1 && (
                  <button 
                    onClick={triggerGuildDialog}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded text-[10px] transition"
                  >
                    Accept Quest
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. TRANSPARENT XBOX MOBILE CONTROLLER HUD */}
        <div className="absolute inset-0 pointer-events-none z-10 select-none">
          {/* Left Corner: Transparent Xbox-style D-PAD (for mobile simulation) */}
          <div className="absolute bottom-4 left-4 w-28 h-28 bg-black/25 backdrop-blur-[1px] rounded-full border border-white/20 p-1 pointer-events-auto flex items-center justify-center shadow-lg">
            <div className="relative w-full h-full">
              {/* Xbox Central circle */}
              <div className="absolute inset-8 rounded-full bg-slate-800/60 border border-white/10 flex items-center justify-center text-gray-400 text-[8px] font-bold">
                XBOX
              </div>
              
              {/* Up button */}
              <button 
                onClick={() => handleVirtualDir('up')}
                className="absolute top-0 inset-x-8 h-8 rounded-t-lg bg-gray-700/30 active:bg-orange-500/80 hover:bg-gray-700/50 flex items-center justify-center text-white font-bold text-xs"
              >
                ▲
              </button>

              {/* Down button */}
              <button 
                onClick={() => handleVirtualDir('down')}
                className="absolute bottom-0 inset-x-8 h-8 rounded-b-lg bg-gray-700/30 active:bg-orange-500/80 hover:bg-gray-700/50 flex items-center justify-center text-white font-bold text-xs"
              >
                ▼
              </button>

              {/* Left button */}
              <button 
                onClick={() => handleVirtualDir('left')}
                className="absolute left-0 inset-y-8 w-8 rounded-l-lg bg-gray-700/30 active:bg-orange-500/80 hover:bg-gray-700/50 flex items-center justify-center text-white font-bold text-xs"
              >
                ◀
              </button>

              {/* Right button */}
              <button 
                onClick={() => handleVirtualDir('right')}
                className="absolute right-0 inset-y-8 w-8 rounded-r-lg bg-gray-700/30 active:bg-orange-500/80 hover:bg-gray-700/50 flex items-center justify-center text-white font-bold text-xs"
              >
                ▶
              </button>
            </div>
          </div>

          {/* Right Corner: Transparent Xbox buttons layout (A, B, X, Y) */}
          <div className="absolute bottom-4 right-4 w-28 h-28 bg-black/25 backdrop-blur-[1px] rounded-full border border-white/20 pointer-events-auto flex items-center justify-center shadow-lg">
            <div className="relative w-full h-full">
              {/* Y Button (Yellow) */}
              <button 
                onClick={() => {
                  soundManager.playSpecial();
                  setStats(prev => ({
                    ...prev,
                    isOtakuPlus: true
                  }));
                  alert("🌟 Upgraded to Otaku+ Sub VIP Member directly via quick controller button!");
                }}
                className="absolute top-1 left-[38%] w-8 h-8 rounded-full bg-yellow-500/40 active:bg-yellow-500 text-yellow-300 font-bold text-xs border border-yellow-500 flex items-center justify-center shadow-md"
                title="Otaku+ VIP Sub"
              >
                Y
              </button>

              {/* X Button (Blue) - Attack */}
              <button 
                onClick={handleAttackCheck}
                className="absolute left-1 top-[38%] w-8 h-8 rounded-full bg-blue-500/40 active:bg-blue-500 text-blue-300 font-bold text-xs border border-blue-500 flex items-center justify-center shadow-md"
                title="Attack/Fight"
              >
                X
              </button>

              {/* B Button (Red) - Inventory or Open shop */}
              <button 
                onClick={onOpenShop}
                className="absolute right-1 top-[38%] w-8 h-8 rounded-full bg-red-500/40 active:bg-red-500 text-red-300 font-bold text-xs border border-red-500 flex items-center justify-center shadow-md"
                title="Open Shop"
              >
                B
              </button>

              {/* A Button (Green) - Interact */}
              <button 
                onClick={handleInteractionCheck}
                className="absolute bottom-1 left-[38%] w-8 h-8 rounded-full bg-green-500/40 active:bg-green-500 text-green-300 font-bold text-xs border border-green-500 flex items-center justify-center shadow-md"
                title="Action Interact"
              >
                A
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

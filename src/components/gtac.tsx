import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { Compass, ShieldAlert, Sparkles, Sliders, Play, Navigation, AlertTriangle, Star, Shield, HelpCircle, Eye, Cpu, Zap, RotateCcw } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface GTACProps {
  activeVRM?: { name: string };
  activeGLB?: { name: string };
  activeStage?: { name: string };
}

export default function GTAChinatownSystem({ activeVRM, activeGLB, activeStage }: GTACProps) {
  // Gameplay variables
  const [wantedStars, setWantedStars] = useState<number>(2);
  const [activeWeapon, setActiveWeapon] = useState<string>("Uzi Submachine Gun");
  const [isDriving, setIsDriving] = useState<boolean>(false);
  const [currentCar, setCurrentCar] = useState<string>("Cyber Comet GTR");
  const [missionState, setMissionState] = useState<string>("Carjack the Syndicate Shipment");
  const [missionProgress, setMissionProgress] = useState<number>(35);
  const [playerSpeed, setPlayerSpeed] = useState<number>(0);
  const [viewAngle, setViewAngle] = useState<number>(65); // Angled top-down Chinatown Wars view

  // WebGL top-down game simulator
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const carMeshRef = useRef<THREE.Group | null>(null);
  const policeGroupRef = useRef<THREE.Group[]>([]);

  // Sound triggers
  const playSirenSound = () => {
    soundManager.playHit();
    setWantedStars(prev => Math.min(5, prev + 1));
  };

  const clearCrimes = () => {
    soundManager.playLevelUp();
    setWantedStars(0);
  };

  const handleCarjack = (car: string) => {
    setCurrentCar(car);
    setIsDriving(true);
    soundManager.playSpecial();
    alert(`🏎️ GTAC Action: Carjacked a "${car}"! Dispatching top-down camera.`);
  };

  const weaponList = [
    { name: "Fists & Kung-Fu", emoji: "👊" },
    { name: "Damascus Katana", emoji: "⚔️" },
    { name: "Golden Pistol", emoji: "🔫" },
    { name: "Uzi Submachine Gun", emoji: "🔥" },
    { name: "Molotov Cocktail", emoji: "🧪" }
  ];

  // Render Loop
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020617);

    // Setup GTA: Chinatown top-down camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    // Position camera far above looking directly down at a steep angle
    const angleRad = (viewAngle / 180) * Math.PI;
    camera.position.set(0, 4.0, 2.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(240, 240);
    rendererRef.current = renderer;

    // Grid representing city blocks
    const grid = new THREE.GridHelper(12, 18, 0xea580c, 0x1f2937);
    grid.position.y = -0.5;
    scene.add(grid);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xea580c, 1.8);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // Dynamic player vehicle/character cube representation
    const playerGroup = new THREE.Group();
    carMeshRef.current = playerGroup;

    const bodyGeo = new THREE.BoxGeometry(0.5, 0.25, 0.9);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    playerGroup.add(body);

    const cabinGeo = new THREE.BoxGeometry(0.35, 0.2, 0.4);
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1 });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 0.2, -0.1);
    playerGroup.add(cabin);

    scene.add(playerGroup);

    // Generate static building boxes representing Chinatown blocks
    const buildings: THREE.Mesh[] = [];
    const buildingGeo = new THREE.BoxGeometry(1.2, 2.0, 1.2);
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

    const positions = [
      [-2, 0.5, -2],
      [2, 0.5, -2],
      [-2, 0.5, 2],
      [2, 0.5, 2]
    ];

    positions.forEach(pos => {
      const b = new THREE.Mesh(buildingGeo, buildingMat);
      b.position.set(pos[0], pos[1] - 0.5, pos[2]);
      scene.add(b);
      buildings.push(b);
    });

    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Simple car movement looping
      if (playerGroup) {
        if (isDriving) {
          playerGroup.position.z = Math.sin(elapsed * 2) * 1.5;
          playerGroup.position.x = Math.cos(elapsed * 2) * 1.5;
          playerGroup.rotation.y = -elapsed * 2;
          setPlayerSpeed(Math.abs(Math.round(Math.sin(elapsed * 2) * 160 + 20)));
        } else {
          playerGroup.position.set(0, 0, 0);
          playerGroup.rotation.y = elapsed * 0.5;
          setPlayerSpeed(0);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      bodyGeo.dispose();
      bodyMat.dispose();
      cabinGeo.dispose();
      cabinMat.dispose();
      buildingGeo.dispose();
      buildingMat.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [isDriving, viewAngle]);

  return (
    <div className="bg-gray-900/90 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Navigation className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">GTA Chinatown Wars 2.5D Engine</h2>
            <p className="text-[10px] text-gray-400 font-mono">Top-down camera coordinates, sports carjacking models, high-speed speedometers, and weapon loads</p>
          </div>
        </div>
        <span className="bg-orange-950 text-orange-400 border border-orange-500/20 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded font-mono">
          GTAC v1.5
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Render Viewport */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-gray-950 p-4 rounded-xl border border-gray-850 relative">
          <div className="absolute top-2 left-2 z-10 flex gap-1.5">
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/20 text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold flex items-center gap-1">
              <Cpu size={10} className="animate-spin" /> Chinatown Wars angle
            </span>
          </div>

          <div className="w-[240px] h-[240px] bg-slate-950 rounded-lg overflow-hidden border border-orange-500/20 shadow-inner">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          <div className="w-full mt-3 text-center space-y-1">
            <p className="text-[11px] font-mono font-bold text-white uppercase">
              {isDriving ? `Driving: ${currentCar}` : "Walking Mode (On Foot)"}
            </p>
            <div className="flex justify-center gap-3 text-[9.5px] text-gray-500 font-mono">
              <span>Speed: {playerSpeed} KM/H</span>
              <span>•</span>
              <span>Z-Axis: Top-Down</span>
            </div>
          </div>
        </div>

        {/* Configurations */}
        <div className="lg:col-span-7 space-y-4">
          {/* Wanted tracker */}
          <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-850 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest block font-bold flex items-center gap-1 animate-pulse">
                <AlertTriangle size={12} /> Police Wanted Level
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={15}
                    className={wantedStars >= star ? "text-yellow-400 fill-yellow-400 animate-bounce" : "text-gray-700"}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={playSirenSound}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-extrabold font-mono text-[9px] rounded uppercase tracking-wider transition"
              >
                Trigger Police (+1 Star)
              </button>
              {wantedStars > 0 && (
                <button
                  onClick={clearCrimes}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold font-mono text-[9px] rounded uppercase tracking-wider transition"
                >
                  Pay Syndicate Bribe
                </button>
              )}
            </div>
          </div>

          {/* Weapon Slot Wheel */}
          <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-850 space-y-2">
            <span className="text-[10px] font-mono text-orange-400 uppercase font-bold block">🔫 Weapon Weapon Wheel</span>
            <div className="grid grid-cols-3 gap-1.5">
              {weaponList.map(wep => (
                <button
                  key={wep.name}
                  onClick={() => {
                    setActiveWeapon(wep.name);
                    soundManager.playSpecial();
                  }}
                  className={`py-1.5 text-[9.5px] font-mono font-bold rounded-lg border transition flex items-center justify-center gap-1.5 ${
                    activeWeapon === wep.name
                      ? "bg-amber-600 text-black border-amber-400"
                      : "bg-gray-900 text-gray-500 border-gray-850 hover:bg-gray-850"
                  }`}
                >
                  <span>{wep.emoji}</span>
                  <span className="truncate">{wep.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chinatown Cars */}
          <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-850 space-y-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase font-bold block">🚗 Quick Carjack Vehicles</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Cyber Comet GTR", class: "Sports Car" },
                { name: "Yakuza Sentinel Pro", class: "Drift Sedan" },
                { name: "Syndicate Armored Tank", class: "Tactical Heavy" },
                { name: "Triad Lightbike", class: "Superbike" }
              ].map(car => (
                <button
                  key={car.name}
                  onClick={() => handleCarjack(car.name)}
                  className={`p-2 rounded-xl text-left font-mono border transition flex items-center justify-between ${
                    currentCar === car.name && isDriving
                      ? "bg-orange-600/20 border-orange-500 text-white shadow"
                      : "bg-gray-900 border-gray-850 text-gray-400 hover:bg-gray-850"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-bold text-white">{car.name.split(" ")[1] || car.name}</div>
                    <div className="text-[8px] text-gray-500">{car.class}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chinatown Story Missions */}
          <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-850 space-y-3">
            <div className="flex justify-between items-center border-b border-gray-900 pb-1.5">
              <span className="text-[10px] font-mono text-orange-400 uppercase font-bold block">📜 Active Mission Log</span>
              <span className="text-[9px] text-emerald-400 font-mono">Payout: $15,000</span>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-white font-bold">{missionState}</p>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>Infiltration Progress</span>
                  <span className="text-orange-400 font-bold">{missionProgress}%</span>
                </div>
                <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-850">
                  <div className="bg-orange-600 h-full transition-all duration-300" style={{ width: `${missionProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

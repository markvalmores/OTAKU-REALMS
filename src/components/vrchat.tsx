import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { Compass, Sparkles, Sliders, Volume2, Mic, Users, Eye, HelpCircle, AlertCircle, RefreshCw, Layers, MapPin, ExternalLink, Activity } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export default function VRChatWorldSystem() {
  const [activeWorld, setActiveWorld] = useState<string>("Cyber-Shibuya City Lobby");
  const [usersCount, setUsersCount] = useState<number>(142);
  const [isMicEnabled, setIsMicEnabled] = useState<boolean>(true);
  const [micVolume, setMicVolume] = useState<number>(30);
  const [portalSpin, setPortalSpin] = useState<number>(1.0);
  const [mirrorResolution, setMirrorResolution] = useState<string>("512x512 High-Res");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const portalMeshRef = useRef<THREE.Group | null>(null);

  // VRChat Worlds list
  const worldsList = [
    { name: "Cyber-Shibuya City Lobby", users: 142, tag: "Social" },
    { name: "Neon-Saber Dojo Arena", users: 58, tag: "Combat" },
    { name: "Fairy Cherry Blossom Garden", users: 215, tag: "Cozy Chill" },
    { name: "Skyline Synthwave Lounge", users: 89, tag: "Music Night" }
  ];

  const handleWorldChange = (world: string, count: number) => {
    setActiveWorld(world);
    setUsersCount(count);
    soundManager.playLevelUp();
    alert(`🌐 Portal Travel: Loading world "${world}"... Syncing lobby sockets!`);
  };

  const toggleMic = () => {
    setIsMicEnabled(!isMicEnabled);
    soundManager.playSpecial();
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // VRChat Lobby visualization setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020617); // Slate 950

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.2, 3.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(240, 240);
    rendererRef.current = renderer;

    // Grid represent ground
    const grid = new THREE.GridHelper(10, 20, 0x818cf8, 0x1e293b);
    grid.position.y = -0.8;
    scene.add(grid);

    // Dynamic light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xa855f7, 2);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    // Sparkle Portal Mesh representation
    const portalGroup = new THREE.Group();
    portalMeshRef.current = portalGroup;

    // Ring
    const torusGeo = new THREE.TorusGeometry(0.7, 0.12, 16, 100);
    const torusMat = new THREE.MeshStandardMaterial({ color: 0x818cf8, roughness: 0.1, metalness: 0.8 });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    portalGroup.add(torus);

    // Inside glowing core
    const coreGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.05, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.6 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.rotation.x = Math.PI / 2;
    portalGroup.add(core);

    scene.add(portalGroup);

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (portalGroup) {
        portalGroup.rotation.z = elapsed * portalSpin * 1.5;
        portalGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.2;
        // Float effect
        portalGroup.position.y = Math.sin(elapsed * 2) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      torusGeo.dispose();
      torusMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [portalSpin]);

  return (
    <div className="bg-gray-900/90 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">VRChat World Lobby Portals</h2>
            <p className="text-[10px] text-gray-400 font-mono">Connect client sockets to world instances, toggle spatial mic inputs, and test avatar mirror reflection meshes</p>
          </div>
        </div>
        <span className="bg-purple-950 text-purple-400 border border-purple-500/20 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded font-mono">
          VRC Client v2.1
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Render Portal Viewport */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-gray-950 p-4 rounded-xl border border-gray-850 relative">
          <div className="absolute top-2 left-2 z-10 flex gap-1.5">
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/20 text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold flex items-center gap-1">
              Active Portal World
            </span>
          </div>

          <div className="w-[240px] h-[240px] bg-slate-950 rounded-lg overflow-hidden border border-orange-500/20 shadow-inner">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          <div className="w-full mt-3 text-center space-y-1">
            <p className="text-[11px] font-mono font-bold text-white uppercase truncate">
              {activeWorld}
            </p>
            <div className="flex justify-center gap-3 text-[9.5px] text-gray-500 font-mono">
              <span>Users: {usersCount} Active</span>
              <span>•</span>
              <span>Ping: 22ms</span>
            </div>
          </div>
        </div>

        {/* Configurations */}
        <div className="lg:col-span-7 space-y-4">
          {/* Spatial Audio Input */}
          <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-850 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest block font-bold flex items-center gap-1">
                <Mic size={12} className={isMicEnabled ? "text-emerald-400 animate-bounce" : "text-gray-500"} /> Spatial Voice Chat
              </span>
              <button
                onClick={toggleMic}
                className={`px-3 py-1 text-[9px] font-mono font-bold uppercase rounded border transition ${
                  isMicEnabled ? "bg-emerald-950 text-emerald-400 border-emerald-500/20" : "bg-red-950/60 text-red-400 border border-red-500/20"
                }`}
              >
                {isMicEnabled ? "MIC ACTIVE" : "MUTED"}
              </button>
            </div>

            {isMicEnabled && (
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>Microphone Sensitvity (DB)</span>
                  <span className="text-orange-400 font-bold">{micVolume}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={micVolume}
                  onChange={(e) => setMicVolume(parseInt(e.target.value))}
                  className="w-full accent-orange-500" 
                />
              </div>
            )}
          </div>

          {/* VRC Worlds List */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Explore World Instances</span>
            <div className="grid grid-cols-2 gap-2">
              {worldsList.map(world => (
                <button
                  key={world.name}
                  onClick={() => handleWorldChange(world.name, world.users)}
                  className={`p-2.5 rounded-xl text-left font-mono border transition flex flex-col justify-between ${
                    activeWorld === world.name
                      ? "bg-purple-950/40 border-purple-500 text-purple-400 shadow-lg"
                      : "bg-gray-950 border-gray-850 text-gray-400 hover:bg-gray-900 hover:border-gray-800"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-[10.5px] font-bold text-white truncate">{world.name}</div>
                    <div className="text-[8.5px] text-gray-500">{world.tag} • {world.users} Lobbies</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Avatar Mirror Settings */}
          <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-850 space-y-3.5">
            <span className="text-[10px] font-mono text-orange-400 uppercase font-bold block">🪞 Spatial Mirror Shaders</span>

            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>Portal Spin Velocity Multiplier</span>
                  <span className="text-orange-400 font-bold">{portalSpin.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0.2" max="2.5" step="0.1" value={portalSpin}
                  onChange={(e) => setPortalSpin(parseFloat(e.target.value))}
                  className="w-full accent-orange-500" 
                />
              </div>

              <div className="flex justify-between items-center text-xs pt-1.5 border-t border-gray-900">
                <span className="text-gray-500">Mirror Render Resolution:</span>
                <div className="flex gap-1">
                  {["256x256", "512x512 High-Res", "1024x1024 Ultra"].map(res => (
                    <button
                      key={res}
                      onClick={() => {
                        setMirrorResolution(res);
                        soundManager.playSpecial();
                      }}
                      className={`px-2 py-1 text-[8.5px] font-mono font-bold rounded border transition ${
                        mirrorResolution === res 
                          ? "bg-purple-600/20 text-purple-400 border-purple-500/40" 
                          : "bg-gray-900 text-gray-500 border-gray-850 hover:bg-gray-800"
                      }`}
                    >
                      {res.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

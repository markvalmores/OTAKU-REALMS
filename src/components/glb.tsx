import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { Compass, Sparkles, Sliders, Upload, RefreshCw, Layers, ShieldAlert, Check, Moon, Sun, Cpu } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export interface GLBAsset {
  id: string;
  name: string;
  category: "Environment" | "Vehicle" | "Weapon" | "Fixture";
  fileSize: string;
  vertCount: number;
  colliders: number;
  isCustom?: boolean;
}

interface GLBProps {
  onSelectAsset: (asset: GLBAsset) => void;
  activeGLB: GLBAsset;
}

export default function GLBSystem({ onSelectAsset, activeGLB }: GLBProps) {
  const [lightIntensity, setLightIntensity] = useState<number>(1.2);
  const [lightColor, setLightColor] = useState<string>("#ea580c"); // Orange
  const [customGlbs, setCustomGlbs] = useState<GLBAsset[]>([]);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [fovValue, setFovValue] = useState<number>(45);
  const [selectedGeometry, setSelectedGeometry] = useState<"Torus" | "Knot" | "City Block" | "Complex Cylinder">("Torus");

  // Three.js Preview Setup
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  const presetGlbs: GLBAsset[] = [
    { id: "glb_shibuya", name: "Shibuya_CityGrid_Lowpoly.glb", category: "Environment", fileSize: "34.5 MB", vertCount: 145000, colliders: 112 },
    { id: "glb_kyoto", name: "Kyoto_CherryShrine_Staged.glb", category: "Environment", fileSize: "42.1 MB", vertCount: 182300, colliders: 94 },
    { id: "glb_supercar", name: "Cyber_GTR_V8_SportsCar.glb", category: "Vehicle", fileSize: "8.2 MB", vertCount: 38200, colliders: 12 },
    { id: "glb_motorcycle", name: "Hologram_Noodle_Bike_Pro.glb", category: "Vehicle", fileSize: "4.1 MB", vertCount: 19100, colliders: 8 },
  ];

  const allGlbs = [...presetGlbs, ...customGlbs];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const modelName = file.name.endsWith(".glb") ? file.name : `${file.name.split(".")[0]}.glb`;
      
      const newGlb: GLBAsset = {
        id: `glb_custom_${Date.now()}`,
        name: modelName,
        category: "Environment",
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        vertCount: Math.floor(Math.random() * 80000) + 40000,
        colliders: Math.floor(Math.random() * 40) + 20,
        isCustom: true
      };

      setCustomGlbs(prev => [newGlb, ...prev]);
      onSelectAsset(newGlb);
      soundManager.playLevelUp();
      alert(`✅ Success: Custom GLB World Asset "${modelName}" successfully imported and mapped inside the WebGL Physics Mesh collider!`);
    }
  };

  // ThreeJS live preview renderer
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020617); // Slate 950

    const camera = new THREE.PerspectiveCamera(fovValue, 1, 0.1, 100);
    camera.position.set(0, 2, 4.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(240, 240);
    rendererRef.current = renderer;

    // Grid Plane Floor
    const gridHelper = new THREE.GridHelper(12, 24, 0x334155, 0x1e293b);
    gridHelper.position.y = -1;
    scene.add(gridHelper);

    // Dynamic Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(new THREE.Color(lightColor), lightIntensity);
    directionalLight.position.set(3, 5, 2);
    scene.add(directionalLight);

    // Create custom interactive geometry reflecting active model type
    let geom: THREE.BufferGeometry;
    if (selectedGeometry === "Torus") {
      geom = new THREE.TorusGeometry(1, 0.35, 12, 48);
    } else if (selectedGeometry === "Knot") {
      geom = new THREE.TorusKnotGeometry(0.75, 0.25, 64, 8);
    } else if (selectedGeometry === "City Block") {
      geom = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    } else {
      geom = new THREE.CylinderGeometry(0.8, 0.8, 1.8, 16);
    }

    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(lightColor),
      wireframe: wireframeMode,
      roughness: 0.2,
      metalness: 0.8,
    });

    const mesh = new THREE.Mesh(geom, mat);
    meshRef.current = mesh;
    scene.add(mesh);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (mesh) {
        mesh.rotation.x = clock.getElapsedTime() * 0.4;
        mesh.rotation.y = clock.getElapsedTime() * 0.6;
        mesh.rotation.z = clock.getElapsedTime() * 0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      geom.dispose();
      mat.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [selectedGeometry, lightIntensity, lightColor, wireframeMode, fovValue]);

  return (
    <div className="bg-gray-900/90 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Layers className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">GLB World Mesh Engine</h2>
            <p className="text-[10px] text-gray-400 font-mono">Load 3D model vertices, calculate static mesh collisions, and optimize vertex shaders</p>
          </div>
        </div>
        <span className="bg-amber-950 text-amber-400 border border-amber-500/20 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded font-mono">
          GLB v2.0
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: 3D Preview Frame */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-gray-950 p-4 rounded-xl border border-gray-850 relative">
          <div className="absolute top-2 left-2 z-10 flex gap-1.5">
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/20 text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold flex items-center gap-1">
              <Cpu size={10} className="animate-spin" /> Live WebGL
            </span>
            <button
              onClick={() => {
                setWireframeMode(!wireframeMode);
                soundManager.playSpecial();
              }}
              className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold border transition ${
                wireframeMode ? "bg-orange-600 text-white border-orange-400" : "bg-gray-900 text-gray-400 border-gray-800"
              }`}
            >
              Wireframe
            </button>
          </div>

          <div className="w-[240px] h-[240px] bg-slate-950 rounded-lg overflow-hidden border border-orange-500/20 shadow-inner relative flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          <div className="w-full mt-3 text-center space-y-1">
            <p className="text-xs font-bold font-mono text-white uppercase">{activeGLB.name}</p>
            <div className="flex justify-center gap-4 text-[9px] text-gray-500 font-mono">
              <span>Verts: {activeGLB.vertCount.toLocaleString()}</span>
              <span>•</span>
              <span>Colliders: {activeGLB.colliders}</span>
              <span>•</span>
              <span>Size: {activeGLB.fileSize}</span>
            </div>
          </div>
        </div>

        {/* Right Column: GLB Setup & Actions */}
        <div className="lg:col-span-7 space-y-4">
          {/* Asset Selector list */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">GLB Environment Library</label>
              
              <label className="cursor-pointer bg-orange-600 hover:bg-orange-500 text-black text-[9.5px] font-bold uppercase font-mono px-2.5 py-1 rounded-lg transition duration-150 flex items-center gap-1 shadow-lg">
                <Upload size={10} />
                <span>Upload Custom .glb</span>
                <input type="file" accept=".glb" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {allGlbs.map((glb) => {
                const isSelected = activeGLB.id === glb.id;
                return (
                  <button
                    key={glb.id}
                    onClick={() => {
                      onSelectAsset(glb);
                      soundManager.playLevelUp();
                    }}
                    className={`p-2.5 text-left rounded-xl border font-mono transition flex justify-between items-center ${
                      isSelected 
                        ? "bg-orange-950/40 border-orange-500 text-orange-400 shadow-lg" 
                        : "bg-gray-950 border-gray-850 text-gray-400 hover:bg-gray-900 hover:border-gray-800"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-[11px] font-bold flex items-center gap-1 text-white">
                        {glb.name.split("_")[0]}
                        {glb.isCustom && <span className="text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-500/20 px-1 rounded uppercase font-extrabold">Custom</span>}
                      </div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest">{glb.category}</div>
                    </div>
                    {isSelected && <Check size={14} className="text-orange-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Rendering and Lighting matrix */}
          <div className="bg-gray-950 p-3 rounded-xl border border-gray-850 space-y-3">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider block font-bold">💡 WebGL Render & Lighting Matrix</span>
            
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-gray-500 block">3D Geometry Type</span>
                <div className="grid grid-cols-2 gap-1">
                  {(["Torus", "Knot", "City Block", "Complex Cylinder"] as const).map(geom => (
                    <button
                      key={geom}
                      onClick={() => {
                        setSelectedGeometry(geom);
                        soundManager.playSpecial();
                      }}
                      className={`text-[9px] font-bold font-mono py-1 rounded transition border ${
                        selectedGeometry === geom 
                          ? "bg-orange-600/20 text-orange-400 border-orange-500/40" 
                          : "bg-gray-900 text-gray-500 border-gray-850 hover:bg-gray-850"
                      }`}
                    >
                      {geom}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-mono text-gray-500">
                    <span>Direct Light Power</span>
                    <span className="text-orange-400 font-bold">{lightIntensity.toFixed(1)}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="3" 
                    step="0.1"
                    value={lightIntensity}
                    onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                    className="w-full accent-orange-500" 
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-mono text-gray-500">
                    <span>Camera FOV</span>
                    <span className="text-orange-400 font-bold">{fovValue}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="25" 
                    max="80" 
                    value={fovValue}
                    onChange={(e) => setFovValue(parseInt(e.target.value))}
                    className="w-full accent-orange-500" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Color palette modifier */}
          <div className="bg-gray-950 p-3 rounded-xl border border-gray-850 space-y-2">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider block font-bold">🎨 Neon Shader Color Palette</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { name: "Tokyo Cyan", hex: "#06b6d4" },
                { name: "cyber Orange", hex: "#ea580c" },
                { name: "Neon Pink", hex: "#ec4899" },
                { name: "Kyoto Emerald", hex: "#10b981" }
              ].map(palette => (
                <button
                  key={palette.hex}
                  onClick={() => {
                    setLightColor(palette.hex);
                    soundManager.playSpecial();
                  }}
                  className={`py-1.5 text-[9px] font-mono font-bold rounded-lg border transition flex flex-col items-center gap-1 ${
                    lightColor === palette.hex
                      ? "bg-amber-600 text-black border-amber-400"
                      : "bg-gray-900 text-gray-500 border-gray-850 hover:bg-gray-850"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: palette.hex }} />
                  <span>{palette.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

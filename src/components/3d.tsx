import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { Compass, Sparkles, Sliders, Eye, Sun, Layers, ShieldCheck, Cpu, RefreshCw, ZoomIn, Maximize } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export interface ThreeDSetting {
  projection: "Perspective" | "Orthographic";
  shading: "Toon/Cel" | "PBR Realistic" | "Flat Vector" | "Retro Wireframe";
  bloom: number;
  antiAliasing: boolean;
  fov: number;
  cameraDistance: number;
}

export default function ThreeDSystem() {
  const [projection, setProjection] = useState<"Perspective" | "Orthographic">("Perspective");
  const [shading, setShading] = useState<"Toon/Cel" | "PBR Realistic" | "Flat Vector" | "Retro Wireframe">("Toon/Cel");
  const [bloom, setBloom] = useState<number>(1.2);
  const [antiAliasing, setAntiAliasing] = useState<boolean>(true);
  const [fov, setFov] = useState<number>(45);
  const [cameraDistance, setCameraDistance] = useState<number>(4.0);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1.0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x030712); // Slate 950

    // Setup Camera
    const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
    camera.position.set(0, 1.5, cameraDistance);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: antiAliasing });
    renderer.setSize(240, 240);
    rendererRef.current = renderer;

    // Add elements
    const grid = new THREE.GridHelper(10, 20, 0xea580c, 0x1f2937);
    grid.position.y = -1;
    scene.add(grid);

    // Dynamic light based on shading
    const ambientLight = new THREE.AmbientLight(0xffffff, shading === "Toon/Cel" ? 0.9 : 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xea580c, 1.5);
    dirLight.position.set(3, 5, 3);
    scene.add(dirLight);

    const group = new THREE.Group();
    meshRef.current = group;

    // Create complex shape
    let mainGeom = new THREE.IcosahedronGeometry(0.9, shading === "Flat Vector" ? 0 : 1);
    let mainMat: THREE.Material;

    if (shading === "Retro Wireframe") {
      mainMat = new THREE.MeshBasicMaterial({ color: 0xea580c, wireframe: true });
    } else if (shading === "Flat Vector") {
      mainMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    } else if (shading === "Toon/Cel") {
      mainMat = new THREE.MeshToonMaterial({ color: 0x38bdf8 });
    } else {
      mainMat = new THREE.MeshStandardMaterial({ color: 0xec4899, metalness: 0.8, roughness: 0.2 });
    }

    const sphereMesh = new THREE.Mesh(mainGeom, mainMat);
    group.add(sphereMesh);

    // Orbit ring
    const ringGeom = new THREE.TorusGeometry(1.3, 0.05, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xea580c, transparent: true, opacity: 0.4 });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    group.add(ringMesh);

    scene.add(group);

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (group) {
        group.rotation.y = elapsed * 0.4 * rotationSpeed;
        group.rotation.z = Math.sin(elapsed * 0.5) * 0.2;
        sphereMesh.position.y = Math.sin(elapsed * 2) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      mainGeom.dispose();
      mainMat.dispose();
      ringGeom.dispose();
      ringMat.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [fov, cameraDistance, shading, antiAliasing, rotationSpeed]);

  const handleProjectionChange = (proj: "Perspective" | "Orthographic") => {
    setProjection(proj);
    soundManager.playSpecial();
  };

  const resetCamera = () => {
    setFov(45);
    setCameraDistance(4.0);
    setRotationSpeed(1.0);
    soundManager.playLevelUp();
  };

  return (
    <div className="bg-gray-900/90 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <Maximize className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">3D Graphics viewport System</h2>
            <p className="text-[10px] text-gray-400 font-mono">Toon Cel Shading, PBR Rendering pipelines, and post-processing matrices</p>
          </div>
        </div>
        <button
          onClick={resetCamera}
          className="bg-gray-950 hover:bg-gray-850 text-gray-400 hover:text-white border border-gray-800 text-[10px] font-mono px-2 py-1 rounded flex items-center gap-1 transition"
        >
          <RefreshCw size={10} /> Reset Viewport
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Render Block */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-gray-950 p-4 rounded-xl border border-gray-850 relative">
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/20 text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold flex items-center gap-1">
              <Cpu size={10} className="animate-spin" /> Render Pipeline
            </span>
          </div>

          <div className="w-[240px] h-[240px] bg-slate-950 rounded-lg overflow-hidden border border-orange-500/20 shadow-inner">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          <div className="w-full mt-3 text-center">
            <p className="text-[11px] font-mono text-orange-400 font-bold uppercase tracking-widest">Projection: {projection} Mode</p>
          </div>
        </div>

        {/* Matrix variables */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Projection Lens Style</span>
            <div className="grid grid-cols-2 gap-2">
              {(["Perspective", "Orthographic"] as const).map(proj => (
                <button
                  key={proj}
                  onClick={() => handleProjectionChange(proj)}
                  className={`py-2 text-[10px] font-mono font-bold rounded-lg border transition ${
                    projection === proj
                      ? "bg-orange-600 text-white border-orange-400 shadow"
                      : "bg-gray-950 text-gray-400 border-gray-850 hover:bg-gray-900"
                  }`}
                >
                  {proj} Lens
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Toon & Cel Shader Presets</span>
            <div className="grid grid-cols-2 gap-2">
              {(["Toon/Cel", "PBR Realistic", "Flat Vector", "Retro Wireframe"] as const).map(shd => (
                <button
                  key={shd}
                  onClick={() => {
                    setShading(shd);
                    soundManager.playSpecial();
                  }}
                  className={`py-1.5 text-[9px] font-mono font-bold rounded-lg border transition ${
                    shading === shd
                      ? "bg-amber-600 text-black border-amber-400"
                      : "bg-gray-950 text-gray-400 border-gray-850 hover:bg-gray-900"
                  }`}
                >
                  {shd}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-850 space-y-3.5">
            <span className="text-[10px] font-mono text-orange-400 uppercase font-bold block">🎚️ Active Viewport Matrices</span>

            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>Camera FOV Limit</span>
                  <span className="text-orange-400 font-bold">{fov}°</span>
                </div>
                <input 
                  type="range" min="15" max="90" value={fov}
                  onChange={(e) => setFov(parseInt(e.target.value))}
                  className="w-full accent-orange-500" 
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>Camera Plane Depth</span>
                  <span className="text-orange-400 font-bold">{cameraDistance.toFixed(1)}m</span>
                </div>
                <input 
                  type="range" min="1.5" max="8.0" step="0.2" value={cameraDistance}
                  onChange={(e) => setCameraDistance(parseFloat(e.target.value))}
                  className="w-full accent-orange-500" 
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>Spin Speed Multiplier</span>
                  <span className="text-orange-400 font-bold">{rotationSpeed.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0" max="3.0" step="0.1" value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                  className="w-full accent-orange-500" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-gray-950 p-2.5 rounded-xl border border-gray-850">
            <span className="text-[10px] font-mono text-gray-400">Post-Process Anti-Aliasing (FXAA)</span>
            <button
              onClick={() => {
                setAntiAliasing(!antiAliasing);
                soundManager.playSpecial();
              }}
              className={`px-3 py-1 rounded text-[9px] font-mono font-bold uppercase transition ${
                antiAliasing ? "bg-emerald-950 text-emerald-400 border border-emerald-500/20" : "bg-red-950 text-red-400 border border-red-500/20"
              }`}
            >
              {antiAliasing ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

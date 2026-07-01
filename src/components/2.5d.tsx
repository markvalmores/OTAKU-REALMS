import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { Compass, Layers, Shield, Sparkles, Sliders, RefreshCw, Box, Eye, Grid } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export default function TwoHalfDSystem() {
  const [projectionType, setProjectionType] = useState<"Isometric" | "Cabinet" | "Cavalier" | "Dimetric">("Isometric");
  const [gridSize, setGridSize] = useState<number>(8);
  const [spriteBillboard, setSpriteBillboard] = useState<boolean>(true);
  const [heightExtrusion, setHeightExtrusion] = useState<number>(1.0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Standard Orthographic camera setup for 2.5D gaming
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020617); // Slate 950

    // Orthographic Camera Parameters (Left, Right, Top, Bottom, Near, Far)
    const aspect = 1;
    const d = 2.5;
    const camera = new THREE.OrthographicCamera(
      -d * aspect, d * aspect, d, -d, 1, 1000
    );
    
    // Apply proper Isometric angles
    // For true isometric representation: Math.asin(Math.tan(30 * Math.PI / 180)) ~ 35.264 degrees
    if (projectionType === "Isometric") {
      camera.position.set(d, d, d);
    } else if (projectionType === "Cavalier") {
      camera.position.set(0, d, d * 1.5);
    } else if (projectionType === "Cabinet") {
      camera.position.set(d * 0.5, d, d);
    } else { // Dimetric
      camera.position.set(d, d * 0.5, d);
    }
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(240, 240);
    rendererRef.current = renderer;

    // Grid representation of tiles
    const gridHelper = new THREE.GridHelper(gridSize, gridSize, 0xea580c, 0x1e293b);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Light
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xea580c, 1.5);
    dir.position.set(5, 8, 3);
    scene.add(dir);

    const group = new THREE.Group();
    groupRef.current = group;

    // Create custom grid blocks representing isometric obstacles
    const cubeGeo = new THREE.BoxGeometry(0.5, 0.5 * heightExtrusion, 0.5);
    const cubeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.5
    });

    // Spawn block layout inside grid
    for (let x = -1; x <= 1; x += 1) {
      for (let z = -1; z <= 1; z += 1) {
        if (Math.abs(x) === 1 && Math.abs(z) === 1) continue; // Sparse
        const block = new THREE.Mesh(cubeGeo, cubeMat);
        block.position.set(x * 0.8, (0.25 * heightExtrusion) - 0.5, z * 0.8);
        group.add(block);
      }
    }

    // Spawn central billboard character
    const sphereGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
    const hero = new THREE.Mesh(sphereGeo, sphereMat);
    hero.position.set(0, 0.3, 0);
    group.add(hero);

    scene.add(group);

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (group) {
        // Slow sway of the isometric display
        group.rotation.y = Math.sin(time * 0.15) * 0.1;
        hero.position.y = 0.3 + Math.sin(time * 3) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      cubeGeo.dispose();
      cubeMat.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [projectionType, gridSize, heightExtrusion]);

  return (
    <div className="bg-gray-900/90 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Grid className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">2.5D Isometric projection engine</h2>
            <p className="text-[10px] text-gray-400 font-mono">Simulate classic gaming projections, depth sorting matrices, and billboard vectors</p>
          </div>
        </div>
        <span className="bg-orange-950 text-orange-400 border border-orange-500/20 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded font-mono">
          Depth Sorter
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Render Grid Frame */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-gray-950 p-4 rounded-xl border border-gray-850 relative">
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/20 text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold flex items-center gap-1">
              Orthographic Camera
            </span>
          </div>

          <div className="w-[240px] h-[240px] bg-slate-950 rounded-lg overflow-hidden border border-orange-500/20 shadow-inner">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          <div className="w-full mt-3 text-center">
            <p className="text-[11px] font-mono text-orange-400 font-bold uppercase tracking-widest">{projectionType} Angle Preset</p>
          </div>
        </div>

        {/* Configurations */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Projection Style</span>
            <div className="grid grid-cols-2 gap-2">
              {(["Isometric", "Cabinet", "Cavalier", "Dimetric"] as const).map(proj => (
                <button
                  key={proj}
                  onClick={() => {
                    setProjectionType(proj);
                    soundManager.playSpecial();
                  }}
                  className={`py-2 text-[10px] font-mono font-bold rounded-lg border transition ${
                    projectionType === proj
                      ? "bg-orange-600 text-white border-orange-400 shadow"
                      : "bg-gray-950 text-gray-400 border-gray-850 hover:bg-gray-900"
                  }`}
                >
                  {proj} 2.5D
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-850 space-y-3.5">
            <span className="text-[10px] font-mono text-orange-400 uppercase font-bold block">📦 Extrusions & Sorting matrices</span>

            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>Isometric Tile Grid Division</span>
                  <span className="text-orange-400 font-bold">{gridSize} x {gridSize} Tiles</span>
                </div>
                <input 
                  type="range" min="4" max="16" step="2" value={gridSize}
                  onChange={(e) => setGridSize(parseInt(e.target.value))}
                  className="w-full accent-orange-500" 
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>Terrain Block Height Extrusion</span>
                  <span className="text-orange-400 font-bold">{heightExtrusion.toFixed(1)}m</span>
                </div>
                <input 
                  type="range" min="0.2" max="2.5" step="0.1" value={heightExtrusion}
                  onChange={(e) => setHeightExtrusion(parseFloat(e.target.value))}
                  className="w-full accent-orange-500" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-gray-950 p-2.5 rounded-xl border border-gray-850">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-gray-300 block">2D Sprite Billboarding</span>
              <span className="text-[8.5px] text-gray-500 font-mono block">Instantly lock sprite orientation to follow Camera vector</span>
            </div>
            <button
              onClick={() => {
                setSpriteBillboard(!spriteBillboard);
                soundManager.playSpecial();
              }}
              className={`px-3 py-1 rounded text-[9px] font-mono font-bold uppercase transition ${
                spriteBillboard ? "bg-emerald-950 text-emerald-400 border border-emerald-500/20" : "bg-red-950 text-red-400 border border-red-500/20"
              }`}
            >
              {spriteBillboard ? "LOCK CAM" : "MANUAL"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

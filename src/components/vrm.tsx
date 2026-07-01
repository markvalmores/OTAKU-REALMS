import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { User, Sparkles, Sliders, Shield, RefreshCw, Upload, Eye, Check, Cpu } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export interface VRMModel {
  id: string;
  name: string;
  fileSize: string;
  polyCount: number;
  bones: number;
  expression: string;
  isCustom?: boolean;
}

interface VRMProps {
  onSelectCharacter: (vrm: VRMModel) => void;
  activeVRM: VRMModel;
  unlockedCharacters: string[];
}

export default function VRMSystem({ onSelectCharacter, activeVRM, unlockedCharacters }: VRMProps) {
  const [selectedAnim, setSelectedAnim] = useState<string>("Idle");
  const [jointAngle, setJointAngle] = useState<number>(0);
  const [expressionState, setExpressionState] = useState<string>("Neutral");
  const [customVrms, setCustomVrms] = useState<VRMModel[]>([]);
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  
  // Three.js Preview Setup
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Group | null>(null);

  const presetVrms: VRMModel[] = [
    { id: "vrm_kuro", name: "Kuro Shinobi .vrm", fileSize: "12.4 MB", polyCount: 42350, bones: 64, expression: "Neutral" },
    { id: "vrm_sakura", name: "Sakura Blade .vrm", fileSize: "15.1 MB", polyCount: 51200, bones: 72, expression: "Smiling" },
    { id: "vrm_cyber", name: "Cyber Samurai .vrm", fileSize: "18.6 MB", polyCount: 63900, bones: 80, expression: "Aggressive" },
    { id: "vrm_neko", name: "Neko Mage .vrm", fileSize: "10.8 MB", polyCount: 38500, bones: 58, expression: "Cheerful" },
  ];

  // Combine defaults and uploaded models
  const allVrms = [...presetVrms, ...customVrms];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const modelName = file.name.endsWith(".vrm") ? file.name : `${file.name.split(".")[0]}.vrm`;
      
      const newVrm: VRMModel = {
        id: `vrm_custom_${Date.now()}`,
        name: modelName,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        polyCount: Math.floor(Math.random() * 30000) + 30000,
        bones: Math.floor(Math.random() * 25) + 55,
        expression: "Loaded",
        isCustom: true
      };

      setCustomVrms(prev => [newVrm, ...prev]);
      onSelectCharacter(newVrm);
      soundManager.playLevelUp();
      alert(`✅ Success: Custom VRM Avatar File "${modelName}" successfully compiled into the VRM Engine database!`);
    }
  };

  // ThreeJS live preview render
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020617); // Slate 950

    // Camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.2, 3.5);
    camera.lookAt(0, 1.0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(240, 240);
    rendererRef.current = renderer;

    // Grid Floor
    const gridHelper = new THREE.GridHelper(10, 20, 0xea580c, 0x334155);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xea580c, 1.2);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    // Create a mock modular mannequin 3D mesh representation of the avatar
    const avatarGroup = new THREE.Group();
    meshRef.current = avatarGroup;

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({ 
      color: 0x38bdf8, // light cyan
      wireframe: showWireframe,
      roughness: 0.2,
      metalness: 0.5
    });
    
    const suitMat = new THREE.MeshStandardMaterial({ 
      color: 0xea580c, // orange
      wireframe: showWireframe,
      roughness: 0.3,
      metalness: 0.8
    });

    // Torso
    const torsoGeo = new THREE.CylinderGeometry(0.3, 0.15, 0.9, 12);
    const torso = new THREE.Mesh(torsoGeo, suitMat);
    torso.position.y = 1.05;
    avatarGroup.add(torso);

    // Head
    const headGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.6;
    avatarGroup.add(head);

    // Shoulders & Arms
    const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8);
    const leftArm = new THREE.Mesh(armGeo, suitMat);
    leftArm.position.set(-0.45, 1.1, 0);
    leftArm.rotation.z = Math.PI / 4;
    avatarGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, suitMat);
    rightArm.position.set(0.45, 1.1, 0);
    rightArm.rotation.z = -Math.PI / 4;
    avatarGroup.add(rightArm);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.1, 0.07, 0.7, 8);
    const leftLeg = new THREE.Mesh(legGeo, suitMat);
    leftLeg.position.set(-0.18, 0.45, 0);
    avatarGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, suitMat);
    rightLeg.position.set(0.18, 0.45, 0);
    avatarGroup.add(rightLeg);

    scene.add(avatarGroup);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Dynamic custom locomotion poses based on selections
      if (avatarGroup) {
        // Simple breathing/bobbing
        avatarGroup.position.y = Math.sin(elapsedTime * 2.5) * 0.03;
        
        if (selectedAnim === "Running" || selectedAnim === "Car Drive") {
          // Dynamic running animation rotations
          avatarGroup.rotation.y = Math.sin(elapsedTime * 4) * 0.1;
          leftLeg.rotation.x = Math.sin(elapsedTime * 10) * 0.6;
          rightLeg.rotation.x = -Math.sin(elapsedTime * 10) * 0.6;
          leftArm.rotation.x = -Math.sin(elapsedTime * 10) * 0.6;
          rightArm.rotation.x = Math.sin(elapsedTime * 10) * 0.6;
        } else if (selectedAnim === "Slash Combat") {
          // Sword slashing rotation swing
          avatarGroup.rotation.y = elapsedTime * 4 % (Math.PI * 2);
          leftArm.rotation.z = Math.sin(elapsedTime * 12) * 1.2;
        } else {
          // Idle stance breathing
          avatarGroup.rotation.y = elapsedTime * 0.3;
          leftLeg.rotation.x = 0;
          rightLeg.rotation.x = 0;
          leftArm.rotation.z = Math.PI / 4 + Math.sin(elapsedTime * 2) * 0.05;
          rightArm.rotation.z = -Math.PI / 4 - Math.sin(elapsedTime * 2) * 0.05;
        }

        // Apply joint manual adjustments
        head.rotation.y = (jointAngle / 180) * Math.PI;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [selectedAnim, jointAngle, showWireframe]);

  return (
    <div className="bg-gray-900/90 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">VRM Character Control Engine</h2>
            <p className="text-[10px] text-gray-400 font-mono">Load VRoid Studio characters, test bone rigs, and toggle custom facial expressions</p>
          </div>
        </div>
        <span className="bg-orange-950 text-orange-400 border border-orange-500/20 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded font-mono">
          VRM v1.0
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
                setShowWireframe(!showWireframe);
                soundManager.playSpecial();
              }}
              className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold border transition ${
                showWireframe ? "bg-orange-600 text-white border-orange-400" : "bg-gray-900 text-gray-400 border-gray-800"
              }`}
            >
              Wireframe
            </button>
          </div>

          <div className="w-[240px] h-[240px] bg-slate-950 rounded-lg overflow-hidden border border-orange-500/20 shadow-inner relative flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          <div className="w-full mt-3 text-center space-y-1">
            <p className="text-xs font-bold font-mono text-white uppercase">{activeVRM.name}</p>
            <div className="flex justify-center gap-4 text-[9px] text-gray-500 font-mono">
              <span>Bones: {activeVRM.bones}</span>
              <span>•</span>
              <span>Polys: {activeVRM.polyCount.toLocaleString()}</span>
              <span>•</span>
              <span>Size: {activeVRM.fileSize}</span>
            </div>
          </div>
        </div>

        {/* Right Column: VRM Setup & Actions */}
        <div className="lg:col-span-7 space-y-4">
          {/* Avatar Selector list */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">Select Avatar Model</label>
              
              {/* File upload connector */}
              <label className="cursor-pointer bg-orange-600 hover:bg-orange-500 text-black text-[9.5px] font-bold uppercase font-mono px-2.5 py-1 rounded-lg transition duration-150 flex items-center gap-1 shadow-lg">
                <Upload size={10} />
                <span>Upload Custom .vrm</span>
                <input type="file" accept=".vrm" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {allVrms.map((vrm) => {
                const isSelected = activeVRM.id === vrm.id;
                return (
                  <button
                    key={vrm.id}
                    onClick={() => {
                      onSelectCharacter(vrm);
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
                        {vrm.name.split(" ")[0]}
                        {vrm.isCustom && <span className="text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-500/20 px-1 rounded uppercase font-extrabold">Custom</span>}
                      </div>
                      <div className="text-[9px] text-gray-500">{vrm.polyCount.toLocaleString()} poly count</div>
                    </div>
                    {isSelected && <Check size={14} className="text-orange-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bone Node Kinematics */}
          <div className="bg-gray-950 p-3 rounded-xl border border-gray-850 space-y-3">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider block font-bold">🦴 Kinematics & Face blend shapes</span>
            
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>Neck Joint Angle</span>
                  <span className="text-orange-400 font-bold">{jointAngle}°</span>
                </div>
                <input 
                  type="range" 
                  min="-45" 
                  max="45" 
                  value={jointAngle}
                  onChange={(e) => setJointAngle(parseInt(e.target.value))}
                  className="w-full accent-orange-500" 
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono text-gray-500 block">Active Locomotion Trigger</span>
                <div className="grid grid-cols-2 gap-1">
                  {(["Idle", "Running", "Slash Combat", "Car Drive"] as const).map(anim => (
                    <button
                      key={anim}
                      onClick={() => {
                        setSelectedAnim(anim);
                        soundManager.playSpecial();
                      }}
                      className={`text-[9px] font-bold font-mono py-1 rounded transition border ${
                        selectedAnim === anim 
                          ? "bg-orange-600/20 text-orange-400 border-orange-500/40" 
                          : "bg-gray-900 text-gray-500 border-gray-850 hover:bg-gray-850"
                      }`}
                    >
                      {anim}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Avatar Face Blend Expression settings */}
          <div className="bg-gray-950 p-3 rounded-xl border border-gray-850 space-y-2">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider block font-bold">🎭 Facial Expression Map</span>
            <div className="grid grid-cols-4 gap-1.5">
              {(["Neutral", "Smiling", "Aggressive", "Cheerful"] as const).map(exp => (
                <button
                  key={exp}
                  onClick={() => {
                    setExpressionState(exp);
                    soundManager.playSpecial();
                  }}
                  className={`py-1 text-[9px] font-mono font-bold rounded-lg border transition ${
                    expressionState === exp
                      ? "bg-amber-600 text-black border-amber-400"
                      : "bg-gray-900 text-gray-500 border-gray-850 hover:bg-gray-850"
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

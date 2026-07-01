import React, { useState } from "react";
import { Sliders, RefreshCw, Eye, ShieldCheck, Zap, Activity, ChevronRight, Check } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export interface BoneNode {
  id: string;
  name: string;
  pitch: number;
  yaw: number;
  roll: number;
  parent?: string;
}

export default function BonesSystem() {
  const [selectedBone, setSelectedBone] = useState<string>("bone_neck");
  const [bones, setBones] = useState<BoneNode[]>([
    { id: "bone_hips", name: "Pelvis / Hips Root", pitch: 0, yaw: 0, roll: 0 },
    { id: "bone_spine", name: "Upper Spine Joint", pitch: 10, yaw: 0, roll: 0, parent: "bone_hips" },
    { id: "bone_neck", name: "Neck Node (C4)", pitch: -5, yaw: 15, roll: 0, parent: "bone_spine" },
    { id: "bone_head", name: "Head Node (Target)", pitch: 5, yaw: 10, roll: -5, parent: "bone_neck" },
    { id: "bone_l_shoulder", name: "Left Shoulder Pivot", pitch: 15, yaw: -30, roll: 45, parent: "bone_spine" },
    { id: "bone_r_shoulder", name: "Right Shoulder Pivot", pitch: 15, yaw: 30, roll: -45, parent: "bone_spine" },
    { id: "bone_l_hip", name: "Left Leg Joint", pitch: 0, yaw: 0, roll: 10, parent: "bone_hips" },
    { id: "bone_r_hip", name: "Right Leg Joint", pitch: 0, yaw: 0, roll: -10, parent: "bone_hips" },
  ]);

  const activeBone = bones.find(b => b.id === selectedBone) || bones[0];

  const handleRotationChange = (axis: "pitch" | "yaw" | "roll", value: number) => {
    setBones(prev => prev.map(b => {
      if (b.id === selectedBone) {
        return { ...b, [axis]: value };
      }
      return b;
    }));
  };

  const handleResetBones = () => {
    setBones(prev => prev.map(b => ({ ...b, pitch: 0, yaw: 0, roll: 0 })));
    soundManager.playLevelUp();
    alert("🦴 Rig System: Re-centered all bones to default T-Pose angles!");
  };

  return (
    <div className="bg-gray-900/90 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Activity className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Skeletal Rigging Studio</h2>
            <p className="text-[10px] text-gray-400 font-mono">Select character bones, test joint limits, and adjust pitch/yaw/roll rotations</p>
          </div>
        </div>
        <button
          onClick={handleResetBones}
          className="bg-gray-950 hover:bg-gray-850 text-gray-400 hover:text-white border border-gray-800 text-[10px] font-mono px-2 py-1 rounded flex items-center gap-1 transition"
        >
          <RefreshCw size={10} /> Reset T-Pose
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Bone Nodes List */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Bone Hierarchy Nodes</span>
          
          <div className="bg-gray-950 rounded-xl border border-gray-850 p-2 space-y-1 max-h-72 overflow-y-auto font-mono">
            {bones.map(bone => {
              const isSelected = bone.id === selectedBone;
              return (
                <button
                  key={bone.id}
                  onClick={() => {
                    setSelectedBone(bone.id);
                    soundManager.playSpecial();
                  }}
                  className={`w-full p-2 rounded-lg text-left text-[11px] font-bold transition flex items-center justify-between border ${
                    isSelected
                      ? "bg-orange-950/40 border-orange-500 text-orange-400"
                      : "bg-gray-900/40 border-transparent text-gray-400 hover:bg-gray-850"
                  }`}
                  style={{ paddingLeft: bone.parent ? "20px" : "8px" }}
                >
                  <div className="flex items-center gap-1">
                    {bone.parent && <ChevronRight size={10} className="text-gray-600" />}
                    <span>🦴 {bone.name}</span>
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono">
                    ({bone.pitch}°, {bone.yaw}°)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bone rotations modifier */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-850 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-900 pb-1.5">
              <span className="text-[11px] font-mono text-orange-400 uppercase font-bold">🛠️ Selected Node: {activeBone.name}</span>
              <span className="text-[9px] text-gray-500 uppercase font-mono">Bone Index: {activeBone.id}</span>
            </div>

            <div className="space-y-4">
              {/* Pitch Axis */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-gray-300">
                  <span>Pitch (X-Axis Rotate)</span>
                  <span className="text-orange-400 font-bold">{activeBone.pitch}°</span>
                </div>
                <input 
                  type="range" min="-90" max="90" value={activeBone.pitch}
                  onChange={(e) => handleRotationChange("pitch", parseInt(e.target.value))}
                  className="w-full accent-orange-500" 
                />
                <p className="text-[8px] text-gray-500 font-mono">Controls forward and backward bending node angles</p>
              </div>

              {/* Yaw Axis */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-gray-300">
                  <span>Yaw (Y-Axis Rotate)</span>
                  <span className="text-orange-400 font-bold">{activeBone.yaw}°</span>
                </div>
                <input 
                  type="range" min="-90" max="90" value={activeBone.yaw}
                  onChange={(e) => handleRotationChange("yaw", parseInt(e.target.value))}
                  className="w-full accent-orange-500" 
                />
                <p className="text-[8px] text-gray-500 font-mono">Controls sideways head turn and rotation twists</p>
              </div>

              {/* Roll Axis */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-gray-300">
                  <span>Roll (Z-Axis Rotate)</span>
                  <span className="text-orange-400 font-bold">{activeBone.roll}°</span>
                </div>
                <input 
                  type="range" min="-90" max="90" value={activeBone.roll}
                  onChange={(e) => handleRotationChange("roll", parseInt(e.target.value))}
                  className="w-full accent-orange-500" 
                />
                <p className="text-[8px] text-gray-500 font-mono">Controls left-to-right head tilt shoulder rotation</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-950 p-3 rounded-xl border border-gray-850 flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400">Bone Weights Mapping Type:</span>
            <span className="text-emerald-400 font-bold">Dual Quaternion (GPU)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

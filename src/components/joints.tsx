import React, { useState } from "react";
import { Sliders, RefreshCw, Zap, Shield, Key } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export interface JointConstraint {
  id: string;
  name: string;
  minLimit: number;
  maxLimit: number;
  stiffness: number;
  damping: number;
  isLocked: boolean;
}

export default function JointsSystem() {
  const [selectedJoint, setSelectedJoint] = useState<string>("joint_elbow");
  const [constraints, setConstraints] = useState<JointConstraint[]>([
    { id: "joint_neck", name: "Neck Joint Socket", minLimit: -35, maxLimit: 35, stiffness: 450, damping: 25, isLocked: false },
    { id: "joint_shoulder", name: "Shoulder Ball Socket", minLimit: -90, maxLimit: 90, stiffness: 200, damping: 15, isLocked: false },
    { id: "joint_elbow", name: "Elbow Hinge Joint", minLimit: 0, maxLimit: 145, stiffness: 600, damping: 40, isLocked: false },
    { id: "joint_knee", name: "Knee Hinge Joint", minLimit: -140, maxLimit: 0, stiffness: 800, damping: 50, isLocked: false },
    { id: "joint_wrist", name: "Wrist Spherical Joint", minLimit: -45, maxLimit: 45, stiffness: 150, damping: 10, isLocked: false },
  ]);

  const activeJoint = constraints.find(c => c.id === selectedJoint) || constraints[0];

  const handleSliderChange = (field: "minLimit" | "maxLimit" | "stiffness" | "damping", value: number) => {
    setConstraints(prev => prev.map(c => {
      if (c.id === selectedJoint) {
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  const toggleLock = (id: string) => {
    setConstraints(prev => prev.map(c => {
      if (c.id === id) {
        soundManager.playSpecial();
        return { ...c, isLocked: !c.isLocked };
      }
      return c;
    }));
  };

  const handleResetJoints = () => {
    setConstraints(prev => prev.map(c => ({
      ...c,
      minLimit: c.id === "joint_elbow" ? 0 : c.id === "joint_knee" ? -140 : -45,
      maxLimit: c.id === "joint_elbow" ? 145 : c.id === "joint_knee" ? 0 : 45,
      stiffness: 400,
      damping: 20,
      isLocked: false
    })));
    soundManager.playLevelUp();
    alert("🦿 Physics Ragdoll: Restored default joint stiffness & damping constraints!");
  };

  return (
    <div className="bg-gray-900/90 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Key className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Ragdoll Joint Constraints</h2>
            <p className="text-[10px] text-gray-400 font-mono">Tune joint sockets, angular mechanical bounds, spring stiffness, and damping resistance</p>
          </div>
        </div>
        <button
          onClick={handleResetJoints}
          className="bg-gray-950 hover:bg-gray-850 text-gray-400 hover:text-white border border-gray-800 text-[10px] font-mono px-2 py-1 rounded flex items-center gap-1 transition"
        >
          <RefreshCw size={10} /> Reset Joint Constraints
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Joints Directory */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Joint Socket Matrix</span>
          
          <div className="bg-gray-950 rounded-xl border border-gray-850 p-2 space-y-1 font-mono">
            {constraints.map(joint => {
              const isSelected = joint.id === selectedJoint;
              return (
                <button
                  key={joint.id}
                  onClick={() => {
                    setSelectedJoint(joint.id);
                    soundManager.playSpecial();
                  }}
                  className={`w-full p-2 rounded-lg text-left text-[11px] font-bold transition flex items-center justify-between border ${
                    isSelected
                      ? "bg-orange-950/40 border-orange-500 text-orange-400"
                      : "bg-gray-900/40 border-transparent text-gray-400 hover:bg-gray-850"
                  }`}
                >
                  <span>🦾 {joint.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8.5px] bg-gray-900 px-1 rounded text-gray-500 uppercase">
                      {joint.isLocked ? "LOCKED" : "FREE"}
                    </span>
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLock(joint.id);
                      }}
                      className={`w-4 h-4 rounded flex items-center justify-center border text-[8px] font-black cursor-pointer ${
                        joint.isLocked ? "bg-red-600 text-white border-red-400" : "bg-gray-800 text-gray-500 border-gray-700"
                      }`}
                    >
                      🔒
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Physics limits */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-850 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-900 pb-1.5">
              <span className="text-[11px] font-mono text-orange-400 uppercase font-bold">⛓️ Tuning Node: {activeJoint.name}</span>
              <span className="text-[9px] text-gray-500 uppercase font-mono">Socket ID: {activeJoint.id}</span>
            </div>

            {activeJoint.isLocked ? (
              <div className="p-6 bg-red-950/20 border border-red-500/20 rounded-xl text-center space-y-2">
                <p className="text-sm font-bold text-red-400 font-mono uppercase">🔒 Joint Node Locked</p>
                <p className="text-xs text-gray-400 max-w-sm mx-auto font-mono">This joint has been locked at absolute 0° coordinate limits. Unlock it in the socket matrix list to adjust angular constraints.</p>
                <button
                  onClick={() => toggleLock(activeJoint.id)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs uppercase font-mono transition"
                >
                  Unlock Socket
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Min Limit */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-gray-300">
                    <span>Minimum Angle Limit</span>
                    <span className="text-orange-400 font-bold">{activeJoint.minLimit}°</span>
                  </div>
                  <input 
                    type="range" min="-180" max="0" value={activeJoint.minLimit}
                    onChange={(e) => handleSliderChange("minLimit", parseInt(e.target.value))}
                    className="w-full accent-orange-500" 
                  />
                </div>

                {/* Max Limit */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-gray-300">
                    <span>Maximum Angle Limit</span>
                    <span className="text-orange-400 font-bold">{activeJoint.maxLimit}°</span>
                  </div>
                  <input 
                    type="range" min="0" max="180" value={activeJoint.maxLimit}
                    onChange={(e) => handleSliderChange("maxLimit", parseInt(e.target.value))}
                    className="w-full accent-orange-500" 
                  />
                </div>

                {/* Stiffness */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-gray-300">
                    <span>Spring Stiffness Coefficient</span>
                    <span className="text-orange-400 font-bold">{activeJoint.stiffness} N/m</span>
                  </div>
                  <input 
                    type="range" min="50" max="1200" value={activeJoint.stiffness}
                    onChange={(e) => handleSliderChange("stiffness", parseInt(e.target.value))}
                    className="w-full accent-orange-500" 
                  />
                </div>

                {/* Damping */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-gray-300">
                    <span>Joint Damping Resistance</span>
                    <span className="text-orange-400 font-bold">{activeJoint.damping} N·s/m</span>
                  </div>
                  <input 
                    type="range" min="5" max="100" value={activeJoint.damping}
                    onChange={(e) => handleSliderChange("damping", parseInt(e.target.value))}
                    className="w-full accent-orange-500" 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

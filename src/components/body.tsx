import React from "react";
import { BodyPart } from "../types";
import { Activity, ShieldAlert, Heart, HeartOff } from "lucide-react";

interface BodyProps {
  status: 'healthy' | 'sick' | 'injured';
}

interface PartCondition {
  name: BodyPart;
  health: number;
  status: "Normal" | "Fragile" | "Damaged" | "Glitch Sickness";
  color: string;
}

export default function Body({ status }: BodyProps) {
  // Sickness state reduces health of specific body parts
  const sicknessPenalty = status === "sick" ? 45 : status === "injured" ? 30 : 0;

  const parts: PartCondition[] = [
    { name: "Head", health: Math.max(10, 100 - sicknessPenalty), status: status === "sick" ? "Glitch Sickness" : "Normal", color: "bg-orange-500" },
    { name: "Hair", health: 100, status: "Normal", color: "bg-pink-500" },
    { name: "Ears", health: Math.max(20, 100 - sicknessPenalty * 0.5), status: "Normal", color: "bg-teal-500" },
    { name: "Face", health: Math.max(15, 100 - sicknessPenalty * 0.8), status: status === "sick" ? "Glitch Sickness" : "Normal", color: "bg-amber-500" },
    { name: "Body", health: Math.max(10, 100 - sicknessPenalty * 1.2), status: status === "injured" ? "Damaged" : "Normal", color: "bg-red-500" },
    { name: "Clothes", health: Math.max(30, 100 - (status !== "healthy" ? 25 : 0)), status: "Normal", color: "bg-indigo-500" },
    { name: "Legs", health: Math.max(20, 100 - sicknessPenalty * 0.7), status: status === "injured" ? "Damaged" : "Normal", color: "bg-blue-500" },
    { name: "Feet", health: Math.max(40, 100 - (status === "injured" ? 15 : 0)), status: "Normal", color: "bg-emerald-500" },
  ];

  return (
    <div className="bg-gray-950 border border-orange-500/30 p-4 rounded-2xl space-y-4">
      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
        <h3 className="font-heading text-sm text-white flex items-center gap-1.5">
          <Activity className="text-orange-500 animate-pulse" size={16} /> Humanoid Anatomical Integrity
        </h3>
        <span className="text-[10px] text-gray-500 font-mono">Sensory Diagnostics</span>
      </div>

      <div className="space-y-2.5">
        {parts.map(part => (
          <div key={part.name} className="space-y-1 text-xs">
            <div className="flex justify-between items-center text-gray-400 font-mono text-[10px]">
              <span className="font-bold text-white">{part.name} Diagnostics</span>
              <span className="flex items-center gap-1">
                Condition:{" "}
                <b className={part.health < 60 ? "text-red-400" : "text-emerald-400"}>
                  {part.status} ({part.health}%)
                </b>
              </span>
            </div>
            
            <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-800">
              <div
                className={`h-full transition-all duration-300 ${part.color}`}
                style={{ width: `${part.health}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {status !== 'healthy' && (
        <div className="p-2.5 bg-red-950/40 border border-red-500/20 rounded-xl text-[10px] text-red-300 flex items-center gap-2">
          <ShieldAlert size={14} className="text-red-400 animate-bounce" />
          <span><b>Glitch Detected:</b> Consume <b>7-Eleven Medicine</b> to restore all sub-anatomy health pools immediately.</span>
        </div>
      )}
    </div>
  );
}

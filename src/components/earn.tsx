import React, { useState } from "react";
import { Award, CheckCircle, Zap, ShieldAlert, Sparkles } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface EarnProps {
  onEarnAniCash: (amount: number) => void;
}

export default function Earn({ onEarnAniCash }: EarnProps) {
  const [tasks, setTasks] = useState([
    { id: "verify_email", label: "Verify Hyper-Secure Persona Node", reward: 50, done: false, desc: "Double check your virtual network signatures." },
    { id: "complete_tutorial", label: "Inspect Initial Lore Grimoire", reward: 100, done: false, desc: "Familiarize your mental matrix with our systems." },
    { id: "social_share", label: "Cast Beacon Stream into the Void", reward: 150, done: false, desc: "Share Otaku Realms coordinates with your comrade circles." }
  ]);

  const handleClaimTask = (id: string, reward: number) => {
    soundManager.playLevelUp();
    onEarnAniCash(reward);
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, done: true } : t))
    );
    alert(`Reward Claimed: Gained +${reward} Premium AniCash!`);
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <Award className="text-orange-500 animate-pulse" size={20} />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Lore Missions & Claims</h2>
          <p className="text-[10px] text-gray-400 font-mono">Unlock standard celestial accomplishments to harvest AniCash reserves</p>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-gray-950 p-4 rounded-xl border border-gray-850 flex justify-between items-center"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-200 block">{task.label}</span>
              <p className="text-[10px] text-gray-500 font-sans leading-relaxed">{task.desc}</p>
              <div className="flex items-center gap-1.5 text-[9px] text-orange-400 font-mono uppercase mt-1">
                <Sparkles size={10} /> Reward: {task.reward} AniCash
              </div>
            </div>

            <div>
              {task.done ? (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle size={14} /> Done
                </span>
              ) : (
                <button
                  onClick={() => handleClaimTask(task.id, task.reward)}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold uppercase text-[10px] rounded transition flex items-center gap-1"
                >
                  <Zap size={11} /> Claim
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Briefcase, Zap, Timer, CheckCircle, TrendingUp, Cpu } from "lucide-react";
import { soundManager } from "../lib/soundManager";
import { InstanceSettings } from "./worldslist";

interface JobProps {
  onEarnAniCash: (amount: number) => void;
  combatPower: number;
  instanceSettings?: InstanceSettings;
}

export default function Job({ onEarnAniCash, combatPower, instanceSettings }: JobProps) {
  const [activeJob, setActiveJob] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const getPayout = (id: string, defaultVal: number) => {
    if (!instanceSettings) return defaultVal;
    switch (id) {
      case "ramen_shop": return instanceSettings.ramenPayout;
      case "shibuya_security": return instanceSettings.securityPayout;
      case "maid_cafe": return instanceSettings.cafePayout;
      case "isekai_guild": return instanceSettings.guildPayout;
      default: return defaultVal;
    }
  };

  const jobsList = [
    {
      id: "ramen_shop",
      title: "Ramen Ninja Assistant",
      desc: "Prepare standard and legendary broth recipes with rapid slicing speeds.",
      payout: getPayout("ramen_shop", 25),
      duration: 5, // seconds
      requiredPower: 100,
      icon: "🍜"
    },
    {
      id: "shibuya_security",
      title: "Cyber Shibuya Patrol",
      desc: "Enforce law across digital grid borders by subduing rogue system errors.",
      payout: getPayout("shibuya_security", 60),
      duration: 10,
      requiredPower: 300,
      icon: "👮‍♂️"
    },
    {
      id: "maid_cafe",
      title: "Maid Cafe Butler Elite",
      desc: "Cast happiness spells on beverages to guarantee premium guest satisfaction.",
      payout: getPayout("maid_cafe", 120),
      duration: 20,
      requiredPower: 600,
      icon: "☕"
    },
    {
      id: "isekai_guild",
      title: "Isekai Quest Registrar",
      desc: "Classify incoming monster drops and assign danger ratings to adventurers.",
      payout: getPayout("isekai_guild", 250),
      duration: 40,
      requiredPower: 1200,
      icon: "📜"
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeJob) {
      const selected = jobsList.find(j => j.id === activeJob);
      if (!selected) return;

      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            onEarnAniCash(selected.payout);
            setActiveJob(null);
            soundManager.playLevelUp();
            alert(`Job Finished: Earned ${selected.payout} AniCash!`);
            return 0;
          }
          return prev + (100 / selected.duration);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeJob]);

  const handleStartJob = (id: string, reqPower: number) => {
    if (combatPower < reqPower) {
      alert(`Insufficient Combat Power! Requires at least ${reqPower} CP.`);
      return;
    }
    soundManager.playSpecial();
    setActiveJob(id);
    setProgress(0);
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <Briefcase className="text-orange-500 animate-pulse" size={20} />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Cyber Occupational Exchange</h2>
          <p className="text-[10px] text-gray-400 font-mono">Perform missions across Otaku Realms to yield AniCash dividends</p>
        </div>
      </div>

      {activeJob && (
        <div className="bg-gray-950 p-4 rounded-xl border border-orange-500/30 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-orange-400 font-bold uppercase flex items-center gap-1">
              <Timer className="animate-spin text-orange-500" size={12} /> Execution in Progress
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-900 h-2.5 rounded-full overflow-hidden border border-gray-850">
            <div
              className="bg-orange-600 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {jobsList.map((job) => {
          const isPowerEnough = combatPower >= job.requiredPower;
          const isThisActive = activeJob === job.id;

          return (
            <div
              key={job.id}
              className={`bg-gray-950 p-4 rounded-xl border transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                isThisActive ? "border-orange-500" : "border-gray-850 hover:border-gray-800"
              }`}
            >
              <div className="flex gap-3">
                <span className="text-3xl shrink-0">{job.icon}</span>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-gray-200">{job.title}</h3>
                  <p className="text-[10px] text-gray-400 font-sans leading-relaxed max-w-sm">{job.desc}</p>
                  <div className="flex gap-2 text-[9px] text-gray-500 font-mono">
                    <span>Power Req: {job.requiredPower} CP</span>
                    <span>•</span>
                    <span>Duration: {job.duration}s</span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-gray-900 pt-2 sm:pt-0">
                <span className="text-xs font-mono font-bold text-orange-400 flex items-center gap-1">
                  +{job.payout} AC
                </span>
                <button
                  disabled={activeJob !== null || !isPowerEnough}
                  onClick={() => handleStartJob(job.id, job.requiredPower)}
                  className={`mt-1.5 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase transition ${
                    isThisActive
                      ? "bg-orange-850 text-orange-400"
                      : activeJob !== null
                      ? "bg-gray-900 text-gray-600 border border-gray-950"
                      : isPowerEnough
                      ? "bg-orange-600 hover:bg-orange-500 text-white"
                      : "bg-red-950/20 text-red-500 border border-red-500/20"
                  }`}
                >
                  {isThisActive ? "Working..." : isPowerEnough ? "Start Shift" : "Locked"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

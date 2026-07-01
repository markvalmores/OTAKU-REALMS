import React, { useState } from "react";
import { soundManager } from "../lib/soundManager";
import { BookOpen, ShieldCheck, Award, Sparkles, HelpCircle } from "lucide-react";

interface StoryQuest {
  id: string;
  chapter: string;
  title: string;
  description: string;
  progress: string;
  claimed: boolean;
  reward: number;
}

const DEFAULT_QUESTS: StoryQuest[] = [
  { id: "quest_1", chapter: "Chapter I", title: "The 7-Eleven Standard Medicine Delivery", description: "Warp into coordinate (35, 25) to stock up critical energy pills for the anime team.", progress: "Completed", claimed: true, reward: 50 },
  { id: "quest_2", chapter: "Chapter II", title: "The Swamp Exterminator Protocol", description: "Brave the extreme toxic marshland of (45, 45) and eliminate the level 5 slime anomalies.", progress: "In Progress", claimed: false, reward: 150 },
  { id: "quest_3", chapter: "Chapter III", title: "Ascension of Celestial Soul Cells", description: "Achieve Level 10 in any sub-soul attribute via celestial transmuters.", progress: "Locked", claimed: false, reward: 300 }
];

interface StoryProps {
  money: number;
  setMoney: React.Dispatch<React.SetStateAction<number>>;
}

export default function Story({ money, setMoney }: StoryProps) {
  const [quests, setQuests] = useState<StoryQuest[]>(DEFAULT_QUESTS);

  const handleClaim = (quest: StoryQuest) => {
    if (quest.claimed || quest.progress !== "Completed") return;
    soundManager.playLevelUp();
    setMoney(prev => prev + quest.reward);
    setQuests(prev => prev.map(q => q.id === quest.id ? { ...q, claimed: true } : q));
    alert(`🎉 Quest reward collected! Claimed $${quest.reward} gold coins.`);
  };

  return (
    <div className="bg-gray-950 border border-orange-500/30 p-4 rounded-2xl space-y-4">
      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
        <h3 className="font-heading text-sm text-white flex items-center gap-1.5">
          <BookOpen className="text-orange-500" size={16} /> Campaign Chapter Quests
        </h3>
        <span className="text-[10px] text-gray-500 font-mono">Bounty log system</span>
      </div>

      <div className="space-y-3">
        {quests.map(quest => (
          <div key={quest.id} className="p-3 bg-gray-900 rounded-xl border border-gray-800 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8px] font-mono font-bold bg-orange-950/60 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded uppercase">
                  {quest.chapter}
                </span>
                <h4 className="font-bold text-xs text-white mt-1">{quest.title}</h4>
              </div>

              <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                quest.progress === 'Completed' ? 'bg-green-950 text-green-400' :
                quest.progress === 'In Progress' ? 'bg-indigo-950 text-indigo-400 animate-pulse' :
                'bg-gray-950 text-gray-600'
              }`}>
                {quest.progress}
              </span>
            </div>

            <p className="text-[10px] text-gray-400 font-sans leading-relaxed">{quest.description}</p>

            <div className="pt-2 border-t border-gray-800/60 flex justify-between items-center text-[10px] font-mono">
              <span className="text-gray-500">Reward: <b className="text-yellow-400">${quest.reward}</b></span>
              
              {quest.progress === 'Completed' && !quest.claimed && (
                <button
                  onClick={() => handleClaim(quest)}
                  className="px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded font-bold uppercase transition"
                >
                  Claim Coins
                </button>
              )}

              {quest.claimed && (
                <span className="text-emerald-400 font-bold uppercase">Claimed ✓</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

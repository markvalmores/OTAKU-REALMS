import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import ExperienceBar from "./ExperienceBar";
import { StatusEffect, EffectType } from "../types";

interface Stats {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  xp: number;
}

const EFFECT_MODIFIERS: Record<EffectType, Partial<Record<keyof Stats, number>>> = {
  Poisoned: { str: -2, dex: -2 },
  Stunned: { dex: -5, cha: -5 },
  Buffed: { str: 3, con: 3 },
};

export default function CharacterStats({ user, godMode }: { user: User, godMode: boolean }) {
  const [stats, setStats] = useState<Stats>({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, xp: 0 });
  const [effects, setEffects] = useState<StatusEffect[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEffects(prev => prev.filter(e => Date.now() - e.startTime < e.duration * 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const docRef = doc(db, "characterStats", user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Stats;
        setStats({
          str: data.str ?? 10,
          dex: data.dex ?? 10,
          con: data.con ?? 10,
          int: data.int ?? 10,
          wis: data.wis ?? 10,
          cha: data.cha ?? 10,
          xp: data.xp ?? 0,
        });
      }
    });
    return unsubscribe;
  }, [user.uid]);

  const updateStat = async (stat: keyof Stats, value: number) => {
    const newStats = { ...stats, [stat]: value };
    setStats(newStats);
    await setDoc(doc(db, "characterStats", user.uid), newStats);
  };

  const applyEffect = (type: EffectType) => {
    setEffects(prev => [...prev, { id: Math.random().toString(), type, duration: 10, startTime: Date.now() }]);
  };

  const level = Math.floor((stats.xp || 0) / 100) + 1;

  const effectiveStats = { ...stats };
  
  if (godMode) {
    (Object.keys(effectiveStats) as Array<keyof Stats>).forEach(key => {
        if(key !== 'xp') effectiveStats[key] = 99;
    });
  } else {
    effects.forEach(e => {
      const modifiers = EFFECT_MODIFIERS[e.type];
      (Object.keys(modifiers) as Array<keyof Stats>).forEach(stat => {
        effectiveStats[stat] += modifiers[stat] || 0;
      });
    });
  }

  return (
    <section className="bg-gray-900 p-6 rounded-2xl border-2 border-orange-900/50">
      <h2 className="text-2xl font-heading mb-4 text-orange-400">Character Profile (Level {level})</h2>
      <ExperienceBar xp={stats.xp || 0} />
      <div className="flex gap-2 mb-4">
        {(['Poisoned', 'Stunned', 'Buffed'] as EffectType[]).map(type => (
          <button key={type} onClick={() => applyEffect(type)} className="px-3 py-1 bg-gray-700 rounded text-white text-xs">{type}</button>
        ))}
      </div>
      <div className="mb-4 text-orange-300 text-xs flex gap-2">
        {effects.map(e => <span key={e.id}>{e.type}</span>)}
      </div>
      <button 
        onClick={() => updateStat('xp', (stats.xp || 0) + 10)}
        className="mb-6 px-6 py-2 bg-orange-600 rounded-lg text-white font-bold hover:bg-orange-700"
      >
        Gain 10 XP
      </button>
      <div className="grid grid-cols-2 gap-4">
        {(Object.keys(stats) as Array<keyof Stats>).filter(s => s !== 'xp').map((stat) => (
          <div key={stat} className="flex flex-col">
            <label className="text-gray-400 capitalize font-bold text-sm">{stat} ({effectiveStats[stat]})</label>
            <input 
              type="number" 
              value={stats[stat]} 
              onChange={(e) => updateStat(stat, parseInt(e.target.value) || 0)}
              className="p-3 bg-gray-800 rounded-lg border-2 border-gray-700 focus:border-orange-500 text-white"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

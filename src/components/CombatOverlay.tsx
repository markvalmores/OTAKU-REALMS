import { useState, useEffect } from 'react';
import { Sword, Zap, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { soundManager } from '../lib/soundManager';

export default function CombatOverlay({ enemyName, onEndCombat }: { enemyName: string, onEndCombat: (victory: boolean) => void }) {
  const [hp, setHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [combo, setCombo] = useState(0);
  const [isDodging, setIsDodging] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    soundManager.startCombatMusic();
    return () => soundManager.stopCombatMusic();
  }, []);

  useEffect(() => {
    if (hp <= 0) onEndCombat(false);
    if (enemyHp <= 0) onEndCombat(true);

    const interval = setInterval(() => {
      if (!isDodging) {
        setHp(prev => {
            const next = Math.max(0, prev - Math.floor(Math.random() * 5));
            if (next !== prev) soundManager.playHit();
            return next;
        });
      }
    }, 1000); 
    return () => clearInterval(interval);
  }, [hp, enemyHp, isDodging, onEndCombat]);

  const handleAttack = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 100);
    soundManager.playHit();
    const damage = Math.floor(Math.random() * 10) + 5 + (combo * 2);
    setEnemyHp(prev => Math.max(0, prev - damage));
    setCombo(prev => prev + 1);
  };

  const handleDodge = () => {
    setIsDodging(true);
    soundManager.playDodge();
    setTimeout(() => setIsDodging(false), 500); 
  };

  const handleSpecial = () => {
    if (combo >= 5) {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
      soundManager.playSpecial();
      setEnemyHp(prev => Math.max(0, prev - 30));
      setCombo(0);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center p-6 z-[100]">
      {flash && <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} className="absolute inset-0 bg-white pointer-events-none" />}
      <motion.h2 animate={{ scale: [0.9, 1.1, 1] }} className="text-4xl font-heading text-red-500 mb-10">COMBAT: {enemyName.toUpperCase()}</motion.h2>
      <div className="flex gap-20 text-white text-2xl font-bold">
        <motion.div animate={{ scale: hp < 30 ? [1, 1.2, 1] : 1 }} className={`text-center ${isDodging ? 'text-blue-400' : ''}`}>Player HP: {hp}</motion.div>
        <motion.div animate={{ scale: enemyHp < 30 ? [1, 1.2, 1] : 1 }} className="text-center">Enemy HP: {enemyHp}</motion.div>
      </div>
      <div className="mt-4 text-orange-400 text-lg">Combo: {combo}x {isDodging && '(DODGING)'}</div>
      <div className="flex gap-4 mt-10">
        <button onClick={handleAttack} className="p-6 bg-red-600 rounded-full hover:bg-red-700 text-white font-bold text-xl flex items-center gap-2 transition"><Sword /> Attack</button>
        <button onClick={handleDodge} className="p-6 bg-blue-600 rounded-full hover:bg-blue-700 text-white font-bold text-xl flex items-center gap-2 transition"><Shield /> Dodge</button>
        <button onClick={handleSpecial} disabled={combo < 5} className={`p-6 rounded-full text-white font-bold text-xl flex items-center gap-2 transition ${combo >= 5 ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-800 opacity-50'}`}><Zap /> Limit Break (5x)</button>
      </div>
    </motion.div>
  );
}

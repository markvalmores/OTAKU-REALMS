import React, { useState } from "react";
import { Sparkles, Check, Flame, ShieldAlert, Award } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface ClothesProps {
  onEquipOutfit?: (name: string) => void;
  equippedOutfit?: string;
}

export default function Clothes({ onEquipOutfit, equippedOutfit = "Standard Student Uniform" }: ClothesProps) {
  const [outfits, setOutfits] = useState([
    { name: "Standard Student Uniform", category: "Casual", bonus: "None", unlocked: true, icon: "🏫" },
    { name: "Akihabara Cyber Overcoat", category: "Cyberpunk", bonus: "+5% Combat Power Boost", unlocked: false, cost: 300, icon: "🧥" },
    { name: "Kyoto Ronin Haori", category: "Vintage Samurai", bonus: "+10% Slime Coin Gain", unlocked: false, cost: 600, icon: "👘" },
    { name: "Celestial Archmage Robes", category: "Ethereal Elite", bonus: "+15% Exp Rate and Title Glow", unlocked: false, cost: 1200, icon: "🧙‍♀️" }
  ]);

  const [money, setMoney] = useState(1500); // Local money representation for buying if needed, or pass it in. We'll handle local simulation state.

  const handleBuyOutfit = (index: number) => {
    const outfit = outfits[index];
    if (outfit.cost && money >= outfit.cost) {
      soundManager.playLevelUp();
      setMoney(prev => prev - outfit.cost!);
      const updated = [...outfits];
      updated[index].unlocked = true;
      setOutfits(updated);
      alert(`Success: Purchased and unlocked the ${outfit.name}!`);
    } else {
      alert("Insufficient funds to buy this custom garment.");
    }
  };

  const handleEquip = (name: string) => {
    soundManager.playSpecial();
    if (onEquipOutfit) {
      onEquipOutfit(name);
    } else {
      alert(`Equipped outfit: ${name}`);
    }
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Award className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Cyber Wardrobe & Apparel</h2>
            <p className="text-[10px] text-gray-400 font-mono">Customize active apparel, equip bonuses, and browse premium haoris</p>
          </div>
        </div>
        <div className="bg-gray-950 px-2.5 py-1 rounded-lg border border-gray-800 text-[10px] font-mono text-gray-300">
          Wardrobe Cash: <span className="text-orange-400 font-bold">{money} AC</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {outfits.map((outfit, i) => {
          const isEquipped = equippedOutfit === outfit.name;

          return (
            <div
              key={i}
              className={`bg-gray-950 p-4 rounded-xl border flex flex-col justify-between ${
                isEquipped ? "border-orange-500 shadow-lg" : "border-gray-850 hover:border-gray-800"
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2.5">
                    <span className="text-3xl shrink-0">{outfit.icon}</span>
                    <div>
                      <h3 className="text-xs font-bold text-gray-200">{outfit.name}</h3>
                      <span className="text-[9px] font-mono text-gray-500 uppercase">{outfit.category}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/60 p-2.5 rounded-lg text-[10px] font-mono text-orange-300/90 border border-gray-850 flex items-center gap-1.5">
                  <Flame size={12} className="text-orange-500 shrink-0" />
                  <span>Bonus: {outfit.bonus}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-900 flex justify-between items-center mt-3">
                {outfit.unlocked ? (
                  isEquipped ? (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1">
                      <Check size={11} /> Equipped ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => handleEquip(outfit.name)}
                      className="px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded text-[10px] font-mono font-bold uppercase transition"
                    >
                      Equip Outfit
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => handleBuyOutfit(i)}
                    className="w-full py-1.5 bg-gray-800 hover:bg-gray-700 text-orange-400 border border-orange-500/20 rounded text-[10px] font-mono font-bold uppercase transition flex items-center justify-center gap-1"
                  >
                    Unlock for {outfit.cost} AC
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

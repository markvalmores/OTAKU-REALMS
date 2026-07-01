import React, { useState } from "react";
import { Sparkles, Check, DollarSign, Smartphone, ShieldCheck, Star } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface OtakuPlusProps {
  onSelectPayment: (method: "gcash" | "paypal", amount: number, tierName: string) => void;
  isAlreadySubscribed: boolean;
  aniCash: number;
  onBuyWithAniCash: (amount: number, tierName: string) => void;
}

export default function OtakuPlus({ onSelectPayment, isAlreadySubscribed, aniCash, onBuyWithAniCash }: OtakuPlusProps) {
  const tiers = [
    {
      name: "Weekly Otaku+ Pass",
      price: 149, // PHP
      duration: "7 Days",
      color: "border-blue-500/30",
      bg: "bg-blue-950/10",
      textColor: "text-blue-400",
      perks: ["Double coin drops from slimes", "Access to Akihabara Neon", "Weekly bonus gift of 200 Coins", "Light blue server title"]
    },
    {
      name: "Celestial VIP Monthly",
      price: 499, // PHP
      duration: "30 Days",
      color: "border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.15)] animate-pulse",
      bg: "bg-orange-950/10",
      textColor: "text-orange-400",
      perks: ["Weekly perks plus 1.5x Combat Power", "Access to Kyoto Fantasy & Isekai Forest", "Monthly bonus gift of 1000 Coins", "Golden VIP Server Badge", "Exclusive custom avatar frames"]
    },
    {
      name: "Shinigami Lifetime Key",
      price: 1999, // PHP
      duration: "Infinite",
      color: "border-purple-500/30",
      bg: "bg-purple-950/10",
      textColor: "text-purple-400",
      perks: ["Permanent 2.0x coins drop multiplier", "Access to ALL dimensional warp portals", "Gift of 5000 Coins instantly", "Dark purple Legendary Title", "Developer level system control privileges"]
    }
  ];

  const handleAniCashPurchase = () => {
    if (aniCash < 1000000) {
      alert(`Insufficient AniCash! You need 1,000,000 AniCash to purchase. (You have ${aniCash.toLocaleString()} AC)`);
      return;
    }
    soundManager.playLevelUp();
    onBuyWithAniCash(1000000, "Celestial VIP Monthly (AniCash)");
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="text-orange-500 animate-spin" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Otaku+ Premium VIP Core</h2>
            <p className="text-[10px] text-gray-400 font-mono">Unlock exclusive celestial dimensional domains and combat perks</p>
          </div>
        </div>
        <div className="bg-gray-950 px-3 py-1 rounded-xl border border-orange-500/30 text-[10px] font-mono text-orange-400 font-bold">
          Your Wallet: {aniCash.toLocaleString()} AC
        </div>
      </div>

      {isAlreadySubscribed && (
        <div className="bg-emerald-950/30 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3">
          <ShieldCheck className="text-emerald-400 shrink-0" size={18} />
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-emerald-400 font-mono uppercase">Premium Privileges Active</h3>
            <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
              You are currently enjoying Otaku+ VIP privileges. All experience, currency drops, and premium dimensions have been unlocked. Go to the "VIP Subscribed" tab to claim your daily rewards.
            </p>
          </div>
        </div>
      )}

      {/* Dynamic AniCash VIP Buy Banner */}
      <div className="bg-gradient-to-r from-orange-950/60 via-amber-950/30 to-gray-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-600 text-black text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded font-mono">AniCash Special Offer</span>
            <span className="text-xs text-amber-400 font-bold font-mono">VIP Celestial Month</span>
          </div>
          <p className="text-sm font-black text-white font-mono uppercase">Buy Otaku+ VIP with AniCash</p>
          <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
            Use your hard-earned grinding dividends. Purchase 1 Full Month of VIP level upgrades instantly!
          </p>
        </div>

        <div className="text-center sm:text-right shrink-0 space-y-2">
          <div className="font-mono">
            <span className="text-2xl font-black text-amber-400">1,000,000</span> <span className="text-xs text-gray-400">AC</span>
          </div>
          <button
            onClick={handleAniCashPurchase}
            className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold uppercase font-mono text-[10px] rounded-xl transition duration-150 tracking-wider shadow-lg"
          >
            Exchange AniCash VIP
          </button>
        </div>
      </div>

      {/* Privilege grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier, i) => (
          <div
            key={i}
            className={`border rounded-2xl p-4 flex flex-col justify-between ${tier.color} ${tier.bg} space-y-4`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className={`text-xs font-extrabold uppercase font-mono ${tier.textColor}`}>{tier.name}</span>
                <span className="text-[9px] font-mono bg-gray-950 px-2 py-0.5 rounded border border-gray-800 text-gray-400 uppercase font-bold">{tier.duration}</span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-white">₱{tier.price}</span>
                <span className="text-[10px] text-gray-500 font-mono">PHP</span>
              </div>

              <div className="border-t border-gray-800/60 pt-3 space-y-2">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Benefits</span>
                <ul className="space-y-1.5">
                  {tier.perks.map((perk, j) => (
                    <li key={j} className="text-[10px] text-gray-300 flex items-start gap-1.5 font-sans leading-tight">
                      <Check size={11} className={`${tier.textColor} shrink-0 mt-0.5`} />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-950">
              <span className="text-[9px] font-mono text-gray-500 uppercase block text-center">Capture Checkout Channel</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    soundManager.playSpecial();
                    onSelectPayment("gcash", tier.price, tier.name);
                  }}
                  className="py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-mono font-bold uppercase transition flex items-center justify-center gap-1"
                >
                  <Smartphone size={10} /> GCash
                </button>
                <button
                  onClick={() => {
                    soundManager.playSpecial();
                    onSelectPayment("paypal", tier.price, tier.name);
                  }}
                  className="py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-[10px] font-mono font-bold uppercase transition flex items-center justify-center gap-1"
                >
                  <DollarSign size={10} /> PayPal
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Coins, ArrowDownUp, ShieldCheck, Sparkles, AlertTriangle, ArrowRight } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface AniCashProps {
  money: number;
  onAddMoney: (amount: number) => void;
  onSpendMoney: (amount: number) => boolean;
}

export default function AniCash({ money, onAddMoney, onSpendMoney }: AniCashProps) {
  const [exchangeAmount, setExchangeAmount] = useState("100");
  const [exchangeType, setExchangeType] = useState<"coins_to_anicash" | "anicash_to_coins">("coins_to_anicash");
  const [aniCashBalance, setAniCashBalance] = useState(1000); // Simulated separate Premium AniCash

  const handleExchange = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(exchangeAmount);
    if (isNaN(amount) || amount <= 0) return;

    soundManager.playSpecial();

    if (exchangeType === "coins_to_anicash") {
      // 10 Coins = 1 AniCash
      const requiredCoins = amount * 10;
      if (onSpendMoney(requiredCoins)) {
        setAniCashBalance(prev => prev + amount);
        soundManager.playLevelUp();
        alert(`Successfully exchanged ${requiredCoins} Celestial Coins for ${amount} AniCash!`);
      } else {
        alert("Insufficient Celestial Coins balance for this exchange.");
      }
    } else {
      // 1 AniCash = 8 Coins
      if (aniCashBalance >= amount) {
        setAniCashBalance(prev => prev - amount);
        onAddMoney(amount * 8);
        soundManager.playLevelUp();
        alert(`Successfully exchanged ${amount} AniCash for ${amount * 8} Celestial Coins!`);
      } else {
        alert("Insufficient AniCash premium balance for this exchange.");
      }
    }
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <Coins className="text-orange-500 animate-pulse" size={20} />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">AniCash Wallet Ledger</h2>
          <p className="text-[10px] text-gray-400 font-mono">Convert standard drops to premium virtual currency</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
          <span className="text-[10px] text-gray-500 font-mono uppercase">Celestial Coins</span>
          <span className="text-xl font-bold font-mono text-amber-500">{money} <span className="text-xs text-gray-400">c</span></span>
        </div>
        <div className="bg-gray-950 p-4 rounded-xl border border-orange-500/20 flex flex-col justify-between">
          <span className="text-[10px] text-orange-400 font-mono uppercase flex items-center gap-1">
            <Sparkles size={10} className="animate-spin text-orange-500" /> Premium AniCash
          </span>
          <span className="text-xl font-bold font-mono text-orange-400">{aniCashBalance} <span className="text-xs text-gray-400">AC</span></span>
        </div>
      </div>

      {/* Exchange Form */}
      <form onSubmit={handleExchange} className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-gray-400 uppercase">Currency Exchange Node</span>
          <button
            type="button"
            onClick={() => {
              setExchangeType(prev => prev === "coins_to_anicash" ? "anicash_to_coins" : "coins_to_anicash");
              soundManager.playSpecial();
            }}
            className="text-[10px] bg-gray-900 hover:bg-orange-600/25 border border-gray-800 text-orange-400 rounded-lg px-2 py-1 font-mono flex items-center gap-1 transition"
          >
            <ArrowDownUp size={11} /> Switch Path
          </button>
        </div>

        <div className="bg-gray-900 p-3 rounded-lg border border-gray-850 text-center font-mono text-[11px] text-gray-400">
          {exchangeType === "coins_to_anicash" ? (
            <span>Exchange Rate: <strong className="text-amber-500">10 Coins</strong> = <strong className="text-orange-400">1 AniCash</strong></span>
          ) : (
            <span>Exchange Rate: <strong className="text-orange-400">1 AniCash</strong> = <strong className="text-amber-500">8 Coins</strong></span>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 uppercase font-mono block">AniCash Amount to Trade</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={exchangeAmount}
              onChange={(e) => setExchangeAmount(e.target.value)}
              className="flex-grow p-2 bg-gray-900 border border-gray-850 rounded text-xs font-mono text-white focus:outline-none focus:border-orange-500/50"
            />
            <button
              type="submit"
              className="px-4 bg-orange-600 hover:bg-orange-500 text-white rounded font-mono font-bold text-xs uppercase transition flex items-center gap-1"
            >
              Convert <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </form>

      <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800 flex items-start gap-2.5">
        <ShieldCheck className="text-emerald-400 shrink-0" size={16} />
        <p className="text-[10px] text-gray-500 leading-relaxed font-mono">
          All financial transfers are fully sandboxed. Rates are adjusted dynamically in synchronization with our central server mainframe.
        </p>
      </div>
    </div>
  );
}

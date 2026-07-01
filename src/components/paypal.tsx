import React, { useState } from "react";
import { CreditCard, DollarSign, ShieldAlert, Check, ArrowRight, Lock } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface PayPalProps {
  price: number;
  itemName: string;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

export default function PayPal({ price, itemName, onPaymentSuccess, onCancel }: PayPalProps) {
  const [step, setStep] = useState<"login" | "authorize" | "success">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [refNum] = useState("PAY-" + Math.floor(Math.random() * 90000000 + 10000000));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      alert("Invalid Sandbox Email address.");
      return;
    }
    soundManager.playSpecial();
    setStep("authorize");
  };

  const handleAuthorization = () => {
    setIsProcessing(true);
    soundManager.playSpecial();

    setTimeout(() => {
      setIsProcessing(false);
      setStep("success");
      soundManager.playLevelUp();
    }, 1800);
  };

  const completeCheckout = () => {
    onPaymentSuccess();
  };

  const usdAmount = (price / 58).toFixed(2); // Convert PHP to simulated USD

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl border-2 border-yellow-500/50 shadow-2xl max-w-md mx-auto space-y-6 font-sans">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="animate-pulse text-yellow-500" size={24} />
          <div>
            <h2 className="text-lg font-extrabold uppercase tracking-tight text-white flex items-center gap-1.5">
              PayPal <span className="text-xs bg-yellow-600/30 text-yellow-500 px-1.5 py-0.5 rounded uppercase font-bold font-mono">Sandbox</span>
            </h2>
            <p className="text-[10px] text-gray-400 font-mono">Express checkout secure payment gateway</p>
          </div>
        </div>
        <button onClick={onCancel} className="text-xs text-gray-400 hover:text-white font-mono bg-gray-800 px-2.5 py-1 rounded">
          Cancel
        </button>
      </div>

      {step === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800/60 space-y-2">
            <div className="flex justify-between text-xs font-mono text-gray-400">
              <span>Item: {itemName}</span>
              <span>USD Conversion</span>
            </div>
            <div className="text-2xl font-black font-mono text-yellow-500">${usdAmount} USD</div>
            <span className="text-[9px] text-gray-500 font-mono block">Converted from ₱{price}.00 PHP (1 USD = 58 PHP)</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">PayPal Sandbox Email</label>
              <input
                type="email"
                placeholder="e.g. buyer@sandbox-otaku.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-gray-950 border border-gray-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-yellow-500"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Sandbox Password</label>
              <input
                type="password"
                placeholder="● ● ● ● ● ● ● ●"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 bg-gray-950 border border-gray-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-yellow-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-xl font-bold uppercase text-xs tracking-wider transition flex items-center justify-center gap-1"
          >
            Log In to Sandbox <ArrowRight size={14} />
          </button>
        </form>
      )}

      {step === "authorize" && (
        <div className="space-y-4 text-center">
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Logged in as <span className="font-bold text-white font-mono">{email}</span>. Please authorize standard sandbox funds to process the VIP transaction.
          </p>

          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800/60 space-y-2.5 text-left">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400">Preferred Card:</span>
              <span className="text-white font-bold">Simulated Visa (•••• 4321)</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400">Billing Address:</span>
              <span className="text-white">Otaku Realms Cyber, Tokyo</span>
            </div>
            <div className="flex justify-between text-xs font-mono border-t border-gray-800 pt-2 text-yellow-500 font-extrabold">
              <span>Total Charge:</span>
              <span>${usdAmount} USD</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { soundManager.playSpecial(); setStep("login"); }}
              className="py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-mono uppercase font-bold transition"
            >
              Back
            </button>
            <button
              onClick={handleAuthorization}
              disabled={isProcessing}
              className="py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-lg text-xs font-mono uppercase font-bold transition flex items-center justify-center gap-1"
            >
              <Lock size={12} /> {isProcessing ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="space-y-5 text-center font-mono">
          <div className="mx-auto h-12 w-12 rounded-full bg-yellow-600/20 flex items-center justify-center border-2 border-yellow-500">
            <Check size={24} className="text-yellow-500" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold uppercase tracking-wide text-yellow-500">Authorization Approved</h3>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Sandbox transaction of ${usdAmount} USD executed and captured successfully.
            </p>
          </div>

          <div className="bg-gray-950 p-4 rounded-xl text-left text-xs space-y-1.5 border border-gray-800/80">
            <div><span className="text-gray-500">Merchant:</span> Otaku Realms VIP Store</div>
            <div><span className="text-gray-500">Item:</span> {itemName}</div>
            <div><span className="text-gray-500">Ref No:</span> {refNum}</div>
            <div><span className="text-gray-500">Capture Code:</span> APPROVED_CODE_200</div>
          </div>

          <button
            onClick={completeCheckout}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-xl font-extrabold uppercase text-xs tracking-wider transition"
          >
            Launch Celestial Realms
          </button>
        </div>
      )}

      <div className="flex justify-center items-center gap-1 text-[10px] font-mono text-gray-500">
        <ShieldAlert size={10} className="text-yellow-600 animate-pulse" /> Official Sandbox Simulated Payment Protocol
      </div>
    </div>
  );
}

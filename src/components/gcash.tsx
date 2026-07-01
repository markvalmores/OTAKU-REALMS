import React, { useState, useEffect } from "react";
import { Smartphone, Check, HelpCircle, Shield, ArrowRight, Lock } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface GCashProps {
  price: number;
  itemName: string;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

export default function GCash({ price, itemName, onPaymentSuccess, onCancel }: GCashProps) {
  const [step, setStep] = useState<"phone" | "otp" | "mpin" | "success">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [mpin, setMpin] = useState("");
  const [timer, setTimer] = useState(60);
  const [isProcessing, setIsProcessing] = useState(false);
  const [refNum] = useState("GCS-" + Math.floor(Math.random() * 90000000 + 10000000));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.startsWith("09") || phone.length !== 11) {
      alert("Invalid GCash Mobile Number. Must be 11 digits starting with 09.");
      return;
    }
    soundManager.playSpecial();
    setStep("otp");
    setTimer(60);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      alert("OTP must be 6 digits.");
      return;
    }
    soundManager.playSpecial();
    setStep("mpin");
  };

  const handleMpinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mpin.length !== 4) {
      alert("MPIN must be 4 digits.");
      return;
    }
    setIsProcessing(true);
    soundManager.playSpecial();

    setTimeout(() => {
      setIsProcessing(false);
      setStep("success");
      soundManager.playLevelUp();
    }, 2000);
  };

  const completeCheckout = () => {
    onPaymentSuccess();
  };

  return (
    <div className="bg-blue-600/90 text-white p-6 rounded-2xl border-2 border-blue-400 shadow-2xl max-w-md mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-blue-500 pb-4">
        <div className="flex items-center gap-2">
          <Smartphone className="animate-bounce text-white" size={24} />
          <div>
            <h2 className="text-lg font-extrabold uppercase tracking-tight font-sans text-white">GCash Express</h2>
            <p className="text-[10px] text-blue-100 font-mono">Simulated Mobile Wallet Checkout Portal</p>
          </div>
        </div>
        <button onClick={onCancel} className="text-xs text-blue-100 hover:text-white font-mono bg-blue-700/50 px-2.5 py-1 rounded">
          Cancel
        </button>
      </div>

      {/* Progress Line */}
      <div className="flex justify-between items-center text-[10px] font-mono text-blue-200">
        <span className={step === "phone" ? "text-white font-bold underline" : ""}>1. Phone</span>
        <span>→</span>
        <span className={step === "otp" ? "text-white font-bold underline" : ""}>2. OTP</span>
        <span>→</span>
        <span className={step === "mpin" ? "text-white font-bold underline" : ""}>3. MPIN</span>
        <span>→</span>
        <span className={step === "success" ? "text-white font-bold underline" : ""}>4. Receipt</span>
      </div>

      {step === "phone" && (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div className="bg-blue-700 p-4 rounded-xl space-y-2">
            <div className="flex justify-between text-xs font-mono text-blue-100">
              <span>Item: {itemName}</span>
              <span>Amount Due</span>
            </div>
            <div className="text-2xl font-black font-mono">₱{price}.00 PHP</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-blue-100 uppercase tracking-wider block">GCash Mobile Number</label>
            <input
              type="text"
              placeholder="e.g. 09123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
              className="w-full p-3 bg-blue-700 border border-blue-500 rounded-xl font-mono text-base text-white focus:outline-none placeholder-blue-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white hover:bg-blue-50 text-blue-600 rounded-xl font-bold uppercase text-xs tracking-wider transition flex items-center justify-center gap-1"
          >
            Next <ArrowRight size={14} />
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <p className="text-xs text-blue-100 font-sans leading-relaxed">
            A 6-digit authentication code has been dispatched to <span className="font-bold text-white">{phone}</span>. Please enter the verification OTP to proceed.
          </p>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter 6-Digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full p-3 bg-blue-700 border border-blue-500 rounded-xl font-mono text-center text-lg tracking-widest text-white focus:outline-none"
              required
            />
            <div className="text-center text-xs font-mono text-blue-200">
              Resend OTP in {timer}s
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white hover:bg-blue-50 text-blue-600 rounded-xl font-bold uppercase text-xs tracking-wider transition"
          >
            Submit OTP
          </button>
        </form>
      )}

      {step === "mpin" && (
        <form onSubmit={handleMpinSubmit} className="space-y-4">
          <div className="text-center space-y-1">
            <Lock className="mx-auto text-white animate-pulse" size={20} />
            <p className="text-xs text-blue-100 font-sans leading-relaxed">
              Enter your 4-digit GCash MPIN secure authorization key.
            </p>
          </div>

          <input
            type="password"
            placeholder="● ● ● ●"
            value={mpin}
            onChange={(e) => setMpin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            className="w-full p-3 bg-blue-700 border border-blue-500 rounded-xl font-mono text-center text-xl tracking-widest text-white focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 bg-white hover:bg-blue-50 text-blue-600 rounded-xl font-bold uppercase text-xs tracking-wider transition"
          >
            {isProcessing ? "Authorizing Funds..." : `Pay ₱${price}.00 PHP`}
          </button>
        </form>
      )}

      {step === "success" && (
        <div className="space-y-5 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-700 flex items-center justify-center border-2 border-white">
            <Check size={24} className="text-white" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold uppercase tracking-wide">Transaction Successful</h3>
            <p className="text-xs text-blue-100 font-sans leading-relaxed">
              ₱{price}.00 PHP successfully authorized from your GCash wallet balance.
            </p>
          </div>

          <div className="bg-blue-750 p-4 rounded-xl text-left text-xs font-mono space-y-1.5 border border-blue-500">
            <div><span className="text-blue-200">Merchant:</span> Otaku Realms VIP Store</div>
            <div><span className="text-blue-200">Item:</span> {itemName}</div>
            <div><span className="text-blue-200">Ref No:</span> {refNum}</div>
            <div><span className="text-blue-200">Date:</span> {new Date().toLocaleString()}</div>
          </div>

          <button
            onClick={completeCheckout}
            className="w-full py-3 bg-white hover:bg-blue-50 text-blue-600 rounded-xl font-extrabold uppercase text-xs tracking-wider transition"
          >
            Return to Launcher Menu
          </button>
        </div>
      )}

      <div className="flex justify-center items-center gap-1 text-[10px] font-mono text-blue-200">
        <Shield size={10} /> Fully Encrypted SSL Security Channel
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { register } from "../lib/auth";
import { soundManager } from "../lib/soundManager";
import { Mail, KeyRound, Sparkles, UserPlus } from "lucide-react";

interface RegisterProps {
  onSuccess: (user: any) => void;
  onNavigateLogin: () => void;
}

export default function Register({ onSuccess, onNavigateLogin }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      soundManager.playHit();
      return;
    }

    setIsLoading(true);
    soundManager.playSpecial();

    try {
      const userCredential = await register(email, password);
      soundManager.playLevelUp();
      alert("🎉 Account created successfully! Let's prepare your custom anime avatar.");
      onSuccess(userCredential.user);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to register account.");
      soundManager.playHit();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] uppercase font-mono tracking-wider text-orange-400">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="otaku@realms.com"
            className="w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-orange-500/20 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase font-mono tracking-wider text-orange-400">Password</label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters"
            className="w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-orange-500/20 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase font-mono tracking-wider text-orange-400">Confirm Password</label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            className="w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-orange-500/20 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition"
            required
          />
        </div>
      </div>

      {error && (
        <div className="p-2.5 bg-red-950/40 border border-red-500/30 rounded-lg text-xs text-red-400 font-mono">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg border border-indigo-500/30 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? "CREATING GAME FILE..." : "CREATE USER IDENTIFIER"} <Sparkles size={14} />
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onNavigateLogin}
          className="text-xs text-orange-400 hover:underline"
        >
          Already have an account? Login here
        </button>
      </div>
    </form>
  );
}

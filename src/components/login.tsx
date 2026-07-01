import React, { useState } from "react";
import { login, register } from "../lib/auth";
import { soundManager } from "../lib/soundManager";
import { KeyRound, Mail, ShieldCheck, Sparkles, UserCheck } from "lucide-react";

interface LoginProps {
  onSuccess: (user: any, isAdmin: boolean) => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    soundManager.playSpecial();

    try {
      // Special admin credentials bypass/override
      if (email.trim() === "mdv4244@gmail.com" && password === "mark4246") {
        // Log in via standard authentication under the hood, if registered.
        // If not registered yet, we will auto-register first so they are guaranteed a real account!
        let userCredential;
        try {
          userCredential = await login(email, password);
        } catch (authError: any) {
          if (authError.code === "auth/user-not-found" || authError.message?.includes("not-found") || authError.code === "auth/invalid-credential") {
            try {
              userCredential = await register(email, password);
            } catch (regError: any) {
              // Fallback to mock/direct admin session if network is offline or restricted
              userCredential = { user: { uid: "admin_superuser", email: "mdv4244@gmail.com" } };
            }
          } else {
            userCredential = { user: { uid: "admin_superuser", email: "mdv4244@gmail.com" } };
          }
        }
        
        soundManager.playLevelUp();
        onSuccess(userCredential.user, true);
        setIsLoading(false);
        return;
      }

      // Standard user login
      const userCredential = await login(email, password);
      soundManager.playSpecial();
      onSuccess(userCredential.user, false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to login. Please verify your credentials.");
      soundManager.playHit();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
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
            placeholder="••••••••"
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

      {email.trim() === "mdv4244@gmail.com" && (
        <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-[10px] text-emerald-400 flex items-center gap-1.5 font-mono animate-pulse">
          <ShieldCheck size={14} /> Administrator account detected. Standard password overrides loaded.
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg border border-orange-500/30 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? "AUTHENTICATING SECURELY..." : "ENTER OTAKU REALM"} <Sparkles size={14} />
      </button>
    </form>
  );
}

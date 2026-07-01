import React from "react";
import { User as FirebaseUser } from "firebase/auth";
import { ShieldAlert, UserCheck, Calendar, Trophy, Zap } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface UserProps {
  user: FirebaseUser;
  isAdmin: boolean;
  onUpgradeToAdmin?: () => void;
  onGiftOtakuPlus?: (userId: string) => void;
}

export default function User({ user, isAdmin, onUpgradeToAdmin, onGiftOtakuPlus }: UserProps) {
  const accountCreated = user.metadata.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : "July 2026";

  const handleAdminTestGift = () => {
    soundManager.playLevelUp();
    if (onGiftOtakuPlus) {
      onGiftOtakuPlus(user.uid);
    }
  };

  return (
    <div className="bg-gray-950 border border-indigo-500/20 rounded-2xl p-4 text-xs font-mono space-y-3">
      <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
          <UserCheck size={14} className="text-indigo-400" /> Account Identity
        </span>
        <span className="text-gray-500 text-[10px]">ID: {user.uid.slice(0, 8)}...</span>
      </div>

      <div className="space-y-1 text-gray-300">
        <div>Registered Email: <b className="text-white">{user.email}</b></div>
        <div className="flex items-center gap-1">
          Role Permission:{" "}
          {isAdmin ? (
            <span className="text-red-400 bg-red-950/40 px-2 py-0.5 rounded font-extrabold border border-red-500/30 flex items-center gap-1 text-[9px] uppercase animate-pulse">
              <ShieldAlert size={12} /> System Super Admin
            </span>
          ) : (
            <span className="text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded font-bold text-[9px] uppercase">
              Regular Player
            </span>
          )}
        </div>
      </div>

      <div className="bg-gray-900/60 p-2.5 rounded-xl border border-gray-800 flex justify-between items-center text-[10px] text-gray-400">
        <span className="flex items-center gap-1"><Calendar size={12} /> Joined: {accountCreated}</span>
        <span className="flex items-center gap-1"><Trophy size={12} /> Rank: Elite Novice</span>
      </div>

      {/* Admin Specific Action Controls (Visible only to the admin or when simulate mode is on) */}
      {isAdmin && (
        <div className="bg-red-950/20 border-2 border-red-500/30 p-3 rounded-xl space-y-2 animate-pulse">
          <div className="text-[10px] text-red-400 font-extrabold uppercase tracking-wide flex items-center gap-1">
            <ShieldAlert size={14} /> Admin Command Shell
          </div>
          <p className="text-[10px] text-gray-400">You have absolute administrator control over Otaku Realms database state.</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAdminTestGift}
              className="px-2 py-1.5 bg-red-800 hover:bg-red-700 text-white rounded text-[9px] font-bold uppercase transition"
            >
              🎁 Gift Otaku+ Sub
            </button>
            <button
              onClick={() => {
                soundManager.playSpecial();
                alert("💰 Admin Order Accepted: Simulating $49.99 Payment of Otaku Realms Premium Expansion pack...");
              }}
              className="px-2 py-1.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded text-[9px] font-bold uppercase transition"
            >
              💳 Process Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

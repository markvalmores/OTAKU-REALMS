import React, { useState } from "react";
import { Users, Gift, Share2, Check, Copy, Award, ArrowRight } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface InviteProps {
  onAddMoney?: (amount: number) => void;
}

export default function Invite({ onAddMoney }: InviteProps) {
  const [referralCode, setReferralCode] = useState("OTAKU-" + Math.floor(Math.random() * 900000 + 100000));
  const [copied, setCopied] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralStatus, setReferralStatus] = useState<string | null>(null);

  // Simulated invited friends
  const [friends, setFriends] = useState([
    { name: "Saitama_99", level: 42, status: "Active", rewardClaimed: true },
    { name: "Asuka_Langley", level: 12, status: "Active", rewardClaimed: false },
    { name: "Kirito_Beater", level: 5, status: "Incomplete", rewardClaimed: false },
  ]);

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    soundManager.playSpecial();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredCode.trim()) return;
    setIsSubmitting(true);
    soundManager.playSpecial();

    setTimeout(() => {
      setIsSubmitting(false);
      if (enteredCode.toUpperCase().startsWith("OTAKU-")) {
        setReferralStatus("Success! Code applied. Gifted 500 Coins to you and your referrer.");
        if (onAddMoney) onAddMoney(500);
        soundManager.playLevelUp();
      } else {
        setReferralStatus("Error: Invalid or expired referral code format.");
      }
    }, 1200);
  };

  const claimReward = (index: number) => {
    const updated = [...friends];
    updated[index].rewardClaimed = true;
    setFriends(updated);
    if (onAddMoney) onAddMoney(200);
    soundManager.playLevelUp();
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <Users className="text-orange-500 animate-pulse" size={20} />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Invite & Referral Alliance</h2>
          <p className="text-[10px] text-gray-400 font-mono">Recruit otaku comrades and share celestial bounty rewards</p>
        </div>
      </div>

      {/* Share Section */}
      <div className="bg-gray-950 p-4 rounded-xl border border-gray-800/60 space-y-3">
        <h3 className="text-xs font-bold text-gray-300 font-mono uppercase flex items-center gap-1.5">
          <Share2 size={13} className="text-orange-400" /> Your Alliance Referral Code
        </h3>
        <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
          Share your referral code with your friends. Once they enter your code on their launcher, both of you will receive <span className="text-orange-400 font-bold">500 Celestial Coins</span> instantly!
        </p>
        <div className="flex gap-2">
          <div className="flex-grow bg-gray-900 border border-orange-500/30 px-3 py-2 rounded-lg font-mono text-xs text-orange-300 font-extrabold flex justify-between items-center">
            <span>{referralCode}</span>
            <span className="text-[10px] text-gray-500 uppercase">LVL 1 Rank</span>
          </div>
          <button
            onClick={copyCode}
            className="px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold text-xs font-mono uppercase flex items-center gap-1.5 transition"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Apply Section */}
      <form onSubmit={handleApplyCode} className="space-y-3">
        <h3 className="text-xs font-bold text-gray-300 font-mono uppercase flex items-center gap-1.5">
          <Gift size={13} className="text-orange-400" /> Enter Comrade Referral Code
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. OTAKU-583021"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
            disabled={isSubmitting}
            className="flex-grow p-2.5 bg-gray-950 rounded-lg border border-gray-800 text-xs font-mono focus:border-orange-500/50 focus:outline-none text-white"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 bg-gray-800 border border-gray-700 hover:border-orange-500/40 text-gray-200 rounded-lg font-bold text-xs uppercase flex items-center gap-1 transition"
          >
            {isSubmitting ? "Linking..." : <ArrowRight size={14} />}
          </button>
        </div>
        {referralStatus && (
          <p className={`text-[10px] font-mono ${referralStatus.startsWith("Success") ? "text-emerald-400" : "text-rose-400"}`}>
            {referralStatus}
          </p>
        )}
      </form>

      {/* Referral Status Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-300 font-mono uppercase flex items-center gap-1.5">
          <Award size={13} className="text-orange-400" /> Comrade Signups & Milestones
        </h3>
        <div className="bg-gray-950 rounded-xl border border-gray-800/60 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800 text-[10px] uppercase font-mono text-gray-400">
                <th className="p-2.5">User</th>
                <th className="p-2.5">Progress</th>
                <th className="p-2.5 text-right">Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 font-mono">
              {friends.map((friend, i) => (
                <tr key={i} className="hover:bg-gray-900/40">
                  <td className="p-2.5">
                    <span className="font-bold text-gray-200 block">{friend.name}</span>
                    <span className="text-[10px] text-gray-500">Status: {friend.status}</span>
                  </td>
                  <td className="p-2.5">
                    <span className="text-orange-400 font-bold">LVL {friend.level}</span>
                  </td>
                  <td className="p-2.5 text-right">
                    {friend.rewardClaimed ? (
                      <span className="text-emerald-500 text-[10px] font-bold">Claimed ✓</span>
                    ) : friend.level >= 10 ? (
                      <button
                        onClick={() => claimReward(i)}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9px] uppercase font-bold"
                      >
                        Claim 200c
                      </button>
                    ) : (
                      <span className="text-gray-500 text-[9px] italic">Reaches Lvl 10</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

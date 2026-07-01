import React, { useState } from "react";
import { MessageSquare, Send, Bell, Filter, Award, Sparkles } from "lucide-react";
import { soundManager } from "../lib/soundManager";

interface ChatProps {
  userEmail?: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  channel: "global" | "trade" | "clan" | "system";
  timestamp: string;
  isVIP?: boolean;
}

export default function Chats({ userEmail = "Otaku" }: ChatProps) {
  const [activeChannel, setActiveChannel] = useState<"global" | "trade" | "clan" | "system">("global");
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "Admin_Megumi", text: "Welcome to Otaku Realms Server 3! Double XP Weekend is active!", channel: "system", timestamp: "11:00 AM", isVIP: true },
    { id: "2", sender: "Saitama_99", text: "Anyone down to raid the Level 15 Dungeon in Shibuya?", channel: "global", timestamp: "11:15 AM", isVIP: false },
    { id: "3", sender: "Asuka_Langley", text: "WTS [Muramasa Katana +5] for 1200 Coins. DM me immediately!", channel: "trade", timestamp: "11:20 AM", isVIP: true },
    { id: "4", sender: "Kirito_Beater", text: "Clan mission starts in 10 minutes, gather at the shrine gate.", channel: "clan", timestamp: "11:28 AM", isVIP: true }
  ]);

  const [activeUsers] = useState([
    { name: "Admin_Megumi", isOnline: true, badge: "Developer" },
    { name: "Asuka_Langley", isOnline: true, badge: "Otaku+" },
    { name: "Saitama_99", isOnline: true, badge: "Hero" },
    { name: "Kirito_Beater", isOnline: true, badge: "Solo" }
  ]);

  const channels = [
    { id: "global", label: "🌍 Global Chat" },
    { id: "trade", label: "⚖️ Trade Market" },
    { id: "clan", label: "🏰 Clan Alliance" },
    { id: "system", label: "🚨 System Logs" }
  ] as const;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: userEmail.split("@")[0],
      text: inputText,
      channel: activeChannel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVIP: userEmail.includes("gmail.com") // Simulate VIP if verified or staff
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText("");
    soundManager.playSpecial();
  };

  const selectPresetText = (preset: string) => {
    setInputText(preset);
    soundManager.playSpecial();
  };

  const filteredMessages = messages.filter(msg => msg.channel === activeChannel);

  const quickPresets = [
    "Looking for party!",
    "Need backup in battle!",
    "Lvl 5 Slimes are spawning here!",
    "Selling rare gems!",
    "Hail the legendary sword!"
  ];

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Tactical Chat Hub</h2>
            <p className="text-[10px] text-gray-400 font-mono">Coordinate with virtual comrades across all server lines</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { soundManager.playSpecial(); alert("Notifications muted/unmuted"); }} className="p-1.5 bg-gray-950 border border-gray-800 hover:border-orange-500/30 text-gray-400 hover:text-white rounded-lg transition">
            <Bell size={13} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Left column: Channel selection list */}
        <div className="md:col-span-1 space-y-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Communication Sectors</span>
          <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-1.5 md:pb-0">
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => { setActiveChannel(ch.id); soundManager.playSpecial(); }}
                className={`flex-grow md:flex-grow-0 px-3 py-2 rounded-xl text-left text-xs font-bold font-mono transition whitespace-nowrap ${
                  activeChannel === ch.id ? "bg-orange-600 text-white shadow-lg" : "bg-gray-950 text-gray-400 hover:bg-gray-850"
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>

          {/* Active online comrades */}
          <div className="hidden md:block pt-3 border-t border-gray-800/60 space-y-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Sector Comrades</span>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {activeUsers.map((usr, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-950 p-2 rounded-lg border border-gray-800/40">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-bold text-gray-300 font-mono">{usr.name}</span>
                  </div>
                  <span className="text-[8px] px-1 bg-orange-950 text-orange-400 font-bold uppercase rounded font-mono border border-orange-500/10">
                    {usr.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Active chat dialog box */}
        <div className="md:col-span-3 space-y-3 flex flex-col justify-between">
          <div className="bg-black/80 rounded-xl border border-gray-800 p-3 h-64 overflow-y-auto space-y-2.5 flex flex-col">
            {filteredMessages.length === 0 ? (
              <div className="text-center text-gray-500 text-xs font-mono my-auto">
                No communications detected in this channel sector.
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div key={msg.id} className="text-xs space-y-0.5 leading-relaxed">
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <div className="flex items-center gap-1">
                      {msg.isVIP && <Sparkles size={10} className="text-orange-400 animate-spin" />}
                      <span className={`font-bold ${msg.isVIP ? "text-orange-400" : "text-gray-300"}`}>{msg.sender}</span>
                      {msg.isVIP && <span className="text-[8px] bg-orange-900 text-orange-400 px-1 rounded uppercase font-bold">VIP</span>}
                    </div>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="p-2 bg-gray-900/50 rounded border border-gray-900 font-sans text-gray-200">
                    {msg.text}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-gray-500 uppercase">Acoustic Presets</span>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {quickPresets.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectPresetText(preset)}
                  className="px-2.5 py-1 bg-gray-950 border border-gray-800 hover:border-orange-500/20 text-gray-400 hover:text-white rounded-lg text-[10px] font-mono whitespace-nowrap transition"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Message input box */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder={`Send message to #${activeChannel} sector...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow p-2.5 bg-gray-950 rounded-xl border border-gray-800 text-xs focus:border-orange-500/50 focus:outline-none text-white"
            />
            <button
              type="submit"
              className="px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-1 transition"
            >
              <Send size={12} />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

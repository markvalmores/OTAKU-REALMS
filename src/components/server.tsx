import React, { useState, useEffect } from "react";
import { Server, Activity, ShieldCheck, RefreshCw, Radio } from "lucide-react";
import { soundManager } from "../lib/soundManager";

export default function GameServer() {
  const [activeServer, setActiveServer] = useState("kyoto_mainframe");
  const [servers, setServers] = useState([
    { id: "philippines_local", region: "Asia SE (Manila)", name: "Philippines Local Core", ping: 15, load: "Low", status: "Online" },
    { id: "kyoto_mainframe", region: "Asia East (Tokyo)", name: "Kyoto Mainframe Core", ping: 42, load: "Medium", status: "Online" },
    { id: "shibuya_backup", region: "Asia East (Shibuya)", name: "Shibuya Cyber Backup", ping: 25, load: "Low", status: "Online" },
    { id: "akihabara_sandbox", region: "Asia East (Akihabara)", name: "Akihabara Neon Sandbox", ping: 55, load: "Full", status: "Online" },
    { id: "na_west_shigen", region: "NA West (Oregon)", name: "Isekai West Gateway", ping: 185, load: "Low", status: "Online" },
    { id: "eu_north_shigen", region: "EU North (Stockholm)", name: "Soul Society Europe Node", ping: 240, load: "Empty", status: "Maintenance" }
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Periodically fluctuate latency pings slightly to look realistic
    const interval = setInterval(() => {
      setServers(prev =>
        prev.map(srv => {
          if (srv.status === "Maintenance") return srv;
          const fluctuation = Math.floor(Math.random() * 15) - 7;
          const basePing = srv.id === "philippines_local" ? 12 : srv.id === "kyoto_mainframe" ? 40 : srv.id === "shibuya_backup" ? 22 : srv.id === "akihabara_sandbox" ? 50 : 180;
          return {
            ...srv,
            ping: Math.max(10, basePing + fluctuation)
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const selectServer = (id: string, name: string) => {
    setActiveServer(id);
    soundManager.playLevelUp();
    alert(`Connected successfully to sector: ${name}`);
  };

  const forcePingRefresh = () => {
    setIsRefreshing(true);
    soundManager.playSpecial();
    setTimeout(() => {
      setIsRefreshing(false);
      soundManager.playLevelUp();
    }, 1200);
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Server className="text-orange-500 animate-pulse" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Celestial Game Shards</h2>
            <p className="text-[10px] text-gray-400 font-mono">Calibrate active connection regions and analyze server latency</p>
          </div>
        </div>
        <button
          onClick={forcePingRefresh}
          disabled={isRefreshing}
          className="p-1.5 bg-gray-950 border border-gray-800 hover:border-orange-500/30 text-gray-400 hover:text-white rounded-lg transition"
        >
          <RefreshCw size={13} className={isRefreshing ? "animate-spin text-orange-500" : ""} />
        </button>
      </div>

      <div className="space-y-2.5">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Available Server Nodes</span>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {servers.map((srv) => {
            const isConnected = activeServer === srv.id;
            const pingColor =
              srv.ping < 50 ? "text-emerald-400" :
              srv.ping < 120 ? "text-yellow-400" :
              "text-rose-500";

            return (
              <div
                key={srv.id}
                className={`bg-gray-950 p-3 rounded-xl border transition ${
                  isConnected ? "border-orange-600 shadow-md" : "border-gray-800 hover:border-gray-700"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-gray-200">{srv.name}</span>
                      <span className="text-[8px] bg-gray-900 text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold font-mono">
                        {srv.region}
                      </span>
                    </div>
                    <div className="flex gap-2 text-[10px] text-gray-500 font-mono mt-1">
                      <span>Load: <span className="text-gray-300 font-bold">{srv.load}</span></span>
                      <span>•</span>
                      <span>State: <span className={srv.status === "Online" ? "text-emerald-400 font-bold" : "text-rose-400"}>{srv.status}</span></span>
                    </div>
                  </div>

                  <div className="text-right space-y-1.5 font-mono text-xs">
                    {srv.status === "Maintenance" ? (
                      <span className="text-[10px] text-rose-500 uppercase font-bold">Offline</span>
                    ) : (
                      <span className={`font-bold ${pingColor}`}>{srv.ping} ms</span>
                    )}

                    <div>
                      {isConnected ? (
                        <span className="text-[10px] text-orange-400 font-bold uppercase">Connected</span>
                      ) : (
                        srv.status !== "Maintenance" && (
                          <button
                            onClick={() => selectServer(srv.id, srv.name)}
                            className="px-2.5 py-1 bg-gray-800 border border-gray-700 hover:border-orange-500/30 text-gray-200 rounded text-[9px] uppercase font-bold"
                          >
                            Connect
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800/60 flex items-center gap-3">
        <ShieldCheck className="text-emerald-400 shrink-0" size={16} />
        <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
          Anti-DDOS proxy shield is fully operational. Any suspicious payload injection will be routed to a honey-pot sandbox node.
        </p>
      </div>
    </div>
  );
}

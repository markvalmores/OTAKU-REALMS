import { useState, useEffect } from 'react';

export default function MiniMap() {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  // Mock movement to simulate player exploration
  useEffect(() => {
    const interval = setInterval(() => {
      setPos(p => ({
        x: Math.max(10, Math.min(90, p.x + (Math.random() - 0.5) * 5)),
        y: Math.max(10, Math.min(90, p.y + (Math.random() - 0.5) * 5))
      }));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-4 left-4 w-32 h-32 bg-gray-950/70 rounded-full border-2 border-orange-500/50 overflow-hidden backdrop-blur-sm">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Radar Grid */}
        <circle cx="50" cy="50" r="45" stroke="#f97316" strokeWidth="0.5" fill="none" strokeDasharray="4 4" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#f97316" strokeWidth="0.5" strokeOpacity="0.3" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#f97316" strokeWidth="0.5" strokeOpacity="0.3" />
        {/* Radar Sweep */}
        <path d="M 50 50 L 50 5 A 45 45 0 0 1 95 50 Z" fill="#f97316" fillOpacity="0.15" className="animate-spin" style={{ transformOrigin: '50px 50px', animationDuration: '4s' }} />
        {/* Player Dot */}
        <circle cx={pos.x} cy={pos.y} r="3" fill="#f97316" />
      </svg>
    </div>
  );
}

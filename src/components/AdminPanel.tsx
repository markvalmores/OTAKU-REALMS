import { useState } from 'react';
import { Shield, Zap } from 'lucide-react';

export default function AdminPanel({ godMode, setGodMode }: { godMode: boolean, setGodMode: (v: boolean) => void }) {
  return (
    <section className="bg-gray-900 p-6 rounded-2xl border-2 border-red-900/50">
      <h2 className="text-xl font-heading mb-4 text-red-400 flex items-center gap-2">
        <Shield className="text-red-400" />
        Admin Panel
      </h2>
      <div className="flex items-center justify-between text-white">
        <span>Infinite Powers (God Mode)</span>
        <button 
          onClick={() => setGodMode(!godMode)} 
          className={`px-4 py-2 rounded-lg ${godMode ? 'bg-red-600' : 'bg-gray-700'}`}
        >
          {godMode ? <Zap /> : 'OFF'}
        </button>
      </div>
    </section>
  );
}

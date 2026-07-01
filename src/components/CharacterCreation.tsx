import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from 'firebase/auth';

export default function CharacterCreation({ user, onComplete }: { user: User, onComplete: () => void }) {
  const [name, setName] = useState("");
  const [charClass, setCharClass] = useState("Warrior");

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Please enter a character name");
      return;
    }
    try {
      await setDoc(doc(db, "characterStats", user.uid), {
        name,
        charClass,
        str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, xp: 0
      });
      onComplete();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
      <div className="bg-gray-900 p-8 rounded-2xl border-2 border-orange-500 w-full max-w-md">
        <h2 className="text-2xl font-heading mb-6 text-orange-400">Character Creation</h2>
        <input type="text" placeholder="Character Name" className="w-full p-3 mb-4 bg-gray-800 rounded border border-gray-700 text-white" value={name} onChange={(e) => setName(e.target.value)} />
        <select className="w-full p-3 mb-6 bg-gray-800 rounded border border-gray-700 text-white" value={charClass} onChange={(e) => setCharClass(e.target.value)}>
          <option>Warrior</option>
          <option>Mage</option>
          <option>Rogue</option>
        </select>
        <button onClick={handleCreate} className="w-full p-3 bg-orange-600 rounded font-semibold text-white hover:bg-orange-700">Begin Journey</button>
      </div>
    </div>
  );
}

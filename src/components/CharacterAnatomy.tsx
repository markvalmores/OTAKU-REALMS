import { useState } from 'react';
import { BodyPart } from '../types';
import { Activity } from 'lucide-react';

const ALL_PARTS: BodyPart[] = ['Head', 'Hair', 'Ears', 'Face', 'Body', 'Clothes', 'Hands', 'Wrist', 'Shoulder', 'Elbow', 'Feet', 'Foot', 'Legs', 'Knee', 'Fingers', 'Palm', 'Bones', 'Ligaments'];

export default function CharacterAnatomy() {
  const [anatomy, setAnatomy] = useState<Record<string, number>>(
    ALL_PARTS.reduce((acc, part) => ({ ...acc, [part]: 100 }), {})
  );

  return (
    <section className="bg-gray-900 p-6 rounded-2xl border-2 border-orange-900/50">
      <h2 className="text-xl font-heading mb-4 text-orange-400 flex items-center gap-2">
        <Activity className="text-orange-400" />
        Character Anatomy
      </h2>
      <div className="grid grid-cols-3 gap-2 text-xs">
        {ALL_PARTS.map(part => (
          <div key={part} className="p-2 bg-gray-800 rounded border border-gray-700 flex justify-between">
            <span className="text-gray-300">{part}</span>
            <span className={anatomy[part] > 50 ? 'text-green-500' : 'text-red-500'}>{anatomy[part]}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}

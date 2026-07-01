import { useState } from 'react';
import { User, RefreshCw } from 'lucide-react';

const AVATARS = ['/avatar1.png', '/avatar2.png', '/avatar3.png'];

export default function AvatarSystem() {
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [allowCloning, setAllowCloning] = useState(true);

  return (
    <section className="bg-gray-900 p-6 rounded-2xl border-2 border-orange-900/50">
      <h2 className="text-xl font-heading mb-4 text-orange-400 flex items-center gap-2">
        <User className="text-orange-400" />
        Avatar System
      </h2>
      <div className="flex gap-2 mb-4">
        {AVATARS.map((a) => (
          <button key={a} onClick={() => setSelectedAvatar(a)} className={`p-2 rounded-lg ${selectedAvatar === a ? 'border-2 border-orange-500' : 'border-2 border-gray-700'}`}>
            <img src={a} alt="Avatar" className="w-12 h-12 object-cover rounded" />
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between text-white">
        <span>Allow Avatar Cloning</span>
        <button onClick={() => setAllowCloning(!allowCloning)} className={`px-4 py-2 rounded-lg ${allowCloning ? 'bg-orange-600' : 'bg-gray-700'}`}>
          {allowCloning ? 'ON' : 'OFF'}
        </button>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, setDoc, getDocs, updateDoc, increment } from "firebase/firestore";
import { db } from "../lib/firebase";
import { MapPin, Users, Plus } from "lucide-react";

interface World {
  id: string;
  name: string;
  description: string;
  playerCount: number;
  maxPlayers: number;
}

const INITIAL_WORLDS = [
  { id: 'forest', name: 'Forest', description: 'Lush, ancient woodland, vibrant green canopy, whispering trees, realistic birdsong, serene environment.', playerCount: 0, maxPlayers: 111 },
  { id: 'city', name: 'Cyberpunk City', description: 'Neon-drenched metropolis, towering skyscrapers with holographic advertisements, bustling streets, flying cars.', playerCount: 0, maxPlayers: 111 },
  { id: 'tokyo', name: 'Tokyo Japan', description: 'Traditional meets modern, Shibuya crossing with crowds, cherry blossoms near temples, street food.', playerCount: 0, maxPlayers: 111 }
];

export default function WorldList({ onJoinWorld }: { onJoinWorld: (worldId: string) => void }) {
  const [worlds, setWorlds] = useState<World[]>([]);

  useEffect(() => {
    // Seed initial worlds if not exist
    const seedWorlds = async () => {
      const querySnapshot = await getDocs(collection(db, "worlds"));
      if (querySnapshot.empty) {
        for (const world of INITIAL_WORLDS) {
          await setDoc(doc(db, "worlds", world.id), world);
        }
      }
    };
    seedWorlds();

    const unsubscribe = onSnapshot(collection(db, "worlds"), (snapshot) => {
      const wList: World[] = [];
      snapshot.forEach((doc) => {
        wList.push({ id: doc.id, ...doc.data() } as World);
      });
      setWorlds(wList);
    });
    return unsubscribe;
  }, []);

  const handleJoinWorld = async (worldId: string) => {
    await updateDoc(doc(db, "worlds", worldId), {
      playerCount: increment(1)
    });
    onJoinWorld(worldId);
  };

  return (
    <section className="bg-gray-900 p-6 rounded-2xl border-2 border-orange-900/50">
      <h2 className="text-2xl font-heading mb-6 text-orange-400 flex items-center gap-2">
        <MapPin className="text-orange-400" />
        World Hopping
      </h2>
      <div className="space-y-4">
        {worlds.map((world) => (
          <div key={world.id} className="p-4 bg-gray-800 rounded-lg border-2 border-gray-700 flex justify-between items-center hover:border-orange-500">
            <div>
              <h3 className="text-white font-bold text-lg">{world.name}</h3>
              <p className="text-gray-400 text-sm">{world.description}</p>
              <div className="flex items-center text-orange-300 text-xs mt-2">
                <Users size={14} className="mr-1" />
                {world.playerCount} / {world.maxPlayers} players
              </div>
            </div>
            <button 
              onClick={() => handleJoinWorld(world.id)}
              disabled={world.playerCount >= world.maxPlayers}
              className="px-4 py-2 bg-orange-600 rounded-lg text-white font-bold disabled:bg-gray-600"
            >
              Portal
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

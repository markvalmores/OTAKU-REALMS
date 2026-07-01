/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import heroImage from './assets/images/start_screen_character_1782926684637.jpg';
import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, addDoc, onSnapshot, query, doc, getDoc } from "firebase/firestore";
import { auth, db } from "./lib/firebase";
import { WorldObject, PlayerStats } from "./types";
import { login, register, logout } from "./lib/auth";
import { Sword, MapPin, Plus } from "lucide-react";
import Inventory from "./components/Inventory";
import CharacterStats from "./components/CharacterStats";
import QuestLog from "./components/QuestLog";
import MiniMap from "./components/MiniMap";
import WorldList from "./components/WorldList";
import Chat from "./components/Chat";
import AvatarSystem from "./components/AvatarSystem";
import MicrophoneSystem from "./components/MicrophoneSystem";
import CharacterCreation from "./components/CharacterCreation";
import AdminPanel from "./components/AdminPanel";
import CharacterAnatomy from "./components/CharacterAnatomy";
import CombatOverlay from "./components/CombatOverlay";
import Leaderboard from "./components/Leaderboard";
import ShopModal from "./components/ShopModal";
import NotificationBanner from "./components/NotificationBanner";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const isAdmin = user?.email && ["mdv4244@gmail.com", "zerozone757@gmail.com", "usagyuuunquan@gmail.com"].includes(user.email);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [viewMode, setViewMode] = useState<'first' | 'second' | 'third'>('third');
  const [currentWorldId, setCurrentWorldId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [worldObjects, setWorldObjects] = useState<WorldObject[]>([]);
  const [newObjectName, setNewObjectName] = useState("");
  const [hasCharacter, setHasCharacter] = useState(false);
  const [godMode, setGodMode] = useState(false);
  const [gameMode, setGameMode] = useState<'Story' | 'FreeRoam'>('FreeRoam');
  const [activeCombat, setActiveCombat] = useState<string | null>(null);
  const [stats, setStats] = useState<PlayerStats>({
    hp: 100, maxHp: 100, status: 'healthy', inventory: { food: 0, medicine: 0 }, money: 100, isOtakuPlus: false
  });
  const [showShop, setShowShop] = useState(false);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'first' ? 'second' : prev === 'second' ? 'third' : 'first');
  };

  const startCombat = (enemyName: string) => {
    setActiveCombat(enemyName);
  };

  const endCombat = (victory: boolean) => {
    setActiveCombat(null);
    if (!victory) alert("You were defeated!");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "characterStats", currentUser.uid);
        const docSnap = await getDoc(docRef);
        setHasCharacter(docSnap.exists());
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user && currentWorldId) {
      const q = query(collection(db, "worlds", currentWorldId, "objects"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const objects: WorldObject[] = [];
        snapshot.forEach((doc) => {
          objects.push({ id: doc.id, ...doc.data() } as WorldObject);
        });
        setWorldObjects(objects);
      });
      return unsubscribe;
    } else {
      setWorldObjects([]);
    }
  }, [user, currentWorldId]);

  const handleAddObject = async () => {
    if (newObjectName && currentWorldId) {
      await addDoc(collection(db, "worlds", currentWorldId, "objects"), {
        name: newObjectName,
        type: "generic",
      });
      setNewObjectName("");
    }
  };

  if (showStartScreen) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center text-white p-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <iframe
            src="https://www.youtube.com/embed/zQGQLEE1nQs?autoplay=1&loop=1&mute=1&playlist=zQGQLEE1nQs&controls=0&showinfo=0&autohide=1&modestbranding=1&fs=0&disablekb=1&iv_load_policy=3"
            className="w-full h-full object-cover"
            style={{ minWidth: '100vw', minHeight: '100vh' }}
            allow="autoplay; encrypted-media"
            title="Background Video"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center bg-gray-950/50 p-10 rounded-3xl backdrop-blur-sm border-2 border-orange-500/30">
          <img src={heroImage} alt="Hero" className="mb-8 rounded-2xl shadow-2xl w-64 h-64 object-cover border-4 border-orange-500" />
          <h1 className="text-6xl font-heading text-orange-500 mb-8">Otaku Realms</h1>
          <p className="text-gray-400 text-sm mb-6 max-w-sm text-center">Notification Update Version: 0 Demo Version - I am trying to make this work for now and see if people play it.</p>
          <button 
            onClick={() => setShowStartScreen(false)}
            className="px-10 py-4 bg-orange-600 rounded-full text-2xl font-bold hover:bg-orange-700 transition"
          >
            Enter Virtual Realms
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
        <div className="bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800 w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-white">Otaku Realms</h1>
          <input type="email" placeholder="Email" className="w-full p-3 mb-4 bg-gray-800 rounded border border-gray-700" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-3 mb-6 bg-gray-800 rounded border border-gray-700" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={() => login(email, password)} className="w-full p-3 mb-2 bg-indigo-600 rounded font-semibold text-white hover:bg-indigo-700">Login</button>
          <button onClick={() => register(email, password)} className="w-full p-3 bg-gray-700 rounded font-semibold text-white hover:bg-gray-600">Register</button>
        </div>
      </div>
    );
  }

  if (!hasCharacter) {
    return <CharacterCreation user={user} onComplete={() => setHasCharacter(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 font-sans">
      <NotificationBanner />
      {activeCombat && <CombatOverlay enemyName={activeCombat} onEndCombat={endCombat} />}
      <header className="flex justify-between items-center mb-10 border-b-4 border-orange-600 pb-6">
        <h1 className="text-5xl font-heading text-orange-500 flex items-center gap-3">
          <Sword className="text-white" />
          Otaku Realms
        </h1>
        <div className="flex gap-4 items-center">
          <select value={gameMode} onChange={(e) => setGameMode(e.target.value as 'Story' | 'FreeRoam')} className="bg-gray-800 text-white p-2 rounded">
            <option>Story</option>
            <option>FreeRoam</option>
          </select>
          <button 
            onClick={toggleViewMode}
            className="px-6 py-2 rounded-lg font-bold bg-orange-600 text-white"
          >
            Camera: {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
          </button>
          <button onClick={logout} className="text-gray-400 hover:text-white font-bold">Logout</button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-black rounded-2xl border-4 border-orange-900/50 flex items-center justify-center min-h-[50vh] lg:min-h-[70vh]">
          <p className="text-orange-500 font-heading text-4xl">Immersive {viewMode} Person View</p>
          <MiniMap />
        </section>

        <div className="space-y-8">
          {isAdmin && <AdminPanel godMode={godMode} setGodMode={setGodMode} />}
          <AvatarSystem />
          <MicrophoneSystem />
          <CharacterAnatomy />
          <Leaderboard />
          <CharacterStats user={user} godMode={godMode} />
          <QuestLog user={user} />
          <WorldList onJoinWorld={setCurrentWorldId} />
          {currentWorldId && <Chat worldId={currentWorldId} user={user} />}
          <Inventory user={user} />
          <section className="bg-gray-900 p-6 rounded-2xl border-2 border-orange-900/50">
            <h2 className="text-xl font-heading mb-4 text-orange-400 flex items-center gap-2">
              <MapPin className="text-orange-400" />
              World Objects
            </h2>
            <div className="flex gap-2 mb-4">
              <input type="text" placeholder="Object name" className="flex-grow p-3 bg-gray-800 rounded-lg border-2 border-gray-700 text-white" value={newObjectName} onChange={(e) => setNewObjectName(e.target.value)} />
              <button onClick={handleAddObject} className="p-3 bg-orange-600 rounded-lg text-white font-bold"><Plus /></button>
            </div>
            <ul className="space-y-2">
              {worldObjects.map((obj) => (
                <li key={obj.id} className="p-3 bg-gray-800 rounded-lg border-2 border-gray-700 text-white flex justify-between items-center">
                  <span>{obj.name} <span className="text-xs text-gray-400">({obj.type})</span></span>
                  <div className="flex gap-1">
                    {obj.type === 'container' && <button onClick={() => alert(`Opening ${obj.name}`)} className="px-2 py-1 bg-blue-600 rounded text-xs">Open</button>}
                    {obj.type === 'item' && <button onClick={() => alert(`Picking up ${obj.name}`)} className="px-2 py-1 bg-green-600 rounded text-xs">Pick up</button>}
                    {obj.isHostile && <button onClick={() => startCombat(obj.name)} className="px-2 py-1 bg-red-600 rounded text-xs">Fight</button>}
                    <button onClick={() => alert(`Inspecting ${obj.name}`)} className="px-2 py-1 bg-gray-600 rounded text-xs">Inspect</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}


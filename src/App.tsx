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
import { soundManager } from "./lib/soundManager";
import { Sword, MapPin, Plus, Home, Radio, HelpCircle } from "lucide-react";
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
import GameViewport from "./components/GameViewport";

// New modular custom components imports
import Login from "./components/login";
import Register from "./components/register";
import Player from "./components/player";
import UserPanel from "./components/user";
import Worlds from "./components/worlds";
import Characters from "./components/characters";
import Body from "./components/body";
import Soul from "./components/soul";
import Settings from "./components/settings";
import Maps from "./components/maps";
import Menu from "./components/menu";
import HomeMenu from "./components/homemenu";
import VFX from "./components/vfx";
import SFX from "./components/sfx";
import Soundtrack from "./components/soundtrack";
import Ground from "./components/ground";
import Gravity from "./components/gravity";
import Story from "./components/story";
import FreeRoam from "./components/freeroam";
import VRMSystem from "./components/vrm";
import GLBSystem from "./components/glb";
import StagesSystem from "./components/stages";

// Grouped new modular components
import Invite from "./components/invite";
import Portal from "./components/portal";
import VoiceMic from "./components/mic";
import Chats from "./components/chats";
import Community from "./components/community";
import OtakuPlus from "./components/otakuplus";
import GCash from "./components/gcash";
import PayPal from "./components/paypal";
import Subscribed from "./components/subscribed";
import Follow from "./components/follow";
import Ranking from "./components/ranking";
import Top from "./components/top";
import GameServer from "./components/server";
import Names from "./components/names";
import AniCash from "./components/anicash";
import Job from "./components/job";
import Earn from "./components/earn";
import Grind from "./components/grind";
import Pity from "./components/pity";
import Gacha from "./components/gacha";
import Clothes from "./components/clothes";
import PremiumChara from "./components/premiumchara";
import GachaChara from "./components/gachachara";
import GachaMechanic from "./components/gachamechanic";
import CharacterList from "./components/characterlist";
import WorldsList from "./components/worldslist";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminOverride, setIsAdminOverride] = useState(false);
  const isAdmin = (user?.email && ["mdv4244@gmail.com", "zerozone757@gmail.com", "usagyuuunquan@gmail.com"].includes(user.email)) || isAdminOverride;
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [viewMode, setViewMode] = useState<'first' | 'second' | 'third'>('third');
  const [currentWorldId, setCurrentWorldId] = useState<string | null>(null);
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
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });

  // Custom simulation and tab States
  const [activeAvatar, setActiveAvatar] = useState("🧙‍♀️");
  const [activeCharClass, setActiveCharClass] = useState("Mage");
  const [activeCharName, setActiveCharName] = useState("Rin Tohsaka");
  const [graphicsPreset, setGraphicsPreset] = useState<'Low' | 'Midrange' | 'High' | 'Ultrakill'>('High');
  const [keyMap, setKeyMap] = useState({
    up: "W",
    down: "S",
    left: "A",
    right: "D",
    interact: "E",
    attack: "SPACE"
  });
  const [showHomeMenu, setShowHomeMenu] = useState(true);
  const [activeTab, setActiveTab] = useState("player");
  const [checkoutState, setCheckoutState] = useState<{ method: 'gcash' | 'paypal'; price: number; itemName: string } | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // Modular state for new systems
  const [pityCount, setPityCount] = useState(0);
  const [aniCash, setAniCash] = useState(1000);
  const [equippedOutfit, setEquippedOutfit] = useState("Standard Student Uniform");
  const [unlockedCharacters, setUnlockedCharacters] = useState<string[]>(["Kuro Shinobi"]);
  const [instanceSettings, setInstanceSettings] = useState({
    globalMultiplier: 1.0,
    ramenPayout: 25,
    securityPayout: 60,
    cafePayout: 120,
    guildPayout: 250,
    shibuyaActive: true,
    akihabaraActive: true,
    kyotoActive: true,
    customWorldName1: "Shibuya Cyber Sector",
    customWorldName2: "Akihabara Neon Plaza",
    customWorldName3: "Kyoto Fantasy Shrine",
  });

  const [activeVRM, setActiveVRM] = useState({
    id: "vrm_kuro",
    name: "Kuro Shinobi .vrm",
    fileSize: "12.4 MB",
    polyCount: 42350,
    bones: 64,
    expression: "Neutral"
  });

  const [activeGLB, setActiveGLB] = useState({
    id: "glb_shibuya",
    name: "Shibuya_CityGrid_Lowpoly.glb",
    category: "Environment" as const,
    fileSize: "34.5 MB",
    vertCount: 145000,
    colliders: 112
  });

  const [activeStage, setActiveStage] = useState({
    id: "stage_shibuya",
    name: "Shibuya City Neon Block",
    difficulty: "Moderate",
    weather: "Rainy",
    timeOfDay: "Midnight",
    trafficLevel: "Apocalyptic Chaos" as const
  });

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
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <iframe
            src="https://www.youtube.com/embed/zQGQLEE1nQs?autoplay=1&loop=1&mute=1&playlist=zQGQLEE1nQs&controls=0&showinfo=0&autohide=1&modestbranding=1&fs=0&disablekb=1&iv_load_policy=3"
            className="w-full h-full object-cover pointer-events-none select-none"
            style={{ minWidth: '100vw', minHeight: '100vh', pointerEvents: 'none' }}
            allow="autoplay; encrypted-media"
            title="Background Video"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center bg-gray-950/70 p-10 rounded-3xl backdrop-blur-md border-2 border-orange-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <img src={heroImage} alt="Hero" className="mb-8 rounded-2xl shadow-2xl w-64 h-64 object-cover border-4 border-orange-500" />
          <h1 className="text-6xl font-heading text-orange-500 mb-8 font-extrabold tracking-tight">Otaku Realms</h1>
          <p className="text-gray-300 text-sm mb-6 max-w-sm text-center font-sans">Notification Update Version: 0 Demo Version - I am trying to make this work for now and see if people play it.</p>
          <button 
            onClick={() => {
              setShowStartScreen(false);
            }}
            className="px-10 py-4 bg-orange-600 rounded-full text-2xl font-bold hover:bg-orange-500 active:scale-95 hover:scale-105 transition-all duration-150 shadow-[0_0_20px_rgba(234,88,12,0.4)] cursor-pointer z-20 select-none"
          >
            Begin Journey (Enter Realms)
          </button>
          <a
            href="https://streamlabs.com/usagyuunvtuber/tip"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 px-8 py-3 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-600 hover:from-amber-200 hover:to-amber-500 text-gray-950 font-black tracking-wider text-xs uppercase rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)] border-2 border-yellow-200 hover:scale-105 active:scale-95 transition-transform duration-150 flex items-center gap-2"
          >
            ⭐ DONATE TO KEEP US GOING ⭐
          </a>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
        <div className="bg-gray-900/90 p-8 rounded-2xl shadow-2xl border-2 border-orange-500/30 w-full max-w-md space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-4xl font-heading text-orange-500 font-extrabold tracking-tighter uppercase">Otaku Realms</h1>
            <p className="text-xs text-gray-400 font-mono">Select secure access channel to connect to Virtual Realms</p>
          </div>

          <div className="grid grid-cols-2 gap-2 border-b border-gray-800 pb-4">
            <button
              onClick={() => setAuthView('login')}
              className={`py-2 rounded-lg text-xs font-bold font-mono uppercase transition ${
                authView === 'login' ? 'bg-orange-600 text-white shadow' : 'bg-gray-950 text-gray-500 hover:bg-gray-850'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthView('register')}
              className={`py-2 rounded-lg text-xs font-bold font-mono uppercase transition ${
                authView === 'register' ? 'bg-orange-600 text-white shadow' : 'bg-gray-950 text-gray-500 hover:bg-gray-850'
              }`}
            >
              Sign Up
            </button>
          </div>

          {authView === 'login' ? (
            <Login 
              onSuccess={(u, isAdm) => {
                setUser(u);
                if (isAdm) {
                  setIsAdminOverride(true);
                  setStats(prev => ({ ...prev, isOtakuPlus: true, money: prev.money + 500 }));
                }
              }} 
            />
          ) : (
            <Register 
              onSuccess={(u) => setUser(u)} 
              onNavigateLogin={() => setAuthView('login')}
            />
          )}
        </div>
      </div>
    );
  }

  if (!hasCharacter) {
    return <CharacterCreation user={user} onComplete={() => setHasCharacter(true)} />;
  }

  return (
    <VFX intensity={graphicsPreset} triggerShake={stats.status !== 'healthy' || activeCombat !== null}>
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-6 font-sans">
        <NotificationBanner />
        {activeCombat && <CombatOverlay enemyName={activeCombat} onEndCombat={endCombat} />}
        {showShop && <ShopModal stats={stats} setStats={setStats} onClose={() => setShowShop(false)} />}
        
        <header className="flex justify-between items-center mb-6 border-b-4 border-orange-600 pb-5 flex-wrap gap-3">
          <h1 className="text-4xl font-heading text-orange-500 flex items-center gap-2">
            <Sword className="text-white animate-pulse" />
            Otaku Realms
          </h1>
          
          <div className="flex gap-3 items-center flex-wrap">
            <button
              onClick={() => setShowHomeMenu(true)}
              className="px-4 py-2 rounded-xl font-bold bg-orange-600 text-white hover:bg-orange-500 transition flex items-center gap-1.5 text-xs uppercase tracking-wide"
            >
              🎮 Launcher Menu
            </button>

            <button 
              onClick={() => setShowShop(true)}
              className="px-4 py-2 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1.5 text-xs uppercase"
            >
              🛒 Mart Shop & Otaku+
            </button>

            <button onClick={logout} className="px-3 py-2 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-xl text-xs font-mono transition">
              Sign Out
            </button>
          </div>
        </header>

        {showHomeMenu ? (
          <div className="max-w-5xl mx-auto">
            <HomeMenu 
              onStartStoryMode={() => {
                setGameMode('Story');
                setShowHomeMenu(false);
                soundManager.playLevelUp();
              }}
              onStartFreeRoam={() => {
                setGameMode('FreeRoam');
                setShowHomeMenu(false);
                soundManager.playLevelUp();
              }}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setShowHomeMenu(false);
              }}
              userEmail={user.email || "Otaku"}
              onLogout={logout}
              isAdmin={isAdmin}
            />
          </div>
        ) : (
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Game World Column */}
            <section className="lg:col-span-2 space-y-6">
              <div className="bg-black rounded-2xl border-4 border-orange-900/50 min-h-[45vh] lg:min-h-[55vh] relative p-4 flex flex-col justify-between overflow-hidden">
                <GameViewport 
                  user={user}
                  stats={stats}
                  setStats={setStats}
                  gameMode={gameMode}
                  startCombat={startCombat}
                  viewMode={viewMode}
                  playerPos={playerPos}
                  setPlayerPos={setPlayerPos}
                  onOpenShop={() => setShowShop(true)}
                  activeVRM={activeVRM}
                  activeGLB={activeGLB}
                  activeStage={activeStage}
                />
              </div>

              {/* Game Mode Module (Story / FreeRoam requested) */}
              <div className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 space-y-3">
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <h3 className="text-xs font-bold text-orange-400 font-mono uppercase tracking-wider">
                    {gameMode === 'Story' ? "📜 Story Campaign Mode" : "🗺️ Sandbox Free Roam Mode"}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setGameMode('Story'); soundManager.playSpecial(); }}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase ${
                        gameMode === 'Story' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      Campaign
                    </button>
                    <button
                      onClick={() => { setGameMode('FreeRoam'); soundManager.playSpecial(); }}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase ${
                        gameMode === 'FreeRoam' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      Free Roam
                    </button>
                  </div>
                </div>

                {gameMode === 'Story' ? (
                  <Story money={stats.money} setMoney={(m) => setStats(prev => ({ ...prev, money: typeof m === 'function' ? m(prev.money) : m }))} />
                ) : (
                  <FreeRoam 
                    onSpawnSlime={() => {
                      setWorldObjects(prev => [...prev, { id: 'slime_' + Date.now(), name: 'Level 5 Slime Bot', type: 'static', isHostile: true }]);
                    }} 
                    onGrantMoney={() => {
                      setStats(prev => ({ ...prev, money: prev.money + 200 }));
                    }} 
                    onWarpTo7Eleven={() => {
                      setPlayerPos({ x: 35, y: 25 });
                    }} 
                  />
                )}
              </div>

              {/* Acoustics soundtrack, gravity, and ground floor diagnostics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Soundtrack />
                <SFX />
                <Ground playerPos={playerPos} />
                <Gravity />
              </div>
            </section>

            {/* Right Sub-Panels Column */}
            <div className="space-y-6">
              {/* Core selection menu tabs */}
              <Menu activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} />

              {/* Dynamic render of active selection tab */}
              {activeTab === 'vrm' && (
                <VRMSystem 
                  activeVRM={activeVRM}
                  onSelectCharacter={setActiveVRM}
                  unlockedCharacters={unlockedCharacters}
                />
              )}

              {activeTab === 'glb' && (
                <GLBSystem 
                  activeGLB={activeGLB}
                  onSelectAsset={setActiveGLB}
                />
              )}

              {activeTab === 'stages' && (
                <StagesSystem 
                  activeStage={activeStage}
                  onTravelStage={setActiveStage}
                />
              )}

              {activeTab === 'player' && (
                <div className="space-y-6">
                  <Player stats={stats} user={user} charClass={activeCharClass} charName={activeCharName} />
                  <Body status={stats.status} />
                  <UserPanel 
                    user={user} 
                    isAdmin={isAdmin} 
                    onGiftOtakuPlus={() => {
                      setStats(prev => ({ ...prev, isOtakuPlus: true }));
                      alert("🎁 Admin Special: Gifted Otaku+ VIP privileges successfully!");
                    }}
                  />
                </div>
              )}

              {activeTab === 'worlds' && (
                <div className="space-y-6">
                  <Worlds 
                    currentWorldId={currentWorldId || 'shibuya_cyber'} 
                    onTravelWorld={(worldId) => setCurrentWorldId(worldId)} 
                  />
                  <GameServer />
                  <Portal playerPos={playerPos} onTeleport={(x, y) => setPlayerPos({ x, y })} />
                </div>
              )}

              {activeTab === 'characters' && (
                <Characters 
                  money={stats.money} 
                  setMoney={(m) => setStats(prev => ({ ...prev, money: typeof m === 'function' ? m(prev.money) : m }))} 
                  onSelectCharacter={(avatar, cls, name) => {
                    setActiveAvatar(avatar);
                    setActiveCharClass(cls);
                    setActiveCharName(name);
                  }}
                />
              )}

              {activeTab === 'soul' && (
                <Soul 
                  money={stats.money} 
                  setMoney={(m) => setStats(prev => ({ ...prev, money: typeof m === 'function' ? m(prev.money) : m }))} 
                />
              )}

              {activeTab === 'maps' && (
                <Maps playerPos={playerPos} onTeleport={(x, y) => setPlayerPos({ x, y })} />
              )}

              {activeTab === 'settings' && (
                <Settings 
                  graphicsPreset={graphicsPreset} 
                  setGraphicsPreset={setGraphicsPreset} 
                  keyMap={keyMap} 
                  setKeyMap={setKeyMap} 
                />
              )}

              {activeTab === 'follow' && (
                <Follow 
                  money={stats.money} 
                  onSendGift={(cost) => setStats(prev => ({ ...prev, money: prev.money - cost }))} 
                />
              )}

              {activeTab === 'chats' && (
                <Chats userEmail={user?.email || "Guest_Otaku"} />
              )}

              {activeTab === 'community' && (
                <Community 
                  onAddMoney={(amount) => setStats(prev => ({ ...prev, money: prev.money + amount }))} 
                />
              )}

              {activeTab === 'invite' && (
                <Invite 
                  onAddMoney={(amount) => setStats(prev => ({ ...prev, money: prev.money + amount }))} 
                />
              )}

              {activeTab === 'otakuplus' && (
                <div>
                  {checkoutState ? (
                    <div>
                      {checkoutState.method === 'gcash' ? (
                        <GCash 
                          price={checkoutState.price} 
                          itemName={checkoutState.itemName} 
                          onPaymentSuccess={() => {
                            setStats(prev => ({ ...prev, isOtakuPlus: true }));
                            setCheckoutState(null);
                          }} 
                          onCancel={() => setCheckoutState(null)} 
                        />
                      ) : (
                        <PayPal 
                          price={checkoutState.price} 
                          itemName={checkoutState.itemName} 
                          onPaymentSuccess={() => {
                            setStats(prev => ({ ...prev, isOtakuPlus: true }));
                            setCheckoutState(null);
                          }} 
                          onCancel={() => setCheckoutState(null)} 
                        />
                      )}
                    </div>
                  ) : (
                    <OtakuPlus 
                      isAlreadySubscribed={stats.isOtakuPlus} 
                      aniCash={aniCash}
                      onBuyWithAniCash={(cost, tierName) => {
                        setAniCash(prev => prev - cost);
                        setStats(prev => ({ ...prev, isOtakuPlus: true }));
                        soundManager.playLevelUp();
                      }}
                      onSelectPayment={(method, amount, tierName) => {
                        setCheckoutState({ method, price: amount, itemName: tierName });
                      }} 
                    />
                  )}
                </div>
              )}

              {activeTab === 'subscribed' && (
                <Subscribed 
                  onAddMoney={(amount) => setStats(prev => ({ ...prev, money: prev.money + amount }))} 
                  onGrantMedicine={() => setStats(prev => ({ ...prev, inventory: { ...prev.inventory, medicine: prev.inventory.medicine + 1 } }))} 
                />
              )}

              {activeTab === 'ranking' && (
                <Ranking />
              )}

              {activeTab === 'top' && (
                <Top />
              )}

              {activeTab === 'mic' && (
                <VoiceMic />
              )}

              {activeTab === 'names' && (
                <Names 
                  charName={activeCharName} 
                  onSaveName={(name) => setActiveCharName(name)} 
                />
              )}

              {activeTab === 'anicash' && (
                <AniCash 
                  money={stats.money}
                  onAddMoney={(amount) => setStats(prev => ({ ...prev, money: prev.money + amount }))}
                  onSpendMoney={(amount) => {
                    if (stats.money >= amount) {
                      setStats(prev => ({ ...prev, money: prev.money - amount }));
                      return true;
                    }
                    return false;
                  }}
                />
              )}

              {activeTab === 'jobs' && (
                <Job 
                  onEarnAniCash={(amount) => setAniCash(prev => prev + amount)}
                  combatPower={stats.money * 4 + 150}
                  instanceSettings={instanceSettings}
                />
              )}

              {activeTab === 'earn' && (
                <Earn 
                  onEarnAniCash={(amount) => setAniCash(prev => prev + amount)}
                />
              )}

              {activeTab === 'grind' && (
                <Grind 
                  onGainExp={(amount) => alert(`Loot acquired! Gained +${amount} Character Experience Shards.`)}
                  onAddMoney={(amount) => setStats(prev => ({ ...prev, money: prev.money + amount }))}
                />
              )}

              {activeTab === 'pity' && (
                <Pity 
                  pityCount={pityCount}
                />
              )}

              {activeTab === 'gacha' && (
                <Gacha 
                  aniCash={aniCash}
                  onSpendAniCash={(amount) => {
                    if (aniCash >= amount) {
                      setAniCash(prev => prev - amount);
                      return true;
                    }
                    return false;
                  }}
                  pityCount={pityCount}
                  onIncrementPity={(amount) => setPityCount(prev => prev + amount)}
                  onResetPity={() => setPityCount(0)}
                  onRewardCharacter={(name) => {
                    if (!unlockedCharacters.includes(name)) {
                      setUnlockedCharacters(prev => [...prev, name]);
                    }
                  }}
                />
              )}

              {activeTab === 'clothes' && (
                <Clothes 
                  equippedOutfit={equippedOutfit}
                  onEquipOutfit={(name) => setEquippedOutfit(name)}
                />
              )}

              {activeTab === 'premiumchara' && (
                <PremiumChara 
                  unlockedCharacters={unlockedCharacters}
                  onUnlockPremiumCharacter={(name) => {
                    setUnlockedCharacters(prev => [...prev, name]);
                    setActiveCharName(name);
                  }}
                />
              )}

              {activeTab === 'gachachara' && (
                <GachaChara />
              )}

              {activeTab === 'gachamechanic' && (
                <GachaMechanic />
              )}

              {activeTab === 'characterlist' && (
                <CharacterList 
                  activeCharacter={activeCharName}
                  onSelectCharacter={(name) => setActiveCharName(name)}
                />
              )}

              {activeTab === 'worldslist' && (
                <WorldsList 
                  currentWorldId={currentWorldId || "shibuya_cyber"}
                  onTravelWorld={(worldId) => setCurrentWorldId(worldId)}
                  instanceSettings={instanceSettings}
                  onUpdateSettings={setInstanceSettings}
                />
              )}

              {activeTab === 'admin' && isAdmin && (
                <div className="space-y-4">
                  <AdminPanel godMode={godMode} setGodMode={setGodMode} />
                  <div className="bg-gray-950 p-4 rounded-2xl border-2 border-red-500/30 font-mono text-xs space-y-3">
                    <h3 className="text-red-400 font-extrabold uppercase">Super Admin Panel</h3>
                    <div className="space-y-2">
                      <button 
                        onClick={() => {
                          setStats(prev => ({ ...prev, money: prev.money + 1000 }));
                          soundManager.playLevelUp();
                        }}
                        className="w-full py-2 bg-red-800 text-white rounded font-bold uppercase hover:bg-red-700 transition"
                      >
                        Gift $1000 Premium Coins
                      </button>
                      <button 
                        onClick={() => {
                          setStats(prev => ({ ...prev, isOtakuPlus: !prev.isOtakuPlus }));
                          soundManager.playSpecial();
                        }}
                        className="w-full py-2 bg-emerald-800 text-white rounded font-bold uppercase hover:bg-emerald-700 transition"
                      >
                        Toggle Otaku+ Subscription State
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Standard original sub-systems for backup and reference */}
              <div className="pt-4 border-t border-gray-900 space-y-4">
                <AvatarSystem />
                <MicrophoneSystem />
                <Leaderboard />
                <Inventory user={user} />
                
                {/* World Objects tracker */}
                <section className="bg-gray-900 p-4 rounded-2xl border border-gray-800">
                  <h2 className="text-xs font-bold text-orange-400 flex items-center gap-1.5 uppercase font-mono tracking-wide mb-3">
                    <MapPin className="text-orange-400" size={14} /> World Objects Map Sites
                  </h2>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      placeholder="Enter new object name" 
                      className="flex-grow p-2 bg-gray-950 rounded-lg border border-gray-800 text-white text-xs focus:outline-none" 
                      value={newObjectName} 
                      onChange={(e) => setNewObjectName(e.target.value)} 
                    />
                    <button onClick={handleAddObject} className="p-2 bg-orange-600 rounded-lg text-white font-bold text-xs"><Plus size={14} /></button>
                  </div>
                  <ul className="space-y-1.5 text-xs font-mono max-h-40 overflow-y-auto">
                    {worldObjects.map((obj) => (
                      <li key={obj.id} className="p-2 bg-gray-950 rounded border border-gray-800/60 text-white flex justify-between items-center">
                        <span>{obj.name} <span className="text-[10px] text-gray-500">({obj.type})</span></span>
                        <div className="flex gap-1">
                          {obj.type === 'container' && <button onClick={() => alert(`Opening ${obj.name}`)} className="px-1.5 py-0.5 bg-blue-600 rounded text-[10px]">Open</button>}
                          {obj.type === 'item' && <button onClick={() => alert(`Picking up ${obj.name}`)} className="px-1.5 py-0.5 bg-green-600 rounded text-[10px]">Pick up</button>}
                          {obj.isHostile && <button onClick={() => startCombat(obj.name)} className="px-1.5 py-0.5 bg-red-600 rounded text-[10px]">Fight</button>}
                          <button onClick={() => alert(`Inspecting ${obj.name}`)} className="px-1.5 py-0.5 bg-gray-750 rounded text-[10px]">Inspect</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

            </div>
          </main>
        )}
      </div>
    </VFX>
  );
}


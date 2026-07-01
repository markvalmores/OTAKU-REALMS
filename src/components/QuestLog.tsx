import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { collection, addDoc, onSnapshot, query, where, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Check, Trash2, Plus } from "lucide-react";

interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
  rewardXP: number;
  userId: string;
}

export default function QuestLog({ user }: { user: User }) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const q = query(collection(db, "quests"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const qList: Quest[] = [];
      snapshot.forEach((doc) => {
        qList.push({ id: doc.id, ...doc.data() } as Quest);
      });
      setQuests(qList);
    });
    return unsubscribe;
  }, [user.uid]);

  const handleAddQuest = async () => {
    if (newTitle) {
      await addDoc(collection(db, "quests"), {
        title: newTitle,
        description: "New quest mission",
        status: 'active',
        rewardXP: 50,
        userId: user.uid,
      });
      setNewTitle("");
    }
  };

  const toggleQuestStatus = async (questId: string, status: 'active' | 'completed') => {
    await updateDoc(doc(db, "quests", questId), {
      status: status === 'active' ? 'completed' : 'active'
    });
  };

  const deleteQuest = async (questId: string) => {
    await deleteDoc(doc(db, "quests", questId));
  };

  return (
    <section className="bg-gray-900 p-6 rounded-2xl border-2 border-orange-900/50">
      <h2 className="text-2xl font-heading mb-4 text-orange-400">Quest Log</h2>
      <div className="flex gap-2 mb-4">
        <input type="text" placeholder="Quest title" className="flex-grow p-3 bg-gray-800 rounded-lg border-2 border-gray-700 focus:border-orange-500 text-white" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <button onClick={handleAddQuest} className="p-3 bg-orange-600 rounded-lg text-white font-bold"><Plus /></button>
      </div>
      <ul className="space-y-2">
        {quests.map((quest) => (
          <li key={quest.id} className={`p-4 rounded-lg border-2 ${quest.status === 'completed' ? 'bg-gray-800 border-emerald-900/50' : 'bg-gray-800 border-gray-700 hover:border-orange-500'}`}>
            <div className="flex justify-between items-center">
              <span className={quest.status === 'completed' ? 'line-through text-gray-500' : 'text-white font-bold'}>{quest.title}</span>
              <div className="flex gap-2">
                <button onClick={() => toggleQuestStatus(quest.id, quest.status)} className={`p-1 ${quest.status === 'completed' ? 'text-emerald-400' : 'text-gray-400 hover:text-orange-400'}`}><Check size={20} /></button>
                <button onClick={() => deleteQuest(quest.id)} className="text-red-400 hover:text-red-300"><Trash2 size={20} /></button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

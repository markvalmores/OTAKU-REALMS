import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { collection, addDoc, onSnapshot, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Trash2, Plus } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  userId: string;
}

export default function Inventory({ user }: { user: User }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    const q = query(collection(db, "inventoryItems"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newItems: InventoryItem[] = [];
      snapshot.forEach((doc) => {
        newItems.push({ id: doc.id, ...doc.data() } as InventoryItem);
      });
      setItems(newItems);
    });
    return unsubscribe;
  }, [user.uid]);

  const handleAddItem = async () => {
    if (newItemName) {
      await addDoc(collection(db, "inventoryItems"), {
        name: newItemName,
        userId: user.uid,
      });
      setNewItemName("");
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    await deleteDoc(doc(db, "inventoryItems", itemId));
  };

  return (
    <section className="bg-gray-900 p-6 rounded-2xl border-2 border-orange-900/50">
      <h2 className="text-2xl font-heading mb-4 text-orange-400 flex items-center gap-2">
        Inventory
      </h2>
      <div className="flex gap-2 mb-4">
        <input type="text" placeholder="Item name" className="flex-grow p-3 bg-gray-800 rounded-lg border-2 border-gray-700 focus:border-orange-500" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
        <button onClick={handleAddItem} className="p-3 bg-orange-600 rounded-lg text-white font-bold"><Plus /></button>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="p-4 bg-gray-800 rounded-lg border-2 border-gray-700 flex justify-between items-center hover:border-orange-500">
            {item.name}
            <button onClick={() => handleRemoveItem(item.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
          </li>
        ))}
      </ul>
    </section>
  );
}

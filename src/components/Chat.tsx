import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { User } from "firebase/auth";
import { MessageSquare } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: any;
}

export default function Chat({ worldId, user }: { worldId: string, user: User }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!worldId) return;
    const q = query(
      collection(db, "messages"),
      where("worldId", "==", worldId),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
    });
    return unsubscribe;
  }, [worldId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await addDoc(collection(db, "messages"), {
        worldId,
        sender: user.email,
        text: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    }
  };

  return (
    <section className="bg-gray-900 p-6 rounded-2xl border-2 border-orange-900/50">
      <h2 className="text-xl font-heading mb-4 text-orange-400 flex items-center gap-2">
        <MessageSquare className="text-orange-400" />
        World Chat
      </h2>
      <div className="h-48 overflow-y-auto mb-4 space-y-2 bg-gray-800 p-3 rounded-lg">
        {messages.map((msg) => (
          <div key={msg.id} className="text-sm">
            <span className="text-orange-300 font-bold">{msg.sender}: </span>
            <span className="text-white">{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Type a message..." 
          className="flex-grow p-3 bg-gray-800 rounded-lg border-2 border-gray-700 text-white" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
        />
        <button onClick={handleSendMessage} className="p-3 bg-orange-600 rounded-lg text-white font-bold">Send</button>
      </div>
    </section>
  );
}

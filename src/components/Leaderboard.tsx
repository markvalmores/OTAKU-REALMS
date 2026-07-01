import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trophy } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';

interface UserData {
  uid: string;
  displayName: string;
  exp: number;
}

export default function Leaderboard() {
  const [topUsers, setTopUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const path = 'users';
    const q = query(collection(db, path), orderBy("exp", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: UserData[] = [];
      snapshot.forEach((doc) => {
        users.push({ uid: doc.id, ...doc.data() } as UserData);
      });
      setTopUsers(users);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
    return unsubscribe;
  }, []);

  return (
    <section className="bg-gray-900 p-6 rounded-2xl border-2 border-orange-900/50">
      <h2 className="text-xl font-heading mb-4 text-orange-400 flex items-center gap-2">
        <Trophy className="text-orange-400" />
        Leaderboard
      </h2>
      <ul className="space-y-2">
        {topUsers.map((user, index) => (
          <li key={user.uid} className="p-3 bg-gray-800 rounded-lg flex justify-between items-center text-sm">
            <span>{index + 1}. {user.displayName || 'Anonymous'}</span>
            <span className="font-bold text-orange-400">{user.exp} EXP</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

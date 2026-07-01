import { Bell } from 'lucide-react';
import { motion } from 'motion/react';

export default function NotificationBanner() {
  return (
    <motion.div initial={{ y: -50 }} animate={{ y: 0 }} className="bg-orange-950/80 p-3 rounded-lg border border-orange-700 text-orange-200 text-sm flex items-center gap-2 mb-4">
      <Bell size={16} />
      <span>Send your receipts to Discord: <strong>.usagyuuun</strong> for Otaku+ subscriptions!</span>
    </motion.div>
  );
}

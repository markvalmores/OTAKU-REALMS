import { useState, Dispatch, SetStateAction } from 'react';
import { ShoppingCart, Heart, Apple, X } from 'lucide-react';
import { motion } from 'motion/react';
import { PlayerStats } from '../types';

export default function ShopModal({ stats, setStats, onClose }: { stats: PlayerStats, setStats: Dispatch<SetStateAction<PlayerStats>>, onClose: () => void }) {
  const purchaseItem = (type: 'food' | 'medicine', cost: number) => {
    if (stats.money >= cost) {
      setStats(prev => ({
        ...prev,
        money: prev.money - cost,
        inventory: { ...prev.inventory, [type]: prev.inventory[type] + 1 }
      }));
    }
  };

  const useItem = (type: 'food' | 'medicine') => {
    if (stats.inventory[type] > 0) {
      setStats(prev => ({
        ...prev,
        inventory: { ...prev.inventory, [type]: prev.inventory[type] - 1 },
        hp: type === 'food' ? Math.min(prev.maxHp, prev.hp + 20) : prev.hp,
        status: type === 'medicine' ? 'healthy' : prev.status
      }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110]">
      <div className="bg-gray-900 p-8 rounded-2xl border border-orange-500 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-heading text-orange-500 flex items-center gap-2"><ShoppingCart /> 7-Eleven Mart</h2>
            <button onClick={onClose}><X /></button>
        </div>
        <div className="text-white text-lg font-bold mb-4">Money: ${stats.money}</div>
        <div className="grid grid-cols-2 gap-4">
            <button onClick={() => purchaseItem('food', 10)} className="p-4 bg-gray-800 rounded-lg text-white">Buy Food ($10)</button>
            <button onClick={() => purchaseItem('medicine', 20)} className="p-4 bg-gray-800 rounded-lg text-white">Buy Medicine ($20)</button>
        </div>
        <div className="mt-6 border-t border-orange-800 pt-4">
            <h3 className="text-lg font-bold text-orange-400 mb-2">Otaku+ Subscription</h3>
            <p className="text-gray-400 text-sm mb-2">Get stickers, photo mode, follow feature, and community access!</p>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-800 rounded text-xs text-gray-300">
                    <p className="font-bold">1 Month: 500 Pesos / 10 USD</p>
                    <p>GCash: 09763329358</p>
                    <p>PayPal: makunanami@yahoo.com</p>
                </div>
                <div className="p-3 bg-gray-800 rounded text-xs text-gray-300">
                    <p className="font-bold">1 Year: <span className="line-through text-gray-500">5,000</span> 2,000 Pesos (GCash/PayPal) / 60 USD</p>
                    <p>Send receipt on Discord!</p>
                </div>
            </div>
            {stats.isOtakuPlus && <p className="text-green-500 mt-2 font-bold">Active Otaku+ Member</p>}
        </div>
        <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-300 mb-2">Inventory</h3>
            <div className="flex gap-4">
                <button onClick={() => useItem('food')} className="flex items-center gap-2 p-2 bg-green-700 text-white rounded"><Apple size={16}/> {stats.inventory.food} Food</button>
                <button onClick={() => useItem('medicine')} className="flex items-center gap-2 p-2 bg-blue-700 text-white rounded"><Heart size={16}/> {stats.inventory.medicine} Meds</button>
            </div>
        </div>
      </div>
    </motion.div>
  );
}

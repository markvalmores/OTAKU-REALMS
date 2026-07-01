export default function ExperienceBar({ xp }: { xp: number }) {
  const progress = (xp % 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-400 mb-1">
         <span className="font-bold">XP</span>
         <span>{progress} / 100</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-3 border-2 border-orange-900">
         <div 
           className="bg-orange-500 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
           style={{ width: `${progress}%` }}
         ></div>
      </div>
    </div>
  );
}

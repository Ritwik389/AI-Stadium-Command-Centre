import { useStadiumStore } from '@/lib/store';
import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function FanMeter() {
  const { totalCount, globalStatus, zones } = useStadiumStore();
  const criticalZones = zones.filter((zone) => zone.status === 'CRITICAL').length;
  const warningZones = zones.filter((zone) => zone.status === 'WARNING').length;
  const healthPercent = Math.max(0, 100 - criticalZones * 35 - warningZones * 15);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
        <Heart className="w-24 h-24 text-pink-500 fill-pink-500" />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">System Health</h3>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Live operational summary from backend safety and crowd counts.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
             <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Global Status</div>
             <div className="text-4xl font-black text-pink-500 font-mono italic">
               {globalStatus}
             </div>
          </div>
          
          <div className="h-16 w-[1px] bg-slate-100 hidden md:block" />

          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
               <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 border border-sky-100 font-black text-[10px]">
                  {totalCount}
               </div>
               <span className="text-[8px] font-bold text-slate-400 uppercase">People</span>
            </div>
            <div className="flex flex-col items-center gap-2">
               <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 border border-red-100 font-black text-[10px]">
                  {criticalZones}
               </div>
               <span className="text-[8px] font-bold text-slate-400 uppercase">Critical</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <motion.div 
          animate={{ width: `${healthPercent}%` }}
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
          transition={{ type: "spring", stiffness: 50 }}
        />
      </div>
    </div>
  );
}

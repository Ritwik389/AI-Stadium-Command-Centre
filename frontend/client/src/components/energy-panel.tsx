import { useStadiumStore } from '@/lib/store';
import { Zap, Leaf } from 'lucide-react';

export function EnergyPanel() {
  const { zones } = useStadiumStore();
  const ecoZones = zones.filter((zone) => zone.energy.toUpperCase().includes('ECO')).length;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl overflow-hidden relative">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Energy & Power</h2>
        </div>
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
          <Leaf className="w-4 h-4" />
          <span>{ecoZones}/{zones.length} zones in eco mode</span>
        </div>
      </div>

      <div className="text-center mb-10">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Energy Controller Output</div>
        <div className="text-5xl font-black text-emerald-500 font-mono tracking-tighter">
          {ecoZones}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {zones.map((zone) => (
          <div key={zone.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div
                className={`w-14 h-14 rounded-full border-4 flex items-center justify-center text-[10px] font-black ${
                  zone.status === 'CRITICAL'
                    ? 'border-red-500 text-red-600 bg-red-50'
                    : zone.status === 'WARNING'
                      ? 'border-orange-500 text-orange-600 bg-orange-50'
                      : 'border-emerald-500 text-emerald-600 bg-emerald-50'
                }`}
              >
                {zone.count}
              </div>
            </div>

            <div className="flex-1">
              <div className="text-xs font-black text-slate-900 mb-1">{zone.name}</div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="w-1 h-1 rounded-full bg-sky-400" />
                  Energy: <span className="font-bold text-slate-700">{zone.energy}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  Status: <span className="font-bold text-slate-700">{zone.status}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="w-1 h-1 rounded-full bg-slate-400" />
                  {zone.count} people
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

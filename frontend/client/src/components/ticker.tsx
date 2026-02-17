import { useStadiumStore } from '@/lib/store';
import { Tag } from 'lucide-react';

export function Ticker() {
  const { zones } = useStadiumStore();

  return (
    <div className="w-full flex flex-col gap-4 mb-8">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Tag className="w-3 h-3" /> Live Zone Pricing
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 uppercase">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            Backend Data
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
          >
            {zone.status !== 'SAFE' ? (
              <div
                className={`absolute top-0 right-0 w-24 h-24 blur-2xl -mr-12 -mt-12 transition-colors ${
                  zone.status === 'CRITICAL' ? 'bg-red-500/10' : 'bg-orange-500/10'
                }`}
              />
            ) : null}

            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{zone.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-black text-slate-900 font-mono">${zone.price.toFixed(2)}</span>
                  <div
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      zone.manual ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {zone.manual ? 'MANUAL' : 'AUTO'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-bold text-slate-400 uppercase">People</div>
                <div className="text-xs font-black text-slate-700">{zone.count}</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Status</span>
              <span
                className={`text-[10px] font-black uppercase ${
                  zone.status === 'CRITICAL'
                    ? 'text-red-600'
                    : zone.status === 'WARNING'
                      ? 'text-orange-600'
                      : 'text-emerald-600'
                }`}
              >
                {zone.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      {zones.length === 0 ? (
        <div className="text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-3">
          Waiting for zones from backend `/data`...
        </div>
      ) : null}
    </div>
  );
}

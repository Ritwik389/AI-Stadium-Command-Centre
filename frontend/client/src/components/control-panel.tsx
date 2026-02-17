import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { setAutoPrice, setManualPrice } from '@/lib/backend';
import { useStadiumStore } from '@/lib/store';

export function ControlPanel() {
  const { zones, setZoneAutoLocal, setZoneManualPriceLocal } = useStadiumStore();
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  const [loadingZone, setLoadingZone] = useState<string | null>(null);

  const gates = useMemo(
    () =>
      zones.map((zone, index) => ({
        id: zone.id,
        name: `Gate ${index + 1}`,
        status: zone.status,
        crowdCount: zone.count,
      })),
    [zones],
  );

  const onSetManual = async (zoneName: string) => {
    const rawPrice = priceInputs[zoneName];
    const parsedPrice = Number(rawPrice);
    if (!rawPrice || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return;
    }

    setLoadingZone(zoneName);
    try {
      await setManualPrice(zoneName, parsedPrice);
      setZoneManualPriceLocal(zoneName, parsedPrice);
    } finally {
      setLoadingZone(null);
    }
  };

  const onSetAuto = async (zoneName: string) => {
    setLoadingZone(zoneName);
    try {
      await setAutoPrice(zoneName);
      setZoneAutoLocal(zoneName);
    } finally {
      setLoadingZone(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Live Controls</span>
          </div>
          <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none text-[9px]">Backend</Badge>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Gate count is dynamic from backend zones. Manual pricing updates call `/set_price` and `/set_auto`.
        </p>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        <section className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
            <ShieldAlert className="w-3 h-3" /> Gates (Auto-generated)
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {gates.map((gate) => (
              <div
                key={gate.id}
                className="p-3 rounded-xl bg-white border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-700">{gate.name}</div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold">{gate.crowdCount} people</div>
                </div>
                <div
                  className={`text-[10px] font-black uppercase ${
                    gate.status === 'CRITICAL'
                      ? 'text-red-600'
                      : gate.status === 'WARNING'
                        ? 'text-orange-600'
                        : 'text-emerald-600'
                  }`}
                >
                  {gate.status}
                </div>
              </div>
            ))}
            {gates.length === 0 ? (
              <div className="text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-2">
                No zones detected yet.
              </div>
            ) : null}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" /> Zone Pricing Overrides
          </h3>
          <div className="space-y-3">
            {zones.map((zone) => (
              <div key={zone.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 tracking-tight">{zone.name}</span>
                  <span className="text-[10px] font-bold text-slate-500">Current: ${zone.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Manual price"
                    value={priceInputs[zone.name] ?? ''}
                    onChange={(e) =>
                      setPriceInputs((prev) => ({
                        ...prev,
                        [zone.name]: e.target.value,
                      }))
                    }
                    className="h-8 text-xs"
                  />
                  <Button
                    size="sm"
                    className="h-8 text-[10px]"
                    disabled={loadingZone === zone.name}
                    onClick={() => onSetManual(zone.name)}
                  >
                    Set Manual
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-[10px]"
                    disabled={loadingZone === zone.name}
                    onClick={() => onSetAuto(zone.name)}
                  >
                    Resume Auto
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

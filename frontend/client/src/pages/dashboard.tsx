import { useBackendData } from '@/hooks/use-backend-data';
import { VideoFeed } from '@/components/video-feed';
import { StadiumHeatmap } from '@/components/stadium-heatmap';
import { ControlPanel } from '@/components/control-panel';
import { Ticker } from '@/components/ticker';
import { EnergyPanel } from '@/components/energy-panel';
import { motion } from 'framer-motion';
import { useStadiumStore } from '@/lib/store';

export default function Dashboard() {
  useBackendData();
  const { isConnected, zones } = useStadiumStore();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-y-auto">
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(1200px_700px_at_20%_-10%,rgba(14,165,233,0.14),transparent_60%),radial-gradient(900px_600px_at_85%_0%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(180deg,#f8fbff_0%,#f4f8ff_100%)]" />

      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        <header className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xl italic">S</div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
                Aether<span className="text-emerald-400">AI</span>
              </h1>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Command Interface 0.1</p>
          </div>
          <div className="hidden md:flex gap-8 items-end">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Backend Link</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-3 rounded-full ${
                      isConnected ? 'bg-emerald-400' : i < 3 ? 'bg-amber-400' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Detected Zones</span>
              <span className="text-sm font-black font-mono text-slate-900">{zones.length}</span>
            </div>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Ticker />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(180px,auto)] gap-5 items-start">
          <div className="md:col-span-4 xl:col-span-3">
            <VideoFeed />
          </div>

          <div className="md:col-span-8 xl:col-span-6 min-h-[420px]">
            <StadiumHeatmap />
          </div>

          <div className="md:col-span-12 xl:col-span-3 xl:row-span-2 min-h-[520px] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Operations</h2>
              <div className="w-2 h-2 rounded-full bg-sky-400" />
            </div>
            <ControlPanel />
          </div>

          <div className="md:col-span-12 xl:col-span-9 min-h-[320px]">
            <EnergyPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

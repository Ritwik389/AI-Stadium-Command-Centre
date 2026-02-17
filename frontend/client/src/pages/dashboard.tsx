import { useBackendData } from '@/hooks/use-backend-data';
import { VideoFeed } from '@/components/video-feed';
import { StadiumHeatmap } from '@/components/stadium-heatmap';
import { ControlPanel } from '@/components/control-panel';
import { Ticker } from '@/components/ticker';
import { FanMeter } from '@/components/fan-meter';
import { EnergyPanel } from '@/components/energy-panel';
import { motion } from 'framer-motion';
import { useStadiumStore } from '@/lib/store';

export default function Dashboard() {
  useBackendData();
  const { isConnected, zones } = useStadiumStore();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-y-auto">
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none -z-10" />

      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-8">
        {/* Header */}
        <header className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xl italic">S</div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
                Aether<span className="text-emerald-500">AI</span>
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

        {/* Global Stats Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Ticker />
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Visual Intelligence Feed */}
          <div className="lg:col-span-3 h-[600px] flex flex-col">
            <VideoFeed />
          </div>

          {/* Core Analytics & Heatmap */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            <div className="h-[500px]">
              <StadiumHeatmap />
            </div>
            <div className="grid grid-cols-1 gap-8">
              <EnergyPanel />
              <FanMeter />
            </div>
          </div>

          {/* Operational Overrides */}
          <div className="lg:col-span-3 min-h-[600px] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Operations</h2>
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <ControlPanel />
          </div>

        </div>
      </div>
    </div>
  );
}

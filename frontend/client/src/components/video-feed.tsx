import { useMemo, useState } from 'react';
import { getVideoFeedUrl } from '@/lib/backend';

export function VideoFeed() {
  const [hasError, setHasError] = useState(false);
  const videoSrc = useMemo(() => getVideoFeedUrl(), []);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden ring-1 ring-slate-900/5">
      <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="font-bold text-xs uppercase tracking-widest text-slate-600">Live Vision Feed</h2>
        </div>
        <div className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-white">/video_feed</div>
      </div>

      <div className="relative flex-1 bg-slate-950 w-full overflow-hidden">
        <img
          src={videoSrc}
          alt="Live stadium stream"
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
          onLoad={() => setHasError(false)}
        />
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center text-center p-6 text-slate-200 text-sm bg-slate-900/80">
            Unable to load live stream.
            <br />
            Make sure the backend is running on port 8000.
          </div>
        ) : null}
      </div>

      <div className="p-4 bg-slate-50 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">Source</span>
        <span className="text-[10px] font-mono text-slate-700">FastAPI MJPEG Stream</span>
      </div>
    </div>
  );
}

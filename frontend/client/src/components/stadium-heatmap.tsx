import { useEffect, useMemo, useRef, useState } from 'react';
import { useStadiumStore } from '@/lib/store';

interface NormalizedPoint {
  x: number;
  y: number;
}

interface ZoneLayoutItem {
  zoneIndex: number;
  points: NormalizedPoint[];
}

interface ZoneLayoutResponse {
  zones: ZoneLayoutItem[];
}

function getZoneColor(status: string): string {
  if (status === 'CRITICAL') {
    return '#dc2626';
  }
  if (status === 'WARNING') {
    return '#ea580c';
  }
  return '#16a34a';
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const value = hex.replace('#', '');
  const normalized = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  const num = parseInt(normalized, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function StadiumHeatmap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [layout, setLayout] = useState<ZoneLayoutItem[]>([]);
  const { zones } = useStadiumStore();

  useEffect(() => {
    let mounted = true;

    const loadLayout = async () => {
      try {
        const response = await fetch('/api/zone-layout');
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as ZoneLayoutResponse;
        if (!mounted) {
          return;
        }
        setLayout(Array.isArray(data.zones) ? data.zones : []);
      } catch {
        if (mounted) {
          setLayout([]);
        }
      }
    };

    loadLayout();
    return () => {
      mounted = false;
    };
  }, []);

  const maxCount = useMemo(() => Math.max(...zones.map((zone) => zone.count), 1), [zones]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const img = new Image();
    img.src = '/stadium-map.png';
    img.onload = () => {
      const scale = Math.min(width / img.width, height / img.height);
      const imageX = width / 2 - (img.width * scale) / 2;
      const imageY = height / 2 - (img.height * scale) / 2;
      const imageW = img.width * scale;
      const imageH = img.height * scale;

      ctx.globalAlpha = 0.6;
      ctx.drawImage(img, imageX, imageY, imageW, imageH);
      ctx.globalAlpha = 1;

      layout.forEach((zoneShape, index) => {
        const zoneData = zones[index];
        const count = zoneData?.count ?? 0;
        const status = zoneData?.status ?? 'SAFE';
        const color = getZoneColor(status);
        const intensity = Math.max(0.15, count / maxCount);
        const { r, g, b } = hexToRgb(color);

        const scaledPoints = zoneShape.points.map((p) => ({
          x: imageX + p.x * imageW,
          y: imageY + p.y * imageH,
        }));

        if (scaledPoints.length < 3) {
          return;
        }

        ctx.beginPath();
        ctx.moveTo(scaledPoints[0].x, scaledPoints[0].y);
        scaledPoints.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.save();
        ctx.clip();

        const centerX = scaledPoints.reduce((sum, p) => sum + p.x, 0) / scaledPoints.length;
        const centerY = scaledPoints.reduce((sum, p) => sum + p.y, 0) / scaledPoints.length;
        const spread = 40 + intensity * 120;
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, spread);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.55 + intensity * 0.35})`);
        gradient.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${0.25 + intensity * 0.25})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(zoneData?.name ?? `Zone ${index + 1}`, centerX, centerY - 4);
        ctx.fillText(`Count: ${count}`, centerX, centerY + 10);
      });

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let i = 0; i < width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
    };
  }, [layout, maxCount, zones]);

  return (
    <div className="relative w-full h-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-xl group">
      <div className="absolute top-4 left-4 z-10 bg-white/85 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-white/20">
        <h3 className="text-xs font-semibold text-slate-600 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          CROWD DENSITY HEATMAP
        </h3>
      </div>

      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-cover" />

      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1">
        <div className="bg-white/90 backdrop-blur px-2 py-1 rounded border border-slate-200 text-[10px] font-mono text-slate-500 shadow-sm">
          Polygons: {layout.length}
        </div>
      </div>
    </div>
  );
}

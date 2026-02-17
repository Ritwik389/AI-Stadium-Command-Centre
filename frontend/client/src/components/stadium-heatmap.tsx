import { useEffect, useRef } from 'react';
import { useStadiumStore } from '@/lib/store';

export function StadiumHeatmap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { zones } = useStadiumStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Background Image (Stadium Map)
    const img = new Image();
    img.src = '/stadium-map.png';
    
    img.onload = () => {
      // Draw image to fit canvas while maintaining aspect ratio
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      
      ctx.globalAlpha = 0.6; // Slightly faded background
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      ctx.globalAlpha = 1.0;

      const maxCount = Math.max(...zones.map((zone) => zone.count), 1);

      // 2. Draw Zone Intensities
      zones.forEach((zone, index) => {
        const angle = ((Math.PI * 2) / Math.max(zones.length, 1)) * index - Math.PI / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.28;
        const pointX = canvas.width / 2 + Math.cos(angle) * radius;
        const pointY = canvas.height / 2 + Math.sin(angle) * radius;
        const intensity = Math.max(0.15, zone.count / maxCount);
        
        const gradient = ctx.createRadialGradient(pointX, pointY, 0, pointX, pointY, 65);
        gradient.addColorStop(0, `rgba(255, 60, 0, ${intensity * 0.9})`);
        gradient.addColorStop(0.45, `rgba(255, 160, 0, ${intensity * 0.6})`);
        gradient.addColorStop(1, 'rgba(255, 160, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pointX, pointY, 65, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${zone.name}: ${zone.count}`, pointX, pointY + 4);
      });

      // 3. Draw Grid Overlay (Tech feel)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)'; // Light blue
      ctx.lineWidth = 1;
      const gridSize = 50;
      
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    };

  }, [zones]);

  return (
    <div className="relative w-full h-full bg-slate-100 rounded-xl overflow-hidden border border-border shadow-inner group">
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-white/20">
        <h3 className="text-xs font-semibold text-slate-600 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
          CROWD DENSITY HEATMAP
        </h3>
      </div>
      
      <canvas 
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full object-cover"
      />

      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1">
        <div className="bg-white/90 backdrop-blur px-2 py-1 rounded border border-slate-200 text-[10px] font-mono text-slate-500 shadow-sm">
          Zones: {zones.length}
        </div>
      </div>
    </div>
  );
}

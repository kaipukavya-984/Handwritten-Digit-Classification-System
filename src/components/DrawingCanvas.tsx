import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Download } from 'lucide-react';

interface DrawingCanvasProps {
  onDraw: (imageData: number[][], base64: string) => void;
  onClear: () => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onDraw, onClear }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    processCanvas();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    onClear();
  };

  const processCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary 28x28 canvas to downsample
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.drawImage(canvas, 0, 0, 28, 28);
    const base64 = tempCanvas.toDataURL('image/png').split(',')[1];
    const imageData = tempCtx.getImageData(0, 0, 28, 28).data;
    
    const grid: number[][] = [];
    for (let i = 0; i < 28; i++) {
      grid[i] = [];
      for (let j = 0; j < 28; j++) {
        const idx = (i * 28 + j) * 4;
        // Just take the red channel as it's grayscale
        grid[i][j] = imageData[idx] / 255;
      }
    }
    onDraw(grid, base64);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="border-4 border-slate-800 rounded-xl cursor-crosshair shadow-2xl bg-black touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={clear}
            className="p-2 bg-slate-900/80 text-white rounded-lg hover:bg-red-600 transition-colors"
            title="Clear Canvas"
          >
            <Eraser size={20} />
          </button>
        </div>
      </div>
      <p className="text-sm text-slate-500 font-medium italic">Draw a digit (0-9) above</p>
    </div>
  );
};

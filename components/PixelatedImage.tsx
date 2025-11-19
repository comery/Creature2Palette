

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface PixelatedImageProps {
  imageUrl: string | null;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  color: string;
}

// Utility to convert RGB to HEX
const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

export const PixelatedImage: React.FC<PixelatedImageProps> = ({ imageUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const colorGrid = useRef<string[][]>([]);

  const drawPixelatedImage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    const container = containerRef.current;

    if (!canvas || !ctx || !imageUrl || !container) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const displayWidth = container.clientWidth;
      const scale = displayWidth / img.width;
      const displayHeight = img.height * scale;
      canvas.width = displayWidth;
      canvas.height = displayHeight;

      const hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = img.width;
      hiddenCanvas.height = img.height;
      const hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true });
      if (!hiddenCtx) return;
      hiddenCtx.drawImage(img, 0, 0);

      const blockSize = Math.max(8, Math.floor(img.width / 40));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const newGrid: string[][] = [];

      for (let y = 0; y < img.height; y += blockSize) {
        const row: string[] = [];
        for (let x = 0; x < img.width; x += blockSize) {
          const w = Math.min(blockSize, img.width - x);
          const h = Math.min(blockSize, img.height - y);
          const imageData = hiddenCtx.getImageData(x, y, w, h);
          const data = imageData.data;
          let r = 0, g = 0, b = 0;
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
          }
          const pixelCount = data.length / 4;
          r = Math.floor(r / pixelCount);
          g = Math.floor(g / pixelCount);
          b = Math.floor(b / pixelCount);
          
          const avgColor = `rgb(${r}, ${g}, ${b})`;
          row.push(rgbToHex(r, g, b));

          ctx.fillStyle = avgColor;
          ctx.fillRect(x * scale, y * scale, w * scale, h * scale);
        }
        newGrid.push(row);
      }
      colorGrid.current = newGrid;
    };
  }, [imageUrl]);

  useEffect(() => {
    drawPixelatedImage();
    const resizeObserver = new ResizeObserver(() => {
      drawPixelatedImage();
    });
    if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [drawPixelatedImage]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!colorGrid.current.length || !colorGrid.current[0].length) return;

    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // FIX: Replaced buggy logic that had a circular dependency with a direct calculation of block size on the canvas.
    const canvasBlockWidth = canvas.width / colorGrid.current[0].length;
    const canvasBlockHeight = canvas.height / colorGrid.current.length;

    const gridX = Math.floor(x / canvasBlockWidth);
    const gridY = Math.floor(y / canvasBlockHeight);

    if (gridY >= 0 && gridY < colorGrid.current.length && gridX >= 0 && gridX < colorGrid.current[gridY].length) {
      const color = colorGrid.current[gridY][gridX];
      setTooltip({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        color: color,
      });
    } else {
        handleMouseOut();
    }
  };

  const handleMouseOut = () => {
    setTooltip((prev) => prev && { ...prev, visible: false });
  };
  
  return (
    <div ref={containerRef} className="relative shadow-xl bg-white p-2 border border-gray-300">
      <canvas 
        ref={canvasRef} 
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        className="w-full h-auto block"
      />
       <div className="bg-gray-50 border-t border-gray-200 p-2 text-center text-xs text-gray-500">
          Pixelated View (Hover for color)
      </div>
      {tooltip?.visible && (
        <div 
          className="fixed z-50 pointer-events-none transform -translate-y-full -translate-x-1/2 mt-[-10px] px-2 py-1 bg-gray-800 text-white text-xs font-mono rounded shadow-lg"
          style={{ top: tooltip.y, left: tooltip.x }}
        >
          {tooltip.color}
        </div>
      )}
    </div>
  );
};
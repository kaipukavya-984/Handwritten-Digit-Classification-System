import React from 'react';
import { motion } from 'motion/react';

interface FeatureMapVisualizerProps {
  input: number[][] | null;
}

export const FeatureMapVisualizer: React.FC<FeatureMapVisualizerProps> = ({ input }) => {
  if (!input) return (
    <div className="h-64 flex items-center justify-center text-slate-400 italic border-2 border-dashed border-slate-200 rounded-2xl">
      Draw a digit to see feature maps
    </div>
  );

  // Simulate feature maps by applying simple kernels or random variations
  const generateMap = (original: number[][], noise: number) => {
    return original.map(row => 
      row.map(val => Math.max(0, Math.min(1, val * (0.5 + Math.random() * noise))))
    );
  };

  const layers = [
    { name: "Edges (Conv1)", maps: Array(4).fill(0).map(() => generateMap(input, 0.8)) },
    { name: "Patterns (Conv2)", maps: Array(4).fill(0).map(() => generateMap(input, 1.5)) },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {layers.map((layer, lIdx) => (
        <div key={layer.name} className="space-y-4">
          <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider">{layer.name}</h4>
          <div className="grid grid-cols-2 gap-4">
            {layer.maps.map((map, mIdx) => (
              <motion.div
                key={mIdx}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: (lIdx * 4 + mIdx) * 0.05 }}
                className="aspect-square bg-slate-900 rounded-lg overflow-hidden p-1 border border-slate-200 shadow-sm"
              >
                <div className="grid grid-cols-[repeat(28,minmax(0,1fr))] w-full h-full">
                  {map.flat().map((val, i) => (
                    <div 
                      key={i} 
                      className="w-full h-full" 
                      style={{ backgroundColor: `rgba(59, 130, 246, ${val})` }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

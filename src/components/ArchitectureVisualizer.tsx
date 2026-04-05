import React from 'react';
import { motion } from 'motion/react';
import { CNN_LAYERS } from '../constants';
import { cn } from '../lib/utils';

export const ArchitectureVisualizer: React.FC = () => {
  return (
    <div className="w-full overflow-x-auto pb-8">
      <div className="flex items-center justify-between min-w-[800px] px-4">
        {CNN_LAYERS.map((layer, idx) => (
          <React.Fragment key={layer.name}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center group relative"
            >
              <div 
                className={cn(
                  "w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold shadow-lg transition-transform group-hover:scale-110",
                  layer.type === 'conv' && "bg-blue-500",
                  layer.type === 'pool' && "bg-amber-500",
                  layer.type === 'flatten' && "bg-purple-500",
                  layer.type === 'dense' && "bg-emerald-500",
                  layer.type === 'input' && "bg-slate-500"
                )}
              >
                {layer.type[0].toUpperCase()}
              </div>
              <div className="mt-3 text-center">
                <p className="text-xs font-bold text-slate-700 truncate w-24">{layer.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">{layer.shape}</p>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 p-3 bg-slate-900 text-white rounded-xl text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-2xl">
                <p className="font-bold mb-1 text-blue-400">{layer.name}</p>
                <p className="text-slate-300 mb-2">{layer.description}</p>
                <p className="text-[10px] text-slate-400 border-t border-slate-700 pt-2">{layer.details}</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
              </div>
            </motion.div>
            
            {idx < CNN_LAYERS.length - 1 && (
              <div className="h-px flex-1 bg-slate-200 mx-2 relative">
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-slate-300 rotate-45" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

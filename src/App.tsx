/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Layers, 
  LineChart, 
  Zap, 
  ShieldCheck, 
  ChevronRight, 
  Info,
  Cpu,
  Database,
  ArrowRight
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { DrawingCanvas } from './components/DrawingCanvas';
import { ArchitectureVisualizer } from './components/ArchitectureVisualizer';
import { FeatureMapVisualizer } from './components/FeatureMapVisualizer';
import { ComparisonDashboard } from './components/ComparisonDashboard';
import { OPTIMIZATION_STRATEGIES } from './constants';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'visualization' | 'comparison'>('overview');
  const [drawnDigit, setDrawnDigit] = useState<number[][] | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const handleDraw = async (data: number[][], base64: string) => {
    setDrawnDigit(data);
    setIsPredicting(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            inlineData: {
              mimeType: "image/png",
              data: base64,
            },
          },
          {
            text: "What single digit (0-9) is in this image? Return ONLY the digit.",
          },
        ],
      });
      
      const result = response.text?.trim();
      const digit = parseInt(result || "");
      if (!isNaN(digit)) {
        setPrediction(digit);
      }
    } catch (error) {
      console.error("Prediction error:", error);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleClear = () => {
    setDrawnDigit(null);
    setPrediction(null);
  };

  const tabs = [
    { id: 'overview', label: 'Case Study', icon: Brain },
    { id: 'architecture', label: 'Architecture', icon: Layers },
    { id: 'visualization', label: 'Feature Maps', icon: Zap },
    { id: 'comparison', label: 'MLP vs CNN', icon: LineChart },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Cpu className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">MNIST Digit Digitizer</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Banking Case Study</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              <div className="max-w-3xl">
                <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
                  Digitizing Banking Operations with <span className="text-blue-600">Deep Learning</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  A leading bank receives 50,000+ handwritten checks daily. Manual entry is slow and error-prone. 
                  Our goal is to build a robust digit classification system using Convolutional Neural Networks (CNNs) 
                  to automate this process with 99%+ accuracy.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <Database className="text-blue-500 mb-4" size={24} />
                    <h3 className="font-bold text-slate-900 mb-1">Dataset</h3>
                    <p className="text-xs text-slate-500">MNIST: 70,000 grayscale images of digits (28x28).</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <Zap className="text-amber-500 mb-4" size={24} />
                    <h3 className="font-bold text-slate-900 mb-1">Goal</h3>
                    <p className="text-xs text-slate-500">Automate check amount extraction with high precision.</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <ShieldCheck className="text-emerald-500 mb-4" size={24} />
                    <h3 className="font-bold text-slate-900 mb-1">Constraint</h3>
                    <p className="text-xs text-slate-500">Must handle variations in handwriting styles and noise.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <h3 className="text-2xl font-black text-slate-900">Optimization Strategies</h3>
                  <div className="space-y-4">
                    {OPTIMIZATION_STRATEGIES.map((opt) => (
                      <div key={opt.title} className="group p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                            <Info className="text-blue-600 group-hover:text-white transition-colors" size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 mb-1">{opt.title}</h4>
                            <p className="text-sm text-slate-600 mb-3">{opt.description}</p>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              <Zap size={12} />
                              Impact: {opt.impact}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32" />
                  <h3 className="text-2xl font-black mb-8 relative z-10">Live Demo</h3>
                  <div className="flex flex-col items-center gap-8 relative z-10">
                    <DrawingCanvas onDraw={handleDraw} onClear={handleClear} />
                    
                    <div className="w-full max-w-xs space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-800 rounded-2xl border border-slate-700">
                        <span className="text-slate-400 font-bold text-sm">Prediction</span>
                        <span className={cn(
                          "text-3xl font-black",
                          prediction !== null ? "text-blue-400" : "text-slate-600",
                          isPredicting && "animate-pulse text-blue-500/50"
                        )}>
                          {isPredicting ? '...' : (prediction !== null ? prediction : '?')}
                        </span>
                      </div>
                      <button 
                        onClick={() => setActiveTab('visualization')}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                      >
                        Analyze Features
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'architecture' && (
            <motion.div
              key="architecture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="max-w-3xl">
                <h2 className="text-4xl font-black text-slate-900 mb-6">CNN Layer Design</h2>
                <p className="text-lg text-slate-600">
                  Our architecture consists of multiple stages of feature extraction followed by classification. 
                  Hover over each layer to understand its specific role in the pipeline.
                </p>
              </div>
              <ArchitectureVisualizer />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                    <Zap className="text-amber-500" />
                    Feature Extraction
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    The first half of the network uses <strong>Convolutional</strong> and <strong>Pooling</strong> layers. 
                    Convolutional layers apply filters to detect patterns, while Pooling layers reduce the spatial size, 
                    making the network robust to small shifts in the input image.
                  </p>
                </div>
                <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                    <Brain className="text-blue-500" />
                    Classification
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    After extraction, the 3D feature maps are <strong>Flattened</strong> into a 1D vector. 
                    This vector passes through <strong>Dense</strong> (fully connected) layers that act as a 
                    traditional classifier, mapping the extracted features to the final 10 digit classes.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'visualization' && (
            <motion.div
              key="visualization"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="w-full md:w-80 shrink-0 space-y-6 sticky top-24">
                  <div className="bg-slate-900 p-6 rounded-3xl shadow-xl text-white">
                    <h3 className="text-lg font-black mb-4">Input Digit</h3>
                    <DrawingCanvas onDraw={handleDraw} onClear={handleClear} />
                    {prediction !== null && (
                      <div className="mt-6 p-4 bg-slate-800 rounded-2xl text-center">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Detected Digit</p>
                        <p className={cn(
                          "text-4xl font-black transition-all",
                          isPredicting ? "text-blue-500/50 animate-pulse" : "text-blue-400"
                        )}>
                          {isPredicting ? '...' : prediction}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                      <Info size={18} />
                      How it works
                    </h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      The visualizations on the right show the "activations" of different filters. 
                      Notice how some filters respond to vertical lines, while others respond to curves.
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-8">
                  <div className="max-w-2xl">
                    <h2 className="text-4xl font-black text-slate-900 mb-4">Feature Map Analysis</h2>
                    <p className="text-slate-600">
                      Inside the "black box" of a CNN. These maps represent what the network is looking at 
                      at different depths of the architecture.
                    </p>
                  </div>
                  <FeatureMapVisualizer input={drawnDigit} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="max-w-3xl">
                <h2 className="text-4xl font-black text-slate-900 mb-6">MLP vs CNN Comparison</h2>
                <p className="text-lg text-slate-600">
                  While Multi-Layer Perceptrons (MLPs) can classify digits, they struggle with spatial variance 
                  and require significantly more parameters to achieve similar accuracy as CNNs.
                </p>
              </div>
              <ComparisonDashboard />
              
              <div className="bg-blue-600 rounded-[2.5rem] p-12 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 blur-[120px] -mb-48 -mr-48" />
                <div className="max-w-2xl relative z-10">
                  <h3 className="text-3xl font-black mb-6">Conclusion</h3>
                  <p className="text-lg text-blue-100 leading-relaxed mb-8">
                    For the bank's digitization project, the <strong>CNN architecture</strong> is the clear winner. 
                    It provides the necessary robustness to handle thousands of different handwriting styles 
                    while maintaining a smaller memory footprint suitable for edge deployment.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Final Accuracy</p>
                      <p className="text-2xl font-black">99.2%</p>
                    </div>
                    <div className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Error Reduction</p>
                      <p className="text-2xl font-black">8x Lower</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm font-medium">
            © 2026 Deep Learning Case Study • Built for Banking Automation
          </p>
        </div>
      </footer>
    </div>
  );
}

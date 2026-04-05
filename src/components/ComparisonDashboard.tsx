import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { COMPARISON_DATA } from '../constants';

export const ComparisonDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-6">Performance Comparison</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COMPARISON_DATA.filter(d => d.metric !== 'Parameters')}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="metric" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="mlp" name="MLP (Dense Only)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cnn" name="CNN" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
          <h4 className="text-lg font-bold mb-6">Why CNN Wins?</h4>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-blue-400 font-bold text-sm mb-1">Spatial Hierarchy</p>
              <p className="text-slate-400 text-xs leading-relaxed">
                MLPs treat images as flat vectors, losing spatial relationships. CNNs use kernels to preserve local patterns like edges and shapes.
              </p>
            </div>
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-amber-400 font-bold text-sm mb-1">Parameter Efficiency</p>
              <p className="text-slate-400 text-xs leading-relaxed">
                Weight sharing in CNNs significantly reduces the number of parameters compared to fully connected layers, making them easier to train.
              </p>
            </div>
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-emerald-400 font-bold text-sm mb-1">Translation Invariance</p>
              <p className="text-slate-400 text-xs leading-relaxed">
                Pooling layers allow the network to recognize a digit even if it's slightly shifted or tilted in the image.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

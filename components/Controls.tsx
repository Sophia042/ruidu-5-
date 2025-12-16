import React from 'react';
import { ProductModel } from '../types';

interface ControlsProps {
  models: ProductModel[];
  selectedModelId: string;
  onSelectModel: (model: ProductModel) => void;
}

export const Controls: React.FC<ControlsProps> = ({ models, selectedModelId, onSelectModel }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800 p-6 relative overflow-hidden">
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-3xl"></div>
      
      <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-cyan-500 rounded-sm"></span>
        System Configuration
      </h3>
      
      <div className="space-y-4">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelectModel(model)}
            className={`w-full text-left p-4 rounded-lg border transition-all duration-300 group relative overflow-hidden ${
              selectedModelId === model.id
                ? 'border-cyan-500/50 bg-cyan-950/10 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                : 'border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'
            }`}
          >
            {/* Active Indicator Bar */}
            {selectedModelId === model.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>
            )}

            <div className="flex justify-between items-center mb-1 pl-2">
              <span className={`font-bold text-lg tracking-tight ${selectedModelId === model.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                {model.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3 pl-2">{model.tagline}</p>
            
            <div className="flex flex-wrap gap-2 pl-2">
              {model.features.slice(0, 3).map((feat, i) => (
                <span key={i} className={`text-[10px] px-2 py-1 rounded border ${
                    selectedModelId === model.id 
                    ? 'border-cyan-900/50 bg-cyan-950/30 text-cyan-200' 
                    : 'border-slate-700 bg-slate-800 text-slate-500'
                }`}>
                  {feat}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-slate-800">
        <div className="flex items-start gap-2">
           <svg className="w-4 h-4 text-slate-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           <p className="text-xs text-slate-500 italic leading-relaxed font-mono">
             Calibration data visualized above represents nominal performance parameters. R&D models offer open-loop control access.
           </p>
        </div>
      </div>
    </div>
  );
};

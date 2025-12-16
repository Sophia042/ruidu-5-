import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { RadarData } from '../types';

interface PentagonChartProps {
  data: RadarData;
}

const CustomTick = ({ payload, x, y, textAnchor, stroke, radius }: any) => {
  return (
    <g className="recharts-layer recharts-polar-angle-axis-tick">
      <text
        radius={radius}
        stroke={stroke}
        x={x}
        y={y}
        className="text-[10px] sm:text-xs font-medium tracking-widest uppercase fill-slate-400"
        textAnchor={textAnchor}
      >
        <tspan x={x} dy="0em">{payload.value}</tspan>
      </text>
    </g>
  );
};

export const PentagonChart: React.FC<PentagonChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px] sm:h-[350px] flex justify-center items-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data.axes}>
          {/* Darker Grid */}
          <PolarGrid gridType="polygon" stroke="#1e293b" strokeWidth={1.5} />
          
          <PolarAngleAxis 
            dataKey="label" 
            tick={(props) => <CustomTick {...props} />} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          
          {/* Glowing Radar Effect */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4}/>
            </linearGradient>
          </defs>

          <Radar
            name={data.title}
            dataKey="value"
            stroke="#22d3ee" // Cyan 400
            strokeWidth={2}
            fill="url(#radarGradient)"
            fillOpacity={0.5}
            isAnimationActive={true}
            filter="url(#glow)"
          />
          <Tooltip 
            formatter={(value: number) => [value, 'Score']}
            contentStyle={{ 
              backgroundColor: '#0f172a',
              borderRadius: '8px', 
              border: '1px solid #1e293b', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#f1f5f9'
            }}
            itemStyle={{ color: '#22d3ee' }}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Central HUD Elements */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex justify-center items-center">
        <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping absolute"></div>
        <div className="w-32 h-32 border border-slate-800 rounded-full absolute opacity-20"></div>
        <div className="w-48 h-48 border border-slate-800 rounded-full absolute opacity-10 border-dashed"></div>
      </div>
    </div>
  );
};

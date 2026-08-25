import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

interface SynergyRadarProps {
  scores: {
    technicalCoverage: number;
    archetypeBalance: number;
    communicationPace: number;
    bandwidthReliability: number;
    innovationIndex: number;
  };
  targetScores?: {
    technicalCoverage: number;
    archetypeBalance: number;
    communicationPace: number;
    bandwidthReliability: number;
    innovationIndex: number;
  };
  overallScore: number;
}

export const SynergyRadar: React.FC<SynergyRadarProps> = ({
  scores,
  targetScores,
  overallScore,
}) => {
  const dimensions = [
    { key: 'technicalCoverage', label: 'Tech Coverage', val: scores.technicalCoverage, target: targetScores?.technicalCoverage || 90 },
    { key: 'archetypeBalance', label: 'Archetype Balance', val: scores.archetypeBalance, target: targetScores?.archetypeBalance || 85 },
    { key: 'communicationPace', label: 'Style Harmony', val: scores.communicationPace, target: targetScores?.communicationPace || 88 },
    { key: 'bandwidthReliability', label: 'Bandwidth Stability', val: scores.bandwidthReliability, target: targetScores?.bandwidthReliability || 90 },
    { key: 'innovationIndex', label: 'Innovation Index', val: scores.innovationIndex, target: targetScores?.innovationIndex || 95 },
  ];

  const size = 260;
  const center = size / 2;
  const radius = 95;
  const totalAxes = dimensions.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate background concentric polygons (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  // Polygon path for current team
  const currentPoints = dimensions.map((d, i) => {
    const { x, y } = getCoordinates(i, Math.max(10, d.val));
    return `${x},${y}`;
  }).join(' ');

  // Polygon path for target
  const targetPoints = targetScores ? dimensions.map((d, i) => {
    const { x, y } = getCoordinates(i, d.target);
    return `${x},${y}`;
  }).join(' ') : null;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
          <h3 className="font-bold text-sm text-slate-800 tracking-tight">Synergy Radar Matrix</h3>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-medium text-slate-500">
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-indigo-600 mr-1" />
            Current ({overallScore}%)
          </span>
          {targetScores && (
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-slate-300 border border-slate-400 mr-1" />
              Target Blueprint
            </span>
          )}
        </div>
      </div>

      {/* SVG Radar */}
      <div className="relative my-1">
        <svg width={size} height={size} className="overflow-visible">
          {/* Concentric rings */}
          {gridLevels.map((lvl, idx) => {
            const ringPoints = dimensions.map((_, i) => {
              const { x, y } = getCoordinates(i, lvl * 100);
              return `${x},${y}`;
            }).join(' ');
            return (
              <polygon
                key={idx}
                points={ringPoints}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth={idx === gridLevels.length - 1 ? "1.5" : "1"}
                strokeDasharray={idx === gridLevels.length - 1 ? "none" : "3,3"}
              />
            );
          })}

          {/* Axes */}
          {dimensions.map((_, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
            );
          })}

          {/* Target polygon (dashed) */}
          {targetPoints && (
            <polygon
              points={targetPoints}
              fill="rgba(148, 163, 184, 0.12)"
              stroke="#94A3B8"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />
          )}

          {/* Current score polygon */}
          <polygon
            points={currentPoints}
            fill="rgba(79, 70, 229, 0.22)"
            stroke="#4F46E5"
            strokeWidth="2.5"
            className="transition-all duration-500 ease-out"
          />

          {/* Radar vertex dots */}
          {dimensions.map((d, i) => {
            const { x, y } = getCoordinates(i, Math.max(10, d.val));
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4.5"
                fill="#4F46E5"
                stroke="#FFFFFF"
                strokeWidth="2"
                className="transition-all duration-500 ease-out shadow-sm"
              />
            );
          })}
        </svg>

        {/* Dimension labels placed around radar */}
        <div className="absolute inset-0 pointer-events-none">
          {dimensions.map((d, i) => {
            const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
            const labelRadius = radius + 24;
            const x = center + labelRadius * Math.cos(angle);
            const y = center + labelRadius * Math.sin(angle);

            return (
              <div
                key={i}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute text-center whitespace-nowrap"
              >
                <span className="text-[11px] font-bold text-slate-700 bg-white/90 px-1.5 py-0.5 rounded shadow-xs border border-slate-100">
                  {d.label} <span className="text-indigo-600">{d.val}%</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metric summary grid */}
      <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Tech Coverage</p>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-sm font-bold text-slate-900">{scores.technicalCoverage}%</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              scores.technicalCoverage >= 85 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {scores.technicalCoverage >= 85 ? 'Optimized' : 'Gap Detected'}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Archetype Diversity</p>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-sm font-bold text-slate-900">{scores.archetypeBalance}%</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              scores.archetypeBalance >= 80 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'
            }`}>
              {scores.archetypeBalance >= 80 ? 'Balanced' : 'Monolithic'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { UserCandidate } from '../types';
import { X, Award, ExternalLink, CheckCircle, Code2, Sparkles, ShieldCheck, Github, Globe } from 'lucide-react';

interface SkillRadarModalProps {
  candidate: UserCandidate | null;
  onClose: () => void;
  onAddToTeam?: (candidate: UserCandidate) => void;
  isInTeam?: boolean;
}

export const SkillRadarModal: React.FC<SkillRadarModalProps> = ({
  candidate,
  onClose,
  onAddToTeam,
  isInTeam = false
}) => {
  if (!candidate) return null;

  const scores = candidate.extractedSkillScores || {
    dsa: 80,
    web: 80,
    ml: 70,
    design: 60,
    pitch: 70,
    systems: 75
  };

  const axes = [
    { label: 'Data Structures & Alg (DSA)', score: scores.dsa, key: 'dsa' },
    { label: 'Web & App Dev', score: scores.web, key: 'web' },
    { label: 'AI & Machine Learning', score: scores.ml, key: 'ml' },
    { label: 'UI/UX & Design', score: scores.design, key: 'design' },
    { label: 'Pitch, Strategy & Biz', score: scores.pitch, key: 'pitch' },
    { label: 'Systems & Architecture', score: scores.systems, key: 'systems' }
  ];

  // SVG Radar Polygon calculations
  const size = 300;
  const center = size / 2;
  const radius = size * 0.38;
  const totalAxes = axes.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const points = axes.map((axis, i) => {
    const { x, y } = getCoordinates(i, axis.score);
    return `${x},${y}`;
  }).join(' ');

  const gridCircles = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="skill-radar-modal"
        className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-lg">{candidate.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {candidate.gender}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700">
                  {candidate.department}
                </span>
              </div>
              <p className="text-xs text-slate-500">{candidate.college} • {candidate.yearOfStudy}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Radar Visualization + Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* SVG Radar Chart */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50/60 rounded-2xl border border-slate-200/80">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                6-Axis Verified Competency Radar
              </span>
              <svg width={size} height={size} className="overflow-visible">
                {/* Background Grid */}
                {gridCircles.map((factor, idx) => (
                  <circle
                    key={idx}
                    cx={center}
                    cy={center}
                    r={radius * factor}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    strokeDasharray={idx < 3 ? '3,3' : undefined}
                  />
                ))}

                {/* Axes lines */}
                {axes.map((_, i) => {
                  const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
                  const x = center + radius * Math.cos(angle);
                  const y = center + radius * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1={center}
                      y1={center}
                      x2={x}
                      y2={y}
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Data Polygon */}
                <polygon
                  points={points}
                  fill="rgba(79, 70, 229, 0.25)"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />

                {/* Data Points & Labels */}
                {axes.map((axis, i) => {
                  const { x, y } = getCoordinates(i, axis.score);
                  const labelAngle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
                  const labelRadius = radius + 22;
                  const lx = center + labelRadius * Math.cos(labelAngle);
                  const ly = center + labelRadius * Math.sin(labelAngle);

                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="4" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                      <text
                        x={lx}
                        y={ly}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-[10px] font-bold fill-slate-700"
                      >
                        {axis.key.toUpperCase()} ({axis.score})
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-2">
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-indigo-600 mr-1"></span> Verified Score Profile</span>
              </div>
            </div>

            {/* Verified Scores Breakdown & Proof Handles */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Proof-Backed Coding Handles
              </h4>

              <div className="space-y-2">
                {candidate.codingHandles?.leetcode && (
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/70 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <Code2 className="w-4 h-4 text-amber-600" />
                      <div>
                        <span className="font-bold text-slate-900 text-xs">LeetCode: @{candidate.codingHandles.leetcode}</span>
                        <p className="text-[11px] text-amber-800 font-medium">
                          {candidate.codingHandles.leetcodeProblems}+ Solved • Rating: {candidate.codingHandles.leetcodeRating}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/60 text-amber-900">
                      Verified
                    </span>
                  </div>
                )}

                {candidate.codingHandles?.github && (
                  <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <Github className="w-4 h-4 text-slate-300" />
                      <div>
                        <span className="font-bold text-xs">GitHub: @{candidate.codingHandles.github}</span>
                        <p className="text-[11px] text-slate-300">
                          {candidate.codingHandles.githubRepos} Repositories • {candidate.codingHandles.githubCommits}+ Commits
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white">
                      Active
                    </span>
                  </div>
                )}

                {candidate.codingHandles?.codechef && (
                  <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <Award className="w-4 h-4 text-orange-600" />
                      <div>
                        <span className="font-bold text-slate-900 text-xs">CodeChef: @{candidate.codingHandles.codechef}</span>
                        <p className="text-[11px] text-orange-800">
                          {candidate.codingHandles.codechefStars} • Rating: {candidate.codingHandles.codechefRating}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-200 text-orange-900">
                      Verified
                    </span>
                  </div>
                )}
              </div>

              {/* Verified Badges */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Verified Evidence Badges
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.verifiedBadges.map((badge, idx) => (
                    <span key={idx} className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scores Meter Bars */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Calibrated 6-Axis Competency Breakdown
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {axes.map((axis, i) => (
                <div key={i} className="p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-700 truncate pr-1">{axis.label}</span>
                    <span className="font-bold text-indigo-700">{axis.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${axis.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Evidence-Based Skills & Supporting Proof */}
          {candidate.inferredSkills && candidate.inferredSkills.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Evidence-Based Skill Profiling ({candidate.inferredSkills.length})</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">Multi-source corroboration</span>
              </div>

              <div className="space-y-2">
                {candidate.inferredSkills.map((skill, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{skill.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({skill.category})</span>
                        <div className="flex items-center space-x-1">
                          {skill.sources.map((s, sI) => (
                            <span key={sI} className="text-[9px] font-semibold px-1.5 py-0.2 bg-white text-slate-700 rounded border border-slate-200">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        skill.confidence === 'High'
                          ? 'bg-emerald-100 text-emerald-800'
                          : skill.confidence === 'Medium'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        Confidence: {skill.confidence} ({skill.confidenceScore}%)
                      </span>
                    </div>

                    {skill.supportingEvidence && skill.supportingEvidence.length > 0 && (
                      <ul className="mt-2 space-y-1 text-[11px] text-slate-600 pl-1">
                        {skill.supportingEvidence.map((ev, eI) => (
                          <li key={eI} className="flex items-start space-x-1.5">
                            <span className="text-indigo-500 font-bold">•</span>
                            <span>{ev}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Scores inferred from verified public code activity, repositories & contest benchmarks.</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl"
            >
              Close
            </button>
            {onAddToTeam && !isInTeam && (
              <button
                onClick={() => {
                  onAddToTeam(candidate);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
              >
                Add to Team
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

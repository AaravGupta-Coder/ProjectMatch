import React from 'react';
import { UserCandidate, ProjectRequirement } from '../types';
import { ShieldAlert, CheckCircle2, Layers, Cpu, Code, Palette, Mic, Database, Server, Radio } from 'lucide-react';

interface TeamCoverageHeatmapProps {
  team: UserCandidate[];
  project: ProjectRequirement;
}

export const TeamCoverageHeatmap: React.FC<TeamCoverageHeatmapProps> = ({
  team,
  project
}) => {
  const domains = [
    {
      name: 'Frontend & Web',
      icon: Code,
      key: 'web',
      check: (m: UserCandidate) => m.extractedSkillScores.web >= 70 || m.topSkills.some(s => ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'].includes(s)),
      score: (m: UserCandidate) => m.extractedSkillScores.web
    },
    {
      name: 'Backend & Systems',
      icon: Server,
      key: 'systems',
      check: (m: UserCandidate) => m.extractedSkillScores.systems >= 70 || m.topSkills.some(s => ['Go', 'Rust', 'PostgreSQL', 'Docker', 'Node.js'].includes(s)),
      score: (m: UserCandidate) => m.extractedSkillScores.systems
    },
    {
      name: 'AI / Machine Learning',
      icon: Cpu,
      key: 'ml',
      check: (m: UserCandidate) => m.extractedSkillScores.ml >= 70 || m.topSkills.some(s => ['Python', 'PyTorch', 'Gemini', 'FastAPI'].includes(s)),
      score: (m: UserCandidate) => m.extractedSkillScores.ml
    },
    {
      name: 'UI/UX & Design',
      icon: Palette,
      key: 'design',
      check: (m: UserCandidate) => m.extractedSkillScores.design >= 70 || m.topSkills.some(s => ['Figma', 'Motion UI', 'Design Systems'].includes(s)),
      score: (m: UserCandidate) => m.extractedSkillScores.design
    },
    {
      name: 'Pitch & Strategy',
      icon: Mic,
      key: 'pitch',
      check: (m: UserCandidate) => m.extractedSkillScores.pitch >= 70 || m.topSkills.some(s => ['Pitch Deck Pitching', 'Product Strategy', 'User Interviews'].includes(s)),
      score: (m: UserCandidate) => m.extractedSkillScores.pitch
    },
    {
      name: 'DSA & Algorithms',
      icon: Database,
      key: 'dsa',
      check: (m: UserCandidate) => m.extractedSkillScores.dsa >= 75 || (m.codingHandles?.leetcodeProblems && m.codingHandles.leetcodeProblems >= 300),
      score: (m: UserCandidate) => m.extractedSkillScores.dsa
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Team Capability Heatmap</h4>
            <p className="text-[11px] text-slate-500">Cross-domain coverage matrix for current team roster</p>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          {team.length} {team.length === 1 ? 'Member' : 'Members'} Active
        </span>
      </div>

      {team.length === 0 ? (
        <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Add members to the workbench to compute capability heatmap.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {domains.map((domain, i) => {
            const Icon = domain.icon;
            const qualifiedMembers = team.filter(domain.check);
            const maxScore = team.length > 0 ? Math.max(...team.map(domain.score)) : 0;
            const isDeficit = qualifiedMembers.length === 0;
            const isRedundant = qualifiedMembers.length > 2;

            let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            let statusText = 'Covered';

            if (isDeficit) {
              badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
              statusText = 'Critical Gap';
            } else if (isRedundant) {
              badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
              statusText = 'Role Redundancy';
            }

            return (
              <div
                key={i}
                className={`p-3 rounded-xl border transition-all ${
                  isDeficit 
                    ? 'bg-rose-50/20 border-rose-200/80' 
                    : 'bg-slate-50/70 border-slate-200/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-1.5 rounded-lg ${isDeficit ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">{domain.name}</span>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        {qualifiedMembers.length > 0 ? (
                          qualifiedMembers.map((qm, idx) => (
                            <span key={idx} className="text-[10px] font-medium bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-700">
                              {qm.name.split(' ')[0]} ({domain.score(qm)})
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-rose-600 font-semibold">No specialized lead assigned</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 block">{maxScore}%</span>
                      <span className="text-[9px] text-slate-400 uppercase">Max Depth</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      {statusText}
                    </span>
                  </div>
                </div>

                {/* Depth bar */}
                <div className="mt-2 w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isDeficit ? 'bg-rose-500' : maxScore > 85 ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${maxScore}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { ProjectRequirement, UserCandidate, PrimaryRole } from '../types';
import { Sparkles, Users, Award, CheckCircle, ArrowRight, Send, Briefcase, GraduationCap, Code2, Layers, Check } from 'lucide-react';

interface SoloProjectBoardProps {
  projects: ProjectRequirement[];
  activeCandidate: UserCandidate;
  onApplyToProject: (projectId: string, projectTitle: string, pitch: string) => void;
  onSelectProjectForLeadMode?: (project: ProjectRequirement) => void;
}

export const SoloProjectBoard: React.FC<SoloProjectBoardProps> = ({
  projects,
  activeCandidate,
  onApplyToProject,
  onSelectProjectForLeadMode
}) => {
  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const [appliedProjects, setAppliedProjects] = useState<string[]>([]);
  const [pitchNotes, setPitchNotes] = useState<{ [key: string]: string }>({});

  const tracks = ['All', 'Smart India Hackathon', 'Healthcare', 'Robotics & Disaster Management', 'Renewable Energy'];

  const filteredProjects = projects.filter(p => {
    if (selectedTrack === 'All') return true;
    return p.track.toLowerCase().includes(selectedTrack.toLowerCase()) ||
      p.competitionContext.toLowerCase().includes(selectedTrack.toLowerCase());
  });

  const handleApply = (proj: ProjectRequirement) => {
    const note = pitchNotes[proj.id] || `Hi! I would love to join ${proj.title} as your ${activeCandidate.primaryRole}. I have verified skills in ${activeCandidate.topSkills.slice(0, 3).join(', ')}.`;
    onApplyToProject(proj.id, proj.title, note);
    setAppliedProjects(prev => [...prev, proj.id]);
  };

  return (
    <div className="space-y-6">
      {/* Solo Builder Persona Banner */}
      <div className="p-5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={activeCandidate.avatar}
            alt={activeCandidate.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-400/50 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                Solo Builder Mode (Flow B)
              </span>
              <span className="text-xs text-slate-300 font-semibold">{activeCandidate.name}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Discover Hackathon & College Projects Seeking Your Skillset
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Your profile is matched against open vacancies requiring: <strong>{activeCandidate.primaryRole}</strong> ({activeCandidate.archetype})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-right">
          <div className="bg-white/10 px-3.5 py-2 rounded-2xl border border-white/10 text-center">
            <span className="text-xs text-indigo-200 block font-medium">Verified Score</span>
            <span className="text-lg font-bold text-white">{activeCandidate.technicalScore}/100</span>
          </div>
          <div className="bg-white/10 px-3.5 py-2 rounded-2xl border border-white/10 text-center">
            <span className="text-xs text-emerald-300 block font-medium">Available</span>
            <span className="text-lg font-bold text-white">{activeCandidate.weeklyAvailabilityHours}h/wk</span>
          </div>
        </div>
      </div>

      {/* Track Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-500 mr-1 flex items-center">
          <Layers className="w-3.5 h-3.5 mr-1" />
          Filter Track:
        </span>
        {tracks.map((t, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedTrack(t)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTrack === t
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => {
          const isApplied = appliedProjects.includes(proj.id);
          const needsMyRole = proj.requiredRoles.some(r => 
            r.role.toLowerCase().includes(activeCandidate.primaryRole.toLowerCase()) ||
            activeCandidate.primaryRole.toLowerCase().includes(r.role.toLowerCase())
          );
          const matchPercent = needsMyRole ? 94 : 78;

          return (
            <div
              key={proj.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header match badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {proj.track}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>{matchPercent}% Match</span>
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {proj.title}
                </h3>
                <p className="text-xs text-indigo-600 font-semibold mt-1">
                  {proj.competitionContext}
                </p>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {proj.description}
                </p>

                {/* Creator info */}
                <div className="mt-3.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Project Lead</span>
                    <span className="font-bold text-slate-800">{proj.creatorName || 'Aarav Sharma'}</span>
                    <span className="text-[11px] text-slate-500"> ({proj.creatorCollege || 'IIT Bombay'})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Team Size</span>
                    <span className="font-bold text-slate-800">Target: {proj.targetTeamSize}</span>
                  </div>
                </div>

                {/* SIH / Rules tag */}
                {proj.sihConstraints && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {proj.sihConstraints.requireFemaleMember && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-200">
                        ♀️ SIH Female Rule Active
                      </span>
                    )}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      🏛️ {proj.sihConstraints.minDepartments}+ Branch Mix
                    </span>
                  </div>
                )}

                {/* Open Roles Needed */}
                <div className="mt-3.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Critical Roles Needed:
                  </span>
                  <div className="space-y-1">
                    {proj.requiredRoles.map((r, i) => {
                      const isMe = r.role.toLowerCase().includes(activeCandidate.primaryRole.toLowerCase());
                      return (
                        <div
                          key={i}
                          className={`text-xs p-1.5 rounded-lg flex items-center justify-between border ${
                            isMe 
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold' 
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{r.role}</span>
                          {isMe && (
                            <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-bold">
                              Matches You!
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Tri-Vector Complementarity Callout */}
                <div className="mt-3 p-2.5 bg-indigo-900/5 border border-indigo-200/60 rounded-xl text-[11px] space-y-1 text-slate-700">
                  <span className="font-bold text-indigo-700 flex items-center space-x-1 text-[10px] uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 mr-0.5" />
                    AI Synergy Triangulation
                  </span>
                  <p className="leading-tight">
                    They need a person with <strong className="text-indigo-900">{activeCandidate.topSkills.slice(0, 2).join(', ')}</strong> because their lead has <strong className="text-slate-900">Distributed Backend & Systems</strong> and this project requires <strong className="text-indigo-900">{proj.criticalTechStack.slice(0, 2).join(', ')}</strong>.
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {onSelectProjectForLeadMode && (
                  <button
                    onClick={() => onSelectProjectForLeadMode(proj)}
                    className="text-xs font-semibold text-slate-500 hover:text-indigo-600"
                  >
                    View in Workbench
                  </button>
                )}

                {isApplied ? (
                  <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied / Expressed Interest</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleApply(proj)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Express Interest</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  UserCandidate, 
  ProjectRequirement, 
  TeamSynergyAnalysis, 
  TeamInvite,
  PrimaryRole,
  Archetype
} from '../types';
import { 
  simulateCandidateDelta, 
  computeLocalTeamScore 
} from '../utils/synergyEngine';
import { 
  Sparkles, 
  Search, 
  Users, 
  UserPlus, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  Sliders, 
  Github, 
  Code2, 
  Award, 
  Star, 
  Briefcase, 
  Plus, 
  X, 
  Layers, 
  Send,
  HelpCircle,
  Eye,
  Trash2
} from 'lucide-react';

interface CreateTeamDashboardProps {
  currentUser: UserCandidate;
  project: ProjectRequirement;
  projects: ProjectRequirement[];
  currentTeam: UserCandidate[];
  allCandidates: UserCandidate[];
  synergyAnalysis: TeamSynergyAnalysis;
  invites: TeamInvite[];
  onAddToTeam: (candidate: UserCandidate) => void;
  onRemoveFromTeam: (candidateId: string) => void;
  onSelectProject: (presetId: string) => void;
  onSendInvite: (candidate: UserCandidate, pitchMessage?: string) => void;
  onSwitchIntent: () => void;
  onInspectRadar: (candidate: UserCandidate) => void;
}

export const CreateTeamDashboard: React.FC<CreateTeamDashboardProps> = ({
  currentUser,
  project,
  projects,
  currentTeam,
  allCandidates,
  synergyAnalysis,
  invites,
  onAddToTeam,
  onRemoveFromTeam,
  onSelectProject,
  onSendInvite,
  onSwitchIntent,
  onInspectRadar
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [selectedArchetypeFilter, setSelectedArchetypeFilter] = useState('all');
  const [minDeltaScore, setMinDeltaScore] = useState<number>(0);
  const [inviteModalCandidate, setInviteModalCandidate] = useState<UserCandidate | null>(null);
  const [invitePitch, setInvitePitch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Compute current team baseline score
  const baseScoreData = useMemo(() => {
    return computeLocalTeamScore(currentTeam, project);
  }, [currentTeam, project]);

  // Candidates who are not already on the team
  const availableCandidates = useMemo(() => {
    return allCandidates.filter(c => !currentTeam.some(m => m.id === c.id));
  }, [allCandidates, currentTeam]);

  // Compute "How They Can Contribute" and "Projected Team Score" for each candidate
  const candidatesWithAnalysis = useMemo(() => {
    return availableCandidates.map(candidate => {
      const delta = simulateCandidateDelta(candidate, currentTeam, project);
      
      const contributions: string[] = [];

      // 1. Role match
      const matchingRole = project.requiredRoles.find(
        r => r.role === candidate.primaryRole || r.archetype === candidate.archetype
      );
      if (matchingRole) {
        contributions.push(`Directly satisfies required role: "${matchingRole.role}".`);
      } else {
        contributions.push(`Provides high-leverage ${candidate.archetype} capability.`);
      }

      // 2. Technical Stack overlap
      const techMatches = candidate.topSkills.filter(sk => 
        project.criticalTechStack.some(ts => ts.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(ts.toLowerCase()))
      );
      if (techMatches.length > 0) {
        contributions.push(`Brings core project tech: ${techMatches.slice(0, 3).join(', ')}.`);
      }

      // 3. Department & Diversity
      const currentBranches = new Set(currentTeam.map(m => m.department));
      if (!currentBranches.has(candidate.department)) {
        contributions.push(`Broadens multidisciplinary branch mix (${candidate.department}).`);
      }

      const hasFemale = currentTeam.some(m => m.gender === 'Female');
      if (!hasFemale && candidate.gender === 'Female') {
        contributions.push('Satisfies team gender diversity criteria (+12 score boost).');
      }

      // 4. Bandwidth Quorum
      contributions.push(`Adds ${candidate.weeklyAvailabilityHours} hrs/week active sprint bandwidth.`);

      return {
        candidate,
        delta,
        contributions,
        projectedTeamScore: delta.projectedScore,
        scoreDelta: delta.delta
      };
    }).filter(item => {
      const matchesSearch = 
        item.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.candidate.primaryRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.candidate.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.candidate.topSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole = selectedRoleFilter === 'all' || item.candidate.primaryRole === selectedRoleFilter;
      const matchesArchetype = selectedArchetypeFilter === 'all' || item.candidate.archetype === selectedArchetypeFilter;
      const matchesDelta = item.scoreDelta >= minDeltaScore;

      return matchesSearch && matchesRole && matchesArchetype && matchesDelta;
    }).sort((a, b) => b.scoreDelta - a.scoreDelta);
  }, [availableCandidates, currentTeam, project, searchQuery, selectedRoleFilter, selectedArchetypeFilter, minDeltaScore]);

  const handleOpenInviteModal = (candidate: UserCandidate) => {
    setInviteModalCandidate(candidate);
    setInvitePitch(
      `Hi ${candidate.name}! I am leading "${project.title}" for ${project.track}. We are looking for a stellar ${candidate.primaryRole} (${candidate.archetype}). Based on our synergy engine, adding you boosts our team score to ${Math.min(baseScoreData.score + 14, 98)}/100! Would you like to join forces?`
    );
  };

  const handleSendInviteConfirm = () => {
    if (!inviteModalCandidate) return;
    onSendInvite(inviteModalCandidate, invitePitch);
    showToast(`Invite dispatched to ${inviteModalCandidate.name}!`);
    setInviteModalCandidate(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-700 animate-in slide-in-from-bottom-4 duration-200">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Team Leader Command Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-purple-900/60">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>👑 Team Leader Mode Active</span>
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Leading Project: <strong className="text-white">{project.title}</strong>
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Recruit High-Synergy Individuals
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Browse available candidates ready to join hackathons. See how each individual can contribute and simulate what your team score becomes before sending invites or locking slots.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Project Switcher */}
            <select
              value={project.id}
              onChange={(e) => onSelectProject(e.target.value)}
              className="bg-slate-900 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  Project: {p.title} ({p.targetTeamSize} Max)
                </option>
              ))}
            </select>

            <button
              onClick={onSwitchIntent}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors flex items-center space-x-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Switch to "Join Teams" Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Team Score & Roster Status Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-mono font-black text-xl text-indigo-700">
              {baseScoreData.score}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">Current Team Score: {baseScoreData.score}/100</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  baseScoreData.score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {baseScoreData.verdict}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {currentTeam.length}/{project.targetTeamSize || 4} Roster Slots Filled • {baseScoreData.missingRoles.length} Vacancies Remaining
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              Role Coverage: <strong className="text-slate-900 font-mono">{baseScoreData.roleCoverageScore}/30</strong>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              Skill Breadth: <strong className="text-slate-900 font-mono">{baseScoreData.skillBreadthScore}/25</strong>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              Team Diversity: <strong className="text-slate-900 font-mono">{baseScoreData.compliance.isFullyCompliant ? '100%' : 'Needs ♀'}</strong>
            </div>
          </div>
        </div>

        {/* Current Roster Horizontal Grid */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Current Confirmed Roster:
          </span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {currentTeam.map((member) => (
              <div
                key={member.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-xl object-cover border border-slate-300 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{member.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{member.primaryRole}</p>
                    <p className="text-[9px] text-indigo-600 font-semibold truncate">{member.archetype}</p>
                  </div>
                </div>

                {currentTeam.length > 1 && (
                  <button
                    onClick={() => onRemoveFromTeam(member.id)}
                    title="Remove from roster"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            {Array.from({ length: Math.max(0, (project.targetTeamSize || 4) - currentTeam.length) }).map((_, emptyIdx) => (
              <div
                key={emptyIdx}
                className="p-3 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs font-semibold bg-white/50"
              >
                <span>+ Open Vacancy Slot</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates, skills, colleges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="UI/UX Product Designer">UI/UX Product Designer</option>
            <option value="Full-Stack Engineer">Full-Stack Engineer</option>
            <option value="AI / ML Specialist">AI / ML Specialist</option>
            <option value="Hardware & Embedded Engineer">Hardware & Embedded Engineer</option>
            <option value="Domain & Product Strategist">Domain & Product Strategist</option>
            <option value="Mobile & Cross-Platform Engineer">Mobile & Cross-Platform Engineer</option>
          </select>

          <select
            value={selectedArchetypeFilter}
            onChange={(e) => setSelectedArchetypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Archetypes</option>
            <option value="UX Crafter">UX Crafter</option>
            <option value="Speed Builder / Hacker">Speed Builder / Hacker</option>
            <option value="System Architect">System Architect</option>
            <option value="Quantitative Mind">Quantitative Mind</option>
            <option value="Visionary & Domain Lead">Visionary & Domain Lead</option>
          </select>

          <select
            value={minDeltaScore}
            onChange={(e) => setMinDeltaScore(Number(e.target.value))}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-indigo-500"
          >
            <option value={0}>All Score Deltas</option>
            <option value={10}>Boost &gt; +10 pts</option>
            <option value={15}>Boost &gt; +15 pts (Max Synergy)</option>
          </select>

          {(searchQuery || selectedRoleFilter !== 'all' || selectedArchetypeFilter !== 'all' || minDeltaScore > 0) && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedRoleFilter('all'); setSelectedArchetypeFilter('all'); setMinDeltaScore(0); }}
              className="text-xs text-slate-500 hover:text-slate-900 font-bold px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Individuals Ready to Join Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <span>Individuals Ready to Join Projects ({candidatesWithAnalysis.length})</span>
          </h2>
          <span className="text-xs text-slate-500">
            Sorted by projected synergy delta boost
          </span>
        </div>

        {candidatesWithAnalysis.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Individuals Match Your Filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your role or archetype filters to see more available builders.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidatesWithAnalysis.map((item) => {
              const { candidate, projectedTeamScore, scoreDelta, contributions } = item;
              const isHighBoost = scoreDelta >= 12;

              return (
                <div
                  key={candidate.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header: Candidate Info & Projected Score Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3.5">
                        <img
                          src={candidate.avatar}
                          alt={candidate.name}
                          referrerPolicy="no-referrer"
                          className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                        />
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h3 className="text-sm font-extrabold text-slate-900">{candidate.name}</h3>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              {candidate.gender === 'Female' ? '♀ Diversity' : `${candidate.weeklyAvailabilityHours}h/wk`}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-indigo-600">{candidate.primaryRole}</p>
                          <p className="text-[11px] text-slate-500">{candidate.college.split(',')[0]} • {candidate.academicYear}</p>
                          <p className="text-[10px] font-medium text-purple-700 font-mono mt-0.5">{candidate.archetype}</p>
                        </div>
                      </div>

                      {/* PROJECTED TEAM SCORE & DELTA (Key User Requirement) */}
                      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-3 rounded-2xl text-right min-w-[135px] shrink-0 border border-slate-800 shadow-xs">
                        <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider block">
                          If Added to Team
                        </span>
                        <div className="flex items-baseline justify-end space-x-1">
                          <span className="text-lg font-black font-mono text-emerald-400">
                            {projectedTeamScore}
                          </span>
                          <span className="text-[10px] text-slate-400">/100</span>
                        </div>
                        <span className={`text-[10px] font-extrabold ${scoreDelta > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {scoreDelta > 0 ? `+${scoreDelta} Synergy Boost` : 'Even Fit'}
                        </span>
                      </div>
                    </div>

                    {/* Bio Snippet */}
                    <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{candidate.bio}"
                    </p>

                    {/* HOW THEY CAN CONTRIBUTE (Key User Requirement) */}
                    <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-3.5 space-y-2">
                      <span className="text-xs font-bold text-indigo-900 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>How {candidate.name} Can Contribute:</span>
                      </span>
                      <ul className="space-y-1 text-xs text-indigo-950">
                        {contributions.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-1">
                      {candidate.topSkills.map((sk, sIdx) => (
                        <span key={sIdx} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons: Instant Add or Send Pitch Invite */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onInspectRadar(candidate)}
                      className="text-xs font-bold text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Compare Radar</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenInviteModal(candidate)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Pitch / Invite</span>
                      </button>

                      <button
                        onClick={() => {
                          onAddToTeam(candidate);
                          showToast(`Added ${candidate.name} to team roster! Score updated.`);
                        }}
                        disabled={currentTeam.some(m => m.id === candidate.id) || currentTeam.length >= (project.targetTeamSize || 4)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Add to Team</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* INVITE MODAL */}
      {inviteModalCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  Leader Pitch Invite
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Invite {inviteModalCandidate.name} to Your Team
                </h3>
              </div>
              <button
                onClick={() => setInviteModalCandidate(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Send a personalized recruitment pitch to <strong>{inviteModalCandidate.name}</strong> ({inviteModalCandidate.primaryRole}) outlining their role in <strong>{project.title}</strong>.
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pitch Message & Projected Role</label>
                <textarea
                  rows={4}
                  value={invitePitch}
                  onChange={(e) => setInvitePitch(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 leading-relaxed focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInviteModalCandidate(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendInviteConfirm}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Recruitment Invite</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

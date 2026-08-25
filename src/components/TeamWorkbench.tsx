import React, { useState } from 'react';
import { 
  UserCandidate, 
  ProjectRequirement, 
  TeamSynergyAnalysis, 
  Archetype 
} from '../types';
import { SynergyRadar } from './SynergyRadar';
import { TeamCoverageHeatmap } from './TeamCoverageHeatmap';
import { AISkillGapSuggestionCard } from './AISkillGapSuggestionCard';
import { calculateSIHCompliance } from '../utils/synergyEngine';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Zap, 
  Clock, 
  Target, 
  Award, 
  ShieldAlert, 
  HelpCircle,
  Share2,
  Lock,
  Radar,
  Send,
  Building2,
  HeartHandshake,
  CheckCircle
} from 'lucide-react';

interface TeamWorkbenchProps {
  currentTeam: UserCandidate[];
  allCandidates: UserCandidate[];
  project: ProjectRequirement;
  synergyAnalysis: TeamSynergyAnalysis;
  isLoadingSynergy: boolean;
  currentUser?: UserCandidate;
  onAddToTeam: (candidate: UserCandidate) => void;
  onRemoveFromTeam: (candidateId: string) => void;
  onTriggerDeepAudit: () => void;
  onNavigateToDiscovery: () => void;
  onNavigateToDiscoveryWithFilter?: (skillQuery: string) => void;
  onNavigateToCharter: () => void;
  onOpenRadarModal?: (candidate: UserCandidate) => void;
  onOpenContactModal?: (candidate: UserCandidate) => void;
}

export const TeamWorkbench: React.FC<TeamWorkbenchProps> = ({
  currentTeam,
  allCandidates,
  project,
  synergyAnalysis,
  isLoadingSynergy,
  currentUser,
  onAddToTeam,
  onRemoveFromTeam,
  onTriggerDeepAudit,
  onNavigateToDiscovery,
  onNavigateToDiscoveryWithFilter,
  onNavigateToCharter,
  onOpenRadarModal,
  onOpenContactModal
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const [workbenchView, setWorkbenchView] = useState<'roster' | 'heatmap'>('roster');

  const targetSize = project.targetTeamSize || 4;
  const emptySlotsCount = Math.max(0, targetSize - currentTeam.length);

  // Compute live SIH compliance
  const sihCompliance = calculateSIHCompliance(currentTeam, project);

  // Find candidate that best satisfies recommended next addition or SIH gap
  const recommendedCandidate = allCandidates.find(c => {
    if (currentTeam.some(m => m.id === c.id)) return false;
    
    // Priority to SIH female requirement if not satisfied
    if (!sihCompliance.femaleMemberSatisfied && c.gender === 'Female') return true;
    
    // Priority to branch diversity if needed
    if (!sihCompliance.branchDiversitySatisfied && !currentTeam.some(m => m.department === c.department)) return true;

    if (synergyAnalysis.recommendedNextAddition) {
      const rec = synergyAnalysis.recommendedNextAddition.toLowerCase();
      if (c.primaryRole.toLowerCase().includes('designer') && rec.includes('designer')) return true;
      if (c.primaryRole.toLowerCase().includes('ai') && rec.includes('ai')) return true;
      if (c.archetype.toLowerCase().includes('ux') && rec.includes('ux')) return true;
      if (c.archetype.toLowerCase().includes('quant') && rec.includes('quant')) return true;
    }
    return false;
  }) || allCandidates.find(c => !currentTeam.some(m => m.id === c.id));

  // Count archetypes
  const archetypeCounts: Record<string, number> = {
    'System Architect': 0,
    'Speed Builder / Hacker': 0,
    'UX Crafter': 0,
    'Quantitative Mind': 0,
    'Visionary & Domain Lead': 0,
  };

  currentTeam.forEach(m => {
    if (archetypeCounts[m.archetype] !== undefined) {
      archetypeCounts[m.archetype]++;
    }
  });

  const totalWeeklyHours = currentTeam.reduce((acc, m) => acc + m.weeklyAvailabilityHours, 0);

  const triggerLockCelebration = () => {
    setIsLocked(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4F46E5', '#10B981', '#F59E0B', '#8B5CF6']
    });
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: '⚡ Apex Synergy', color: 'bg-emerald-500 text-white' };
    if (score >= 80) return { label: '🔥 High Chemistry', color: 'bg-indigo-600 text-white' };
    if (score >= 65) return { label: '⚠️ Moderate Balance', color: 'bg-amber-500 text-white' };
    return { label: '🚨 Critical Gap', color: 'bg-rose-500 text-white' };
  };

  const scoreBadge = getScoreBadge(synergyAnalysis.overallSynergyScore);

  return (
    <div className="space-y-6">
      
      {/* Project Context & Workbench Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {project.track}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Target: {project.targetTeamSize} Co-Founders / Engineers
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                Lead: {project.creatorName || 'Project Lead'} ({project.creatorCollege || 'Campus'})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {project.tagline}
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start lg:self-center">
            <button
              id="btn-trigger-ai-audit"
              onClick={onTriggerDeepAudit}
              disabled={isLoadingSynergy || currentTeam.length === 0}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isLoadingSynergy ? 'animate-spin' : ''}`} />
              <span>{isLoadingSynergy ? 'AI Auditing...' : 'Deep AI Synergy Audit'}</span>
            </button>

            <button
              id="btn-lock-team"
              onClick={triggerLockCelebration}
              disabled={currentTeam.length === 0}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition-all active:scale-98 disabled:opacity-50"
            >
              {isLocked ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>{isLocked ? 'Team Locked & Confirmed' : 'Lock Team Roster'}</span>
            </button>
          </div>
        </div>

        {/* Authorization / Sandbox Mode Banner */}
        {currentUser && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            {project.creatorId === currentUser.id || currentTeam.some(m => m.id === currentUser.id) ? (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>👑 Official Lead Roster Authority:</strong> You are actively managing this project's real roster. Member swaps update live assignments.</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full shrink-0">Official Roster</span>
              </div>
            ) : (
              <div className="p-3 bg-indigo-50/90 rounded-2xl border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-950">
                <div className="flex items-start sm:items-center space-x-2.5">
                  <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <span className="font-extrabold block">🧪 AI Sandbox & Squad Simulator Mode</span>
                    <span className="text-indigo-800 text-[11px]">
                      You are simulating team chemistry and SIH compliance for <strong>{project.title}</strong> as an exploratory builder. Modifying members lets you test what-if synergy before officially joining!
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onOpenContactModal && onOpenContactModal(allCandidates[0])}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shrink-0 shadow-2xs transition-colors"
                >
                  Join This Team Officially
                </button>
              </div>
            )}
          </div>
        )}

        {/* Smart India Hackathon (SIH) Compliance Checklist Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Smart India Hackathon (SIH) Institutional Constraint Validator
              </h4>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              sihCompliance.isFullyCompliant 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              {sihCompliance.isFullyCompliant ? '✓ All SIH Rules Satisfied' : '⚠️ SIH Gaps Pending'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Rule 1: Female Teammate */}
            <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
              sihCompliance.femaleMemberSatisfied
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/80 border-rose-200 text-rose-950'
            }`}>
              <div>
                <span className="font-bold block text-[11px]">Mandatory Female Member</span>
                <span className="text-[10px] text-slate-600">
                  {sihCompliance.femaleMemberSatisfied ? '✓ Satisfied' : '❌ Required by SIH'}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                sihCompliance.femaleMemberSatisfied ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
              }`}>
                {sihCompliance.femaleMemberCount} Present
              </span>
            </div>

            {/* Rule 2: Branch Mix */}
            <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
              sihCompliance.branchDiversitySatisfied
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}>
              <div>
                <span className="font-bold block text-[11px]">Cross-Department Mix</span>
                <span className="text-[10px] text-slate-600">
                  {sihCompliance.distinctBranchesCount} / {project.sihConstraints?.minDepartments || 2} Branches
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                sihCompliance.branchDiversitySatisfied ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
              }`}>
                {sihCompliance.branchDiversitySatisfied ? 'Diverse' : 'Add Branch'}
              </span>
            </div>

            {/* Rule 3: Target Team Size */}
            <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
              currentTeam.length === targetSize
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
            }`}>
              <div>
                <span className="font-bold block text-[11px]">Roster Quota</span>
                <span className="text-[10px] text-slate-600">
                  {currentTeam.length} of {targetSize} Seats Assigned
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900">
                {emptySlotsCount > 0 ? `${emptySlotsCount} Needed` : 'Full'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Skill Gap & Complementarity Suggestion Engine (Formula: Need X because you have Y and project needs Z) */}
      <AISkillGapSuggestionCard
        currentTeam={currentTeam}
        allCandidates={allCandidates}
        project={project}
        onAddToTeam={onAddToTeam}
        onNavigateToDiscoveryWithFilter={onNavigateToDiscoveryWithFilter}
        onOpenRadarModal={onOpenRadarModal}
        onOpenContactModal={onOpenContactModal}
      />

      {/* Main Grid: Workbench Slots on Left, Dynamic Chemistry Engine on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Team Roster Slots & Heatmap (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-900">Team Formation Roster</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {currentTeam.length} / {targetSize} Filled
              </span>
            </div>

            {/* Switch between Roster Cards & Capability Heatmap */}
            <div className="flex items-center space-x-2">
              <div className="bg-slate-100 p-0.5 rounded-xl flex text-xs font-semibold">
                <button
                  onClick={() => setWorkbenchView('roster')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    workbenchView === 'roster' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Roster
                </button>
                <button
                  onClick={() => setWorkbenchView('heatmap')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    workbenchView === 'heatmap' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Heatmap Matrix
                </button>
              </div>

              <button
                onClick={onNavigateToDiscovery}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center space-x-1"
              >
                <span>Find Talent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Workbench View Content */}
          {workbenchView === 'heatmap' ? (
            <TeamCoverageHeatmap team={currentTeam} project={project} />
          ) : (
            /* Active Members Grid */
            <div className="space-y-3">
              {currentTeam.map((member, index) => (
                <div
                  key={member.id}
                  id={`roster-slot-${member.id}`}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                        #{index + 1}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                          member.gender === 'Female' ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {member.gender}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-slate-100 text-slate-700">
                          {member.college.split(',')[0]}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                          {member.primaryRole}
                        </span>
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                          {member.archetype}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {member.department.split('(')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Member Metrics & Action Buttons */}
                  <div className="flex items-center justify-between sm:justify-end space-x-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    {onOpenRadarModal && (
                      <button
                        onClick={() => onOpenRadarModal(member)}
                        className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="View Individual 6-Axis Radar"
                      >
                        <Radar className="w-4 h-4" />
                      </button>
                    )}

                    {onOpenContactModal && (
                      <button
                        onClick={() => onOpenContactModal(member)}
                        className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                        title="View Contact & Send Pitch"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}

                    <div className="text-right text-xs">
                      <div className="font-bold text-slate-800">{member.weeklyAvailabilityHours}h/wk</div>
                      <div className="text-[11px] text-slate-500">{member.workingStyle.split(' ')[0]} Pace</div>
                    </div>

                    <button
                      id={`btn-remove-slot-${member.id}`}
                      onClick={() => onRemoveFromTeam(member.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove from roster"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty Ghost Slots */}
              {Array.from({ length: emptySlotsCount }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  onClick={onNavigateToDiscovery}
                  className="bg-slate-50/70 border-2 border-dashed border-slate-300/80 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-100/70 hover:border-indigo-400 transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-slate-700 group-hover:text-indigo-600 transition-colors">
                        Empty Slot #{currentTeam.length + i + 1}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {i === 0 && !sihCompliance.femaleMemberSatisfied
                          ? '🌟 Priority: Add female teammate for SIH Rule compliance'
                          : i === 0 && synergyAnalysis.recommendedNextAddition
                            ? `Needed: ${synergyAnalysis.recommendedNextAddition}`
                            : 'Click to select from talent candidates'}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center">
                    <span>Match Candidate</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Quick 1-Click Gap Filler Recommendation Banner */}
          {recommendedCandidate && emptySlotsCount > 0 && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={recommendedCandidate.avatar}
                    alt={recommendedCandidate.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl object-cover border border-emerald-300"
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-emerald-600 text-white uppercase tracking-wider">
                        {!sihCompliance.femaleMemberSatisfied && recommendedCandidate.gender === 'Female'
                          ? 'SIH Constraint Solved'
                          : 'Recommended Addition'}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900">{recommendedCandidate.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Fills <span className="font-semibold text-emerald-800">{recommendedCandidate.primaryRole}</span> ({recommendedCandidate.department.split('(')[0]}) • Adds {recommendedCandidate.weeklyAvailabilityHours}h/wk
                    </p>
                  </div>
                </div>

                <button
                  id="btn-quick-fill-slot"
                  onClick={() => onAddToTeam(recommendedCandidate)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors shrink-0"
                >
                  + Add to Slot
                </button>
              </div>
            </div>
          )}

          {/* Total Team Bandwidth and Archetype Distribution */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-800">Team Cognitive Diversity Breakdown</h4>
              <span className="text-xs font-semibold text-slate-500">
                Combined Bandwidth: <strong className="text-indigo-700">{totalWeeklyHours} Hours / Wk</strong>
              </span>
            </div>

            {/* Archetype pill distribution */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {Object.entries(archetypeCounts).map(([arch, count]) => (
                <div 
                  key={arch}
                  className={`p-2 rounded-xl border flex items-center justify-between ${
                    count > 0 ? 'bg-indigo-50/50 border-indigo-100 text-indigo-950 font-semibold' : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}
                >
                  <span className="truncate text-[11px]">{arch}</span>
                  <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                    count > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action To Sprint Charter */}
          <div className="pt-2">
            <button
              id="btn-goto-sprint-charter"
              onClick={onNavigateToCharter}
              disabled={currentTeam.length === 0}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors"
            >
              <span>Generate 48-Hour Execution Sprint Charter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Chemistry Engine & Radar Matrix (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Synergy Score & Confidence Meter */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Overall Team Chemistry</p>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    {synergyAnalysis.overallSynergyScore}%
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${scoreBadge.color}`}>
                    {scoreBadge.label}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-medium text-slate-400">Sprint Delivery Odds</p>
                <p className="text-lg font-extrabold text-emerald-600">
                  {synergyAnalysis.sprintSuccessProbability}%
                </p>
              </div>
            </div>

            {/* Visual Synergy Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  synergyAnalysis.overallSynergyScore >= 85 
                    ? 'bg-gradient-to-r from-indigo-600 to-emerald-500' 
                    : 'bg-gradient-to-r from-amber-500 to-indigo-600'
                }`}
                style={{ width: `${synergyAnalysis.overallSynergyScore}%` }}
              />
            </div>

            {/* AI Summary Insight */}
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed font-medium">
              {synergyAnalysis.chemistrySummary}
            </p>
          </div>

          {/* Synergy Radar Chart */}
          <SynergyRadar
            scores={synergyAnalysis.radarScores}
            targetScores={project.radarTarget}
            overallScore={synergyAnalysis.overallSynergyScore}
          />

          {/* Key Strengths & Critical Friction Risks */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            {/* Strengths */}
            <div>
              <div className="flex items-center space-x-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-xs text-slate-900">Key Team Strengths</h4>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {synergyAnalysis.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Friction Sentinel */}
            {synergyAnalysis.frictionRisks.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center space-x-1.5 mb-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <h4 className="font-bold text-xs text-slate-900">Friction Risks & Mitigations</h4>
                </div>
                <div className="space-y-2">
                  {synergyAnalysis.frictionRisks.map((risk, idx) => (
                    <div key={idx} className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900">{risk.title}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          risk.severity === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {risk.severity} Risk
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-900/80">{risk.description}</p>
                      <div className="text-[11px] text-indigo-900 font-semibold bg-white/80 p-1.5 rounded border border-amber-200/60 mt-1">
                        💡 <strong>Mitigation:</strong> {risk.mitigation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { UserCandidate, Archetype, DeltaSimulation } from '../types';
import { 
  Plus, 
  Check, 
  Clock, 
  Award, 
  ExternalLink, 
  Sparkles, 
  Briefcase, 
  Code2, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Send,
  Github,
  Radar
} from 'lucide-react';

interface CandidateCardProps {
  candidate: UserCandidate;
  isInTeam: boolean;
  onAddToTeam: (candidate: UserCandidate) => void;
  onRemoveFromTeam: (candidateId: string) => void;
  matchScore?: number;
  matchRationale?: string;
  isRecommendedSlot?: boolean;
  deltaSimulation?: DeltaSimulation;
  onOpenRadarModal?: (candidate: UserCandidate) => void;
  onOpenContactModal?: (candidate: UserCandidate) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isInTeam,
  onAddToTeam,
  onRemoveFromTeam,
  matchScore,
  matchRationale,
  isRecommendedSlot,
  deltaSimulation,
  onOpenRadarModal,
  onOpenContactModal
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showDeltaTooltip, setShowDeltaTooltip] = useState(false);

  // Archetype badge coloring
  const getArchetypeBadge = (archetype: Archetype) => {
    switch (archetype) {
      case 'System Architect':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'System Architect' };
      case 'UX Crafter':
        return { bg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200', label: 'UX Crafter' };
      case 'Quantitative Mind':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Quantitative Mind' };
      case 'Speed Builder / Hacker':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Speed Builder' };
      case 'Visionary & Domain Lead':
        return { bg: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Visionary Lead' };
      default:
        return { bg: 'bg-slate-50 text-slate-700 border-slate-200', label: archetype };
    }
  };

  const archetypeStyle = getArchetypeBadge(candidate.archetype);
  const delta = deltaSimulation?.delta ?? 0;
  const isPositiveDelta = delta >= 0;

  return (
    <article 
      id={`candidate-card-${candidate.id}`}
      className={`relative bg-white rounded-3xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
        isInTeam 
          ? 'border-indigo-500/80 ring-2 ring-indigo-500/20 bg-indigo-50/15' 
          : isRecommendedSlot
            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
            : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      
      {/* Top Banner: AI Match or Score Delta Preview */}
      {!isInTeam && deltaSimulation && (
        <div 
          className={`flex items-center justify-between px-4 py-2 rounded-t-3xl text-white text-xs font-bold transition-all cursor-pointer ${
            delta >= 15
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
              : delta >= 0
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600'
                : 'bg-gradient-to-r from-amber-600 to-rose-600'
          }`}
          onMouseEnter={() => setShowDeltaTooltip(true)}
          onMouseLeave={() => setShowDeltaTooltip(false)}
          role="status"
          aria-label={`Score delta simulation: ${deltaSimulation.currentScore} to ${deltaSimulation.projectedScore}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowDeltaTooltip(!showDeltaTooltip);
            }
          }}
        >
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pre-Add Simulator:</span>
            <span className="font-mono bg-white/20 px-2 py-0.5 rounded-md">
              {isPositiveDelta ? `+${delta}` : `${delta}`}
            </span>
          </div>

          <div className="flex items-center space-x-1 text-[11px]">
            <span>(Team Score: {deltaSimulation.currentScore} → {deltaSimulation.projectedScore})</span>
          </div>
        </div>
      )}

      {isInTeam && (
        <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 rounded-t-3xl text-white text-xs font-bold">
          <span className="flex items-center space-x-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Team Roster</span>
          </span>
          <span className="text-[10px] text-slate-300">Slot Assigned</span>
        </div>
      )}

      {/* Delta Simulator Hover Explainable Rationale */}
      {showDeltaTooltip && deltaSimulation && !isInTeam && (
        <div className="p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl border border-slate-700 m-3 space-y-1 z-20">
          <div className="flex items-center justify-between font-bold text-emerald-400">
            <span>Simulation Analysis</span>
            <span>{isPositiveDelta ? `+${delta} pts` : `${delta} pts`}</span>
          </div>
          <p className="text-slate-200 text-[11px] leading-relaxed">{deltaSimulation.rationale}</p>
          {deltaSimulation.sihImpact && (
            <p className="text-indigo-300 text-[10px] font-semibold">{deltaSimulation.sihImpact}</p>
          )}
        </div>
      )}

      <div className="p-5 flex-1">
        {/* Profile Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <img
                src={candidate.avatar}
                alt={candidate.name}
                referrerPolicy="no-referrer"
                className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                candidate.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-slate-900 text-base leading-tight hover:text-indigo-600 transition-colors">
                  {candidate.name}
                </h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  candidate.gender === 'Female' 
                    ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {candidate.gender}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-slate-500 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[210px]">{candidate.college}</span>
                <span>• {candidate.yearOfStudy}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block truncate max-w-[210px]">
                {candidate.department}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-lg shadow-2xs">
              Score {candidate.technicalScore}
            </span>
          </div>
        </div>

        {/* Primary Role & Archetype */}
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-900 text-white shadow-2xs">
            {candidate.primaryRole}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${archetypeStyle.bg}`}>
            {archetypeStyle.label}
          </span>
        </div>

        {/* Headline / Bio */}
        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {candidate.headline}
        </p>

        {/* Proof-Based Coding Handles Tag Bar */}
        {candidate.codingHandles && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px]">
            {candidate.codingHandles.leetcode && (
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-bold flex items-center space-x-1">
                <Code2 className="w-3 h-3 text-amber-600" />
                <span>LeetCode: {candidate.codingHandles.leetcodeProblems}+</span>
              </span>
            )}
            {candidate.codingHandles.codechef && (
              <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-900 border border-orange-200 font-bold flex items-center space-x-1">
                <Award className="w-3 h-3 text-orange-600" />
                <span>{candidate.codingHandles.codechefStars} ({candidate.codingHandles.codechefRating})</span>
              </span>
            )}
            {candidate.codingHandles.github && (
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-bold flex items-center space-x-1">
                <Github className="w-3 h-3 text-slate-700" />
                <span>{candidate.codingHandles.githubCommits}+ Commits</span>
              </span>
            )}
          </div>
        )}

        {/* Verified Badges */}
        <div className="mt-2.5 flex flex-wrap gap-1">
          {(candidate.verifiedBadges || []).slice(0, 3).map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60"
            >
              <CheckCircle className="w-2.5 h-2.5 mr-1 text-emerald-600" />
              {badge}
            </span>
          ))}
        </div>

        {/* Availability, Projects & Hackathons Badges */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs text-slate-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700 truncate">{candidate.weeklyAvailabilityHours}h/wk</span>
          </div>
          <div className="flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-semibold text-slate-700 truncate">{candidate.hackathonsWon} Won / {candidate.hackathonsAttended || ((candidate.hackathonsWon || 0) + 2)} Attended</span>
          </div>
          <div className="flex items-center space-x-1 justify-end">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="font-semibold text-slate-700 truncate">{candidate.completedProjectsCount || candidate.pastProjects?.length || 2} Projects</span>
          </div>
        </div>

        {/* Working Style & Native Language Bar */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
          <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100 font-medium truncate max-w-[180px]">
            {candidate.workingStyle || 'Agile Sprint Focused'}
          </span>
          <span className="bg-indigo-50/60 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100/60 font-medium">
            🗣️ {candidate.nativeLanguage || 'English / Hindi'}
          </span>
        </div>

        {/* Expandable Project Details */}
        {expanded && (
          <div id={`candidate-details-${candidate.id}`} className="mt-4 pt-3 border-t border-slate-200/80 space-y-2.5" aria-label={`Past projects for ${candidate.name}`}>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
              <span>Past Landmark Builds</span>
            </div>
            {(candidate.pastProjects || []).map((proj, i) => (
              <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{proj.title}</span>
                  <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                    {proj.tech}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">{proj.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="p-4 pt-3 bg-slate-50/70 rounded-b-3xl border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            aria-expanded={expanded}
            aria-controls={`candidate-details-${candidate.id}`}
          >
            <span>{expanded ? 'Less' : 'More'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" aria-hidden="true" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" aria-hidden="true" />}
          </button>

          {onOpenRadarModal && (
            <button
              onClick={() => onOpenRadarModal(candidate)}
              className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-lg border border-indigo-200 transition-colors"
              aria-label={`View 6-axis verified radar for ${candidate.name}`}
              title="View 6-Axis Verified Radar"
            >
              <Radar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Radar</span>
            </button>
          )}

          {onOpenContactModal && (
            <button
              onClick={() => onOpenContactModal(candidate)}
              className="inline-flex items-center space-x-1 text-xs font-bold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-lg border border-purple-200 transition-colors"
              aria-label={`Send pitch invite to ${candidate.name}`}
              title="Send Matrimony-Style Team Invite"
            >
              <Send className="w-3 h-3" aria-hidden="true" />
              <span>Invite</span>
            </button>
          )}
        </div>

        {isInTeam ? (
          <button
            id={`btn-remove-${candidate.id}`}
            onClick={() => onRemoveFromTeam(candidate.id)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
            aria-label={`Remove ${candidate.name} from team`}
          >
            <Check className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Remove</span>
          </button>
        ) : (
          <button
            id={`btn-add-${candidate.id}`}
            onClick={() => onAddToTeam(candidate)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors active:scale-98"
            aria-label={`Add ${candidate.name} to team`}
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add to Team</span>
          </button>
        )}
      </div>
    </div>
  );
};

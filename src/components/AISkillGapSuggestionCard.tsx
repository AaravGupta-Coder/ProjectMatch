import React, { useState, useEffect } from 'react';
import { UserCandidate, ProjectRequirement, SkillGapReasoningResult } from '../types';
import { 
  Sparkles, 
  Target, 
  ShieldCheck, 
  Rocket, 
  ArrowRight, 
  RefreshCw, 
  UserCheck, 
  Zap, 
  CheckCircle2, 
  Sliders, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Radar,
  Send,
  HelpCircle,
  Plus
} from 'lucide-react';

interface AISkillGapSuggestionCardProps {
  currentTeam: UserCandidate[];
  allCandidates: UserCandidate[];
  project: ProjectRequirement;
  onAddToTeam: (candidate: UserCandidate) => void;
  onNavigateToDiscoveryWithFilter?: (skillQuery: string) => void;
  onOpenRadarModal?: (candidate: UserCandidate) => void;
  onOpenContactModal?: (candidate: UserCandidate) => void;
}

export const AISkillGapSuggestionCard: React.FC<AISkillGapSuggestionCardProps> = ({
  currentTeam,
  allCandidates,
  project,
  onAddToTeam,
  onNavigateToDiscoveryWithFilter,
  onOpenRadarModal,
  onOpenContactModal
}) => {
  const [suggestion, setSuggestion] = useState<SkillGapReasoningResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFocus, setSelectedFocus] = useState<string>('Auto-Detect Complementarity');
  const [showDetailedRationale, setShowDetailedRationale] = useState(false);
  const [dataSource, setDataSource] = useState<string>('gemini');

  const focusOptions = [
    'Auto-Detect Complementarity',
    'UI / UX & Front-End Polish',
    'AI / ML & Intelligence Pipelines',
    'Core Systems & Distributed Backend',
    'Domain Strategy & Demo Pitch',
    'Hackathon Team Diversity & Compliance'
  ];

  const fetchSkillGapReasoning = async (focus = selectedFocus) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/skill-gap-reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project,
          currentTeam,
          candidatePool: allCandidates,
          focusPreference: focus
        })
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          setSuggestion(json.data);
          setDataSource(json.source || 'gemini');
          return;
        }
      }
      throw new Error('Local fallback');
    } catch (_err) {
      // Local deterministic suggestion calculation
      const hasDesigner = currentTeam.some(m => m.primaryRole.toLowerCase().includes('design') || m.archetype === 'UX Crafter');
      const hasAI = currentTeam.some(m => m.primaryRole.toLowerCase().includes('ai') || m.archetype === 'Quantitative Mind');
      const femaleCount = currentTeam.filter(m => m.gender === 'Female').length;

      let targetRole = 'UI / UX Product Designer';
      let targetArchetype = 'UX Crafter';
      let targetSkills = ['Figma', 'Tailwind CSS', 'Micro-Interactions', 'Design Systems'];
      let shortWhy = 'Your backend and architecture vectors are covered. A dedicated interface crafter ensures high judge appeal.';
      let priority: 'Critical' | 'High' | 'Medium' = 'Critical';

      if (!hasDesigner) {
        targetRole = 'UI / UX Product Designer';
        targetArchetype = 'UX Crafter';
        targetSkills = ['Figma', 'Design Systems', 'Tailwind CSS', 'Motion UI'];
        shortWhy = 'To convert complex technical capabilities into an intuitive judge demo flow.';
      } else if (!hasAI && project.criticalTechStack.some(s => s.toLowerCase().includes('ai') || s.toLowerCase().includes('gemini'))) {
        targetRole = 'AI / ML & Intelligence Specialist';
        targetArchetype = 'Quantitative Mind';
        targetSkills = ['Gemini 3.7', 'Python', 'Vector Retrieval', 'Prompt Chaining'];
        shortWhy = 'To build out the core multimodal inference pipeline and predictive models.';
      } else if (femaleCount === 0 && project.sihConstraints?.requireFemaleMember) {
        targetRole = 'Full-Stack Developer';
        targetArchetype = 'Speed Builder / Hacker';
        targetSkills = ['React 19', 'TypeScript', 'Node.js'];
        shortWhy = 'Satisfies hackathon team gender & diversity representation criteria.';
      }

      setSuggestion({
        headlineSentence: `Recruit a ${targetRole} with expertise in ${targetSkills.slice(0, 2).join(' and ')}.`,
        targetRole,
        targetArchetype,
        targetPersonSkills: targetSkills,
        shortWhy,
        detailedRationale: `With ${currentTeam.length} current team member(s), adding this archetype directly satisfies critical project deliverables and increases overall synergy.`,
        urgencyScore: 88,
        priorityLevel: priority,
        matchingCandidateIds: allCandidates
          .filter(c => !currentTeam.some(m => m.id === c.id) && (c.primaryRole.toLowerCase().includes(targetRole.toLowerCase()) || c.archetype === targetArchetype))
          .slice(0, 3)
          .map(c => c.id)
      });
      setDataSource('heuristic-engine');
    } finally {
      setIsLoading(false);
    }
  };

  // Re-run when team or focus changes
  useEffect(() => {
    fetchSkillGapReasoning(selectedFocus);
  }, [currentTeam.length, project.id, selectedFocus]);

  // Find matching candidates from candidate pool
  const matchingCandidates = (suggestion?.matchingCandidateIds || [])
    .map(id => allCandidates.find(c => c.id === id))
    .filter((c): c is UserCandidate => !!c && !currentTeam.some(m => m.id === c.id))
    .slice(0, 3);

  // If no candidates matched by IDs, find closest candidates by target skills
  const fallbackMatchingCandidates = matchingCandidates.length > 0 
    ? matchingCandidates 
    : allCandidates
        .filter(c => !currentTeam.some(m => m.id === c.id))
        .filter(c => {
          if (!suggestion) return true;
          const targetLower = suggestion.targetPersonSkills.map(s => s.toLowerCase());
          return c.topSkills.some(s => targetLower.some(t => t.includes(s.toLowerCase()) || s.toLowerCase().includes(t))) ||
                 c.primaryRole.toLowerCase().includes(suggestion.targetRole.toLowerCase()) ||
                 c.archetype.toLowerCase().includes(suggestion.targetArchetype.toLowerCase());
        })
        .slice(0, 3);

  if (!suggestion && isLoading) {
    return (
      <div className="bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-slate-50 border border-indigo-200/80 rounded-3xl p-6 shadow-xs animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-200" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-indigo-200 rounded w-1/3" />
            <div className="h-3 bg-indigo-100 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!suggestion) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-7 border border-indigo-800/40 shadow-xl relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-indigo-800/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                AI Skill Complementarity Reasoning
              </span>
              <span className="text-[10px] font-semibold text-indigo-300/80 bg-white/5 px-2 py-0.5 rounded-full">
                {dataSource.includes('gemini') ? '⚡ Gemini 3.7 Live Inference' : 'Algorithmic Synthesis'}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white tracking-tight mt-0.5">
              Squad Triangulation & Strategic Gap Diagnosis
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase font-bold text-indigo-300/70 block">Estimated Delta</span>
            <span className="text-sm font-extrabold text-emerald-400">
              {suggestion.predictedSynergyBoost}
            </span>
          </div>

          <button
            onClick={() => fetchSkillGapReasoning(selectedFocus)}
            disabled={isLoading}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-xs transition-all disabled:opacity-50"
            title="Recalculate with AI"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-300' : ''}`} />
            <span>{isLoading ? 'Reasoning...' : 'Re-Evaluate'}</span>
          </button>
        </div>
      </div>

      {/* Focus Area Pill Selector */}
      <div className="relative z-10 py-3.5 flex items-center space-x-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-bold text-indigo-300/90 whitespace-nowrap flex items-center space-x-1">
          <Sliders className="w-3.5 h-3.5 mr-1" />
          <span>Evaluation Lens:</span>
        </span>
        {focusOptions.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFocus(f)}
            className={`text-xs px-3 py-1 rounded-xl font-semibold whitespace-nowrap transition-all ${
              selectedFocus === f
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 border border-indigo-400/40 font-bold'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* PRIMARY FORMULA HIGHLIGHT BOX (The Core User Request) */}
      <div className="relative z-10 my-2 bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-slate-900/80 border-2 border-indigo-500/40 rounded-2xl p-5 shadow-inner">
        
        {/* Crisp formula sentence statement */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <span className="text-2xl mt-0.5 shrink-0">💡</span>
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-300 block">
                AI Synthesis Formula
              </span>
              <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                You need a person with{' '}
                <span className="text-emerald-300 font-extrabold underline decoration-emerald-400/60 decoration-2 underline-offset-4 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/40">
                  {suggestion.targetPersonSkills.slice(0, 3).join(', ')}
                </span>{' '}
                skills because you have{' '}
                <span className="text-indigo-200 font-bold bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-500/40">
                  {suggestion.teamHaveSkills.slice(0, 3).join(', ')}
                </span>{' '}
                skills and for your project need a person with{' '}
                <span className="text-amber-300 font-extrabold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/40">
                  {suggestion.projectNeedSkills.slice(0, 3).join(', ')}
                </span>{' '}
                skills.
              </p>
            </div>
          </div>

          {/* Tri-Vector Visual Breakdown Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-indigo-800/40">
            
            {/* Vector 1: What you need next */}
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Target className="w-3.5 h-3.5" />
                <span>1. Target Person Needed</span>
              </div>
              <p className="text-xs font-bold text-white">
                {suggestion.targetRole} <span className="text-emerald-400">({suggestion.targetArchetype})</span>
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {suggestion.targetPersonSkills.map((sk, i) => (
                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Vector 2: What you currently have */}
            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>2. Current Squad Strength</span>
              </div>
              <p className="text-xs font-bold text-slate-200">
                {currentTeam.length} Active Member{currentTeam.length === 1 ? '' : 's'} Covered
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {suggestion.teamHaveSkills.map((sk, i) => (
                  <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Vector 3: What project requires */}
            <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Rocket className="w-3.5 h-3.5" />
                <span>3. Project Vector Demands</span>
              </div>
              <p className="text-xs font-bold text-slate-200 truncate" title={project.title}>
                {project.title}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {suggestion.projectNeedSkills.map((sk, i) => (
                  <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-200 border border-amber-400/30">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Rationale toggle */}
      <div className="relative z-10 my-3">
        <button
          onClick={() => setShowDetailedRationale(!showDetailedRationale)}
          className="flex items-center space-x-1.5 text-xs text-indigo-300 hover:text-white transition-colors font-semibold"
        >
          <span>{showDetailedRationale ? 'Hide Architectural Rationale' : 'Why this combination wins (Architectural Rationale)'}</span>
          {showDetailedRationale ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showDetailedRationale && (
          <div className="mt-2.5 bg-slate-950/60 border border-indigo-800/40 rounded-xl p-4 space-y-2 text-xs text-slate-300 leading-relaxed animate-in fade-in duration-200">
            <p className="text-indigo-200 font-bold text-xs">{suggestion.shortWhy}</p>
            <ul className="space-y-1.5 list-disc list-inside text-[11px] text-slate-300/90 pt-1">
              {suggestion.detailedRationale.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* MATCHING TALENT CANDIDATES DIRECTLY RESOLVING THIS GAP */}
      <div className="relative z-10 mt-5 pt-4 border-t border-indigo-800/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Top Candidates Resolving This Exact Gap
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              {fallbackMatchingCandidates.length} Matched
            </span>
          </div>

          {onNavigateToDiscoveryWithFilter && (
            <button
              onClick={() => onNavigateToDiscoveryWithFilter(suggestion.targetPersonSkills[0] || suggestion.targetRole)}
              className="text-xs font-bold text-indigo-300 hover:text-white flex items-center space-x-1 transition-colors self-start sm:self-center"
            >
              <span>Explore All Candidates with These Skills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Candidate Mini Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {fallbackMatchingCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-slate-900/80 hover:bg-slate-800/90 border border-indigo-500/30 hover:border-indigo-400/60 rounded-2xl p-3.5 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={candidate.avatar}
                  alt={candidate.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-indigo-400/40 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-white truncate">{candidate.name}</h5>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                      {candidate.gender === 'Female' ? 'Diversity Match' : `${candidate.weeklyAvailabilityHours}h/wk`}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-indigo-300 truncate">
                    {candidate.primaryRole}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {candidate.college.split(',')[0]} • {candidate.archetype}
                  </p>
                </div>
              </div>

              {/* Skills overlap badges */}
              <div className="flex flex-wrap gap-1">
                {candidate.topSkills.slice(0, 3).map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 truncate max-w-[110px]"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center space-x-1">
                  {onOpenRadarModal && (
                    <button
                      onClick={() => onOpenRadarModal(candidate)}
                      className="p-1.5 rounded-lg text-indigo-300 hover:bg-white/10 hover:text-white transition-colors"
                      title="Inspect 6-Axis Radar"
                    >
                      <Radar className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onOpenContactModal && (
                    <button
                      onClick={() => onOpenContactModal(candidate)}
                      className="p-1.5 rounded-lg text-purple-300 hover:bg-white/10 hover:text-white transition-colors"
                      title="Send Pitch Invite"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  id={`btn-add-ai-matched-${candidate.id}`}
                  onClick={() => onAddToTeam(candidate)}
                  className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xs transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Squad</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

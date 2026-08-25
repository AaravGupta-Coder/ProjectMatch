import React, { useState, useMemo } from 'react';
import { 
  UserCandidate, 
  Archetype, 
  PrimaryRole, 
  SmartMatchResult,
  ProjectRequirement,
  Department,
  AcademicYear
} from '../types';
import { CandidateCard } from './CandidateCard';
import { AISkillGapSuggestionCard } from './AISkillGapSuggestionCard';
import { simulateCandidateDelta } from '../utils/synergyEngine';
import { 
  Search, 
  Sparkles, 
  Filter, 
  SlidersHorizontal, 
  X, 
  Users, 
  Check, 
  RefreshCw,
  ShieldCheck,
  Award,
  GraduationCap,
  Heart
} from 'lucide-react';

interface TalentDiscoveryProps {
  candidates: UserCandidate[];
  currentTeam: UserCandidate[];
  project: ProjectRequirement;
  initialSearchQuery?: string;
  onAddToTeam: (candidate: UserCandidate) => void;
  onRemoveFromTeam: (candidateId: string) => void;
  onRunSmartMatch: (query: string) => Promise<void>;
  smartMatchResults: SmartMatchResult[] | null;
  isLoadingMatch: boolean;
  onOpenProofParser: () => void;
  onOpenRadarModal: (candidate: UserCandidate) => void;
  onOpenContactModal: (candidate: UserCandidate) => void;
}

export const TalentDiscovery: React.FC<TalentDiscoveryProps> = ({
  candidates,
  currentTeam,
  project,
  initialSearchQuery,
  onAddToTeam,
  onRemoveFromTeam,
  onRunSmartMatch,
  smartMatchResults,
  isLoadingMatch,
  onOpenProofParser,
  onOpenRadarModal,
  onOpenContactModal
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [showAISkillSuggestion, setShowAISkillSuggestion] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [minWins, setMinWins] = useState<number>(0);
  const [smartMatchActive, setSmartMatchActive] = useState(false);

  // Sync initial query if it changes
  React.useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const archetypes: string[] = [
    'All',
    'System Architect',
    'Speed Builder / Hacker',
    'UX Crafter',
    'Quantitative Mind',
    'Visionary & Domain Lead',
  ];

  const roles: string[] = [
    'All',
    'Full-Stack Engineer',
    'AI / ML Specialist',
    'UI/UX Product Designer',
    'Cloud & Distributed Systems Architect',
    'Data / Quantitative Engineer',
    'Domain & Product Strategist',
    'Hardware & Embedded Engineer',
  ];

  const departments: string[] = [
    'All',
    'Computer Science & Eng (CSE)',
    'Electronics & Comm (ECE)',
    'Artificial Intelligence & Data Science',
    'Information Technology (IT)',
    'Electrical & Electronics (EEE)',
    'Design & Human-Computer Interaction'
  ];

  const years: string[] = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesHeadline = c.headline.toLowerCase().includes(q);
        const matchesSkills = c.topSkills.some(s => s.toLowerCase().includes(q));
        const matchesCollege = c.college.toLowerCase().includes(q);
        const matchesRole = c.primaryRole.toLowerCase().includes(q);
        const matchesDept = c.department.toLowerCase().includes(q);
        if (!matchesName && !matchesHeadline && !matchesSkills && !matchesCollege && !matchesRole && !matchesDept) {
          return false;
        }
      }

      // Gender filter
      if (selectedGender !== 'All' && c.gender !== selectedGender) {
        return false;
      }

      // Department filter
      if (selectedDepartment !== 'All' && c.department !== selectedDepartment) {
        return false;
      }

      // Year filter
      if (selectedYear !== 'All' && c.yearOfStudy !== selectedYear) {
        return false;
      }

      // Archetype filter
      if (selectedArchetype !== 'All' && c.archetype !== selectedArchetype) {
        return false;
      }

      // Role filter
      if (selectedRole !== 'All' && c.primaryRole !== selectedRole) {
        return false;
      }

      // Wins / Track Record filter: -1 indicates first-time hacker (0 wins), >=0 indicates minimum wins
      if (minWins === -1) {
        if (c.hackathonsWon !== 0) return false;
      } else if (minWins > 0) {
        if (c.hackathonsWon < minWins) return false;
      }

      return true;
    });
  }, [candidates, searchQuery, selectedGender, selectedDepartment, selectedYear, selectedArchetype, selectedRole, minWins]);

  const handleTriggerSmartMatch = async () => {
    setSmartMatchActive(true);
    await onRunSmartMatch(searchQuery || 'Find best complementary match for current team gaps and SIH rules');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedArchetype('All');
    setSelectedRole('All');
    setSelectedGender('All');
    setSelectedDepartment('All');
    setSelectedYear('All');
    setMinWins(0);
    setSmartMatchActive(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Search, Filter & Proof Engine Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Proof-Backed Talent Pool & Constraint Filter
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {candidates.length} Verified Builders
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Live delta simulator computes projected team score before inviting. Filter by SIH gender rule, branch mix, & verified coding handles.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAISkillSuggestion(!showAISkillSuggestion)}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs border ${
                showAISkillSuggestion 
                  ? 'bg-indigo-600 text-white border-indigo-700' 
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showAISkillSuggestion ? 'Hide AI Suggestions' : 'AI Skill Reasoning'}</span>
            </button>

            <button
              onClick={onOpenProofParser}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verify & Add Profile</span>
            </button>

            <button
              id="btn-trigger-smart-match"
              onClick={handleTriggerSmartMatch}
              disabled={isLoadingMatch}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all disabled:opacity-50 active:scale-98"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isLoadingMatch ? 'animate-spin' : ''}`} />
              <span>{isLoadingMatch ? 'Synthesizing...' : 'AI Smart Match'}</span>
            </button>

            {smartMatchActive && (
              <button
                onClick={() => setSmartMatchActive(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Reset to manual search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable AI Tri-Vector Suggestion Card */}
        {showAISkillSuggestion && (
          <div className="pt-2">
            <AISkillGapSuggestionCard
              currentTeam={currentTeam}
              allCandidates={candidates}
              project={project}
              onAddToTeam={onAddToTeam}
              onNavigateToDiscoveryWithFilter={(query) => {
                setSearchQuery(query);
                setShowAISkillSuggestion(false);
              }}
              onOpenRadarModal={onOpenRadarModal}
              onOpenContactModal={onOpenContactModal}
            />
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-talent-search"
            type="text"
            placeholder="Search by verified skill (LeetCode, Rust, React, Gemini), branch, college, name, or track..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        {/* E-Commerce Style Filter Bars */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          
          {/* Institutional Constraint Filter */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 shrink-0 text-[11px] uppercase tracking-wider flex items-center space-x-1">
              <span>Gender:</span>
            </span>
            {['All', 'Female', 'Male'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedGender === g
                    ? 'bg-fuchsia-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g}
              </button>
            ))}

            <span className="font-bold text-slate-400 ml-2">|</span>

            {/* Academic Year Filter */}
            <span className="font-bold text-slate-500 shrink-0 text-[11px] uppercase tracking-wider ml-1">Year:</span>
            {years.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedYear === yr
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {yr}
              </button>
            ))}

            <span className="font-bold text-slate-400 ml-2">|</span>

            {/* Hackathons Won / Track Record Filter */}
            <span className="font-bold text-amber-600 shrink-0 text-[11px] uppercase tracking-wider flex items-center">
              <Award className="w-3 h-3 mr-0.5" /> Track Record:
            </span>
            {[
              { val: 0, label: 'Any' },
              { val: -1, label: 'First-Timer (0 Wins)' },
              { val: 1, label: '1+ Wins' },
              { val: 3, label: '3+ Wins' },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setMinWins(val)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  minWins === val
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Department Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-slate-500 shrink-0 text-[11px] uppercase tracking-wider">Branch Mix:</span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDepartment === dept
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Roles Selector */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-slate-500 shrink-0 text-[11px] uppercase tracking-wider">Role:</span>
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedRole === r
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Quick Clear */}
          {(selectedArchetype !== 'All' || selectedRole !== 'All' || selectedGender !== 'All' || selectedDepartment !== 'All' || selectedYear !== 'All' || minWins > 0 || searchQuery || smartMatchActive) && (
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">
                Showing {filteredCandidates.length} candidate{filteredCandidates.length === 1 ? '' : 's'} with live pre-add delta calculation
              </span>
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Smart Match Highlights Banner */}
      {smartMatchActive && smartMatchResults && smartMatchResults.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <p className="text-xs text-indigo-950 font-medium">
              <strong>Gemini 3.7 Ranked Matches:</strong> Filtered candidates ranked by complementary archetype balance and SIH constraint fulfillment.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-1 rounded-lg border border-indigo-100 shrink-0">
            {smartMatchResults.length} High-Fit Matches
          </span>
        </div>
      )}

      {/* Candidate Grid with Live Delta Simulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCandidates.map((candidate) => {
          const inTeam = currentTeam.some(m => m.id === candidate.id);
          const match = smartMatchResults?.find(r => r.candidateId === candidate.id);
          const deltaSimulation = simulateCandidateDelta(candidate, currentTeam, project);

          return (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isInTeam={inTeam}
              onAddToTeam={onAddToTeam}
              onRemoveFromTeam={onRemoveFromTeam}
              matchScore={match?.matchScore}
              matchRationale={match?.matchRationale}
              deltaSimulation={deltaSimulation}
              onOpenRadarModal={onOpenRadarModal}
              onOpenContactModal={onOpenContactModal}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCandidates.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-800">No matching candidates found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No talent matches all combined filters (Gender, Branch, Role). Try loosening constraints or click Reset Filters.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
};

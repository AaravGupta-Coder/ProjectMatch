import React, { useState, useMemo } from 'react';
import { 
  OpenTeam, 
  TeamJoinApplication, 
  UserCandidate, 
  PrimaryRole, 
  Archetype 
} from '../types';
import { 
  Users, 
  Sparkles, 
  Search, 
  Filter, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  ChevronRight, 
  Briefcase, 
  Mail, 
  Phone, 
  MessageSquare, 
  ExternalLink, 
  PlusCircle, 
  Award, 
  Zap, 
  UserCheck, 
  ShieldCheck, 
  Info,
  Check,
  X,
  SlidersHorizontal,
  Flame
} from 'lucide-react';

interface JoinTeamBoardProps {
  openTeams: OpenTeam[];
  applications: TeamJoinApplication[];
  candidates: UserCandidate[];
  currentTeam: UserCandidate[];
  onApplyToTeam: (application: Omit<TeamJoinApplication, 'id' | 'timestamp'>) => void;
  onAcceptIncomingApplication: (appId: string, candidate: UserCandidate) => void;
  onDeclineIncomingApplication: (appId: string) => void;
  onNavigateToWorkbench: () => void;
  onInspectRadar: (candidate: UserCandidate) => void;
}

export const JoinTeamBoard: React.FC<JoinTeamBoardProps> = ({
  openTeams,
  applications,
  candidates,
  currentTeam,
  onApplyToTeam,
  onAcceptIncomingApplication,
  onDeclineIncomingApplication,
  onNavigateToWorkbench,
  onInspectRadar
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'browse' | 'my-apps' | 'incoming' | 'create-listing'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedSihFilter, setSelectedSihFilter] = useState<'all' | 'needs-female' | 'sih-compliant'>('all');
  
  // Active Persona Selector: Which candidate profile is the user simulating applying as?
  const [activeApplicantId, setActiveApplicantId] = useState<string>(candidates[1]?.id || 'cand-2'); // Default Diya Sen (UX Crafter)
  
  // Application Modal state
  const [selectedTeamToApply, setSelectedTeamToApply] = useState<OpenTeam | null>(null);
  const [selectedVacancyIndex, setSelectedVacancyIndex] = useState<number>(0);
  const [pitchMessage, setPitchMessage] = useState('');
  const [weeklyHours, setWeeklyHours] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Team Listing Form state
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamTagline, setNewTeamTagline] = useState('');
  const [newTeamTrack, setNewTeamTrack] = useState('Smart India Hackathon 2026');
  const [newTeamProblem, setNewTeamProblem] = useState('');
  const [newTeamVacancyRole, setNewTeamVacancyRole] = useState<PrimaryRole>('UI/UX Product Designer');
  const [newTeamVacancyPriority, setNewTeamVacancyPriority] = useState<'Critical' | 'Recommended'>('Critical');
  const [newTeamVacancySkills, setNewTeamVacancySkills] = useState('Figma, React, Tailwind CSS, Motion UI');
  const [newTeamVacancyDesc, setNewTeamVacancyDesc] = useState('Design clean, accessible interfaces with 60fps micro-animations.');

  const activeApplicant = useMemo(() => {
    return candidates.find(c => c.id === activeApplicantId) || candidates[0];
  }, [candidates, activeApplicantId]);

  // Filtered Teams
  const filteredTeams = useMemo(() => {
    return openTeams.filter(team => {
      const matchesSearch = 
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.hackathonTrack.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.problemStatement.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.openVacancies.some(v => v.role.toLowerCase().includes(searchQuery.toLowerCase()) || v.idealSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesTrack = selectedTrackFilter === 'all' || team.hackathonTrack.toLowerCase().includes(selectedTrackFilter.toLowerCase());
      
      const matchesRole = selectedRoleFilter === 'all' || team.openVacancies.some(v => v.role === selectedRoleFilter);

      const matchesSih = 
        selectedSihFilter === 'all' ||
        (selectedSihFilter === 'needs-female' && !team.sihComplianceStatus?.hasFemaleMember) ||
        (selectedSihFilter === 'sih-compliant' && team.sihComplianceStatus?.isFullyCompliant);

      return matchesSearch && matchesTrack && matchesRole && matchesSih;
    });
  }, [openTeams, searchQuery, selectedTrackFilter, selectedRoleFilter, selectedSihFilter]);

  // Counts
  const myApplications = useMemo(() => applications.filter(a => !a.isIncomingToUserTeam), [applications]);
  const incomingApplications = useMemo(() => applications.filter(a => a.isIncomingToUserTeam), [applications]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenApplyModal = (team: OpenTeam, vacancyIdx = 0) => {
    setSelectedTeamToApply(team);
    setSelectedVacancyIndex(vacancyIdx);
    const vacancy = team.openVacancies[vacancyIdx] || team.openVacancies[0];
    
    // Auto-craft a smart contextual pitch
    const defaultPitch = `Hi ${team.leader.name} & ${team.name}! I'm applying as a ${vacancy?.role || 'Teammate'} for ${team.hackathonName}. With my background in ${activeApplicant.primaryRole} (${activeApplicant.archetype}), ${activeApplicant.topSkills.slice(0, 4).join(', ')}, and verified credentials (${activeApplicant.verifiedBadges[0] || 'Hackathon Winner'}), I can hit the ground running on ${team.tagline.slice(0, 60)}... and ensure high sprint velocity.`;
    setPitchMessage(defaultPitch);
    setWeeklyHours(activeApplicant.weeklyAvailabilityHours || 30);
  };

  const handleConfirmSubmitApplication = () => {
    if (!selectedTeamToApply) return;
    setIsSubmitting(true);

    const vacancy = selectedTeamToApply.openVacancies[selectedVacancyIndex] || selectedTeamToApply.openVacancies[0];

    setTimeout(() => {
      onApplyToTeam({
        teamId: selectedTeamToApply.id,
        teamName: selectedTeamToApply.name,
        hackathonName: selectedTeamToApply.hackathonName,
        applicantCandidate: activeApplicant,
        targetRole: vacancy.role,
        pitchMessage: pitchMessage.trim(),
        weeklyHoursOffered: weeklyHours,
        status: 'pending',
        isIncomingToUserTeam: false
      });

      setIsSubmitting(false);
      setSelectedTeamToApply(null);
      showToast(`Application successfully sent to ${selectedTeamToApply.name}! Track its status in "My Applications".`);
    }, 400);
  };

  // Helper to calculate candidate fit score with team
  const calculateCandidateFit = (team: OpenTeam, candidate: UserCandidate) => {
    let fitScore = 70;
    const matchingVacancy = team.openVacancies.find(v => v.role === candidate.primaryRole || v.archetype === candidate.archetype);
    
    let bonusNote = '';
    if (matchingVacancy) {
      fitScore += 20;
      bonusNote = `Direct Match for ${matchingVacancy.role}`;
    } else {
      bonusNote = `Complementary ${candidate.archetype}`;
    }

    if (!team.sihComplianceStatus?.hasFemaleMember && candidate.gender === 'Female') {
      fitScore += 10;
      bonusNote += ' + Fulfills Team Diversity Requirement';
    }

    return {
      score: Math.min(fitScore, 98),
      delta: matchingVacancy ? '+18%' : '+11%',
      note: bonusNote
    };
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

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Squad Matchmaking & Direct Team Applications</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Join a Hackathon Team
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Explore high-caliber teams recruiting for global and national hackathons. Check live synergy delta impact, verify missing role requirements, and submit proof-backed pitch applications.
            </p>
          </div>

          {/* Active Persona Simulator Selector */}
          <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 space-y-2 w-full md:w-80 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-1">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Applying As Persona:</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Live Synergy Fit</span>
            </div>
            <select
              id="applicant-persona-selector"
              value={activeApplicantId}
              onChange={(e) => setActiveApplicantId(e.target.value)}
              className="w-full bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
            >
              {candidates.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.primaryRole} • {c.archetype})
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-300 border-t border-slate-700/50">
              <span>{activeApplicant.college}</span>
              <span className="text-emerald-400 font-bold">{activeApplicant.weeklyAvailabilityHours}h/wk free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub navigation bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 overflow-x-auto">
          <button
            id="subtab-browse-teams"
            onClick={() => setActiveSubTab('browse')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'browse'
                ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Open Teams Recruiting</span>
            <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded-full text-[10px] font-extrabold">
              {openTeams.length}
            </span>
          </button>

          <button
            id="subtab-my-apps"
            onClick={() => setActiveSubTab('my-apps')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'my-apps'
                ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>My Applications</span>
            <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded-full text-[10px] font-extrabold">
              {myApplications.length}
            </span>
          </button>

          <button
            id="subtab-incoming-apps"
            onClick={() => setActiveSubTab('incoming')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'incoming'
                ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Incoming for Your Team</span>
            {incomingApplications.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded-full text-[10px] font-extrabold flex items-center">
                <Flame className="w-2.5 h-2.5 mr-0.5 text-amber-600" />
                {incomingApplications.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="btn-switch-workbench-direct"
            onClick={onNavigateToWorkbench}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-colors flex items-center space-x-1"
          >
            <span>View Current Workbench</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* TAB 1: BROWSE OPEN TEAMS */}
      {activeSubTab === 'browse' && (
        <div className="space-y-5">
          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="search-teams-input"
                  type="text"
                  placeholder="Search by team name, problem statement, required skills (e.g. Figma, Go, React, IoT)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  id="filter-track-select"
                  value={selectedTrackFilter}
                  onChange={(e) => setSelectedTrackFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Tracks</option>
                  <option value="Global">Global Innovation Sprints</option>
                  <option value="Healthcare">HealthTech & AI</option>
                  <option value="Robotics">Robotics & Disaster</option>
                  <option value="Web3">Web3 & Security</option>
                  <option value="Agriculture">Smart Agriculture</option>
                  <option value="CleanTech">CleanTech & Energy</option>
                </select>

                <select
                  id="filter-role-select"
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Open Vacancies</option>
                  <option value="UI/UX Product Designer">Needs UI/UX Designer</option>
                  <option value="Full-Stack Engineer">Needs Full-Stack Engineer</option>
                  <option value="AI / ML Specialist">Needs AI / ML Specialist</option>
                  <option value="Hardware & Embedded Engineer">Needs Hardware / IoT</option>
                  <option value="Domain & Product Strategist">Needs Product Strategist</option>
                  <option value="Mobile & Cross-Platform Engineer">Needs Mobile Engineer</option>
                </select>

                <select
                  id="filter-sih-select"
                  value={selectedSihFilter}
                  onChange={(e) => setSelectedSihFilter(e.target.value as any)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Compliance Status</option>
                  <option value="needs-female">Needs Female Member (Diversity Boost)</option>
                  <option value="sih-compliant">Fully Balanced & Compliant</option>
                </select>
              </div>
            </div>

            {/* Quick Helper Banner */}
            <div className="flex items-center justify-between text-xs text-slate-600 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  Showing fit simulation for <strong className="text-slate-900">{activeApplicant.name}</strong> ({activeApplicant.primaryRole}). Teams with matching vacancies are highlighted with synergy boost deltas.
                </span>
              </div>
              <span className="text-[11px] font-semibold text-indigo-700 hidden sm:inline">
                {filteredTeams.length} teams found
              </span>
            </div>
          </div>

          {/* Teams Grid */}
          {filteredTeams.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No matching teams found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Try loosening your filters or search terms to discover more open squads.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedTrackFilter('all'); setSelectedRoleFilter('all'); setSelectedSihFilter('all'); }}
                className="mt-4 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredTeams.map((team) => {
                const candidateFit = calculateCandidateFit(team, activeApplicant);
                const isMatchingRole = team.openVacancies.some(v => v.role === activeApplicant.primaryRole);

                return (
                  <div
                    key={team.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Team Header */}
                    <div className="p-5 sm:p-6 border-b border-slate-100 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                              {team.hackathonTrack}
                            </span>
                            {team.problemStatementId && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                                {team.problemStatementId}
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              team.urgency.includes('Immediate') 
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {team.urgency}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-2">
                            {team.name}
                          </h3>
                        </div>

                        {/* Synergy Fit Pill */}
                        <div className="text-right shrink-0">
                          <div className="flex items-center justify-end space-x-1">
                            <span className="text-xs text-slate-500 font-medium">Synergy:</span>
                            <span className="text-sm font-extrabold text-indigo-700">
                              {team.synergyScore}%
                            </span>
                          </div>
                          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                            isMatchingRole ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            <Sparkles className="w-2.5 h-2.5 mr-1" />
                            Fit: {candidateFit.delta}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {team.tagline}
                      </p>

                      {/* Problem summary quote */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-[11px] text-slate-700 italic">
                        "{team.problemStatement}"
                      </div>

                      {/* Team Roster & Size */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-2 overflow-hidden">
                            {team.members.map((m) => (
                              <img
                                key={m.id}
                                src={m.avatar}
                                alt={m.name}
                                title={`${m.name} (${m.primaryRole})`}
                                className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover cursor-pointer"
                                onClick={() => onInspectRadar(m)}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-slate-600 font-medium">
                            {team.members.length}/{team.targetTeamSize} Roster
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500">
                          Lead: <strong className="text-slate-800">{team.leader.name}</strong> ({team.leader.college})
                        </div>
                      </div>
                    </div>

                    {/* Open Vacancies Section */}
                    <div className="p-5 sm:p-6 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Open Squad Vacancies ({team.openVacancies.length})</span>
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">Select vacancy to apply</span>
                      </div>

                      <div className="space-y-2">
                        {team.openVacancies.map((vacancy, vIdx) => {
                          const isCandidateMatch = vacancy.role === activeApplicant.primaryRole;

                          return (
                            <div
                              key={vIdx}
                              className={`p-3 rounded-2xl border transition-all ${
                                isCandidateMatch 
                                  ? 'bg-emerald-50/60 border-emerald-200 shadow-2xs'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-extrabold text-slate-900">
                                    {vacancy.role}
                                  </span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                    vacancy.priority === 'Critical'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-indigo-100 text-indigo-800'
                                  }`}>
                                    {vacancy.priority}
                                  </span>
                                </div>

                                <button
                                  id={`btn-apply-team-${team.id}-vac-${vIdx}`}
                                  onClick={() => handleOpenApplyModal(team, vIdx)}
                                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 ${
                                    isCandidateMatch
                                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                  }`}
                                >
                                  <span>Apply</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>

                              <p className="text-[11px] text-slate-600 mt-1">
                                {vacancy.description}
                              </p>

                              <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 mt-2">
                                <span className="text-[10px] font-semibold text-slate-400">Required:</span>
                                {vacancy.idealSkills.map((sk, sI) => (
                                  <span key={sI} className="text-[10px] font-semibold px-2 py-0.2 bg-slate-100 text-slate-700 rounded-md border border-slate-200/80">
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* SIH Compliance status line */}
                      {team.sihComplianceStatus && (
                        <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                          <span className="flex items-center space-x-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{team.sihComplianceStatus.neededToSatisfy}</span>
                          </span>
                          <span className="font-mono text-slate-400">{team.weeklyTimeCommitment}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY SUBMITTED APPLICATIONS */}
      {activeSubTab === 'my-apps' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                  <Send className="w-4 h-4 text-indigo-600" />
                  <span>My Submitted Applications ({myApplications.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track status, responses from team leads, and unlocked direct communication channels.
                </p>
              </div>
            </div>

            {myApplications.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/70">
                <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">You haven't applied to any teams yet.</p>
                <button
                  onClick={() => setActiveSubTab('browse')}
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Browse Open Squads
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-extrabold text-slate-900">{app.teamName}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/60">
                            {app.hackathonName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Applying as: <strong className="text-slate-900">{app.targetRole}</strong> • Profile: {app.applicantCandidate.name} ({app.applicantCandidate.college})
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-slate-400 font-mono">{app.timestamp}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          app.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : app.status === 'under_review'
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {app.status === 'accepted' ? 'Accepted & Unlocked' : app.status === 'under_review' ? 'Under Review' : 'Pending Lead Review'}
                        </span>
                      </div>
                    </div>

                    {/* Pitch Message Quote */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-slate-900 block mb-1">Your Application Pitch:</span>
                      "{app.pitchMessage}"
                    </div>

                    {/* Feedback Note from Lead */}
                    {app.feedbackNote && (
                      <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-start space-x-2">
                        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-indigo-950">Team Lead Response:</strong>
                          <span>{app.feedbackNote}</span>
                        </div>
                      </div>
                    )}

                    {/* Unlocked Contacts if Accepted */}
                    {app.status === 'accepted' && app.teamContact && (
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Team Lead Contact Channels Unlocked</span>
                          </span>
                          <span className="text-[10px] text-emerald-700 font-mono">Mutual Match Verified</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                          {app.teamContact.whatsapp && (
                            <a
                              href={`https://wa.me/${app.teamContact.whatsapp.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-white text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                          {app.teamContact.email && (
                            <a
                              href={`mailto:${app.teamContact.email}`}
                              className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-white text-slate-800 rounded-xl border border-emerald-200 text-xs font-bold hover:bg-slate-100 transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5 text-slate-600" />
                              <span>Email</span>
                            </a>
                          )}
                          {app.teamContact.telegram && (
                            <a
                              href={`https://t.me/${app.teamContact.telegram.replace('@', '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-white text-sky-800 rounded-xl border border-emerald-200 text-xs font-bold hover:bg-sky-50 transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                              <span>Telegram</span>
                            </a>
                          )}
                          <button
                            onClick={onNavigateToWorkbench}
                            className="flex items-center justify-center space-x-1 px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-2xs"
                          >
                            <span>Enter Squad</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: INCOMING APPLICATIONS FOR YOUR TEAM */}
      {activeSubTab === 'incoming' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>Incoming Join Requests for Your Team ({incomingApplications.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review candidate pitches, inspect verified 6-axis proof ratings, and admit qualified teammates directly into your Workbench.
              </p>
            </div>

            {incomingApplications.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                <UserCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">No pending incoming join requests for your squad.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incomingApplications.map((app) => {
                  const applicant = app.applicantCandidate;
                  const isAlreadyInTeam = currentTeam.some(m => m.id === applicant.id);

                  return (
                    <div
                      key={app.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all space-y-4 shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={applicant.avatar}
                            alt={applicant.name}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-extrabold text-slate-900">{applicant.name}</h4>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/60">
                                {applicant.archetype}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                                {applicant.gender}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600">
                              {applicant.college} • {applicant.department} ({applicant.yearOfStudy})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onInspectRadar(applicant)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1"
                          >
                            <Zap className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Inspect 6-Axis Radar</span>
                          </button>
                        </div>
                      </div>

                      {/* Target Role & Hours Offered */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Applying For</span>
                          <strong className="text-slate-900">{app.targetRole}</strong>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Availability</span>
                          <strong className="text-emerald-700">{app.weeklyHoursOffered} hrs / week</strong>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Verified Badges</span>
                          <strong className="text-slate-800 text-[11px] truncate block">
                            {applicant.verifiedBadges[0] || 'Code Verified'}
                          </strong>
                        </div>
                      </div>

                      {/* Applicant Pitch Note */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                        <span className="font-bold text-slate-900 block mb-1">Candidate Pitch Statement:</span>
                        "{app.pitchMessage}"
                      </div>

                      {/* Action Decision Buttons */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                        <span className="text-[11px] text-slate-400 font-mono">
                          Submitted {app.timestamp}
                        </span>

                        <div className="flex items-center space-x-2">
                          {isAlreadyInTeam ? (
                            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Admitted into Squad</span>
                            </span>
                          ) : (
                            <>
                              <button
                                id={`btn-decline-app-${app.id}`}
                                onClick={() => {
                                  onDeclineIncomingApplication(app.id);
                                  showToast(`Application from ${applicant.name} declined.`);
                                }}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-bold rounded-xl transition-colors"
                              >
                                Decline
                              </button>
                              <button
                                id={`btn-accept-app-${app.id}`}
                                onClick={() => {
                                  onAcceptIncomingApplication(app.id, applicant);
                                  showToast(`🎉 ${applicant.name} accepted! Added to Team Workbench with synergy boost.`);
                                }}
                                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center space-x-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept into Squad</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* APPLY TO TEAM MODAL */}
      {selectedTeamToApply && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Team Application Flow
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Apply to {selectedTeamToApply.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTeamToApply(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Candidate Credentials Header */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={activeApplicant.avatar}
                  alt={activeApplicant.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-slate-900">{activeApplicant.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({activeApplicant.archetype})</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{activeApplicant.college}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                Verified Credentials Attached
              </span>
            </div>

            {/* Vacancy Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Target Role / Vacancy in this Squad:
              </label>
              <select
                id="apply-vacancy-role-selector"
                value={selectedVacancyIndex}
                onChange={(e) => setSelectedVacancyIndex(Number(e.target.value))}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {selectedTeamToApply.openVacancies.map((v, i) => (
                  <option key={i} value={i}>
                    {v.role} ({v.priority} Priority) • {v.idealSkills.slice(0, 3).join(', ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Pitch Statement */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pitch & Motivation Statement:
                </label>
                <span className="text-[10px] text-slate-400">Highlight past projects & hackathon velocity</span>
              </div>
              <textarea
                id="apply-pitch-textarea"
                rows={4}
                value={pitchMessage}
                onChange={(e) => setPitchMessage(e.target.value)}
                placeholder="Explain why you're a great fit for this team, your technical stack, and how you will help win the competition..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              />
            </div>

            {/* Weekly Availability slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Sprint Commitment Availability:</span>
                <span className="font-extrabold text-indigo-700 font-mono">{weeklyHours} hours / week</span>
              </div>
              <input
                type="range"
                min={15}
                max={50}
                step={5}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>15 hrs (Part-Time)</span>
                <span>30 hrs (Standard Hackathon)</span>
                <span>50 hrs (Crunch Mode)</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedTeamToApply(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-submit-application"
                disabled={isSubmitting || !pitchMessage.trim()}
                onClick={handleConfirmSubmitApplication}
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending Pitch...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

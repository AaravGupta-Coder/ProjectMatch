import React, { useState, useMemo } from 'react';
import { 
  UserCandidate, 
  OpenTeam, 
  TeamJoinApplication,
  ProjectRequirement
} from '../types';
import { 
  Sparkles, 
  Search, 
  Compass, 
  UserPlus, 
  CheckCircle2, 
  Send, 
  Users, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink, 
  TrendingUp, 
  Sliders, 
  Award,
  ChevronRight,
  Filter,
  X,
  Mail,
  Zap,
  Briefcase,
  Layers,
  Star
} from 'lucide-react';

interface JoinProjectsDashboardProps {
  currentUser: UserCandidate;
  openTeams: OpenTeam[];
  projects: ProjectRequirement[];
  applications: TeamJoinApplication[];
  onSubmitApplication: (application: TeamJoinApplication) => void;
  onSwitchIntent: () => void;
  onEditProfile: () => void;
  onInspectRadar?: (candidate: UserCandidate) => void;
}

export const JoinProjectsDashboard: React.FC<JoinProjectsDashboardProps> = ({
  currentUser,
  openTeams,
  projects,
  applications,
  onSubmitApplication,
  onSwitchIntent,
  onEditProfile,
  onInspectRadar
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState('all');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-applications'>('browse');

  // Application Modal state
  const [selectedTeamToApply, setSelectedTeamToApply] = useState<OpenTeam | null>(null);
  const [selectedVacancyIndex, setSelectedVacancyIndex] = useState<number>(0);
  const [customPitch, setCustomPitch] = useState('');
  const [weeklyHoursOffered, setWeeklyHoursOffered] = useState<number>(currentUser.weeklyAvailabilityHours || 30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Calculate Match Score and "How You Can Contribute" for the logged-in user
  const computeMatchDetails = (team: OpenTeam) => {
    let score = 68;
    const contributions: string[] = [];

    // 1. Direct Vacancy / Role Match
    const matchingVacancy = team.openVacancies.find(
      v => v.role === currentUser.primaryRole || v.archetype === currentUser.archetype
    );

    if (matchingVacancy) {
      score += 18;
      contributions.push(`Direct match for open "${matchingVacancy.role}" vacancy.`);
    } else {
      contributions.push(`Adds complementary ${currentUser.archetype} perspective.`);
    }

    // 2. Skills overlap
    const userSkillsLower = currentUser.topSkills.map(s => s.toLowerCase());
    const matchedSkills: string[] = [];
    team.openVacancies.forEach(v => {
      v.idealSkills.forEach(sk => {
        if (userSkillsLower.some(us => us.includes(sk.toLowerCase()) || sk.toLowerCase().includes(us))) {
          if (!matchedSkills.includes(sk)) matchedSkills.push(sk);
        }
      });
    });

    if (matchedSkills.length > 0) {
      score += Math.min(matchedSkills.length * 4, 12);
      contributions.push(`Brings desired skills: ${matchedSkills.slice(0, 3).join(', ')}.`);
    }

    // 3. Team Diversity
    if (!team.sihComplianceStatus?.hasFemaleMember && currentUser.gender === 'Female') {
      score += 8;
      contributions.push('Fulfills team gender diversity criteria (+8 fit bonus).');
    }

    // 4. Bandwidth Quorum
    if (currentUser.weeklyAvailabilityHours >= 30) {
      contributions.push(`Provides robust ${currentUser.weeklyAvailabilityHours} hrs/week high-bandwidth sprint commitment.`);
    }

    // Projected Team Score Delta
    const currentScore = team.synergyScore || 75;
    const projectedScore = Math.min(currentScore + (matchingVacancy ? 14 : 8), 98);
    const scoreDelta = projectedScore - currentScore;

    return {
      matchPercentage: Math.min(score, 98),
      contributions,
      matchingVacancy,
      currentScore,
      projectedScore,
      scoreDelta
    };
  };

  // Filtered Open Teams with computed match score
  const matchedTeams = useMemo(() => {
    return openTeams.map(team => {
      const match = computeMatchDetails(team);
      return {
        ...team,
        matchDetails: match
      };
    }).filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hackathonTrack.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.problemStatement.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.openVacancies.some(v => v.role.toLowerCase().includes(searchQuery.toLowerCase()) || v.idealSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesTrack = selectedTrackFilter === 'all' || item.hackathonTrack.toLowerCase().includes(selectedTrackFilter.toLowerCase());
      const matchesScore = item.matchDetails.matchPercentage >= minMatchScore;

      return matchesSearch && matchesTrack && matchesScore;
    }).sort((a, b) => b.matchDetails.matchPercentage - a.matchDetails.matchPercentage);
  }, [openTeams, searchQuery, selectedTrackFilter, minMatchScore, currentUser]);

  const handleOpenApplyModal = (team: OpenTeam, defaultVacancyIdx = 0) => {
    setSelectedTeamToApply(team);
    setSelectedVacancyIndex(defaultVacancyIdx);
    const targetVac = team.openVacancies[defaultVacancyIdx] || team.openVacancies[0];
    setCustomPitch(
      `Hi ${team.leader.name} & team! I would love to join ${team.name} as your ${targetVac?.role || currentUser.primaryRole}. With my background in ${currentUser.department} at ${currentUser.college.split(',')[0]} and skills in ${currentUser.topSkills.slice(0, 3).join(', ')}, I can immediately help build out your core deliverables and maximize our sprint score!`
    );
    setWeeklyHoursOffered(currentUser.weeklyAvailabilityHours);
  };

  const handleConfirmApplication = () => {
    if (!selectedTeamToApply) return;
    setIsSubmitting(true);

    const targetVac = selectedTeamToApply.openVacancies[selectedVacancyIndex] || selectedTeamToApply.openVacancies[0];

    const newApp: TeamJoinApplication = {
      id: `app-${Date.now()}`,
      teamId: selectedTeamToApply.id,
      teamName: selectedTeamToApply.name,
      hackathonName: selectedTeamToApply.hackathonName,
      applicantCandidate: currentUser,
      targetRole: targetVac ? targetVac.role : currentUser.primaryRole,
      pitchMessage: customPitch,
      weeklyHoursOffered,
      timestamp: 'Just now',
      status: 'pending'
    };

    setTimeout(() => {
      onSubmitApplication(newApp);
      setIsSubmitting(false);
      setSelectedTeamToApply(null);
      showToast(`Application sent to ${selectedTeamToApply.name}! Track progress in My Applications.`);
    }, 400);
  };

  const myApplications = applications.filter(a => !a.isIncomingToUserTeam);

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

      {/* Logged-in Candidate Identity Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-400 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  🎯 Joiner Mode Active
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {currentUser.college.split(',')[0]}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {currentUser.name}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200 font-medium">
                {currentUser.primaryRole} • <span className="text-slate-300">{currentUser.archetype}</span>
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentUser.topSkills.map((s, idx) => (
                  <span key={idx} className="text-[10px] font-semibold bg-white/10 text-slate-200 px-2 py-0.5 rounded-md border border-white/10">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onEditProfile}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors"
            >
              Edit Profile Details
            </button>
            <button
              onClick={onSwitchIntent}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-md shadow-purple-600/20 transition-all flex items-center space-x-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Switch to "Create a Team" Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'browse'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Browse Projects & Hackathon Teams ({matchedTeams.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my-applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'my-applications'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>My Submitted Applications ({myApplications.length})</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline-block">
          Matching based on your <strong className="text-slate-800">{currentUser.primaryRole}</strong> profile
        </span>
      </div>

      {/* TAB 1: BROWSE PROJECTS & SQUADS */}
      {activeTab === 'browse' && (
        <div className="space-y-5">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects, tracks, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedTrackFilter}
                onChange={(e) => setSelectedTrackFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Tracks</option>
                <option value="Health">HealthTech & Healthcare AI</option>
                <option value="Robotics">Robotics & Disaster</option>
                <option value="Web3">Web3 & Security</option>
                <option value="Agriculture">Smart Agriculture</option>
                <option value="CleanTech">CleanTech & Energy</option>
              </select>

              <select
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(Number(e.target.value))}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value={0}>All Match Scores</option>
                <option value={80}>High Match (≥80%)</option>
                <option value={90}>Super Fit (≥90%)</option>
              </select>

              {(searchQuery || selectedTrackFilter !== 'all' || minMatchScore > 0) && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedTrackFilter('all'); setMinMatchScore(0); }}
                  className="text-xs text-slate-500 hover:text-slate-900 font-bold px-2 py-1"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Projects & Squads List */}
          {matchedTeams.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Compass className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Projects Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No active hackathon projects matched your filter criteria. Try clearing search keywords or lowering the match threshold.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {matchedTeams.map((team) => {
                const { matchDetails } = team;
                const isHighMatch = matchDetails.matchPercentage >= 85;

                return (
                  <div
                    key={team.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all space-y-5"
                  >
                    {/* Header: Project Title, Hackathon & Match Score */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-full">
                            {team.hackathonName}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {team.hackathonTrack}
                          </span>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                            {team.urgency}
                          </span>
                        </div>

                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                          {team.name}
                        </h2>

                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {team.tagline}
                        </p>
                      </div>

                      {/* Prominent Match Score & Delta Badge */}
                      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-4 rounded-2xl border border-indigo-800/60 flex sm:flex-col items-center sm:items-end justify-between gap-3 min-w-[200px] shadow-sm shrink-0">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                            Your Match Score
                          </span>
                          <div className="flex items-baseline space-x-1 sm:justify-end">
                            <span className="text-2xl font-black font-mono text-emerald-400">
                              {matchDetails.matchPercentage}%
                            </span>
                            <span className="text-[10px] text-slate-400">Match</span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right border-t border-slate-800/80 pt-2 w-full">
                          <span className="text-[10px] text-slate-400 block">Projected Squad Score:</span>
                          <span className="text-xs font-bold text-indigo-200">
                            {matchDetails.currentScore} → <strong className="text-emerald-400 font-mono text-sm">{matchDetails.projectedScore}</strong> (+{matchDetails.scoreDelta} Boost)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Problem Statement Box */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-slate-900 block mb-1">Challenge Statement:</span>
                      {team.problemStatement}
                    </div>

                    {/* SECTION: "HOW YOU CAN CONTRIBUTE" (Key Requirement) */}
                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>How You Can Contribute to {team.name}:</span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-950">
                        {matchDetails.contributions.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Open Vacancies Grid */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Open Roles / Vacancies ({team.openVacancies.length})</span>
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Target Team Size: {team.targetTeamSize} ({team.members.length} Confirmed)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {team.openVacancies.map((vac, vIdx) => {
                          const isDirectMatch = vac.role === currentUser.primaryRole;

                          return (
                            <div
                              key={vIdx}
                              className={`p-3.5 rounded-2xl border text-xs space-y-2 flex flex-col justify-between ${
                                isDirectMatch
                                  ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-400/30'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
                                    <span>{vac.role}</span>
                                    {isDirectMatch && (
                                      <span className="text-[9px] font-extrabold bg-indigo-600 text-white px-1.5 py-0.2 rounded">
                                        Your Role
                                      </span>
                                    )}
                                  </h4>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                    vac.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {vac.priority}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-snug">{vac.description}</p>
                              </div>

                              <div className="flex flex-wrap gap-1 pt-1">
                                {vac.idealSkills.map((sk, skIdx) => (
                                  <span key={skIdx} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Current Team Members Preview & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center space-x-2 text-xs text-slate-600">
                        <span className="font-semibold text-slate-700">Team Leader & Squad:</span>
                        <div className="flex -space-x-2">
                          {team.members.map((m, mIdx) => (
                            <img
                              key={mIdx}
                              src={m.avatar}
                              alt={m.name}
                              title={`${m.name} (${m.primaryRole})`}
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-full border-2 border-white object-cover"
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Led by {team.leader.name} ({team.leader.college.split(',')[0]})
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenApplyModal(team, 0)}
                          className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Apply to Join Team</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY SUBMITTED APPLICATIONS */}
      {activeTab === 'my-applications' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Submitted Pitch Applications</h2>
              <p className="text-xs text-slate-500">Track responses and contact access from hackathon team leads.</p>
            </div>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200">
              {myApplications.length} Applications Total
            </span>
          </div>

          {myApplications.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Send className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Active Applications Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore recruiting hackathon squads above and send your personalized pitch to get connected!
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-indigo-700"
              >
                Browse Projects Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-slate-900">{app.teamName}</h4>
                        <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {app.hackathonName}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-600 font-semibold">
                        Role Applied: {app.targetRole} • {app.weeklyHoursOffered}h/wk offered
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        app.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : app.status === 'under_review'
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            : app.status === 'declined'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {app.status === 'accepted' ? '✓ Accepted into Squad' : app.status === 'under_review' ? 'Review in Progress' : 'Pending Team Decision'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{app.timestamp}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed italic">
                    "{app.pitchMessage}"
                  </div>

                  {app.feedbackNote && (
                    <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200 text-xs text-indigo-950 flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block">Team Leader Feedback:</strong>
                        <span>{app.feedbackNote}</span>
                      </div>
                    </div>
                  )}

                  {app.status === 'accepted' && app.teamContact && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex flex-wrap items-center gap-3">
                      <span className="font-bold">Unlocked Team Contact:</span>
                      <span>Email: {app.teamContact.email}</span>
                      <span>Telegram: {app.teamContact.telegram}</span>
                      <span>WhatsApp: {app.teamContact.whatsapp}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* APPLICATION MODAL */}
      {selectedTeamToApply && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  1-Click Pitch Application
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Apply to {selectedTeamToApply.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTeamToApply(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Vacancy / Role</label>
                <select
                  value={selectedVacancyIndex}
                  onChange={(e) => setSelectedVacancyIndex(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                >
                  {selectedTeamToApply.openVacancies.map((v, i) => (
                    <option key={i} value={i}>
                      {v.role} ({v.priority} Priority • Archetype: {v.archetype})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Weekly Time Commitment (Hours/Week)</label>
                <select
                  value={weeklyHoursOffered}
                  onChange={(e) => setWeeklyHoursOffered(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                >
                  <option value={20}>20 hrs/week (Consistent)</option>
                  <option value={30}>30 hrs/week (High Velocity)</option>
                  <option value={40}>40 hrs/week (Full Sprint Crunch)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Personalized Pitch & Contribution Plan</label>
                <textarea
                  rows={4}
                  value={customPitch}
                  onChange={(e) => setCustomPitch(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 leading-relaxed focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedTeamToApply(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmApplication}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending Pitch...' : 'Send Pitch Application'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

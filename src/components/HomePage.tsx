import React, { useState, useMemo } from 'react';
import { 
  UserCandidate, 
  ProjectRequirement, 
  OpenTeam, 
  TeamInvite, 
  TeamJoinApplication,
  Archetype,
  PrimaryRole,
  SIHComplianceStatus
} from '../types';
import { 
  Users, 
  Sparkles, 
  Search, 
  Filter, 
  Layers, 
  UserPlus, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Award, 
  ShieldCheck, 
  Send, 
  Plus, 
  RotateCcw, 
  ChevronRight, 
  Flame, 
  ShieldAlert, 
  Radar, 
  Mail, 
  Phone, 
  ExternalLink, 
  FileText, 
  Check, 
  X, 
  MessageSquare, 
  Briefcase, 
  SlidersHorizontal,
  Compass,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown,
  Lock,
  HeartHandshake
} from 'lucide-react';
import { simulateCandidateDelta, calculateSIHCompliance, computeLocalTeamScore } from '../utils/synergyEngine';
import { CandidateCard } from './CandidateCard';

interface HomePageProps {
  currentTeam: UserCandidate[];
  allCandidates: UserCandidate[];
  projects: ProjectRequirement[];
  currentProject: ProjectRequirement;
  openTeams: OpenTeam[];
  invites: TeamInvite[];
  applications: TeamJoinApplication[];
  onSelectProject: (proj: ProjectRequirement) => void;
  onAddToTeam: (candidate: UserCandidate) => void;
  onRemoveFromTeam: (candidateId: string) => void;
  onApplyToTeam: (app: Omit<TeamJoinApplication, 'id' | 'timestamp'>) => void;
  onAcceptIncomingApplication: (appId: string, candidate: UserCandidate) => void;
  onDeclineIncomingApplication: (appId: string) => void;
  onAcceptInvite: (inviteId: string) => void;
  onNavigate: (tab: 'workbench' | 'discovery' | 'jointeam' | 'soloboard' | 'deconstruct' | 'charter' | 'overview') => void;
  onOpenRadarModal: (candidate: UserCandidate) => void;
  onOpenContactModal: (candidate: UserCandidate) => void;
  onOpenProofModal: () => void;
  onOpenProfileModal: () => void;
  onSaveNewProject: (project: ProjectRequirement) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentTeam,
  allCandidates,
  projects,
  currentProject,
  openTeams,
  invites,
  applications,
  onSelectProject,
  onAddToTeam,
  onRemoveFromTeam,
  onApplyToTeam,
  onAcceptIncomingApplication,
  onDeclineIncomingApplication,
  onAcceptInvite,
  onNavigate,
  onOpenRadarModal,
  onOpenContactModal,
  onOpenProofModal,
  onOpenProfileModal,
  onSaveNewProject,
}) => {
  // Navigation & Views
  const [activeSection, setActiveSection] = useState<'all' | 'browse-projects' | 'talent-pool' | 'live-simulator' | 'create-project'>('all');
  
  // Signed-in user persona (for live fit score calculation)
  const [currentUserPersonaId, setCurrentUserPersonaId] = useState<string>(allCandidates[1]?.id || 'cand-2'); // Diya Sen (UX Crafter)
  const currentUser = useMemo(() => {
    return allCandidates.find(c => c.id === currentUserPersonaId) || allCandidates[0];
  }, [allCandidates, currentUserPersonaId]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // --- Feature 1A: Join Team Modal State ---
  const [joiningProject, setJoiningProject] = useState<ProjectRequirement | null>(null);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);
  const [joinPitchMessage, setJoinPitchMessage] = useState<string>('');
  const [joinWeeklyHours, setJoinWeeklyHours] = useState<number>(30);
  const [joinSuccessData, setJoinSuccessData] = useState<{ role: string; contact: any } | null>(null);

  // --- Feature 1B: Create Project Form State ---
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newTrack, setNewTrack] = useState('Smart India Hackathon 2026 - Smart Grid & Clean Energy');
  const [newCategory, setNewCategory] = useState('Clean Energy & IoT');
  const [newDeadline, setNewDeadline] = useState('36 Hours Sprint');
  const [newDescription, setNewDescription] = useState('');
  const [newTeamSize, setNewTeamSize] = useState(4);
  const [newWeeklyHours, setNewWeeklyHours] = useState(30);
  const [newRoles, setNewRoles] = useState<Array<{ role: string; priority: 'Critical' | 'Recommended' | 'Bonus'; archetype: Archetype; idealSkills: string[]; responsibility: string }>>([
    { role: 'Full-Stack Engineer', priority: 'Critical', archetype: 'System Architect', idealSkills: ['Go', 'TypeScript', 'PostgreSQL'], responsibility: 'Build core consensus engine and API skeleton' },
    { role: 'AI / ML Specialist', priority: 'Critical', archetype: 'Quantitative Mind', idealSkills: ['Python', 'Gemini SDK', 'PyTorch'], responsibility: 'Train and optimize neural forecast models' },
    { role: 'UI/UX Product Designer', priority: 'Critical', archetype: 'UX Crafter', idealSkills: ['Figma', 'React 19', 'Tailwind CSS'], responsibility: 'Design responsive real-time dispatch dashboard' }
  ]);
  const [ruleMixedGender, setRuleMixedGender] = useState(true);
  const [ruleBranchDiversity, setRuleBranchDiversity] = useState(true);
  const [ruleYearMix, setRuleYearMix] = useState(true);
  const [ruleWeekendAvail, setRuleWeekendAvail] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // --- Feature 2: E-Commerce Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState('All');
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [filterDomain, setFilterDomain] = useState('All');
  const [filterTrackRecord, setFilterTrackRecord] = useState('All');
  const [filterLanguage, setFilterLanguage] = useState('All');
  const [filterMinWins, setFilterMinWins] = useState(0);

  // --- Feature 4: Live Team Score Simulator State ---
  const [isSimulatingAnalysis, setIsSimulatingAnalysis] = useState(false);
  const [simulationStage, setSimulationStage] = useState<string | null>(null);

  // --- Feature 7: AI Explain State ---
  const [explainingProjectId, setExplainingProjectId] = useState<string | null>(null);
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const [isLoadingAIExplain, setIsLoadingAIExplain] = useState<string | null>(null);

  // Dynamic Skills list across all candidates
  const allDistinctSkills = useMemo(() => {
    const set = new Set<string>();
    allCandidates.forEach(c => c.topSkills.forEach(s => set.add(s)));
    return ['All', ...Array.from(set).sort()];
  }, [allCandidates]);

  // E-Commerce Filter Logic
  const filteredMembers = useMemo(() => {
    return allCandidates.filter(c => {
      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = 
          c.name.toLowerCase().includes(q) ||
          c.headline.toLowerCase().includes(q) ||
          c.primaryRole.toLowerCase().includes(q) ||
          c.college.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q) ||
          c.topSkills.some(s => s.toLowerCase().includes(q));
        if (!matchesText) return false;
      }

      // Skill filter
      if (filterSkill !== 'All' && !c.topSkills.includes(filterSkill)) {
        return false;
      }

      // Branch filter
      if (filterBranch !== 'All') {
        const b = filterBranch.toLowerCase();
        if (!c.department.toLowerCase().includes(b)) return false;
      }

      // Gender filter
      if (filterGender !== 'All' && c.gender !== filterGender) {
        return false;
      }

      // Year filter
      if (filterYear !== 'All' && c.yearOfStudy !== filterYear) {
        return false;
      }

      // Domain filter
      if (filterDomain !== 'All') {
        const d = filterDomain.toLowerCase();
        const matchesDomain = c.interestedDomains.some(id => id.toLowerCase().includes(d)) || 
          c.primaryRole.toLowerCase().includes(d) ||
          c.topSkills.some(s => s.toLowerCase().includes(d));
        if (!matchesDomain) return false;
      }

      // Track record filter
      if (filterTrackRecord === 'first_timer' && c.hackathonsWon !== 0) return false;
      if (filterTrackRecord === 'won_1' && c.hackathonsWon < 1) return false;
      if (filterTrackRecord === 'won_3' && c.hackathonsWon < 3) return false;

      // Native language filter
      if (filterLanguage !== 'All') {
        const lang = (c.nativeLanguage || 'English / Hindi').toLowerCase();
        if (!lang.includes(filterLanguage.toLowerCase())) return false;
      }

      // Min wins filter
      if (c.hackathonsWon < filterMinWins) return false;

      return true;
    });
  }, [allCandidates, searchQuery, filterSkill, filterBranch, filterGender, filterYear, filterDomain, filterTrackRecord, filterLanguage, filterMinWins]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setFilterSkill('All');
    setFilterBranch('All');
    setFilterGender('All');
    setFilterYear('All');
    setFilterDomain('All');
    setFilterTrackRecord('All');
    setFilterLanguage('All');
    setFilterMinWins(0);
  };

  // --- Feature 1A Fit Score Calculation Function (0–100) ---
  // Skill match (40 pts) + Availability (20 pts) + Experience (16 pts) + Verified skill (8 pts) capped at 100
  const computeFitScoreForRole = (user: UserCandidate, targetRoleObj: { role: string; idealSkills: string[] }) => {
    const requiredSkills = targetRoleObj.idealSkills || [];
    let matchedSkillsCount = 0;
    
    requiredSkills.forEach(reqSkill => {
      const isMatched = (user.topSkills || []).some(s => 
        s.toLowerCase().includes(reqSkill.toLowerCase()) || 
        reqSkill.toLowerCase().includes(s.toLowerCase())
      );
      if (isMatched) matchedSkillsCount++;
    });

    // 1. Skill match (40 pts max)
    const skillScore = requiredSkills.length > 0 ? (matchedSkillsCount / requiredSkills.length) * 40 : 30;

    // 2. Availability (20 pts max)
    const availScore = Math.min(20, ((user.weeklyAvailabilityHours || 30) / 35) * 20);

    // 3. Experience / projects done (16 pts max)
    const expCount = user.completedProjectsCount || user.pastProjects?.length || 2;
    const expScore = Math.min(16, (expCount / 3) * 16);

    // 4. Verified / evidence-linked skill (8 pts max)
    const hasVerifiedSkill = (user.inferredSkills && user.inferredSkills.length > 0) || (user.verifiedBadges && user.verifiedBadges.length > 0);
    const verifiedScore = hasVerifiedSkill ? 8 : 4;

    // Base score + components capped at 100
    const rawTotal = Math.round(skillScore + availScore + expScore + verifiedScore + 16);
    const score = Math.min(100, Math.max(20, rawTotal));

    return {
      score,
      skillScore: Math.round(skillScore),
      availScore: Math.round(availScore),
      expScore: Math.round(expScore),
      verifiedScore,
      matchedSkillsCount,
      totalSkills: requiredSkills.length,
      hasVerifiedSkill
    };
  };

  // Live fit score for current joining project & selected role
  const selectedRoleObj = joiningProject?.requiredRoles?.[selectedRoleIndex] || joiningProject?.requiredRoles?.[0];
  const fitMetrics = useMemo(() => {
    if (!selectedRoleObj) return { score: 75, skillScore: 30, availScore: 18, expScore: 14, verifiedScore: 8, matchedSkillsCount: 2, totalSkills: 3, hasVerifiedSkill: true };
    return computeFitScoreForRole(currentUser, selectedRoleObj);
  }, [currentUser, selectedRoleObj]);

  const handleOpenJoinModal = (project: ProjectRequirement, roleIdx = 0) => {
    setJoiningProject(project);
    setSelectedRoleIndex(roleIdx);
    setJoinSuccessData(null);
    const role = project.requiredRoles?.[roleIdx] || project.requiredRoles?.[0] || { role: 'Full-Stack Developer', idealSkills: [] };
    setJoinPitchMessage(`Hi ${project.creatorName || 'Team Lead'}! I am excited to join ${project.title} as ${role.role}. With my background in ${currentUser.primaryRole}, ${(currentUser.topSkills || []).slice(0, 3).join(', ')}, and commitment of ${currentUser.weeklyAvailabilityHours || 30}h/week, I can ensure rapid sprint execution.`);
    setJoinWeeklyHours(currentUser.weeklyAvailabilityHours || 30);
  };

  const handleConfirmJoin = () => {
    if (!joiningProject || !selectedRoleObj) return;

    const roleName = selectedRoleObj.role as PrimaryRole;
    onApplyToTeam({
      teamId: joiningProject.id,
      teamName: joiningProject.title,
      hackathonName: joiningProject.track,
      applicantCandidate: currentUser,
      targetRole: roleName,
      pitchMessage: joinPitchMessage.trim(),
      weeklyHoursOffered: joinWeeklyHours,
      status: 'accepted',
      isIncomingToUserTeam: false
    });

    const leadContact = {
      email: `${(joiningProject.creatorName || 'lead').toLowerCase().replace(/\s+/g, '.')}@${(joiningProject.creatorCollege || 'iitb').toLowerCase().replace(/[^a-z]/g, '')}.ac.in`,
      phone: '+91 98201 44521',
      whatsapp: '+919820144521',
      telegram: `@${(joiningProject.creatorName || 'lead').toLowerCase().replace(/\s+/g, '_')}`
    };

    setJoinSuccessData({
      role: selectedRoleObj.role,
      contact: leadContact
    });

    showToast(`🎉 Request sent & accepted! You have joined ${joiningProject.title} as ${selectedRoleObj.role}.`);
  };

  // --- Feature 4: Live Team Score Simulator Calculations ---
  // Weighted: Role coverage (30%) + Skill breadth (25%) + Cohesion (15%) + Rule compliance (30%)
  const calculateSimulatedTeamScore = (team: UserCandidate[], project: ProjectRequirement) => {
    const compliance = calculateSIHCompliance(team, project);
    const targetSize = project.targetTeamSize || 4;

    // 1. Role coverage (30%)
    const coveredRolesRatio = (compliance.coveredRoles?.length || 0) / Math.max(project.requiredRoles?.length || 1, 1);
    const roleCoverageScore = Math.min(30, coveredRolesRatio * 30);

    // 2. Skill breadth / coverage (25%)
    const allTeamSkills = new Set<string>();
    team.forEach(m => (m.topSkills || []).forEach(s => allTeamSkills.add(s.toLowerCase())));
    const idealSkillsRequired = (project.requiredRoles || []).flatMap(r => (r.idealSkills || []).map(s => s.toLowerCase()));
    let skillsSatisfied = 0;
    idealSkillsRequired.forEach(req => {
      if (Array.from(allTeamSkills).some(s => s.includes(req) || req.includes(s))) {
        skillsSatisfied++;
      }
    });
    const skillBreadthScore = idealSkillsRequired.length > 0 ? (skillsSatisfied / idealSkillsRequired.length) * 25 : 20;

    // 3. Cohesion / shared interests (15%)
    const distinctArchetypes = new Set(team.map(m => m.archetype)).size;
    const archetypeBalanceRatio = Math.min(distinctArchetypes / Math.min(team.length, 4), 1);
    const cohesionScore = (archetypeBalanceRatio * 10) + (team.length >= 2 ? 5 : 2);

    // 4. Rule compliance (30%)
    let rulePoints = 0;
    if (compliance.femaleMemberSatisfied) rulePoints += 12;
    if (compliance.branchDiversitySatisfied) rulePoints += 10;
    if (compliance.bandwidthQuorumSatisfied) rulePoints += 8;
    const ruleScore = Math.min(30, rulePoints);

    const totalRaw = Math.round(roleCoverageScore + skillBreadthScore + cohesionScore + ruleScore);
    const score = Math.min(99, Math.max(25, totalRaw));

    let verdict: 'Excellent' | 'Strong' | 'Rebalance' = 'Strong';
    if (score >= 85) verdict = 'Excellent';
    else if (score < 70) verdict = 'Rebalance';

    return {
      score,
      verdict,
      roleCoverageScore: Math.round(roleCoverageScore),
      skillBreadthScore: Math.round(skillBreadthScore),
      cohesionScore: Math.round(cohesionScore),
      ruleScore: Math.round(ruleScore),
      compliance,
      coveredRoles: compliance.coveredRoles,
      missingRoles: compliance.missingRoles,
      skillsSatisfied,
      totalIdealSkills: idealSkillsRequired.length
    };
  };

  const simulatedScoreData = useMemo(() => {
    return calculateSimulatedTeamScore(currentTeam, currentProject);
  }, [currentTeam, currentProject]);

  const handleRunAnimatedSimulator = () => {
    setIsSimulatingAnalysis(true);
    setSimulationStage('Parsing Project Specs & SIH Rules...');
    
    setTimeout(() => {
      setSimulationStage('Scanning Candidate Pool & Public Proofs...');
    }, 600);

    setTimeout(() => {
      setSimulationStage('Cross-checking 6-Axis Radars & Commits...');
    }, 1200);

    setTimeout(() => {
      setSimulationStage('Optimizing Complementary Archetype Balance...');
    }, 1800);

    setTimeout(() => {
      setSimulationStage('Applying SIH Gender & Branch Constraint Engine...');
    }, 2400);

    setTimeout(() => {
      setIsSimulatingAnalysis(false);
      setSimulationStage(null);
      showToast('⚡ Live Team Score Simulation & Gap Analysis Complete!');
    }, 3000);
  };

  // --- Feature 7: AI Explain Gap Fetcher ---
  const handleAIExplain = async (project: ProjectRequirement) => {
    setExplainingProjectId(project.id);
    setIsLoadingAIExplain(project.id);

    try {
      const response = await fetch('/api/ai/skill-gap-reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project,
          currentTeam,
          candidatePool: allCandidates
        })
      });

      const data = await response.json();
      if (data.success && data.data) {
        setAiExplanations(prev => ({
          ...prev,
          [project.id]: `${data.data.headlineSentence} ${data.data.shortWhy}`
        }));
      } else {
        // Fallback explanation
        const missing = project.requiredRoles.filter(r => !currentTeam.some(m => m.primaryRole.toLowerCase().includes(r.role.toLowerCase()))).map(r => r.role);
        setAiExplanations(prev => ({
          ...prev,
          [project.id]: `You need a person with ${missing.join(', ') || 'UI/UX Design'} because you have ${currentTeam.map(m => m.primaryRole).join(' & ')}, and this project requires high-contrast UI polish and multimodal reasoning.`
        }));
      }
    } catch {
      const missing = project.requiredRoles.filter(r => !currentTeam.some(m => m.primaryRole.toLowerCase().includes(r.role.toLowerCase()))).map(r => r.role);
      setAiExplanations(prev => ({
        ...prev,
        [project.id]: `You need a person with ${missing.join(', ') || 'UI/UX Design'} because you have ${currentTeam.map(m => m.primaryRole).join(' & ')}, and this project requires high-contrast UI polish and multimodal reasoning.`
      }));
    } finally {
      setIsLoadingAIExplain(null);
    }
  };

  // --- Feature 1B: Create Project Submission ---
  const handleAddRoleRow = () => {
    setNewRoles(prev => [
      ...prev,
      { role: 'Hardware & Embedded Engineer', priority: 'Recommended', archetype: 'System Architect', idealSkills: ['C++', 'ESP32', 'ROS 2'], responsibility: 'Design edge sensor nodes and telemetry link' }
    ]);
  };

  const handleRemoveRoleRow = (idx: number) => {
    if (newRoles.length <= 1) return;
    setNewRoles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveProjectForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!newTitle.trim()) errors.title = 'Project title is required.';
    if (!newDescription.trim()) errors.description = 'Project description is required.';
    if (newRoles.length === 0) errors.roles = 'At least one role is required.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const createdProject: ProjectRequirement = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      tagline: newTagline.trim() || newTitle.trim(),
      track: newTrack,
      competitionContext: `${newTrack} (${newDeadline})`,
      description: newDescription.trim(),
      targetTeamSize: newTeamSize,
      postedTime: 'Just now',
      userStatus: 'active',
      creatorName: currentUser.name,
      creatorCollege: currentUser.college,
      sihConstraints: {
        requireFemaleMember: ruleMixedGender,
        minDepartments: ruleBranchDiversity ? 3 : 1,
        allowedYears: ruleYearMix ? ['2nd Year', '3rd Year', '4th Year'] : ['All'],
        maxTeamSize: newTeamSize,
        targetTrack: newCategory
      },
      requiredRoles: newRoles,
      criticalTechStack: Array.from(new Set(newRoles.flatMap(r => r.idealSkills))).slice(0, 7) as string[],
      radarTarget: {
        technicalCoverage: 92,
        archetypeBalance: 90,
        communicationPace: 88,
        bandwidthReliability: 90,
        innovationIndex: 94
      },
      keyMilestones: [
        { phase: 'Hours 00-08', deliverable: 'Architecture Blueprint Frozen & Repository Scaffolded', leadRole: newRoles[0]?.role || 'Full-Stack Engineer' },
        { phase: 'Hours 08-24', deliverable: 'Core Algorithm & AI Inference Loop Live', leadRole: newRoles[1]?.role || 'AI Specialist' },
        { phase: 'Hours 24-36', deliverable: 'Frontend UI Micro-Interactions & Jury Demo Script', leadRole: newRoles[2]?.role || 'UI Designer' }
      ]
    };

    onSaveNewProject(createdProject);
    onSelectProject(createdProject);
    showToast(`🎉 Project "${createdProject.title}" posted successfully! Loaded directly into Live Team Composer.`);
    setActiveSection('live-simulator');
    setFormErrors({});
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-in slide-in-from-bottom-4 duration-200 max-w-md">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold leading-snug">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. TOP COMMAND HERO & LIVED-IN STATE STATUS */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800/40 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>ProjectMatch · 10-Feature Synergy OS</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Evidence-Based Hackathon Teaming & Simulator
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Form winning hackathon teams using proof-backed skill verification, 6-axis synergy simulation, instant fit deltas, and multi-department constraint checks.
            </p>

            {/* Lived-in state quick stats bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-3 py-1.5 rounded-xl flex items-center space-x-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300">Active Team:</span>
                <span className="font-bold text-white">{currentTeam.length}/{currentProject.targetTeamSize || 4} Members</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-3 py-1.5 rounded-xl flex items-center space-x-2 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-300">Team Score:</span>
                <span className="font-extrabold text-emerald-400 font-mono">{simulatedScoreData.score}/100</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-3 py-1.5 rounded-xl flex items-center space-x-2 text-xs">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-slate-300">Talent Pool:</span>
                <span className="font-bold text-white">{allCandidates.length} Verified</span>
              </div>
            </div>
          </div>

          {/* Signed-in User Persona Switcher (Live Fit Simulator) */}
          <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 space-y-2.5 w-full lg:w-84 shadow-lg shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Signed In As Persona:</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                Live Fit Active
              </span>
            </div>

            <select
              id="persona-switcher"
              value={currentUserPersonaId}
              onChange={(e) => setCurrentUserPersonaId(e.target.value)}
              className="w-full bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {allCandidates.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.primaryRole} • {c.archetype})
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-800">
              <span className="truncate max-w-[130px]">{currentUser.college}</span>
              <span className="text-emerald-400 font-bold font-mono">{currentUser.weeklyAvailabilityHours}h/wk free</span>
            </div>

            <button
              type="button"
              onClick={onOpenProfileModal}
              className="w-full mt-1.5 py-1.5 px-3 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-2xs border border-indigo-500/40 active:scale-98"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View & Edit My Profile / Skills</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MASTER SECTION NAVIGATION TABS */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSection('all')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Home Hub (All 10 Modules)</span>
        </button>

        <button
          onClick={() => setActiveSection('live-simulator')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'live-simulator'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Live Team Simulator ⭐</span>
          <span className="px-1.5 py-0.2 bg-white/20 text-white rounded-full text-[10px] font-mono">
            {simulatedScoreData.score}/100
          </span>
        </button>

        <button
          onClick={() => setActiveSection('browse-projects')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'browse-projects'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Join a Team (Dual Intake 1A)</span>
          <span className="px-1.5 py-0.2 bg-purple-200 text-purple-900 rounded-full text-[10px] font-bold">
            {projects.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('talent-pool')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'talent-pool'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Member Pool & E-Commerce Filters (2)</span>
          <span className="px-1.5 py-0.2 bg-blue-200 text-blue-900 rounded-full text-[10px] font-bold">
            {filteredMembers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('create-project')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'create-project'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Post a Project (1B)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. FEATURE 4 & 5: LIVE TEAM SCORE SIMULATOR ⭐ (SIGNATURE FEATURE) */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'live-simulator') && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Feature 4 & 5 Signature
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Live Team Score Simulator & Rule Engine
                </h2>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Real-time scoring weighted by Role Coverage (30%), Skill Breadth (25%), Cohesion (15%), & Compliance (30%).
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRunAnimatedSimulator}
                disabled={isSimulatingAnalysis}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 ${isSimulatingAnalysis ? 'animate-spin' : ''}`} />
                <span>{isSimulatingAnalysis ? 'Simulating Analysis...' : 'Re-Run Live Simulator'}</span>
              </button>
            </div>
          </div>

          {/* Animated Simulation Banner */}
          {simulationStage && (
            <div className="p-3.5 bg-indigo-900 text-white rounded-2xl border border-indigo-700 flex items-center space-x-3 animate-pulse">
              <div className="w-5 h-5 border-2 border-indigo-300 border-t-white rounded-full animate-spin shrink-0" />
              <span className="text-xs font-semibold">{simulationStage}</span>
            </div>
          )}

          {/* Authorization / Sandbox Mode Banner */}
          {currentProject.creatorId === currentUser.id || currentTeam.some(m => m.id === currentUser.id) ? (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>👑 Official Team Lead Mode:</strong> You are actively managing this project's real roster. Changes update official slot assignments.</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full shrink-0">Official Roster</span>
            </div>
          ) : (
            <div className="p-3.5 bg-indigo-50/90 rounded-2xl border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-950">
              <div className="flex items-start sm:items-center space-x-2.5">
                <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <span className="font-extrabold block">🧪 AI Sandbox & Squad Simulator Mode</span>
                  <span className="text-indigo-800 text-[11px]">
                    You are exploring "what-if" roster combinations for <strong>{currentProject.title}</strong>. Test synergy calculations and skill balance before applying to officially join!
                  </span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('jointeam')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shrink-0 shadow-2xs transition-colors"
              >
                Apply to Join Officially
              </button>
            </div>
          )}

          {/* Simulator Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Overall Score Ring & Verdict */}
            <div className="md:col-span-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Overall Synergy Index
              </span>
              
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-slate-800" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * simulatedScoreData.score) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    className={
                      simulatedScoreData.score >= 85
                        ? 'text-emerald-500'
                        : simulatedScoreData.score >= 70
                          ? 'text-indigo-400'
                          : 'text-amber-500'
                    }
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-extrabold font-mono text-white leading-none">{simulatedScoreData.score}</span>
                  <span className="text-[10px] text-slate-400 mt-1">out of 100</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Verdict:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                  simulatedScoreData.verdict === 'Excellent'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : simulatedScoreData.verdict === 'Strong'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {simulatedScoreData.verdict}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full pt-2 text-[11px] text-slate-300 border-t border-slate-800 text-left">
                <div>Role Coverage: <strong className="text-white font-mono">{simulatedScoreData.roleCoverageScore}/30</strong></div>
                <div>Skill Breadth: <strong className="text-white font-mono">{simulatedScoreData.skillBreadthScore}/25</strong></div>
                <div>Cohesion: <strong className="text-white font-mono">{simulatedScoreData.cohesionScore}/15</strong></div>
                <div>Rule Check: <strong className="text-white font-mono">{simulatedScoreData.ruleScore}/30</strong></div>
              </div>
            </div>

            {/* Team Constraints Live Rule Checklist */}
            <div className="md:col-span-4 bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Team Diversity & Rule Checklist</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  simulatedScoreData.compliance.isFullyCompliant
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {simulatedScoreData.compliance.isFullyCompliant ? 'Fully Compliant' : 'Attention Needed'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* 1. Gender Diversity */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700">Gender Diversity (≥1 woman member)</span>
                  {simulatedScoreData.compliance.femaleMemberSatisfied ? (
                    <span className="text-emerald-700 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Met ({simulatedScoreData.compliance.femaleCount} ♀)</span>
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold flex items-center space-x-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      <span>Missing ♀ Member</span>
                    </span>
                  )}
                </div>

                {/* 2. Branch Diversity */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700">Branch Mix (≥2 distinct departments)</span>
                  {simulatedScoreData.compliance.branchDiversitySatisfied ? (
                    <span className="text-emerald-700 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Met ({simulatedScoreData.compliance.uniqueBranchesCount} Branches)</span>
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Needs Branch Mix</span>
                    </span>
                  )}
                </div>

                {/* 3. Role Coverage */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700">Role Coverage (Required Roles)</span>
                  {simulatedScoreData.compliance.roleCoverageSatisfied ? (
                    <span className="text-emerald-700 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>100% Filled</span>
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{simulatedScoreData.missingRoles.length} Vacant</span>
                    </span>
                  )}
                </div>

                {/* 4. Bandwidth Quorum */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700">Availability (≥60 hrs/week total)</span>
                  <span className="text-emerald-700 font-bold font-mono">
                    {simulatedScoreData.compliance.totalWeeklyHours} hrs / wk
                  </span>
                </div>
              </div>
            </div>

            {/* Active Roster & Skill Coverage Bars */}
            <div className="md:col-span-4 bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                Required Role & Skill Coverage Bars
              </span>

              <div className="space-y-2.5">
                {currentProject.requiredRoles.map((roleObj, idx) => {
                  const isCovered = currentTeam.some(m => m.primaryRole.toLowerCase().includes(roleObj.role.toLowerCase()));
                  const member = currentTeam.find(m => m.primaryRole.toLowerCase().includes(roleObj.role.toLowerCase()));

                  return (
                    <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{roleObj.role}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isCovered ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isCovered ? `Filled by ${member?.name}` : 'Unfilled'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${isCovered ? 'bg-emerald-500' : 'bg-rose-400'}`}
                          style={{ width: isCovered ? '100%' : '15%' }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {roleObj.idealSkills.map((sk, sidx) => (
                          <span key={sidx} className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Gap Detection Banner & Recommendation */}
          {simulatedScoreData.missingRoles.length > 0 && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold text-amber-900 block">Critical Role Gap Detected:</span>
                  <span className="text-amber-800">
                    Your team is missing {simulatedScoreData.missingRoles.join(' and ')}. Recruit from the Member Pool below to boost your team score by up to +22 points.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveSection('talent-pool')}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors shrink-0 shadow-2xs"
              >
                Search Missing Roles
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. FEATURE 1A: JOIN A TEAM (DUAL INTAKE - SOLO BUILDER → EXISTING TEAM) */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'browse-projects') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                  Feature 1A Dual Intake
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Join an Existing Team
                </h2>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Every project card features live fit score computation, per-skill evidence matching, and instant lead contact reveal.
              </p>
            </div>

            <button
              onClick={() => onNavigate('jointeam')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <span>Explore All Open Squads</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj) => {
              // Calculate live fit score for signed-in user against this project's primary open role
              const targetRole = proj.requiredRoles[0] || { role: 'Full-Stack Engineer', idealSkills: ['TypeScript'] };
              const fit = computeFitScoreForRole(currentUser, targetRole);
              const isUserOnTeam = currentTeam.some(m => m.id === currentUser.id && currentProject.id === proj.id);
              const isApplicationPending = applications.some(a => a.teamId === proj.id && a.status === 'pending');
              const isInvited = invites.some(inv => inv.projectId === proj.id && inv.status === 'pending');
              const aiExplanation = aiExplanations[proj.id];

              return (
                <div
                  key={proj.id}
                  className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
                    isUserOnTeam 
                      ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="p-5 space-y-3.5">
                    
                    {/* Top Header: Track & Posted Timestamp */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-full truncate max-w-[180px]">
                        {proj.track}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {proj.postedTime || '35m ago'}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                        {proj.tagline || proj.description}
                      </p>
                    </div>

                    {/* Live Fit Score Meter for Signed-In User */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-semibold flex items-center space-x-1">
                          <span>Fit for {targetRole.role}:</span>
                        </span>
                        <span className={`font-mono font-extrabold px-2 py-0.5 rounded-md ${
                          fit.score >= 70
                            ? 'bg-emerald-100 text-emerald-800'
                            : fit.score >= 50
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                        }`}>
                          {fit.score}/100 Match
                        </span>
                      </div>

                      {/* Color Coded Meter Bar */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            fit.score >= 70
                              ? 'bg-emerald-500'
                              : fit.score >= 50
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                          }`}
                          style={{ width: `${fit.score}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Skills ({fit.matchedSkillsCount}/{fit.totalSkills} brought)</span>
                        <span>{currentUser.weeklyAvailabilityHours}h/wk committed</span>
                      </div>
                    </div>

                    {/* AI Skill-Gap Suggestion Pill */}
                    <div className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100/80 text-[11px] text-slate-700 leading-relaxed">
                      <div className="flex items-center justify-between font-bold text-indigo-900 mb-1">
                        <span className="flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          <span>AI Skill-Gap Analysis:</span>
                        </span>
                        <button
                          onClick={() => handleAIExplain(proj)}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 underline font-bold"
                        >
                          {isLoadingAIExplain === proj.id ? 'Analyzing...' : 'AI Explain'}
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-600">
                        {aiExplanation || `You bring ${currentUser.primaryRole} capabilities; this project needs ${proj.requiredRoles.map(r => r.role).slice(0, 2).join(' & ')}.`}
                      </p>
                    </div>
                  </div>

                  {/* Lived-In Status Footer & Join Action */}
                  <div className="p-4 pt-3 bg-slate-50/80 rounded-b-3xl border-t border-slate-100 flex items-center justify-between gap-2">
                    {isUserOnTeam ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>You're on the team · Lead</span>
                        </span>
                        <button
                          onClick={() => {
                            onSelectProject(proj);
                            setActiveSection('live-simulator');
                          }}
                          className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
                        >
                          Open Team
                        </button>
                      </div>
                    ) : isApplicationPending ? (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center space-x-1 w-full justify-center">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Application Pending Review</span>
                      </span>
                    ) : isInvited ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-purple-700">Invited to join!</span>
                        <button
                          onClick={() => {
                            const inv = invites.find(i => i.projectId === proj.id);
                            if (inv) onAcceptInvite(inv.id);
                            showToast(`Accepted invite for ${proj.title}!`);
                          }}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl"
                        >
                          Accept Invite
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`btn-join-team-${proj.id}`}
                        onClick={() => handleOpenJoinModal(proj)}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Join this Team</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. FEATURE 2: MEMBER POOL & E-COMMERCE-STYLE FILTERS */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'talent-pool') && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Feature 2 Marketplace
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Member Pool & E-Commerce Filter Bar
                </h2>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Filter builders by skill, diversity criteria, branch mix, track record, and native language with real-time result counts.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
                Showing {filteredMembers.length} of {allCandidates.length} Builders
              </span>
              <button
                onClick={resetAllFilters}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1"
                title="Clear all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search member pool by name, college, skill (e.g. LeetCode, PyTorch, Go), or headline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          {/* E-Commerce Filter Bar Rows */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
            
            {/* 1. Skill Dropdown */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Skill</label>
              <select
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                {allDistinctSkills.map((sk, i) => (
                  <option key={i} value={sk}>{sk}</option>
                ))}
              </select>
            </div>

            {/* 2. Branch / Discipline */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Branch / Discipline</label>
              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Disciplines</option>
                <option value="CSE">CSE (Comp Science)</option>
                <option value="ECE">ECE (Electronics)</option>
                <option value="AI">AI & Data Science</option>
                <option value="IT">IT (Information Tech)</option>
                <option value="EEE">EEE (Electrical)</option>
                <option value="Design">Design / HCI</option>
              </select>
            </div>

            {/* 3. Gender */}
            <div>
              <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">Gender</label>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Genders</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-Binary">Non-Binary</option>
              </select>
            </div>

            {/* 4. Track Record (Hackathon Wins) */}
            <div>
              <label className="text-[10px] font-bold text-amber-700 uppercase block mb-1">Track Record</label>
              <select
                value={filterTrackRecord}
                onChange={(e) => setFilterTrackRecord(e.target.value)}
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-amber-900 focus:outline-none focus:border-amber-500"
              >
                <option value="All">All Track Records</option>
                <option value="first_timer">First-Time Hacker (0 Wins / Exploring)</option>
                <option value="won_1">Hackathon Winner (1+ Wins)</option>
                <option value="won_3">Multi-Win Veteran (3+ Wins)</option>
              </select>
            </div>

            {/* 5. Year of Study */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Year of Study</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="1st Year Masters">Masters</option>
              </select>
            </div>

            {/* 6. Domain */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Domain Focus</label>
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Domains</option>
                <option value="Web">Web / App</option>
                <option value="AI">AI / ML</option>
                <option value="Hardware">Hardware / IoT</option>
                <option value="Design">Design / Creative</option>
                <option value="Pitch">Pitch / Biz</option>
                <option value="Cloud">Systems / Cloud</option>
              </select>
            </div>

            {/* 7. Native Language */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Native Language</label>
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Languages</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Bengali">Bengali</option>
                <option value="Marathi">Marathi</option>
              </select>
            </div>
          </div>

          {/* Member Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {filteredMembers.map((candidate) => {
              const isInTeam = currentTeam.some(m => m.id === candidate.id);
              const deltaSim = simulateCandidateDelta(candidate, currentTeam, currentProject);

              return (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  isInTeam={isInTeam}
                  onAddToTeam={onAddToTeam}
                  onRemoveFromTeam={onRemoveFromTeam}
                  deltaSimulation={deltaSim}
                  onOpenRadarModal={onOpenRadarModal}
                  onOpenContactModal={onOpenContactModal}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. FEATURE 1B: CREATE / POST A PROJECT (LEADER → NEW TEAM) */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'create-project') && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Feature 1B Dual Intake
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Create / Post a Hackathon Project
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Define required roles, tech stacks, weekly hours, and team composition constraints.
            </p>
          </div>

          <form onSubmit={handleSaveProjectForm} className="space-y-4 text-xs">
            
            {/* Title & Track */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Project Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. AeroLink: Autonomous Disaster Relief Drone Mesh"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
                {formErrors.title && <p className="text-rose-600 text-[10px] font-bold">{formErrors.title}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Hackathon / Track
                </label>
                <input
                  type="text"
                  placeholder="e.g. Global Tech Challenge 2026 (Robotics Track)"
                  value={newTrack}
                  onChange={(e) => setNewTrack(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Project Description & Pitch Brief *
              </label>
              <textarea
                rows={3}
                placeholder="Explain the problem statement, hardware/software stack, and what you aim to ship during the 36-hour sprint..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
              {formErrors.description && <p className="text-rose-600 text-[10px] font-bold">{formErrors.description}</p>}
            </div>

            {/* Team Size & Hours */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Team Size</label>
                <select
                  value={newTeamSize}
                  onChange={(e) => setNewTeamSize(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value={3}>3 Members</option>
                  <option value={4}>4 Members</option>
                  <option value={5}>5 Members</option>
                  <option value={6}>6 Members (Max Capacity)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Weekly Commitment</label>
                <select
                  value={newWeeklyHours}
                  onChange={(e) => setNewWeeklyHours(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value={20}>20 hrs/week</option>
                  <option value={30}>30 hrs/week</option>
                  <option value={40}>40 hrs/week (Crunch)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Timeline</label>
                <input
                  type="text"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>
            </div>

            {/* Role Builder Section */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Role Builder ({newRoles.length} Required Roles)</span>
                </span>
                <button
                  type="button"
                  onClick={handleAddRoleRow}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {newRoles.map((roleItem, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder="Role Title"
                        value={roleItem.role}
                        onChange={(e) => {
                          const updated = [...newRoles];
                          updated[i].role = e.target.value;
                          setNewRoles(updated);
                        }}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-xs"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <select
                        value={roleItem.priority}
                        onChange={(e) => {
                          const updated = [...newRoles];
                          updated[i].priority = e.target.value as any;
                          setNewRoles(updated);
                        }}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-xs"
                      >
                        <option value="Critical">Critical Priority</option>
                        <option value="Recommended">Recommended</option>
                        <option value="Bonus">Nice-to-Have</option>
                      </select>
                    </div>

                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder="Skills (e.g. React, Go, PyTorch)"
                        value={roleItem.idealSkills.join(', ')}
                        onChange={(e) => {
                          const updated = [...newRoles];
                          updated[i].idealSkills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setNewRoles(updated);
                        }}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveRoleRow(i)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Remove role"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SIH / Hackathon Rule Constraints Checkboxes */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                Rule & Institutional Constraints Engine Checks:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center space-x-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ruleMixedGender}
                    onChange={(e) => setRuleMixedGender(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4 rounded"
                  />
                  <span className="font-semibold text-slate-800">Enforce Mixed-Gender Team (Diversity Rule)</span>
                </label>

                <label className="flex items-center space-x-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ruleBranchDiversity}
                    onChange={(e) => setRuleBranchDiversity(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4 rounded"
                  />
                  <span className="font-semibold text-slate-800">Require ≥3 Distinct Branch Mix</span>
                </label>

                <label className="flex items-center space-x-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ruleYearMix}
                    onChange={(e) => setRuleYearMix(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4 rounded"
                  />
                  <span className="font-semibold text-slate-800">Disallow Monolithic Year (Year Mix)</span>
                </label>

                <label className="flex items-center space-x-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ruleWeekendAvail}
                    onChange={(e) => setRuleWeekendAvail(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4 rounded"
                  />
                  <span className="font-semibold text-slate-800">Require Weekend Crunch Availability</span>
                </label>
              </div>
            </div>

            {/* Form Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save & Open in Live Team Composer</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. FEATURE 1A: MODAL FOR "JOIN THIS TEAM" WITH LIVE FIT SCORE (0–100) */}
      {/* ========================================================================= */}
      {joiningProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Dual Intake 1A Flow
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Join {joiningProject.title}
                </h3>
              </div>
              <button
                onClick={() => setJoiningProject(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {joinSuccessData ? (
              /* Success State with Unlocked Contact Details */
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-emerald-900">
                    Request Sent & Accepted!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    You are now joined as <strong>{joinSuccessData.role}</strong>. Direct contact to the project lead is unlocked below:
                  </p>
                </div>

                {/* Direct Contact Links */}
                <div className="p-3 bg-white rounded-xl border border-emerald-200 grid grid-cols-2 gap-2 text-xs text-left">
                  <a
                    href={`https://wa.me/${joinSuccessData.contact.whatsapp?.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold rounded-lg flex items-center space-x-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Direct</span>
                  </a>

                  <a
                    href={`mailto:${joinSuccessData.contact.email}`}
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold rounded-lg flex items-center space-x-1.5 transition-colors truncate"
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="truncate">{joinSuccessData.contact.email}</span>
                  </a>
                </div>

                <button
                  onClick={() => {
                    setJoiningProject(null);
                    onSelectProject(joiningProject);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs"
                >
                  View in Team Workbench
                </button>
              </div>
            ) : (
              /* Role Dropdown & Live Fit Score Card */
              <div className="space-y-4 text-xs">
                
                {/* 1. Target Role Dropdown */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Select Desired Role / Vacancy in this Squad:
                  </label>
                  <select
                    value={selectedRoleIndex}
                    onChange={(e) => setSelectedRoleIndex(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                  >
                    {joiningProject.requiredRoles.map((r, i) => (
                      <option key={i} value={i}>
                        {r.role} ({r.priority} Priority) • Skills: {r.idealSkills.join(', ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Live Fit Score Meter Card (0–100) */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-xs flex items-center space-x-1">
                      <Zap className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Live Fit Score for {selectedRoleObj?.role}:</span>
                    </span>
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full font-mono ${
                      fitMetrics.score >= 70
                        ? 'bg-emerald-100 text-emerald-800'
                        : fitMetrics.score >= 50
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                    }`}>
                      {fitMetrics.score}/100 Fit
                    </span>
                  </div>

                  {/* Meter Bar */}
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        fitMetrics.score >= 70
                          ? 'bg-emerald-500'
                          : fitMetrics.score >= 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                      }`}
                      style={{ width: `${fitMetrics.score}%` }}
                    />
                  </div>

                  {/* "Why you fit" explainer breakdown */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-[11px] space-y-1.5 leading-relaxed text-slate-700">
                    <span className="font-bold text-slate-900 block">Why You Fit:</span>
                    <p>
                      • <strong>Skill match ({fitMetrics.skillScore}/40 pts):</strong> You bring {fitMetrics.matchedSkillsCount} of {fitMetrics.totalSkills} ideal skills for this role.
                    </p>
                    <p>
                      • <strong>Availability ({fitMetrics.availScore}/20 pts):</strong> You have committed {currentUser.weeklyAvailabilityHours} hrs/week.
                    </p>
                    <p>
                      • <strong>Experience ({fitMetrics.expScore}/16 pts):</strong> {currentUser.completedProjectsCount || 2} landmark projects shipped.
                    </p>
                    <p>
                      • <strong>Verified Proof ({fitMetrics.verifiedScore}/8 pts):</strong> {fitMetrics.hasVerifiedSkill ? 'Verified badge on profile.' : 'Self-declared.'}
                    </p>
                  </div>

                  {/* Per-Skill Chips */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Required Skill Breakdown:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRoleObj?.idealSkills.map((sk, idx) => {
                        const hasSkill = currentUser.topSkills.some(s => s.toLowerCase().includes(sk.toLowerCase()));
                        return (
                          <span
                            key={idx}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center space-x-1 ${
                              hasSkill 
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' 
                                : 'bg-slate-200/60 text-slate-600 border border-slate-300'
                            }`}
                          >
                            <span>{hasSkill ? '✓ on profile' : '✗ not on profile'}: {sk}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Warning Flag if fit is below 70 */}
                  {fitMetrics.score < 70 && (
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Consider another role or strengthen this skill first for higher acceptance probability.
                      </span>
                    </div>
                  )}
                </div>

                {/* Pitch Message */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Pitch Message to Team Lead:
                  </label>
                  <textarea
                    rows={3}
                    value={joinPitchMessage}
                    onChange={(e) => setJoinPitchMessage(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setJoiningProject(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    id="btn-confirm-join-team"
                    onClick={handleConfirmJoin}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-xs flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Request to Join</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

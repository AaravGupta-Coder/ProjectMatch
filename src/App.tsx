import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, NavTabType } from './components/Navbar';
import { LandingPage, UserIntent } from './components/LandingPage';
import { JoinProjectsDashboard } from './components/JoinProjectsDashboard';
import { CreateTeamDashboard } from './components/CreateTeamDashboard';
import { HomePage } from './components/HomePage';
import { AppOverviewHub } from './components/AppOverviewHub';
import { TeamWorkbench } from './components/TeamWorkbench';
import { TalentDiscovery } from './components/TalentDiscovery';
import { JoinTeamBoard } from './components/JoinTeamBoard';
import { SoloProjectBoard } from './components/SoloProjectBoard';
import { ProjectDeconstructor } from './components/ProjectDeconstructor';
import { SprintCharterView } from './components/SprintCharterView';
import { ProfileBuilderModal } from './components/ProfileBuilderModal';
import { ProofSkillParserModal } from './components/ProofSkillParserModal';
import { SkillRadarModal } from './components/SkillRadarModal';
import { ContactUnlockModal } from './components/ContactUnlockModal';
import { 
  UserCandidate, 
  ProjectRequirement, 
  TeamSynergyAnalysis, 
  SprintCharter, 
  SmartMatchResult,
  TeamInvite,
  OpenTeam,
  TeamJoinApplication
} from './types';
import { INITIAL_CANDIDATES, PRESET_PROJECTS, OPEN_TEAMS_DATA, INITIAL_APPLICATIONS } from './data/seedData';
import { 
  computeLocalTeamScore, 
  calculateComprehensiveSynergy, 
  calculateLocalSprintCharter, 
  simulateCandidateDelta 
} from './utils/synergyEngine';
import { 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Zap, 
  ArrowRight,
  HelpCircle,
  Award,
  ChevronRight,
  Home,
  Layers,
  Search,
  UserPlus,
  Compass,
  FileText,
  LayoutGrid
} from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userIntent, setUserIntent] = useState<UserIntent>('join');
  const [activeTab, setActiveTab] = useState<NavTabType>('join-dashboard');
  const [candidates, setCandidates] = useState<UserCandidate[]>(INITIAL_CANDIDATES);
  const [currentUser, setCurrentUser] = useState<UserCandidate>(INITIAL_CANDIDATES[1]); // Diya Sen (UX Crafter)
  const [projects, setProjects] = useState<ProjectRequirement[]>(PRESET_PROJECTS);
  const [project, setProject] = useState<ProjectRequirement>(PRESET_PROJECTS[0]);
  const [openTeams, setOpenTeams] = useState<OpenTeam[]>(OPEN_TEAMS_DATA);
  const [applications, setApplications] = useState<TeamJoinApplication[]>(INITIAL_APPLICATIONS);
  
  // Initial team starts with 2 complementary members to showcase instant synergy calculations
  const [currentTeam, setCurrentTeam] = useState<UserCandidate[]>([
    INITIAL_CANDIDATES[0], // Aarav (Full-Stack / System Architect)
    INITIAL_CANDIDATES[2], // Kabir (AI / ML Specialist)
  ]);

  // Invites & Unlocked Contacts state (Matrimony-Style Flow)
  const [invites, setInvites] = useState<TeamInvite[]>([
    {
      id: 'inv-1',
      candidateId: INITIAL_CANDIDATES[1].id, // Priya (UX Crafter)
      candidateName: INITIAL_CANDIDATES[1].name,
      candidateAvatar: INITIAL_CANDIDATES[1].avatar,
      candidateRole: INITIAL_CANDIDATES[1].primaryRole,
      senderId: 'user-lead',
      senderName: 'Aarav Sharma',
      projectId: PRESET_PROJECTS[0].id,
      projectTitle: PRESET_PROJECTS[0].title,
      pitchMessage: 'Hi Priya! We saw your design systems work and hackathon wins. We need a visionary UX Crafter for MedEcho.',
      status: 'accepted',
      timestamp: '2 hours ago',
      unlockedContact: INITIAL_CANDIDATES[1].contactInfo
    },
    {
      id: 'inv-2',
      candidateId: INITIAL_CANDIDATES[4].id, // Vikram (Speed Builder)
      candidateName: INITIAL_CANDIDATES[4].name,
      candidateAvatar: INITIAL_CANDIDATES[4].avatar,
      candidateRole: INITIAL_CANDIDATES[4].primaryRole,
      senderId: 'user-lead',
      senderName: 'Aarav Sharma',
      projectId: PRESET_PROJECTS[0].id,
      projectTitle: PRESET_PROJECTS[0].title,
      pitchMessage: 'Hey Vikram, your 450+ LeetCode rating and fast React 19 sprint pace is exactly what we need for our core engine.',
      status: 'pending',
      timestamp: '30 mins ago'
    }
  ]);

  // Modals state
  const [radarCandidate, setRadarCandidate] = useState<UserCandidate | null>(null);
  const [contactModalCandidate, setContactModalCandidate] = useState<UserCandidate | null>(null);
  const [discoveryQuery, setDiscoveryQuery] = useState<string>('');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [synergyAnalysis, setSynergyAnalysis] = useState<TeamSynergyAnalysis>({
    overallSynergyScore: 78,
    sprintSuccessProbability: 76,
    radarScores: {
      technicalCoverage: 82,
      archetypeBalance: 72,
      communicationPace: 85,
      bandwidthReliability: 88,
      innovationIndex: 86,
    },
    strengths: [
      "Strong dual-core engineering stack: backend distributed systems combined with GenAI inference.",
      "High aggregate availability totaling 75 hours/week for crunch milestones."
    ],
    criticalGaps: [
      "Missing dedicated UI/UX Product Designer for high-fidelity front-end execution."
    ],
    frictionRisks: [
      {
        title: "Interface Bottleneck Risk",
        severity: "high",
        description: "Without a dedicated designer, developers may default to bare components, risking visual impact during final judge reviews.",
        mitigation: "Adopt pre-built design systems or recruit a UX Crafter immediately."
      }
    ],
    recommendedNextAddition: "UI/UX Product Designer (Archetype: UX Crafter)",
    chemistrySummary: "This initial 2-person core has high technical depth. Adding a UX Crafter will balance the team and satisfy SIH gender balance."
  });

  const [sprintCharter, setSprintCharter] = useState<SprintCharter | null>({
    teamMotto: "Precision Execution, Relentless Velocity, Zero Redundancy",
    phases: [
      {
        timeframe: "Hours 00 - 08: Architecture & UI Contracts",
        milestone: "Component tree frozen, TypeScript interfaces locked, backend skeleton live.",
        tasks: [
          { assigneeName: "Aarav Sharma", task: "Scaffold API contracts and data state pipeline", deliverable: "API contract & state machine" },
          { assigneeName: "Kabir Mehta", task: "Design intelligence inference loop and prompt schemas", deliverable: "Gemini pipeline setup" }
        ]
      },
      {
        timeframe: "Hours 08 - 24: Core Engine & AI Pipeline",
        milestone: "Full workflow connected end-to-end with live data and inference.",
        tasks: [
          { assigneeName: "Aarav Sharma", task: "Build distributed backend and state caching layer", deliverable: "Core business logic" },
          { assigneeName: "Kabir Mehta", task: "Connect vector retrieval and real-time reasoning", deliverable: "Inference endpoint live" }
        ]
      },
      {
        timeframe: "Hours 24 - 38: Polish, Micro-Interactions & Friction Checks",
        milestone: "Zero dead buttons, responsive at all screen widths, crisp light-mode visuals.",
        tasks: [
          { assigneeName: "Aarav Sharma", task: "Audit UX feedback states, error fallbacks, and animation easing", deliverable: "Refined interaction state" },
          { assigneeName: "Kabir Mehta", task: "Benchmark inference latency and edge failure responses", deliverable: "Stress test report" }
        ]
      },
      {
        timeframe: "Hours 38 - 48: 3-Minute Demo Choreography",
        milestone: "Flawless rehearsal with live wow moments under 60 seconds.",
        tasks: [
          { assigneeName: "Aarav Sharma", task: "Run timed rehearsal on critical demo path", deliverable: "Validated demo flow" },
          { assigneeName: "Kabir Mehta", task: "Prepare architecture slides & metrics highlights", deliverable: "Judge presentation deck" }
        ]
      }
    ],
    collaborationPact: [
      "15-Minute Block Rule: If stuck for more than 15 minutes, pair up immediately.",
      "Ship Working Slices: Never leave unintegrated branches overnight.",
      "Aesthetic Standard: Every interactive control must have hover, active, and empty states."
    ],
    decisionProtocol: "Technical disputes are resolved by a 5-minute timed spike. The cleaner, working solution wins."
  });

  const [smartMatchResults, setSmartMatchResults] = useState<SmartMatchResult[] | null>(null);
  const [isLoadingSynergy, setIsLoadingSynergy] = useState(false);
  const [isLoadingMatch, setIsLoadingMatch] = useState(false);
  const [isDeconstructing, setIsDeconstructing] = useState(false);
  const [isGeneratingCharter, setIsGeneratingCharter] = useState(false);

  // Recalculate synergy whenever team or project changes
  const evaluateSynergy = useCallback(async (team: UserCandidate[], proj: ProjectRequirement) => {
    if (team.length === 0) {
      setSynergyAnalysis({
        overallSynergyScore: 0,
        sprintSuccessProbability: 0,
        radarScores: { technicalCoverage: 0, archetypeBalance: 0, communicationPace: 0, bandwidthReliability: 0, innovationIndex: 0 },
        strengths: [],
        criticalGaps: ["Add team members to evaluate synergy"],
        frictionRisks: [],
        recommendedNextAddition: "Add Core Engineer",
        chemistrySummary: "Team is currently empty. Add talent to begin live chemistry evaluation."
      });
      return;
    }

    setIsLoadingSynergy(true);
    try {
      const res = await fetch('/api/ai/analyze-synergy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: proj, members: team })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setSynergyAnalysis(data.data);
          return;
        }
      }
      // Graceful fallback to rich deterministic synergy calculation
      const localAnalysis = calculateComprehensiveSynergy(team, proj);
      setSynergyAnalysis(localAnalysis);
    } catch (_err) {
      // Safe fallback on network transition or local testing
      const localAnalysis = calculateComprehensiveSynergy(team, proj);
      setSynergyAnalysis(localAnalysis);
    } finally {
      setIsLoadingSynergy(false);
    }
  }, []);

  // Recalculate sprint charter
  const generateCharter = useCallback(async (team: UserCandidate[], proj: ProjectRequirement) => {
    if (team.length === 0) return;
    setIsGeneratingCharter(true);
    try {
      const res = await fetch('/api/ai/generate-sprint-charter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: proj, members: team })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setSprintCharter(data.data);
          return;
        }
      }
      // Local fallback charter
      setSprintCharter(calculateLocalSprintCharter(team, proj));
    } catch (_err) {
      setSprintCharter(calculateLocalSprintCharter(team, proj));
    } finally {
      setIsGeneratingCharter(false);
    }
  }, []);

  // Track initial mount to avoid firing redundant requests on load
  const isInitialMount = React.useRef(true);

  // Update synergy and charter smoothly when team or project changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      evaluateSynergy(currentTeam, project);
      generateCharter(currentTeam, project);
    }, 250);
    return () => clearTimeout(timeout);
  }, [currentTeam, project, evaluateSynergy, generateCharter]);

  // Synchronize activeTab with URL Hash for real multi-page behavior
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as NavTabType;
      const validTabs: NavTabType[] = ['join-dashboard', 'create-dashboard', 'overview', 'workbench', 'discovery', 'jointeam', 'soloboard', 'deconstruct', 'charter'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Initial check on load
    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: NavTabType) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  // Login & Intent Handling
  const handleLoginAndProceed = (user: UserCandidate, intent: UserIntent) => {
    setCurrentUser(user);
    setUserIntent(intent);
    setCandidates(prev => {
      const exists = prev.some(c => c.id === user.id);
      if (exists) {
        return prev.map(c => c.id === user.id ? user : c);
      }
      return [user, ...prev];
    });

    setIsAuthenticated(true);
    if (intent === 'join') {
      handleTabChange('join-dashboard');
    } else {
      // Create mode: if user is not in currentTeam, make them the team lead
      if (!currentTeam.some(m => m.id === user.id)) {
        setCurrentTeam([user]);
      }
      handleTabChange('create-dashboard');
    }
  };

  const handleSwitchIntent = () => {
    if (userIntent === 'join') {
      setUserIntent('create');
      if (!currentTeam.some(m => m.id === currentUser.id)) {
        setCurrentTeam([currentUser]);
      }
      handleTabChange('create-dashboard');
    } else {
      setUserIntent('join');
      handleTabChange('join-dashboard');
    }
  };

  // Team Slot operations
  const handleAddToTeam = (candidate: UserCandidate) => {
    if (currentTeam.some(m => m.id === candidate.id)) return;
    if (currentTeam.length >= (project.targetTeamSize || 4)) {
      alert(`Team roster is at capacity (${project.targetTeamSize} members). Remove a member first or adjust target team size in the Deconstructor.`);
      return;
    }
    const updated = [...currentTeam, candidate];
    setCurrentTeam(updated);
  };

  const handleRemoveFromTeam = (candidateId: string) => {
    const updated = currentTeam.filter(m => m.id !== candidateId);
    setCurrentTeam(updated);
  };

  const handleQuickLoadPreset = (presetId: string) => {
    const found = projects.find(p => p.id === presetId);
    if (found) {
      setProject(found);
    }
  };

  const handleDeconstructWithAI = async (input: { title: string; description: string; track: string; teamSize: number }) => {
    setIsDeconstructing(true);
    try {
      const res = await fetch('/api/ai/deconstruct-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          const customProj: ProjectRequirement = {
            id: `custom-${Date.now()}`,
            title: input.title,
            tagline: data.data.summary,
            track: input.track,
            competitionContext: 'Custom Deconstructed Challenge',
            description: input.description,
            targetTeamSize: input.teamSize,
            requiredRoles: data.data.recommendedRoles,
            criticalTechStack: data.data.criticalTechStack,
            radarTarget: data.data.radarTarget,
            keyMilestones: data.data.keyMilestones,
            sihConstraints: {
              requireFemaleMember: true,
              minDepartments: 2,
              maxTeamSize: input.teamSize,
              allowedYears: ['2nd Year', '3rd Year', '4th Year'],
              targetTrack: input.track
            }
          };
          setProject(customProj);
          setProjects(prev => [customProj, ...prev]);
          return customProj;
        }
      }
      // Local fallback deconstruction
      const fallbackProj: ProjectRequirement = {
        id: `custom-${Date.now()}`,
        title: input.title,
        tagline: `Architectural blueprint for ${input.title} targeting ${input.track}`,
        track: input.track,
        competitionContext: 'Custom Deconstructed Challenge',
        description: input.description,
        targetTeamSize: input.teamSize,
        requiredRoles: [
          { role: 'Lead Full-Stack / Core Systems', priority: 'Critical', archetype: 'System Architect', idealSkills: ['TypeScript', 'React 19', 'Express', 'PostgreSQL'], responsibility: 'Scaffold core pipeline, API routing, and state machine' },
          { role: 'AI / ML & Intelligence Specialist', priority: 'Critical', archetype: 'Quantitative Mind', idealSkills: ['Gemini 3.7', 'Python', 'Vector Search', 'Prompt Engineering'], responsibility: 'Integrate inference layer and semantic intelligence' },
          { role: 'UI / UX Product Designer', priority: 'Recommended', archetype: 'UX Crafter', idealSkills: ['Tailwind CSS', 'Motion UI', 'Figma', 'Responsive Design'], responsibility: 'Craft high-contrast UI and demo presentations' },
          { role: 'Domain Lead & Prototyper', priority: 'Recommended', archetype: 'Visionary & Domain Lead', idealSkills: ['Strategy', 'Rapid Prototyping', 'Judging Pitch'], responsibility: 'Lead sprint roadmap and live dry-run presentations' }
        ],
        criticalTechStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Gemini API', 'Express', 'Vite'],
        radarTarget: { technicalCoverage: 90, archetypeBalance: 88, communicationPace: 85, bandwidthReliability: 90, innovationIndex: 92 },
        keyMilestones: [
          { phase: 'Hours 00-08: Architecture Freeze', deliverable: 'API contracts & component structure', leadRole: 'System Architect' },
          { phase: 'Hours 08-20: Core Pipeline Live', deliverable: 'End-to-end inference and business logic', leadRole: 'Quantitative Mind' },
          { phase: 'Hours 20-30: Polish & Testing', deliverable: 'Interactive states and responsiveness', leadRole: 'UX Crafter' },
          { phase: 'Hours 30-36: Demo Dry Run', deliverable: 'Final presentation and pitch rehearsal', leadRole: 'Visionary & Domain Lead' }
        ],
        sihConstraints: {
          requireFemaleMember: true,
          minDepartments: 2,
          maxTeamSize: input.teamSize,
          allowedYears: ['2nd Year', '3rd Year', '4th Year'],
          targetTrack: input.track
        }
      };
      setProject(fallbackProj);
      setProjects(prev => [fallbackProj, ...prev]);
      return fallbackProj;
    } catch (_err) {
      const fallbackProj: ProjectRequirement = {
        id: `custom-${Date.now()}`,
        title: input.title,
        tagline: `Architectural blueprint for ${input.title} targeting ${input.track}`,
        track: input.track,
        competitionContext: 'Custom Deconstructed Challenge',
        description: input.description,
        targetTeamSize: input.teamSize,
        requiredRoles: [
          { role: 'Lead Full-Stack / Core Systems', priority: 'Critical', archetype: 'System Architect', idealSkills: ['TypeScript', 'React 19', 'Express', 'PostgreSQL'], responsibility: 'Scaffold core pipeline, API routing, and state machine' },
          { role: 'AI / ML & Intelligence Specialist', priority: 'Critical', archetype: 'Quantitative Mind', idealSkills: ['Gemini 3.7', 'Python', 'Vector Search', 'Prompt Engineering'], responsibility: 'Integrate inference layer and semantic intelligence' },
          { role: 'UI / UX Product Designer', priority: 'Recommended', archetype: 'UX Crafter', idealSkills: ['Tailwind CSS', 'Motion UI', 'Figma', 'Responsive Design'], responsibility: 'Craft high-contrast UI and demo presentations' },
          { role: 'Domain Lead & Prototyper', priority: 'Recommended', archetype: 'Visionary & Domain Lead', idealSkills: ['Strategy', 'Rapid Prototyping', 'Judging Pitch'], responsibility: 'Lead sprint roadmap and live dry-run presentations' }
        ],
        criticalTechStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Gemini API', 'Express', 'Vite'],
        radarTarget: { technicalCoverage: 90, archetypeBalance: 88, communicationPace: 85, bandwidthReliability: 90, innovationIndex: 92 },
        keyMilestones: [
          { phase: 'Hours 00-08: Architecture Freeze', deliverable: 'API contracts & component structure', leadRole: 'System Architect' },
          { phase: 'Hours 08-20: Core Pipeline Live', deliverable: 'End-to-end inference and business logic', leadRole: 'Quantitative Mind' },
          { phase: 'Hours 20-30: Polish & Testing', deliverable: 'Interactive states and responsiveness', leadRole: 'UX Crafter' },
          { phase: 'Hours 30-36: Demo Dry Run', deliverable: 'Final presentation and pitch rehearsal', leadRole: 'Visionary & Domain Lead' }
        ],
        sihConstraints: {
          requireFemaleMember: true,
          minDepartments: 2,
          maxTeamSize: input.teamSize,
          allowedYears: ['2nd Year', '3rd Year', '4th Year'],
          targetTrack: input.track
        }
      };
      setProject(fallbackProj);
      setProjects(prev => [fallbackProj, ...prev]);
      return fallbackProj;
    } finally {
      setIsDeconstructing(false);
    }
  };

  const handleRunSmartMatch = async (query: string) => {
    setIsLoadingMatch(true);
    try {
      const res = await fetch('/api/ai/smart-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          currentTeam,
          candidatePool: candidates,
          projectContext: `${project.title}: ${project.tagline}`
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.matches) {
          setSmartMatchResults(data.data.matches);
          return;
        }
      }
      // Local ranking match
      const localMatches: SmartMatchResult[] = candidates
        .filter(c => !currentTeam.some(m => m.id === c.id))
        .map(c => {
          const delta = simulateCandidateDelta(c, currentTeam, project);
          return {
            candidate: c,
            matchScore: Math.min(99, Math.max(50, c.technicalScore + (delta.delta > 0 ? 10 : -5))),
            matchReason: delta.rationale,
            strengthsToAdd: c.topSkills.slice(0, 2),
            potentialRisks: delta.overlapWarning ? [delta.overlapWarning] : []
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 4);
      setSmartMatchResults(localMatches);
    } catch (_err) {
      const localMatches: SmartMatchResult[] = candidates
        .filter(c => !currentTeam.some(m => m.id === c.id))
        .map(c => {
          const delta = simulateCandidateDelta(c, currentTeam, project);
          return {
            candidate: c,
            matchScore: Math.min(99, Math.max(50, c.technicalScore + (delta.delta > 0 ? 10 : -5))),
            matchReason: delta.rationale,
            strengthsToAdd: c.topSkills.slice(0, 2),
            potentialRisks: delta.overlapWarning ? [delta.overlapWarning] : []
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 4);
      setSmartMatchResults(localMatches);
    } finally {
      setIsLoadingMatch(false);
    }
  };

  const handleSaveProfile = (savedProfile: UserCandidate) => {
    setCandidates(prev => {
      const exists = prev.some(c => c.id === savedProfile.id);
      if (exists) {
        return prev.map(c => c.id === savedProfile.id ? savedProfile : c);
      }
      return [savedProfile, ...prev];
    });

    if (currentUser.id === savedProfile.id || !candidates.some(c => c.id === savedProfile.id)) {
      setCurrentUser(savedProfile);
    }

    // Sync in currentTeam if member is currently in team
    setCurrentTeam(prev => prev.map(m => m.id === savedProfile.id ? savedProfile : m));
  };

  // Invite actions
  const handleSendInvite = (targetCandidate: UserCandidate, pitch: string) => {
    const newInvite: TeamInvite = {
      id: `inv-${Date.now()}`,
      candidateId: targetCandidate.id,
      candidateName: targetCandidate.name,
      candidateAvatar: targetCandidate.avatar,
      candidateRole: targetCandidate.primaryRole,
      senderId: 'user-lead',
      senderName: project.creatorName || 'Aarav Sharma',
      projectId: project.id,
      projectTitle: project.title,
      pitchMessage: pitch,
      status: 'pending',
      timestamp: 'Just now'
    };
    setInvites(prev => [newInvite, ...prev]);
  };

  const handleAcceptInvite = (inviteId: string) => {
    setInvites(prev => prev.map(inv => {
      if (inv.id === inviteId) {
        const found = candidates.find(c => c.id === inv.candidateId);
        return {
          ...inv,
          status: 'accepted',
          unlockedContact: found?.contactInfo
        };
      }
      return inv;
    }));
  };

  const handleApplyToProjectFromSolo = (projectId: string, projectTitle: string, pitch: string) => {
    const soloPerson = candidates[1]; // Priya Nair
    const newInvite: TeamInvite = {
      id: `inv-${Date.now()}`,
      candidateId: soloPerson.id,
      candidateName: soloPerson.name,
      candidateAvatar: soloPerson.avatar,
      candidateRole: soloPerson.primaryRole,
      senderId: soloPerson.id,
      senderName: soloPerson.name,
      projectId: projectId,
      projectTitle: projectTitle,
      pitchMessage: pitch,
      status: 'pending',
      timestamp: 'Just now'
    };
    setInvites(prev => [newInvite, ...prev]);
  };

  // Join Team Application Handlers
  const handleApplyToTeam = (appData: Omit<TeamJoinApplication, 'id' | 'timestamp'>) => {
    const newApp: TeamJoinApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      timestamp: 'Just now'
    };
    setApplications(prev => [newApp, ...prev]);
  };

  const handleAcceptIncomingApplication = (appId: string, candidate: UserCandidate) => {
    // Add applicant to current team if capacity allows
    if (!currentTeam.some(m => m.id === candidate.id)) {
      if (currentTeam.length < (project.targetTeamSize || 6)) {
        setCurrentTeam(prev => [...prev, candidate]);
      }
    }
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'accepted',
          feedbackNote: 'Application accepted! You are now added into our live Squad Workbench.',
          teamContact: {
            email: 'lead.aarav@projectmatch.dev',
            whatsapp: '+91 98201 54321',
            telegram: '@aarav_sharma_lead'
          }
        };
      }
      return app;
    }));
  };

  const handleDeclineIncomingApplication = (appId: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'declined',
          feedbackNote: 'Thank you for your interest! Our team roster for this specific role has been fulfilled.'
        };
      }
      return app;
    }));
  };

  if (!isAuthenticated) {
    return (
      <LandingPage
        onLoginAndProceed={handleLoginAndProceed}
        initialUser={currentUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Skip to main content link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-xl focus:text-sm focus:font-bold">
        Skip to main content
      </a>
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        teamSize={currentTeam.length}
        synergyScore={synergyAnalysis.overallSynergyScore}
        unlockedInvitesCount={invites.filter(i => i.status === 'accepted').length}
        openTeamsCount={openTeams.length}
        currentUser={currentUser}
        userIntent={userIntent}
        onSwitchIntent={handleSwitchIntent}
        onOpenLanding={() => setIsAuthenticated(false)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenProofModal={() => setIsProofModalOpen(true)}
        onOpenContactModal={() => {
          setContactModalCandidate(null);
          setIsContactModalOpen(true);
        }}
        onQuickLoadPreset={handleQuickLoadPreset}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6" role="main" aria-label="Main application content">
        
        {/* Dynamic Page Views */}
        {activeTab === 'join-dashboard' && (
          <JoinProjectsDashboard
            currentUser={currentUser}
            openTeams={openTeams}
            projects={projects}
            applications={applications}
            onSubmitApplication={handleApplyToTeam}
            onSwitchIntent={handleSwitchIntent}
            onEditProfile={() => setIsProfileModalOpen(true)}
            onInspectRadar={(cand) => setRadarCandidate(cand)}
          />
        )}

        {activeTab === 'create-dashboard' && (
          <CreateTeamDashboard
            currentUser={currentUser}
            project={project}
            projects={projects}
            currentTeam={currentTeam}
            allCandidates={candidates}
            synergyAnalysis={synergyAnalysis}
            invites={invites}
            onAddToTeam={handleAddToTeam}
            onRemoveFromTeam={handleRemoveFromTeam}
            onSelectProject={(presetId) => handleQuickLoadPreset(presetId)}
            onSendInvite={handleSendInvite}
            onSwitchIntent={handleSwitchIntent}
            onInspectRadar={(cand) => setRadarCandidate(cand)}
          />
        )}

        {activeTab === 'overview' && (
          <HomePage
            currentTeam={currentTeam}
            allCandidates={candidates}
            projects={projects}
            currentProject={project}
            openTeams={openTeams}
            invites={invites}
            applications={applications}
            onSelectProject={(p) => setProject(p)}
            onAddToTeam={handleAddToTeam}
            onRemoveFromTeam={handleRemoveFromTeam}
            onApplyToTeam={handleApplyToTeam}
            onAcceptIncomingApplication={handleAcceptIncomingApplication}
            onDeclineIncomingApplication={handleDeclineIncomingApplication}
            onAcceptInvite={handleAcceptInvite}
            onNavigate={handleTabChange}
            onOpenRadarModal={(cand) => setRadarCandidate(cand)}
            onOpenContactModal={(cand) => {
              setContactModalCandidate(cand);
              setIsContactModalOpen(true);
            }}
            onOpenProofModal={() => setIsProofModalOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onSaveNewProject={(newP) => {
              setProjects(prev => [newP, ...prev]);
              setProject(newP);
            }}
          />
        )}

        {activeTab === 'workbench' && (
          <TeamWorkbench
            currentTeam={currentTeam}
            allCandidates={candidates}
            project={project}
            synergyAnalysis={synergyAnalysis}
            isLoadingSynergy={isLoadingSynergy}
            currentUser={currentUser}
            onAddToTeam={handleAddToTeam}
            onRemoveFromTeam={handleRemoveFromTeam}
            onTriggerDeepAudit={() => evaluateSynergy(currentTeam, project)}
            onNavigateToDiscovery={() => {
              setDiscoveryQuery('');
              handleTabChange('discovery');
            }}
            onNavigateToDiscoveryWithFilter={(query) => {
              setDiscoveryQuery(query);
              handleTabChange('discovery');
            }}
            onNavigateToCharter={() => handleTabChange('charter')}
            onOpenRadarModal={(cand) => setRadarCandidate(cand)}
            onOpenContactModal={(cand) => {
              setContactModalCandidate(cand);
              setIsContactModalOpen(true);
            }}
          />
        )}

        {activeTab === 'jointeam' && (
          <JoinTeamBoard
            openTeams={openTeams}
            applications={applications}
            candidates={candidates}
            currentTeam={currentTeam}
            onApplyToTeam={handleApplyToTeam}
            onAcceptIncomingApplication={handleAcceptIncomingApplication}
            onDeclineIncomingApplication={handleDeclineIncomingApplication}
            onNavigateToWorkbench={() => handleTabChange('workbench')}
            onInspectRadar={(cand) => setRadarCandidate(cand)}
          />
        )}

        {activeTab === 'discovery' && (
          <TalentDiscovery
            candidates={candidates}
            currentTeam={currentTeam}
            project={project}
            initialSearchQuery={discoveryQuery}
            onAddToTeam={handleAddToTeam}
            onRemoveFromTeam={handleRemoveFromTeam}
            onRunSmartMatch={handleRunSmartMatch}
            smartMatchResults={smartMatchResults}
            isLoadingMatch={isLoadingMatch}
            onOpenProofParser={() => setIsProofModalOpen(true)}
            onOpenRadarModal={(cand) => setRadarCandidate(cand)}
            onOpenContactModal={(cand) => {
              setContactModalCandidate(cand);
              setIsContactModalOpen(true);
            }}
          />
        )}

        {activeTab === 'soloboard' && (
          <SoloProjectBoard
            projects={projects}
            activeCandidate={candidates[1]} // Persona: Priya Nair (UI/UX Product Designer)
            onApplyToProject={handleApplyToProjectFromSolo}
            onSelectProjectForLeadMode={(p) => {
              setProject(p);
              handleTabChange('workbench');
            }}
          />
        )}

        {activeTab === 'deconstruct' && (
          <ProjectDeconstructor
            currentProject={project}
            onApplyProject={setProject}
            onDeconstructWithAI={handleDeconstructWithAI}
            isDeconstructing={isDeconstructing}
            onNavigateToWorkbench={() => handleTabChange('workbench')}
          />
        )}

        {activeTab === 'charter' && (
          <SprintCharterView
            charter={sprintCharter}
            currentTeam={currentTeam}
            project={project}
            onGenerateCharter={() => generateCharter(currentTeam, project)}
            isGeneratingCharter={isGeneratingCharter}
          />
        )}
      </main>

      {/* 6-Axis Individual Skill Radar Modal */}
      <SkillRadarModal
        candidate={radarCandidate}
        onClose={() => setRadarCandidate(null)}
        onAddToTeam={handleAddToTeam}
        isInTeam={radarCandidate ? currentTeam.some(m => m.id === radarCandidate.id) : false}
      />

      {/* Proof-Based Skill Parser Modal */}
      <ProofSkillParserModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        onAddCandidate={handleSaveProfile}
      />

      {/* Matrimony-Style Contact Unlock & Invitations Modal */}
      <ContactUnlockModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        targetCandidate={contactModalCandidate}
        invites={invites}
        onSendInvite={handleSendInvite}
        onAcceptInvite={handleAcceptInvite}
        project={project}
      />

      {/* Profile Registration & Edit Modal */}
      <ProfileBuilderModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveProfile={handleSaveProfile}
        currentProfile={currentUser}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">ProjectMatch Synergy Engine</span>
            <span>• Universal Hackathon, Buildathon & Innovation Platform</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center text-indigo-600 font-semibold">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Gemini 3.7 Flash & 3.1 Flash-Lite
            </span>
            <span>• Live Delta Simulator & 6-Axis Radar</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

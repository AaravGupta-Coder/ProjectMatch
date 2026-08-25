export type Archetype =
  | 'System Architect'
  | 'Speed Builder / Hacker'
  | 'UX Crafter'
  | 'Quantitative Mind'
  | 'Visionary & Domain Lead';

export type PrimaryRole =
  | 'Full-Stack Engineer'
  | 'AI / ML Specialist'
  | 'UI/UX Product Designer'
  | 'Cloud & Distributed Systems Architect'
  | 'Data / Quantitative Engineer'
  | 'Domain & Product Strategist'
  | 'Hardware & Embedded Engineer'
  | 'Cybersecurity & Infrastructure Specialist'
  | 'Mobile & Cross-Platform Engineer';

export type WorkingStyle =
  | 'Async Deep-Work'
  | 'Pair-Programming Fast-Paced'
  | 'Structured & Methodical'
  | 'Exploratory & Experimental';

export type AcademicYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | '1st Year Masters' | '2nd Year Masters' | 'Postgrad / Alumni';

export type Gender = 'Female' | 'Male' | 'Non-Binary';

export type Department =
  | 'Computer Science & Eng (CSE)'
  | 'Electronics & Comm (ECE)'
  | 'Artificial Intelligence & Data Science'
  | 'Information Technology (IT)'
  | 'Electrical & Electronics (EEE)'
  | 'Mechanical Engineering'
  | 'Design & Human-Computer Interaction'
  | 'Computer Science & Cyber Security'
  | 'Computational & Data Sciences (CDS)';

export interface CodingHandles {
  leetcode?: string;
  leetcodeProblems?: number;
  leetcodeRating?: number;
  codechef?: string;
  codechefStars?: string;
  codechefRating?: number;
  codeforces?: string;
  github?: string;
  githubRepos?: number;
  githubCommits?: number;
  linkedin?: string;
  hackerrank?: string;
}

export interface ExtractedSkillScores {
  dsa: number;
  web: number;
  ml: number;
  design: number;
  pitch: number;
  systems: number;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  telegram?: string;
  linkedin?: string;
}

export type EvidenceDataSource = 
  | 'GitHub' 
  | 'LeetCode' 
  | 'CodeChef' 
  | 'Codeforces' 
  | 'HackerRank' 
  | 'Resume/CV' 
  | 'Self-Declared';

export interface EvidenceSkill {
  name: string;
  category: 'Languages' | 'Frameworks & Systems' | 'DSA & Problem Solving' | 'AI & Data' | 'Product & Design' | 'Cloud & DevOps' | 'Cybersecurity & Web3' | 'Hardware & IoT';
  proficiency: number; // 0-100 scale
  confidence: 'High' | 'Medium' | 'Low';
  confidenceScore: number; // Percentage e.g. 92
  supportingEvidence: string[]; // Concrete factual bullet points
  sources: EvidenceDataSource[];
  isSelfDeclaredOnly?: boolean;
}

export interface PlatformConnectorResult {
  platform: 'github' | 'leetcode' | 'codechef' | 'codeforces' | 'hackerrank' | 'resume' | 'linkedin';
  displayName: string;
  status: 'connected' | 'error' | 'not_provided' | 'protected_mode';
  handle?: string;
  dataSummary: string;
  metrics?: Record<string, any>;
  timestamp: string;
  errorReason?: string;
}

export interface UserCandidate {
  id: string;
  name: string;
  avatar: string;
  gender: 'Female' | 'Male' | 'Non-Binary' | 'Prefer not to say';
  headline: string;
  college: string;
  department: Department;
  yearOfStudy: AcademicYear;
  experienceLevel: 'Undergrad' | 'Grad / Masters' | 'PhD / Researcher' | 'Industry / Alum';
  primaryRole: PrimaryRole;
  archetype: Archetype;
  topSkills: string[];
  selfDeclaredSkills?: string[];
  inferredSkills?: EvidenceSkill[];
  connectorReports?: PlatformConnectorResult[];
  technicalScore: number;
  codingHandles?: CodingHandles;
  extractedSkillScores: ExtractedSkillScores;
  workingStyle: WorkingStyle;
  weeklyAvailabilityHours: number;
  timezone: string;
  githubUsername?: string;
  portfolioUrl?: string;
  hackathonsWon: number;
  hackathonsAttended?: number;
  completedProjectsCount?: number;
  nativeLanguage?: string;
  trackRecord?: 'Won Hackathon' | 'Finalist+' | 'Attended';
  pastProjects: Array<{
    title: string;
    tech: string;
    description: string;
  }>;
  bio: string;
  interestedDomains: string[];
  status: 'available' | 'in-team' | 'open-to-invites';
  verifiedBadges: string[];
  contactInfo: ContactInfo;
}

export type UserIntent = 'joiner' | 'leader';

export interface HackathonConstraints {
  requireFemaleMember: boolean;
  minDepartments: number;
  allowedYears: string[];
  maxTeamSize: number;
  targetTrack: string;
}

export type SIHConstraints = HackathonConstraints;

export interface ProjectRequirement {
  id: string;
  title: string;
  tagline: string;
  track: string;
  competitionContext: string;
  description: string;
  targetTeamSize: number;
  postedTime?: string;
  userStatus?: 'active' | 'pending' | 'invited' | 'none';
  sihConstraints?: HackathonConstraints;
  hackathonConstraints?: HackathonConstraints;
  requiredRoles: Array<{
    role: string;
    priority: 'Critical' | 'Recommended' | 'Bonus';
    archetype: Archetype;
    idealSkills: string[];
    responsibility: string;
  }>;
  criticalTechStack: string[];
  radarTarget: {
    technicalCoverage: number;
    archetypeBalance: number;
    communicationPace: number;
    bandwidthReliability: number;
    innovationIndex: number;
  };
  keyMilestones: Array<{
    phase: string;
    deliverable: string;
    leadRole: string;
  }>;
  recruitingPitch?: string;
  creatorName?: string;
  creatorCollege?: string;
}

export interface FrictionRisk {
  title: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  mitigation: string;
}

export interface CompetitionComplianceStatus {
  isFullyCompliant: boolean;
  femaleMemberSatisfied: boolean;
  femaleCount: number;
  femaleMemberCount?: number;
  branchDiversitySatisfied: boolean;
  uniqueBranchesCount: number;
  distinctBranchesCount?: number;
  branches: string[];
  roleCoverageSatisfied: boolean;
  coveredRoles: string[];
  missingRoles: string[];
  bandwidthQuorumSatisfied: boolean;
  totalWeeklyHours: number;
}

export type SIHComplianceStatus = CompetitionComplianceStatus;

export interface TeamSynergyAnalysis {
  overallSynergyScore: number;
  sprintSuccessProbability: number;
  radarScores: {
    technicalCoverage: number;
    archetypeBalance: number;
    communicationPace: number;
    bandwidthReliability: number;
    innovationIndex: number;
  };
  strengths: string[];
  criticalGaps: string[];
  frictionRisks: FrictionRisk[];
  recommendedNextAddition: string;
  chemistrySummary: string;
  sihCompliance?: CompetitionComplianceStatus;
  competitionCompliance?: CompetitionComplianceStatus;
}

export interface DeltaSimulation {
  candidateId: string;
  currentScore: number;
  projectedScore: number;
  delta: number;
  rationale: string;
  sihImpact: string;
  diversityImpact?: string;
  filledGap: string | null;
  overlapWarning: string | null;
}

export interface SprintCharter {
  teamMotto: string;
  phases: Array<{
    timeframe: string;
    milestone: string;
    tasks: Array<{
      assigneeName: string;
      task: string;
      deliverable: string;
    }>;
  }>;
  collaborationPact: string[];
  decisionProtocol: string;
}

export interface SmartMatchResult {
  candidateId: string;
  matchScore: number;
  matchRationale: string;
  complementaryBenefit: string;
}

export interface OpenTeamVacancy {
  role: PrimaryRole;
  archetype: Archetype;
  priority: 'Critical' | 'Recommended' | 'Bonus';
  idealSkills: string[];
  description: string;
  seatsOpen: number;
}

export interface OpenTeam {
  id: string;
  name: string;
  tagline: string;
  hackathonName: string;
  hackathonTrack: string;
  problemStatementId?: string;
  problemStatement: string;
  targetTeamSize: number;
  postedTime?: string;
  userStatus?: 'active' | 'pending' | 'invited' | 'none';
  members: UserCandidate[];
  leader: UserCandidate;
  synergyScore: number;
  openVacancies: OpenTeamVacancy[];
  culture: string;
  weeklyTimeCommitment: string;
  urgency: 'Immediate (Sprint Starts Soon)' | 'Forming Roster' | 'Final Seat';
  sihComplianceStatus?: {
    hasFemaleMember: boolean;
    branchCount: number;
    isFullyCompliant: boolean;
    neededToSatisfy: string;
  };
  competitionComplianceStatus?: {
    hasFemaleMember: boolean;
    branchCount: number;
    isFullyCompliant: boolean;
    neededToSatisfy: string;
  };
  contactInfo: ContactInfo;
}

export interface TeamJoinApplication {
  id: string;
  teamId: string;
  teamName: string;
  hackathonName: string;
  applicantCandidate: UserCandidate;
  targetRole: PrimaryRole;
  pitchMessage: string;
  weeklyHoursOffered: number;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined' | 'under_review';
  feedbackNote?: string;
  teamContact?: ContactInfo;
  isIncomingToUserTeam?: boolean;
}

export interface TeamInvite {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  candidateRole: string;
  projectId: string;
  projectTitle: string;
  senderId?: string;
  senderName: string;
  senderRole?: string;
  pitchMessage: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
  unlockedContact?: ContactInfo;
}

export interface SkillGapReasoningResult {
  targetPersonSkills: string[];
  teamHaveSkills: string[];
  projectNeedSkills: string[];
  targetRole: PrimaryRole | string;
  targetArchetype: Archetype | string;
  headlineSentence: string;
  shortWhy: string;
  detailedRationale: string[];
  recommendedFocus: string;
  predictedSynergyBoost: string;
  confidenceScore: number;
  matchingCandidateIds: string[];
}


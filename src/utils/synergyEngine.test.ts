import { describe, it, expect } from 'vitest';
import { calculateSIHCompliance, computeLocalTeamScore, simulateCandidateDelta } from '../utils/synergyEngine';
import { UserCandidate, ProjectRequirement } from '../types';

const mockCandidate = (overrides: Partial<UserCandidate> = {}): UserCandidate => ({
  id: 'test-1',
  name: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  gender: 'Male',
  headline: 'Test headline',
  college: 'Test College',
  department: 'Computer Science & Eng (CSE)',
  yearOfStudy: '3rd Year',
  experienceLevel: 'Undergrad',
  primaryRole: 'Full-Stack Engineer',
  archetype: 'System Architect',
  topSkills: ['React', 'TypeScript'],
  technicalScore: 85,
  extractedSkillScores: { dsa: 80, web: 90, ml: 70, design: 60, pitch: 75, systems: 85 },
  workingStyle: 'Pair-Programming Fast-Paced',
  weeklyAvailabilityHours: 25,
  timezone: 'IST',
  hackathonsWon: 2,
  pastProjects: [],
  bio: 'Test bio',
  interestedDomains: ['AI'],
  status: 'available',
  verifiedBadges: ['Verified'],
  contactInfo: { email: 'test@example.com', phone: '1234567890', whatsapp: '1234567890' },
  ...overrides,
});

const mockProject = (overrides: Partial<ProjectRequirement> = {}): ProjectRequirement => ({
  id: 'proj-1',
  title: 'Test Project',
  tagline: 'Test tagline',
  track: 'AI',
  competitionContext: 'hackathon',
  description: 'Test description',
  targetTeamSize: 4,
  requiredRoles: [
    { role: 'Full-Stack Engineer', priority: 'Critical', archetype: 'System Architect', idealSkills: ['React'], responsibility: 'Build' },
  ],
  criticalTechStack: ['React', 'TypeScript'],
  radarTarget: { technicalCoverage: 90, archetypeBalance: 85, communicationPace: 88, bandwidthReliability: 90, innovationIndex: 95 },
  keyMilestones: [],
  ...overrides,
});

describe('synergyEngine', () => {
  describe('calculateSIHCompliance', () => {
    it('returns fully compliant for a balanced team', () => {
      const team = [
        mockCandidate({ gender: 'Female', department: 'Computer Science & Eng (CSE)' }),
        mockCandidate({ id: 'test-2', gender: 'Male', department: 'Electronics & Comm (ECE)' }),
      ];
      const project = mockProject({
        sihConstraints: { requireFemaleMember: true, minDepartments: 2, allowedYears: [], maxTeamSize: 4, targetTrack: 'AI' },
      });
      const result = calculateSIHCompliance(team, project);
      expect(result.isFullyCompliant).toBe(true);
      expect(result.femaleMemberSatisfied).toBe(true);
      expect(result.branchDiversitySatisfied).toBe(true);
    });

    it('flags missing female member when required', () => {
      const team = [mockCandidate({ gender: 'Male' })];
      const project = mockProject({
        sihConstraints: { requireFemaleMember: true, minDepartments: 1, allowedYears: [], maxTeamSize: 4, targetTrack: 'AI' },
      });
      const result = calculateSIHCompliance(team, project);
      expect(result.femaleMemberSatisfied).toBe(false);
    });
  });

  describe('computeLocalTeamScore', () => {
    it('returns minimum score for empty team', () => {
      const project = mockProject();
      const result = computeLocalTeamScore([], project);
      expect(result.score).toBeGreaterThanOrEqual(25);
    });

    it('calculates higher score for stronger team', () => {
      const weakTeam = [mockCandidate({ technicalScore: 50 })];
      const strongTeam = [
        mockCandidate({ technicalScore: 95, gender: 'Female' }),
        mockCandidate({ id: 't2', technicalScore: 95, gender: 'Male', department: 'Electronics & Comm (ECE)' }),
      ];
      const project = mockProject();
      const weakScore = computeLocalTeamScore(weakTeam, project).score;
      const strongScore = computeLocalTeamScore(strongTeam, project).score;
      expect(strongScore).toBeGreaterThan(weakScore);
    });
  });

  describe('simulateCandidateDelta', () => {
    it('returns positive delta for strong candidate addition', () => {
      const team = [mockCandidate({ technicalScore: 70 })];
      const candidate = mockCandidate({ id: 'c2', technicalScore: 95, gender: 'Female' });
      const project = mockProject({
        sihConstraints: { requireFemaleMember: true, minDepartments: 2, allowedYears: [], maxTeamSize: 4, targetTrack: 'AI' },
      });
      const result = simulateCandidateDelta(candidate, team, project);
      expect(result.delta).toBeGreaterThan(0);
    });

    it('detects overlap warning when same role exists', () => {
      const team = [
        mockCandidate({ primaryRole: 'Full-Stack Engineer' }),
        mockCandidate({ id: 't2', primaryRole: 'Full-Stack Engineer' }),
      ];
      const candidate = mockCandidate({ id: 'c3', primaryRole: 'Full-Stack Engineer' });
      const project = mockProject();
      const result = simulateCandidateDelta(candidate, team, project);
      expect(result.overlapWarning).not.toBeNull();
    });
  });
});

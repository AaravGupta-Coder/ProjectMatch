import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { AISkillGapSuggestionCard } from '../components/AISkillGapSuggestionCard';
import { UserCandidate, ProjectRequirement, SkillGapReasoningResult } from '../types';

const mockCandidate = (overrides: Partial<UserCandidate> = {}): UserCandidate => ({
  id: 'c1',
  name: 'Test Candidate',
  avatar: 'https://example.com/avatar.jpg',
  gender: 'Male',
  headline: 'Test headline',
  college: 'Test College',
  department: 'Computer Science & Eng (CSE)',
  yearOfStudy: '3rd Year',
  experienceLevel: 'Undergrad',
  primaryRole: 'Full-Stack Engineer',
  archetype: 'System Architect',
  topSkills: ['React', 'TypeScript', 'Node.js'],
  technicalScore: 88,
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

const mockProject: ProjectRequirement = {
  id: 'proj-1',
  title: 'Test Project',
  tagline: 'Test tagline',
  track: 'AI',
  competitionContext: 'hackathon',
  description: 'Test description',
  targetTeamSize: 4,
  requiredRoles: [],
  criticalTechStack: ['React', 'TypeScript'],
  radarTarget: { technicalCoverage: 90, archetypeBalance: 85, communicationPace: 88, bandwidthReliability: 90, innovationIndex: 95 },
  keyMilestones: [],
};

const mockSuggestion: SkillGapReasoningResult = {
  targetPersonSkills: ['React', 'TypeScript', 'Node.js'],
  teamHaveSkills: ['Python', 'ML'],
  projectNeedSkills: ['Frontend', 'UI'],
  targetRole: 'UI/UX Product Designer',
  targetArchetype: 'UX Crafter',
  headlineSentence: 'You need a person with React and TypeScript skills.',
  shortWhy: 'To complete the team.',
  detailedRationale: ['Rationale 1', 'Rationale 2'],
  recommendedFocus: 'UI/UX',
  predictedSynergyBoost: '+20%',
  confidenceScore: 90,
  matchingCandidateIds: ['c1'],
};

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockSuggestion, source: 'test' }),
    } as Response)
  );
});

describe('AISkillGapSuggestionCard', () => {
  const defaultProps = {
    currentTeam: [] as UserCandidate[],
    allCandidates: [mockCandidate()],
    project: mockProject,
    onAddToTeam: vi.fn(),
    onNavigateToDiscoveryWithFilter: vi.fn(),
    onOpenRadarModal: vi.fn(),
    onOpenContactModal: vi.fn(),
  };

  it('renders without crashing', async () => {
    render(<AISkillGapSuggestionCard {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText(/Squad Triangulation/)).toBeInTheDocument();
    });
  });

  it('has proper ARIA region role', async () => {
    render(<AISkillGapSuggestionCard {...defaultProps} />);
    await waitFor(() => {
      const region = screen.getByRole('region');
      expect(region).toHaveAttribute('aria-labelledby', 'ai-skill-gap-heading');
      expect(region).toBeInTheDocument();
    });
  });

  it('renders focus options with aria-pressed', async () => {
    render(<AISkillGapSuggestionCard {...defaultProps} />);
    await waitFor(() => {
      const focusButtons = screen.getAllByRole('button').filter(btn => 
        btn.textContent?.includes('Auto-Detect Complementarity') || 
        btn.textContent?.includes('UI / UX & Front-End Polish')
      );
      expect(focusButtons.length).toBeGreaterThan(0);
      focusButtons.forEach(btn => {
        expect(btn).toHaveAttribute('aria-pressed');
      });
    });
  });

  it('has accessible toggle for detailed rationale', async () => {
    render(<AISkillGapSuggestionCard {...defaultProps} />);
    await waitFor(() => {
      const toggleBtn = screen.getByText(/Why this combination wins/i);
      expect(toggleBtn.closest('button')).toHaveAttribute('aria-expanded');
      expect(toggleBtn.closest('button')).toHaveAttribute('aria-controls');
    });
  });

  it('has aria-labels on icon-only buttons', async () => {
    render(<AISkillGapSuggestionCard {...defaultProps} />);
    await waitFor(() => {
      const radarButtons = screen.getAllByRole('button').filter(btn => 
        btn.getAttribute('aria-label')?.includes('radar')
      );
      expect(radarButtons.length).toBeGreaterThan(0);
    });
  });

  it('has accessible candidate list', async () => {
    render(<AISkillGapSuggestionCard {...defaultProps} />);
    await waitFor(() => {
      const candidateList = screen.getByRole('list', { name: /Matching candidates/i });
      expect(candidateList).toBeInTheDocument();
    });
  });
});

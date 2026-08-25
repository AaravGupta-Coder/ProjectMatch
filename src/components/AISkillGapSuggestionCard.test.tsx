import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { AISkillGapSuggestionCard } from '../components/AISkillGapSuggestionCard';
import { UserCandidate, ProjectRequirement } from '../types';

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

  it('renders without crashing', () => {
    render(<AISkillGapSuggestionCard {...defaultProps} />);
    expect(screen.getByText(/Squad Triangulation/)).toBeInTheDocument();
  });

  it('has proper ARIA region role', () => {
    render(<AISkillGapSuggestionCard {...defaultProps} />);
    const region = screen.getByRole('region', { name: /AI Skill Complementarity Reasoning/i });
    expect(region).toBeInTheDocument();
  });

  it('renders focus options with aria-pressed', () => {
    render(<AISkillGapSuggestionCard {...defaultProps} />);
    const focusButtons = screen.getAllByRole('button').filter(btn => 
      btn.textContent?.includes('Auto-Detect Complementarity') || 
      btn.textContent?.includes('UI / UX & Front-End Polish')
    );
    expect(focusButtons.length).toBeGreaterThan(0);
    focusButtons.forEach(btn => {
      expect(btn).toHaveAttribute('aria-pressed');
    });
  });

  it('has accessible toggle for detailed rationale', () => {
    render(<AISkillGapSuggestionCard {...defaultProps} />);
    const toggleBtn = screen.getByText(/Why this combination wins/i);
    expect(toggleBtn.closest('button')).toHaveAttribute('aria-expanded');
    expect(toggleBtn.closest('button')).toHaveAttribute('aria-controls');
  });

  it('has aria-labels on icon-only buttons', () => {
    render(<AISkillGapSuggestionCard {...defaultProps} />);
    const radarButtons = screen.getAllByRole('button').filter(btn => 
      btn.getAttribute('aria-label')?.includes('radar')
    );
    expect(radarButtons.length).toBeGreaterThan(0);
  });

  it('has accessible candidate list', () => {
    render(<AISkillGapSuggestionCard {...defaultProps} />);
    const candidateList = screen.getByRole('list', { name: /Matching candidates/i });
    expect(candidateList).toBeInTheDocument();
  });
});

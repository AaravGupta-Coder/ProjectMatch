import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { CandidateCard } from '../components/CandidateCard';
import { UserCandidate } from '../types';

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
  pastProjects: [{ title: 'Project 1', tech: 'React', description: 'Test project' }],
  bio: 'Test bio',
  interestedDomains: ['AI'],
  status: 'available',
  verifiedBadges: ['Verified'],
  contactInfo: { email: 'test@example.com', phone: '1234567890', whatsapp: '1234567890' },
  ...overrides,
});

describe('CandidateCard', () => {
  const defaultProps = {
    candidate: mockCandidate(),
    isInTeam: false,
    onAddToTeam: vi.fn(),
    onRemoveFromTeam: vi.fn(),
  };

  it('renders candidate name', () => {
    render(<CandidateCard {...defaultProps} />);
    expect(screen.getByText('Test Candidate')).toBeInTheDocument();
  });

  it('has accessible article structure', () => {
    render(<CandidateCard {...defaultProps} />);
    const article = document.getElementById('candidate-card-c1');
    expect(article).toBeInTheDocument();
  });

  it('has aria-expanded on More/Less toggle', () => {
    render(<CandidateCard {...defaultProps} />);
    const toggleBtn = screen.getByText('More');
    expect(toggleBtn.closest('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('has aria-labels on action buttons', () => {
    render(<CandidateCard {...defaultProps} onOpenRadarModal={vi.fn()} onOpenContactModal={vi.fn()} />);
    expect(screen.getByLabelText(/radar for Test Candidate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/invite Test Candidate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Add Test Candidate to team/i)).toBeInTheDocument();
  });

  it('expands details on More button click', () => {
    render(<CandidateCard {...defaultProps} />);
    const toggleBtn = screen.getByText('More');
    fireEvent.click(toggleBtn);
    expect(screen.getByText('Less')).toBeInTheDocument();
    expect(screen.getByText('Past Landmark Builds')).toBeInTheDocument();
  });

  it('shows Add to Team button when not in team', () => {
    render(<CandidateCard {...defaultProps} isInTeam={false} />);
    expect(screen.getByText('Add to Team')).toBeInTheDocument();
  });

  it('shows Remove button when in team', () => {
    render(<CandidateCard {...defaultProps} isInTeam={true} />);
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });
});

import { UserCandidate, ProjectRequirement, TeamSynergyAnalysis, DeltaSimulation, SIHComplianceStatus, SprintCharter } from '../types';

export function calculateSIHCompliance(
  team: UserCandidate[],
  project: ProjectRequirement
): SIHComplianceStatus {
  const femaleMembers = team.filter(m => m.gender === 'Female');
  const femaleCount = femaleMembers.length;
  const femaleMemberSatisfied = !project.sihConstraints?.requireFemaleMember || femaleCount >= 1;

  const branchesSet = new Set(team.map(m => m.department));
  const branches = Array.from(branchesSet);
  const minDepartments = project.sihConstraints?.minDepartments || 2;
  const branchDiversitySatisfied = team.length < 2 || branches.length >= minDepartments;

  const coveredRoles: string[] = [];
  const missingRoles: string[] = [];

  project.requiredRoles.forEach(r => {
    const isCovered = team.some(m => {
      const pRole = m.primaryRole.toLowerCase();
      const rRole = r.role.toLowerCase();
      return pRole.includes(rRole) || rRole.includes(pRole) || 
        (rRole.includes('ai') && pRole.includes('ai')) ||
        (rRole.includes('full-stack') && pRole.includes('full-stack')) ||
        (rRole.includes('design') && pRole.includes('designer'));
    });
    if (isCovered) {
      coveredRoles.push(r.role);
    } else {
      missingRoles.push(r.role);
    }
  });

  const roleCoverageSatisfied = missingRoles.length === 0;
  const totalWeeklyHours = team.reduce((acc, m) => acc + (m.weeklyAvailabilityHours || 20), 0);
  const bandwidthQuorumSatisfied = totalWeeklyHours >= 60;

  const isFullyCompliant = femaleMemberSatisfied && branchDiversitySatisfied && roleCoverageSatisfied;

  return {
    isFullyCompliant,
    femaleMemberSatisfied,
    femaleCount,
    branchDiversitySatisfied,
    uniqueBranchesCount: branches.length,
    branches,
    roleCoverageSatisfied,
    coveredRoles,
    missingRoles,
    bandwidthQuorumSatisfied,
    totalWeeklyHours,
  };
}

export const calculateCompetitionCompliance = calculateSIHCompliance;

export function computeLocalTeamScore(
  team: UserCandidate[],
  project: ProjectRequirement
): { score: number; sihStatus: SIHComplianceStatus } {
  if (team.length === 0) {
    return {
      score: 20,
      sihStatus: calculateSIHCompliance(team, project)
    };
  }

  const sihStatus = calculateSIHCompliance(team, project);
  
  // 1. Technical competence average (0 - 30 pts)
  const avgTechScore = team.reduce((acc, m) => acc + m.technicalScore, 0) / team.length;
  const techPoints = (avgTechScore / 100) * 30;

  // 2. Archetype & Role Balance (0 - 30 pts)
  const archetypes = new Set(team.map(m => m.archetype));
  const archetypeRatio = Math.min(archetypes.size / Math.min(team.length, 4), 1);
  const coveredRolesRatio = sihStatus.coveredRoles.length / Math.max(project.requiredRoles.length, 1);
  const balancePoints = (archetypeRatio * 15) + (coveredRolesRatio * 15);

  // 3. Hackathon & Diversity Constraint Fulfillment (0 - 25 pts)
  let diversityPoints = 0;
  if (sihStatus.femaleMemberSatisfied) diversityPoints += 12;
  if (sihStatus.branchDiversitySatisfied) diversityPoints += 8;
  if (sihStatus.bandwidthQuorumSatisfied) diversityPoints += 5;

  // 4. Bandwidth & Synergy Factor (0 - 15 pts)
  const totalHours = team.reduce((acc, m) => acc + (m.weeklyAvailabilityHours || 20), 0);
  const bandwidthPoints = Math.min(totalHours / (project.targetTeamSize * 30), 1) * 15;

  const rawScore = Math.round(techPoints + balancePoints + diversityPoints + bandwidthPoints);
  const boundedScore = Math.min(Math.max(rawScore, 25), 99);

  return {
    score: boundedScore,
    sihStatus
  };
}

export function simulateCandidateDelta(
  candidate: UserCandidate,
  currentTeam: UserCandidate[],
  project: ProjectRequirement
): DeltaSimulation {
  const isInTeam = currentTeam.some(m => m.id === candidate.id);
  const currentCalc = computeLocalTeamScore(currentTeam, project);
  const currentScore = currentCalc.score;

  if (isInTeam) {
    // If removing
    const hypotheticalTeam = currentTeam.filter(m => m.id !== candidate.id);
    const hypotheticalCalc = computeLocalTeamScore(hypotheticalTeam, project);
    const delta = hypotheticalCalc.score - currentScore;
    return {
      candidateId: candidate.id,
      currentScore,
      projectedScore: hypotheticalCalc.score,
      delta,
      rationale: `Removing ${candidate.name} reduces team technical depth and role coverage.`,
      sihImpact: candidate.gender === 'Female' && currentTeam.filter(m => m.gender === 'Female').length <= 1
        ? '⚠️ Removes sole female teammate (Violates diversity rule)'
        : 'Neutral on diversity criteria',
      diversityImpact: candidate.gender === 'Female' && currentTeam.filter(m => m.gender === 'Female').length <= 1
        ? '⚠️ Removes sole female teammate (Reduces diversity score)'
        : 'Neutral on diversity criteria',
      filledGap: null,
      overlapWarning: null
    };
  }

  // Pre-Add Simulation
  const hypotheticalTeam = [...currentTeam, candidate];
  const hypotheticalCalc = computeLocalTeamScore(hypotheticalTeam, project);
  const delta = hypotheticalCalc.score - currentScore;

  // Analyze Gaps & Overlaps
  let filledGap: string | null = null;
  let overlapWarning: string | null = null;
  let diversityImpact = 'Complies with general team criteria.';

  // Check gender diversity rule
  const hadFemale = currentTeam.some(m => m.gender === 'Female');
  const addsFemale = candidate.gender === 'Female';
  if (!hadFemale && addsFemale && project.sihConstraints?.requireFemaleMember) {
    diversityImpact = '🌟 Enhances mixed-gender representation and diversity score!';
  } else if (!currentCalc.sihStatus.branchDiversitySatisfied && hypotheticalCalc.sihStatus.branchDiversitySatisfied) {
    diversityImpact = `🏛️ Unlocks cross-department diversity (${candidate.department})`;
  }

  // Check role coverage
  const candidateRole = candidate.primaryRole.toLowerCase();
  const matchedMissingRole = currentCalc.sihStatus.missingRoles.find(r => 
    candidateRole.includes(r.toLowerCase()) || r.toLowerCase().includes(candidateRole)
  );

  if (matchedMissingRole) {
    filledGap = `Supplies required ${matchedMissingRole} role with verified skill score (${candidate.technicalScore}/100)`;
  }

  // Check overlap
  const sameRoleMembers = currentTeam.filter(m => m.primaryRole === candidate.primaryRole);
  if (sameRoleMembers.length >= 2) {
    overlapWarning = `High role redundancy: Already have ${sameRoleMembers.length} ${candidate.primaryRole}s.`;
  }

  // Generate specific human rationale
  let rationale = '';
  if (delta >= 15) {
    rationale = `Massive synergy jump: ${diversityImpact} ${filledGap ? `and fills critical ${filledGap}` : ''}.`;
  } else if (delta > 5) {
    rationale = `Solid addition: Boosts combined bandwidth by ${candidate.weeklyAvailabilityHours}h/wk and elevates technical score.`;
  } else if (delta >= 0) {
    rationale = `Moderate fit: Good capabilities, but ${overlapWarning || 'team already has comparable competencies'}.`;
  } else {
    rationale = `Negative delta: ${overlapWarning || 'Creates archetype imbalance and dilutes role specialization'}.`;
  }

  return {
    candidateId: candidate.id,
    currentScore,
    projectedScore: hypotheticalCalc.score,
    delta,
    rationale,
    sihImpact: diversityImpact,
    diversityImpact,
    filledGap,
    overlapWarning
  };
}

export function calculateComprehensiveSynergy(
  team: UserCandidate[],
  project: ProjectRequirement
): TeamSynergyAnalysis {
  if (team.length === 0) {
    return {
      overallSynergyScore: 0,
      sprintSuccessProbability: 0,
      radarScores: {
        technicalCoverage: 0,
        archetypeBalance: 0,
        communicationPace: 0,
        bandwidthReliability: 0,
        innovationIndex: 0
      },
      strengths: [],
      criticalGaps: ["Add team members to evaluate synergy"],
      frictionRisks: [],
      recommendedNextAddition: "Add Core Engineer or Team Lead",
      chemistrySummary: "Team is currently empty. Add talent to begin live chemistry evaluation."
    };
  }

  const { score, sihStatus } = computeLocalTeamScore(team, project);
  const memberCount = team.length;
  const archetypes = new Set(team.map(m => m.archetype));
  const totalHours = team.reduce((acc, m) => acc + (m.weeklyAvailabilityHours || 20), 0);

  const hasEngineer = team.some(m => m.primaryRole?.toLowerCase().includes("engineer") || m.primaryRole?.toLowerCase().includes("full-stack") || m.archetype === 'System Architect');
  const hasAI = team.some(m => m.primaryRole?.toLowerCase().includes("ai") || m.primaryRole?.toLowerCase().includes("ml") || m.topSkills?.some(s => s.toLowerCase().includes("ai") || s.toLowerCase().includes("python") || s.toLowerCase().includes("llm")));
  const hasDesigner = team.some(m => m.primaryRole?.toLowerCase().includes("design") || m.archetype === 'UX Crafter' || m.topSkills?.some(s => s.toLowerCase().includes("design") || s.toLowerCase().includes("tailwind") || s.toLowerCase().includes("figma")));
  const hasDomainLead = team.some(m => m.archetype === 'Visionary & Domain Lead' || m.primaryRole?.toLowerCase().includes("lead") || m.primaryRole?.toLowerCase().includes("product"));

  const techCoverage = Math.min(98, Math.max(30, Math.round(
    35 + (hasEngineer ? 22 : 0) + (hasAI ? 18 : 0) + (hasDesigner ? 15 : 0) + (memberCount * 2)
  )));

  const archetypeBalance = Math.min(98, Math.max(25, Math.round(
    30 + (archetypes.size * 16) + (team.length >= 3 && archetypes.size >= 3 ? 10 : 0)
  )));

  const pairCount = team.filter(m => m.workingStyle?.toLowerCase().includes("pair")).length;
  const asyncCount = team.filter(m => m.workingStyle?.toLowerCase().includes("async")).length;
  const commPace = pairCount > 0 && asyncCount > 0 ? 82 : 90;

  const targetHours = (project.targetTeamSize || 4) * 20;
  const bandwidthReliability = Math.min(98, Math.max(40, Math.round(
    (totalHours / targetHours) * 88
  )));

  const hackathonWinsTotal = team.reduce((acc, m) => acc + (m.hackathonsWon || 0), 0);
  const innovationIndex = Math.min(99, Math.max(35, Math.round(
    55 + (archetypes.size * 6) + Math.min(hackathonWinsTotal * 4, 18)
  )));

  // Generate dynamic strengths
  const strengths: string[] = [];
  if (hasEngineer && hasAI) {
    strengths.push("High-velocity technical core: Distributed systems architecture coupled with AI/ML inference capabilities.");
  }
  if (hasDesigner) {
    strengths.push("High UX fidelity: Dedicated interface craft ensures rapid prototyping with responsive feedback states.");
  }
  if (sihStatus.femaleMemberSatisfied) {
    strengths.push("Team Diversity: Balanced cross-gender representation strengthening team dynamics.");
  }
  if (totalHours >= 60) {
    strengths.push(`Sprint Bandwidth: Combined availability of ${totalHours} hrs/week provides strong buffer for deadline milestones.`);
  }
  if (strengths.length === 0) {
    strengths.push(`Solid baseline capability with ${memberCount} committed teammate(s).`);
  }

  // Critical gaps
  const criticalGaps: string[] = [];
  if (sihStatus.missingRoles.length > 0) {
    criticalGaps.push(`Missing designated roles: ${sihStatus.missingRoles.slice(0, 2).join(", ")}.`);
  }
  if (!hasDesigner && memberCount >= 2) {
    criticalGaps.push("No dedicated UX Crafter: Risk of slow frontend prototyping and unstyled components.");
  }
  if (!sihStatus.femaleMemberSatisfied && project.sihConstraints?.requireFemaleMember) {
    criticalGaps.push("Diversity Gap: Team currently lacks gender diversity for optimal hackathon evaluation.");
  }
  if (!sihStatus.branchDiversitySatisfied && memberCount >= 2) {
    criticalGaps.push("Cross-Disciplinary Gap: Team members currently share the same department. Cross-functional teams are recommended.");
  }
  if (criticalGaps.length === 0) {
    criticalGaps.push("Roster is fully balanced across technical and competition criteria. Ready for sprint execution!");
  }

  // Friction risks
  const frictionRisks: TeamSynergyAnalysis['frictionRisks'] = [];
  if (!hasDomainLead && memberCount >= 3) {
    frictionRisks.push({
      title: "Scope Creep & Decision Lock",
      severity: "medium",
      description: "Without a clear Domain Lead / PM, disagreements on feature priority may delay the core submission path.",
      mitigation: "Designate a sprint lead to timebox technical debates to 5 minutes."
    });
  }
  if (!hasDesigner) {
    frictionRisks.push({
      title: "Judge Demo Impact Risk",
      severity: "high",
      description: "Functional backends without polished UI visual hierarchy score 40% lower during rapid 3-minute hackathon judging rounds.",
      mitigation: "Recruit a UX designer or leverage pre-built component systems."
    });
  }
  if (pairCount > 0 && asyncCount > 0 && memberCount >= 3) {
    frictionRisks.push({
      title: "Working Style Synchronization Gap",
      severity: "low",
      description: "Teammates have differing preferences between live pair-programming and asynchronous PR review cadences.",
      mitigation: "Establish core overlapping working windows every 6 hours of the hackathon sprint."
    });
  }

  // Next recommended addition
  let recommendedNextAddition = "Roster Complete";
  if (!sihStatus.femaleMemberSatisfied && project.sihConstraints?.requireFemaleMember) {
    recommendedNextAddition = "Female Teammate (Recommended for Team Diversity)";
  } else if (!hasDesigner) {
    recommendedNextAddition = "UI/UX Product Designer (Archetype: UX Crafter)";
  } else if (!hasAI && project.criticalTechStack.some(s => s.toLowerCase().includes("ai") || s.toLowerCase().includes("gemini"))) {
    recommendedNextAddition = "AI / ML Intelligence Specialist (Archetype: Quantitative Mind)";
  } else if (sihStatus.missingRoles.length > 0) {
    recommendedNextAddition = `${sihStatus.missingRoles[0]} (To satisfy project role coverage)`;
  } else if (memberCount < (project.targetTeamSize || 4)) {
    recommendedNextAddition = "Rapid Prototyper / Speed Builder for crunch demo execution";
  }

  const chemistrySummary = `This ${memberCount}-member squad has a projected chemistry score of ${score}/100. ${
    sihStatus.isFullyCompliant 
      ? 'Fully compliant with balanced cross-functional capability.' 
      : 'Roster is active; resolve the highlighted gap(s) to maximize competition winning odds.'
  }`;

  return {
    overallSynergyScore: score,
    sprintSuccessProbability: Math.min(Math.max(Math.round(score * 0.94), 30), 98),
    radarScores: {
      technicalCoverage: techCoverage,
      archetypeBalance: archetypeBalance,
      communicationPace: commPace,
      bandwidthReliability: bandwidthReliability,
      innovationIndex: innovationIndex
    },
    strengths,
    criticalGaps,
    frictionRisks,
    recommendedNextAddition,
    chemistrySummary
  };
}

export function calculateLocalSprintCharter(
  team: UserCandidate[],
  project: ProjectRequirement
): SprintCharter {
  const m1 = team[0]?.name || "Team Member 1";
  const m2 = team[1]?.name || team[0]?.name || "Team Member 2";
  const m3 = team[2]?.name || team[0]?.name || "Team Member 3";
  const m4 = team[3]?.name || team[1]?.name || team[0]?.name || "Team Member 4";

  return {
    teamMotto: `${project.title}: Build Bold, Ship Fast, Win Together`,
    phases: [
      {
        timeframe: "Hours 00 - 08: Architecture & UI Contracts",
        milestone: "Component tree frozen, API interfaces locked, baseline repository live.",
        tasks: [
          { assigneeName: m1, task: "Scaffold project repository, environment configs, and API routes", deliverable: "Backend skeleton & endpoints" },
          { assigneeName: m2, task: "Design high-fidelity UI layout and responsive layout components", deliverable: "Interactive design system" }
        ]
      },
      {
        timeframe: "Hours 08 - 22: Core Feature & Pipeline Execution",
        milestone: "Full workflow connected end-to-end with live data and core algorithmic loop.",
        tasks: [
          { assigneeName: m1, task: "Implement distributed business logic and database persistence", deliverable: "Live functional engine" },
          { assigneeName: m2, task: `Integrate ${project.criticalTechStack.slice(0, 3).join(', ')} into frontend canvas`, deliverable: "Feature interaction flow" },
          ...(team.length >= 3 ? [{ assigneeName: m3, task: "Build auxiliary APIs, data scrapers, and verification pipelines", deliverable: "Data pipelines" }] : [])
        ]
      },
      {
        timeframe: "Hours 22 - 32: Micro-Interactions, Stress Testing & Polish",
        milestone: "Zero unhandled errors, responsive on all devices, edge-case fallbacks active.",
        tasks: [
          { assigneeName: m1, task: "Audit edge conditions, error fallbacks, and performance latency", deliverable: "Stress test verification" },
          { assigneeName: m2, task: "Refine hover states, empty states, and visual transitions", deliverable: "Polished UI experience" },
          ...(team.length >= 4 ? [{ assigneeName: m4, task: "Draft presentation deck and competition criteria checklist", deliverable: "Judge criteria audit" }] : [])
        ]
      },
      {
        timeframe: "Hours 32 - 36: 3-Minute Demo Choreography & Pitch",
        milestone: "Flawless end-to-end demo choreography with immediate wow moments.",
        tasks: [
          { assigneeName: m1, task: "Run live system dry-run on judging presentation device", deliverable: "Validated demo pathway" },
          { assigneeName: m2, task: "Finalize pitch script and value proposition narrative", deliverable: "Winning pitch deck" }
        ]
      }
    ],
    collaborationPact: [
      "15-Minute Rule: If a roadblock persists for 15+ minutes, escalate to a pair session.",
      "Atomic Commits: Ship functional vertical slices; never leave broken code overnight.",
      "Judge-First Focus: Prioritize user-facing delight and clear problem-solving impact."
    ],
    decisionProtocol: "Technical disputes are resolved by a 5-minute timed test. The simpler, working solution is merged."
  };
}


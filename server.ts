import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { detectPlatformFromInput } from "./server/connectors/platformDetector";
import { fetchGitHubData } from "./server/connectors/githubConnector";
import { fetchLeetCodeData } from "./server/connectors/leetcodeConnector";
import { fetchCodeChefData } from "./server/connectors/codechefConnector";
import { fetchCodeforcesData } from "./server/connectors/codeforcesConnector";
import { parseResumeContent } from "./server/connectors/resumeParser";
import { handleLinkedInIntegration } from "./server/connectors/linkedinHandler";
import { analyzeEvidenceSkills } from "./server/evidenceEngine";
import { NormalizedPlatformData } from "./server/connectors/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Gemini initialization with user-agent telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Safe executor that tries primary model, secondary fallback model, and handles timeouts gracefully
async function safeGenerateContent(ai: GoogleGenAI, config: any, timeoutMs = 6000) {
  const models = ["gemini-3.7-flash", "gemini-3.1-flash-lite"];
  for (const model of models) {
    try {
      const generatePromise = ai.models.generateContent({
        ...config,
        model,
      });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Gemini request timeout")), timeoutMs)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);
      return { response, model };
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      const isTemporary = errMsg.includes("503") || errMsg.includes("429") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand") || errMsg.includes("timeout");
      if (isTemporary) {
        console.warn(`[Gemini Engine] Model ${model} unavailable or timed out. Attempting fallback...`);
        continue;
      }
      console.warn(`[Gemini Engine] Notice on ${model}: ${errMsg}`);
    }
  }
  return null;
}

// Health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 1. AI Project Deconstruction Endpoint
app.post("/api/ai/deconstruct-project", async (req, res) => {
  const { title, description, domain, track, teamSize } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `Deconstruct this hackathon/innovation project into a precision team composition blueprint:
Project Title: "${title}"
Domain/Track: "${domain || track || 'General Tech'}"
Target Team Size: ${teamSize || 4}
Project Description: "${description}"

Analyze the technical vectors, cognitive roles needed, key tech stack, and deliverable sprint milestones.`;

      const genResult = await safeGenerateContent(ai, {
        contents: prompt,
        config: {
          systemInstruction: "You are an elite Silicon Valley Hackathon Judge, Chief Architect, and Team Formation Strategist. Deconstruct project requirements into realistic, highly complementary roles, tech stacks, and team archetype distributions.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: "A crisp, high-impact 2-sentence executive summary of what this team must build." },
              recommendedRoles: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    role: { type: Type.STRING },
                    priority: { type: Type.STRING, description: "Critical, Recommended, or Bonus" },
                    archetype: { type: Type.STRING, description: "e.g. System Architect, Speed Builder / Hacker, UX Crafter, Quantitative Mind, Visionary & Domain Lead" },
                    idealSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                    responsibility: { type: Type.STRING },
                  },
                  required: ["role", "priority", "archetype", "idealSkills", "responsibility"]
                }
              },
              criticalTechStack: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              radarTarget: {
                type: Type.OBJECT,
                properties: {
                  technicalCoverage: { type: Type.NUMBER },
                  archetypeBalance: { type: Type.NUMBER },
                  communicationPace: { type: Type.NUMBER },
                  bandwidthReliability: { type: Type.NUMBER },
                  innovationIndex: { type: Type.NUMBER }
                },
                required: ["technicalCoverage", "archetypeBalance", "communicationPace", "bandwidthReliability", "innovationIndex"]
              },
              keyMilestones: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phase: { type: Type.STRING, description: "e.g. Hour 0-12, Hour 12-24, Hour 24-36, Final Demo" },
                    deliverable: { type: Type.STRING },
                    leadRole: { type: Type.STRING }
                  },
                  required: ["phase", "deliverable", "leadRole"]
                }
              }
            },
            required: ["summary", "recommendedRoles", "criticalTechStack", "radarTarget", "keyMilestones"]
          }
        }
      });

      if (genResult?.response?.text) {
        const parsed = JSON.parse(genResult.response.text);
        return res.json({ success: true, data: parsed, source: genResult.model });
      }
    } catch (_err) {
      // Gracefully fall through to deterministic calculations
    }
  }

  // High quality deterministic fallback when offline or API key pending
  const fallbackData = {
    summary: `Engineered project architecture for ${title} requiring multi-disciplinary integration across modern cloud/data pipelines, high-conversion visual design, and robust core business logic.`,
    recommendedRoles: [
      {
        role: "Lead Full-Stack / Core Systems",
        priority: "Critical",
        archetype: "System Architect",
        idealSkills: ["TypeScript", "React", "Node.js/Go", "Distributed APIs", "PostgreSQL/Redis"],
        responsibility: "Define overall system topology, state management, and real-time backend pipeline."
      },
      {
        role: "AI / ML & Intelligence Specialist",
        priority: "Critical",
        archetype: "Quantitative Mind",
        idealSkills: ["Gemini API / LLMs", "Python", "Vector Embeddings", "Prompt Chaining", "Data Pipelines"],
        responsibility: "Orchestrate inference layers, reasoning pipelines, and intelligent semantic transformations."
      },
      {
        role: "Product & Interaction Designer",
        priority: "Recommended",
        archetype: "UX Crafter",
        idealSkills: ["Design Systems", "Tailwind CSS", "Motion UI", "Figma", "Micro-Interactions"],
        responsibility: "Craft the high-fidelity user interface, instant response states, and demo pitch narratives."
      },
      {
        role: "Domain Lead & Rapid Prototyper",
        priority: "Recommended",
        archetype: "Visionary & Domain Lead",
        idealSkills: ["Product Strategy", "API Integration", "User Flow Testing", "Pitch Narrative"],
        responsibility: "Validate user friction points, drive rapid integration testing, and build pitch deck demos."
      }
    ],
    criticalTechStack: ["React 19", "TypeScript", "Tailwind CSS", "Gemini 3.7", "Express", "Vite"],
    radarTarget: {
      technicalCoverage: 92,
      archetypeBalance: 88,
      communicationPace: 85,
      bandwidthReliability: 90,
      innovationIndex: 95
    },
    keyMilestones: [
      { phase: "Hour 00-08: Foundation", deliverable: "Wireframes locked, API contracts mocked, data structures standardized.", leadRole: "System Architect" },
      { phase: "Hour 08-20: Core Engine", deliverable: "AI reasoning pipeline integrated with frontend interactive canvas.", leadRole: "AI / ML Specialist" },
      { phase: "Hour 20-30: Polish & Synergy", deliverable: "Micro-interactions, real-time feedback loops, and stress testing.", leadRole: "UX Crafter" },
      { phase: "Hour 30-36: Judge Demo", deliverable: "End-to-end rehearsal, edge-case hardening, and live deck presentation.", leadRole: "Visionary & Domain Lead" }
    ]
  };

  return res.json({ success: true, data: fallbackData, source: "deterministic-engine" });
});

// 2. AI Team Synergy & Chemistry Analysis Endpoint
app.post("/api/ai/analyze-synergy", async (req, res) => {
  const { project, members } = req.body;

  if (!members || !Array.isArray(members)) {
    return res.status(400).json({ error: "Members array is required" });
  }

  const ai = getGeminiClient();

  if (ai && members.length > 0) {
    try {
      const prompt = `Analyze team chemistry, skill overlaps, blind spots, and friction risk for this team:
Project Context: "${project ? project.title + ' - ' + project.description : 'Hackathon High-Velocity Build'}"
Team Roster (${members.length} members):
${members.map((m: any, i: number) => `${i + 1}. ${m.name} | Role: ${m.primaryRole} | Archetype: ${m.archetype} | Skills: ${m.topSkills?.join(', ')} | Style: ${m.workingStyle} | Avail: ${m.weeklyAvailabilityHours}h/wk`).join('\n')}

Evaluate:
1. Overall Team Synergy Score (0-100)
2. 5 Radar Dimensions (Technical Coverage, Archetype Balance, Communication Pace, Bandwidth Reliability, Innovation Index)
3. Key Strengths (3 bullet points)
4. Critical Gaps & Missing Skills
5. Team Friction Risks (with practical mitigation strategies)
6. Ideal Next Team Member Profile recommendation
7. Sprint Success Probability (%)`;

      const genResult = await safeGenerateContent(ai, {
        contents: prompt,
        config: {
          systemInstruction: "You are a world-class organizational psychologist and high-performance engineering team coach. Provide rigorous, actionable, and non-trivial team chemistry diagnostics.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallSynergyScore: { type: Type.INTEGER },
              sprintSuccessProbability: { type: Type.INTEGER },
              radarScores: {
                type: Type.OBJECT,
                properties: {
                  technicalCoverage: { type: Type.INTEGER },
                  archetypeBalance: { type: Type.INTEGER },
                  communicationPace: { type: Type.INTEGER },
                  bandwidthReliability: { type: Type.INTEGER },
                  innovationIndex: { type: Type.INTEGER }
                },
                required: ["technicalCoverage", "archetypeBalance", "communicationPace", "bandwidthReliability", "innovationIndex"]
              },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              criticalGaps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              frictionRisks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    severity: { type: Type.STRING, description: "high, medium, or low" },
                    description: { type: Type.STRING },
                    mitigation: { type: Type.STRING }
                  },
                  required: ["title", "severity", "description", "mitigation"]
                }
              },
              recommendedNextAddition: { type: Type.STRING, description: "Specific role, archetype, or skill to add next" },
              chemistrySummary: { type: Type.STRING, description: "A high-impact 2-sentence summary of how this team functions under hackathon pressure." }
            },
            required: ["overallSynergyScore", "sprintSuccessProbability", "radarScores", "strengths", "criticalGaps", "frictionRisks", "recommendedNextAddition", "chemistrySummary"]
          }
        }
      });

      if (genResult?.response?.text) {
        const parsed = JSON.parse(genResult.response.text);
        return res.json({ success: true, data: parsed, source: genResult.model });
      }
    } catch (_err) {
      // Fall through to deterministic calculations
    }
  }

  // Heuristic-based calculation for instant responsive calculations
  const memberCount = members.length;
  const archetypes = new Set(members.map((m: any) => m.archetype));
  const totalHours = members.reduce((acc: number, m: any) => acc + (m.weeklyAvailabilityHours || 20), 0);

  const hasEngineer = members.some((m: any) => m.primaryRole?.includes("Engineer") || m.primaryRole?.includes("Full-Stack"));
  const hasAI = members.some((m: any) => m.primaryRole?.includes("AI") || m.primaryRole?.includes("ML") || m.topSkills?.some((s: string) => s.toLowerCase().includes("ai") || s.toLowerCase().includes("python")));
  const hasDesigner = members.some((m: any) => m.primaryRole?.includes("Designer") || m.archetype?.includes("UX") || m.topSkills?.some((s: string) => s.toLowerCase().includes("design") || s.toLowerCase().includes("tailwind")));

  let techScore = Math.min(95, 45 + (hasEngineer ? 20 : 0) + (hasAI ? 18 : 0) + (hasDesigner ? 15 : 0) + (memberCount * 3));
  let archetypeScore = Math.min(96, 40 + (archetypes.size * 14));
  let commScore = members.some((m: any) => m.workingStyle?.includes("Pair")) && members.some((m: any) => m.workingStyle?.includes("Async")) ? 78 : 88;
  let bandScore = Math.min(98, Math.round((totalHours / (memberCount * 25 || 1)) * 90));
  let innovScore = Math.min(97, 65 + (archetypes.size * 7));

  const overall = Math.round((techScore * 0.3) + (archetypeScore * 0.25) + (commScore * 0.15) + (bandScore * 0.15) + (innovScore * 0.15));

  const strengths = [];
  if (hasEngineer && hasAI) strengths.push("Strong dual-core engineering stack: full-stack architecture combined with AI pipeline integration.");
  if (hasDesigner) strengths.push("Dedicated UX/Design capability ensures high aesthetic standards and pitch-ready visual clarity.");
  if (archetypes.size >= 3) strengths.push(`High cognitive diversity across ${archetypes.size} distinct operating archetypes.`);
  if (strengths.length === 0) strengths.push("Agile initial core with rapid decision-making velocity.");

  const criticalGaps = [];
  if (!hasDesigner) criticalGaps.push("Missing dedicated UI/UX Product Designer for high-fidelity front-end execution.");
  if (!hasAI) criticalGaps.push("No dedicated AI/ML engineer for prompt optimization and model evaluation.");
  if (!hasEngineer) criticalGaps.push("Critical lack of core systems engineering bandwidth.");
  if (memberCount < 3) criticalGaps.push("Team is understaffed for multi-vector 48-hour execution.");

  const frictionRisks = [];
  if (!hasDesigner) {
    frictionRisks.push({
      title: "Interface Bottleneck Risk",
      severity: "high",
      description: "Without a dedicated designer, developers may default to bare components, risking visual impact during final judge reviews.",
      mitigation: "Adopt pre-built design systems or recruit a UX Crafter immediately."
    });
  }
  if (members.filter((m: any) => m.archetype === "System Architect").length > 1) {
    frictionRisks.push({
      title: "Architectural Debate Paralysis",
      severity: "medium",
      description: "Multiple senior architects can enter theoretical debates on stack topology rather than rapid shipping.",
      mitigation: "Assign clear ownership: one owns data/backend, one owns frontend client state."
    });
  }

  const fallbackData = {
    overallSynergyScore: memberCount === 0 ? 0 : overall,
    sprintSuccessProbability: memberCount === 0 ? 0 : Math.min(96, overall - 2),
    radarScores: {
      technicalCoverage: memberCount === 0 ? 0 : techScore,
      archetypeBalance: memberCount === 0 ? 0 : archetypeScore,
      communicationPace: memberCount === 0 ? 0 : commScore,
      bandwidthReliability: memberCount === 0 ? 0 : bandScore,
      innovationIndex: memberCount === 0 ? 0 : innovScore
    },
    strengths,
    criticalGaps,
    frictionRisks,
    recommendedNextAddition: !hasDesigner ? "UI/UX Product Designer (Archetype: UX Crafter)" : !hasAI ? "AI / ML Engineer (Archetype: Quantitative Mind)" : "Domain Growth Specialist",
    chemistrySummary: `This ${memberCount}-person roster has strong foundation with an estimated ${overall}% synergy efficiency. Strategic complementary additions will unlock maximum hackathon velocity.`
  };

  return res.json({ success: true, data: fallbackData, source: "deterministic-engine" });
});

// 3. AI Smart Matchmaker & Candidate Ranking Endpoint
app.post("/api/ai/smart-match", async (req, res) => {
  const { query, currentTeam, candidatePool, projectContext } = req.body;

  const ai = getGeminiClient();

  if (ai && candidatePool && candidatePool.length > 0) {
    try {
      const prompt = `Given the project goal and current team gaps, rank and explain the top candidate matches from this pool:
Project: "${projectContext || 'National Hackathon Project'}"
Search/Gap Query: "${query || 'Find best complementary teammate'}"
Current Team Roles: ${(currentTeam || []).map((m: any) => m.primaryRole + ' (' + m.archetype + ')').join(', ') || 'None yet'}

Candidate Pool:
${candidatePool.slice(0, 15).map((c: any) => `ID: ${c.id} | ${c.name} | Role: ${c.primaryRole} | Archetype: ${c.archetype} | Skills: ${c.topSkills.join(', ')} | Availability: ${c.weeklyAvailabilityHours}h/wk | Style: ${c.workingStyle}`).join('\n')}

Select the top 4 candidates, calculate a Match Score (0-100%), and provide specific 2-sentence rationale on why they complement the current team.`;

      const genResult = await safeGenerateContent(ai, {
        contents: prompt,
        config: {
          systemInstruction: "You are an AI Talent Matchmaker. Analyze candidate fit based on complementary skills, cognitive archetype balance, and bandwidth.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matches: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    candidateId: { type: Type.STRING },
                    matchScore: { type: Type.INTEGER },
                    matchRationale: { type: Type.STRING },
                    complementaryBenefit: { type: Type.STRING }
                  },
                  required: ["candidateId", "matchScore", "matchRationale", "complementaryBenefit"]
                }
              },
              searchInsight: { type: Type.STRING }
            },
            required: ["matches", "searchInsight"]
          }
        }
      });

      if (genResult?.response?.text) {
        const parsed = JSON.parse(genResult.response.text);
        return res.json({ success: true, data: parsed, source: genResult.model });
      }
    } catch (_err) {
      // Fall through to deterministic matching
    }
  }

  // Fallback matching logic
  const scored = (candidatePool || []).map((c: any) => {
    let score = 80;
    const isCurrent = (currentTeam || []).some((m: any) => m.id === c.id);
    if (isCurrent) return null;

    if (query) {
      const q = query.toLowerCase();
      if (c.primaryRole.toLowerCase().includes(q)) score += 12;
      if (c.topSkills.some((s: string) => s.toLowerCase().includes(q))) score += 10;
      if (c.archetype.toLowerCase().includes(q)) score += 8;
    }
    score = Math.min(99, Math.max(72, score + (c.hackathonsWon * 3) + Math.floor(c.technicalScore / 20)));

    return {
      candidateId: c.id,
      matchScore: score,
      matchRationale: `${c.name} brings critical ${c.primaryRole} expertise with proven ${c.archetype} delivery speed.`,
      complementaryBenefit: `Directly bolsters ${c.topSkills.slice(0, 3).join(', ')} while matching high-velocity sprint cadence.`
    };
  }).filter(Boolean).sort((a: any, b: any) => b.matchScore - a.matchScore).slice(0, 4);

  return res.json({
    success: true,
    data: {
      matches: scored,
      searchInsight: `Ranked candidates based on skill complementarity and availability overlap.`
    },
    source: "deterministic-engine"
  });
});

// 3.5 AI Skill Gap & Complementarity Reasoning Endpoint
app.post("/api/ai/skill-gap-reasoning", async (req, res) => {
  const { project, currentTeam, candidatePool, focusPreference } = req.body;

  const ai = getGeminiClient();
  const members = Array.isArray(currentTeam) ? currentTeam : [];
  const proj = project || {
    title: "Hackathon Project",
    description: "Multi-disciplinary high velocity build",
    track: "General Tech"
  };

  // Collect team have skills
  const allTeamSkills = Array.from(new Set(members.flatMap((m: any) => m.topSkills || []))) as string[];
  const teamRoles = members.map((m: any) => m.primaryRole || "");
  const teamArchetypes = members.map((m: any) => m.archetype || "");

  if (ai && members.length > 0) {
    try {
      const prompt = `Perform precision tri-vector skill gap triangulation for this hackathon squad:
Project: "${proj.title}"
Domain/Track: "${proj.track || 'General'}"
Project Description: "${proj.description || ''}"

Current Team (${members.length} members):
${members.map((m: any, i: number) => `${i + 1}. ${m.name} | Role: ${m.primaryRole} | Archetype: ${m.archetype} | Skills: ${(m.topSkills || []).join(', ')}`).join('\n')}

Focus Preference: "${focusPreference || 'Auto-Detect Best Complementarity'}"

Generate the exact tri-vector recommendation sentence in this exact form:
"You need a person with [Target Person Skills] because you have [Team Have Skills] and for your project need a person with [Project Need Skills]."

Also provide target role, target archetype, concise reasoning, and predicted synergy boost.`;

      const genResult = await safeGenerateContent(ai, {
        contents: prompt,
        config: {
          systemInstruction: "You are an elite Engineering Team Architect and Hackathon Matchmaker. You analyze exact skill gaps between existing team capabilities and project technical requirements, delivering clear, actionable, proof-backed suggestions.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              targetPersonSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 to 5 specific skills needed in the next candidate (e.g. Figma, Motion UI, Tailwind CSS)"
              },
              teamHaveSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 to 5 key skills the existing squad already excels in"
              },
              projectNeedSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 to 5 technical/domain capabilities the project problem statement requires"
              },
              targetRole: { type: Type.STRING, description: "e.g. UI/UX Product Designer, AI/ML Specialist, etc." },
              targetArchetype: { type: Type.STRING, description: "e.g. UX Crafter, Quantitative Mind, System Architect, etc." },
              headlineSentence: {
                type: Type.STRING,
                description: "Exact sentence: 'You need a person with [X] because you have [Y] and for your project need a person with [Z].'"
              },
              shortWhy: { type: Type.STRING, description: "1-sentence summary of why this completes the triad" },
              detailedRationale: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 bullet points on technical complement, cognitive balance, and execution velocity"
              },
              recommendedFocus: { type: Type.STRING },
              predictedSynergyBoost: { type: Type.STRING, description: "e.g. +22% Synergy Delta" },
              confidenceScore: { type: Type.INTEGER, description: "85 to 99" }
            },
            required: [
              "targetPersonSkills",
              "teamHaveSkills",
              "projectNeedSkills",
              "targetRole",
              "targetArchetype",
              "headlineSentence",
              "shortWhy",
              "detailedRationale",
              "recommendedFocus",
              "predictedSynergyBoost",
              "confidenceScore"
            ]
          }
        }
      });

      if (genResult?.response?.text) {
        const parsed = JSON.parse(genResult.response.text);

        // Rank candidates from pool that best match targetPersonSkills
        const matchedCandidateIds = (candidatePool || [])
          .filter((c: any) => !members.some((m: any) => m.id === c.id))
          .map((c: any) => {
            let score = 0;
            const targetSkillsLower = parsed.targetPersonSkills.map((s: string) => s.toLowerCase());
            const cSkills = (c.topSkills || []).map((s: string) => s.toLowerCase());
            
            cSkills.forEach((cs: string) => {
              if (targetSkillsLower.some((ts: string) => ts.includes(cs) || cs.includes(ts))) {
                score += 15;
              }
            });

            if (c.primaryRole?.toLowerCase() === parsed.targetRole?.toLowerCase()) score += 25;
            if (c.archetype?.toLowerCase() === parsed.targetArchetype?.toLowerCase()) score += 20;

            return { id: c.id, score };
          })
          .sort((a: any, b: any) => b.score - a.score)
          .slice(0, 4)
          .map((m: any) => m.id);

        return res.json({
          success: true,
          data: {
            ...parsed,
            matchingCandidateIds: matchedCandidateIds
          },
          source: genResult.model
        });
      }
    } catch (_err) {
      // Fall through to deterministic engine
    }
  }

  // Deterministic Tri-Vector Recommendation Engine
  const hasDesigner = teamRoles.some((r: string) => r.includes("Designer")) || teamArchetypes.includes("UX Crafter");
  const hasAI = teamRoles.some((r: string) => r.includes("AI") || r.includes("ML")) || teamArchetypes.includes("Quantitative Mind");
  const hasArchitect = teamRoles.some((r: string) => r.includes("Architect") || r.includes("Full-Stack")) || teamArchetypes.includes("System Architect");
  const hasHardware = teamRoles.some((r: string) => r.includes("Hardware") || r.includes("Embedded"));

  let targetRole = "UI/UX Product Designer";
  let targetArchetype = "UX Crafter";
  let targetPersonSkills = ["Figma", "Tailwind CSS", "Motion UI", "User Flow Prototyping", "Accessible Design"];
  let projectNeedSkills = ["Responsive Interactive Interface", "Rapid 60fps Micro-interactions", "High-Impact Pitch Visuals"];
  let predictedBoost = "+21% Synergy Delta";

  if (!hasDesigner) {
    targetRole = "UI/UX Product Designer";
    targetArchetype = "UX Crafter";
    targetPersonSkills = ["Figma", "Tailwind CSS", "Design Systems", "Motion UI", "Accessibility (WCAG)"];
    projectNeedSkills = ["Clean Responsive UI", "60fps Micro-interactions", "High-Conversion Judge Presentation"];
    predictedBoost = "+24% Synergy Delta";
  } else if (!hasAI && (proj.track?.toLowerCase().includes("ai") || proj.description?.toLowerCase().includes("ai") || proj.description?.toLowerCase().includes("ml") || proj.description?.toLowerCase().includes("data"))) {
    targetRole = "AI / ML Specialist";
    targetArchetype = "Quantitative Mind";
    targetPersonSkills = ["Gemini API / LLMs", "Python", "Vector Embeddings", "Prompt Chaining", "FastAPI"];
    projectNeedSkills = ["Intelligent Inference Layer", "Semantic Vector Search", "Contextual Data Extraction"];
    predictedBoost = "+22% Synergy Delta";
  } else if (!hasArchitect) {
    targetRole = "Lead Systems & Cloud Architect";
    targetArchetype = "System Architect";
    targetPersonSkills = ["TypeScript", "Distributed APIs", "PostgreSQL / Redis", "Docker", "Event Pipelines"];
    projectNeedSkills = ["Robust Cloud Architecture", "Scalable Low-Latency APIs", "Data Integrity"];
    predictedBoost = "+20% Synergy Delta";
  } else if (proj.track?.toLowerCase().includes("robot") || proj.track?.toLowerCase().includes("iot") || proj.track?.toLowerCase().includes("hardware")) {
    targetRole = "Hardware & Embedded Engineer";
    targetArchetype = "Speed Builder / Hacker";
    targetPersonSkills = ["ESP32 / Arduino", "C++ / Embedded C", "MQTT / WebSockets", "Circuit Prototyping", "Sensor Telemetry"];
    projectNeedSkills = ["Physical Edge Integration", "Low-Latency Sensor Data", "Hardware-to-Cloud Bridge"];
    predictedBoost = "+25% Synergy Delta";
  } else {
    targetRole = "Domain & Product Strategist";
    targetArchetype = "Visionary & Domain Lead";
    targetPersonSkills = ["Product Analytics", "Market Validation", "Pitch Choreography", "User Testing", "API Integrations"];
    projectNeedSkills = ["Compelling Demo Narrative", "Business ROI Proof", "Clear Value Proposition"];
    predictedBoost = "+17% Synergy Delta";
  }

  const teamHaveSkills = (allTeamSkills.length > 0 
    ? allTeamSkills.slice(0, 4) 
    : ["Full-Stack TypeScript", "System Logic", "Node.js", "Git Workflow"]
  );

  const headlineSentence = `You need a person with ${targetPersonSkills.slice(0, 3).join(', ')} because you have ${teamHaveSkills.slice(0, 3).join(', ')}, and for your project '${proj.title}' need a person with ${projectNeedSkills.slice(0, 3).join(', ')}.`;

  const fallbackData = {
    targetPersonSkills,
    teamHaveSkills,
    projectNeedSkills,
    targetRole,
    targetArchetype,
    headlineSentence,
    shortWhy: `Closing the gap between backend implementation and project presentation turns raw technical capability into a championship-grade submission.`,
    detailedRationale: [
      `Technical Complementarity: Existing team strengths in ${teamHaveSkills.slice(0, 2).join(' & ')} are covered; adding ${targetPersonSkills.slice(0, 2).join(' & ')} eliminates single points of failure.`,
      `Cognitive Balance: Balances existing squad archetypes (${teamArchetypes.slice(0, 2).join(', ') || 'Builders'}) with a dedicated ${targetArchetype}.`,
      `Sprint Velocity: Ensures independent concurrent tracks without backend engineers getting stalled on unoptimized UI or unverified pipelines.`
    ],
    recommendedFocus: targetRole,
    predictedSynergyBoost: predictedBoost,
    confidenceScore: 94,
    matchingCandidateIds: (candidatePool || [])
      .filter((c: any) => !members.some((m: any) => m.id === c.id))
      .filter((c: any) => c.primaryRole === targetRole || c.archetype === targetArchetype)
      .slice(0, 4)
      .map((c: any) => c.id)
  };

  return res.json({
    success: true,
    data: fallbackData,
    source: "deterministic-engine"
  });
});

// 4. AI Sprint Kickstarter & Alignment Charter Generator
app.post("/api/ai/generate-sprint-charter", async (req, res) => {
  const { project, members } = req.body;

  const ai = getGeminiClient();

  if (ai && members && members.length > 0) {
    try {
      const prompt = `Generate a 48-Hour High-Performance Execution Blueprint & Sprint Charter:
Project: "${project?.title || 'Autonomous AI App'}" - "${project?.description || 'Competition build'}"
Team Roster (${members.length} members):
${members.map((m: any) => `${m.name} (${m.primaryRole} - ${m.archetype})`).join(', ')}

Create:
1. Team Call-Sign & Mission Motto
2. 4 Execution Phases (Hour 0-8 Foundation, Hour 8-20 Core Engine, Hour 20-36 Integration & Polish, Hour 36-48 Pitch & Demo) with explicit task assignments per member.
3. 3 Golden Team Collaboration Norms (Anti-Deadlock protocols)
4. Key Deliverable Checklist for judges.`;

      const genResult = await safeGenerateContent(ai, {
        contents: prompt,
        config: {
          systemInstruction: "You are a legendary Agile Sprint Master and Hackathon Mentor. Generate clear, actionable, and inspiring execution charters.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              teamMotto: { type: Type.STRING },
              phases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    timeframe: { type: Type.STRING },
                    milestone: { type: Type.STRING },
                    tasks: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          assigneeName: { type: Type.STRING },
                          task: { type: Type.STRING },
                          deliverable: { type: Type.STRING }
                        },
                        required: ["assigneeName", "task", "deliverable"]
                      }
                    }
                  },
                  required: ["timeframe", "milestone", "tasks"]
                }
              },
              collaborationPact: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              decisionProtocol: { type: Type.STRING }
            },
            required: ["teamMotto", "phases", "collaborationPact", "decisionProtocol"]
          }
        }
      });

      if (genResult?.response?.text) {
        const parsed = JSON.parse(genResult.response.text);
        return res.json({ success: true, data: parsed, source: genResult.model });
      }
    } catch (_err) {
      // Fall through to deterministic fallback
    }
  }

  // Deterministic fallback
  const fallbackData = {
    teamMotto: "Precision Execution, Relentless Craft, Zero Dead-Ends",
    phases: [
      {
        timeframe: "Hours 00 - 08: Architecture & UI Contracts",
        milestone: "Component tree frozen, TypeScript interfaces locked, backend skeleton live.",
        tasks: members.map((m: any, idx: number) => ({
          assigneeName: m.name,
          task: idx === 0 ? "Scaffold API contracts and data state pipeline" : idx === 1 ? "Design token system, layout grid, and high-fidelity screen templates" : "Implement mock data models and test edge case inputs",
          deliverable: `${m.name}'s initial subsystem milestone`
        }))
      },
      {
        timeframe: "Hours 08 - 24: Core Engine & AI Pipeline",
        milestone: "Full workflow connected end-to-end with live data and inference.",
        tasks: members.map((m: any) => ({
          assigneeName: m.name,
          task: `Build and stress-test ${m.primaryRole} domain integration`,
          deliverable: "End-to-end functional path verified"
        }))
      },
      {
        timeframe: "Hours 24 - 38: Polish, Micro-Interactions & Friction Checks",
        milestone: "Zero dead buttons, responsive at all screen widths, crisp light-mode visuals.",
        tasks: members.map((m: any) => ({
          assigneeName: m.name,
          task: "Audit UX feedback states, error fallbacks, and animation easing",
          deliverable: "Refined interaction state"
        }))
      },
      {
        timeframe: "Hours 38 - 48: 3-Minute Demo Choreography",
        milestone: "Flawless rehearsal with live wow moments under 60 seconds.",
        tasks: members.map((m: any) => ({
          assigneeName: m.name,
          task: "Run timed rehearsal on critical demo path",
          deliverable: "Validated pitch narrative"
        }))
      }
    ],
    collaborationPact: [
      "15-Minute Block Rule: If stuck for more than 15 minutes, pair up immediately.",
      "Ship Working Slices: Never leave unintegrated branches overnight.",
      "Aesthetic Standard: Every interactive control must have hover, active, and empty states."
    ],
    decisionProtocol: "Technical disputes are resolved by a 5-minute timed spike. The cleaner, working solution wins."
  };

  return res.json({ success: true, data: fallbackData, source: "deterministic-engine" });
});

// 5. Platform Detection API Endpoint
app.post("/api/integrations/detect-platform", (req, res) => {
  const { input } = req.body;
  if (!input || typeof input !== "string") {
    return res.status(400).json({ error: "Input string is required" });
  }
  const detected = detectPlatformFromInput(input);
  return res.json({ success: true, data: detected });
});

// 6. Multi-Platform Data Fetch & Normalization Endpoint (Isolated Connectors Layer)
app.post("/api/integrations/fetch-platform-data", async (req, res) => {
  const { 
    githubHandle, 
    leetcodeHandle, 
    codechefHandle, 
    codeforcesHandle, 
    resumeText, 
    linkedinUrl 
  } = req.body;

  const normalized: NormalizedPlatformData = {};
  const connectorReports: any[] = [];

  // 1. GitHub Connector
  if (githubHandle && githubHandle.trim()) {
    try {
      const ghResult = await fetchGitHubData(githubHandle);
      if (ghResult.success && ghResult.data) {
        normalized.github = ghResult.data;
        connectorReports.push({
          platform: "github",
          displayName: "GitHub Connector",
          status: "connected",
          handle: ghResult.data.username,
          dataSummary: ghResult.dataSummary,
          metrics: ghResult.metrics,
          timestamp: new Date().toISOString()
        });
      } else {
        connectorReports.push({
          platform: "github",
          displayName: "GitHub Connector",
          status: "error",
          handle: githubHandle,
          dataSummary: "Failed to fetch GitHub data",
          errorReason: ghResult.error,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err: any) {
      connectorReports.push({
        platform: "github",
        displayName: "GitHub Connector",
        status: "error",
        handle: githubHandle,
        dataSummary: "GitHub connector exception",
        errorReason: err?.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 2. LeetCode Connector
  if (leetcodeHandle && leetcodeHandle.trim()) {
    try {
      const lcResult = await fetchLeetCodeData(leetcodeHandle);
      if (lcResult.success && lcResult.data) {
        normalized.leetcode = lcResult.data;
        connectorReports.push({
          platform: "leetcode",
          displayName: "LeetCode Connector",
          status: "connected",
          handle: lcResult.data.username,
          dataSummary: lcResult.dataSummary,
          metrics: lcResult.metrics,
          timestamp: new Date().toISOString()
        });
      } else {
        connectorReports.push({
          platform: "leetcode",
          displayName: "LeetCode Connector",
          status: "error",
          handle: leetcodeHandle,
          dataSummary: "Failed to fetch LeetCode data",
          errorReason: lcResult.error,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err: any) {
      connectorReports.push({
        platform: "leetcode",
        displayName: "LeetCode Connector",
        status: "error",
        handle: leetcodeHandle,
        dataSummary: "LeetCode connector exception",
        errorReason: err?.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 3. CodeChef Connector
  if (codechefHandle && codechefHandle.trim()) {
    try {
      const ccResult = await fetchCodeChefData(codechefHandle);
      if (ccResult.success && ccResult.data) {
        normalized.codechef = ccResult.data;
        connectorReports.push({
          platform: "codechef",
          displayName: "CodeChef Connector",
          status: "connected",
          handle: ccResult.data.handle,
          dataSummary: ccResult.dataSummary,
          metrics: ccResult.metrics,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err: any) {
      connectorReports.push({
        platform: "codechef",
        displayName: "CodeChef Connector",
        status: "error",
        handle: codechefHandle,
        dataSummary: "CodeChef connector error",
        errorReason: err?.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 4. Codeforces Connector
  if (codeforcesHandle && codeforcesHandle.trim()) {
    try {
      const cfResult = await fetchCodeforcesData(codeforcesHandle);
      if (cfResult.success && cfResult.data) {
        normalized.codeforces = cfResult.data;
        connectorReports.push({
          platform: "codeforces",
          displayName: "Codeforces Connector",
          status: "connected",
          handle: cfResult.data.handle,
          dataSummary: cfResult.dataSummary,
          metrics: cfResult.metrics,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err: any) {
      connectorReports.push({
        platform: "codeforces",
        displayName: "Codeforces Connector",
        status: "error",
        handle: codeforcesHandle,
        dataSummary: "Codeforces connector error",
        errorReason: err?.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 5. Resume Parser Connector
  if (resumeText && resumeText.trim()) {
    try {
      const resResult = parseResumeContent(resumeText);
      if (resResult.success && resResult.data) {
        normalized.resume = resResult.data;
        connectorReports.push({
          platform: "resume",
          displayName: "Resume & CV Parser",
          status: "connected",
          dataSummary: resResult.dataSummary,
          metrics: resResult.metrics,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err: any) {
      connectorReports.push({
        platform: "resume",
        displayName: "Resume Parser",
        status: "error",
        dataSummary: "Failed to parse resume text",
        errorReason: err?.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 6. LinkedIn Protection & Link Adapter
  if (linkedinUrl && linkedinUrl.trim()) {
    const liResult = handleLinkedInIntegration(linkedinUrl);
    if (liResult.success && liResult.data) {
      normalized.linkedin = liResult.data;
      connectorReports.push({
        platform: "linkedin",
        displayName: "LinkedIn Adapter",
        status: "protected_mode",
        handle: linkedinUrl,
        dataSummary: liResult.dataSummary,
        metrics: liResult.metrics,
        timestamp: new Date().toISOString()
      });
    }
  }

  return res.json({
    success: true,
    data: {
      normalized,
      connectorReports,
      totalConnectedSources: connectorReports.filter(r => r.status === "connected" || r.status === "protected_mode").length
    }
  });
});

// 7. AI Evidence-Based Skill Profiling Endpoint
app.post("/api/integrations/analyze-evidence-skills", async (req, res) => {
  const { normalizedData, candidateName, selfDeclaredSkills } = req.body;

  if (!normalizedData) {
    return res.status(400).json({ error: "normalizedData object is required" });
  }

  const ai = getGeminiClient();
  try {
    const analysis = await analyzeEvidenceSkills(
      ai,
      normalizedData,
      candidateName || "Candidate Developer",
      selfDeclaredSkills || []
    );

    return res.json({
      success: true,
      data: analysis,
      engine: ai ? "gemini-evidence-synthesizer" : "deterministic-evidence-engine"
    });
  } catch (err: any) {
    console.error("[EvidenceAPI] Analysis error:", err);
    return res.status(500).json({ error: "Failed to synthesize evidence profile", details: err?.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ProjectMatch Server] Running at http://localhost:${PORT}`);
  });
}

startServer();

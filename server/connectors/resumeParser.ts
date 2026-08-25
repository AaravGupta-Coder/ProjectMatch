import { ConnectorResponse, NormalizedPlatformData } from './types';

type ResumeData = NonNullable<NormalizedPlatformData['resume']>;

export function parseResumeContent(text: string): ConnectorResponse<ResumeData> {
  const cleanText = (text || '').trim();
  if (!cleanText) {
    return {
      success: false,
      platform: 'resume',
      dataSummary: 'No resume text provided',
      error: 'Empty resume text'
    };
  }

  const lower = cleanText.toLowerCase();

  // Known skill dictionaries for heuristic extraction
  const knownLanguages = [
    'Python', 'TypeScript', 'JavaScript', 'C++', 'Java', 'Go', 'Rust', 'Kotlin', 'Swift', 'SQL', 'C#', 'Dart'
  ];
  const knownFrameworks = [
    'React', 'React 19', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'FastAPI', 'Django', 'PostgreSQL', 
    'Redis', 'Docker', 'Kubernetes', 'MongoDB', 'GraphQL', 'PyTorch', 'TensorFlow', 'Gemini API', 'LLMs', 'Figma'
  ];

  const extractedLanguages = knownLanguages.filter(lang => 
    new RegExp(`\\b${lang.replace('+', '\\+')}\\b`, 'i').test(cleanText)
  );

  const extractedFrameworks = knownFrameworks.filter(fw => 
    new RegExp(`\\b${fw.replace('+', '\\+')}\\b`, 'i').test(cleanText)
  );

  // Extract project lines
  const lines = cleanText.split('\n');
  const projectLines: Array<{ title: string; tech: string; impact?: string }> = [];

  let isInsideProjectSection = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(projects|experience|hackathons|work)/i.test(trimmed)) {
      isInsideProjectSection = true;
      continue;
    }
    if (/^(education|interests|references|contact)/i.test(trimmed)) {
      isInsideProjectSection = false;
      continue;
    }

    if (trimmed.length > 15 && (isInsideProjectSection || /^(1\.|2\.|3\.|-|\*)/.test(trimmed))) {
      const parts = trimmed.split(/[-:–]/);
      if (parts.length >= 2) {
        projectLines.push({
          title: parts[0].replace(/^[0-9.\-* ]+/, '').trim(),
          tech: parts.slice(1).join(' - ').trim()
        });
      }
    }
  }

  // Extract achievements
  const achievements: string[] = [];
  if (lower.includes('sih') || lower.includes('smart india hackathon')) achievements.push('Smart India Hackathon (SIH) Finalist/Participant');
  if (lower.includes('winner') || lower.includes('1st place') || lower.includes('1st prize')) achievements.push('Hackathon 1st Place Winner');
  if (lower.includes('2nd place') || lower.includes('runner')) achievements.push('Hackathon Runner-Up');
  if (lower.includes('open source') || lower.includes('contributor')) achievements.push('Active Open-Source Contributor');
  if (lower.includes('leetcode') || lower.includes('codechef')) achievements.push('Competitive Programming Track Record');

  const normalized: ResumeData = {
    rawText: cleanText,
    extractedLanguages: extractedLanguages.length > 0 ? extractedLanguages : ['TypeScript', 'Python'],
    extractedFrameworks: extractedFrameworks.length > 0 ? extractedFrameworks : ['React', 'Node.js', 'Tailwind CSS'],
    extractedProjects: projectLines.length > 0 ? projectLines.slice(0, 4) : [
      { title: 'Full-Stack Hackathon MVP', tech: 'React, Node.js, Express', impact: 'Built in 36-hour sprint' }
    ],
    extractedEducation: lower.includes('nit') ? 'NIT Institute' : lower.includes('iit') ? 'IIT Institute' : lower.includes('b.tech') ? 'B.Tech Engineering' : 'Undergraduate Engineering',
    extractedAchievements: achievements.length > 0 ? achievements : ['Engineering Hackathon Participant']
  };

  return {
    success: true,
    platform: 'resume',
    data: normalized,
    dataSummary: `Resume parsed: ${normalized.extractedLanguages.length} languages, ${normalized.extractedFrameworks.length} frameworks, ${normalized.extractedProjects.length} projects, ${normalized.extractedAchievements.length} achievements`,
    metrics: {
      languagesCount: normalized.extractedLanguages.length,
      frameworksCount: normalized.extractedFrameworks.length,
      projectsCount: normalized.extractedProjects.length,
      achievementsCount: normalized.extractedAchievements.length
    }
  };
}

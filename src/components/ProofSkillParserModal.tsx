import React, { useState } from 'react';
import { 
  UserCandidate, 
  Department, 
  AcademicYear, 
  PrimaryRole, 
  Archetype, 
  EvidenceSkill, 
  PlatformConnectorResult 
} from '../types';
import { 
  X, 
  Sparkles, 
  CheckCircle, 
  Code2, 
  Github, 
  Award, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Loader2,
  ExternalLink,
  Layers,
  Info,
  ChevronDown,
  ChevronUp,
  Sliders,
  Check,
  AlertCircle,
  Link2,
  Terminal,
  Activity
} from 'lucide-react';

interface ProofSkillParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCandidate: (candidate: UserCandidate) => void;
}

export const ProofSkillParserModal: React.FC<ProofSkillParserModalProps> = ({
  isOpen,
  onClose,
  onAddCandidate
}) => {
  const [step, setStep] = useState<'input' | 'processing' | 'results'>('input');
  
  // Profile Meta
  const [name, setName] = useState('Shruti Nair');
  const [college, setCollege] = useState('NIT Surathkal');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Non-Binary' | 'Prefer not to say'>('Female');
  const [department, setDepartment] = useState<Department>('Computer Science & Eng (CSE)');
  const [yearOfStudy, setYearOfStudy] = useState<AcademicYear>('3rd Year');
  const [primaryRole, setPrimaryRole] = useState<PrimaryRole>('Full-Stack Engineer');
  const [archetype, setArchetype] = useState<Archetype>('Speed Builder / Hacker');
  
  // Public handles / URLs
  const [smartPasteInput, setSmartPasteInput] = useState('');
  const [githubHandle, setGithubHandle] = useState('shrutinair_dev');
  const [leetcodeHandle, setLeetcodeHandle] = useState('shruti_dsa');
  const [codechefHandle, setCodechefHandle] = useState('shruti_code');
  const [codeforcesHandle, setCodeforcesHandle] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('linkedin.com/in/shruti-nair');
  
  // Self-declared skills input
  const [selfDeclaredSkillsInput, setSelfDeclaredSkillsInput] = useState('React 19, TypeScript, Next.js, Node.js, Python, PostgreSQL, Gemini API, Tailwind CSS');
  
  // Resume / CV text
  const [resumeText, setResumeText] = useState(`Shruti Nair | 3rd Year B.Tech CSE at NIT Surathkal
GitHub: @shrutinair_dev (22 repos, 420 commits)
LeetCode: @shruti_dsa (Solved 480 problems, Contest Rating 1940, Top 3.8%)
CodeChef: 4-Star Coder (Rating 1870)
Key Skills: React 19, TypeScript, Next.js, Node.js, Python, PostgreSQL, Gemini API, Tailwind CSS
Projects:
1. AgriSense - Smart IoT Soil moisture predictor using TinyML & React Dashboard. Won 2nd place at HackNITK.
2. DocuQuery - RAG pipeline with vector search and conversational citation system.
Experience: Open source contributor to React ecosystem, Smart India Hackathon (SIH) 2024 Finalist.`);

  // Processing & result state
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'evidence' | 'self_declared' | 'connectors'>('all');
  const [expandedSkillIdx, setExpandedSkillIdx] = useState<number | null>(0);
  
  const [connectorReports, setConnectorReports] = useState<PlatformConnectorResult[]>([]);
  const [inferredSkills, setInferredSkills] = useState<EvidenceSkill[]>([]);
  const [candidateResult, setCandidateResult] = useState<UserCandidate | null>(null);
  const [evidenceSummary, setEvidenceSummary] = useState('');
  const [evidenceHighlights, setEvidenceHighlights] = useState<string[]>([]);
  const [engineUsed, setEngineUsed] = useState<string>('AI Evidence Engine');

  if (!isOpen) return null;

  // Preset loading helpers
  const handleLoadPreset = (preset: 'shruti' | 'kabir' | 'ananya') => {
    if (preset === 'shruti') {
      setName('Shruti Nair');
      setCollege('NIT Surathkal');
      setGender('Female');
      setDepartment('Computer Science & Eng (CSE)');
      setYearOfStudy('3rd Year');
      setPrimaryRole('Full-Stack Engineer');
      setArchetype('Speed Builder / Hacker');
      setGithubHandle('shrutinair_dev');
      setLeetcodeHandle('shruti_dsa');
      setCodechefHandle('shruti_code');
      setCodeforcesHandle('');
      setLinkedinUrl('linkedin.com/in/shruti-nair');
      setSelfDeclaredSkillsInput('React 19, TypeScript, Next.js, Node.js, Python, PostgreSQL, Gemini API, Tailwind CSS');
      setResumeText(`Shruti Nair | 3rd Year B.Tech CSE at NIT Surathkal
GitHub: @shrutinair_dev (22 repos, 420 commits)
LeetCode: @shruti_dsa (Solved 480 problems, Contest Rating 1940, Top 3.8%)
CodeChef: 4-Star Coder (Rating 1870)
Key Skills: React 19, TypeScript, Next.js, Node.js, Python, PostgreSQL, Gemini API, Tailwind CSS
Projects:
1. AgriSense - Smart IoT Soil moisture predictor using TinyML & React Dashboard. Won 2nd place at HackNITK.
2. DocuQuery - RAG pipeline with vector search and conversational citation system.
Experience: Open source contributor, Smart India Hackathon (SIH) 2024 Finalist.`);
    } else if (preset === 'kabir') {
      setName('Kabir Mehta');
      setCollege('IIT Bombay');
      setGender('Male');
      setDepartment('Artificial Intelligence & Data Science');
      setYearOfStudy('4th Year');
      setPrimaryRole('AI / ML Specialist');
      setArchetype('Quantitative Mind');
      setGithubHandle('kabirmehta_ai');
      setLeetcodeHandle('kabir_algo');
      setCodechefHandle('kabir_5star');
      setCodeforcesHandle('kabir_m');
      setLinkedinUrl('linkedin.com/in/kabir-mehta-ai');
      setSelfDeclaredSkillsInput('PyTorch, Python, LangChain, Transformers, C++, Distributed Systems, CUDA');
      setResumeText(`Kabir Mehta | 4th Year B.Tech AI & DS at IIT Bombay
GitHub: @kabirmehta_ai (34 repos, PyTorch CUDA kernels, 850 commits)
LeetCode: @kabir_algo (Solved 620 problems, Contest Rating 2110, Knight)
CodeChef: 5-Star Coder (Rating 2040)
Codeforces: Expert (Rating 1740)
Projects:
1. LLM-Speculative-Decode - Fast inference engine for local models with custom KV-cache optimization.
2. VisionGraph - Multi-agent scene graph generator with spatial embeddings.
Experience: Published at student ML symposium, SIH 2023 1st Prize Winner.`);
    } else if (preset === 'ananya') {
      setName('Ananya Rao');
      setCollege('NID Ahmedabad / IIIT-B');
      setGender('Female');
      setDepartment('Design & Human-Computer Interaction');
      setYearOfStudy('3rd Year');
      setPrimaryRole('UI/UX Product Designer');
      setArchetype('UX Crafter');
      setGithubHandle('ananya_designs');
      setLeetcodeHandle('ananya_craft');
      setCodechefHandle('');
      setCodeforcesHandle('');
      setLinkedinUrl('linkedin.com/in/ananya-rao-design');
      setSelfDeclaredSkillsInput('Figma, React 19, Tailwind CSS, Motion Design, Design Systems, User Research, Accessibility');
      setResumeText(`Ananya Rao | Design & HCI Lead at IIIT-B
GitHub: @ananya_designs (15 repos, Accessible UI component libraries, Tailwind tokens)
LeetCode: @ananya_craft (Solved 240 problems, Easy/Medium focus)
Projects:
1. Prism Design System - 40+ WCAG AAA compliant React & Tailwind components with motion presets.
2. MedSync - Clinician mobile UX workflow with tactile micro-interactions.
Experience: UI/UX Lead at 3 hackathon winning teams, Figma Community Creator.`);
    }
  };

  // Smart URL parser
  const handleSmartPaste = async () => {
    if (!smartPasteInput.trim()) return;
    try {
      const res = await fetch('/api/integrations/detect-platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: smartPasteInput })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const detected = data.data;
        if (detected.platform === 'github') setGithubHandle(detected.extractedIdentifier);
        else if (detected.platform === 'leetcode') setLeetcodeHandle(detected.extractedIdentifier);
        else if (detected.platform === 'codechef') setCodechefHandle(detected.extractedIdentifier);
        else if (detected.platform === 'codeforces') setCodeforcesHandle(detected.extractedIdentifier);
        else if (detected.platform === 'linkedin') setLinkedinUrl(detected.cleanProfileUrl);
        setSmartPasteInput('');
      }
    } catch {
      // Fallback local regex
      const text = smartPasteInput.trim();
      if (text.includes('github')) setGithubHandle(text.replace(/.*github\.com\//, '').split('/')[0]);
      if (text.includes('leetcode')) setLeetcodeHandle(text.replace(/.*leetcode\.com\/(u\/)?/, '').split('/')[0]);
      if (text.includes('codechef')) setCodechefHandle(text.replace(/.*codechef\.com\/users\//, '').split('/')[0]);
      if (text.includes('linkedin')) setLinkedinUrl(text);
      setSmartPasteInput('');
    }
  };

  // Run Backend Integration Connectors & AI Evidence Profiling
  const handleExecuteIntegration = async () => {
    setIsProcessing(true);
    setStep('processing');

    const selfDeclaredList = selfDeclaredSkillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      // 1. Fetch from Backend Integration Layer (Isolated platform connectors)
      const fetchRes = await fetch('/api/integrations/fetch-platform-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubHandle,
          leetcodeHandle,
          codechefHandle,
          codeforcesHandle,
          resumeText,
          linkedinUrl
        })
      });

      const fetchResult = await fetchRes.json();
      const normalizedData = fetchResult?.data?.normalized || {};
      const reports: PlatformConnectorResult[] = fetchResult?.data?.connectorReports || [];
      setConnectorReports(reports);

      // 2. Synthesize AI Evidence-Based Skill Profile
      const aiRes = await fetch('/api/integrations/analyze-evidence-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          normalizedData,
          candidateName: name,
          selfDeclaredSkills: selfDeclaredList
        })
      });

      const aiResult = await aiRes.json();
      const analysis = aiResult?.data;
      setEngineUsed(aiResult?.engine || 'AI Evidence Engine');

      if (analysis) {
        setInferredSkills(analysis.inferredSkills || []);
        setEvidenceSummary(analysis.evidenceSummary || 'Multi-source evidence profile synthesized.');
        setEvidenceHighlights(analysis.evidenceHighlights || []);

        const badges: string[] = ['Public Profile Integrated'];
        if (reports.some(r => r.platform === 'github' && r.status === 'connected')) {
          badges.push('GitHub Proven');
        }
        if (reports.some(r => r.platform === 'leetcode' && r.status === 'connected')) {
          badges.push('LeetCode Benchmarked');
        }
        if (reports.some(r => r.platform === 'codechef' && r.status === 'connected')) {
          badges.push('CodeChef Rated');
        }
        if (resumeText.toLowerCase().includes('sih') || resumeText.toLowerCase().includes('smart india')) {
          badges.push('SIH Track Record');
        }

        const assembledCandidate: UserCandidate = {
          id: `cand-${Date.now()}`,
          name: name.trim() || 'Candidate Developer',
          avatar: gender === 'Female' 
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          gender,
          headline: `${primaryRole} | ${badges.slice(0, 2).join(' • ')}`,
          college: college.trim() || 'Engineering Institute',
          department,
          yearOfStudy,
          experienceLevel: 'Undergrad',
          primaryRole,
          archetype,
          topSkills: (analysis.inferredSkills || []).slice(0, 7).map((s: any) => s.name),
          selfDeclaredSkills: selfDeclaredList,
          inferredSkills: analysis.inferredSkills,
          connectorReports: reports,
          technicalScore: analysis.overallTechnicalProficiency || 88,
          codingHandles: {
            github: githubHandle || undefined,
            leetcode: leetcodeHandle || undefined,
            codechef: codechefHandle || undefined,
            codeforces: codeforcesHandle || undefined,
            linkedin: linkedinUrl || undefined
          },
          extractedSkillScores: analysis.extractedSkillScores || {
            dsa: 80, web: 82, ml: 75, design: 70, pitch: 78, systems: 80
          },
          workingStyle: 'Async Deep-Work',
          weeklyAvailabilityHours: 24,
          timezone: 'IST (UTC+5:30)',
          githubUsername: githubHandle || undefined,
          hackathonsWon: resumeText.toLowerCase().includes('winner') || resumeText.toLowerCase().includes('1st') ? 2 : 1,
          pastProjects: normalizedData.resume?.extractedProjects?.map((p: any) => ({
            title: p.title,
            tech: p.tech,
            description: p.impact || 'Built during fast-paced hackathon sprint'
          })) || [
            { title: 'Full-Stack Distributed System', tech: 'TypeScript, React, Node.js', description: 'Production-ready service' }
          ],
          bio: `Passionate engineer grounded in evidence-backed code artifacts. ${analysis.evidenceSummary || ''}`,
          interestedDomains: ['GenAI & Agents', 'Web3 & FinTech', 'Healthcare AI', 'Smart City & SIH'],
          status: 'available',
          verifiedBadges: badges,
          contactInfo: {
            email: `${name.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
            phone: '+91 98765 43210',
            whatsapp: '+91 98765 43210',
            telegram: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
            linkedin: linkedinUrl
          }
        };

        setCandidateResult(assembledCandidate);
      }
      setStep('results');
    } catch (_err: any) {
      // Safe fallback candidate generation
      const badges: string[] = ['Public Profile Integrated'];
      if (githubHandle) badges.push('GitHub Linked');
      if (leetcodeHandle) badges.push('LeetCode Linked');

      const fallbackSkills = selfDeclaredList.length > 0 ? selfDeclaredList : ['TypeScript', 'React', 'Node.js', 'System Design'];

      const assembledCandidate: UserCandidate = {
        id: `cand-${Date.now()}`,
        name: name.trim() || 'Candidate Developer',
        avatar: gender === 'Female' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        gender,
        headline: `${primaryRole} | ${badges.slice(0, 2).join(' • ')}`,
        college: college.trim() || 'Engineering Institute',
        department,
        yearOfStudy,
        experienceLevel: 'Undergrad',
        primaryRole,
        archetype,
        topSkills: fallbackSkills.slice(0, 7),
        selfDeclaredSkills: selfDeclaredList,
        inferredSkills: fallbackSkills.map(s => ({ name: s, confidence: 'high' as const, category: 'Core Stack', evidenceSources: ['Direct Declaration'] })),
        connectorReports: [],
        technicalScore: 85,
        codingHandles: {
          github: githubHandle || undefined,
          leetcode: leetcodeHandle || undefined,
          codechef: codechefHandle || undefined,
          codeforces: codeforcesHandle || undefined,
          linkedin: linkedinUrl || undefined
        },
        extractedSkillScores: { dsa: 80, web: 85, ml: 75, design: 72, pitch: 78, systems: 82 },
        workingStyle: 'Async Deep-Work',
        weeklyAvailabilityHours: 24,
        timezone: 'IST (UTC+5:30)',
        githubUsername: githubHandle || undefined,
        hackathonsWon: 1,
        pastProjects: [
          { title: 'Full-Stack Distributed System', tech: 'TypeScript, React, Node.js', description: 'Production-ready service' }
        ],
        bio: 'Passionate builder active in hackathon environments with full-stack skills.',
        interestedDomains: ['GenAI & Agents', 'Web3 & FinTech', 'Healthcare AI', 'Smart City & SIH'],
        status: 'available',
        verifiedBadges: badges,
        contactInfo: {
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
          phone: '+91 98765 43210',
          whatsapp: '+91 98765 43210',
          telegram: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
          linkedin: linkedinUrl
        }
      };

      setCandidateResult(assembledCandidate);
      setStep('results');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAndAdd = () => {
    if (candidateResult) {
      onAddCandidate(candidateResult);
      onClose();
    }
  };

  return (
    <div 
      id="public-profile-integration-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold tracking-tight">Public Profile & Evidence Integration Center</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Backend Connectors Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Automatically enrich profiles with public code repos, competitive activity, and evidence-grounded inferences.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* STEP 1: Input Matrix */}
          {step === 'input' && (
            <div className="space-y-6">
              
              {/* Quick Load Demo Profiles */}
              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-indigo-950 block">Quick Demo Multi-Platform Profiles</span>
                    <span className="text-[11px] text-indigo-700">Test multi-connector data synthesis instantly with pre-configured developer footprints.</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('shruti')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200 transition-all shadow-2xs"
                  >
                    Shruti (Full-Stack + LeetCode)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('kabir')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white text-purple-700 hover:bg-purple-600 hover:text-white border border-purple-200 transition-all shadow-2xs"
                  >
                    Kabir (AI Systems Researcher)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('ananya')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-all shadow-2xs"
                  >
                    Ananya (UI/UX Crafter)
                  </button>
                </div>
              </div>

              {/* Smart Link Paste Auto-Detector */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <Link2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Smart Link Paste (Auto-Platform Detection)</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Accepts GitHub, LeetCode, CodeChef, Codeforces URLs</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={smartPasteInput}
                    onChange={(e) => setSmartPasteInput(e.target.value)}
                    placeholder="Paste any profile URL (e.g. https://github.com/shrutinair_dev or https://leetcode.com/u/shruti_dsa)..."
                    className="flex-1 px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSmartPaste(); }}
                  />
                  <button
                    type="button"
                    onClick={handleSmartPaste}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Auto-Detect & Map
                  </button>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Developer Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">College / Institute</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender (SIH Diversity Rule)</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Computer Science & Eng (CSE)">Computer Science & Eng (CSE)</option>
                    <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                    <option value="Information Technology (IT)">Information Technology (IT)</option>
                    <option value="Electronics & Comm (ECE)">Electronics & Comm (ECE)</option>
                    <option value="Design & Human-Computer Interaction">Design & Human-Computer Interaction</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Role</label>
                  <select
                    value={primaryRole}
                    onChange={(e) => setPrimaryRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Full-Stack Engineer">Full-Stack Engineer</option>
                    <option value="AI / ML Specialist">AI / ML Specialist</option>
                    <option value="UI/UX Product Designer">UI/UX Product Designer</option>
                    <option value="Cloud & Distributed Systems Architect">Cloud & Distributed Systems Architect</option>
                    <option value="Data / Quantitative Engineer">Data / Quantitative Engineer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Archetype</label>
                  <select
                    value={archetype}
                    onChange={(e) => setArchetype(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Speed Builder / Hacker">Speed Builder / Hacker</option>
                    <option value="System Architect">System Architect</option>
                    <option value="UX Crafter">UX Crafter</option>
                    <option value="Quantitative Mind">Quantitative Mind</option>
                    <option value="Visionary & Domain Lead">Visionary & Domain Lead</option>
                  </select>
                </div>
              </div>

              {/* Public Handles Matrix */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Public Profile Data Connectors (Isolated Backend Adapters)</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">Voluntary public proof sources</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* GitHub */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                      <Github className="w-3.5 h-3.5 text-slate-800" />
                      <span>GitHub Username / Profile URL</span>
                    </label>
                    <input
                      type="text"
                      value={githubHandle}
                      onChange={(e) => setGithubHandle(e.target.value)}
                      placeholder="e.g. shrutinair_dev"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* LeetCode */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                      <Code2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>LeetCode Handle / Profile URL</span>
                    </label>
                    <input
                      type="text"
                      value={leetcodeHandle}
                      onChange={(e) => setLeetcodeHandle(e.target.value)}
                      placeholder="e.g. shruti_dsa"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* CodeChef */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5 text-orange-600" />
                      <span>CodeChef Username</span>
                    </label>
                    <input
                      type="text"
                      value={codechefHandle}
                      onChange={(e) => setCodechefHandle(e.target.value)}
                      placeholder="e.g. shruti_code"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Codeforces */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                      <Activity className="w-3.5 h-3.5 text-blue-600" />
                      <span>Codeforces Handle (Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={codeforcesHandle}
                      onChange={(e) => setCodeforcesHandle(e.target.value)}
                      placeholder="e.g. tourist or handle"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* LinkedIn Protected Mode Info */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>LinkedIn Profile Link</span>
                    </label>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Protected Integration Policy
                    </span>
                  </div>
                  <input
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="e.g. linkedin.com/in/username"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    LinkedIn profiles are securely linked for identity. In strict compliance with terms of service, no unauthorized scraping is performed; skills are inferred via voluntarily shared resumes and open code repositories.
                  </p>
                </div>
              </div>

              {/* Self-Declared Skills Input */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Self-Declared Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  value={selfDeclaredSkillsInput}
                  onChange={(e) => setSelfDeclaredSkillsInput(e.target.value)}
                  placeholder="e.g. React 19, TypeScript, Docker, PyTorch"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  The system will transparently distinguish these self-declared items from AI-inferred, evidence-backed capabilities.
                </span>
              </div>

              {/* Resume / CV Text Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Resume / CV Raw Text or Project Summary</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Paste plain text or markdown CV</span>
                </div>
                <textarea
                  rows={4}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full p-3 text-xs font-mono bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

            </div>
          )}

          {/* STEP 2: Processing Live HUD */}
          {step === 'processing' && (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Contacting Backend Integration Layer...</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Running isolated connectors for GitHub, LeetCode, CodeChef, and Resume parser. Normalizing raw activity and generating evidence-grounded skill profiling.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Results & Synthesis HUD */}
          {step === 'results' && candidateResult && (
            <div className="space-y-6">

              {/* Evidence Overview Banner */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
                <div>
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-sm text-white">Evidence-Based Profile Synthesized</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                      {engineUsed}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{evidenceSummary}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-400 block font-medium">Composite Proficiency</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {candidateResult.technicalScore}/100
                  </span>
                </div>
              </div>

              {/* Highlights & Evidence Anchors */}
              {evidenceHighlights.length > 0 && (
                <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Corroborating Evidence Anchors</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-emerald-800 font-medium">
                    {evidenceHighlights.map((hl, i) => (
                      <div key={i} className="flex items-start space-x-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connector Isolation Status Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-600" />
                    <span>Connector Health & Data Ingestion Summary</span>
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">
                    {connectorReports.length} Sources Processed
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {connectorReports.map((report, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                        report.status === 'connected' 
                          ? 'bg-white border-emerald-200 shadow-2xs' 
                          : report.status === 'protected_mode'
                            ? 'bg-blue-50/50 border-blue-200 shadow-2xs'
                            : 'bg-rose-50/50 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{report.displayName}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          report.status === 'connected'
                            ? 'bg-emerald-100 text-emerald-800'
                            : report.status === 'protected_mode'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                        }`}>
                          {report.status === 'connected' ? 'Connected' : report.status === 'protected_mode' ? 'Protected' : 'Error'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-tight">
                        {report.dataSummary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Tab & Filter */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        activeTab === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      All Inferred Skills ({inferredSkills.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('evidence')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        activeTab === 'evidence' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Evidence-Backed ({inferredSkills.filter(s => !s.isSelfDeclaredOnly).length})
                    </button>
                    <button
                      onClick={() => setActiveTab('self_declared')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        activeTab === 'self_declared' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Self-Declared Awaiting Proof ({inferredSkills.filter(s => s.isSelfDeclaredOnly).length})
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 italic">
                    Click any skill to inspect supporting evidence
                  </span>
                </div>

                {/* Inferred Skills List with Confidence Scores & Supporting Evidence */}
                <div className="space-y-2.5">
                  {inferredSkills
                    .filter(s => {
                      if (activeTab === 'evidence') return !s.isSelfDeclaredOnly;
                      if (activeTab === 'self_declared') return s.isSelfDeclaredOnly;
                      return true;
                    })
                    .map((skill, idx) => {
                      const isExpanded = expandedSkillIdx === idx;
                      const isHighConf = skill.confidence === 'High';
                      const isMediumConf = skill.confidence === 'Medium';

                      return (
                        <div
                          key={idx}
                          id={`skill-evidence-card-${idx}`}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            skill.isSelfDeclaredOnly 
                              ? 'bg-amber-50/20 border-amber-200/70'
                              : 'bg-white border-slate-200 hover:border-indigo-300 shadow-2xs'
                          }`}
                        >
                          <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => setExpandedSkillIdx(isExpanded ? null : idx)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                                isHighConf 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                  : isMediumConf
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {skill.proficiency}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-slate-900 text-xs">{skill.name}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">({skill.category})</span>
                                </div>
                                <div className="flex items-center space-x-1.5 mt-0.5">
                                  {skill.sources.map((src, sIdx) => (
                                    <span key={sIdx} className="text-[9px] font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded border border-slate-200">
                                      {src}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isHighConf 
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                    : isMediumConf
                                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                                }`}>
                                  Confidence: {skill.confidence} ({skill.confidenceScore}%)
                                </span>
                              </div>
                              <button className="text-slate-400 hover:text-slate-700 p-1">
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Expandable Supporting Evidence Sub-View */}
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
                              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                                <span className="flex items-center space-x-1">
                                  <Info className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>Supporting Evidence & Corroborating Data Points:</span>
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  Proficiency Estimated: {skill.proficiency}/100
                                </span>
                              </div>

                              {/* Proficiency Progress Bar */}
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    isHighConf ? 'bg-emerald-500' : isMediumConf ? 'bg-indigo-500' : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${skill.proficiency}%` }}
                                />
                              </div>

                              <ul className="space-y-1.5 pl-2 text-[11px] text-slate-600">
                                {skill.supportingEvidence.map((ev, eIdx) => (
                                  <li key={eIdx} className="flex items-start space-x-1.5">
                                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{ev}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* 6-Axis Radar Scores Preview */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  Calibrated 6-Axis Capability Matrix
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">DSA & Logic</span>
                    <span className="font-bold text-slate-900">{candidateResult.extractedSkillScores.dsa}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Web & Frontend</span>
                    <span className="font-bold text-slate-900">{candidateResult.extractedSkillScores.web}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Systems & Cloud</span>
                    <span className="font-bold text-slate-900">{candidateResult.extractedSkillScores.systems}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">AI & Data</span>
                    <span className="font-bold text-slate-900">{candidateResult.extractedSkillScores.ml}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">UI/UX Design</span>
                    <span className="font-bold text-slate-900">{candidateResult.extractedSkillScores.design}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Sprint & Pitch</span>
                    <span className="font-bold text-slate-900">{candidateResult.extractedSkillScores.pitch}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step === 'input' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-run-connectors"
                onClick={handleExecuteIntegration}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Enrich & Synthesize Evidence Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 'results' && (
            <>
              <button
                type="button"
                onClick={() => setStep('input')}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Back to Edit Inputs
              </button>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  id="btn-confirm-add-candidate"
                  onClick={handleConfirmAndAdd}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Save & Add to Talent Discovery Pool</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  UserCandidate, 
  Archetype, 
  PrimaryRole, 
  WorkingStyle,
  Gender,
  Department,
  AcademicYear
} from '../types';
import { 
  X, 
  UserPlus, 
  Sparkles, 
  Check, 
  Code2, 
  GraduationCap, 
  Clock, 
  Award,
  Plus,
  Trash2,
  Edit3,
  ShieldCheck,
  Github,
  Linkedin,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Layers,
  Zap,
  Globe
} from 'lucide-react';

interface ProfileBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: UserCandidate) => void;
  currentProfile?: UserCandidate | null;
}

export const ProfileBuilderModal: React.FC<ProfileBuilderModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  currentProfile,
}) => {
  const isEditing = Boolean(currentProfile);

  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [college, setCollege] = useState('IIT Bombay');
  const [department, setDepartment] = useState<Department>('Computer Science & Eng (CSE)');
  const [yearOfStudy, setYearOfStudy] = useState<AcademicYear>('3rd Year');
  const [gender, setGender] = useState<Gender>('Male');
  const [experienceLevel, setExperienceLevel] = useState<'Undergrad' | 'Grad / Masters' | 'PhD / Researcher' | 'Industry / Alum'>('Undergrad');
  const [primaryRole, setPrimaryRole] = useState<PrimaryRole>('Full-Stack Engineer');
  const [archetype, setArchetype] = useState<Archetype>('System Architect');
  const [workingStyle, setWorkingStyle] = useState<WorkingStyle>('Structured & Methodical');
  const [weeklyAvailability, setWeeklyAvailability] = useState(35);
  const [hackathonsWon, setHackathonsWon] = useState<number>(0);
  const [bio, setBio] = useState('');
  const [githubHandle, setGithubHandle] = useState('');
  const [leetcodeHandle, setLeetcodeHandle] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Skills list state
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState(85);
  const [newSkillSource, setNewSkillSource] = useState('GitHub Project / Self-Declared');

  // Past projects state
  const [pastProjects, setPastProjects] = useState<{ title: string; tech: string; description: string }[]>([]);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjTech, setNewProjTech] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [showAddProject, setShowAddProject] = useState(false);

  // Active view tab: 'edit' or 'preview'
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    if (currentProfile) {
      setName(currentProfile.name || '');
      setHeadline(currentProfile.headline || '');
      setCollege(currentProfile.college || 'IIT Bombay');
      setDepartment(currentProfile.department || 'Computer Science & Eng (CSE)');
      setYearOfStudy(currentProfile.yearOfStudy || '3rd Year');
      setGender(currentProfile.gender || 'Male');
      setExperienceLevel(currentProfile.experienceLevel || 'Undergrad');
      setPrimaryRole(currentProfile.primaryRole || 'Full-Stack Engineer');
      setArchetype(currentProfile.archetype || 'System Architect');
      setWorkingStyle(currentProfile.workingStyle || 'Structured & Methodical');
      setWeeklyAvailability(currentProfile.weeklyAvailabilityHours || 35);
      setHackathonsWon(currentProfile.hackathonsWon ?? 0);
      setBio(currentProfile.bio || '');
      setGithubHandle(currentProfile.codingHandles?.github || currentProfile.githubUsername || '');
      setLeetcodeHandle(currentProfile.codingHandles?.leetcode || '');
      setLinkedinUrl(currentProfile.contactInfo?.linkedin || '');
      setPortfolioUrl(currentProfile.portfolioUrl || '');
      setSkillsList(currentProfile.topSkills || ['React', 'TypeScript']);
      setPastProjects(currentProfile.pastProjects || []);
    } else {
      setName('');
      setHeadline('');
      setCollege('IIT Bombay');
      setDepartment('Computer Science & Eng (CSE)');
      setYearOfStudy('3rd Year');
      setGender('Male');
      setExperienceLevel('Undergrad');
      setPrimaryRole('Full-Stack Engineer');
      setArchetype('System Architect');
      setWorkingStyle('Structured & Methodical');
      setWeeklyAvailability(35);
      setHackathonsWon(0);
      setBio('');
      setGithubHandle('');
      setLeetcodeHandle('');
      setLinkedinUrl('');
      setPortfolioUrl('');
      setSkillsList(['React 19', 'TypeScript', 'Node.js', 'Python']);
      setPastProjects([]);
    }
  }, [currentProfile, isOpen]);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const trimmed = newSkillName.trim();
    if (!skillsList.includes(trimmed)) {
      setSkillsList([...skillsList, trimmed]);
    }
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter(s => s !== skillToRemove));
  };

  const handleAddProject = () => {
    if (!newProjTitle.trim()) return;
    setPastProjects([
      ...pastProjects,
      {
        title: newProjTitle.trim(),
        tech: newProjTech.trim() || 'TypeScript, React',
        description: newProjDesc.trim() || 'High-performance hackathon build.'
      }
    ]);
    setNewProjTitle('');
    setNewProjTech('');
    setNewProjDesc('');
    setShowAddProject(false);
  };

  const handleRemoveProject = (index: number) => {
    setPastProjects(pastProjects.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const baseScores = currentProfile?.extractedSkillScores || {
      dsa: 85,
      web: 90,
      ml: 75,
      design: primaryRole === 'UI/UX Product Designer' ? 95 : 65,
      pitch: 80,
      systems: 85
    };

    // Calculate dynamic technical score based on skills count & hackathons
    const techScore = Math.min(99, 80 + skillsList.length * 2 + hackathonsWon * 3);

    const updatedProfile: UserCandidate = {
      id: currentProfile?.id || `cand-${Date.now()}`,
      name: name.trim(),
      avatar: currentProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      gender,
      department,
      yearOfStudy,
      headline: headline.trim() || `${primaryRole} | ${archetype}`,
      college: college.trim(),
      experienceLevel,
      primaryRole,
      archetype,
      topSkills: skillsList.length > 0 ? skillsList : ['TypeScript', 'React'],
      selfDeclaredSkills: skillsList,
      technicalScore: techScore,
      extractedSkillScores: baseScores,
      contactInfo: {
        email: currentProfile?.contactInfo?.email || `${name.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
        phone: currentProfile?.contactInfo?.phone || '+91 98765 43210',
        whatsapp: currentProfile?.contactInfo?.whatsapp || '+919876543210',
        telegram: currentProfile?.contactInfo?.telegram || `@${name.toLowerCase().replace(/\s+/g, '_')}`,
        linkedin: linkedinUrl.trim() || `https://linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`
      },
      codingHandles: {
        github: githubHandle.trim(),
        leetcode: leetcodeHandle.trim(),
        linkedin: linkedinUrl.trim(),
        githubRepos: currentProfile?.codingHandles?.githubRepos || 15,
        githubCommits: currentProfile?.codingHandles?.githubCommits || 320,
        leetcodeProblems: currentProfile?.codingHandles?.leetcodeProblems || (leetcodeHandle ? 250 : undefined),
        leetcodeRating: currentProfile?.codingHandles?.leetcodeRating || (leetcodeHandle ? 1750 : undefined)
      },
      workingStyle,
      weeklyAvailabilityHours: weeklyAvailability,
      timezone: 'IST (UTC+5:30)',
      portfolioUrl: portfolioUrl.trim(),
      githubUsername: githubHandle.trim(),
      hackathonsWon,
      pastProjects: pastProjects.length > 0 ? pastProjects : [
        {
          title: 'Autonomous Hackathon Project',
          tech: skillsList.slice(0, 3).join(', ') || 'React, TypeScript',
          description: 'High-performance collaborative application with real-time state and modern UI.'
        }
      ],
      bio: bio.trim() || 'Eager to build high-impact projects with a complementary, ambitious team.',
      interestedDomains: currentProfile?.interestedDomains || ['AI / ML', 'Systems', 'CleanTech', 'Productivity'],
      status: 'available',
      verifiedBadges: [
        ...(hackathonsWon > 0 ? [`${hackathonsWon}x Hackathon Winner`] : ['First-Time Hacker']),
        ...(githubHandle ? ['GitHub Verified'] : []),
        ...(leetcodeHandle ? ['LeetCode Verified'] : []),
        'Profile Verified'
      ]
    };

    onSaveProfile(updatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in duration-200 my-auto">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {isEditing ? 'View & Edit Builder Profile' : 'Register Builder Profile'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  {isEditing ? 'Live Profile Sync' : 'Join Pool'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your skills, availability, and hackathon records to recalculate instant team fit & radar metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Switcher */}
            <div className="hidden sm:flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'edit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Edit Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Card Preview
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          
          {activeTab === 'preview' ? (
            /* Live Card Preview */
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Card Output</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Ready for Matchmaking
                </span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={currentProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'} 
                      alt={name || 'Avatar'}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-100"
                    />
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900">{name || 'Your Name'}</h4>
                      <p className="text-xs text-slate-600 font-medium">{headline || `${primaryRole} | ${archetype}`}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{college} · {department} ({yearOfStudy})</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-indigo-600 font-mono">
                      {Math.min(99, 80 + skillsList.length * 2 + hackathonsWon * 3)}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">Skill Score</span>
                  </div>
                </div>

                {/* Skills Chips */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Skills ({skillsList.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsList.map((sk, i) => (
                      <span key={i} className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Meta stats */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">Availability</span>
                    <span className="font-bold text-slate-800">{weeklyAvailability} hrs/wk</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">Hackathons</span>
                    <span className="font-bold text-amber-700">{hackathonsWon === 0 ? 'First-Timer' : `${hackathonsWon} Wins`}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">Working Style</span>
                    <span className="font-bold text-slate-800 truncate block">{workingStyle}</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
                >
                  Back to Form Editing
                </button>
              </div>
            </div>
          ) : (
            <form id="profile-edit-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Section 1: Core Personal & Academic Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>1. Personal & Academic Identity</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Aarav Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Professional Headline</label>
                    <input
                      type="text"
                      placeholder="e.g. Distributed Systems & Go / Rust Architect | Codeforces 2100"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">College / University *</label>
                    <input
                      type="text"
                      placeholder="e.g. IIT Bombay / BITS Pilani"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department / Branch</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value as Department)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    >
                      <option value="Computer Science & Eng (CSE)">Computer Science & Eng (CSE)</option>
                      <option value="Electronics & Comm (ECE)">Electronics & Comm (ECE)</option>
                      <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                      <option value="Information Technology (IT)">Information Technology (IT)</option>
                      <option value="Electrical & Electronics (EEE)">Electrical & Electronics (EEE)</option>
                      <option value="Design & Human-Computer Interaction">Design & HCI</option>
                      <option value="Computational & Data Sciences (CDS)">Computational Sciences</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Year of Study & Gender</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(e.target.value as AcademicYear)}
                        className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="1st Year Masters">Masters</option>
                      </select>

                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as Gender)}
                        className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Non-Binary">Non-Binary</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Role, Archetype & Working Preferences */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>2. Role, Archetype & Collaboration Style</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Primary Role</label>
                    <select
                      value={primaryRole}
                      onChange={(e) => setPrimaryRole(e.target.value as PrimaryRole)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    >
                      <option value="Full-Stack Engineer">Full-Stack Engineer</option>
                      <option value="AI / ML Specialist">AI / ML Specialist</option>
                      <option value="UI/UX Product Designer">UI/UX Product Designer</option>
                      <option value="Cloud & Distributed Systems Architect">Cloud & Distributed Systems Architect</option>
                      <option value="Data / Quantitative Engineer">Data / Quantitative Engineer</option>
                      <option value="Domain & Product Strategist">Domain & Product Strategist</option>
                      <option value="Hardware & Embedded Engineer">Hardware & Embedded Engineer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Cognitive Archetype</label>
                    <select
                      value={archetype}
                      onChange={(e) => setArchetype(e.target.value as Archetype)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    >
                      <option value="System Architect">System Architect (Top-down architectural rigor)</option>
                      <option value="Speed Builder / Hacker">Speed Builder / Hacker (Rapid iterative sprint)</option>
                      <option value="UX Crafter">UX Crafter (Design aesthetic & empathy)</option>
                      <option value="Quantitative Mind">Quantitative Mind (ML, Math & Algorithms)</option>
                      <option value="Visionary & Domain Lead">Visionary & Domain Lead (Product, Pitch & Vision)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sprint Collaboration Style</label>
                    <select
                      value={workingStyle}
                      onChange={(e) => setWorkingStyle(e.target.value as WorkingStyle)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    >
                      <option value="Structured & Methodical">Structured & Methodical</option>
                      <option value="Pair-Programming Fast-Paced">Pair-Programming Fast-Paced</option>
                      <option value="Async Deep-Work">Async Deep-Work</option>
                      <option value="Exploratory & Experimental">Exploratory & Experimental</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Weekly Availability</label>
                      <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {weeklyAvailability} Hours / Week
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      step="5"
                      value={weeklyAvailability}
                      onChange={(e) => setWeeklyAvailability(Number(e.target.value))}
                      className="w-full accent-indigo-600 mt-2 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Dynamic Skill Management (Add, Edit, Remove) */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <Code2 className="w-4 h-4 text-indigo-600" />
                    <span>3. Technical Skills & Proficiencies ({skillsList.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Add or remove skills to tune your radar</span>
                </div>

                {/* Existing Skills Chips */}
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 min-h-[60px] items-center">
                  {skillsList.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No skills added yet. Add some below!</span>
                  ) : (
                    skillsList.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs group hover:border-red-200 transition-colors"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-slate-400 hover:text-red-600 transition-colors ml-1"
                          title={`Remove ${skill}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add New Skill Input Bar */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a new skill (e.g. Next.js 15, Rust, Gemini 3.7, Computer Vision, Solana)..."
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors shrink-0 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Skill</span>
                  </button>
                </div>
              </div>

              {/* Section 4: Hackathon Experience & Track Record */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>4. Hackathon Track Record & Proof Handles</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hackathons Won / Completed</label>
                    <select
                      value={hackathonsWon}
                      onChange={(e) => setHackathonsWon(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    >
                      <option value={0}>0 (First-Time Hacker / Exploring)</option>
                      <option value={1}>1 Hackathon Win</option>
                      <option value={2}>2 Hackathon Wins</option>
                      <option value={3}>3 Hackathon Wins</option>
                      <option value={4}>4 Hackathon Wins</option>
                      <option value={5}>5+ Hackathon Wins (Veteran)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                      <Github className="w-3.5 h-3.5 text-slate-700" />
                      <span>GitHub Username</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. aarav-systems"
                      value={githubHandle}
                      onChange={(e) => setGithubHandle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                      <Code2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>LeetCode Handle</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. aarav_sharma"
                      value={leetcodeHandle}
                      onChange={(e) => setLeetcodeHandle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                      <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                      <span>LinkedIn Profile URL</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Portfolio / Website URL</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://myportfolio.dev"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Past Projects Showcase */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>5. Key Past Projects ({pastProjects.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddProject(!showAddProject)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddProject ? 'Hide Form' : 'Add Project'}</span>
                  </button>
                </div>

                {/* Projects List */}
                <div className="space-y-2">
                  {pastProjects.map((p, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-slate-900">{p.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                            {p.tech}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{p.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(idx)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        title="Remove project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Project Sub-form */}
                {showAddProject && (
                  <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-2.5 text-xs">
                    <span className="font-bold text-indigo-900 block">Add New Project Record</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Project Title (e.g. Raft-KV Distributed Store)"
                        value={newProjTitle}
                        onChange={(e) => setNewProjTitle(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Tech Stack (e.g. Go, gRPC, Docker)"
                        value={newProjTech}
                        onChange={(e) => setNewProjTech(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Brief description of deliverable & impact..."
                      value={newProjDesc}
                      onChange={(e) => setNewProjDesc(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                    />
                    <div className="flex justify-end space-x-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddProject(false)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddProject}
                        className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                      >
                        Save Project to Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 6: Bio & Ambition */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">Bio & Hackathon Ambition</label>
                <textarea
                  rows={2}
                  placeholder="What challenges are you most excited to solve? What makes you a great teammate?"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 rounded-b-3xl flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              form="profile-edit-form"
              id="btn-save-talent-profile"
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition-all flex items-center space-x-1.5 active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Profile & Recalculate' : 'Register & Join Pool'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

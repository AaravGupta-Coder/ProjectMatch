import React, { useState } from 'react';
import { 
  UserCandidate, 
  PrimaryRole, 
  Archetype,
  AcademicYear
} from '../types';
import { INITIAL_CANDIDATES } from '../data/seedData';
import { 
  Sparkles, 
  Users, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Github, 
  Code2, 
  Award, 
  UserCheck,
  ChevronRight,
  TrendingUp,
  Sliders,
  LogIn
} from 'lucide-react';

export type UserIntent = 'join' | 'create';

interface LandingPageProps {
  onLoginAndProceed: (user: UserCandidate, intent: UserIntent) => void;
  initialUser?: UserCandidate;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginAndProceed,
  initialUser = INITIAL_CANDIDATES[1] // Default Diya Sen (UX Crafter)
}) => {
  // Step 1: User Profile state
  const [selectedDemoUser, setSelectedDemoUser] = useState<string>(initialUser.id);
  const [name, setName] = useState(initialUser.name);
  const [email, setEmail] = useState(initialUser.contactInfo?.email || 'diya.sen@bits.ac.in');
  const [college, setCollege] = useState(initialUser.college);
  const [department, setDepartment] = useState(initialUser.department);
  const [yearOfStudy, setYearOfStudy] = useState<AcademicYear>(initialUser.yearOfStudy || '3rd Year');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say'>(initialUser.gender || 'Female');
  const [primaryRole, setPrimaryRole] = useState<PrimaryRole>(initialUser.primaryRole);
  const [archetype, setArchetype] = useState<Archetype>(initialUser.archetype);
  const [skillsString, setSkillsString] = useState(initialUser.topSkills.join(', '));
  const [weeklyHours, setWeeklyHours] = useState<number>(initialUser.weeklyAvailabilityHours);
  const [experienceLevel, setExperienceLevel] = useState<string>(initialUser.experienceLevel || 'Undergrad');
  const [bio, setBio] = useState(initialUser.bio);
  const [github, setGithub] = useState(initialUser.githubUsername || 'diyasen');
  const [avatar, setAvatar] = useState(initialUser.avatar);

  // Step 2: Intent state
  const [intent, setIntent] = useState<UserIntent>('join');
  const [step, setStep] = useState<'details' | 'intent'>('details');

  // Handle Quick Demo Persona Preset Click
  const handleSelectPreset = (candidate: UserCandidate) => {
    setSelectedDemoUser(candidate.id);
    setName(candidate.name);
    setEmail(candidate.contactInfo?.email || `${candidate.name.toLowerCase().replace(' ', '.')}@university.edu`);
    setCollege(candidate.college);
    setDepartment(candidate.department);
    setYearOfStudy(candidate.yearOfStudy || '3rd Year');
    setGender(candidate.gender);
    setPrimaryRole(candidate.primaryRole);
    setArchetype(candidate.archetype);
    setSkillsString(candidate.topSkills.join(', '));
    setWeeklyHours(candidate.weeklyAvailabilityHours);
    setExperienceLevel(candidate.experienceLevel || 'Undergrad');
    setBio(candidate.bio);
    setGithub(candidate.githubUsername || '');
    setAvatar(candidate.avatar);
  };

  const handleProceedToIntent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep('intent');
  };

  const handleFinalSubmit = () => {
    const existing = INITIAL_CANDIDATES.find(c => c.id === selectedDemoUser);

    const finalUser: UserCandidate = {
      id: selectedDemoUser || `user-${Date.now()}`,
      name: name.trim(),
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      gender: gender as any,
      headline: `${primaryRole} | ${archetype} at ${college}`,
      college: college.trim(),
      department: department as any,
      yearOfStudy,
      experienceLevel: existing?.experienceLevel || 'Undergrad',
      primaryRole,
      archetype,
      topSkills: skillsString.split(',').map(s => s.trim()).filter(Boolean),
      technicalScore: existing?.technicalScore || 88,
      extractedSkillScores: existing?.extractedSkillScores || { dsa: 80, web: 92, ml: 75, design: 95, pitch: 88, systems: 78 },
      workingStyle: existing?.workingStyle || 'Pair-Programming Fast-Paced',
      weeklyAvailabilityHours: weeklyHours,
      timezone: 'IST (UTC+5:30)',
      githubUsername: github.trim().replace('https://github.com/', ''),
      hackathonsWon: existing?.hackathonsWon || 1,
      pastProjects: existing?.pastProjects || [
        { title: 'Project Echo', tech: 'React, Tailwind, Node', description: 'Real-time collaborative design app' }
      ],
      bio: bio.trim(),
      interestedDomains: existing?.interestedDomains || ['HealthTech', 'FinTech', 'AI Systems'],
      status: 'available',
      verifiedBadges: ['Verified Builder', 'Proof of Work'],
      contactInfo: {
        email: email.trim(),
        phone: existing?.contactInfo?.phone || '+91 98765 00000',
        whatsapp: existing?.contactInfo?.whatsapp || '+919876500000',
        telegram: existing?.contactInfo?.telegram || `@${name.toLowerCase().replace(/\s+/g, '_')}`,
        linkedin: existing?.contactInfo?.linkedin || `linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '')}`
      }
    };

    onLoginAndProceed(finalUser, intent);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-extrabold text-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">SynergyOS</span>
                <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">v2.5 Matchmaker</span>
              </div>
              <p className="text-[11px] text-slate-400">Intelligent Hackathon Team Formation & Synergy Simulator</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Multi-Hackathon Verified</span>
            </div>
            {step === 'intent' && (
              <button
                onClick={() => setStep('details')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                ← Edit Profile Details
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12 flex-1 w-full flex flex-col justify-center">
        
        {/* STEP 1: Enter Details & Log In */}
        {step === 'details' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Hero Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Step 1 of 2: Authenticate & Build Your Hacker Profile</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Find Your Dream Squad. <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
                  Calculate Live Synergy Before You Commit.
                </span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Enter your details to generate your verified skills vector, test team chemistry deltas, and discover open hackathon squads.
              </p>
            </div>

            {/* Quick Demo Persona Picker */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 max-w-4xl mx-auto shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  <span>Quick Login with Sample Profiles (1-Click Fill)</span>
                </span>
                <span className="text-[11px] text-slate-500">Or enter custom details below</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {INITIAL_CANDIDATES.slice(0, 4).map((c) => {
                  const isSelected = selectedDemoUser === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectPreset(c)}
                      className={`p-3 rounded-2xl text-left border transition-all flex items-center space-x-3 ${
                        isSelected
                          ? 'bg-indigo-950/80 border-indigo-500 shadow-md shadow-indigo-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={c.avatar}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{c.name}</h4>
                        <p className="text-[10px] text-indigo-300 truncate">{c.primaryRole}</p>
                        <p className="text-[9px] text-slate-400 truncate">{c.archetype}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comprehensive Details Form */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl">
              <form onSubmit={handleProceedToIntent} className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Your Builder Identity</h3>
                    <p className="text-xs text-slate-400">This data powers our 6-axis synergy simulation & gap matching algorithm.</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                    Ready to Connect
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Diya Sen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. diya.sen@bits.ac.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* College / Institution */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">College / Institution</label>
                    <input
                      type="text"
                      placeholder="e.g. BITS Pilani, Goa Campus"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* Department & Gender */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-300">Department / Branch</label>
                      <input
                        type="text"
                        placeholder="e.g. Design / CS"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-300">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other / Non-Binary</option>
                      </select>
                    </div>
                  </div>

                  {/* Primary Role */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Primary Role</label>
                    <select
                      value={primaryRole}
                      onChange={(e) => setPrimaryRole(e.target.value as PrimaryRole)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="UI/UX Product Designer">UI/UX Product Designer</option>
                      <option value="Full-Stack Engineer">Full-Stack Engineer</option>
                      <option value="AI / ML Specialist">AI / ML Specialist</option>
                      <option value="Hardware & Embedded Engineer">Hardware & Embedded Engineer</option>
                      <option value="Domain & Product Strategist">Domain & Product Strategist</option>
                      <option value="Mobile & Cross-Platform Engineer">Mobile & Cross-Platform Engineer</option>
                    </select>
                  </div>

                  {/* Archetype */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Builder Archetype</label>
                    <select
                      value={archetype}
                      onChange={(e) => setArchetype(e.target.value as Archetype)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="UX Crafter">UX Crafter (Design systems, micro-interactions, judge appeal)</option>
                      <option value="Speed Builder / Hacker">Speed Builder / Hacker (Fast scaffolding, 48h velocity)</option>
                      <option value="System Architect">System Architect (Data pipelines, state machines, scale)</option>
                      <option value="Quantitative Mind">Quantitative Mind (ML models, math, data analysis)</option>
                      <option value="Visionary & Domain Lead">Visionary & Domain Lead (Roadmap, pitches, QA)</option>
                    </select>
                  </div>

                  {/* Top Skills */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="font-bold text-slate-300">Top Skills (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Figma, React 19, Tailwind CSS, Motion UI, Design Systems"
                      value={skillsString}
                      onChange={(e) => setSkillsString(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* Weekly Hours & Experience Level */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Weekly Availability</label>
                    <select
                      value={weeklyHours}
                      onChange={(e) => setWeeklyHours(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value={15}>15 hrs/week (Part-time)</option>
                      <option value={25}>25 hrs/week (Active)</option>
                      <option value={35}>35 hrs/week (Sprint mode)</option>
                      <option value={45}>45 hrs/week (All-in crunch)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Experience Track Record</label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="National Finalist">National Finalist / Winner (Multiple podiums)</option>
                      <option value="Advanced">Advanced (3+ Hackathons shipped)</option>
                      <option value="Intermediate">Intermediate (1-2 Hackathons)</option>
                      <option value="Beginner">First Time Hacker</option>
                    </select>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="font-bold text-slate-300">Pitch Bio & What You Seek</label>
                    <textarea
                      rows={2}
                      placeholder="Brief summary of your hackathon strengths and what kind of problem statements excite you..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Save & Select Your Mission</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* STEP 2: Choose Your Intent (Join Team vs Create Team) */}
        {step === 'intent' && (
          <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Step 2 of 2: Select Your Mode</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome, {name}! <br />
                <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                  What is your primary goal today?
                </span>
              </h2>
              <p className="text-slate-400 text-sm max-w-xl mx-auto">
                Choose how you want to interact with SynergyOS. You can seamlessly switch modes anytime from the top navigation bar.
              </p>
            </div>

            {/* Interactive Intent Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              
              {/* OPTION 1: JOIN A TEAM / PROJECT */}
              <div
                onClick={() => setIntent('join')}
                className={`relative rounded-3xl p-7 border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-6 ${
                  intent === 'join'
                    ? 'bg-gradient-to-b from-indigo-950/90 via-slate-900 to-slate-950 border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${
                      intent === 'join' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Compass className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                      Solo Hacker / Specialist
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
                      <span>Join a Project / Hackathon</span>
                      {intent === 'join' && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      I want to find high-performing teams and exciting hackathons looking for my skills ({primaryRole} • {archetype}).
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center space-x-2 text-indigo-300 font-semibold">
                      <Zap className="w-3.5 h-3.5 shrink-0" />
                      <span>What you will see in your dashboard:</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc list-inside">
                      <li><strong className="text-slate-200">Personalized Match Score %</strong> for every recruiting hackathon project</li>
                      <li><strong className="text-slate-200">How You Can Contribute</strong> callouts for open vacancies</li>
                      <li><strong className="text-slate-200">Projected Squad Score</strong> if you join (+18 synergy boost)</li>
                      <li>1-Click instant pitch application to project leaders</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400">Ready to join top squads</span>
                  <span className={`font-bold flex items-center space-x-1 ${intent === 'join' ? 'text-indigo-400' : 'text-slate-500'}`}>
                    <span>Select Join Mode</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* OPTION 2: CREATE & LEAD A TEAM */}
              <div
                onClick={() => setIntent('create')}
                className={`relative rounded-3xl p-7 border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-6 ${
                  intent === 'create'
                    ? 'bg-gradient-to-b from-purple-950/90 via-slate-900 to-slate-950 border-purple-500 shadow-2xl shadow-purple-500/20 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${
                      intent === 'create' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                      Team Leader / Architect
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
                      <span>Create & Lead a Team</span>
                      {intent === 'create' && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      I am building a hackathon project. Show me top individuals ready to join, how they contribute, and our projected team score.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center space-x-2 text-purple-300 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                      <span>What you will see in your dashboard:</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc list-inside">
                      <li><strong className="text-slate-200">List of Individuals Ready to Join</strong> with verified GitHub/LeetCode proof</li>
                      <li><strong className="text-slate-200">How They Can Contribute</strong> breakdown for your project</li>
                      <li><strong className="text-slate-200">Projected Team Score & Delta</strong> if you recruit them (e.g. 78 → 94)</li>
                      <li>Live 6-Axis skill radar & Tri-Vector gap analysis</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400">Assemble a winning team</span>
                  <span className={`font-bold flex items-center space-x-1 ${intent === 'create' ? 'text-purple-400' : 'text-slate-500'}`}>
                    <span>Select Create Mode</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

            </div>

            {/* Launch Action Button */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
              <button
                onClick={() => setStep('details')}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                ← Back to Profile Information
              </button>

              <button
                onClick={handleFinalSubmit}
                className={`w-full sm:w-auto px-10 py-4 font-extrabold text-sm rounded-2xl shadow-xl flex items-center justify-center space-x-3 transition-all transform hover:-translate-y-0.5 cursor-pointer text-white ${
                  intent === 'join'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/30'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>
                  {intent === 'join' ? 'Enter "Join Projects" Dashboard' : 'Enter "Team Leader" Dashboard'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/90 py-4 px-6 text-center text-xs text-slate-500">
        <p>SynergyOS · Evidence-Based Hackathon Matchmaker · Universal Hackathon Engine</p>
      </footer>
    </div>
  );
};

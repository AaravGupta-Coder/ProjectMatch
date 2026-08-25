import React from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Compass, 
  Zap, 
  FileText, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  Cpu, 
  Activity,
  Layers
} from 'lucide-react';
import { ProjectRequirement, UserCandidate } from '../types';

interface AppOverviewHubProps {
  currentTeam: UserCandidate[];
  project: ProjectRequirement;
  synergyScore: number;
  openTeamsCount: number;
  unlockedInvitesCount: number;
  totalTalentCount: number;
  onNavigate: (tab: 'workbench' | 'discovery' | 'jointeam' | 'soloboard' | 'deconstruct' | 'charter' | 'overview') => void;
  onOpenProofModal: () => void;
  onOpenContactModal: () => void;
  onOpenProfileModal: () => void;
}

export const AppOverviewHub: React.FC<AppOverviewHubProps> = ({
  currentTeam,
  project,
  synergyScore,
  openTeamsCount,
  unlockedInvitesCount,
  totalTalentCount,
  onNavigate,
  onOpenProofModal,
  onOpenContactModal,
  onOpenProfileModal
}) => {
  const pages = [
    {
      id: 'workbench' as const,
      category: 'Core Squad Assembly',
      title: 'Squad Workbench & Synergy OS',
      description: 'Manage active team roster, visualize 6-axis skill radar coverage, and run live AI Tri-Vector skill gap triangulation.',
      icon: Layers,
      color: 'from-indigo-600 to-indigo-800',
      badge: `${synergyScore}% Synergy`,
      badgeColor: synergyScore >= 80 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-indigo-100 text-indigo-800 border-indigo-200',
      stats: `${currentTeam.length}/${project.targetTeamSize || 4} Roster Slots Filled`,
      highlights: ['6-Axis Synergy Radar', 'AI Tri-Vector Gap Formula', 'Team Diversity Checks']
    },
    {
      id: 'jointeam' as const,
      category: 'Bidirectional Teaming',
      title: 'Join a Team (Squad Board)',
      description: 'Browse active hackathon squads with open vacancies, test your instant synergy fit delta, and submit pitch applications.',
      icon: UserPlus,
      color: 'from-purple-600 to-violet-800',
      badge: `${openTeamsCount} Squads Recruiting`,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      stats: 'Interactive Fit Delta Simulator',
      highlights: ['1-Click Pitch Application', 'Live Fit Delta Preview', 'Incoming Candidate Review']
    },
    {
      id: 'discovery' as const,
      category: 'Talent Marketplace',
      title: 'Talent Discovery & Proof Match',
      description: 'Search verified developers with real GitHub, LeetCode, and CodeChef evidence. Filter by Archetype and Gender/Department Mix.',
      icon: Search,
      color: 'from-blue-600 to-cyan-800',
      badge: `${totalTalentCount} Verified Profiles`,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      stats: 'Natural Language Smart Match',
      highlights: ['GitHub Commit Telemetry', 'LeetCode Knight Verification', 'Direct Pitch Invites']
    },
    {
      id: 'soloboard' as const,
      category: 'Solo Opportunities',
      title: 'Solo Project Opportunities',
      description: 'Role-reversed view for solo specialists to browse national problem statements seeking their exact technical profile.',
      icon: Compass,
      color: 'from-amber-600 to-orange-800',
      badge: 'Pitch to Project Leads',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      stats: 'Role-Specific Project Matches',
      highlights: ['Direct Lead Pitching', 'Custom Track Filtering', 'Complementarity Callouts']
    },
    {
      id: 'deconstruct' as const,
      category: 'AI Hackathon Studio',
      title: 'AI Problem Deconstructor',
      description: 'Deconstruct raw hackathon problem statements into target archetypes, required tech stacks, and sprint milestones.',
      icon: Zap,
      color: 'from-emerald-600 to-teal-800',
      badge: 'Gemini Powered',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      stats: '1-Click Challenge Template Generator',
      highlights: ['Problem Deconstruction', 'Radar Target Definition', 'Constraint Extraction']
    },
    {
      id: 'charter' as const,
      category: 'Execution & Sprint',
      title: '36-Hour Sprint Charter',
      description: 'AI-generated execution roadmaps, milestone timelines, deliverable assignments per archetype, and demo choreography.',
      icon: FileText,
      color: 'from-rose-600 to-pink-800',
      badge: 'Milestone Execution',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      stats: 'Jury-Ready Deliverables',
      highlights: ['Archetype Task Allocator', 'Collaboration Pact', '3-Min Demo Script']
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-indigo-800/40 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>ProjectMatch Architecture Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Evidence-Based Hackathon Teaming & Synergy OS
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Move beyond random Discord messaging. Form balanced hackathon teams using verified code proof (GitHub, LeetCode), 6-axis synergy analytics, and AI-driven skill gap triangulation.
          </p>

          {/* Quick Active Project Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-3.5 py-2 rounded-2xl flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-300">Active Project:</span>
              <span className="text-xs font-bold text-white">{project.title}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-3.5 py-2 rounded-2xl flex items-center space-x-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-300">Squad:</span>
              <span className="text-xs font-bold text-white">{currentTeam.length}/{project.targetTeamSize || 4} Members ({synergyScore}% Fit)</span>
            </div>

            <button
              onClick={() => onNavigate('workbench')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md active:scale-95"
            >
              <span>Go to Live Workbench</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Structured Pages Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Application Webpages & Modules</h2>
            <p className="text-xs text-slate-500">Navigate to any specialized section of the ProjectMatch platform</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenProofModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verify Code Proof</span>
            </button>
            <button
              onClick={onOpenContactModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-purple-600" />
              <span>Invites Hub ({unlockedInvitesCount})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pages.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                onClick={() => onNavigate(p.id)}
                className="bg-white hover:bg-slate-50/80 rounded-3xl p-6 border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4 relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {p.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mt-0.5">
                      {p.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1 pt-1">
                    {p.highlights.map((h, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                  <span className="text-[11px] text-slate-400 font-semibold">{p.stats}</span>
                  <div className="flex items-center space-x-1">
                    <span>Open Webpage</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Search, 
  FileText, 
  Layers, 
  UserPlus, 
  Zap, 
  CheckCircle2,
  Compass,
  Mail,
  ShieldCheck,
  LayoutGrid,
  Menu,
  X,
  ChevronDown,
  Home,
  User,
  Edit3
} from 'lucide-react';
import { UserCandidate } from '../types';

export type NavTabType = 
  | 'join-dashboard' 
  | 'create-dashboard' 
  | 'overview' 
  | 'workbench' 
  | 'discovery' 
  | 'jointeam' 
  | 'soloboard' 
  | 'deconstruct' 
  | 'charter';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  teamSize: number;
  synergyScore: number;
  unlockedInvitesCount: number;
  openTeamsCount?: number;
  currentUser?: UserCandidate;
  userIntent?: 'join' | 'create';
  onSwitchIntent?: () => void;
  onOpenLanding?: () => void;
  onOpenProfileModal: () => void;
  onOpenProofModal: () => void;
  onOpenContactModal: () => void;
  onQuickLoadPreset: (presetId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  teamSize,
  synergyScore,
  unlockedInvitesCount,
  openTeamsCount = 5,
  currentUser,
  userIntent = 'join',
  onSwitchIntent,
  onOpenLanding,
  onOpenProfileModal,
  onOpenProofModal,
  onOpenContactModal,
  onQuickLoadPreset,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems: { id: NavTabType; label: string; description: string; icon: any; badge?: string; badgeColor?: string; group: string }[] = [
    { 
      id: 'join-dashboard', 
      label: 'Join Projects Dashboard', 
      description: 'Explore projects seeking your skills with personalized match scores & contribution callouts', 
      icon: Compass, 
      badge: 'Personalized Fit',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      group: 'Primary Modes' 
    },
    { 
      id: 'create-dashboard', 
      label: 'Team Leader Dashboard', 
      description: 'Browse available builders ready to join, see contribution potential & simulated team score', 
      icon: Users, 
      badge: 'Roster Simulator',
      badgeColor: 'bg-purple-100 text-purple-800',
      group: 'Primary Modes' 
    },
    { 
      id: 'overview', 
      label: 'Platform Overview Hub', 
      description: 'Central command hub with all 10 Synergy OS features & live simulator', 
      icon: Home, 
      badge: 'All 10 Features',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      group: 'Explore' 
    },
    { 
      id: 'workbench', 
      label: 'Team Workbench', 
      description: '6-Axis radar, roster assembly & AI gap analysis', 
      icon: Layers, 
      badge: `${synergyScore}% Fit`, 
      badgeColor: synergyScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800', 
      group: 'Assembly' 
    },
    { 
      id: 'jointeam', 
      label: 'Open Squads Board', 
      description: 'Browse active recruiting squads with live fit delta', 
      icon: UserPlus, 
      badge: `${openTeamsCount} Open`, 
      badgeColor: 'bg-purple-100 text-purple-800', 
      group: 'Matchmaking' 
    },
    { 
      id: 'discovery', 
      label: 'Talent Pool & Proof Match', 
      description: 'Find verified coders with GitHub & LeetCode proof', 
      icon: Search, 
      group: 'Matchmaking' 
    },
    { 
      id: 'soloboard', 
      label: 'Solo Project Opportunities', 
      description: 'Find hackathon problem statements seeking your skills', 
      icon: Compass, 
      group: 'Matchmaking' 
    },
    { 
      id: 'deconstruct', 
      label: 'AI Problem Deconstructor', 
      description: 'Deconstruct raw problem statements into target archetypes', 
      icon: Zap, 
      group: 'AI Studio' 
    },
    { 
      id: 'charter', 
      label: '36-Hour Sprint Charter', 
      description: 'Execution timeline, task assignments & pitch script', 
      icon: FileText, 
      group: 'AI Studio' 
    },
  ];

  const handleNavClick = (tab: NavTabType) => {
    setActiveTab(tab);
    setDrawerOpen(false);
  };

  const currentActiveItem = navItems.find(item => item.id === activeTab);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Left: 3-Lines Menu + Brand */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                id="btn-top-left-menu"
                onClick={() => setDrawerOpen(true)}
                className="p-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                title="Open Navigation Menu"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div 
                onClick={() => handleNavClick('overview')} 
                className="flex items-center space-x-2 cursor-pointer select-none"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white font-bold shadow-xs">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base text-slate-900 tracking-tight">
                  ProjectMatch
                </span>
              </div>

              {/* Minimal Active Page Indicator */}
              {currentActiveItem && (
                <div className="hidden sm:flex items-center space-x-1.5 pl-2 border-l border-slate-200 text-xs font-semibold text-slate-500">
                  <span>/</span>
                  <span className="text-slate-800 font-bold">{currentActiveItem.label}</span>
                </div>
              )}
            </div>

            {/* Right: Controls & User Profile */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Intent Mode Switcher / Badge */}
              <button
                onClick={onSwitchIntent}
                className={`hidden md:inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-2xs border ${
                  userIntent === 'join'
                    ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'
                }`}
                title="Click to Switch Mode (Join vs. Create Team)"
              >
                <Sparkles className={`w-3.5 h-3.5 ${userIntent === 'join' ? 'text-indigo-600' : 'text-purple-600'}`} />
                <span>{userIntent === 'join' ? '🎯 Join Projects Mode' : '👑 Create Team Mode'}</span>
              </button>

              {/* Clean Track Selector */}
              <div className="hidden lg:flex items-center bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1 transition-colors">
                <select
                  id="preset-scenario-selector"
                  onChange={(e) => onQuickLoadPreset(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer pr-1"
                  defaultValue="proj-1"
                >
                  <option value="proj-1">MedEcho (Health AI)</option>
                  <option value="proj-2">HyperRoute (CleanTech)</option>
                  <option value="proj-3">DeFi Aegis (Security)</option>
                  <option value="proj-4">AgriSense (Agro)</option>
                  <option value="proj-5">RescueSwarm (Robotics)</option>
                </select>
              </div>

              {/* Invites Hub Button */}
              <button
                id="btn-open-contacts-hub"
                onClick={onOpenContactModal}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition-colors"
                title="View Invites & Contacts"
              >
                <Mail className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">Invites</span>
                <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {unlockedInvitesCount}
                </span>
              </button>

              {/* Proof Engine Button */}
              <button
                id="btn-open-proof-parser-nav"
                onClick={onOpenProofModal}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Proof Engine</span>
              </button>

              {/* User Profile & Edit Skills Button */}
              {currentUser && (
                <button
                  id="btn-navbar-profile"
                  onClick={onOpenProfileModal}
                  className="flex items-center space-x-2 pl-1 pr-2.5 py-1 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-left"
                  title="View & Edit My Profile & Skills"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-lg object-cover border border-slate-200"
                  />
                  <div className="hidden sm:block text-left">
                    <span className="block text-xs font-extrabold text-slate-800 leading-none truncate max-w-[100px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-indigo-600 font-bold flex items-center space-x-0.5">
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>Edit Skills</span>
                    </span>
                  </div>
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Slide-out Left Navigation Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
          
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col justify-between border-r border-slate-200 animate-in slide-in-from-left duration-250">
              
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-md font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-base text-slate-900 tracking-tight">ProjectMatch</h2>
                    <p className="text-xs text-slate-500 font-medium">Platform Navigation Menu</p>
                  </div>
                </div>

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                
                {/* Active User Card in Drawer */}
                {currentUser && (
                  <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-200 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-xl object-cover border border-indigo-300"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-extrabold text-indigo-950 truncate">{currentUser.name}</h4>
                        <p className="text-[11px] text-indigo-700 truncate">{currentUser.primaryRole}</p>
                        <p className="text-[10px] text-slate-500">{currentUser.topSkills.slice(0, 3).join(', ')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setDrawerOpen(false);
                        onOpenProfileModal();
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center space-x-1 shadow-2xs"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                )}

                {/* Navigation Group 1: Core Pages */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
                    Main Workspaces
                  </span>

                  <div className="space-y-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          id={`drawer-nav-${item.id}`}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full text-left flex items-start space-x-3.5 p-3 rounded-2xl transition-all ${
                            isActive
                              ? 'bg-indigo-50 border-2 border-indigo-500/50 shadow-xs'
                              : 'hover:bg-slate-100/80 border border-transparent'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isActive ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-bold truncate ${isActive ? 'text-indigo-900' : 'text-slate-900'}`}>
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 leading-snug mt-0.5 line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Group 2: Quick Tools & Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
                    Actions & Proof Hub
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setDrawerOpen(false);
                        onOpenProofModal();
                      }}
                      className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-left space-y-1 transition-all"
                    >
                      <ShieldCheck className="w-5 h-5 text-emerald-700" />
                      <p className="text-xs font-bold">Proof Parser</p>
                      <p className="text-[10px] text-emerald-700">GitHub & LeetCode</p>
                    </button>

                    <button
                      onClick={() => {
                        setDrawerOpen(false);
                        onOpenContactModal();
                      }}
                      className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-left space-y-1 transition-all"
                    >
                      <Mail className="w-5 h-5 text-purple-700" />
                      <p className="text-xs font-bold">Invites Hub</p>
                      <p className="text-[10px] text-purple-700">{unlockedInvitesCount} Accepted</p>
                    </button>
                  </div>
                </div>

                {/* Scenario Switcher in Drawer */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Switch Active Hackathon Track
                  </span>
                  <select
                    onChange={(e) => {
                      onQuickLoadPreset(e.target.value);
                      setDrawerOpen(false);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-800 outline-none"
                    defaultValue="proj-1"
                  >
                    <option value="proj-1">MedEcho (Health AI)</option>
                    <option value="proj-2">HyperRoute (CleanTech)</option>
                    <option value="proj-3">DeFi Aegis (Security)</option>
                    <option value="proj-4">AgriSense Edge (Agro)</option>
                    <option value="proj-5">RescueSwarm (Disaster Robotics)</option>
                  </select>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">ProjectMatch Synergy OS</span>
                <span className="font-bold text-indigo-600">Universal Hackathon Engine</span>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

import React, { useState } from 'react';
import { ProjectRequirement } from '../types';
import { PRESET_PROJECTS } from '../data/seedData';
import { 
  Zap, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Check, 
  Code2, 
  Calendar, 
  Users, 
  FileText,
  Target
} from 'lucide-react';

interface ProjectDeconstructorProps {
  currentProject: ProjectRequirement;
  onApplyProject: (project: ProjectRequirement) => void;
  onDeconstructWithAI: (input: { title: string; description: string; track: string; teamSize: number }) => Promise<ProjectRequirement | null>;
  isDeconstructing: boolean;
  onNavigateToWorkbench: () => void;
}

export const ProjectDeconstructor: React.FC<ProjectDeconstructorProps> = ({
  currentProject,
  onApplyProject,
  onDeconstructWithAI,
  isDeconstructing,
  onNavigateToWorkbench,
}) => {
  const [customTitle, setCustomTitle] = useState('');
  const [customTrack, setCustomTrack] = useState('AI & Intelligent Systems');
  const [customTeamSize, setCustomTeamSize] = useState(4);
  const [customDescription, setCustomDescription] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState(currentProject.id);
  const [deconstructedResult, setDeconstructedResult] = useState<ProjectRequirement | null>(null);

  const handleSelectPreset = (preset: ProjectRequirement) => {
    setSelectedPresetId(preset.id);
    setDeconstructedResult(null);
    onApplyProject(preset);
  };

  const handleRunAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customDescription.trim()) return;

    const result = await onDeconstructWithAI({
      title: customTitle,
      description: customDescription,
      track: customTrack,
      teamSize: customTeamSize,
    });

    if (result) {
      setDeconstructedResult(result);
      setSelectedPresetId('custom');
    }
  };

  const activeDisplayProject = deconstructedResult || currentProject;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
            Gemini 3.7 AI Architecture Engine
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          AI Project Requirement Deconstructor
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          Input any hackathon challenge, startup prompt, or research thesis. Our AI deconstructs it into the exact multi-disciplinary roles, tech stacks, and team archetype distributions required to win.
        </p>
      </div>

      {/* Two Column Selector: Custom Input Form vs Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Custom Input & Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Custom Project Form */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">Deconstruct Your Own Project</h3>
            </div>

            <form onSubmit={handleRunAI} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. NeuroSync BCI Keyboard"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Domain Track</label>
                  <select
                    value={customTrack}
                    onChange={(e) => setCustomTrack(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="AI & Intelligent Systems">AI & Intelligent Systems</option>
                    <option value="Healthcare & BioTech">Healthcare & BioTech</option>
                    <option value="Fintech & DeFi">Fintech & DeFi</option>
                    <option value="Climate & CleanTech">Climate & CleanTech</option>
                    <option value="DevTools & Infrastructure">DevTools & Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Team Size</label>
                  <select
                    value={customTeamSize}
                    onChange={(e) => setCustomTeamSize(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value={3}>3 Members</option>
                    <option value={4}>4 Members</option>
                    <option value={5}>5 Members</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Description / Problem Statement
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste your competition problem statement, user story, or feature scope..."
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all leading-relaxed"
                  required
                />
              </div>

              <button
                id="btn-run-deconstruct"
                type="submit"
                disabled={isDeconstructing || !customTitle.trim()}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isDeconstructing ? 'animate-spin' : ''}`} />
                <span>{isDeconstructing ? 'Deconstructing with Gemini 3.7...' : 'Generate Team Role Blueprint'}</span>
              </button>
            </form>
          </div>

          {/* Preset Challenge Selector */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Or Choose a National Challenge Preset
            </h3>

            <div className="space-y-2">
              {PRESET_PROJECTS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{preset.title.split(':')[0]}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{preset.tagline}</p>
                    <div className="flex items-center space-x-2 mt-2 text-[10px] text-slate-500 font-semibold">
                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">{preset.track}</span>
                      <span>• {preset.targetTeamSize} Roles</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Active Deconstructed Blueprint Display (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            
            {/* Title & Apply Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                  {activeDisplayProject.track}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{activeDisplayProject.title}</h3>
              </div>

              <button
                id="btn-apply-blueprint"
                onClick={() => {
                  onApplyProject(activeDisplayProject);
                  onNavigateToWorkbench();
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors shrink-0"
              >
                <span>Apply to Workbench</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Description / Summary */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900">Blueprint Objective: </span>
              {activeDisplayProject.description}
            </div>

            {/* Recommended Role Allocation Matrix */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-800 flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Synthesized Role Allocation ({activeDisplayProject.requiredRoles.length} Positions)</span>
                </h4>
              </div>

              <div className="space-y-2.5">
                {activeDisplayProject.requiredRoles.map((roleReq, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{roleReq.role}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded uppercase ${
                          roleReq.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {roleReq.priority}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        Archetype: {roleReq.archetype}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600">{roleReq.responsibility}</p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {roleReq.idealSkills.map((sk, sIdx) => (
                        <span key={sIdx} className="text-[10px] font-medium bg-slate-50 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Tech Stack */}
            <div>
              <h4 className="font-bold text-xs text-slate-800 mb-2 flex items-center space-x-1.5">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>Critical Tech Stack Recommendation</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeDisplayProject.criticalTechStack.map((tech, idx) => (
                  <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* 4-Phase Sprint Roadmap */}
            <div>
              <h4 className="font-bold text-xs text-slate-800 mb-2.5 flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Execution Milestone Roadmap</span>
              </h4>
              <div className="space-y-2">
                {activeDisplayProject.keyMilestones.map((ms, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-[11px]">{ms.phase}</span>
                        <span className="text-[10px] text-indigo-700 font-semibold">Lead: {ms.leadRole}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{ms.deliverable}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  UserCandidate, 
  ProjectRequirement, 
  SprintCharter 
} from '../types';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Users, 
  Clock, 
  ShieldCheck, 
  Compass, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface SprintCharterViewProps {
  charter: SprintCharter | null;
  currentTeam: UserCandidate[];
  project: ProjectRequirement;
  onGenerateCharter: () => Promise<void>;
  isGeneratingCharter: boolean;
}

export const SprintCharterView: React.FC<SprintCharterViewProps> = ({
  charter,
  currentTeam,
  project,
  onGenerateCharter,
  isGeneratingCharter,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!charter) return;
    const text = `# ${project.title} — Sprint Charter
Team Motto: "${charter.teamMotto}"

## Active Team Roster:
${currentTeam.map(m => `- ${m.name} (${m.primaryRole} | ${m.archetype}) - ${m.weeklyAvailabilityHours}h/wk`).join('\n')}

## 48-Hour Milestone Phases:
${charter.phases.map(p => `### ${p.timeframe}\nMilestone: ${p.milestone}\n` + p.tasks.map(t => `- [ ] ${t.assigneeName}: ${t.task} (${t.deliverable})`).join('\n')).join('\n\n')}

## Collaboration Pact & Anti-Deadlock Rules:
${charter.collaborationPact.map(r => `- ${r}`).join('\n')}

Decision Protocol: ${charter.decisionProtocol}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              48-Hour High-Velocity Execution
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Team Alignment & Sprint Charter
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Translates team composition into clear hourly ownership, role handoffs, and decision protocols.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            id="btn-refresh-charter"
            onClick={onGenerateCharter}
            disabled={isGeneratingCharter || currentTeam.length === 0}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isGeneratingCharter ? 'animate-spin' : ''}`} />
            <span>{isGeneratingCharter ? 'Regenerating...' : 'Regenerate with Gemini'}</span>
          </button>

          <button
            id="btn-copy-charter"
            onClick={handleCopy}
            disabled={!charter}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-98 disabled:opacity-50"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Markdown Charter'}</span>
          </button>
        </div>
      </div>

      {currentTeam.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">No Members in Team Roster</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Add at least one candidate in the Team Workbench to generate a customized execution sprint charter.
          </p>
        </div>
      ) : charter ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Team Identity & Collaboration Pact (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Team Motto Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold">
                <Compass className="w-4 h-4" />
                <span>Team Call-Sign & Motto</span>
              </div>
              <p className="text-base font-extrabold italic leading-snug">
                "{charter.teamMotto}"
              </p>
              <div className="pt-2 border-t border-indigo-800/80 flex items-center justify-between text-xs text-indigo-200">
                <span>{currentTeam.length} Active Operators</span>
                <span>{project.targetTeamSize} Target Slots</span>
              </div>
            </div>

            {/* Roster Assignment Summary */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Assigned Team Roster
              </h4>
              <div className="space-y-2">
                {currentTeam.map((m, idx) => (
                  <div key={m.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{m.name}</p>
                        <p className="text-[10px] text-indigo-700 font-semibold">{m.primaryRole}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {m.archetype}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Anti-Deadlock Collaboration Pact */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Collaboration Pact & Deadlock Rules</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                {charter.collaborationPact.map((rule, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <strong className="text-slate-800">Decision Protocol: </strong>
                {charter.decisionProtocol}
              </div>
            </div>

          </div>

          {/* Right Column: Hourly Sprint Execution Phases (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>4-Stage Sprint Execution Plan</span>
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  Total Delivery Hours: 48h
                </span>
              </div>

              <div className="space-y-4">
                {charter.phases.map((phase, pIdx) => (
                  <div key={pIdx} className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          {pIdx + 1}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">{phase.timeframe}</h4>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 text-xs font-medium text-slate-700">
                      <span className="font-bold text-indigo-700">Phase Milestone: </span>
                      {phase.milestone}
                    </div>

                    {/* Member tasks */}
                    <div className="space-y-2 pt-1">
                      {phase.tasks.map((task, tIdx) => (
                        <div key={tIdx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="flex items-start space-x-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-900 mr-2">{task.assigneeName}:</span>
                              <span className="text-slate-600">{task.task}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0 self-start sm:self-auto">
                            📦 {task.deliverable}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <p className="text-xs text-slate-500">Generating execution blueprint...</p>
        </div>
      )}

    </div>
  );
};

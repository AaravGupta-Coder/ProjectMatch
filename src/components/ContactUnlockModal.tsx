import React, { useState } from 'react';
import { UserCandidate, TeamInvite, ProjectRequirement, ContactInfo } from '../types';
import { X, Send, CheckCircle2, MessageSquare, Phone, Mail, ExternalLink, Sparkles, UserCheck, Clock, ShieldCheck, Check } from 'lucide-react';

interface ContactUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCandidate: UserCandidate | null;
  invites: TeamInvite[];
  onSendInvite: (candidate: UserCandidate, pitchMessage: string) => void;
  onAcceptInvite: (inviteId: string) => void;
  project: ProjectRequirement;
}

export const ContactUnlockModal: React.FC<ContactUnlockModalProps> = ({
  isOpen,
  onClose,
  targetCandidate,
  invites,
  onSendInvite,
  onAcceptInvite,
  project
}) => {
  const [activeTab, setActiveTab] = useState<'send' | 'manage'>(targetCandidate ? 'send' : 'manage');
  const [pitchMessage, setPitchMessage] = useState(
    targetCandidate
      ? `Hi ${targetCandidate.name.split(' ')[0]}! We are forming a team for "${project.title}". We love your background in ${targetCandidate.topSkills.slice(0, 3).join(', ')} and would love to have you as our ${targetCandidate.primaryRole}. Let's connect and win!`
      : ''
  );
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const existingInvite = targetCandidate
    ? invites.find(inv => inv.candidateId === targetCandidate.id)
    : null;

  const handleSend = () => {
    if (targetCandidate && pitchMessage.trim()) {
      onSendInvite(targetCandidate, pitchMessage);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setActiveTab('manage');
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="contact-unlock-modal"
        className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 to-purple-50/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Interest & Contact Unlock Hub</h3>
              <p className="text-xs text-slate-500">
                Matrimony-style team invites and mutual direct contact disclosure
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-3 border-b border-slate-100 flex space-x-4 bg-slate-50/50">
          {targetCandidate && (
            <button
              onClick={() => setActiveTab('send')}
              className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
                activeTab === 'send'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Invite to {targetCandidate.name.split(' ')[0]}</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('manage')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'manage'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Invitations & Unlocked Contacts ({invites.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'send' && targetCandidate && (
            <div className="space-y-4">
              {/* Candidate Quick Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={targetCandidate.avatar}
                    alt={targetCandidate.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{targetCandidate.name}</h4>
                    <p className="text-xs text-slate-500">{targetCandidate.primaryRole} • {targetCandidate.college}</p>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 mt-1 inline-block">
                      Technical Score: {targetCandidate.technicalScore}/100
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700 block">{targetCandidate.weeklyAvailabilityHours}h / wk</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">Available</span>
                </div>
              </div>

              {/* Pitch Message Area */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Personalized Pitch & Team Offer
                </label>
                <textarea
                  value={pitchMessage}
                  onChange={e => setPitchMessage(e.target.value)}
                  rows={4}
                  className="w-full p-3.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                  placeholder="Explain why they are a great fit for your project and what roles they will own..."
                />
              </div>

              {existingInvite ? (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-900 font-medium">
                  <span className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Invite already sent with status: <strong>{existingInvite.status.toUpperCase()}</strong></span>
                  </span>
                  <button
                    onClick={() => setActiveTab('manage')}
                    className="font-bold text-indigo-700 hover:underline"
                  >
                    View Status →
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={sentSuccess}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-2 transition-all active:scale-98"
                >
                  {sentSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Invitation Sent Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Team Invitation</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Team Requests & Mutual Unlocks</span>
                <span className="text-[11px] text-slate-500">
                  Accept an invitation to reveal phone numbers and WhatsApp direct links.
                </span>
              </div>

              {invites.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">No active invitations yet. Send invites to candidates from the discovery tab.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invites.map(inv => {
                    const isAccepted = inv.status === 'accepted';

                    return (
                      <div
                        key={inv.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isAccepted
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={inv.candidateAvatar}
                              alt={inv.candidateName}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-bold text-slate-900 text-xs">{inv.candidateName}</h4>
                                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                                  {inv.candidateRole}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Sent by {inv.senderName} • {inv.timestamp}
                              </p>
                            </div>
                          </div>

                          <div>
                            {isAccepted ? (
                              <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Accepted & Unlocked</span>
                              </span>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                  Pending Reply
                                </span>
                                <button
                                  onClick={() => onAcceptInvite(inv.id)}
                                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                                >
                                  Simulate Accept
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Pitch Note */}
                        <p className="text-xs text-slate-600 mt-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 italic">
                          "{inv.pitchMessage}"
                        </p>

                        {/* Unlocked Contact Details if accepted */}
                        {isAccepted && inv.unlockedContact && (
                          <div className="mt-3 pt-3 border-t border-emerald-200/80">
                            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900 mb-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <span>Direct Verified Contacts Unlocked 🎉</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <a
                                href={`https://wa.me/${inv.unlockedContact.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(inv.candidateName)},%20excited%20to%20team%20up%20for%20${encodeURIComponent(inv.projectTitle)}!`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center space-x-2 p-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors justify-center shadow-xs"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Chat on WhatsApp</span>
                              </a>

                              <a
                                href={`mailto:${inv.unlockedContact.email}`}
                                className="flex items-center space-x-2 p-2 bg-white text-slate-800 border border-slate-200 rounded-xl text-xs font-medium hover:bg-slate-50 transition-colors justify-center"
                              >
                                <Mail className="w-3.5 h-3.5 text-slate-500" />
                                <span className="truncate">{inv.unlockedContact.email}</span>
                              </a>

                              <div className="flex items-center space-x-2 p-2 bg-white text-slate-800 border border-slate-200 rounded-xl text-xs font-medium justify-center">
                                <Phone className="w-3.5 h-3.5 text-slate-500" />
                                <span>{inv.unlockedContact.phone}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Contacts are strictly disclosed only upon mutual team acceptance to prevent spam.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

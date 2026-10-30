import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const MOCK_SIGNALS = [
  {
    id: 'sig-01',
    type: 'tab_visibility_changed',
    label: 'Tab Visibility Lost',
    timestamp: '14:22:04 UTC',
    duration: '4.2 seconds',
    severity: 'medium',
    details: 'Browser window lost focus. Candidate returned at 14:22:08 UTC.',
    advisory: 'Advisory signal only. Candidate may have been triggered by system notification.',
  },
  {
    id: 'sig-02',
    type: 'paste_event',
    label: 'Paste Event Detected',
    timestamp: '14:22:15 UTC',
    duration: 'Single trigger',
    severity: 'medium',
    details: '42 characters inserted simultaneously in solution.py (lines 14–17). Clipboard contents redacted per privacy policy.',
    advisory: 'Fast typing or code snippet insertion. Check code diff below.',
  },
  {
    id: 'sig-03',
    type: 'audio_level_spike',
    label: 'Transient Audio Elevation',
    timestamp: '14:28:40 UTC',
    duration: '1.8 seconds',
    severity: 'low',
    details: 'Ambient noise registered 48 dB (Nominal: 22 dB).',
    advisory: 'Distant siren or chair movement. No secondary speech pattern identified.',
  },
];

export default function ProctoringReviewPage() {
  const navigate = useNavigate();
  const [decision, setDecision] = useState('no_action');
  const [reviewerNotes, setReviewerNotes] = useState('Reviewed tab switch window and pasted code. Candidate pasted a boilerplate deque initialization, followed by legitimate manual typing of the BFS while-loop. Video frame confirms candidate stayed centered. No violation.');
  const [isCommitting, setIsCommitting] = useState(false);
  const [committedBanner, setCommittedBanner] = useState(false);

  function handleCommitDecision(e) {
    e.preventDefault();
    setIsCommitting(true);
    setTimeout(() => {
      setIsCommitting(false);
      setCommittedBanner(true);
    }, 900);
  }

  return (
    <div className="min-h-screen bg-[#0D0F1A] flex font-['Inter',sans-serif]">
      <Sidebar activePage="teacher-review" />

      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="border-b border-[#1E2238] px-8 py-5 bg-[#0F1221]/60 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/teacher/studio')}
                  className="text-xs text-[#8B91B0] hover:text-[#4F6BED] transition-colors"
                >
                  ← Back to Teacher Studio
                </button>
                <span className="text-[#3A3F58]">/</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase">
                  Flow E · Anti-Cheat Evidence Audit
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#F0F2FF] font-['Geist',sans-serif] mt-1">
                Proctoring Evidence Case: Aanya Rao (Batch A)
              </h1>
              <p className="text-xs text-[#8B91B0]">
                Attempt ID: <span className="font-mono text-[#F0F2FF]">ATT-8942-DSA-FOUNDATIONS</span> · Ingestion: <span className="font-mono text-emerald-400">Azure Service Bus Verified</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                2 Unresolved Signals Need Context
              </span>
            </div>
          </div>
        </header>

        {/* Mandatory Architectural Policy Disclaimer */}
        <div className="mx-8 mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <span className="text-xl">⚖️</span>
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              Mandatory Human Review Principle (Architecture Board 01 · Layer 05)
            </h4>
            <p className="text-xs text-[#C0C5DD] mt-1 leading-relaxed">
              Client-reported browser events (tab switches, focus loss, paste timestamps) are <strong>best-effort, bypassable, and strictly advisory</strong>. Evidence supports human judgment and <strong>never constitutes an automatic cheating verdict</strong>. Assessment score and candidate status remain authoritative until a human reviewer completes this audit.
            </p>
          </div>
        </div>

        {committedBanner && (
          <div className="mx-8 mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between">
            <span>✓ Audit decision successfully committed to PostgreSQL outbox and dispatched to Student profile.</span>
            <button onClick={() => navigate('/teacher/studio')} className="underline">Return to Studio →</button>
          </div>
        )}

        {/* 2-Column Split */}
        <div className="p-8 grid grid-cols-12 gap-6">
          {/* Left Column: Video Evidence, Timeline, Code Diff */}
          <div className="col-span-8 space-y-6">
            {/* Video Biometric Snippet */}
            <div className="bg-[#141622] border border-[#1E2238] rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#1E2238] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F0F2FF] font-['Geist',sans-serif] flex items-center gap-2">
                  <span>📹 Flagged Video Window (14:22:00 – 14:22:20 UTC)</span>
                </span>
                <span className="text-[10px] font-mono text-[#8B91B0]">Clean Blob Container · PII Scrubbed</span>
              </div>

              <div className="aspect-video bg-black relative flex items-center justify-center">
                {/* Simulated frame */}
                <div className="w-48 h-56 border-2 border-emerald-400/50 rounded-xl flex flex-col items-center justify-center p-3 relative">
                  <div className="w-16 h-16 rounded-full bg-[#4F6BED]/20 border border-[#4F6BED] flex items-center justify-center text-lg font-bold text-[#4F6BED]">
                    AR
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 mt-2">Biometrics: Gaze Centered</span>
                  <span className="text-[9px] font-mono text-[#8B91B0]">Candidate: Aanya Rao</span>
                  <div className="absolute top-2 left-2 text-[9px] font-mono text-amber-400 bg-black/60 px-1.5 py-0.5 rounded">
                    ⚠️ Tab Switch @ 14:22:04
                  </div>
                </div>

                {/* Scrubber Controls */}
                <div className="absolute bottom-0 inset-x-0 bg-black/80 p-3 flex items-center gap-3 text-xs font-mono text-white">
                  <button className="text-base text-[#4F6BED]">▶</button>
                  <span className="text-[10px] text-[#8B91B0]">00:04 / 00:20</span>
                  <div className="flex-1 h-1.5 bg-[#252840] rounded-full relative cursor-pointer">
                    <div className="w-1/4 h-full bg-[#4F6BED] rounded-full" />
                    <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full" title="Signal: Tab switch" />
                    <div className="absolute left-[75%] top-1/2 -translate-y-1/2 w-3 h-3 bg-[#4F6BED] rounded-full" title="Signal: Paste detected" />
                  </div>
                  <span className="text-[10px] text-amber-400">1.0x Speed</span>
                </div>
              </div>
            </div>

            {/* Event Timeline Stream */}
            <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#8B91B0] mb-4">
                Telemetry Chronology (Deduplicated Event Stream)
              </h3>
              <div className="space-y-3">
                {MOCK_SIGNALS.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-lg bg-[#0D0F1A] border border-[#252840] flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${s.severity === 'medium' ? 'bg-amber-400' : 'bg-[#4F6BED]'}`} />
                        <span className="text-xs font-semibold text-[#F0F2FF]">{s.label}</span>
                        <span className="text-[10px] font-mono text-[#8B91B0]">({s.duration})</span>
                      </div>
                      <p className="text-xs text-[#8B91B0]">{s.details}</p>
                      <p className="text-[11px] text-[#4F6BED]">{s.advisory}</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#8B91B0] flex-shrink-0 bg-[#1C1F30] px-2 py-1 rounded">
                      {s.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Diff Highlighting */}
            <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#8B91B0]">
                  Code Insertion Inspection (solution.py @ 14:22:15 UTC)
                </h3>
                <span className="text-[10px] font-mono text-emerald-400">42 chars pasted</span>
              </div>
              <div className="p-3 bg-[#090A0F] border border-[#252840] rounded-lg font-mono text-xs text-[#C0C5DD] space-y-1">
                <p className="text-slate-500">12:    def levelOrder(self, root: Optional[TreeNode]) -&gt; List[List[int]]:</p>
                <p className="text-slate-500">13:        if not root: return []</p>
                <p className="bg-amber-500/20 text-amber-300 border-l-2 border-amber-400 px-2 py-0.5">
                  14: +      result = []
                </p>
                <p className="bg-amber-500/20 text-amber-300 border-l-2 border-amber-400 px-2 py-0.5">
                  15: +      queue = deque([root])
                </p>
                <p className="text-slate-500">16:        while queue:</p>
                <p className="text-slate-500">17:            level_size = len(queue)</p>
              </div>
              <p className="text-[11px] text-[#8B91B0] mt-2">
                Note: Standard BFS boilerplate. Redaction engine stripped any external clipboard headers.
              </p>
            </div>
          </div>

          {/* Right Column: Reviewer Action Deck */}
          <div className="col-span-4 space-y-5">
            <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#8B91B0] mb-3">
                Attempt Diagnostic Summary
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#1E2238]">
                  <span className="text-[#8B91B0]">Candidate Score:</span>
                  <span className="font-mono text-emerald-400 font-bold">150 / 150 (100%)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E2238]">
                  <span className="text-[#8B91B0]">Deterministic Tests:</span>
                  <span className="font-mono text-white">3 / 3 Passed</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E2238]">
                  <span className="text-[#8B91B0]">Total Tab Lost Time:</span>
                  <span className="font-mono text-amber-400 font-bold">4.2 seconds</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E2238]">
                  <span className="text-[#8B91B0]">Gaze In-Frame Rate:</span>
                  <span className="font-mono text-emerald-400">96.8%</span>
                </div>
              </div>
            </div>

            {/* Decision Selector Card */}
            <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#8B91B0] mb-3">
                Human Review Determination
              </h3>

              <div className="space-y-2.5 mb-4">
                <label
                  onClick={() => setDecision('no_action')}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    decision === 'no_action'
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-[#0D0F1A] border-[#252840] text-[#8B91B0] hover:border-[#4F6BED]'
                  }`}
                >
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === 'no_action'}
                    onChange={() => setDecision('no_action')}
                    className="mt-0.5 accent-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-bold block text-white">No Action Required (Innocent)</span>
                    <span className="text-[11px] text-[#8B91B0]">Signals represent normal editor usage / false positive. Retain full score.</span>
                  </div>
                </label>

                <label
                  onClick={() => setDecision('follow_up')}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    decision === 'follow_up'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                      : 'bg-[#0D0F1A] border-[#252840] text-[#8B91B0] hover:border-[#4F6BED]'
                  }`}
                >
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === 'follow_up'}
                    onChange={() => setDecision('follow_up')}
                    className="mt-0.5 accent-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold block text-white">Follow-Up Interview Required</span>
                    <span className="text-[11px] text-[#8B91B0]">Flag for 5-minute verbal defense with the faculty proctor.</span>
                  </div>
                </label>

                <label
                  onClick={() => setDecision('inconclusive')}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    decision === 'inconclusive'
                      ? 'bg-[#4F6BED]/10 border-[#4F6BED]/40 text-[#4F6BED]'
                      : 'bg-[#0D0F1A] border-[#252840] text-[#8B91B0] hover:border-[#4F6BED]'
                  }`}
                >
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === 'inconclusive'}
                    onChange={() => setDecision('inconclusive')}
                    className="mt-0.5 accent-[#4F6BED]"
                  />
                  <div>
                    <span className="text-xs font-bold block text-white">Inconclusive / Technical Glitch</span>
                    <span className="text-[11px] text-[#8B91B0]">Client WebRTC or OS update artifact. Issue re-attempt token.</span>
                  </div>
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-[10px] font-mono uppercase text-[#8B91B0] mb-1.5">
                  Auditable Reviewer Notes (SOC 2 Type II Logged)
                </label>
                <textarea
                  rows={4}
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  className="w-full bg-[#0D0F1A] border border-[#252840] rounded-lg p-2.5 text-xs text-[#F0F2FF] focus:outline-none focus:ring-1 focus:ring-[#4F6BED]"
                />
              </div>

              <button
                type="button"
                disabled={isCommitting}
                onClick={handleCommitDecision}
                className="w-full py-2.5 bg-[#4F6BED] hover:bg-[#3D5BE0] text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#4F6BED]/20"
              >
                {isCommitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing Decision with Enclave...</span>
                  </>
                ) : (
                  <>
                    <span>Commit Official Review Decision</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

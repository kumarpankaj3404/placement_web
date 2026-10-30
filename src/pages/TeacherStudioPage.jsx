import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const MOCK_CANDIDATES = [
  {
    id: 'cand-01',
    name: 'Aanya Rao',
    batch: 'Batch A',
    status: 'flagged',
    statusText: 'Tab Switch (2)',
    gaze: 94,
    keystrokes: '142 cpm',
    timeRemaining: '24:18',
    lastEvent: 'Switched to browser tab for 4.2s',
    flagCount: 2,
    codeProgress: '18/24 lines',
  },
  {
    id: 'cand-02',
    name: 'Rohan Patel',
    batch: 'Batch A',
    status: 'in-flow',
    statusText: 'In Flow',
    gaze: 99,
    keystrokes: '188 cpm',
    timeRemaining: '23:40',
    lastEvent: 'Compiled solution.py (0 errors)',
    flagCount: 0,
    codeProgress: '24/24 lines',
  },
  {
    id: 'cand-03',
    name: 'Meera Patel',
    batch: 'Batch A',
    status: 'in-flow',
    statusText: 'In Flow',
    gaze: 97,
    keystrokes: '110 cpm',
    timeRemaining: '25:02',
    lastEvent: 'Ran testcase 1 (Passed)',
    flagCount: 0,
    codeProgress: '12/24 lines',
  },
  {
    id: 'cand-04',
    name: 'Dev Malhotra',
    batch: 'Batch A',
    status: 'reconnecting',
    statusText: 'Reconnecting',
    gaze: 88,
    keystrokes: '0 cpm',
    timeRemaining: '24:50',
    lastEvent: 'WebRTC Pkt loss 18% · resyncing',
    flagCount: 1,
    codeProgress: '9/24 lines',
  },
  {
    id: 'cand-05',
    name: 'Sneha Iyer',
    batch: 'Batch A',
    status: 'in-flow',
    statusText: 'In Flow',
    gaze: 98,
    keystrokes: '165 cpm',
    timeRemaining: '21:12',
    lastEvent: 'Submitted sample test 2',
    flagCount: 0,
    codeProgress: '22/24 lines',
  },
  {
    id: 'cand-06',
    name: 'Vikram Sethi',
    batch: 'Batch A',
    status: 'in-flow',
    statusText: 'In Flow',
    gaze: 96,
    keystrokes: '130 cpm',
    timeRemaining: '22:45',
    lastEvent: 'Viewing Problem Statement',
    flagCount: 0,
    codeProgress: '15/24 lines',
  },
];

export default function TeacherStudioPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('monitor'); // 'monitor' | 'generator' | 'batches'
  const [aiPrompt, setAiPrompt] = useState('Generate a 45-minute technical assessment on Graph BFS & Topological Sort for CSE Batch A. Include 3 edge cases, memory bounds, and sample unit tests.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftGenerated, setDraftGenerated] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);

  function handleTriggerGenerate(e) {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setDraftGenerated(true);
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-[#0D0F1A] flex font-['Inter',sans-serif]">
      <Sidebar activePage="teacher-studio" />

      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="border-b border-[#1E2238] px-8 py-5 bg-[#0F1221]/60 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#4F6BED] bg-[#4F6BED]/10 border border-[#4F6BED]/20 px-2 py-0.5 rounded">
                  Teacher Workspace · Teach With Insight
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Enclave PubSub WSS
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#F0F2FF] font-['Geist',sans-serif] mt-1">
                Assessment Studio &amp; Real-Time Proctoring
              </h1>
              <p className="text-xs text-[#8B91B0]">
                Active Batch: <span className="text-[#F0F2FF] font-semibold">CSE · Batch A (42 Students)</span> · Assessment: <span className="text-[#4F6BED] font-semibold">DSA Foundations (45m)</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('generator')}
                className="px-4 py-2 bg-[#4F6BED] hover:bg-[#3D5BE0] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-[#4F6BED]/20"
              >
                <span>✨ AI-Generate Assessment</span>
                <span className="text-[10px] font-mono bg-white/20 px-1 rounded">Draft</span>
              </button>
              <button
                onClick={() => navigate('/teacher/proctoring-review')}
                className="px-3.5 py-2 bg-[#1C1F30] hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <span>⚠️ Open Proctoring Review (2 Flags)</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex gap-4 mt-5 border-t border-[#1E2238] pt-3">
            <button
              onClick={() => setActiveTab('monitor')}
              className={`text-xs font-medium pb-1.5 transition-colors flex items-center gap-1.5 ${
                activeTab === 'monitor'
                  ? 'text-[#4F6BED] border-b-2 border-[#4F6BED] font-semibold'
                  : 'text-[#8B91B0] hover:text-[#F0F2FF]'
              }`}
            >
              <span>📹 Live Candidate Proctor Grid</span>
              <span className="text-[10px] bg-[#1E2238] px-1.5 py-0.2 rounded-full text-slate-300">6 Online</span>
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`text-xs font-medium pb-1.5 transition-colors flex items-center gap-1.5 ${
                activeTab === 'generator'
                  ? 'text-[#4F6BED] border-b-2 border-[#4F6BED] font-semibold'
                  : 'text-[#8B91B0] hover:text-[#F0F2FF]'
              }`}
            >
              <span>🤖 AI Test Authoring (LangChain Guardrailed)</span>
              {draftGenerated && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
            </button>
            <button
              onClick={() => setActiveTab('batches')}
              className={`text-xs font-medium pb-1.5 transition-colors flex items-center gap-1.5 ${
                activeTab === 'batches'
                  ? 'text-[#4F6BED] border-b-2 border-[#4F6BED] font-semibold'
                  : 'text-[#8B91B0] hover:text-[#F0F2FF]'
              }`}
            >
              <span>📊 Class Skill Insights &amp; Batches</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 space-y-6">
          {/* TAB 1: Live Candidate Monitor */}
          {activeTab === 'monitor' && (
            <div className="space-y-6">
              {/* Telemetry Metrics Bar */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B91B0]">Session Health</span>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xl font-bold text-emerald-400 font-mono">100% Deterministic</p>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">TLS 1.3</span>
                  </div>
                  <p className="text-[11px] text-[#8B91B0] mt-1">Zero sandbox leakage</p>
                </div>

                <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B91B0]">Active In Flow</span>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xl font-bold text-[#F0F2FF] font-['Geist',sans-serif]">4 / 6 Active</p>
                    <span className="text-xs bg-[#4F6BED]/10 text-[#4F6BED] px-2 py-0.5 rounded">66%</span>
                  </div>
                  <p className="text-[11px] text-[#8B91B0] mt-1">Average gaze stability 96.2%</p>
                </div>

                <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">Advisory Review Needed</span>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xl font-bold text-amber-400 font-mono">1 Flagged</p>
                    <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">Non-blocking</span>
                  </div>
                  <p className="text-[11px] text-[#8B91B0] mt-1">Aanya Rao (Tab visibility signal)</p>
                </div>

                <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B91B0]">Time Remaining</span>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xl font-bold text-[#F0F2FF] font-mono">24:18</p>
                    <span className="text-xs text-slate-400 font-mono">Server Deadline</span>
                  </div>
                  <p className="text-[11px] text-[#8B91B0] mt-1">Browser clock strictly untrusted</p>
                </div>
              </div>

              {/* Candidate Grid */}
              <div className="grid grid-cols-3 gap-5">
                {MOCK_CANDIDATES.map((cand) => (
                  <div
                    key={cand.id}
                    className={`bg-[#141622] border rounded-xl overflow-hidden transition-all duration-200 flex flex-col ${
                      cand.status === 'flagged'
                        ? 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                        : cand.status === 'reconnecting'
                        ? 'border-yellow-500/30'
                        : 'border-[#1E2238] hover:border-[#4F6BED]/50'
                    }`}
                  >
                    {/* Video / Webcam Simulation Viewport */}
                    <div className="aspect-video bg-gradient-to-b from-[#0B0D16] to-[#121524] relative flex items-center justify-center border-b border-[#1E2238]">
                      {/* Bounding Guide Box */}
                      <div className="w-20 h-24 border border-dashed border-[#4F6BED]/40 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-[#4F6BED] font-mono">
                          {cand.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          cand.status === 'flagged' ? 'bg-amber-400 animate-ping' :
                          cand.status === 'reconnecting' ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'
                        }`} />
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-black/60 backdrop-blur text-white">
                          {cand.statusText}
                        </span>
                      </div>

                      <div className="absolute top-2 right-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                        Gaze: {cand.gaze}%
                      </div>

                      {/* Bottom Overlay Info */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-[#8B91B0] bg-black/70 px-2 py-1 rounded">
                        <span>⌨ {cand.keystrokes}</span>
                        <span>{cand.codeProgress}</span>
                        <span>⏱ {cand.timeRemaining}</span>
                      </div>
                    </div>

                    {/* Candidate Metadata & Action */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-[#F0F2FF] font-['Geist',sans-serif]">
                          {cand.name}
                        </h3>
                        <span className="text-[10px] font-mono text-[#4F6BED] bg-[#4F6BED]/10 px-2 py-0.5 rounded">
                          {cand.batch}
                        </span>
                      </div>

                      <p className="text-xs text-[#8B91B0] truncate mb-3">
                        {cand.lastEvent}
                      </p>

                      <div className="mt-auto pt-2 border-t border-[#1E2238] flex gap-2">
                        {cand.flagCount > 0 ? (
                          <button
                            onClick={() => navigate('/teacher/proctoring-review')}
                            className="w-full py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>⚠️ Open Evidence Review ({cand.flagCount})</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate('/assess')}
                            className="w-full py-1.5 bg-[#1C1F30] hover:bg-[#252840] text-[#C0C5DD] rounded-lg text-xs font-medium transition-all"
                          >
                            View Real-Time Code
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: AI Test Generator Studio */}
          {activeTab === 'generator' && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-5">
                {/* Architecture Policy Alert */}
                <div className="p-4 rounded-xl bg-[#4F6BED]/10 border border-[#4F6BED]/30 text-xs text-[#C0C5DD] leading-relaxed flex items-start gap-3">
                  <span className="text-lg">🛡️</span>
                  <div>
                    <span className="font-semibold text-white">System Architecture Flow D (AI Test Authoring):</span>
                    <p className="mt-0.5 text-[#8B91B0]">
                      AI models (Azure OpenAI / LangChain) generate **draft-only specifications**. Generated tests remain in draft state until reviewed and approved by the course instructor. No LLM is in the deterministic scoring path.
                    </p>
                  </div>
                </div>

                {/* Generator Form */}
                <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-6">
                  <h2 className="text-base font-semibold text-[#F0F2FF] font-['Geist',sans-serif] mb-2">
                    Draft Assessment Specification
                  </h2>
                  <p className="text-xs text-[#8B91B0] mb-4">
                    Provide learning objectives, target topic, duration, and constraints for the test generator.
                  </p>

                  <form onSubmit={handleTriggerGenerate} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-[#8B91B0] mb-1.5">
                        Prompt Brief &amp; Topic
                      </label>
                      <textarea
                        rows={4}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="w-full bg-[#0D0F1A] border border-[#252840] rounded-lg p-3 text-sm text-[#F0F2FF] focus:outline-none focus:ring-2 focus:ring-[#4F6BED] font-mono leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[#8B91B0] mb-1">Duration</label>
                        <select className="w-full bg-[#0D0F1A] border border-[#252840] rounded-lg px-3 py-2 text-xs text-white">
                          <option>45 Minutes</option>
                          <option>60 Minutes</option>
                          <option>90 Minutes</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[#8B91B0] mb-1">Target Batch</label>
                        <select className="w-full bg-[#0D0F1A] border border-[#252840] rounded-lg px-3 py-2 text-xs text-white">
                          <option>CSE · Batch A</option>
                          <option>CSE · Batch B</option>
                          <option>IT · Batch 2026</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[#8B91B0] mb-1">Sandbox Profile</label>
                        <select className="w-full bg-[#0D0F1A] border border-[#252840] rounded-lg px-3 py-2 text-xs text-white">
                          <option>gVisor Ephemeral (Kata)</option>
                          <option>Strict Python 3.11 Enclave</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="px-5 py-2.5 bg-[#4F6BED] hover:bg-[#3D5BE0] text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Generating Safe Schema via LangChain...</span>
                        </>
                      ) : (
                        <>
                          <span>⚡ Synthesize Assessment Draft</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Draft Preview (if generated) */}
                {draftGenerated && (
                  <div className="bg-[#141622] border border-amber-500/40 rounded-xl p-6 relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                          Unpublished Draft Version 1.0 (Awaiting Teacher Sign-Off)
                        </span>
                        <h3 className="text-lg font-bold text-[#F0F2FF] mt-2 font-['Geist',sans-serif]">
                          Graph Cycle Detection &amp; Course Prerequisite Order
                        </h3>
                        <p className="text-xs text-[#8B91B0] mt-1">
                          3 Tasks: Topological Sort (Kahn's), Cycle Invariant Proof, Deterministic Benchmark.
                        </p>
                      </div>

                      <button
                        onClick={() => setApprovalModalOpen(true)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-600/20"
                      >
                        ✓ Review &amp; Publish to Batch A
                      </button>
                    </div>

                    <div className="mt-4 p-3 bg-[#0D0F1A] border border-[#252840] rounded-lg font-mono text-xs text-[#C0C5DD] space-y-1">
                      <p><span className="text-[#8B91B0]">// Generated Test Schema:</span></p>
                      <p>Hidden Testcases: 14 Bounded tests (Stored in Blob storage, unexposed to candidate)</p>
                      <p>Time Limit: 1,000ms per testcase | Memory: 256MB cgroup</p>
                      <p>Redaction Filter: 0 PII detected</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar with Guidelines */}
              <div className="space-y-4">
                <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-5">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#8B91B0] mb-3">
                    Batch Mastery Snapshot
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#C0C5DD]">Arrays &amp; Strings</span>
                        <span className="text-emerald-400 font-mono">82%</span>
                      </div>
                      <div className="h-1.5 bg-[#1E2238] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: '82%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#C0C5DD]">Trees &amp; BFS</span>
                        <span className="text-[#4F6BED] font-mono">68%</span>
                      </div>
                      <div className="h-1.5 bg-[#1E2238] rounded-full overflow-hidden">
                        <div className="h-full bg-[#4F6BED] rounded-full" style={{ width: '68%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#C0C5DD]">Graphs &amp; DP (Need Practice)</span>
                        <span className="text-amber-400 font-mono">44%</span>
                      </div>
                      <div className="h-1.5 bg-[#1E2238] rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: '44%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-5">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#8B91B0] mb-2">
                    Teacher Review Mandate
                  </h3>
                  <p className="text-xs text-[#8B91B0] leading-relaxed">
                    Under Board 02 (D / AI Generation contract), test drafts are strictly decoupled from live scoring. The teacher holds final authorship and must audit hidden test assertions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Batches & Class Skill Insights */}
          {activeTab === 'batches' && (
            <div className="space-y-6">
              <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-[#F0F2FF] font-['Geist',sans-serif]">
                    CSE · Batch A Skill Diagnostics
                  </h2>
                  <span className="text-xs text-[#8B91B0]">42 Enrolled · Last synced 2m ago</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-[#0D0F1A] border border-[#252840] rounded-lg">
                    <p className="text-xs text-[#8B91B0]">Recommended Next Focus</p>
                    <p className="text-lg font-bold text-[#F0F2FF] mt-1">Array Pattern Drills</p>
                    <p className="text-[11px] text-[#4F6BED] mt-0.5">+12% estimated cohort readiness gain</p>
                  </div>
                  <div className="p-4 bg-[#0D0F1A] border border-[#252840] rounded-lg">
                    <p className="text-xs text-[#8B91B0]">Average Completion Time</p>
                    <p className="text-lg font-bold text-emerald-400 font-mono mt-1">32m 40s / 45m</p>
                    <p className="text-[11px] text-[#8B91B0] mt-0.5">88% submitted within deadline</p>
                  </div>
                  <div className="p-4 bg-[#0D0F1A] border border-[#252840] rounded-lg">
                    <p className="text-xs text-[#8B91B0]">Proctoring Anomaly Rate</p>
                    <p className="text-lg font-bold text-amber-400 font-mono mt-1">4.7% of attempts</p>
                    <p className="text-[11px] text-[#8B91B0] mt-0.5">All flags resolved by human review</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal: Review & Publish Confirmation */}
        {approvalModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#141622] border border-[#1E2238] rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-[#F0F2FF] font-['Geist',sans-serif]">
                Authoritative Publish Sign-Off
              </h3>
              <p className="text-xs text-[#8B91B0] mt-2 leading-relaxed">
                You are about to publish <strong className="text-white">Graph Cycle Detection</strong> to <strong className="text-white">CSE · Batch A</strong>.
                This will write an immutable record into PostgreSQL and dispatch assignment notifications via Web PubSub.
              </p>
              <div className="mt-4 p-3 bg-[#0D0F1A] rounded-lg border border-[#252840] text-xs font-mono text-[#8B91B0]">
                ✓ Teacher Identity: Prof. Rohan Shah (Signed via Entra ID)<br />
                ✓ Immutable Version: v1.0<br />
                ✓ Hidden Tests: 14 Artifacts Encrypted in Blob
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setApprovalModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#8B91B0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setApprovalModalOpen(false);
                    alert('Assessment published to Batch A! Students will receive real-time assignment banner.');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                >
                  Confirm &amp; Publish
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

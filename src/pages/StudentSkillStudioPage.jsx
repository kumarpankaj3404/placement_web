import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

export default function StudentSkillStudioPage() {
  const navigate = useNavigate();
  const [targetCompany, setTargetCompany] = useState('tcs'); // 'tcs' | 'infosys' | 'google' | 'goldman'
  const [uploadStage, setUploadStage] = useState('clean'); // 'idle' | 'sas' | 'quarantine' | 'scanning' | 'clean'
  const [selectedDrill, setSelectedDrill] = useState(null);

  function simulateResumeUpload() {
    setUploadStage('sas');
    setTimeout(() => {
      setUploadStage('quarantine');
      setTimeout(() => {
        setUploadStage('scanning');
        setTimeout(() => {
          setUploadStage('clean');
        }, 1200);
      }, 1000);
    }, 800);
  }

  return (
    <div className="min-h-screen bg-[#0D0F1A] flex font-['Inter',sans-serif]">
      <Sidebar activePage="skill-studio" />

      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="border-b border-[#1E2238] px-8 py-5 bg-[#0F1221]/60 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#4F6BED] bg-[#4F6BED]/10 border border-[#4F6BED]/20 px-2 py-0.5 rounded">
                  Student Workspace · Career AI Copilot
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Flow F Quarantine-Isolated
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#F0F2FF] font-['Geist',sans-serif] mt-1">
                AI Skill-Gap &amp; Placement Readiness Studio
              </h1>
              <p className="text-xs text-[#8B91B0]">
                Candidate: <span className="text-[#F0F2FF] font-semibold">Aanya Rao</span> · Target: <span className="text-[#4F6BED] font-semibold">TCS Digital / Infosys DSE / Product Tier</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/assess')}
                className="px-4 py-2 bg-[#4F6BED] hover:bg-[#3D5BE0] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-[#4F6BED]/20"
              >
                <span>🚀 Launch Focused Practice Sandbox</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Section 1: Architecture Flow F - Secure Resume Upload Pipeline */}
          <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#F0F2FF] font-['Geist',sans-serif]">
                  Secure Resume Ingestion Pipeline (Architecture Flow F)
                </h3>
                <p className="text-xs text-[#8B91B0]">
                  Browser uploads via short-lived SAS → Defender scan quarantine → PII-redacted Clean Blob → LangChain Skill Extractor
                </p>
              </div>
              <button
                onClick={simulateResumeUpload}
                className="px-3 py-1.5 bg-[#1C1F30] hover:bg-[#4F6BED]/20 border border-[#252840] hover:border-[#4F6BED] text-xs font-semibold text-[#F0F2FF] rounded-lg transition-all"
              >
                ↻ Re-Analyze Resume (PDF)
              </button>
            </div>

            {/* Pipeline Step Progress Visualizer */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              <div className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                uploadStage !== 'idle' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#0D0F1A] border-[#252840] text-[#8B91B0]'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span>1. Scoped SAS</span>
                  <span>{uploadStage !== 'idle' ? '✓ Issued' : 'Pending'}</span>
                </div>
                <p className="text-[10px] text-[#8B91B0]">Short-lived token, no creds</p>
              </div>

              <div className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                uploadStage === 'quarantine' || uploadStage === 'scanning' || uploadStage === 'clean'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-[#0D0F1A] border-[#252840] text-[#8B91B0]'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span>2. Quarantine Blob</span>
                  <span>{uploadStage === 'quarantine' ? 'Writing...' : uploadStage === 'idle' ? 'Pending' : '✓ Isolated'}</span>
                </div>
                <p className="text-[10px] text-[#8B91B0]">No direct internal read</p>
              </div>

              <div className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                uploadStage === 'scanning'
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 animate-pulse'
                  : uploadStage === 'clean'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-[#0D0F1A] border-[#252840] text-[#8B91B0]'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span>3. Malware Scan</span>
                  <span>{uploadStage === 'scanning' ? 'Scanning...' : uploadStage === 'clean' ? '✓ Clean' : 'Pending'}</span>
                </div>
                <p className="text-[10px] text-[#8B91B0]">Defender verified verdict</p>
              </div>

              <div className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                uploadStage === 'clean' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#0D0F1A] border-[#252840] text-[#8B91B0]'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span>4. Clean AI Model</span>
                  <span>{uploadStage === 'clean' ? '✓ Promoted' : 'Locked'}</span>
                </div>
                <p className="text-[10px] text-[#8B91B0]">Only verified clean ingested</p>
              </div>
            </div>
          </div>

          {/* Section 2: Target Company Tier & Competency Breakdown */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left 4 Cols: Company Match Selector */}
            <div className="col-span-4 bg-[#141622] border border-[#1E2238] rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#8B91B0]">
                Company Placement Targets
              </h3>

              <div className="space-y-2">
                {[
                  { id: 'tcs', name: 'TCS Digital / Prime', readiness: '84%', match: 'High Match', color: 'text-emerald-400' },
                  { id: 'infosys', name: 'Infosys DSE & Specialist', readiness: '79%', match: 'High Match', color: 'text-emerald-400' },
                  { id: 'google', name: 'Google / Tier-1 Tech', readiness: '64%', match: 'Gap: Graph/DP', color: 'text-amber-400' },
                  { id: 'goldman', name: 'Goldman Sachs Engineering', readiness: '68%', match: 'Gap: Concurrency', color: 'text-amber-400' },
                ].map((co) => (
                  <div
                    key={co.id}
                    onClick={() => setTargetCompany(co.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      targetCompany === co.id
                        ? 'bg-[#4F6BED]/15 border-[#4F6BED] text-white shadow-md'
                        : 'bg-[#0D0F1A] border-[#252840] text-[#8B91B0] hover:border-[#4F6BED]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{co.name}</span>
                      <span className={`text-xs font-mono font-bold ${co.color}`}>{co.readiness}</span>
                    </div>
                    <p className="text-[11px] text-[#8B91B0] mt-1">{co.match}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#1E2238]">
                <p className="text-[11px] text-[#8B91B0]">
                  Target benchmark updated daily from Azure SQL institutional analytical read model.
                </p>
              </div>
            </div>

            {/* Right 8 Cols: Skill Gap Action Plan */}
            <div className="col-span-8 bg-[#141622] border border-[#1E2238] rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#F0F2FF] font-['Geist',sans-serif]">
                    Next High-ROI Skill Recommendations
                  </h3>
                  <p className="text-xs text-[#8B91B0]">
                    Generated by LangChain skill extraction against clean candidate resume + mock results.
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  Overall Readiness: 68%
                </span>
              </div>

              {/* Actionable Skill Items */}
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-[#0D0F1A] border border-amber-500/30 flex items-center justify-between">
                  <div className="space-y-1 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase font-semibold">
                        Priority #1
                      </span>
                      <h4 className="text-sm font-semibold text-[#F0F2FF]">Two-Pointer &amp; Sliding Window Array Patterns</h4>
                    </div>
                    <p className="text-xs text-[#8B91B0]">
                      Frequent interview blocker for TCS Digital &amp; Infosys DSE. 3 drills remaining to reach 90% benchmark.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/assess')}
                    className="px-3.5 py-2 bg-[#4F6BED] hover:bg-[#3D5BE0] text-white text-xs font-semibold rounded-lg transition-all"
                  >
                    Start 15m Drill →
                  </button>
                </div>

                <div className="p-4 rounded-lg bg-[#0D0F1A] border border-[#252840] flex items-center justify-between">
                  <div className="space-y-1 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4F6BED]/10 text-[#4F6BED] border border-[#4F6BED]/20 uppercase font-semibold">
                        Priority #2
                      </span>
                      <h4 className="text-sm font-semibold text-[#F0F2FF]">Binary Tree Level Order &amp; BFS Invariants</h4>
                    </div>
                    <p className="text-xs text-[#8B91B0]">
                      Current accuracy 78%. Practice queue-based iteration without recursion.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/assess')}
                    className="px-3.5 py-2 bg-[#1C1F30] hover:bg-[#4F6BED] text-white text-xs font-semibold rounded-lg transition-all border border-[#252840]"
                  >
                    Practice Sandbox →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Gamified Rounds (Aptitude Sprint, Debug Challenge, Prompt Coding) */}
          <div>
            <h3 className="text-base font-bold text-[#F0F2FF] font-['Geist',sans-serif] mb-3">
              Gamified Placement Sprints (From Access Map)
            </h3>
            <div className="grid grid-cols-3 gap-5">
              {/* Sprint 1 */}
              <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-5 hover:border-[#4F6BED] transition-all flex flex-col group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">⚡</span>
                  <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">
                    Level 3 · Aptitude Sprint
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#F0F2FF] font-['Geist',sans-serif] group-hover:text-[#4F6BED] transition-colors">
                  Speed Quant &amp; Numerical Logic
                </h4>
                <p className="text-xs text-[#8B91B0] mt-1 mb-4 flex-1">
                  15 quick-fire multiple-choice problems covering Permutations, Probability, and Work-Time mechanics.
                </p>
                <div className="flex items-center justify-between text-xs text-[#8B91B0] pt-3 border-t border-[#1E2238]">
                  <span>⏱ 15 Minutes</span>
                  <span className="text-amber-400 font-mono font-semibold">+150 XP</span>
                </div>
                <button
                  onClick={() => navigate('/assess')}
                  className="mt-3 w-full py-2 bg-[#1C1F30] hover:bg-[#4F6BED] text-white text-xs font-semibold rounded-lg transition-all"
                >
                  Start Sprint →
                </button>
              </div>

              {/* Sprint 2 */}
              <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-5 hover:border-[#4F6BED] transition-all flex flex-col group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">🐞</span>
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                    Debug Challenge
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#F0F2FF] font-['Geist',sans-serif] group-hover:text-[#4F6BED] transition-colors">
                  Find it. Fix it. Learn.
                </h4>
                <p className="text-xs text-[#8B91B0] mt-1 mb-4 flex-1">
                  Pre-populated broken code snippet with subtle off-by-one and memory leaks. Identify and commit test-passing fixes.
                </p>
                <div className="flex items-center justify-between text-xs text-[#8B91B0] pt-3 border-t border-[#1E2238]">
                  <span>⏱ 20 Minutes</span>
                  <span className="text-emerald-400 font-mono font-semibold">+200 XP</span>
                </div>
                <button
                  onClick={() => navigate('/assess')}
                  className="mt-3 w-full py-2 bg-[#1C1F30] hover:bg-[#4F6BED] text-white text-xs font-semibold rounded-lg transition-all"
                >
                  Enter Debug Sandbox →
                </button>
              </div>

              {/* Sprint 3 */}
              <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-5 hover:border-[#4F6BED] transition-all flex flex-col group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">📝</span>
                  <span className="text-[10px] font-mono uppercase bg-[#4F6BED]/10 text-[#4F6BED] px-2 py-0.5 rounded">
                    Prompt Coding
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#F0F2FF] font-['Geist',sans-serif] group-hover:text-[#4F6BED] transition-colors">
                  Build From A Brief
                </h4>
                <p className="text-xs text-[#8B91B0] mt-1 mb-4 flex-1">
                  Modern enterprise prompt challenge: translate product requirements into clean modular classes with docstrings.
                </p>
                <div className="flex items-center justify-between text-xs text-[#8B91B0] pt-3 border-t border-[#1E2238]">
                  <span>⏱ 30 Minutes</span>
                  <span className="text-[#4F6BED] font-mono font-semibold">+250 XP</span>
                </div>
                <button
                  onClick={() => navigate('/assess')}
                  className="mt-3 w-full py-2 bg-[#1C1F30] hover:bg-[#4F6BED] text-white text-xs font-semibold rounded-lg transition-all"
                >
                  Launch Prompt Task →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

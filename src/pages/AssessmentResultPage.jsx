import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const MOCK_TEST_CASES = [
  {
    id: 'Test 1',
    type: 'Public Sample',
    status: 'PASSED',
    input: 'root = [3,9,20,null,null,15,7]',
    expected: '[[3],[9,20],[15,7]]',
    cpuTime: '3.1ms',
    memory: '17.2 MB',
    exitCode: 0,
    sandbox: 'gVisor Ephemeral Container',
    ioHash: '0x3a9f...88c2',
  },
  {
    id: 'Test 2',
    type: 'Hidden Edge Cases',
    status: 'PASSED',
    input: 'root = [1] (Single node) & root = [] (Empty tree)',
    expected: '[[1]] & []',
    cpuTime: '2.8ms',
    memory: '17.1 MB',
    exitCode: 0,
    sandbox: 'gVisor Ephemeral Container',
    ioHash: '0x99e1...12ff',
  },
  {
    id: 'Test 3',
    type: 'Extreme Scale & Deep Tree',
    status: 'PASSED',
    input: 'root = [1..2000 balanced binary tree, depth 11]',
    expected: '11 level arrays, N=2000 ordered',
    cpuTime: '4.2ms',
    memory: '17.3 MB',
    exitCode: 0,
    sandbox: 'gVisor Ephemeral Container',
    ioHash: '0xbb44...77d3',
  },
];

export default function AssessmentResultPage() {
  const navigate = useNavigate();
  const { attemptId = 'ATT-8942' } = useParams();
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [viewCodeModalOpen, setViewCodeModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0D0F1A] flex font-['Inter',sans-serif]">
      <Sidebar activePage="assess" />

      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="border-b border-[#1E2238] px-8 py-5 bg-[#0F1221]/70 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-xs text-[#8B91B0] hover:text-[#4F6BED] transition-colors"
                >
                  ← Student Hub
                </button>
                <span className="text-[#3A3F58]">/</span>
                <span className="text-[10px] font-mono text-[#8B91B0]">Assessments</span>
                <span className="text-[#3A3F58]">/</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                  Attempt #{attemptId} Evaluated
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#F0F2FF] font-['Geist',sans-serif] mt-1">
                Binary Tree Level Order Traversal · Official Evaluation
              </h1>
              <p className="text-xs text-[#8B91B0]">
                Candidate: <span className="text-white font-semibold">Aanya Rao (Batch A)</span> · Assessment Context: <span className="text-[#4F6BED] font-semibold">Goldman Sachs Quantitative Pre-Screen</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCertModalOpen(true)}
                className="px-3.5 py-2 bg-[#1C1F30] hover:bg-[#252840] border border-[#252840] text-[#F0F2FF] rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <span>📜 Download Certificate (.pdf)</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-[#4F6BED] hover:bg-[#3D5BE0] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-[#4F6BED]/20"
              >
                <span>Return to Student Hub →</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Section 1: Official Deterministic Score Banner */}
          <div className="bg-[#141622] border border-emerald-500/40 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.08)]">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
                    Official Deterministic Result · 100% Passed
                  </span>
                  <span className="text-[10px] font-mono text-[#8B91B0]">
                    SHA-256 Commit: <span className="text-slate-300">0x8f2a...99c1</span>
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-5xl font-black text-white font-['Geist',sans-serif] tracking-tight">
                    150 <span className="text-2xl text-[#8B91B0] font-normal">/ 150 pts</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Tier-1 Benchmark Exceeded
                  </span>
                </div>
                <p className="text-xs text-[#8B91B0] mt-1">
                  All 3 public and hidden test suites satisfied without memory violations or timeouts.
                </p>
              </div>

              {/* Database Storage Callout as per Architecture */}
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-[#8B91B0]">Data Persistence Contract:</span>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    PostgreSQL ACID Canonical
                  </span>
                  <span className="text-[10px] font-mono text-[#4F6BED] bg-[#4F6BED]/10 border border-[#4F6BED]/20 px-2 py-0.5 rounded">
                    MongoDB Run Log #Shard-04
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  PostgreSQL owns official score. MongoDB holds diagnostic run details.
                </p>
              </div>
            </div>

            {/* Execution Metrics Bar */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-5 border-t border-[#1E2238]">
              <div className="p-3 bg-[#0D0F1A] border border-[#252840] rounded-lg">
                <span className="text-[10px] font-mono uppercase text-[#8B91B0]">Time Window Pacing</span>
                <p className="text-lg font-bold font-mono text-white mt-0.5">20m 42s / 25m</p>
                <p className="text-[10px] text-emerald-400">82.8% used · 4m 18s reserve</p>
              </div>

              <div className="p-3 bg-[#0D0F1A] border border-[#252840] rounded-lg">
                <span className="text-[10px] font-mono uppercase text-[#8B91B0]">Execution Latency</span>
                <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5">3.0ms avg</p>
                <p className="text-[10px] text-slate-400">Top 5% speed in Stanford cohort</p>
              </div>

              <div className="p-3 bg-[#0D0F1A] border border-[#252840] rounded-lg">
                <span className="text-[10px] font-mono uppercase text-[#8B91B0]">Peak Memory RSS</span>
                <p className="text-lg font-bold font-mono text-white mt-0.5">17.2 MB</p>
                <p className="text-[10px] text-slate-400">cgroup cap: 256 MB</p>
              </div>

              <div className="p-3 bg-[#0D0F1A] border border-[#252840] rounded-lg">
                <span className="text-[10px] font-mono uppercase text-[#8B91B0]">Sandbox Security</span>
                <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5">gVisor Enclave</p>
                <p className="text-[10px] text-slate-400">0 syscall faults · Exit code 0</p>
              </div>
            </div>
          </div>

          {/* Section 2: Deterministic Sandbox Execution Matrix */}
          <div className="bg-[#141622] border border-[#1E2238] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1E2238] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#F0F2FF] font-['Geist',sans-serif]">
                  Deterministic Sandbox Execution Matrix
                </h3>
                <p className="text-xs text-[#8B91B0]">
                  Isolated gVisor runtime telemetry across public sample and institutional hidden test suites.
                </p>
              </div>
              <button
                onClick={() => setViewCodeModalOpen(true)}
                className="text-xs text-[#4F6BED] hover:underline font-semibold"
              >
                Inspect Submitted Solution Code ↗
              </button>
            </div>

            <table className="w-full text-left text-xs text-[#C0C5DD]">
              <thead className="bg-[#0D0F1A] text-[10px] uppercase font-mono text-[#8B91B0] border-b border-[#1E2238]">
                <tr>
                  <th className="px-6 py-3">Testcase Suite</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Input Parameters / Boundary</th>
                  <th className="px-6 py-3">CPU Time</th>
                  <th className="px-6 py-3">Memory</th>
                  <th className="px-6 py-3">Exit Code</th>
                  <th className="px-6 py-3 text-right">Cryptographic Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2238]">
                {MOCK_TEST_CASES.map((tc) => (
                  <tr key={tc.id} className="hover:bg-[#1C1F30]/50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-white">
                      <p className="font-semibold">{tc.id}</p>
                      <span className="text-[10px] font-mono text-[#8B91B0]">{tc.type}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                        ✓ {tc.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-300 max-w-xs truncate">{tc.input}</td>
                    <td className="px-6 py-3.5 font-mono text-emerald-400">{tc.cpuTime}</td>
                    <td className="px-6 py-3.5 font-mono text-slate-300">{tc.memory}</td>
                    <td className="px-6 py-3.5 font-mono text-white">{tc.exitCode}</td>
                    <td className="px-6 py-3.5 text-right font-mono text-slate-500">{tc.ioHash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 3: Flow D - LangChain AI Career Copilot Analysis */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 bg-[#141622] border border-[#1E2238] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#4F6BED] bg-[#4F6BED]/10 border border-[#4F6BED]/30 px-2 py-0.5 rounded font-semibold">
                      Flow D · LangChain AI Career Copilot
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      ✓ Teacher-Reviewed &amp; Approved by Prof. Rohan Shah
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#F0F2FF] font-['Geist',sans-serif] mt-1">
                    Algorithmic Mastery &amp; Skill-Gap Diagnostic
                  </h3>
                </div>
              </div>

              {/* Strengths */}
              <div className="p-4 rounded-lg bg-[#0D0F1A] border border-[#252840] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Verified Candidate Strengths:
                </span>
                <p className="text-xs text-[#C0C5DD] leading-relaxed">
                  • <strong>Optimal Queue Abstraction:</strong> Used <code>collections.deque</code> for level-by-level BFS traversal, preventing Python list \(O(N)\) pop overhead from head.
                </p>
                <p className="text-xs text-[#C0C5DD] leading-relaxed">
                  • <strong>Clean Boundary Invariant:</strong> Correctly snapshotted <code>level_size = len(queue)</code> at the loop initiation, avoiding dynamic queue extension bugs.
                </p>
              </div>

              {/* Next Practice Recommendation */}
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Next Recommended Practice Sprint:
                  </span>
                  <h4 className="text-sm font-semibold text-white mt-0.5">
                    Array Pattern Sprint &amp; Graph Topological Sort
                  </h4>
                  <p className="text-xs text-[#8B91B0]">
                    Completing these drills will increase your Google / TCS Digital benchmark readiness to <strong>88%</strong>.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/career-copilot')}
                  className="px-4 py-2 bg-[#4F6BED] hover:bg-[#3D5BE0] text-white text-xs font-semibold rounded-lg transition-all"
                >
                  Launch Practice Drill →
                </button>
              </div>
            </div>

            {/* Right Column: Proctoring Attestation Seal */}
            <div className="col-span-4 bg-[#141622] border border-[#1E2238] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  🛡️
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase font-mono">Proctoring Attestation</h4>
                  <span className="text-[10px] text-emerald-400 font-mono">0 Security Anomalies</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[#C0C5DD]">
                <div className="flex justify-between py-1 border-b border-[#1E2238]">
                  <span className="text-[#8B91B0]">WebRTC Gaze Lock:</span>
                  <span className="font-mono text-emerald-400 font-semibold">99.4% Centered</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E2238]">
                  <span className="text-[#8B91B0]">Window Focus Drops:</span>
                  <span className="font-mono text-white font-semibold">0 Alt-Tabs</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E2238]">
                  <span className="text-[#8B91B0]">Keystroke Dynamics:</span>
                  <span className="font-mono text-emerald-400 font-semibold">Authentic Human</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E2238]">
                  <span className="text-[#8B91B0]">Hardware Enclave:</span>
                  <span className="font-mono text-white font-semibold">TPM 2.0 Attested</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] text-[#8B91B0] leading-relaxed">
                  Cryptographically sealed by Enclave Node #US-EAST-09 and stored against PostgreSQL attempt record.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Certificate Preview */}
        {certModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#141622] border border-[#1E2238] rounded-2xl max-w-lg w-full p-7 shadow-2xl">
              <div className="text-center pb-4 border-b border-[#1E2238]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#4F6BED]">PlacePrep Secure · Certified Result</span>
                <h3 className="text-xl font-bold text-white font-['Geist',sans-serif] mt-1">
                  Certificate of Assessment Excellence
                </h3>
                <p className="text-xs text-[#8B91B0]">Official Institutional Evaluation Transcript</p>
              </div>

              <div className="my-5 p-4 bg-[#0D0F1A] border border-[#252840] rounded-xl text-center space-y-2">
                <p className="text-xs text-[#8B91B0]">This certifies that</p>
                <p className="text-lg font-bold text-white font-['Geist',sans-serif]">Aanya Rao (Batch A · 2026)</p>
                <p className="text-xs text-[#8B91B0]">has achieved a deterministic score of</p>
                <p className="text-3xl font-black text-emerald-400 font-mono">150 / 150 Points (100%)</p>
                <p className="text-xs text-[#C0C5DD]">in Binary Tree Level Order Traversal</p>
                <div className="pt-2 text-[9px] font-mono text-[#4A506B]">
                  Signature: SHA256:0x8f2a44bb9910ccee114 · Verified by Northbridge Institute
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setCertModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#8B91B0] hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setCertModalOpen(false);
                    alert('Certificate downloaded with cryptographic .sig envelope!');
                  }}
                  className="px-4 py-2 bg-[#4F6BED] hover:bg-[#3D5BE0] text-white rounded-lg text-xs font-semibold"
                >
                  Download .PDF &amp; .SIG Manifest
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: View Code */}
        {viewCodeModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#141622] border border-[#1E2238] rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2238]">
                <h3 className="text-sm font-bold text-white font-mono">solution.py · Evaluated Artifact</h3>
                <button onClick={() => setViewCodeModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <pre className="mt-4 p-4 bg-[#090A0F] border border-[#252840] rounded-xl font-mono text-xs text-[#C0C5DD] overflow-x-auto max-h-96">
{`from collections import deque
from typing import Optional, List

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []

        result = []
        queue = deque([root])

        while queue:
            level_size = len(queue)
            current_level = []

            for _ in range(level_size):
                node = queue.popleft()
                current_level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

            result.append(current_level)

        return result`}
              </pre>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setViewCodeModalOpen(false)}
                  className="px-4 py-2 bg-[#1C1F30] text-white rounded-lg text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCode, setLanguage } from '../store/slices/assessmentSlice';

/* ─── Server-Authoritative Timer ────────────────────────────
 *
 * IMPORTANT: The browser clock is STRICTLY UNTRUSTED.
 * This component derives remaining time from:
 *   deadline_at (server ISO timestamp) + serverTimeOffset (ms drift correction)
 *
 * serverTimeOffset = server_time - local_time, measured at session init
 * and refreshed on each WebSocket time-sync heartbeat.
 *
 * Formula: remainingMs = new Date(deadlineAt) - (Date.now() + serverTimeOffset)
 */
function ServerAuthoritativeTimer({ deadlineAt, serverTimeOffset = 0 }) {
  const [remainingMs, setRemainingMs] = useState(null);

  useEffect(() => {
    if (!deadlineAt) return;
    const tick = () => {
      const serverNow = Date.now() + serverTimeOffset;
      const deadline = new Date(deadlineAt).getTime();
      setRemainingMs(Math.max(0, deadline - serverNow));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadlineAt, serverTimeOffset]);

  if (remainingMs === null) {
    return (
      <div className="flex items-center gap-2 bg-[#1A1200] border border-amber-500/30 px-3 py-1.5 rounded-lg">
        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
        <span className="font-mono text-amber-400 text-sm font-bold">Syncing…</span>
      </div>
    );
  }

  const totalSecs = Math.floor(remainingMs / 1000);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  const isWarning = remainingMs < 5 * 60 * 1000; // < 5 min
  const isCritical = remainingMs < 60 * 1000;     // < 1 min

  const fmt = (n) => String(n).padStart(2, '0');
  const display = hrs > 0 ? `${fmt(hrs)}:${fmt(mins)}:${fmt(secs)}` : `${fmt(mins)}:${fmt(secs)}`;

  return (
    <div
      title="Server-authoritative deadline. Browser clock not trusted."
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm transition-all ${
        isCritical
          ? 'bg-red-950/40 border-red-500/40 text-red-400 animate-pulse'
          : isWarning
          ? 'bg-amber-950/30 border-amber-500/30 text-amber-400'
          : 'bg-[#1A1C2E] border-[#252840] text-[#8B91B0]'
      }`}
    >
      ⏱ {display}
    </div>
  );
}

/* ─── Proctoring Connection Status ──────────────────────── */
function ProctoringStatus({ status, latencyMs, peerNode }) {
  const isHealthy = status === 'healthy';
  const isReconnecting = status === 'reconnecting';

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold border ${
      isHealthy
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : isReconnecting
        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
        : 'bg-red-500/10 text-red-400 border-red-500/20'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isHealthy ? 'bg-emerald-400' : isReconnecting ? 'bg-amber-400 animate-ping' : 'bg-red-400'}`} />
      {isHealthy ? 'CONNECTED' : isReconnecting ? 'RECONNECTING' : 'DISCONNECTED'}
      {isHealthy && latencyMs && (
        <span className="text-emerald-600 font-normal ml-1">· {latencyMs}ms</span>
      )}
    </div>
  );
}

/* ─── Problem Pane ───────────────────────────────────────── */

const MOCK_PROBLEM = {
  context: 'Goldman Sachs · Quantitative Pre-Screen · Section 2: Data Structures',
  title: 'Binary Tree Level Order Traversal',
  difficulty: 'Medium',
  points: 150,
  recommended: '25 mins',
  description: `Given the root of a binary tree, return the level-order traversal of its node values (i.e., from left to right, level by level).`,
  examples: [
    { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
    { input: 'root = [1]', output: '[[1]]' },
    { input: 'root = []', output: '[]' },
  ],
  constraints: [
    'Number of nodes in range [0, 2000]',
    '-1000 ≤ Node.val ≤ 1000',
    'Time complexity target: O(N)',
    'Memory limit: 256 MB',
  ],
};

function ProblemPane({ tab, onTabChange }) {
  return (
    <div className="w-80 flex-shrink-0 border-r border-[#1E2230] bg-[#0D0F17] flex flex-col overflow-hidden">
      {/* Context header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#1E2230]">
        <p className="text-[10px] font-mono text-[#4A506B] mb-2">{MOCK_PROBLEM.context}</p>
        <h2 className="text-sm font-bold text-[#F0F2FF] font-['Geist',sans-serif] leading-tight mb-2">
          {MOCK_PROBLEM.title}
        </h2>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {MOCK_PROBLEM.difficulty}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4F6BED]/10 text-[#4F6BED] border border-[#4F6BED]/20">
            {MOCK_PROBLEM.points} pts
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C2030] text-[#8B91B0] border border-[#252840]">
            ⏱ {MOCK_PROBLEM.recommended}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1E2230] px-4">
        {['description', 'submissions', 'editorial'].map((t) => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={`py-2.5 px-3 text-xs font-medium capitalize transition-colors ${
              tab === t
                ? 'text-[#4F6BED] border-b-2 border-[#4F6BED]'
                : 'text-[#8B91B0] hover:text-[#F0F2FF]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 text-sm text-[#C0C5DD]">
        <p className="leading-relaxed">{MOCK_PROBLEM.description}</p>

        <div className="space-y-3">
          {MOCK_PROBLEM.examples.map((ex, i) => (
            <div key={i} className="bg-[#090A0F] border border-[#1E2230] rounded-lg p-3">
              <p className="text-[10px] text-[#8B91B0] mb-1.5 font-mono font-semibold">Example {i + 1}</p>
              <p className="font-mono text-xs text-[#C0C5DD]">
                <span className="text-[#8B91B0]">Input: </span>{ex.input}
              </p>
              <p className="font-mono text-xs text-[#C0C5DD]">
                <span className="text-[#8B91B0]">Output: </span>{ex.output}
              </p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-[10px] text-[#8B91B0] uppercase tracking-widest font-semibold mb-2">Constraints</p>
          <ul className="space-y-1">
            {MOCK_PROBLEM.constraints.map((c, i) => (
              <li key={i} className="text-xs font-mono text-[#C0C5DD] flex gap-2">
                <span className="text-[#4F6BED]">•</span>{c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─── Code Editor Pane ───────────────────────────────────── */

const DEFAULT_CODE = `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from collections import deque
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

        return result
`;

const MOCK_TEST_RESULTS = [
  { id: 1, status: 'PASSED', time: '3ms', memory: '17.2MB' },
  { id: 2, status: 'PASSED', time: '4ms', memory: '17.1MB' },
  { id: 3, status: 'PASSED', time: '2ms', memory: '17.3MB' },
];

function CodeEditorPane({ code, setCode, language, setLanguage, deadlineAt, serverTimeOffset, onSubmitSolution, onExitSandbox }) {
  const [consoleTab, setConsoleTabLocal] = useState('testResults');
  const [isRunning, setIsRunning] = useState(false);

  function handleRun() {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 1500);
  }

  const lines = code.split('\n');

  return (
    <div className="flex-1 flex flex-col min-w-0 border-r border-[#1E2230] bg-[#090A0F]">
      {/* Editor Top Bar */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-[#1E2230] bg-[#0E1017] flex-shrink-0 gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExitSandbox}
            title="Exit Immersion Mode (Back to Student Hub)"
            className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-[#141622] border border-[#252840]"
          >
            ← Exit
          </button>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#141622] border border-[#252840] text-[#C0C5DD] text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4F6BED]"
          >
            <option value="python">Python 3.11</option>
            <option value="javascript">JavaScript (Node 20)</option>
            <option value="java">Java 21</option>
            <option value="cpp">C++ 20</option>
          </select>
          <span className="text-[10px] font-mono text-[#4A506B] hidden sm:block">14px · Standard</span>
        </div>

        {/* Server Sync + Timer */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-emerald-400 hidden md:flex items-center gap-1">
            <span className="w-1 h-1 bg-emerald-400 rounded-full" />SYNCED · TLS 1.3 ENCLAVE
          </span>
          <ServerAuthoritativeTimer deadlineAt={deadlineAt} serverTimeOffset={serverTimeOffset} />
        </div>
      </div>

      {/* File Tab */}
      <div className="flex border-b border-[#1E2230] bg-[#0C0D12] flex-shrink-0">
        <div className="px-4 py-2 text-xs font-mono text-[#4F6BED] border-b-2 border-[#4F6BED] bg-[#090A0F] flex items-center gap-1.5">
          <span className="text-[#8B91B0]">🐍</span> solution.py
        </div>
      </div>

      {/* Code area */}
      <div className="flex-1 overflow-auto">
        <div className="flex min-h-full">
          {/* Line numbers */}
          <div className="select-none py-3 px-2 text-right bg-[#090A0F] border-r border-[#1E2230] min-w-[3rem]">
            {lines.map((_, i) => (
              <div key={i} className="text-[11px] font-mono leading-5 text-[#3A3F58]">{i + 1}</div>
            ))}
          </div>
          {/* Editor */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 py-3 px-4 font-['JetBrains_Mono',monospace] text-xs leading-5 text-[#C0C5DD] bg-[#090A0F] resize-none focus:outline-none caret-[#4F6BED] selection:bg-[#4F6BED]/30 min-h-full"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>
      </div>

      {/* Console */}
      <div className="h-44 border-t border-[#1E2230] bg-[#0D0F16] flex flex-col flex-shrink-0">
        <div className="flex items-center justify-between px-3 border-b border-[#1E2230]">
          <div className="flex">
            {['testResults', 'terminal', 'custom'].map((t) => (
              <button
                key={t}
                onClick={() => setConsoleTabLocal(t)}
                className={`py-2 px-3 text-[11px] font-medium transition-colors ${consoleTab === t ? 'text-[#4F6BED] border-b-2 border-[#4F6BED]' : 'text-[#8B91B0] hover:text-[#F0F2FF]'}`}
              >
                {t === 'testResults' ? 'Test Results' : t === 'terminal' ? 'Terminal Output' : 'Custom Testcases'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Deterministic Sandbox Ready
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {MOCK_TEST_RESULTS.map((r) => (
            <div key={r.id} className="flex items-center gap-2 text-xs font-mono">
              <span className="text-emerald-400">✓</span>
              <span className="text-[#C0C5DD]">Testcase {r.id}:</span>
              <span className={r.status === 'PASSED' ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>{r.status}</span>
              <span className="text-[#4A506B]">({r.time}, {r.memory})</span>
            </div>
          ))}
        </div>
        {/* Action Bar */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-[#1E2230]">
          <span className="text-[11px] text-[#4A506B] font-mono">Run & observe against private suite</span>
          <div className="flex gap-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#1C2030] hover:bg-[#252840] border border-[#252840] text-xs font-semibold text-[#C0C5DD] transition-all disabled:opacity-50"
            >
              {isRunning ? <span className="w-3 h-3 border border-[#C0C5DD]/30 border-t-[#C0C5DD] rounded-full animate-spin" /> : '▶'}
              {isRunning ? 'Running…' : 'Run Code'}
            </button>
            <button
              type="button"
              onClick={onSubmitSolution}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#4F6BED] hover:bg-[#3D5BE0] text-white text-xs font-semibold transition-all shadow-md shadow-[#4F6BED]/20"
            >
              ↑ Submit Solution
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Proctoring Pane ────────────────────────────────────── */

function ProctoringPane({ connectionStatus, latencyMs, peerNode }) {
  const telemetry = [
    { label: 'Gaze Focus', value: 'Centered (99.4%)', ok: true },
    { label: 'Single Screen', value: 'Verified', ok: true },
    { label: 'Secondary Audio', value: 'Not Detected', ok: true },
    { label: 'Keystroke Dynamics', value: 'Nominal', ok: true },
  ];

  return (
    <div className="w-72 flex-shrink-0 bg-[#0D0F17] flex flex-col text-xs overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1E2230]">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-[#4F6BED]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <span className="text-sm font-semibold text-[#F0F2FF] font-['Geist',sans-serif]">Proctoring Telemetry</span>
        </div>

        {/* Connection Status */}
        <ProctoringStatus status={connectionStatus} latencyMs={latencyMs} peerNode={peerNode} />
        {connectionStatus === 'healthy' && (
          <p className="text-[10px] font-mono text-[#4A506B] mt-1.5">{latencyMs}ms · WebRTC Peer #{peerNode || 'US-WEST-2B'}</p>
        )}
        {connectionStatus === 'reconnecting' && (
          <p className="text-[10px] font-mono text-amber-600 mt-1.5">Packet loss 12% · Attempting reconnect…</p>
        )}
      </div>

      {/* Camera Feed */}
      <div className="mx-4 mt-4 bg-[#080A10] border border-[#1E2230] rounded-xl overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center bg-gradient-to-b from-[#0D0F1A] to-[#080A10]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-28 border border-dashed border-[#4F6BED]/40 rounded-lg opacity-60" />
          </div>
          <div className="text-center z-10">
            <div className="w-10 h-10 rounded-full bg-[#4F6BED]/20 border border-[#4F6BED]/30 mx-auto mb-1 flex items-center justify-center text-sm">AM</div>
            <p className="text-[9px] font-mono text-[#4A506B]">Arjun Mehta · PP-8892</p>
          </div>
          <div className="absolute bottom-2 right-2 flex gap-1">
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded">● CAM</span>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded">● MIC</span>
          </div>
          <div className="absolute top-2 left-2 text-[9px] font-mono text-[#4A506B]">
            {new Date().toISOString().slice(0, 19)} UTC
          </div>
        </div>
      </div>

      {/* Audio Level */}
      <div className="px-4 mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold text-[#8B91B0] uppercase tracking-wider">Audio Level</span>
          <span className="text-[10px] font-mono text-emerald-400">22 dB · Quiet</span>
        </div>
        <div className="h-1.5 bg-[#1E2230] rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400/60 rounded-full" style={{ width: '22%' }} />
        </div>
      </div>

      {/* Environmental Telemetry */}
      <div className="px-4 mt-4 space-y-1.5">
        <p className="text-[10px] font-semibold text-[#8B91B0] uppercase tracking-wider mb-2">Environmental Feed</p>
        {telemetry.map((t) => (
          <div key={t.label} className="flex items-center justify-between py-1.5 px-2 rounded bg-[#0D0F17] border border-[#151820]">
            <span className="text-[#8B91B0]">{t.label}</span>
            <span className={`font-mono font-semibold ${t.ok ? 'text-emerald-400' : 'text-red-400'}`}>{t.value}</span>
          </div>
        ))}
      </div>

      {/* Anomaly Log */}
      <div className="px-4 mt-4 flex-1">
        <p className="text-[10px] font-semibold text-[#8B91B0] uppercase tracking-wider mb-2">Security Audit</p>
        <div className="flex flex-col items-center justify-center py-4 text-center bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
          <svg className="w-6 h-6 text-emerald-400 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <p className="text-[11px] text-emerald-400 font-semibold">Environment Pristine</p>
          <p className="text-[10px] text-[#4A506B] mt-0.5">No anomalies detected</p>
        </div>
      </div>

      {/* Proctor Assist */}
      <div className="px-4 py-4 border-t border-[#1E2230] mt-3">
        <button className="w-full py-2 px-3 rounded-lg border border-amber-500/30 text-amber-400 text-[11px] font-semibold hover:bg-amber-500/10 transition-all">
          🙋 Request Proctor Assistance
        </button>
      </div>
    </div>
  );
}

/* ─── Immersion Mode Page ────────────────────────────────── */

export default function ImmersionModePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { deadlineAt, serverTimeOffset } = useSelector((s) => s.assessment);
  const { connectionStatus, latencyMs, peerNode } = useSelector((s) => s.proctoring);
  const [code, setCodeLocal] = useState(DEFAULT_CODE);
  const [language, setLanguageLocal] = useState('python');
  const [problemTab, setProblemTabLocal] = useState('description');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState(0);

  // Mock: use a deadline 47 mins from now for demo purposes
  const mockDeadlineAt = deadlineAt || new Date(Date.now() + 47 * 60 * 1000).toISOString();
  const mockOffset = serverTimeOffset || 0;
  const mockStatus = connectionStatus || 'healthy';

  function handleSubmitSolution() {
    setIsSubmitting(true);
    setSubmitStep(1); // Writing versioned code to MongoDB + Blob
    setTimeout(() => {
      setSubmitStep(2); // Publishing execution job to Azure Service Bus
      setTimeout(() => {
        setSubmitStep(3); // Running private tests in gVisor ephemeral sandbox
        setTimeout(() => {
          setSubmitStep(4); // Core PostgreSQL commit authoritative result
          setTimeout(() => {
            navigate('/assessment/result/ATT-8942');
          }, 600);
        }, 700);
      }, 700);
    }, 700);
  }

  function handleExitSandbox() {
    if (confirm('Exit Immersion Mode? Your unsaved draft changes are synced with the local sandbox.')) {
      navigate('/dashboard');
    }
  }

  return (
    <div className="h-screen w-screen bg-[#090A0F] flex font-['Inter',sans-serif] overflow-hidden select-none relative">
      <ProblemPane tab={problemTab} onTabChange={setProblemTabLocal} />
      <CodeEditorPane
        code={code}
        setCode={setCodeLocal}
        language={language}
        setLanguage={setLanguageLocal}
        deadlineAt={mockDeadlineAt}
        serverTimeOffset={mockOffset}
        onSubmitSolution={handleSubmitSolution}
        onExitSandbox={handleExitSandbox}
      />
      <ProctoringPane
        connectionStatus={mockStatus}
        latencyMs={latencyMs || 18}
        peerNode={peerNode || 'US-WEST-2B'}
      />

      {/* Submission Progression Modal (Flow B Architectural Contract) */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141622] border border-[#1E2238] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 border-2 border-[#4F6BED] border-t-transparent rounded-full animate-spin" />
              <div>
                <h3 className="text-sm font-bold text-white font-['Geist',sans-serif]">
                  Enclave Execution &amp; Scoring In Progress
                </h3>
                <p className="text-[11px] text-[#8B91B0]">Architecture Flow B · Attempt #ATT-8942</p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className={`p-2 rounded border flex items-center justify-between ${
                submitStep >= 1 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#0D0F1A] border-[#252840] text-[#8B91B0]'
              }`}>
                <span>1. Persisting versioned code (MongoDB + Blob)</span>
                <span>{submitStep >= 1 ? '✓ Done' : 'Pending'}</span>
              </div>
              <div className={`p-2 rounded border flex items-center justify-between ${
                submitStep >= 2 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#0D0F1A] border-[#252840] text-[#8B91B0]'
              }`}>
                <span>2. Azure Service Bus execution job enqueued</span>
                <span>{submitStep >= 2 ? '✓ Enqueued' : 'Pending'}</span>
              </div>
              <div className={`p-2 rounded border flex items-center justify-between ${
                submitStep >= 3 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#0D0F1A] border-[#252840] text-[#8B91B0]'
              }`}>
                <span>3. Isolated gVisor container running test suite</span>
                <span>{submitStep >= 3 ? '✓ 3/3 Passed' : 'Running...'}</span>
              </div>
              <div className={`p-2 rounded border flex items-center justify-between ${
                submitStep >= 4 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#0D0F1A] border-[#252840] text-[#8B91B0]'
              }`}>
                <span>4. Core PostgreSQL transactional outbox committed</span>
                <span>{submitStep >= 4 ? '✓ Committed' : 'Pending'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

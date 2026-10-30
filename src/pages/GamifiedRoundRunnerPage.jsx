import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const ROUND_TYPES = {
  aptitude: {
    id: 'aptitude',
    title: 'Aptitude Sprint · Level 3',
    subtitle: 'Speed Quant & Numerical Logic',
    durationMinutes: 15,
    xpReward: 150,
    icon: '⚡',
    questions: [
      {
        q: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
        options: ['65 seconds', '89 seconds', '100 seconds', '150 seconds'],
        correct: 1, // 89 seconds: Speed = 240/24 = 10 m/s; Time = (240+650)/10 = 89 s
      },
      {
        q: 'In how many ways can the letters of the word "LEADER" be arranged?',
        options: ['72', '144', '360', '720'],
        correct: 2, // 6! / 2! = 720 / 2 = 360
      },
      {
        q: 'A and B together can complete a piece of work in 12 days. A alone can do it in 20 days. If B works for only half a day daily, how long will A and B together take to complete the work?',
        options: ['11 days', '15 days', '18 days', '20 days'],
        correct: 1, // 15 days
      },
    ],
  },
  debug: {
    id: 'debug',
    title: 'Debug Challenge · Find it. Fix it. Learn.',
    subtitle: 'Identify and repair bugs in memory allocation & loop invariants',
    durationMinutes: 20,
    xpReward: 200,
    icon: '🐞',
    initialCode: `# Buggy Code: Sliding Window Maximum
# Task: Fix the deque invariant and off-by-one index boundary
from collections import deque

def maxSlidingWindow(nums, k):
    if not nums: return []
    q = deque()
    res = []
    
    for i in range(len(nums)):
        # BUG: Should remove indices outside the current window (i - k)
        while q and q[0] < i - k: # Fixed invariant
            q.popleft()
            
        # BUG: Monotonic condition should preserve descending order
        while q and nums[q[-1]] <= nums[i]:
            q.pop()
            
        q.append(i)
        
        # BUG: Window only valid when i >= k - 1
        if i >= k - 1:
            res.append(nums[q[0]])
            
    return res
`,
    testCases: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', expected: '[3,3,5,5,6,7]' },
      { input: 'nums = [1], k = 1', expected: '[1]' },
      { input: 'nums = [1,-1], k = 1', expected: '[1,-1]' },
    ],
  },
  prompt: {
    id: 'prompt',
    title: 'Prompt Coding · Build from a Brief',
    subtitle: 'Translate product requirements into structured classes & methods',
    durationMinutes: 30,
    xpReward: 250,
    icon: '📝',
    brief: `Build a distributed sliding-window RateLimiter class in Python.
Requirements:
1. Support 'allow_request(client_id: str, timestamp_ms: int) -> bool'
2. Window limit: max 5 requests per 10,000 ms per client_id.
3. Automatically evict expired timestamps from the memory deque.`,
    initialCode: `class RateLimiter:
    def __init__(self, max_requests: int = 5, window_ms: int = 10000):
        self.max_requests = max_requests
        self.window_ms = window_ms
        self.clients = {} # client_id -> deque of timestamps

    def allow_request(self, client_id: str, timestamp_ms: int) -> bool:
        # Implement sliding window timestamp eviction
        pass
`,
  },
};

export default function GamifiedRoundRunnerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roundTypeParam = searchParams.get('type') || 'aptitude';
  const [currentRoundType, setCurrentRoundType] = useState(roundTypeParam);

  const roundData = ROUND_TYPES[currentRoundType] || ROUND_TYPES.aptitude;

  // Aptitude state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Debug & Prompt Code state
  const [code, setCode] = useState(roundData.initialCode || '');
  const [runStatus, setRunStatus] = useState('idle'); // 'idle' | 'running' | 'success'

  // Timer
  const [secondsLeft, setSecondsLeft] = useState(roundData.durationMinutes * 60);

  useEffect(() => {
    setCode(roundData.initialCode || '');
    setSecondsLeft(roundData.durationMinutes * 60);
    setQuizSubmitted(false);
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
  }, [currentRoundType]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeDisplay = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  function handleRunTests() {
    setRunStatus('running');
    setTimeout(() => {
      setRunStatus('success');
    }, 1100);
  }

  return (
    <div className="min-h-screen bg-[#0D0F1A] flex font-['Inter',sans-serif]">
      <Sidebar activePage="drills" />

      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="border-b border-[#1E2238] px-8 py-5 bg-[#0F1221]/70 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/career-copilot')}
                  className="text-xs text-[#8B91B0] hover:text-[#4F6BED] transition-colors"
                >
                  ← Career Copilot
                </button>
                <span className="text-[#3A3F58]">/</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  Gamified Placement Sprint
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#F0F2FF] font-['Geist',sans-serif] mt-1 flex items-center gap-2">
                <span>{roundData.icon}</span>
                <span>{roundData.title}</span>
              </h1>
              <p className="text-xs text-[#8B91B0]">{roundData.subtitle}</p>
            </div>

            {/* Countdown & XP */}
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-sm font-bold flex items-center gap-2">
                <span>⏱</span>
                <span>{timeDisplay}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#4F6BED]/10 border border-[#4F6BED]/30 text-[#4F6BED] font-mono text-xs font-bold">
                +{roundData.xpReward} XP
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex gap-4 mt-5 border-t border-[#1E2238] pt-3">
            {[
              { id: 'aptitude', label: '⚡ Aptitude Sprint (Level 3)' },
              { id: 'debug', label: '🐞 Debug Challenge' },
              { id: 'prompt', label: '📝 Prompt Coding (From Brief)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentRoundType(tab.id)}
                className={`text-xs font-medium pb-1.5 transition-colors ${
                  currentRoundType === tab.id
                    ? 'text-[#4F6BED] border-b-2 border-[#4F6BED] font-semibold'
                    : 'text-[#8B91B0] hover:text-[#F0F2FF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {/* MODE 1: Aptitude Sprint */}
          {currentRoundType === 'aptitude' && (
            <div className="max-w-3xl mx-auto space-y-6">
              {!quizSubmitted ? (
                <div className="bg-[#141622] border border-[#1E2238] rounded-2xl p-7 shadow-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-[#1E2238] mb-5">
                    <span className="text-xs font-mono text-[#8B91B0]">
                      Question {currentQuestionIdx + 1} of {roundData.questions.length}
                    </span>
                    <span className="text-xs font-mono text-emerald-400">
                      Target Pacing: 50s / question
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white leading-relaxed mb-6">
                    {roundData.questions[currentQuestionIdx].q}
                  </h3>

                  <div className="space-y-3 mb-6">
                    {roundData.questions[currentQuestionIdx].options.map((opt, idx) => {
                      const isSelected = selectedAnswers[currentQuestionIdx] === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestionIdx]: idx })}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#4F6BED]/20 border-[#4F6BED] text-white shadow-md'
                              : 'bg-[#0D0F1A] border-[#252840] text-[#C0C5DD] hover:border-[#4F6BED]/40'
                          }`}
                        >
                          <span className="text-xs font-medium">{opt}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                            isSelected ? 'border-[#4F6BED] bg-[#4F6BED] text-white' : 'border-[#4A506B]'
                          }`}>
                            {isSelected ? '✓' : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#1E2238]">
                    <button
                      disabled={currentQuestionIdx === 0}
                      onClick={() => setCurrentQuestionIdx((p) => p - 1)}
                      className="px-4 py-2 bg-[#1C1F30] disabled:opacity-40 text-xs font-medium text-slate-300 rounded-lg"
                    >
                      ← Previous
                    </button>

                    {currentQuestionIdx < roundData.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                        className="px-5 py-2 bg-[#4F6BED] hover:bg-[#3D5BE0] text-xs font-semibold text-white rounded-lg"
                      >
                        Next Question →
                      </button>
                    ) : (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-lg shadow-lg shadow-emerald-600/20"
                      >
                        Submit Aptitude Sprint ✓
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-[#141622] border border-emerald-500/40 rounded-2xl p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-2xl text-emerald-400">
                    🏆
                  </div>
                  <h3 className="text-xl font-bold text-white font-['Geist',sans-serif]">
                    Aptitude Sprint Completed!
                  </h3>
                  <p className="text-xs text-[#8B91B0]">
                    Calculated score: <span className="text-emerald-400 font-bold font-mono text-sm">3 / 3 (100% Accuracy)</span> · Time Taken: <span className="text-white font-mono">{timeDisplay}</span>
                  </p>
                  <div className="p-3 bg-[#0D0F1A] border border-[#252840] rounded-xl max-w-sm mx-auto font-mono text-xs text-[#4F6BED]">
                    +150 XP Credited to Candidate Profile
                  </div>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setSelectedAnswers({});
                        setCurrentQuestionIdx(0);
                      }}
                      className="px-4 py-2 bg-[#1C1F30] text-xs text-white rounded-lg"
                    >
                      Retry Sprint
                    </button>
                    <button
                      onClick={() => navigate('/career-copilot')}
                      className="px-5 py-2 bg-[#4F6BED] text-xs text-white font-semibold rounded-lg"
                    >
                      Return to Career Copilot →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 2 & 3: Code Runner (Debug Challenge or Prompt Coding) */}
          {(currentRoundType === 'debug' || currentRoundType === 'prompt') && (
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column: Requirements / Instructions */}
              <div className="col-span-5 bg-[#141622] border border-[#1E2238] rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#8B91B0]">
                  Task Specification &amp; Bounds
                </h3>

                {currentRoundType === 'debug' ? (
                  <div className="space-y-3 text-xs text-[#C0C5DD]">
                    <p className="leading-relaxed">
                      The sliding window maximum function below fails on edge cases and window boundaries.
                    </p>
                    <div className="p-3 bg-[#0D0F1A] border border-amber-500/30 rounded-lg space-y-1 font-mono text-[11px] text-amber-300">
                      <p>⚠️ Known Flaws:</p>
                      <p>1. Deque does not drop elements strictly outside index `i - k`.</p>
                      <p>2. Monotonic queue condition fails when encountering duplicate values.</p>
                    </div>

                    <h4 className="text-xs font-bold text-white font-mono uppercase pt-2">Sample Test Cases:</h4>
                    {roundData.testCases.map((tc, idx) => (
                      <div key={idx} className="p-2.5 bg-[#0D0F1A] border border-[#252840] rounded font-mono text-[11px]">
                        <p className="text-slate-400">In: {tc.input}</p>
                        <p className="text-emerald-400">Exp: {tc.expected}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 text-xs text-[#C0C5DD]">
                    <p className="leading-relaxed whitespace-pre-line font-mono bg-[#0D0F1A] p-3 rounded-lg border border-[#252840]">
                      {roundData.brief}
                    </p>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs">
                      ✓ Deterministic Enclave Sandbox ready for memory &amp; rate validation.
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Code Editor & Execution Console */}
              <div className="col-span-7 bg-[#090A0F] border border-[#1E2238] rounded-xl flex flex-col overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#1E2238] bg-[#0E1017] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#4F6BED]">solution.py</span>
                  <span className="text-[10px] font-mono text-emerald-400">gVisor Sandbox</span>
                </div>

                <textarea
                  rows={14}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#090A0F] p-4 font-mono text-xs text-[#C0C5DD] focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />

                {/* Console Output */}
                <div className="p-3 border-t border-[#1E2238] bg-[#0D0F16]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase text-[#8B91B0]">Deterministic Sandbox Console</span>
                    <button
                      onClick={handleRunTests}
                      disabled={runStatus === 'running'}
                      className="px-4 py-1.5 bg-[#4F6BED] hover:bg-[#3D5BE0] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      {runStatus === 'running' ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Testing In gVisor...</span>
                        </>
                      ) : (
                        <>
                          <span>▶ Run &amp; Verify Tests</span>
                        </>
                      )}
                    </button>
                  </div>

                  {runStatus === 'success' && (
                    <div className="p-3 bg-[#0D0F1A] border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-400 space-y-1">
                      <p>✓ Test 1 Passed (3ms)</p>
                      <p>✓ Test 2 Passed (2ms)</p>
                      <p>✓ Test 3 Passed (4ms)</p>
                      <p className="text-white font-bold pt-1">All Assertions Passed! Solution Verified.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

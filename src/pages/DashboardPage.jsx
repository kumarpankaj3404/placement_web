import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, setLeaderboardScope, setActiveAssessmentTab } from '../store/slices/uiSlice';
import Sidebar from '../components/layout/Sidebar';
import SkeletonCard from '../components/ui/SkeletonCard';

/* ─── Mock Data (replace with RTK Query hooks) ──────────── */

const MOCK_METRICS = {
  streak: 7,
  readiness: 84,
  focusHours: 12.4,
  focusTarget: 15,
};

const MOCK_ASSIGNMENTS = [
  {
    id: 'a1',
    title: 'Distributed Systems & Concurrency Benchmark',
    tags: ['Hard', 'System Design', 'Strict Sandbox'],
    countdown: '02:14:30',
    proctor: 'Webcam + Lock-Down Active',
    status: 'active',
  },
  {
    id: 'a2',
    title: 'Goldman Sachs Quantitative Engineering Pre-Screen',
    tags: ['Medium', 'Algorithms & DP', 'Timed 90m'],
    countdown: 'Starts in 4h 15m',
    proctor: null,
    status: 'upcoming',
  },
];

const MOCK_DRILLS = [
  { id: 'd1', title: 'Dynamic Programming Sprint', duration: '15m', category: 'DSA', xp: 120 },
  { id: 'd2', title: 'SQL Optimization Sandbox', duration: '20m', category: 'SQL', xp: 90 },
  { id: 'd3', title: 'Graph BFS/DFS Speedrun', duration: '10m', category: 'DSA', xp: 80 },
  { id: 'd4', title: 'Cache Invalidation Patterns', duration: '15m', category: 'Systems', xp: 110 },
  { id: 'd5', title: 'OOP Design: Parking Lot', duration: '25m', category: 'OOP', xp: 95 },
];

const MOCK_LEADERBOARD = {
  cohort: [
    { rank: 1, name: 'Priya Sharma', institution: 'IIT Bombay', score: 3240, avatar: 'PS' },
    { rank: 2, name: 'Rohan Kapoor', institution: 'NIT Trichy', score: 3110, avatar: 'RK' },
    { rank: 3, name: 'Sneha Iyer', institution: 'BITS Pilani', score: 2980, avatar: 'SI' },
    { rank: 4, name: 'Arjun Mehta', institution: 'Stanford CS', score: 2940, avatar: 'AM', isMe: true },
    { rank: 5, name: 'Dev Malhotra', institution: 'IIT Delhi', score: 2890, avatar: 'DM' },
  ],
  global: [
    { rank: 1, name: 'Kai Zhang', institution: 'MIT EECS', score: 4580, avatar: 'KZ' },
    { rank: 2, name: 'Elena Petrov', institution: 'CMU SCS', score: 4420, avatar: 'EP' },
    { rank: 3, name: 'Marcus Webb', institution: 'UC Berkeley', score: 4310, avatar: 'MW' },
    { rank: 4, name: 'Arjun Mehta', institution: 'Stanford CS', score: 4010, avatar: 'AM', isMe: true },
    { rank: 5, name: 'Yuki Tanaka', institution: 'U Tokyo', score: 3980, avatar: 'YT' },
  ],
};

const TELEMETRY_DAYS = [
  { day: 'M', hours: 1.5 }, { day: 'T', hours: 2.8 }, { day: 'W', hours: 3.2 },
  { day: 'T', hours: 1.1 }, { day: 'F', hours: 2.4 }, { day: 'S', hours: 0.8 }, { day: 'S', hours: 0.6 },
];

/* ─── Sub-components ─────────────────────────────────────── */

function MetricCard({ icon, label, value, sub, accent }) {
  return (
    <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-[#8B91B0] uppercase tracking-widest font-semibold">{label}</p>
        <p className="text-xl font-bold text-[#F0F2FF] font-['Geist',sans-serif]">{value}</p>
        <p className="text-[11px] text-[#8B91B0]">{sub}</p>
      </div>
    </div>
  );
}

function AssignmentCard({ assignment, isLoading }) {
  if (isLoading) return <SkeletonCard />;
  return (
    <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-5 flex flex-col gap-3 hover:border-[#4F6BED]/50 transition-all duration-200 group">
      <div className="flex flex-wrap gap-1.5">
        {assignment.tags.map((t) => (
          <span key={t} className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#4F6BED]/10 text-[#4F6BED] border border-[#4F6BED]/20">
            {t}
          </span>
        ))}
      </div>
      <h3 className="text-sm font-semibold text-[#F0F2FF] font-['Geist',sans-serif] leading-snug group-hover:text-[#4F6BED] transition-colors">
        {assignment.title}
      </h3>
      <div className="flex items-center gap-2 text-xs font-mono">
        <span className={`px-2 py-0.5 rounded border ${assignment.status === 'active' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-[#4F6BED]/10 text-[#4F6BED] border-[#4F6BED]/20'}`}>
          ⏱ {assignment.countdown}
        </span>
        {assignment.proctor && (
          <span className="text-emerald-400 text-[10px]">● {assignment.proctor}</span>
        )}
      </div>
      <button className="mt-auto w-full py-2 bg-[#4F6BED] hover:bg-[#3D5BE0] rounded-lg text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2">
        🔒 Enter Assessment
      </button>
    </div>
  );
}

function DrillCard({ drill }) {
  return (
    <div className="min-w-[180px] bg-[#141622] border border-[#1E2238] rounded-xl p-4 flex flex-col gap-2 hover:border-[#4F6BED]/50 transition-all duration-200 cursor-pointer group">
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#4F6BED] bg-[#4F6BED]/10 px-2 py-0.5 rounded self-start">
        {drill.category}
      </span>
      <p className="text-xs font-semibold text-[#F0F2FF] leading-tight group-hover:text-[#4F6BED] transition-colors">{drill.title}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-[11px] text-[#8B91B0]">{drill.duration}</span>
        <span className="text-[11px] text-amber-400 font-semibold">+{drill.xp} XP</span>
      </div>
    </div>
  );
}

function RankBadge({ rank }) {
  if (rank === 1) return <span className="text-yellow-400 font-bold text-sm">🥇</span>;
  if (rank === 2) return <span className="text-slate-300 font-bold text-sm">🥈</span>;
  if (rank === 3) return <span className="text-amber-600 font-bold text-sm">🥉</span>;
  return <span className="text-xs font-mono text-[#8B91B0] w-5 text-right">#{rank}</span>;
}

function LeaderboardRow({ entry }) {
  return (
    <div className={`flex items-center gap-3 py-2.5 px-3 rounded-lg ${entry.isMe ? 'bg-[#4F6BED]/10 border border-[#4F6BED]/20' : 'hover:bg-[#1C1F30]'} transition-colors`}>
      <RankBadge rank={entry.rank} />
      <div className="w-7 h-7 rounded-full bg-[#4F6BED]/20 border border-[#4F6BED]/30 flex items-center justify-center text-[10px] font-bold text-[#4F6BED] flex-shrink-0">
        {entry.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold truncate ${entry.isMe ? 'text-[#4F6BED]' : 'text-[#F0F2FF]'}`}>{entry.name}</p>
        <p className="text-[10px] text-[#8B91B0] truncate">{entry.institution}</p>
      </div>
      <span className="text-xs font-mono font-bold text-[#F0F2FF]">{entry.score.toLocaleString()}</span>
    </div>
  );
}

/* ─── Dashboard Page ─────────────────────────────────────── */

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { leaderboardScope, activeAssessmentTab } = useSelector((s) => s.ui);
  const isLoading = false; // Replace with RTK Query isLoading

  const tabs = ['all', 'proctored', 'mock'];
  const maxHours = Math.max(...TELEMETRY_DAYS.map((d) => d.hours));

  return (
    <div className="min-h-screen bg-[#0D0F1A] flex font-['Inter',sans-serif]">
      <Sidebar activePage="dashboard" />

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <div className="border-b border-[#1E2238] px-8 py-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#F0F2FF] font-['Geist',sans-serif]">Good Morning, Arjun 👋</h1>
              <p className="text-sm text-[#8B91B0] mt-0.5">Thursday, 29 October 2026 · System Ready · 256-bit TLS Active</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Proctor Node Verified
            </div>
          </div>

          {/* Metrics Banner */}
          <div className="grid grid-cols-3 gap-4 mt-5">
            <MetricCard icon="🔥" label="7-Day Streak" value={`${MOCK_METRICS.streak} days`} sub="Personal best: 14 days" accent="bg-amber-500/10" />
            <MetricCard icon="📈" label="Readiness Score" value={`${MOCK_METRICS.readiness}%`} sub="+3.2% vs last week" accent="bg-[#4F6BED]/10" />
            <MetricCard icon="⏱" label="Focus Hours" value={`${MOCK_METRICS.focusHours}h`} sub={`Target: ${MOCK_METRICS.focusTarget}h`} accent="bg-emerald-500/10" />
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
            {/* Active Assessments */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[#F0F2FF] font-['Geist',sans-serif]">
                  Active Institutional Assessments
                </h2>
                <div className="flex gap-1 bg-[#141622] border border-[#1E2238] rounded-lg p-1">
                  {tabs.map((t) => (
                    <button
                      key={t}
                      onClick={() => dispatch(setActiveAssessmentTab(t))}
                      className={`px-3 py-1 text-xs rounded-md font-medium capitalize transition-all ${activeAssessmentTab === t ? 'bg-[#4F6BED] text-white' : 'text-[#8B91B0] hover:text-[#F0F2FF]'}`}
                    >
                      {t === 'all' ? 'All (2)' : t === 'proctored' ? 'Proctored Exams' : 'Mock Interviews'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {MOCK_ASSIGNMENTS.map((a) => (
                  <AssignmentCard key={a.id} assignment={a} isLoading={isLoading} />
                ))}
              </div>
            </section>

            {/* Focus Drills */}
            <section>
              <h2 className="text-base font-semibold text-[#F0F2FF] font-['Geist',sans-serif] mb-4">
                Adaptive Focus Drills
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {MOCK_DRILLS.map((d) => <DrillCard key={d.id} drill={d} />)}
              </div>
            </section>
          </div>

          {/* Right Panel */}
          <aside className="w-80 border-l border-[#1E2238] overflow-y-auto px-5 py-6 space-y-6 flex-shrink-0">
            {/* Leaderboard */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#F0F2FF] font-['Geist',sans-serif]">Leaderboard</h3>
                <div className="flex gap-1 bg-[#0D0F1A] border border-[#1E2238] rounded-lg p-1">
                  {['cohort', 'global'].map((s) => (
                    <button
                      key={s}
                      onClick={() => dispatch(setLeaderboardScope(s))}
                      className={`px-2.5 py-1 text-[11px] rounded-md font-semibold capitalize transition-all ${leaderboardScope === s ? 'bg-[#4F6BED] text-white' : 'text-[#8B91B0] hover:text-[#F0F2FF]'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-0.5">
                {MOCK_LEADERBOARD[leaderboardScope].map((e) => (
                  <LeaderboardRow key={e.rank} entry={e} />
                ))}
              </div>
            </div>

            {/* Cognitive Telemetry */}
            <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-4">
              <h3 className="text-sm font-semibold text-[#F0F2FF] font-['Geist',sans-serif] mb-4">
                Cognitive Telemetry
              </h3>

              {/* Focus Bar Chart */}
              <p className="text-[10px] text-[#8B91B0] uppercase tracking-widest font-semibold mb-2">Focus Hours / Day</p>
              <div className="flex items-end gap-1.5 h-16 mb-4">
                {TELEMETRY_DAYS.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm bg-[#4F6BED]/60 hover:bg-[#4F6BED] transition-all"
                      style={{ height: `${(d.hours / maxHours) * 100}%` }}
                    />
                    <span className="text-[9px] text-[#8B91B0] font-mono">{d.day}</span>
                  </div>
                ))}
              </div>

              {/* Accuracy Gauge */}
              <p className="text-[10px] text-[#8B91B0] uppercase tracking-widest font-semibold mb-3">Sandbox Accuracy</p>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1E2238" strokeWidth="3.2" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#4F6BED" strokeWidth="3.2"
                      strokeDasharray={`${78} ${100}`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#F0F2FF] font-mono rotate-0">
                    78%
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#F0F2FF]">78%</p>
                  <p className="text-[11px] text-[#8B91B0]">Precision Rate</p>
                  <p className="text-[11px] text-emerald-400 mt-0.5">↑ 4.2% this week</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

import { useSelector, useDispatch } from 'react-redux';
import { toggleFilter, removeFilter, clearAllFilters, setSearch, setSortBy } from '../store/slices/catalogSlice';
import Sidebar from '../components/layout/Sidebar';
import SkeletonCard from '../components/ui/SkeletonCard';

/* ─── Catalog Data (replace with RTK Query) ─────────────── */

const ALL_RESOURCES = [
  {
    id: 'r1', title: 'Distributed Consensus & Raft Invariants', category: 'System Design',
    difficulty: 'Expert', duration: '75 mins', companies: ['Meta', 'Google'],
    snippet: 'Walkthrough and interactive tracing of leader election failure modes, network partitions, and log replication stability.',
    status: 'Available',
  },
  {
    id: 'r2', title: 'Dynamic Programming on Trees & DAGs', category: 'DSA',
    difficulty: 'Hard', duration: '45 mins', companies: ['Goldman Sachs', 'Citadel'],
    snippet: 'Subtree aggregations, tree rerooting technique, and memoization optimizations with deterministic test harnesses.',
    status: 'Available',
  },
  {
    id: 'r3', title: 'Low-Latency Order Book Simulation', category: 'DSA',
    difficulty: 'Hard', duration: '90 mins', companies: ['Jane Street', 'Jump'],
    snippet: 'Cache-conscious limit order book implementation with fixed-point arithmetic and zero-allocation queue structures.',
    status: 'Available',
  },
  {
    id: 'r4', title: 'High-Throughput Sharded Key-Value Store', category: 'System Design',
    difficulty: 'Medium', duration: '60 mins', companies: ['Amazon', 'Uber'],
    snippet: 'Consistent hashing with virtual nodes, vector clocks, and multi-version concurrency control (MVCC).',
    status: 'Available',
  },
  {
    id: 'r5', title: 'PostgreSQL Query Planner & Index Tuning', category: 'SQL',
    difficulty: 'Medium', duration: '35 mins', companies: ['Stripe', 'Snowflake'],
    snippet: 'Deep dive into EXPLAIN ANALYZE, B-tree vs BRIN indices, lock contention mitigation, and partition pruning.',
    status: 'Available',
  },
  {
    id: 'r6', title: 'Executive Cross-Functional Disagreement', category: 'Behavioral',
    difficulty: 'Medium', duration: '25 mins', companies: ['Apple', 'Microsoft'],
    snippet: 'Structured STAR responses and situational judgment evaluation for technical tradeoffs and stakeholder alignment.',
    status: 'Available',
  },
  {
    id: 'r7', title: 'Lock-Free Concurrent Memory Queues', category: 'OS',
    difficulty: 'Expert', duration: '80 mins', companies: ['Meta', 'Two Sigma'],
    snippet: 'Atomic primitives, CAS loops, memory barriers, ABA problem mitigation, and Michael-Scott queue verification.',
    status: 'Available',
  },
  {
    id: 'r8', title: 'Object-Oriented Design: Rate Limiter Engine', category: 'OOP',
    difficulty: 'Easy', duration: '30 mins', companies: ['Palantir', 'Datadog'],
    snippet: 'Extensible token bucket and sliding window counter abstractions with clean class hierarchies and SOLID adherence.',
    status: 'Upcoming',
  },
  {
    id: 'r9', title: 'B-Tree & LSM-Tree Storage Engine Internals', category: 'System Design',
    difficulty: 'Hard', duration: '60 mins', companies: ['Google', 'Databricks'],
    snippet: 'Write amplification tradeoffs, SSTable compaction pipelines, and bloom filter caching strategies.',
    status: 'Available',
  },
];

const FILTER_OPTIONS = {
  category: ['DSA', 'System Design', 'SQL', 'Behavioral', 'OOP', 'OS'],
  difficulty: ['Easy', 'Medium', 'Hard', 'Expert'],
  duration: ['Under 30m', '30-60m', '60-90m', '90m+'],
  status: ['Available', 'Upcoming', 'Archived'],
};

const DIFFICULTY_COLORS = {
  Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Hard: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Expert: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const CATEGORY_COLORS = {
  DSA: 'bg-[#4F6BED]/10 text-[#4F6BED] border-[#4F6BED]/20',
  'System Design': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  SQL: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Behavioral: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  OOP: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  OS: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

/* ─── Sub-components ─────────────────────────────────────── */

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
        active
          ? 'bg-[#4F6BED]/20 text-[#4F6BED] border-[#4F6BED]/40'
          : 'bg-[#141622] text-[#8B91B0] border-[#1E2238] hover:border-[#4F6BED]/40 hover:text-[#F0F2FF]'
      }`}
    >
      {label}
    </button>
  );
}

function ActiveFilterPill({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4F6BED]/20 text-[#4F6BED] border border-[#4F6BED]/40 text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors">✕</button>
    </span>
  );
}

function ResourceCard({ resource, isLoading }) {
  if (isLoading) return <SkeletonCard />;
  return (
    <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-5 flex flex-col gap-3 hover:border-[#4F6BED]/40 transition-all duration-200 group">
      <div className="flex items-start justify-between gap-2">
        <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${CATEGORY_COLORS[resource.category] || 'bg-[#1C1F30] text-[#8B91B0] border-[#252840]'}`}>
          {resource.category}
        </span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${DIFFICULTY_COLORS[resource.difficulty]}`}>
          {resource.difficulty}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-[#F0F2FF] font-['Geist',sans-serif] leading-snug group-hover:text-[#4F6BED] transition-colors">
        {resource.title}
      </h3>

      <p className="text-xs text-[#8B91B0] leading-relaxed line-clamp-2">{resource.snippet}</p>

      <div className="flex items-center gap-3 text-[11px] text-[#8B91B0]">
        <span>⏱ {resource.duration}</span>
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${resource.status === 'Available' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
          {resource.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {resource.companies.map((c) => (
          <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-[#1C2030] border border-[#252840] text-[#8B91B0]">
            {c}
          </span>
        ))}
      </div>

      <button className="mt-auto py-2 w-full rounded-lg border border-[#252840] text-xs font-semibold text-[#8B91B0] hover:border-[#4F6BED] hover:text-[#4F6BED] transition-all duration-200 flex items-center justify-center gap-1.5">
        View Details →
      </button>
    </div>
  );
}

/* ─── Empty State ────────────────────────────────────────── */

function EmptyState({ onClear }) {
  return (
    <div className="col-span-3 flex flex-col items-center justify-center py-24 text-center">
      <svg className="w-20 h-20 text-[#4F6BED]/30 mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
      </svg>
      <h3 className="text-xl font-bold text-[#F0F2FF] font-['Geist',sans-serif] mb-2">
        No resources match your filters
      </h3>
      <p className="text-sm text-[#8B91B0] mb-6 max-w-sm">
        Try adjusting your search terms or clearing some filters to discover more resources.
      </p>
      <button
        onClick={onClear}
        className="px-6 py-2.5 bg-[#4F6BED] hover:bg-[#3D5BE0] text-white text-sm font-semibold rounded-lg transition-all duration-200"
      >
        Clear All Filters
      </button>
    </div>
  );
}

/* ─── Content Repository Page ────────────────────────────── */

export default function ContentRepositoryPage() {
  const dispatch = useDispatch();
  const { search, activeFilters, sortBy } = useSelector((s) => s.catalog);
  const isLoading = false; // Replace with RTK Query isLoading

  // Client-side filtering (replace with server-side in production)
  const filtered = ALL_RESOURCES.filter((r) => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.snippet.toLowerCase().includes(search.toLowerCase()) ||
      r.companies.some((c) => c.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = !activeFilters.category.length || activeFilters.category.includes(r.category);
    const matchDifficulty = !activeFilters.difficulty.length || activeFilters.difficulty.includes(r.difficulty);
    const matchStatus = !activeFilters.status.length || activeFilters.status.includes(r.status);
    return matchSearch && matchCategory && matchDifficulty && matchStatus;
  });

  // Collect all active filter pills for display
  const activeFilterPills = Object.entries(activeFilters).flatMap(([group, values]) =>
    values.map((v) => ({ group, value: v, label: `${group.charAt(0).toUpperCase() + group.slice(1)}: ${v}` }))
  );

  return (
    <div className="min-h-screen bg-[#0D0F1A] flex font-['Inter',sans-serif]">
      <Sidebar activePage="catalog" />

      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-[#1E2238] px-8 py-6">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h1 className="text-2xl font-bold text-[#F0F2FF] font-['Geist',sans-serif]">
                Resource Repository & Assessment Catalog
              </h1>
              <span className="inline-block mt-1.5 text-[10px] font-mono font-semibold uppercase tracking-widest text-[#4F6BED] bg-[#4F6BED]/10 border border-[#4F6BED]/20 px-2.5 py-1 rounded-full">
                Student Tier · Unlimited Practice & Diagnostic Archives
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex-shrink-0">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              Node #09-US-EAST Verified
            </div>
          </div>

          {/* Search + Sort */}
          <div className="flex gap-3 mt-5">
            <div className="flex-1 relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A506B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                placeholder="Search resources, topics, companies..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#141622] border border-[#1E2238] rounded-lg text-sm text-[#F0F2FF] placeholder-[#3D4060] focus:outline-none focus:ring-2 focus:ring-[#4F6BED] focus:border-[#4F6BED] transition-all"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              className="bg-[#141622] border border-[#1E2238] text-[#C0C5DD] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4F6BED]"
            >
              <option value="relevant">Most Relevant</option>
              <option value="rating">Highest Rating</option>
              <option value="recent">Recent Additions</option>
              <option value="difficulty">Difficulty: Easy → Expert</option>
            </select>
          </div>

          {/* Filter Chips */}
          <div className="mt-4 space-y-3">
            {Object.entries(FILTER_OPTIONS).map(([group, options]) => (
              <div key={group} className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#4A506B] w-16 flex-shrink-0 capitalize">{group}:</span>
                {options.map((opt) => (
                  <FilterChip
                    key={opt}
                    label={opt}
                    active={activeFilters[group].includes(opt)}
                    onClick={() => dispatch(toggleFilter({ group, value: opt }))}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Active filters tray */}
          {activeFilterPills.length > 0 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#8B91B0]">
                Showing <span className="text-[#F0F2FF] font-semibold">{filtered.length}</span> of {ALL_RESOURCES.length} resources
              </span>
              <div className="h-3 w-px bg-[#252840]" />
              {activeFilterPills.map(({ group, value, label }) => (
                <ActiveFilterPill
                  key={`${group}-${value}`}
                  label={label}
                  onRemove={() => dispatch(removeFilter({ group, value }))}
                />
              ))}
              <button
                onClick={() => dispatch(clearAllFilters())}
                className="text-xs text-[#8B91B0] hover:text-red-400 transition-colors ml-1"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Resource Grid */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-3 gap-5">
            {isLoading
              ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
              : filtered.length === 0
              ? <EmptyState onClear={() => dispatch(clearAllFilters())} />
              : filtered.map((r) => <ResourceCard key={r.id} resource={r} />)
            }
          </div>
        </div>
      </main>
    </div>
  );
}

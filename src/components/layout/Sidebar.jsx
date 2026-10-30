import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { switchRole, logout } from '../../store/slices/authSlice';

function ShieldIcon() {
  return (
    <svg className="w-5 h-5 text-[#4F6BED]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

export default function Sidebar({ activePage }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, currentRole } = useSelector((s) => s.auth);

  // Dynamic Navigation Items by Role
  const getNavItems = () => {
    if (currentRole === 'superadmin') {
      return [
        { id: 'superadmin-console', label: 'Platform Operations', icon: '🌐', path: '/superadmin' },
        { id: 'tenants', label: 'Tenant Clusters', icon: '🏢', path: '/superadmin' },
        { id: 'service-bus', label: 'Azure Service Bus', icon: '⚡', path: '/superadmin' },
        { id: 'readiness-gates', label: 'Readiness Gates 01–03', icon: '🛡️', path: '/superadmin' },
        { id: 'audit-ledger', label: 'Cryptographic Ledger', icon: '📜', path: '/superadmin' },
      ];
    }
    if (currentRole === 'teacher') {
      return [
        { id: 'teacher-studio', label: 'Assessment Studio', icon: '🧑‍🏫', path: '/teacher/studio' },
        { id: 'live-monitor', label: 'Live Candidate Grid', icon: '📹', path: '/teacher/studio', badge: '6' },
        { id: 'teacher-review', label: 'Evidence Case Review', icon: '⚠️', path: '/teacher/proctoring-review', badge: '2' },
        { id: 'catalog', label: 'Resource Catalog', icon: '📚', path: '/catalog' },
        { id: 'immersion', label: 'Sandbox Inspect', icon: '💻', path: '/assess' },
      ];
    }
    if (currentRole === 'admin') {
      return [
        { id: 'admin-console', label: 'Governance & People', icon: '🏛️', path: '/admin/console' },
        { id: 'oversight', label: 'Test Oversight', icon: '📊', path: '/admin/console' },
        { id: 'audit', label: 'Audit Trail & SOC 2', icon: '🔒', path: '/admin/console' },
        { id: 'teacher-studio', label: 'Teacher Studio', icon: '🧑‍🏫', path: '/teacher/studio' },
        { id: 'catalog', label: 'Resource Catalog', icon: '📚', path: '/catalog' },
      ];
    }
    // Default: Student
    return [
      { id: 'dashboard', label: 'Student Overview', icon: '⊞', path: '/dashboard' },
      { id: 'skill-studio', label: 'AI Career Copilot', icon: '🤖', path: '/career-copilot', badge: 'New' },
      { id: 'drills', label: 'Gamified Sprints', icon: '⚡', path: '/practice/round' },
      { id: 'catalog', label: 'Resource Catalog', icon: '📚', path: '/catalog' },
      { id: 'assess', label: 'Assessment Sandbox', icon: '⏱', path: '/assess' },
      { id: 'result', label: 'Official Result Transcripts', icon: '📜', path: '/assessment/result' },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0F1221] border-r border-[#1E2238] flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-[#1E2238]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#4F6BED]/10 border border-[#4F6BED]/30 rounded-lg flex items-center justify-center">
            <ShieldIcon />
          </div>
          <div>
            <span className="text-sm font-bold text-[#F0F2FF] font-['Geist',sans-serif] block leading-tight">
              PlacePrep <span className="text-[#4F6BED]">Secure</span>
            </span>
            <span className="text-[9px] font-mono text-[#4A506B]">Platform Reference 01–03</span>
          </div>
        </div>
      </div>

      {/* Role Switcher Pill */}
      <div className="px-3 pt-3">
        <div className="bg-[#141622] border border-[#252840] rounded-lg p-1.5 flex items-center justify-between text-[11px]">
          <span className="text-[10px] font-mono uppercase text-[#8B91B0] pl-1 font-semibold">Workspace:</span>
          <select
            value={currentRole}
            onChange={(e) => {
              const role = e.target.value;
              dispatch(switchRole(role));
              if (role === 'student') navigate('/dashboard');
              if (role === 'teacher') navigate('/teacher/studio');
              if (role === 'admin') navigate('/admin/console');
              if (role === 'superadmin') navigate('/superadmin');
            }}
            className="bg-[#1C1F30] border border-[#252840] text-[#F0F2FF] rounded px-2 py-1 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-[#4F6BED] cursor-pointer"
          >
            <option value="student">🎓 Student</option>
            <option value="teacher">🧑‍🏫 Teacher</option>
            <option value="admin">🏛️ Institution Admin</option>
            <option value="superadmin">🌐 Super-Admin</option>
          </select>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-[#4F6BED]/15 text-[#4F6BED] border border-[#4F6BED]/20 font-semibold'
                  : 'text-[#8B91B0] hover:bg-[#141622] hover:text-[#F0F2FF] border border-transparent'
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-mono font-bold bg-[#4F6BED] text-white px-1.5 py-0.2 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Infrastructure Telemetry Pill */}
      <div className="px-3 mx-3 mb-3 py-2 bg-emerald-500/5 border border-emerald-500/15 rounded-lg">
        <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span>Enclave TLS 1.3</span>
          </div>
          <span className="text-[#8B91B0]">AFD Verified</span>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="px-4 py-3.5 border-t border-[#1E2238] bg-[#0C0E1A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#4F6BED]/20 border border-[#4F6BED]/30 flex items-center justify-center text-xs font-bold text-[#4F6BED] flex-shrink-0">
              {user?.initials || 'AR'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#F0F2FF] truncate">{user?.name || 'Aanya Rao'}</p>
              <p className="text-[10px] text-[#8B91B0] truncate">{user?.batch || 'Batch A · 2026'}</p>
            </div>
          </div>
          <button
            onClick={() => {
              dispatch(logout());
              navigate('/auth');
            }}
            title="Log Out"
            className="text-[#8B91B0] hover:text-red-400 p-1 text-xs"
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}

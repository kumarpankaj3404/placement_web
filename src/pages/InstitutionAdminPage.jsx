import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const MOCK_PEOPLE = [
  { id: 'usr-01', name: 'Aanya Rao', role: 'Student', scope: 'Batch A · 2026', email: 'aanya.rao@northbridge.edu', mfa: 'Enforced', status: 'Active' },
  { id: 'usr-02', name: 'Prof. Rohan Shah', role: 'Teacher', scope: 'CSE Faculty', email: 'rohan.shah@northbridge.edu', mfa: 'Compliant', status: 'Active' },
  { id: 'usr-03', name: 'Meera Patel', role: 'Student', scope: 'Batch B · 2026', email: 'meera.p@northbridge.edu', mfa: 'Enforced', status: 'Active' },
  { id: 'usr-04', name: 'Dev Malhotra', role: 'Student', scope: 'Batch A · 2026', email: 'dev.m@northbridge.edu', mfa: 'Enforced', status: 'Active' },
  { id: 'usr-05', name: 'Dr. Vikram Nair', role: 'Institution Admin', scope: 'Institutional Scope', email: 'dean.nair@northbridge.edu', mfa: 'Compliant', status: 'Active' },
];

const MOCK_AUDIT_LOGS = [
  { id: 'aud-109', time: '14:32:10 UTC', actor: 'Prof. Rohan Shah (Teacher)', event: 'Published Assessment', target: 'DSA Foundations (CSE Batch A)', ip: '10.240.12.8 (Internal VNet)' },
  { id: 'aud-108', time: '14:26:45 UTC', actor: 'Aanya Rao (Student)', event: 'Started Exam Attempt', target: 'ATT-8942 · Enclave Token Verified', ip: '198.51.100.44 (Client TLS)' },
  { id: 'aud-107', time: '13:10:02 UTC', actor: 'Dr. Vikram Nair (Admin)', event: 'Batch Provisioning', target: 'Provisioned 45 seats for Batch C', ip: '10.240.12.2' },
  { id: 'aud-106', time: '11:04:18 UTC', actor: 'Azure Defender Worker', event: 'Malware Scan Verdict', target: 'resume_aanya_rao.pdf [VERIFIED CLEAN]', ip: 'Managed Identity Service' },
];

export default function InstitutionAdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('people'); // 'people' | 'oversight' | 'audit' | 'infra'
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0D0F1A] flex font-['Inter',sans-serif]">
      <Sidebar activePage="admin-console" />

      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="border-b border-[#1E2238] px-8 py-5 bg-[#0F1221]/60 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#4F6BED] bg-[#4F6BED]/10 border border-[#4F6BED]/20 px-2 py-0.5 rounded">
                  Institution Admin Console · Provision, Manage, Oversee
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Tenant: Northbridge Institute (NB-7721)
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#F0F2FF] font-['Geist',sans-serif] mt-1">
                Institutional Governance &amp; Access Control
              </h1>
              <p className="text-xs text-[#8B91B0]">
                Strict tenant isolation enforced at APIM Gateway &amp; PostgreSQL Flexible Server boundaries.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setInviteModalOpen(true)}
                className="px-4 py-2 bg-[#4F6BED] hover:bg-[#3D5BE0] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-[#4F6BED]/20"
              >
                <span>+ Invite Users / Batches</span>
              </button>
              <button
                onClick={() => alert('Exporting full institutional audit report (CSV / JSON)...')}
                className="px-3.5 py-2 bg-[#1C1F30] hover:bg-[#252840] border border-[#252840] text-[#F0F2FF] rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <span>Export Audit Log ↗</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex gap-4 mt-5 border-t border-[#1E2238] pt-3">
            {[
              { id: 'people', label: '👥 People & Batches' },
              { id: 'oversight', label: '📊 Test Oversight & Analytics' },
              { id: 'audit', label: '🔒 Reports & Audit Trail' },
              { id: 'infra', label: '⚙️ Cloud Infrastructure Health' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs font-medium pb-1.5 transition-colors ${
                  activeTab === tab.id
                    ? 'text-[#4F6BED] border-b-2 border-[#4F6BED] font-semibold'
                    : 'text-[#8B91B0] hover:text-[#F0F2FF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* TAB 1: People & Batches */}
          {activeTab === 'people' && (
            <div className="space-y-6">
              {/* Institutional Overview Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-4">
                  <span className="text-[10px] font-mono uppercase text-[#8B91B0]">Enrolled Students</span>
                  <p className="text-xl font-bold text-[#F0F2FF] mt-1 font-['Geist',sans-serif]">1,420</p>
                  <p className="text-[11px] text-emerald-400 mt-0.5">Across 12 Active Batches</p>
                </div>
                <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-4">
                  <span className="text-[10px] font-mono uppercase text-[#8B91B0]">Authorized Faculty</span>
                  <p className="text-xl font-bold text-[#F0F2FF] mt-1 font-['Geist',sans-serif]">38 Teachers</p>
                  <p className="text-[11px] text-[#8B91B0] mt-0.5">CSE, IT, ECE Departments</p>
                </div>
                <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-4">
                  <span className="text-[10px] font-mono uppercase text-[#8B91B0]">Institutional Pass Rate</span>
                  <p className="text-xl font-bold text-emerald-400 font-mono mt-1">82.4%</p>
                  <p className="text-[11px] text-emerald-400 mt-0.5">+4.8% vs last cycle</p>
                </div>
                <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-4">
                  <span className="text-[10px] font-mono uppercase text-[#8B91B0]">Identity Policy</span>
                  <p className="text-xl font-bold text-[#4F6BED] font-mono mt-1">Entra MFA</p>
                  <p className="text-[11px] text-[#8B91B0] mt-0.5">100% compliant</p>
                </div>
              </div>

              {/* Members Table */}
              <div className="bg-[#141622] border border-[#1E2238] rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#1E2238] flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#F0F2FF] font-['Geist',sans-serif]">
                    Authorized Institutional Members
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="search"
                      placeholder="Search name, email, batch..."
                      className="px-3 py-1 bg-[#0D0F1A] border border-[#252840] rounded text-xs text-[#F0F2FF] placeholder-[#4A506B] focus:outline-none focus:ring-1 focus:ring-[#4F6BED]"
                    />
                  </div>
                </div>

                <table className="w-full text-left text-xs text-[#C0C5DD]">
                  <thead className="bg-[#0D0F1A] text-[10px] uppercase font-mono text-[#8B91B0] border-b border-[#1E2238]">
                    <tr>
                      <th className="px-6 py-3">Member Name</th>
                      <th className="px-6 py-3">Role &amp; Privilege</th>
                      <th className="px-6 py-3">Assigned Batch / Scope</th>
                      <th className="px-6 py-3">Institutional Email</th>
                      <th className="px-6 py-3">MFA Policy</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2238]">
                    {MOCK_PEOPLE.map((p) => (
                      <tr key={p.id} className="hover:bg-[#1C1F30]/50 transition-colors">
                        <td className="px-6 py-3.5 font-medium text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#4F6BED]/20 text-[#4F6BED] flex items-center justify-center text-[10px] font-bold">
                            {p.name.split(' ').map(n => n[0]).join('')}
                          </span>
                          {p.name}
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            p.role === 'Student' ? 'bg-[#4F6BED]/10 text-[#4F6BED]' :
                            p.role === 'Teacher' ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {p.role}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-slate-400">{p.scope}</td>
                        <td className="px-6 py-3.5 text-slate-400 font-mono">{p.email}</td>
                        <td className="px-6 py-3.5">
                          <span className="text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {p.mfa}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <button className="text-slate-400 hover:text-[#4F6BED] text-[11px] font-medium mr-2">
                            Edit Scope
                          </button>
                          <button className="text-slate-400 hover:text-red-400 text-[11px] font-medium">
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Test Oversight */}
          {activeTab === 'oversight' && (
            <div className="space-y-6">
              <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-6">
                <h3 className="text-base font-bold text-[#F0F2FF] font-['Geist',sans-serif] mb-2">
                  Institutional Assessment Pipeline (Azure SQL Reporting Projections)
                </h3>
                <p className="text-xs text-[#8B91B0] mb-4">
                  Reporting views are read-only projections updated asynchronously from domain events. Official scores remain authoritative in PostgreSQL.
                </p>

                <div className="grid grid-cols-3 gap-5">
                  <div className="p-4 rounded-xl bg-[#0D0F1A] border border-[#252840]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-white">DSA Foundations (Batch A)</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Active Live</span>
                    </div>
                    <p className="text-2xl font-bold font-mono text-white mt-1">42 / 42</p>
                    <p className="text-xs text-[#8B91B0] mt-1">100% turnout · 0 integrity cancellations</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0D0F1A] border border-[#252840]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-white">Distributed Systems Benchmark</span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Upcoming (Batch B)</span>
                    </div>
                    <p className="text-2xl font-bold font-mono text-white mt-1">38 Candidates</p>
                    <p className="text-xs text-[#8B91B0] mt-1">Starts tomorrow 10:00 UTC</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0D0F1A] border border-[#252840]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-white">SQL Optimization Sprint</span>
                      <span className="text-[10px] font-mono text-[#8B91B0] bg-[#1C1F30] px-2 py-0.5 rounded">Archived</span>
                    </div>
                    <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">89.2%</p>
                    <p className="text-xs text-[#8B91B0] mt-1">Median score across 140 students</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Audit Trail */}
          {activeTab === 'audit' && (
            <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#F0F2FF] font-['Geist',sans-serif]">
                  Cryptographic Audit &amp; Event Log Stream
                </h3>
                <span className="text-xs font-mono text-emerald-400">SOC 2 Type II Immutable Outbox</span>
              </div>
              <div className="space-y-3">
                {MOCK_AUDIT_LOGS.map((log) => (
                  <div key={log.id} className="p-3.5 bg-[#0D0F1A] border border-[#252840] rounded-lg flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{log.event}</span>
                        <span className="text-[10px] font-mono text-[#4F6BED]">by {log.actor}</span>
                      </div>
                      <p className="text-xs text-[#8B91B0] mt-0.5">{log.target}</p>
                    </div>
                    <div className="text-right font-mono text-[10px] text-[#8B91B0]">
                      <p>{log.time}</p>
                      <p className="text-slate-600">{log.ip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Cloud Infrastructure Health */}
          {activeTab === 'infra' && (
            <div className="space-y-5">
              <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-6">
                <h3 className="text-sm font-bold text-[#F0F2FF] font-['Geist',sans-serif] mb-2">
                  Azure Production Topology Status (Board 03 Blueprint)
                </h3>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="p-4 rounded-lg bg-[#0D0F1A] border border-emerald-500/20">
                    <p className="text-[10px] font-mono uppercase text-[#8B91B0]">Azure Front Door + WAF</p>
                    <p className="text-base font-bold text-emerald-400 mt-1">Active (TLS 1.3)</p>
                    <p className="text-[10px] text-slate-500 mt-1">Rate rules + APIM Private Link</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#0D0F1A] border border-emerald-500/20">
                    <p className="text-[10px] font-mono uppercase text-[#8B91B0]">AKS Dedicated Runner</p>
                    <p className="text-base font-bold text-emerald-400 mt-1">gVisor Ephemeral</p>
                    <p className="text-[10px] text-slate-500 mt-1">Zero egress / No DB credentials</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#0D0F1A] border border-emerald-500/20">
                    <p className="text-[10px] font-mono uppercase text-[#8B91B0]">PostgreSQL Flexible</p>
                    <p className="text-base font-bold text-emerald-400 mt-1">Primary Source</p>
                    <p className="text-[10px] text-slate-500 mt-1">Canonical attempts + transactional outbox</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#0D0F1A] border border-emerald-500/20">
                    <p className="text-[10px] font-mono uppercase text-[#8B91B0]">Azure Web PubSub</p>
                    <p className="text-base font-bold text-emerald-400 mt-1">WSS Real-time</p>
                    <p className="text-[10px] text-slate-500 mt-1">Attempt-scoped live fan-out</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Invite Modal */}
        {inviteModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#141622] border border-[#1E2238] rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-[#F0F2FF] font-['Geist',sans-serif]">
                Provision New Institutional Members
              </h3>
              <p className="text-xs text-[#8B91B0] mt-2 leading-relaxed">
                Add candidates or faculty to Northbridge Institute. Invites will generate secure Entra ID / SAML enrollment tokens.
              </p>
              <div className="space-y-3 mt-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8B91B0] mb-1">Role</label>
                  <select className="w-full bg-[#0D0F1A] border border-[#252840] rounded-lg px-3 py-2 text-xs text-white">
                    <option>Student (Candidate)</option>
                    <option>Teacher (Course Instructor)</option>
                    <option>Proctor (Exam Invigilator)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8B91B0] mb-1">Batch Assignment</label>
                  <select className="w-full bg-[#0D0F1A] border border-[#252840] rounded-lg px-3 py-2 text-xs text-white">
                    <option>CSE · Batch A (2026)</option>
                    <option>CSE · Batch B (2026)</option>
                    <option>IT Department</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8B91B0] mb-1">Email Addresses (comma separated)</label>
                  <input
                    type="text"
                    placeholder="student1@northbridge.edu, student2@northbridge.edu"
                    className="w-full bg-[#0D0F1A] border border-[#252840] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#8B91B0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setInviteModalOpen(false);
                    alert('Provisioning complete! Secure invitation tokens sent via Azure Service Bus.');
                  }}
                  className="px-4 py-2 bg-[#4F6BED] hover:bg-[#3D5BE0] text-white rounded-lg text-xs font-semibold"
                >
                  Issue Invites
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

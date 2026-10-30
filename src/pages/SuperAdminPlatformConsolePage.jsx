import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const MOCK_TENANTS = [
  {
    slug: 'nb-7721',
    name: 'Northbridge Institute',
    tier: 'Tier 1 Enterprise',
    status: 'Healthy',
    candidates: 1420,
    sandboxes: 38,
    passRate: '82.4%',
    vnetPeering: 'vnet-peer-9910',
    region: 'East US',
  },
  {
    slug: 'su-cs-8824',
    name: 'Stanford CS Department',
    tier: 'Tier 1 Enterprise',
    status: 'Healthy',
    candidates: 3840,
    sandboxes: 114,
    passRate: '89.1%',
    vnetPeering: 'vnet-peer-8821',
    region: 'West US 2',
  },
  {
    slug: 'iitb-cse-01',
    name: 'IIT Bombay CSE',
    tier: 'Enterprise Gov',
    status: 'High Load',
    candidates: 6120,
    sandboxes: 210,
    passRate: '86.7%',
    vnetPeering: 'vnet-peer-1044',
    region: 'Central India',
  },
  {
    slug: 'mit-eecs-core',
    name: 'MIT EECS Enclave',
    tier: 'Tier 1 Enterprise',
    status: 'Healthy',
    candidates: 2950,
    sandboxes: 92,
    passRate: '91.3%',
    vnetPeering: 'vnet-peer-3390',
    region: 'East US',
  },
];

const MOCK_AUDIT_STREAM = [
  {
    id: 'evt-01',
    time: '14:48:02 UTC',
    type: 'Tenant Provisioned',
    actor: 'superadmin@placeprep.internal',
    target: "Northbridge Institute isolation boundary sealed (VNet Peering #9910)",
    hash: '0x7f4a...99c2',
    severity: 'info',
  },
  {
    id: 'evt-02',
    time: '14:32:15 UTC',
    type: 'KMS Key Rotation',
    actor: 'Azure Key Vault (Managed)',
    target: 'Envelope Key #HSM-7701 rotated automatically. Zero downtime attested.',
    hash: '0x1c88...44e1',
    severity: 'info',
  },
  {
    id: 'evt-03',
    time: '14:15:00 UTC',
    type: 'Rate Limit Burst',
    actor: 'Traffic Manager Orchestrator',
    target: 'IIT Bombay burst capacity scaled from 180 to 240 sandbox worker nodes.',
    hash: '0x99dd...01aa',
    severity: 'warning',
  },
  {
    id: 'evt-04',
    time: '13:58:44 UTC',
    type: 'PIM Elevation',
    actor: 'secops@placeprep.internal',
    target: "Assumed 'Global Security Root' privileged role (Just-in-Time TTL: 1h).",
    hash: '0x33bb...ef89',
    severity: 'info',
  },
];

export default function SuperAdminPlatformConsolePage() {
  const navigate = useNavigate();
  const [onboardModalOpen, setOnboardModalOpen] = useState(false);
  const [tenantList, setTenantList] = useState(MOCK_TENANTS);
  const [newTenant, setNewTenant] = useState({ name: '', slug: '', tier: 'Tier 1 Enterprise', region: 'East US' });
  const [selectedTab, setSelectedTab] = useState('overview'); // 'overview' | 'queues' | 'readiness' | 'audit'

  function handleOnboardSubmit(e) {
    e.preventDefault();
    if (!newTenant.name || !newTenant.slug) return;
    const added = {
      ...newTenant,
      status: 'Healthy',
      candidates: 0,
      sandboxes: 0,
      passRate: 'N/A',
      vnetPeering: `vnet-peer-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setTenantList([added, ...tenantList]);
    setOnboardModalOpen(false);
    setNewTenant({ name: '', slug: '', tier: 'Tier 1 Enterprise', region: 'East US' });
  }

  function handleEmergencyIsolate(slug) {
    if (confirm(`Execute emergency network quarantine on tenant '${slug}'? All incoming sandbox jobs will be paused.`)) {
      setTenantList(tenantList.map(t => t.slug === slug ? { ...t, status: 'Isolated' } : t));
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0F1A] flex font-['Inter',sans-serif]">
      <Sidebar activePage="superadmin-console" />

      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="border-b border-[#1E2238] px-8 py-5 bg-[#0F1221]/70 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#4F6BED] bg-[#4F6BED]/10 border border-[#4F6BED]/30 px-2 py-0.5 rounded">
                  Super-Admin · Platform Operations Console
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Azure Entra PIM Validated (TTL: 42m)
                </span>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                  FIDO2 Hardware Key Certified
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#F0F2FF] font-['Geist',sans-serif] mt-1">
                Global Platform Operations &amp; Multi-Tenant Control Plane
              </h1>
              <p className="text-xs text-[#8B91B0]">
                Governed Access · Hardware Root of Trust · Zero-Trust VNet Enclave Oversight
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setOnboardModalOpen(true)}
                className="px-4 py-2 bg-[#4F6BED] hover:bg-[#3D5BE0] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-[#4F6BED]/20"
              >
                <span>+ Onboard Institution</span>
              </button>
              <button
                onClick={() => alert('Triggering cross-region backup reconciliation drill...')}
                className="px-3.5 py-2 bg-[#1C1F30] hover:bg-[#252840] border border-[#252840] text-[#F0F2FF] rounded-lg text-xs font-semibold transition-all"
              >
                Drill Recovery Runbook ↗
              </button>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex gap-4 mt-5 border-t border-[#1E2238] pt-3">
            {[
              { id: 'overview', label: '🌐 Tenant Ecosystem & Telemetry' },
              { id: 'queues', label: '⚡ Azure Service Bus & gVisor Workers' },
              { id: 'readiness', label: '🛡️ Production Readiness Gates (01–03)' },
              { id: 'audit', label: '📜 Cryptographic Audit Ledger' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`text-xs font-medium pb-1.5 transition-colors ${
                  selectedTab === tab.id
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
          {/* Top KPI Metrics Banner */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-4">
              <span className="text-[10px] font-mono uppercase text-[#8B91B0]">Active Institutions</span>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xl font-bold text-[#F0F2FF] font-['Geist',sans-serif]">24 Universities</p>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">100% Up</span>
              </div>
              <p className="text-[11px] text-[#8B91B0] mt-1">Across 4 Azure Geographies</p>
            </div>

            <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-4">
              <span className="text-[10px] font-mono uppercase text-[#8B91B0]">Global Candidates</span>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xl font-bold text-[#F0F2FF] font-['Geist',sans-serif]">48,200</p>
                <span className="text-[10px] font-mono bg-[#4F6BED]/10 text-[#4F6BED] px-2 py-0.5 rounded">Enrolled</span>
              </div>
              <p className="text-[11px] text-[#8B91B0] mt-1">1,420 at Northbridge Institute</p>
            </div>

            <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-4">
              <span className="text-[10px] font-mono uppercase text-[#8B91B0]">Concurrent gVisor Sandboxes</span>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xl font-bold text-emerald-400 font-mono">1,240 / 1,500</p>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">82.6% Cap</span>
              </div>
              <p className="text-[11px] text-[#8B91B0] mt-1">Auto-scale headroom: 260 nodes</p>
            </div>

            <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-4">
              <span className="text-[10px] font-mono uppercase text-[#8B91B0]">Azure Front Door Latency</span>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xl font-bold text-emerald-400 font-mono">14ms avg</p>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">p99: 28ms</span>
              </div>
              <p className="text-[11px] text-[#8B91B0] mt-1">APIM Premium Private Link origin</p>
            </div>
          </div>

          {/* TAB 1: Overview & Tenant Grid */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-[#141622] border border-[#1E2238] rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#1E2238] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#F0F2FF] font-['Geist',sans-serif]">
                      Multi-Tenant Isolation Grid
                    </h3>
                    <p className="text-xs text-[#8B91B0]">
                      Each tenant operates in a cryptographically isolated tenant boundary with independent VNet peering and private endpoints.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#8B91B0]">{tenantList.length} Tenants Active</span>
                </div>

                <table className="w-full text-left text-xs text-[#C0C5DD]">
                  <thead className="bg-[#0D0F1A] text-[10px] uppercase font-mono text-[#8B91B0] border-b border-[#1E2238]">
                    <tr>
                      <th className="px-6 py-3">Tenant / Institution</th>
                      <th className="px-6 py-3">Tenant Slug</th>
                      <th className="px-6 py-3">Region &amp; Peering</th>
                      <th className="px-6 py-3">Candidates</th>
                      <th className="px-6 py-3">Active Sandboxes</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Emergency Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2238]">
                    {tenantList.map((t) => (
                      <tr key={t.slug} className="hover:bg-[#1C1F30]/50 transition-colors">
                        <td className="px-6 py-3.5 font-medium text-white">
                          <p className="font-semibold">{t.name}</p>
                          <span className="text-[10px] font-mono text-[#4F6BED]">{t.tier}</span>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-slate-400">{t.slug}</td>
                        <td className="px-6 py-3.5 font-mono text-slate-400">
                          {t.region} · <span className="text-slate-500">{t.vnetPeering}</span>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-white">{t.candidates.toLocaleString()}</td>
                        <td className="px-6 py-3.5 font-mono text-white">{t.sandboxes}</td>
                        <td className="px-6 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            t.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400' :
                            t.status === 'High Load' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            ● {t.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              alert(`Switching global perspective to tenant '${t.name}' (Slug: ${t.slug})...`);
                              navigate('/admin/console');
                            }}
                            className="text-[#4F6BED] hover:underline font-medium"
                          >
                            Enter Context
                          </button>
                          <button
                            onClick={() => handleEmergencyIsolate(t.slug)}
                            className="text-red-400 hover:text-red-300 font-medium ml-2"
                          >
                            Isolate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Azure Service Bus & gVisor Workers */}
          {selectedTab === 'queues' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                {/* Service Bus Card */}
                <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#F0F2FF] font-['Geist',sans-serif]">
                      Azure Service Bus Pipeline
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-400">Premium Tier</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-[#0D0F1A] border border-[#252840] rounded-lg">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#8B91B0] font-mono">queue.execution.jobs</span>
                        <span className="text-emerald-400 font-mono font-bold">42 in-flight</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Processing rate: 840 jobs/min</p>
                    </div>

                    <div className="p-3 bg-[#0D0F1A] border border-[#252840] rounded-lg">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#8B91B0] font-mono">queue.ai.generation</span>
                        <span className="text-[#4F6BED] font-mono font-bold">8 in-flight</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Rate limited to budget tier</p>
                    </div>

                    <div className="p-3 bg-[#0D0F1A] border border-emerald-500/30 rounded-lg">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#8B91B0] font-mono">queue.deadletter.dlq</span>
                        <span className="text-emerald-400 font-mono font-bold">0 dropped</span>
                      </div>
                      <p className="text-[11px] text-emerald-400">All retries resolved with jitter</p>
                    </div>
                  </div>
                </div>

                {/* gVisor / Kata Isolated Pool */}
                <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-5 space-y-4 col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#F0F2FF] font-['Geist',sans-serif]">
                        Dedicated Untrusted Execution Cluster (gVisor / Kata)
                      </h3>
                      <p className="text-xs text-[#8B91B0]">
                        Docker alone is insufficient. Separate AKS worker node boundary with non-root, read-only root FS.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      6 Regional Nodes
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-[#0D0F1A] border border-[#252840] rounded-lg">
                      <span className="text-[10px] font-mono text-[#8B91B0]">Cluster Memory RSS</span>
                      <p className="text-lg font-bold font-mono text-white mt-1">48.2 GB / 64 GB</p>
                      <div className="h-1.5 bg-[#1E2238] rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-[#4F6BED] rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <div className="p-3 bg-[#0D0F1A] border border-[#252840] rounded-lg">
                      <span className="text-[10px] font-mono text-[#8B91B0]">CPU Core Allocation</span>
                      <p className="text-lg font-bold font-mono text-emerald-400 mt-1">26 / 32 Cores</p>
                      <div className="h-1.5 bg-[#1E2238] rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: '81%' }} />
                      </div>
                    </div>
                    <div className="p-3 bg-[#0D0F1A] border border-[#252840] rounded-lg">
                      <span className="text-[10px] font-mono text-[#8B91B0]">Network Egress Filter</span>
                      <p className="text-lg font-bold font-mono text-emerald-400 mt-1">Strict Deny-All</p>
                      <p className="text-[10px] text-slate-500 mt-1">Zero arbitrary outbound</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Production Readiness Gates (Board 03) */}
          {selectedTab === 'readiness' && (
            <div className="space-y-6">
              <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-6">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-[#F0F2FF] font-['Geist',sans-serif]">
                    Production-Readiness Gates (Architecture Board 03 Validation)
                  </h3>
                  <p className="text-xs text-[#8B91B0]">
                    Required validation criteria before deployment certification across security, delivery, and governance.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-5">
                  {/* Gate 01 */}
                  <div className="p-5 bg-[#0D0F1A] border border-emerald-500/30 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-emerald-400 uppercase">
                        01 Security &amp; Identity Proof
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                        ✓ 100% Passed
                      </span>
                    </div>
                    <ul className="text-xs space-y-2 text-[#C0C5DD]">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>Threat model + penetration test completed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>Identity PoC: Student ID mapping, OTP delivery, reset/verification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>Tenant/role isolation tests across API, events, cache &amp; evidence</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>Sandbox escape / egress / resource limit validation</span>
                      </li>
                    </ul>
                  </div>

                  {/* Gate 02 */}
                  <div className="p-5 bg-[#0D0F1A] border border-emerald-500/30 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-emerald-400 uppercase">
                        02 Reliability &amp; Delivery Proof
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                        ✓ Audited
                      </span>
                    </div>
                    <ul className="text-xs space-y-2 text-[#C0C5DD]">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>Load/chaos tests: independent worker saturation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>DLQ replay + idempotency / outbox failure tests</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>Backward-compatible DB migration &amp; rollback drill</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>Defined RPO / RTO / SLO; confirmed private origin capability</span>
                      </li>
                    </ul>
                  </div>

                  {/* Gate 03 */}
                  <div className="p-5 bg-[#0D0F1A] border border-emerald-500/30 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-emerald-400 uppercase">
                        03 Governance &amp; Recovery Proof
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                        ✓ Attested
                      </span>
                    </div>
                    <ul className="text-xs space-y-2 text-[#C0C5DD]">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>Consent, accessibility, privacy &amp; legal retention policies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>PII redaction + access / audit review validated</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>Database / object restore drills (PITR tested: 4m 12s)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>Ownership, alert response &amp; incident communication readiness</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Cryptographic Audit Stream */}
          {selectedTab === 'audit' && (
            <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#F0F2FF] font-['Geist',sans-serif]">
                    Cryptographic Platform Audit Stream
                  </h3>
                  <p className="text-xs text-[#8B91B0]">
                    SHA-256 chained transaction logs for platform operations, key rotations, and role elevations.
                  </p>
                </div>
                <button
                  onClick={() => alert('Exporting signed .sig cryptographic ledger manifest...')}
                  className="px-3 py-1.5 bg-[#0D0F1A] border border-[#252840] rounded text-xs text-[#F0F2FF] hover:border-[#4F6BED]"
                >
                  Download .sig Audit Manifest ↗
                </button>
              </div>

              <div className="space-y-3">
                {MOCK_AUDIT_STREAM.map((evt) => (
                  <div key={evt.id} className="p-3.5 bg-[#0D0F1A] border border-[#252840] rounded-lg flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{evt.type}</span>
                        <span className="text-[10px] font-mono text-[#4F6BED]">by {evt.actor}</span>
                        <span className="text-[10px] font-mono text-slate-500">[{evt.hash}]</span>
                      </div>
                      <p className="text-xs text-[#8B91B0] mt-0.5">{evt.target}</p>
                    </div>
                    <div className="text-right font-mono text-[10px] text-[#8B91B0]">
                      <p>{evt.time}</p>
                      <span className="text-emerald-400">Cryptographically Signed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal: Onboard Institution */}
        {onboardModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#141622] border border-[#1E2238] rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-[#F0F2FF] font-['Geist',sans-serif]">
                Onboard New Institution Tenant
              </h3>
              <p className="text-xs text-[#8B91B0] mt-2 leading-relaxed">
                Provisions a dedicated tenant identity in PostgreSQL and creates an isolated VNet peering boundary.
              </p>

              <form onSubmit={handleOnboardSubmit} className="space-y-3 mt-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8B91B0] mb-1">Institution Display Name</label>
                  <input
                    type="text"
                    required
                    value={newTenant.name}
                    onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                    placeholder="e.g. Oxford Computing Faculty"
                    className="w-full bg-[#0D0F1A] border border-[#252840] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#4F6BED]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8B91B0] mb-1">Tenant Slug (Immutable Handle)</label>
                  <input
                    type="text"
                    required
                    value={newTenant.slug}
                    onChange={(e) => setNewTenant({ ...newTenant, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    placeholder="e.g. oxford-cs-enclave"
                    className="w-full bg-[#0D0F1A] border border-[#252840] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#4F6BED]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#8B91B0] mb-1">Contract Tier</label>
                    <select
                      value={newTenant.tier}
                      onChange={(e) => setNewTenant({ ...newTenant, tier: e.target.value })}
                      className="w-full bg-[#0D0F1A] border border-[#252840] rounded-lg px-2.5 py-2 text-xs text-white"
                    >
                      <option>Tier 1 Enterprise</option>
                      <option>Enterprise Gov</option>
                      <option>Academic Standard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#8B91B0] mb-1">Target Azure Region</label>
                    <select
                      value={newTenant.region}
                      onChange={(e) => setNewTenant({ ...newTenant, region: e.target.value })}
                      className="w-full bg-[#0D0F1A] border border-[#252840] rounded-lg px-2.5 py-2 text-xs text-white"
                    >
                      <option>East US</option>
                      <option>West US 2</option>
                      <option>North Europe</option>
                      <option>Central India</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-2 border-t border-[#1E2238]">
                  <button
                    type="button"
                    onClick={() => setOnboardModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-[#8B91B0] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4F6BED] hover:bg-[#3D5BE0] text-white rounded-lg text-xs font-semibold"
                  >
                    Seal Tenant Boundary &amp; Onboard
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

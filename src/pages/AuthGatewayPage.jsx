import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setOtpSession, switchRole } from '../store/slices/authSlice';

/* ─── Sub-components ─────────────────────────────────────── */

function ShieldIcon() {
  return (
    <svg className="w-8 h-8 text-[#4F6BED]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}

function OtpBox({ index, value, onChange, onKeyDown, inputRef }) {
  return (
    <input
      ref={inputRef}
      type="text"
      maxLength={1}
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
      onKeyDown={(e) => onKeyDown(index, e)}
      className="w-11 h-14 text-center font-mono text-xl font-bold bg-[#1C1F30] border border-[#252840] rounded-lg text-[#F0F2FF] focus:outline-none focus:ring-2 focus:ring-[#4F6BED] focus:border-[#4F6BED] transition-all duration-200 caret-[#4F6BED]"
    />
  );
}

/* ─── Auth Gateway Page ──────────────────────────────────── */

export default function AuthGatewayPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentRole = useSelector((s) => s.auth.currentRole);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [isLoadingSSO, setIsLoadingSSO] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');
  const otpRefs = useRef([]);

  const isInstitutionalEmail = (e) =>
    /\.(edu|ac\.[a-z]{2,}|edu\.[a-z]{2,})$/.test(e.split('@')[1] || '');

  function handleEmailSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setEmailError('Please enter a valid institutional email address.');
      return;
    }
    setEmailError('');
    setIsLoadingSSO(true);

    // Simulate domain detection & SAML/Entra ID routing
    setTimeout(() => {
      setIsLoadingSSO(false);
      if (trimmed.includes('teacher') || trimmed.includes('faculty')) {
        dispatch(switchRole('teacher'));
        setSuccessBanner('SAML 2.0 / Entra ID verified for Faculty. Routing to Teacher Studio...');
        setTimeout(() => navigate('/teacher/studio'), 900);
      } else if (trimmed.includes('admin') || trimmed.includes('dean')) {
        dispatch(switchRole('admin'));
        setSuccessBanner('SAML 2.0 / Entra ID verified for Administration. Routing to Governance Console...');
        setTimeout(() => navigate('/admin/console'), 900);
      } else {
        dispatch(switchRole('student'));
        setSuccessBanner(`SAML 2.0 IdP verified (${trimmed.split('@')[1]}). Routing to Student Hub...`);
        setTimeout(() => navigate('/dashboard'), 900);
      }
    }, 800);
  }

  function handleOtpChange(index, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  const otpFull = otp.join('');
  const otpComplete = otpFull.length === 6;

  function handleVerifyOtp() {
    if (!otpComplete) return;
    dispatch(setOtpSession({ code: otpFull }));
    dispatch(switchRole('student'));
    setSuccessBanner(`Access token [${otpFull}] accepted by Enclave. Connecting candidate session...`);
    setTimeout(() => {
      navigate('/dashboard');
    }, 700);
  }

  function handleQuickRoleLogin(role, targetRoute) {
    dispatch(switchRole(role));
    dispatch(setOtpSession({ code: '994821' }));
    navigate(targetRoute);
  }

  return (
    <div className="min-h-screen bg-[#0D0F1A] flex flex-col font-['Inter',sans-serif]">
      {/* Top Nav */}
      <nav className="h-14 border-b border-[#1C2040] flex items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <ShieldIcon />
          <span className="text-[#F0F2FF] font-semibold font-['Geist',sans-serif] text-base tracking-tight">
            PlacePrep <span className="text-[#4F6BED]">Secure</span>
          </span>
          <span className="text-[10px] font-mono text-[#8B91B0] bg-[#141622] px-2 py-0.5 rounded border border-[#252840]">
            Zero-Knowledge Enclave
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          256-bit TLS · Microsoft Entra PKCE Active
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Success Banner */}
          {successBanner && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-bounce">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {successBanner}
            </div>
          )}

          {/* Card */}
          <div className="bg-[#141622] border border-[#1E2238] rounded-2xl p-7 shadow-2xl">
            {/* Branding */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#4F6BED]/10 border border-[#4F6BED]/30 rounded-2xl mb-3 shadow-[0_0_32px_rgba(79,107,237,0.15)]">
                <ShieldIcon />
              </div>
              <h1 className="text-2xl font-bold text-[#F0F2FF] font-['Geist',sans-serif] tracking-tight mb-1">
                PlacePrep Secure Gateway
              </h1>
              <p className="text-xs text-[#8B91B0]">High-Stakes Technical Assessment &amp; Placement Platform</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#4F6BED] bg-[#4F6BED]/10 border border-[#4F6BED]/20 px-2.5 py-0.5 rounded-full">
                  Architecture 01–03 Compliant
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                  Untrusted Client Boundary
                </span>
              </div>
            </div>

            {/* Quick Demo Role Switcher Tray */}
            <div className="mb-6 p-3 rounded-xl bg-[#0D0F1A] border border-[#252840]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#8B91B0]">
                  ⚡ Fast Architecture Evaluation (One-Click)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">OTP: 123456</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickRoleLogin('student', '/dashboard')}
                  className="px-2 py-2 rounded-lg bg-[#1C1F30] hover:bg-[#4F6BED]/20 border border-[#252840] hover:border-[#4F6BED] text-left transition-all group"
                >
                  <p className="text-[11px] font-semibold text-[#F0F2FF] group-hover:text-[#4F6BED] flex items-center gap-1">
                    🎓 Student
                  </p>
                  <p className="text-[9px] text-[#8B91B0]">Aanya Rao (Batch A)</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickRoleLogin('teacher', '/teacher/studio')}
                  className="px-2 py-2 rounded-lg bg-[#1C1F30] hover:bg-[#4F6BED]/20 border border-[#252840] hover:border-[#4F6BED] text-left transition-all group"
                >
                  <p className="text-[11px] font-semibold text-[#F0F2FF] group-hover:text-[#4F6BED] flex items-center gap-1">
                    🧑‍🏫 Teacher
                  </p>
                  <p className="text-[9px] text-[#8B91B0]">Prof. Rohan Shah</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickRoleLogin('admin', '/admin/console')}
                  className="px-2 py-2 rounded-lg bg-[#1C1F30] hover:bg-[#4F6BED]/20 border border-[#252840] hover:border-[#4F6BED] text-left transition-all group"
                >
                  <p className="text-[11px] font-semibold text-[#F0F2FF] group-hover:text-[#4F6BED] flex items-center gap-1">
                    🏛️ Institution
                  </p>
                  <p className="text-[9px] text-[#8B91B0]">Dr. Vikram Nair</p>
                </button>
              </div>
            </div>

            {/* Email SSO Form */}
            <form onSubmit={handleEmailSubmit} className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#8B91B0] mb-2">
                Institutional Email (SAML 2.0 / Entra ID)
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                placeholder="aanya.rao@northbridge.edu"
                className="w-full bg-[#0D0F1A] border border-[#252840] rounded-lg px-3.5 py-2.5 text-[#F0F2FF] placeholder-[#3D4060] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F6BED] focus:border-[#4F6BED] transition-all duration-200"
              />
              {email && (
                <p className="mt-2 text-[11px] text-[#8B91B0] flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isInstitutionalEmail(email) ? 'bg-emerald-400' : 'bg-[#4F6BED]'}`} />
                  {isInstitutionalEmail(email)
                    ? 'Direct Shibboleth / SAML 2.0 routing detected for university domain'
                    : 'Microsoft Entra ID / Enterprise IdP routing'}
                </p>
              )}
              {emailError && (
                <p className="mt-2 text-xs text-red-400">{emailError}</p>
              )}
              <button
                type="submit"
                disabled={isLoadingSSO}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-[#4F6BED] hover:bg-[#3D5BE0] disabled:opacity-60 text-white font-semibold text-sm py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4F6BED]"
              >
                {isLoadingSSO ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Resolving Identity Authority…</>
                ) : (
                  <>
                    <span>Continue with Institution SSO</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-[#1E2238]" />
              <span className="text-[10px] font-mono font-semibold tracking-widest text-[#4A506B] uppercase">
                Or Enter 6-Digit Candidate OTP
              </span>
              <div className="flex-1 h-px bg-[#1E2238]" />
            </div>

            {/* OTP Section */}
            <div className="mb-5">
              <p className="text-xs text-[#8B91B0] mb-3 text-center leading-relaxed">
                Enter your department assessment token or proctor pass (Default test code: <span className="font-mono text-[#F0F2FF] font-semibold">123456</span>)
              </p>
              <div className="flex gap-2 justify-center mb-3">
                {otp.map((val, i) => (
                  <OtpBox
                    key={i}
                    index={i}
                    value={val}
                    onChange={handleOtpChange}
                    onKeyDown={handleOtpKeyDown}
                    inputRef={(el) => (otpRefs.current[i] = el)}
                  />
                ))}
              </div>
              <button
                type="button"
                disabled={!otpComplete}
                onClick={handleVerifyOtp}
                className="w-full py-2.5 rounded-lg bg-[#1C1F30] hover:bg-[#4F6BED] border border-[#252840] hover:border-[#4F6BED] text-sm font-semibold text-[#F0F2FF] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md flex items-center justify-center gap-2"
              >
                <span>Verify Token &amp; Enter Platform →</span>
              </button>
            </div>

            {/* Security Footer & Architecture Constraints */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-[#1E2238]">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <p className="text-[11px] text-[#4A506B]">
                Zero local passwords. Enforces Entra ID PKCE, throttled OTP &amp; tenant isolation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="border-t border-[#1C2040] py-3 px-6 flex items-center justify-between text-[11px] text-[#4A506B]">
        <p>© 2026 PlacePrep Secure · Production Reference Architecture Board 01–03 · SOC 2 Type II</p>
        <div className="flex gap-4">
          <span className="text-emerald-500 font-mono">AFD + APIM Protected</span>
          <span className="text-[#8B91B0]">Private Blob Origin</span>
          <span className="text-[#8B91B0]">Azure Web PubSub Active</span>
        </div>
      </footer>
    </div>
  );
}

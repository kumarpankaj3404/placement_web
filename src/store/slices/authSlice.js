import { createSlice } from '@reduxjs/toolkit';

const ROLES_DATA = {
  student: {
    id: 'usr_student_01',
    name: 'Aanya Rao',
    initials: 'AR',
    role: 'student',
    batch: 'Batch A · 2026',
    institution: 'Northbridge Institute',
    email: 'aanya.rao@northbridge.edu',
    status: 'active',
  },
  teacher: {
    id: 'usr_teacher_01',
    name: 'Prof. Rohan Shah',
    initials: 'RS',
    role: 'teacher',
    batch: 'CSE Faculty',
    institution: 'Northbridge Institute',
    email: 'rohan.shah@northbridge.edu',
    status: 'active',
  },
  admin: {
    id: 'usr_admin_01',
    name: 'Dr. Vikram Nair',
    initials: 'VN',
    role: 'admin',
    batch: 'Institutional Governance',
    institution: 'Northbridge Institute',
    email: 'dean.nair@northbridge.edu',
    status: 'active',
  },
  superadmin: {
    id: 'usr_superadmin_01',
    name: 'SecOps Officer',
    initials: 'SO',
    role: 'superadmin',
    batch: 'Global Enclave Oversight',
    institution: 'PlacePrep Platform Operations',
    email: 'secops@placeprep.internal',
    status: 'active',
  },
};

const initialState = {
  token: 'mock_jwt_token_placeprep_256bit',
  user: ROLES_DATA.student,
  currentRole: 'student',
  ssoSession: null,
  otpSession: null,
  authFlow: 'email', // 'email' | 'sso_redirect' | 'otp'
  isAuthenticated: true,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthFlow: (state, action) => {
      state.authFlow = action.payload;
      state.error = null;
    },
    setOtpSession: (state, action) => {
      state.otpSession = action.payload;
      // When 6-digit OTP is verified, mark authenticated
      state.isAuthenticated = true;
      state.token = 'mock_jwt_verified_otp_' + action.payload.code;
      state.error = null;
    },
    setSsoSession: (state, action) => {
      state.ssoSession = action.payload;
    },
    switchRole: (state, action) => {
      const targetRole = action.payload;
      if (ROLES_DATA[targetRole]) {
        state.currentRole = targetRole;
        state.user = ROLES_DATA[targetRole];
        state.isAuthenticated = true;
      }
    },
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.currentRole = action.payload.user?.role || 'student';
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.otpSession = null;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setAuthFlow,
  setOtpSession,
  setSsoSession,
  switchRole,
  loginSuccess,
  logout,
  setAuthError,
} = authSlice.actions;

export default authSlice.reducer;

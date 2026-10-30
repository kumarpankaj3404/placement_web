import { createSlice } from '@reduxjs/toolkit';

/**
 * Assessment state.
 * IMPORTANT: serverTimeOffset = (server_time - local_time) in ms.
 * All deadline calculations MUST add serverTimeOffset to local Date.now()
 * to approximate server-authoritative time. The browser clock is untrusted.
 */
const initialState = {
  activeSessionId: null,
  problem: null,
  code: '# Write your solution here\n',
  language: 'python',
  consoleOutput: [],
  testResults: [],
  // Server-authoritative timing fields
  startedAt: null,      // ISO string from server
  deadlineAt: null,     // ISO string from server
  serverTimeOffset: 0,  // ms difference: server_time - local_time
  submissionStatus: 'idle', // 'idle' | 'running' | 'submitted' | 'judging'
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setSession: (state, action) => {
      const { sessionId, problem, startedAt, deadlineAt, serverTime } = action.payload;
      state.activeSessionId = sessionId;
      state.problem = problem;
      state.startedAt = startedAt;
      state.deadlineAt = deadlineAt;
      // Compute offset so UI timer stays server-authoritative
      if (serverTime) {
        state.serverTimeOffset = new Date(serverTime).getTime() - Date.now();
      }
    },
    setCode: (state, action) => {
      state.code = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    appendConsoleOutput: (state, action) => {
      state.consoleOutput.push(action.payload);
    },
    clearConsole: (state) => {
      state.consoleOutput = [];
    },
    setTestResults: (state, action) => {
      state.testResults = action.payload;
    },
    setSubmissionStatus: (state, action) => {
      state.submissionStatus = action.payload;
    },
    syncServerTime: (state, action) => {
      // Called whenever a server timestamp is received (e.g. via WebSocket ping)
      state.serverTimeOffset = new Date(action.payload.serverTime).getTime() - Date.now();
    },
  },
});

export const {
  setSession, setCode, setLanguage, appendConsoleOutput,
  clearConsole, setTestResults, setSubmissionStatus, syncServerTime,
} = assessmentSlice.actions;
export default assessmentSlice.reducer;

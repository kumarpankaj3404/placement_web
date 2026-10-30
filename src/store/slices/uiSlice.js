import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarCollapsed: false,
  leaderboardScope: 'cohort', // 'cohort' | 'global'
  activeAssessmentTab: 'all',
  consoleTab: 'testResults',
  problemTab: 'description',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setLeaderboardScope: (state, action) => {
      state.leaderboardScope = action.payload;
    },
    setActiveAssessmentTab: (state, action) => {
      state.activeAssessmentTab = action.payload;
    },
    setConsoleTab: (state, action) => {
      state.consoleTab = action.payload;
    },
    setProblemTab: (state, action) => {
      state.problemTab = action.payload;
    },
  },
});

export const {
  toggleSidebar, setLeaderboardScope, setActiveAssessmentTab,
  setConsoleTab, setProblemTab,
} = uiSlice.actions;
export default uiSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  connectionStatus: 'connecting', // 'connecting' | 'healthy' | 'reconnecting' | 'disconnected'
  latencyMs: null,
  peerNode: null,
  cameraActive: false,
  micActive: false,
  gazeData: { x: 0, y: 0, confidence: 0 },
  anomalies: [],
  focusFeed: [],
  audioLevel: 0,
};

const proctoringSlice = createSlice({
  name: 'proctoring',
  initialState,
  reducers: {
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    setLatency: (state, action) => {
      state.latencyMs = action.payload.latencyMs;
      state.peerNode = action.payload.peerNode;
    },
    setCameraActive: (state, action) => {
      state.cameraActive = action.payload;
    },
    setMicActive: (state, action) => {
      state.micActive = action.payload;
    },
    updateGaze: (state, action) => {
      state.gazeData = action.payload;
    },
    addAnomaly: (state, action) => {
      state.anomalies.push({ ...action.payload, ts: Date.now() });
    },
    addFocusEvent: (state, action) => {
      state.focusFeed = [action.payload, ...state.focusFeed].slice(0, 20);
    },
    setAudioLevel: (state, action) => {
      state.audioLevel = action.payload;
    },
  },
});

export const {
  setConnectionStatus, setLatency, setCameraActive, setMicActive,
  updateGaze, addAnomaly, addFocusEvent, setAudioLevel,
} = proctoringSlice.actions;
export default proctoringSlice.reducer;

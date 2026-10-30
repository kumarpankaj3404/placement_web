import { configureStore } from '@reduxjs/toolkit';
import { placePrepApi } from './api/placePrepApi';
import authReducer from './slices/authSlice';
import assessmentReducer from './slices/assessmentSlice';
import proctoringReducer from './slices/proctoringSlice';
import catalogReducer from './slices/catalogSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assessment: assessmentReducer,
    proctoring: proctoringReducer,
    catalog: catalogReducer,
    ui: uiReducer,
    [placePrepApi.reducerPath]: placePrepApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(placePrepApi.middleware),
});

export default store;

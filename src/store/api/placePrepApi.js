import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * RTK Query API slice for PlacePrep Secure.
 * All endpoints connect to the institutional backend.
 * Assessment timestamps use server-authoritative started_at / deadline_at —
 * the browser clock is strictly untrusted for countdown computation.
 */
export const placePrepApi = createApi({
  reducerPath: 'placePrepApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Assessments', 'Catalog', 'Leaderboard', 'Telemetry', 'User'],
  endpoints: (builder) => ({
    // ── Auth ──────────────────────────────────────────────────
    resolveEmailDomain: builder.mutation({
      query: (email) => ({ url: '/auth/resolve-domain', method: 'POST', body: { email } }),
    }),
    initiateSSO: builder.mutation({
      query: ({ email, provider }) => ({ url: '/auth/sso/initiate', method: 'POST', body: { email, provider } }),
    }),
    verifyOTP: builder.mutation({
      query: ({ code, session_id }) => ({ url: '/auth/otp/verify', method: 'POST', body: { code, session_id } }),
    }),

    // ── Dashboard ─────────────────────────────────────────────
    getStudentProfile: builder.query({
      query: () => '/me',
      providesTags: ['User'],
    }),
    getStudentMetrics: builder.query({
      query: () => '/me/metrics',
      providesTags: ['User'],
    }),
    getActiveAssignments: builder.query({
      query: () => '/assignments?status=active',
      providesTags: ['Assessments'],
    }),
    getFocusDrills: builder.query({
      query: () => '/drills?type=focus&limit=8',
    }),
    getLeaderboard: builder.query({
      query: (scope = 'cohort') => `/leaderboard?scope=${scope}`,
      providesTags: ['Leaderboard'],
    }),
    getCognitiveTelemetry: builder.query({
      query: () => '/me/telemetry/cognitive',
      providesTags: ['Telemetry'],
    }),

    // ── Immersion Mode ────────────────────────────────────────
    getAssessmentSession: builder.query({
      /**
       * Returns server-authoritative started_at and deadline_at timestamps.
       * The browser clock MUST NOT be trusted for timer computation.
       * Use (deadline_at - Date.now()) only as a fallback approximation;
       * always prefer server-pushed updates via WebSocket.
       */
      query: (sessionId) => `/sessions/${sessionId}`,
      providesTags: (result, error, id) => [{ type: 'Assessments', id }],
    }),
    submitCode: builder.mutation({
      query: ({ sessionId, code, language }) => ({
        url: `/sessions/${sessionId}/submit`,
        method: 'POST',
        body: { code, language },
      }),
    }),
    runCode: builder.mutation({
      query: ({ sessionId, code, language, testcases }) => ({
        url: `/sessions/${sessionId}/run`,
        method: 'POST',
        body: { code, language, testcases },
      }),
    }),

    // ── Content Repository ────────────────────────────────────
    getCatalog: builder.query({
      query: (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        return `/catalog?${params}`;
      },
      providesTags: ['Catalog'],
    }),
  }),
});

export const {
  useResolveEmailDomainMutation,
  useInitiateSSOmutation,
  useVerifyOTPMutation,
  useGetStudentProfileQuery,
  useGetStudentMetricsQuery,
  useGetActiveAssignmentsQuery,
  useGetFocusDrillsQuery,
  useGetLeaderboardQuery,
  useGetCognitiveTelemetryQuery,
  useGetAssessmentSessionQuery,
  useSubmitCodeMutation,
  useRunCodeMutation,
  useGetCatalogQuery,
} = placePrepApi;

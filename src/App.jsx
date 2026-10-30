import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store';

// Core Application Pages
import AuthGatewayPage from './pages/AuthGatewayPage';
import DashboardPage from './pages/DashboardPage';
import ImmersionModePage from './pages/ImmersionModePage';
import ContentRepositoryPage from './pages/ContentRepositoryPage';

// Multi-Role Architecture Pages (Platform Experience & Access Map 01–03)
import TeacherStudioPage from './pages/TeacherStudioPage';
import ProctoringReviewPage from './pages/ProctoringReviewPage';
import StudentSkillStudioPage from './pages/StudentSkillStudioPage';
import InstitutionAdminPage from './pages/InstitutionAdminPage';
import SuperAdminPlatformConsolePage from './pages/SuperAdminPlatformConsolePage';
import AssessmentResultPage from './pages/AssessmentResultPage';
import GamifiedRoundRunnerPage from './pages/GamifiedRoundRunnerPage';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Shared Front Door: Institutional Auth Gateway */}
          <Route path="/" element={<AuthGatewayPage />} />
          <Route path="/auth" element={<AuthGatewayPage />} />

          {/* Student Workspace (Prepare, Practice, Grow) */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/career-copilot" element={<StudentSkillStudioPage />} />
          <Route path="/drills" element={<StudentSkillStudioPage />} />
          <Route path="/practice/round" element={<GamifiedRoundRunnerPage />} />
          <Route path="/practice/:type" element={<GamifiedRoundRunnerPage />} />
          <Route path="/catalog" element={<ContentRepositoryPage />} />
          <Route path="/assessment/result" element={<AssessmentResultPage />} />
          <Route path="/assessment/result/:attemptId" element={<AssessmentResultPage />} />

          {/* Immersion Mode (Fullscreen Zero-Distraction Sandbox & Proctored Telemetry) */}
          <Route path="/assess/:sessionId" element={<ImmersionModePage />} />
          <Route path="/assess" element={<ImmersionModePage />} />

          {/* Teacher Workspace (Teach With Insight: Studio, Live Grid, Flow E Audit) */}
          <Route path="/teacher/studio" element={<TeacherStudioPage />} />
          <Route path="/teacher/proctoring-review" element={<ProctoringReviewPage />} />
          <Route path="/teacher/analytics" element={<TeacherStudioPage />} />

          {/* Institution Admin Console (Governance, Batches, Azure Health) */}
          <Route path="/admin/console" element={<InstitutionAdminPage />} />
          <Route path="/admin/audit-log" element={<InstitutionAdminPage />} />

          {/* Super-Admin Platform Console (Multi-Tenant Enclave Operations & Readiness Gates) */}
          <Route path="/superadmin" element={<SuperAdminPlatformConsolePage />} />
          <Route path="/platform-console" element={<SuperAdminPlatformConsolePage />} />

          {/* Aliases & Fallbacks */}
          <Route path="/assessments" element={<DashboardPage />} />
          <Route path="/leaderboard" element={<DashboardPage />} />
          <Route path="/settings" element={<InstitutionAdminPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

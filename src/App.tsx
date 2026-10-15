import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppShell } from "./components/ui";

const DashboardPage = lazy(() => import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));
const StudentDetailRoute = lazy(() => import("./pages/StudentDetailPage").then((module) => ({ default: module.StudentDetailRoute })));
const StudentListPage = lazy(() => import("./pages/StudentListPage").then((module) => ({ default: module.StudentListPage })));
const TeacherDashboardPage = lazy(() => import("./pages/TeacherDashboardPage").then((module) => ({ default: module.TeacherDashboardPage })));

function PageLoading() {
  return <main className="loading-page" role="status"><span className="loading-mark" /><span>Sedang membuka ruang belajar…</span></main>;
}

function AuthenticatedWorkspace({ children }: { children: ReactNode }) {
  const { isDemoMode, loading, user } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoading />;
  if (!isDemoMode && !user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <AppShell>{children}</AppShell>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AuthenticatedWorkspace><DashboardPage /></AuthenticatedWorkspace>} />
        <Route path="/students" element={<AuthenticatedWorkspace><StudentListPage /></AuthenticatedWorkspace>} />
        <Route path="/students/:studentId" element={<AuthenticatedWorkspace><StudentDetailRoute /></AuthenticatedWorkspace>} />
        <Route path="/teacher" element={<AuthenticatedWorkspace><TeacherDashboardPage /></AuthenticatedWorkspace>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return <AuthProvider><BrowserRouter><AppRoutes /></BrowserRouter></AuthProvider>;
}

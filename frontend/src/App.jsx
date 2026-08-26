import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/layout/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import AddCandidate from "./pages/AddCandidate";
import CandidateProfile from "./pages/CandidateProfile";
import ResumeSearch from "./pages/ResumeSearch";
import JobMatches from "./pages/JobMatches";
import Jobs from "./pages/Jobs";
import AICalls from "./pages/AICalls";
import CallScripts from "./pages/CallScripts";
import CreateCallScript from "./pages/CreateCallScript";

import Interviews from "./pages/Interviews";
import Documents from "./pages/Documents";
import Employees from "./pages/Employees";
import Settings from "./pages/Settings";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />

        {/* Candidates */}
        <Route
          path="/admin/candidates"
          element={
            <AdminLayout>
              <Candidates />
            </AdminLayout>
          }
        />

        {/* Add Candidate */}
        <Route
          path="/admin/candidates/new"
          element={
            <AdminLayout>
              <AddCandidate />
            </AdminLayout>
          }
        />

        {/* Candidate Profile */}
        <Route
          path="/admin/candidates/:id"
          element={
            <AdminLayout>
              <CandidateProfile />
            </AdminLayout>
          }
        />

        {/* Resume Search */}
        <Route
          path="/admin/resume-search"
          element={
            <AdminLayout>
              <ResumeSearch />
            </AdminLayout>
          }
        />

        {/* Jobs */}
        <Route
          path="/admin/jobs"
          element={
            <AdminLayout>
              <Jobs />
            </AdminLayout>
          }
        />

        {/* Job → Candidate Matches */}
        <Route
          path="/admin/jobs/:jobId/matches"
          element={
            <AdminLayout>
              <JobMatches />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/ai-calls"
          element={
            <AdminLayout>
              <AICalls />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/call-scripts"
          element={
            <AdminLayout>
              <CallScripts />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/call-scripts/new"
          element={
            <AdminLayout>
              <CreateCallScript />
            </AdminLayout>
          }
        />
        <Route
  path="/admin/interviews"
  element={
    <AdminLayout>
      <Interviews />
    </AdminLayout>
  }
/>

<Route
  path="/admin/documents"
  element={
    <AdminLayout>
      <Documents />
    </AdminLayout>
  }
/>

<Route
  path="/admin/employees"
  element={
    <AdminLayout>
      <Employees />
    </AdminLayout>
  }
/>

<Route
  path="/admin/settings"
  element={
    <AdminLayout>
      <Settings />
    </AdminLayout>
  }
/>
        {/* Unknown Admin Route */}
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

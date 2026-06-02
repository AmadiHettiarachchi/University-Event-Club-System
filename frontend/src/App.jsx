import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import ClubLeaderDashboard from "./pages/ClubLeaderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import EventPost from "./pages/EventPost";
import MarkAttendance from "./pages/MarkAttendance";
import SubmitFeedback from "./pages/SubmitFeedback";
import CreateAnnouncement from "./pages/CreateAnnouncement";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/club-leader-dashboard"
        element={
          <ProtectedRoute allowedRoles={["clubLeader"]}>
            <ClubLeaderDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-event"
        element={
          <ProtectedRoute allowedRoles={["clubLeader"]}>
            <CreateEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-event/:id"
        element={
          <ProtectedRoute allowedRoles={["clubLeader"]}>
            <EditEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/event-post"
        element={
          <ProtectedRoute allowedRoles={["clubLeader"]}>
            <EventPost />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mark-attendance"
        element={
          <ProtectedRoute allowedRoles={["clubLeader"]}>
            <MarkAttendance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-announcement"
        element={
          <ProtectedRoute allowedRoles={["clubLeader"]}>
            <CreateAnnouncement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/submit-feedback"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <SubmitFeedback />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
    

  );
}

export default App;
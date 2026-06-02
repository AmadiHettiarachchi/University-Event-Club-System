import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import ClubLeaderDashboard from "./pages/ClubLeaderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateEvent from "./pages/CreateEvent";
import EventPost from "./pages/EventPost";
import EditEvent from "./pages/EditEvent";
import MarkAttendance from "./pages/MarkAttendance";
import SubmitFeedback from "./pages/SubmitFeedback";
import CreateAnnouncement from "./pages/CreateAnnouncement";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/club-leader-dashboard" element={<ClubLeaderDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/event-post" element={<EventPost />} />
      <Route path="/edit-event/:id" element={<EditEvent />} />
      <Route path="/mark-attendance" element={<MarkAttendance />} />
      <Route path="/submit-feedback" element={<SubmitFeedback />} />
      <Route path="/create-announcement" element={<CreateAnnouncement />} />


    </Routes>
  );
}

export default App;
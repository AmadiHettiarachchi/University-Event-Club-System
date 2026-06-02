import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  UserCheck,
  CalendarDays,
  ClipboardList,
  CheckCircle,
  MessageSquare,
  Megaphone,
} from "lucide-react";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get("http://localhost:5000/api/admin/stats");
      setStats(res.data);
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 p-10">
      <div className="bg-white shadow-xl rounded-3xl p-8 border border-blue-100">
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-orange-500 font-bold mb-2">Admin Dashboard</p>

            <h1 className="text-4xl font-extrabold text-blue-950">
              Welcome, {user?.name}
            </h1>

            <p className="text-slate-600 mt-3">
              Monitor university clubs, events, students, attendance, feedback,
              and announcements.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-blue-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-800"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Users />}
            title="Total Students"
            value={stats.totalStudents}
          />

          <StatCard
            icon={<UserCheck />}
            title="Club Leaders"
            value={stats.totalClubLeaders}
          />

          <StatCard
            icon={<CalendarDays />}
            title="Events"
            value={stats.totalEvents}
          />

          <StatCard
            icon={<ClipboardList />}
            title="Registrations"
            value={stats.totalRegistrations}
          />

          <StatCard
            icon={<CheckCircle />}
            title="Attendance"
            value={stats.totalAttendance}
          />

          <StatCard
            icon={<MessageSquare />}
            title="Feedback"
            value={stats.totalFeedback}
          />

          <StatCard
            icon={<Megaphone />}
            title="Announcements"
            value={stats.totalAnnouncements}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 hover:-translate-y-1 transition">
      <div className="bg-orange-100 text-orange-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
        {icon}
      </div>

      <h3 className="text-slate-600 font-semibold">{title}</h3>

      <p className="text-4xl font-extrabold text-blue-950 mt-2">
        {value ?? 0}
      </p>
    </div>
  );
}

export default AdminDashboard;
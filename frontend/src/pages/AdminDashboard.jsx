import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AutoEventPoster from "../components/AutoEventPoster";
import EventStatusBadge from "../components/EventStatusBadge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import campusBg from "../assets/campus-bg.jpg";
import {
  Users,
  UserCheck,
  CalendarDays,
  ClipboardList,
  CheckCircle,
  MessageSquare,
  Megaphone,
  FileDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchAdminData = async () => {
    const statsRes = await axios.get("http://localhost:5000/api/admin/stats");
    const usersRes = await axios.get("http://localhost:5000/api/admin/users");
    const eventsRes = await axios.get("http://localhost:5000/api/admin/events");

    setStats(statsRes.data);
    setUsers(usersRes.data);
    setEvents(eventsRes.data);

    let allRegistrations = [];
    let allAttendance = [];

    for (const event of eventsRes.data) {
      const registrationRes = await axios.get(
        `http://localhost:5000/api/event-registrations/club/${event.club}`
      );

      const attendanceRes = await axios.get(
        `http://localhost:5000/api/attendance/club/${event.club}`
      );

      allRegistrations = [...allRegistrations, ...registrationRes.data];
      allAttendance = [...allAttendance, ...attendanceRes.data];
    }

    setRegistrations(allRegistrations);
    setAttendance(allAttendance);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const students = users.filter((item) => item.role === "student");
  const clubLeaders = users.filter((item) => item.role === "clubLeader");
  const admins = users.filter((item) => item.role === "admin");

  const usersByRoleData = [
    { name: "Students", value: students.length },
    { name: "Club Leaders", value: clubLeaders.length },
    { name: "Admin", value: admins.length },
  ];

  const systemActivityData = [
    { name: "Events", count: stats.totalEvents || 0 },
    { name: "Registrations", count: stats.totalRegistrations || 0 },
    { name: "Attendance", count: stats.totalAttendance || 0 },
    { name: "Feedback", count: stats.totalFeedback || 0 },
    { name: "Announcements", count: stats.totalAnnouncements || 0 },
  ];

  const eventsByClubData = Object.values(
    events.reduce((acc, event) => {
      if (!acc[event.club]) {
        acc[event.club] = { club: event.club, count: 0 };
      }

      acc[event.club].count += 1;
      return acc;
    }, {})
  );

  const getRegisteredStudents = (eventId) =>
    registrations.filter((reg) => reg.eventId?._id === eventId);

  const getPresentStudents = (eventId) =>
    attendance.filter((item) => item.eventId?._id === eventId);

  const downloadAttendanceReport = (event) => {
    const registeredStudents = getRegisteredStudents(event._id);
    const presentStudents = getPresentStudents(event._id);

    const totalRegistered = registeredStudents.length;
    const totalPresent = presentStudents.length;
    const totalAbsent = totalRegistered - totalPresent;

    const attendancePercentage =
      totalRegistered === 0
        ? "0%"
        : `${((totalPresent / totalRegistered) * 100).toFixed(1)}%`;

    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138);
    doc.text("Event Attendance Report", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    doc.text(`Event: ${event.title}`, 14, 35);
    doc.text(`Club: ${event.club}`, 14, 43);
    doc.text(`Venue: ${event.venue}`, 14, 51);
    doc.text(`Date: ${new Date(event.date).toDateString()}`, 14, 59);

    doc.setFont("helvetica", "bold");
    doc.text(`Total Registered: ${totalRegistered}`, 14, 75);
    doc.text(`Total Present: ${totalPresent}`, 14, 83);
    doc.text(`Total Absent: ${totalAbsent}`, 14, 91);
    doc.text(`Attendance Percentage: ${attendancePercentage}`, 14, 99);

    const tableData = registeredStudents.map((student, index) => {
      const isPresent = presentStudents.some(
        (present) =>
          present.studentId === student.studentId ||
          present.studentEmail === student.studentEmail
      );

      return [
        index + 1,
        student.studentName,
        student.studentEmail,
        isPresent ? "Present" : "Absent",
      ];
    });

    autoTable(doc, {
      startY: 110,
      head: [["No", "Student Name", "Email", "Status"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [30, 58, 138],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255],
      },
      styles: {
        fontSize: 10,
      },
    });

    doc.save(`${event.title}-attendance-report.pdf`);
  };

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
      alert("User deleted successfully");
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const deleteEvent = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/events/${eventId}`);
      alert("Event deleted successfully");
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete event");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed p-10 relative"
      style={{ backgroundImage: `url(${campusBg})` }}
    >
      <div className="absolute inset-0 bg-sky-100/35"></div>

      <div className="relative z-10 bg-sky-50/70 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/60">
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-orange-500 font-bold mb-2">Admin Dashboard</p>

            <h1 className="text-4xl font-extrabold text-blue-950">
              Welcome, {user?.name}
            </h1>

            <p className="text-blue-900 mt-3">
              Monitor university clubs, events, students, attendance, feedback,
              announcements, and system performance.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/profile"
              className="bg-blue-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-800"
            >
              My Profile
            </Link>

            <button
              onClick={handleLogout}
              className="bg-orange-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-orange-600"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          <StatCard icon={<Users />} title="Total Students" value={stats.totalStudents} />
          <StatCard icon={<UserCheck />} title="Club Leaders" value={stats.totalClubLeaders} />
          <StatCard icon={<CalendarDays />} title="Events" value={stats.totalEvents} />
          <StatCard icon={<ClipboardList />} title="Registrations" value={stats.totalRegistrations} />
          <StatCard icon={<CheckCircle />} title="Attendance" value={stats.totalAttendance} />
          <StatCard icon={<MessageSquare />} title="Feedback" value={stats.totalFeedback} />
          <StatCard icon={<Megaphone />} title="Announcements" value={stats.totalAnnouncements} />
        </div>

        <h2 className="text-2xl font-extrabold text-blue-950 mt-12 mb-5">
          Analytics Overview
        </h2>

        <div className="grid lg:grid-cols-3 gap-6">
          <ChartCard title="Users by Role">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={usersByRoleData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {usersByRoleData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#1E3A8A" : index === 1 ? "#F97316" : "#16A34A"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="System Activity">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={systemActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#F97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Events by Club">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={eventsByClubData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="club" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#1E3A8A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <UserSection title={`Students (${students.length})`} users={students} type="student" deleteUser={deleteUser} />
        <UserSection title={`Club Leaders (${clubLeaders.length})`} users={clubLeaders} type="leader" deleteUser={deleteUser} />
        <UserSection title={`Admin (${admins.length})`} users={admins} type="admin" deleteUser={deleteUser} />

        <h2 className="text-2xl font-extrabold text-blue-950 mt-12 mb-5">
          All Events
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <p className="text-blue-900">No events found.</p>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                className="bg-sky-50/65 backdrop-blur-sm rounded-2xl p-6 border border-white/70 shadow-lg"
              >
                <AutoEventPoster event={event} />

                <div className="mb-4">
                  <EventStatusBadge date={event.date} />
                </div>

                <p className="text-orange-500 font-bold mb-2">{event.club}</p>

                <h3 className="text-xl font-extrabold text-blue-950 mb-2">
                  {event.title}
                </h3>

                <p className="text-blue-900 mb-3">{event.description}</p>

                <p className="text-sm text-blue-900">
                  📍 <span className="font-bold">{event.venue}</span>
                </p>

                <p className="text-sm text-blue-900">
                  📅 {new Date(event.date).toDateString()}
                </p>

                <p className="text-xs text-slate-600 mt-3">
                  Created by: {event.createdBy}
                </p>

                <div className="mt-4 flex flex-col gap-3">
                  <button
                    onClick={() => downloadAttendanceReport(event)}
                    className="flex items-center justify-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-orange-600"
                  >
                    <FileDown size={18} />
                    Attendance Report
                  </button>

                  <button
                    onClick={() => deleteEvent(event._id)}
                    className="bg-red-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-red-600"
                  >
                    Delete Event
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/70 shadow-sm">
      <h3 className="text-xl font-extrabold text-blue-950 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function UserSection({ title, users, type, deleteUser }) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-extrabold text-blue-950 mb-5">{title}</h2>

      <div className="overflow-x-auto bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/70">
        {users.length === 0 ? (
          <p className="text-blue-900">No users found.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-blue-950 border-b border-blue-200">
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">
                  {type === "student" ? "Joined Clubs" : type === "leader" ? "Managing Club" : "Role"}
                </th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((item) => (
                <tr key={item._id} className="border-b border-blue-100 text-blue-900">
                  <td className="py-3 font-semibold">{item.name}</td>
                  <td className="py-3">{item.email}</td>
                  <td className="py-3">
                    {type === "student" ? item.clubs?.join(", ") : type === "leader" ? item.leaderClub : "System Admin"}
                  </td>
                  <td className="py-3">
                    {type === "admin" ? (
                      <span className="text-slate-500 font-semibold">Protected</span>
                    ) : (
                      <button
                        onClick={() => deleteUser(item._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/70 hover:-translate-y-1 transition shadow-sm">
      <div className="bg-orange-100/90 text-orange-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
        {icon}
      </div>

      <h3 className="text-blue-900 font-semibold">{title}</h3>

      <p className="text-4xl font-extrabold text-blue-950 mt-2">
        {value ?? 0}
      </p>
    </div>
  );
}

export default AdminDashboard;
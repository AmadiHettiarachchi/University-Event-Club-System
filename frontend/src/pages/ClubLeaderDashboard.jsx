import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Megaphone, FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AutoEventPoster from "../components/AutoEventPoster";
import EventStatusBadge from "../components/EventStatusBadge";
import campusBg from "../assets/campus-bg.jpg";

function ClubLeaderDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const eventRes = await axios.get(
        `http://localhost:5000/api/events/club/${user?.leaderClub}`
      );

      const registrationRes = await axios.get(
        `http://localhost:5000/api/event-registrations/club/${user?.leaderClub}`
      );

      const attendanceRes = await axios.get(
        `http://localhost:5000/api/attendance/club/${user?.leaderClub}`
      );

      const feedbackRes = await axios.get(
        `http://localhost:5000/api/feedback/club/${user?.leaderClub}`
      );

      const announcementRes = await axios.get(
        `http://localhost:5000/api/announcements/club/${user?.leaderClub}`
      );

      setEvents(eventRes.data);
      setRegistrations(registrationRes.data);
      setAttendance(attendanceRes.data);
      setFeedback(feedbackRes.data);
      setAnnouncements(announcementRes.data);
    };

    fetchData();
  }, []);

  const getRegisteredStudents = (eventId) =>
    registrations.filter((reg) => reg.eventId?._id === eventId);

  const getPresentStudents = (eventId) =>
    attendance.filter((item) => item.eventId?._id === eventId);

  const getEventFeedback = (eventId) =>
    feedback.filter((item) => item.eventId?._id === eventId);

  const getAverageRating = (eventFeedback) => {
    if (eventFeedback.length === 0) return "0.0";
    const total = eventFeedback.reduce((sum, item) => sum + item.rating, 0);
    return (total / eventFeedback.length).toFixed(1);
  };

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
        <div className="flex justify-between items-start">
          <div>
            <p className="text-orange-500 font-bold mb-2">
              Club Leader Dashboard
            </p>

            <h1 className="text-4xl font-extrabold text-blue-950">
              {user?.leaderClub} Dashboard
            </h1>

            <p className="text-blue-900 mt-3">
              Welcome, <span className="font-bold">{user?.name}</span>. You are
              managing{" "}
              <span className="font-bold text-orange-500">
                {user?.leaderClub}
              </span>
              .
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-orange-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-orange-600"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            to="/create-event"
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600"
          >
            Create Event
          </Link>

          <Link
            to="/mark-attendance"
            className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800"
          >
            Mark Attendance
          </Link>

          <Link
            to="/create-announcement"
            className="bg-orange-100/80 text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-200 border border-orange-300"
          >
            Create Announcement
          </Link>
        </div>

        <div className="mt-10 rounded-3xl bg-gradient-to-r from-orange-400/80 to-blue-500/80 p-1 shadow-xl">
          <div className="bg-sky-50/75 backdrop-blur-sm rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-orange-100/90 text-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center">
                <Megaphone size={26} />
              </div>

              <div>
                <p className="text-orange-500 font-bold">Important Updates</p>
                <h2 className="text-2xl font-extrabold text-blue-950">
                  Club Announcements
                </h2>
              </div>
            </div>

            {announcements.length === 0 ? (
              <p className="text-blue-900">No announcements created yet.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {announcements.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border-l-4 border-orange-400 shadow-sm"
                  >
                    <h3 className="text-xl font-extrabold text-blue-950 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-blue-900">{item.message}</p>

                    <p className="text-xs text-slate-600 mt-3">
                      {new Date(item.createdAt).toDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-blue-950 mt-10 mb-5">
          Your Club Events, Registrations, Attendance & Feedback
        </h2>

        {events.length === 0 ? (
          <p className="text-blue-900">No events created yet.</p>
        ) : (
          <div className="space-y-6">
            {events.map((event) => {
              const students = getRegisteredStudents(event._id);
              const presentStudents = getPresentStudents(event._id);
              const eventFeedback = getEventFeedback(event._id);
              const avgRating = getAverageRating(eventFeedback);

              return (
                <div
                  key={event._id}
                  className="bg-sky-50/65 backdrop-blur-sm rounded-2xl p-6 border border-white/70 shadow-lg"
                >
                  <AutoEventPoster event={event} />

                  <div className="mb-4">
                    <EventStatusBadge date={event.date} />
                  </div>

                  <div className="flex flex-col lg:flex-row justify-between items-start gap-5">
                    <div>
                      <p className="text-orange-500 font-bold mb-2">
                        {event.club}
                      </p>

                      <h3 className="text-2xl font-extrabold text-blue-950 mb-2">
                        {event.title}
                      </h3>

                      <p className="text-blue-900 mb-3">
                        {event.description}
                      </p>

                      <p className="text-sm text-blue-900">
                        📍 <span className="font-bold">{event.venue}</span>
                      </p>

                      <p className="text-sm text-blue-900">
                        📅 {new Date(event.date).toDateString()}
                      </p>

                      <p className="text-sm text-blue-900 mt-2">
                        ⭐ Average Rating:{" "}
                        <span className="font-bold text-orange-500">
                          {avgRating}/5
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full lg:w-auto">
                      <Link
                        to={`/edit-event/${event._id}`}
                        state={{ event }}
                        className="bg-blue-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-800 text-center"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => downloadAttendanceReport(event)}
                        className="flex items-center justify-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-orange-600"
                      >
                        <FileDown size={18} />
                        Attendance Report
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <Section
                      title={`Registered Students (${students.length})`}
                      color="orange"
                    >
                      {students.length === 0 ? (
                        <p className="text-blue-900">
                          No students registered yet.
                        </p>
                      ) : (
                        students.map((student) => (
                          <Person
                            key={student._id}
                            name={student.studentName}
                            email={student.studentEmail}
                          />
                        ))
                      )}
                    </Section>

                    <Section
                      title={`Present Students (${presentStudents.length})`}
                      color="green"
                    >
                      {presentStudents.length === 0 ? (
                        <p className="text-blue-900">
                          No attendance marked yet.
                        </p>
                      ) : (
                        presentStudents.map((student) => (
                          <Person
                            key={student._id}
                            name={student.studentName}
                            email={student.studentEmail}
                          />
                        ))
                      )}
                    </Section>

                    <Section
                      title={`Feedback (${eventFeedback.length})`}
                      color="blue"
                    >
                      {eventFeedback.length === 0 ? (
                        <p className="text-blue-900">No feedback yet.</p>
                      ) : (
                        eventFeedback.map((item) => (
                          <div
                            key={item._id}
                            className="border-b border-blue-100 py-3"
                          >
                            <p className="font-bold text-blue-950">
                              {item.studentName}
                            </p>

                            <p className="text-sm text-orange-500 font-bold">
                              Rating: {item.rating}/5
                            </p>

                            <p className="text-sm text-blue-900 mt-1">
                              {item.comment}
                            </p>
                          </div>
                        ))
                      )}
                    </Section>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, color, children }) {
  const colorClass =
    color === "orange"
      ? "text-orange-500"
      : color === "green"
      ? "text-green-600"
      : "text-blue-900";

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/70 shadow-sm">
      <h4 className={`text-lg font-extrabold mb-4 ${colorClass}`}>{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Person({ name, email }) {
  return (
    <div className="border-b border-blue-100 pb-2">
      <p className="font-semibold text-blue-950">{name}</p>
      <p className="text-sm text-blue-900">{email}</p>
    </div>
  );
}

export default ClubLeaderDashboard;
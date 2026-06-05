import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import { Megaphone } from "lucide-react";
import AutoEventPoster from "../components/AutoEventPoster";
import EventStatusBadge from "../components/EventStatusBadge";
import PageBackground from "../components/PageBackground";

function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [allClubRegistrations, setAllClubRegistrations] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    const eventRes = await axios.get("http://localhost:5000/api/events");

    const relevantEvents = eventRes.data.filter((event) =>
      user?.clubs?.includes(event.club)
    );

    const registrationRes = await axios.get(
      `http://localhost:5000/api/event-registrations/student/${user.id}`
    );

    const attendanceRes = await axios.get(
      `http://localhost:5000/api/attendance/student/${user.id}`
    );

    let allAnnouncements = [];
    let allRegs = [];

    for (const club of user?.clubs || []) {
      const announcementRes = await axios.get(
        `http://localhost:5000/api/announcements/club/${club}`
      );

      const clubRegRes = await axios.get(
        `http://localhost:5000/api/event-registrations/club/${club}`
      );

      allAnnouncements = [...allAnnouncements, ...announcementRes.data];
      allRegs = [...allRegs, ...clubRegRes.data];
    }

    const ids = registrationRes.data.map((reg) => reg.eventId);

    setEvents(relevantEvents);
    setRegistrations(registrationRes.data);
    setAllClubRegistrations(allRegs);
    setRegisteredEventIds(ids);
    setAttendance(attendanceRes.data);
    setAnnouncements(allAnnouncements);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isCompletedEvent = (date) => {
    const today = new Date();
    const eventDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    return eventDate < today;
  };

  const isRegistrationDeadlinePassed = (deadline) => {
    if (!deadline) return false;

    const today = new Date();
    const deadlineDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    return today > deadlineDate;
  };

  const getRegisteredCount = (eventId) => {
    return allClubRegistrations.filter((reg) => {
      const regEventId =
        typeof reg.eventId === "object" ? reg.eventId?._id : reg.eventId;

      return regEventId === eventId;
    }).length;
  };

  const getRemainingSeats = (event) => {
    const capacity = Number(event.capacity || 0);
    const registeredCount = getRegisteredCount(event._id);

    if (!capacity) return "Not set";

    return Math.max(capacity - registeredCount, 0);
  };

  const isEventFull = (event) => {
    const capacity = Number(event.capacity || 0);
    const registeredCount = getRegisteredCount(event._id);

    if (!capacity) return false;

    return registeredCount >= capacity;
  };

  const handleRegisterEvent = async (event) => {
    if (isCompletedEvent(event.date)) {
      setMessage("You cannot register for a completed event");
      return;
    }

    if (isRegistrationDeadlinePassed(event.registrationDeadline)) {
      setMessage("Registration deadline has passed.");
      return;
    }

    if (isEventFull(event)) {
      setMessage("Event is full. Registration closed.");
      return;
    }

    try {
      const registrationData = {
        eventId: event._id,
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email,
        club: event.club,
      };

      const res = await axios.post(
        "http://localhost:5000/api/event-registrations",
        registrationData
      );

      setMessage(res.data.message);
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  const getRegistration = (eventId) => {
    return registrations.find((reg) => reg.eventId === eventId);
  };

  const getAttendanceRecord = (eventId) => {
    return attendance.find((item) => item.eventId === eventId);
  };

  const isRegistered = (eventId) => registeredEventIds.includes(eventId);

  const isPresent = (eventId) => {
    return attendance.some((item) => item.eventId === eventId);
  };

  const isCertificateDownloaded = (eventId) => {
    const record = getAttendanceRecord(eventId);
    return record?.certificateDownloaded === true;
  };

  const getQRValue = (eventId) => {
    const registration = getRegistration(eventId);
    if (!registration?.qrToken) return "";

    return JSON.stringify({
      qrToken: registration.qrToken,
    });
  };

  const generateCertificate = (event) => {
    const doc = new jsPDF("landscape");

    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, 297, 210, "F");

    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(3);
    doc.rect(10, 10, 277, 190);

    doc.setDrawColor(249, 115, 22);
    doc.setLineWidth(1.5);
    doc.rect(16, 16, 265, 178);

    doc.setFillColor(249, 115, 22);
    doc.circle(35, 35, 14, "F");

    doc.setFillColor(30, 58, 138);
    doc.circle(262, 175, 18, "F");

    doc.setFont("times", "bold");
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(32);
    doc.text("Certificate of Participation", 148, 42, { align: "center" });

    doc.setDrawColor(249, 115, 22);
    doc.line(85, 50, 212, 50);

    doc.setFont("times", "normal");
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(16);
    doc.text("This certificate is proudly presented to", 148, 70, {
      align: "center",
    });

    doc.setFont("times", "bold");
    doc.setTextColor(249, 115, 22);
    doc.setFontSize(30);
    doc.text(user.name, 148, 94, { align: "center" });

    doc.setFont("times", "normal");
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(16);
    doc.text("for successfully participating in", 148, 115, {
      align: "center",
    });

    doc.setFont("times", "bold");
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(24);
    doc.text(event.title, 148, 137, { align: "center" });

    doc.setFont("times", "normal");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(14);
    doc.text(`Organized by: ${event.club}`, 148, 155, { align: "center" });
    doc.text(`Venue: ${event.venue}`, 148, 167, { align: "center" });
    doc.text(`Date: ${new Date(event.date).toDateString()}`, 148, 179, {
      align: "center",
    });

    doc.setFont("times", "bold");
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(16);
    doc.text("UniClubs", 148, 197, { align: "center" });

    doc.save(`${event.title}-${user.name}-certificate.pdf`);
  };

  const downloadCertificate = async (event) => {
    try {
      if (isCertificateDownloaded(event._id)) {
        setMessage("Certificate already downloaded");
        return;
      }

      generateCertificate(event);

      await axios.put(
        "http://localhost:5000/api/attendance/certificate-download",
        {
          eventId: event._id,
          studentId: user.id,
        }
      );

      setMessage("Certificate downloaded successfully");
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Certificate download failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <PageBackground>
      <div className="p-10">
        <div className="bg-white/95 shadow-xl rounded-3xl p-8 border border-white/40">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-500 font-bold mb-2">
                Student Dashboard
              </p>

              <h1 className="text-4xl font-extrabold text-blue-950">
                Welcome, {user?.name}
              </h1>
            </div>

            <div className="flex gap-3">
              <Link
                to="/profile"
                className="bg-orange-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-orange-600"
              >
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="bg-blue-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-800"
              >
                Logout
              </button>
            </div>
          </div>

          <p className="text-slate-600 mt-3">
            You have joined the following clubs:
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            {user?.clubs?.map((club) => (
              <span
                key={club}
                className="bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-bold"
              >
                {club}
              </span>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-gradient-to-r from-orange-500 to-blue-900 p-1 shadow-xl">
            <div className="bg-white rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-orange-100 text-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center">
                  <Megaphone size={26} />
                </div>

                <div>
                  <p className="text-orange-500 font-bold">
                    Important Updates
                  </p>
                  <h2 className="text-2xl font-extrabold text-blue-950">
                    Announcements
                  </h2>
                </div>
              </div>

              {announcements.length === 0 ? (
                <p className="text-slate-600">No announcements available.</p>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {announcements.map((item) => (
                    <div
                      key={item._id}
                      className="bg-orange-50 rounded-2xl p-5 border-l-4 border-orange-500 shadow-sm"
                    >
                      <p className="text-orange-500 font-bold mb-2">
                        {item.club}
                      </p>
                      <h3 className="text-xl font-extrabold text-blue-950 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-600">{item.message}</p>
                      <p className="text-xs text-slate-500 mt-3">
                        {new Date(item.createdAt).toDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {message && (
            <p className="mt-6 font-bold text-orange-600">{message}</p>
          )}

          <h2 className="text-2xl font-extrabold text-blue-950 mt-10 mb-5">
            Events From Your Clubs
          </h2>

          {events.length === 0 ? (
            <p className="text-slate-600">
              No events available for your clubs yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {events.map((event) => {
                const registration = getRegistration(event._id);
                const completed = isCompletedEvent(event.date);
                const deadlinePassed = isRegistrationDeadlinePassed(
                  event.registrationDeadline
                );
                const registeredCount = getRegisteredCount(event._id);
                const remainingSeats = getRemainingSeats(event);
                const full = isEventFull(event);

                return (
                  <div
                    key={event._id}
                    className="bg-blue-50 rounded-2xl p-6 border border-blue-100"
                  >
                    <AutoEventPoster event={event} />

                    <div className="mb-4">
                      <EventStatusBadge date={event.date} />
                    </div>

                    <p className="text-orange-500 font-bold mb-2">
                      {event.club}
                    </p>

                    <h3 className="text-xl font-extrabold text-blue-950 mb-2">
                      {event.title}
                    </h3>

                    <p className="text-slate-600 mb-3">{event.description}</p>

                    <p className="text-sm text-slate-700">
                      📍 <span className="font-bold">{event.venue}</span>
                    </p>

                    <p className="text-sm text-slate-700">
                      📅 Event Date: {new Date(event.date).toDateString()}
                    </p>

                    <p
                      className={`text-sm font-bold ${
                        deadlinePassed ? "text-red-500" : "text-blue-900"
                      }`}
                    >
                      📝 Registration Deadline:{" "}
                      {event.registrationDeadline
                        ? new Date(event.registrationDeadline).toDateString()
                        : "Not set"}
                    </p>

                    <div className="mt-4 bg-white rounded-2xl p-4 border border-blue-100">
                      <p className="text-sm text-blue-950 font-bold">
                        Capacity: {event.capacity || "Not set"}
                      </p>
                      <p className="text-sm text-blue-950 font-bold">
                        Registered: {registeredCount} /{" "}
                        {event.capacity || "Not set"}
                      </p>
                      <p
                        className={`text-sm font-bold ${
                          full ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        Remaining Seats: {remainingSeats}
                      </p>
                    </div>

                    {isRegistered(event._id) ? (
                      <div className="mt-4 bg-white rounded-2xl p-4 border border-blue-100 text-center">
                        <p className="text-green-600 font-bold mb-3">
                          Registered ✅
                        </p>

                        {registration?.qrUsed ? (
                          <p className="text-red-500 font-bold">
                            QR already used for attendance
                          </p>
                        ) : registration?.qrToken ? (
                          <>
                            <QRCodeCanvas
                              value={getQRValue(event._id)}
                              size={220}
                              level="H"
                              includeMargin={true}
                            />

                            <p className="text-xs text-slate-500 mt-3">
                              Show this QR once for attendance
                            </p>
                          </>
                        ) : (
                          <p className="text-red-500 font-bold">
                            QR token missing. Register again with a new event.
                          </p>
                        )}

                        {isPresent(event._id) && (
                          <div className="mt-4 flex flex-col gap-3">
                            <Link
                              to="/submit-feedback"
                              state={{ event }}
                              className="bg-blue-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-800"
                            >
                              Submit Feedback
                            </Link>

                            {isCertificateDownloaded(event._id) ? (
                              <button
                                disabled
                                className="bg-green-600 text-white px-5 py-2 rounded-xl font-bold cursor-not-allowed"
                              >
                                Certificate Downloaded ✅
                              </button>
                            ) : (
                              <button
                                onClick={() => downloadCertificate(event)}
                                className="bg-orange-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-orange-600"
                              >
                                Download Certificate
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : completed ? (
                      <button
                        disabled
                        className="mt-4 bg-red-400 text-white px-5 py-2 rounded-xl font-bold cursor-not-allowed"
                      >
                        Event Completed
                      </button>
                    ) : deadlinePassed ? (
                      <button
                        disabled
                        className="mt-4 bg-red-500 text-white px-5 py-2 rounded-xl font-bold cursor-not-allowed"
                      >
                        Registration Closed
                      </button>
                    ) : full ? (
                      <button
                        disabled
                        className="mt-4 bg-red-500 text-white px-5 py-2 rounded-xl font-bold cursor-not-allowed"
                      >
                        Event Full
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegisterEvent(event)}
                        className="mt-4 bg-orange-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-orange-600"
                      >
                        Register Event
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageBackground>
  );
}

export default StudentDashboard;
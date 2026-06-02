import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [attendance, setAttendance] = useState([]);
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

    const ids = registrationRes.data.map((reg) => reg.eventId);

    setEvents(relevantEvents);
    setRegistrations(registrationRes.data);
    setRegisteredEventIds(ids);
    setAttendance(attendanceRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterEvent = async (event) => {
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

  const isRegistered = (eventId) => {
    return registeredEventIds.includes(eventId);
  };

  const isPresent = (eventId) => {
    return attendance.some((item) => item.eventId === eventId);
  };

  const getQRValue = (eventId) => {
    const registration = getRegistration(eventId);

    if (!registration?.qrToken) {
      return "";
    }

    return JSON.stringify({
      qrToken: registration.qrToken,
    });
  };

 const downloadCertificate = (event) => {
  const doc = new jsPDF("landscape");

  // Background
  doc.setFillColor(240, 248, 255);
  doc.rect(0, 0, 297, 210, "F");

  // Border
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(3);
  doc.rect(10, 10, 277, 190);

  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(1.5);
  doc.rect(16, 16, 265, 178);

  // Decorative circles
  doc.setFillColor(249, 115, 22);
  doc.circle(35, 35, 14, "F");

  doc.setFillColor(30, 58, 138);
  doc.circle(262, 175, 18, "F");

  // Title
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 p-10">
      <div className="bg-white shadow-xl rounded-3xl p-8 border border-blue-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-orange-500 font-bold mb-2">Student Dashboard</p>

            <h1 className="text-4xl font-extrabold text-blue-950">
              Welcome, {user?.name}
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="bg-blue-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-800"
          >
            Logout
          </button>
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

        {message && <p className="mt-6 font-bold text-orange-600">{message}</p>}

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

              return (
                <div
                  key={event._id}
                  className="bg-blue-50 rounded-2xl p-6 border border-blue-100"
                >
                  <p className="text-orange-500 font-bold mb-2">{event.club}</p>

                  <h3 className="text-xl font-extrabold text-blue-950 mb-2">
                    {event.title}
                  </h3>

                  <p className="text-slate-600 mb-3">{event.description}</p>

                  <p className="text-sm text-slate-700">
                    📍 <span className="font-bold">{event.venue}</span>
                  </p>

                  <p className="text-sm text-slate-700">
                    📅 {new Date(event.date).toDateString()}
                  </p>

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

                          <button
                            onClick={() => downloadCertificate(event)}
                            className="bg-orange-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-orange-600"
                          >
                            Download Certificate
                          </button>
                        </div>
                      )}
                    </div>
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
  );
}

export default StudentDashboard;
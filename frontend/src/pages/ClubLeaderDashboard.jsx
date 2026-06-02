import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ClubLeaderDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [feedback, setFeedback] = useState([]);

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

      setEvents(eventRes.data);
      setRegistrations(registrationRes.data);
      setAttendance(attendanceRes.data);
      setFeedback(feedbackRes.data);
    };

    fetchData();
  }, []);

  const getRegisteredStudents = (eventId) => {
    return registrations.filter(
      (registration) => registration.eventId?._id === eventId
    );
  };

  const getPresentStudents = (eventId) => {
    return attendance.filter((item) => item.eventId?._id === eventId);
  };

  const getEventFeedback = (eventId) => {
    return feedback.filter((item) => item.eventId?._id === eventId);
  };

  const getAverageRating = (eventFeedback) => {
    if (eventFeedback.length === 0) return "0.0";

    const total = eventFeedback.reduce((sum, item) => sum + item.rating, 0);
    return (total / eventFeedback.length).toFixed(1);
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
            <p className="text-orange-500 font-bold mb-2">
              Club Leader Dashboard
            </p>

            <h1 className="text-4xl font-extrabold text-blue-950">
              {user?.leaderClub} Dashboard
            </h1>

            <p className="text-slate-600 mt-3">
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
            className="bg-blue-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-800"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 flex gap-4">
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
        </div>

        <h2 className="text-2xl font-extrabold text-blue-950 mt-10 mb-5">
          Your Club Events, Registrations, Attendance & Feedback
        </h2>

        {events.length === 0 ? (
          <p className="text-slate-600">No events created yet.</p>
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
                  className="bg-blue-50 rounded-2xl p-6 border border-blue-100"
                >
                  <div className="flex justify-between items-start gap-5">
                    <div>
                      <h3 className="text-2xl font-extrabold text-blue-950 mb-2">
                        {event.title}
                      </h3>

                      <p className="text-slate-600 mb-3">{event.description}</p>

                      <p className="text-sm text-slate-700">
                        📍 <span className="font-bold">{event.venue}</span>
                      </p>

                      <p className="text-sm text-slate-700">
                        📅 {new Date(event.date).toDateString()}
                      </p>

                      <p className="text-sm text-slate-700 mt-2">
                        ⭐ Average Rating:{" "}
                        <span className="font-bold text-orange-500">
                          {avgRating}/5
                        </span>
                      </p>
                    </div>

                    <Link
                      to={`/edit-event/${event._id}`}
                      state={{ event }}
                      className="bg-blue-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-800"
                    >
                      Edit
                    </Link>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <Section title={`Registered Students (${students.length})`} color="orange">
                      {students.length === 0 ? (
                        <p className="text-slate-600">
                          No students registered yet.
                        </p>
                      ) : (
                        students.map((student) => (
                          <Person key={student._id} name={student.studentName} email={student.studentEmail} />
                        ))
                      )}
                    </Section>

                    <Section title={`Present Students (${presentStudents.length})`} color="green">
                      {presentStudents.length === 0 ? (
                        <p className="text-slate-600">
                          No attendance marked yet.
                        </p>
                      ) : (
                        presentStudents.map((student) => (
                          <Person key={student._id} name={student.studentName} email={student.studentEmail} />
                        ))
                      )}
                    </Section>

                    <Section title={`Feedback (${eventFeedback.length})`} color="blue">
                      {eventFeedback.length === 0 ? (
                        <p className="text-slate-600">No feedback yet.</p>
                      ) : (
                        eventFeedback.map((item) => (
                          <div key={item._id} className="border-b py-3">
                            <p className="font-bold text-blue-950">
                              {item.studentName}
                            </p>
                            <p className="text-sm text-orange-500 font-bold">
                              Rating: {item.rating}/5
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
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
    <div className="bg-white rounded-2xl p-5 border border-blue-100">
      <h4 className={`text-lg font-extrabold mb-4 ${colorClass}`}>
        {title}
      </h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Person({ name, email }) {
  return (
    <div className="border-b pb-2">
      <p className="font-semibold text-blue-950">{name}</p>
      <p className="text-sm text-slate-600">{email}</p>
    </div>
  );
}

export default ClubLeaderDashboard;
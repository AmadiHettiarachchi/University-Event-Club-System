import { useEffect, useState } from "react";
import axios from "axios";

function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get("http://localhost:5000/api/events");

      const relevantEvents = res.data.filter((event) =>
        user?.clubs?.includes(event.club)
      );

      setEvents(relevantEvents);
    };

    fetchEvents();
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
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
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
          <p className="text-slate-600">No events available for your clubs yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event) => (
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

                <button
                  onClick={() => handleRegisterEvent(event)}
                  className="mt-4 bg-orange-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-orange-600"
                >
                  Register Event
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
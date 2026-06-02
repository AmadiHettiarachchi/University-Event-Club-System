import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ClubLeaderDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const eventRes = await axios.get(
        `http://localhost:5000/api/events/club/${user?.leaderClub}`
      );

      const registrationRes = await axios.get(
        `http://localhost:5000/api/event-registrations/club/${user?.leaderClub}`
      );

      setEvents(eventRes.data);
      setRegistrations(registrationRes.data);
    };

    fetchData();
  }, []);

  const getRegisteredStudents = (eventId) => {
    return registrations.filter(
      (registration) => registration.eventId?._id === eventId
    );
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

        <Link
          to="/create-event"
          className="inline-block mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600"
        >
          Create Event
        </Link>

        <h2 className="text-2xl font-extrabold text-blue-950 mt-10 mb-5">
          Your Club Events & Registered Students
        </h2>

        {events.length === 0 ? (
          <p className="text-slate-600">No events created yet.</p>
        ) : (
          <div className="space-y-6">
            {events.map((event) => {
              const students = getRegisteredStudents(event._id);

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
                    </div>

                    <Link
                      to={`/edit-event/${event._id}`}
                      state={{ event }}
                      className="bg-blue-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-800"
                    >
                      Edit
                    </Link>
                  </div>

                  <div className="mt-6 bg-white rounded-2xl p-5 border border-blue-100">
                    <h4 className="text-lg font-extrabold text-orange-500 mb-4">
                      Registered Students ({students.length})
                    </h4>

                    {students.length === 0 ? (
                      <p className="text-slate-600">
                        No students registered for this event yet.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-blue-950 border-b">
                              <th className="py-2">Student Name</th>
                              <th className="py-2">Email</th>
                              <th className="py-2">Registered Date</th>
                            </tr>
                          </thead>

                          <tbody>
                            {students.map((student) => (
                              <tr
                                key={student._id}
                                className="border-b text-slate-700"
                              >
                                <td className="py-3 font-semibold">
                                  {student.studentName}
                                </td>
                                <td className="py-3">
                                  {student.studentEmail}
                                </td>
                                <td className="py-3">
                                  {new Date(student.createdAt).toDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
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

export default ClubLeaderDashboard;
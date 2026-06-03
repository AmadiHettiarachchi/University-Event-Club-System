import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Pencil, ArrowLeft } from "lucide-react";

function EditEvent() {
  const navigate = useNavigate();
  const location = useLocation();
  const event = location.state?.event;

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    venue: event?.venue || "",
    date: event?.date ? event.date.split("T")[0] : "",
    club: event?.club || "",
    createdBy: event?.createdBy || "",
  });

  const [message, setMessage] = useState("");

  if (!event) {
    return <p className="p-10">No event selected.</p>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.date < today) {
      setMessage("You cannot select a previous date");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/events/${event._id}`,
        formData
      );

      setMessage("Event updated successfully!");

      setTimeout(() => {
        navigate("/event-post", { state: { event: res.data.event } });
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Event update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-6 py-10">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-2xl p-8 border border-blue-100">
        <Link
          to="/club-leader-dashboard"
          className="inline-flex items-center gap-2 text-blue-900 font-bold mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="flex justify-center mb-4">
          <div className="bg-orange-100 text-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center">
            <Pencil size={34} />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-blue-950 text-center mb-2">
          Edit Event
        </h1>

        <p className="text-center text-slate-600 mb-6">
          Updating event for{" "}
          <span className="font-bold text-orange-500">{formData.club}</span>
        </p>

        {message && (
          <p className="text-center mb-4 font-semibold text-orange-600">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-blue-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border border-blue-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          ></textarea>

          <input
            type="text"
            name="venue"
            placeholder="Venue"
            value={formData.venue}
            onChange={handleChange}
            required
            className="w-full border border-blue-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="date"
            name="date"
            min={today}
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border border-blue-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="text"
            value={formData.club}
            disabled
            className="w-full border border-blue-100 px-4 py-3 rounded-xl bg-blue-50 text-blue-950 font-bold"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 shadow-lg"
          >
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditEvent;
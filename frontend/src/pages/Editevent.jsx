import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Pencil, ArrowLeft } from "lucide-react";
import campusBg from "../assets/campus-bg.jpg";

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
    capacity: event?.capacity || "",
    club: event?.club || "",
    createdBy: event?.createdBy || "",
  });

  const [message, setMessage] = useState("");

  if (!event) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-6 py-10 overflow-hidden">
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${campusBg})` }}
        ></div>

        <div className="fixed inset-0 bg-blue-950/20"></div>

        <div className="relative z-10 bg-white/40 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/50">
          <p className="text-blue-950 font-bold">No event selected.</p>
        </div>
      </div>
    );
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

    if (Number(formData.capacity) < 1) {
      setMessage("Capacity must be at least 1");
      return;
    }

    try {
      const eventData = {
        ...formData,
        capacity: Number(formData.capacity),
      };

      const res = await axios.put(
        `http://localhost:5000/api/events/${event._id}`,
        eventData
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
    <div className="min-h-screen relative flex items-center justify-center px-6 py-10 overflow-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${campusBg})` }}
      ></div>

      <div className="fixed inset-0 bg-blue-950/20"></div>

      <div className="relative z-10 bg-white/40 backdrop-blur-sm shadow-2xl rounded-3xl w-full max-w-2xl p-8 border border-white/50">
        <Link
          to="/club-leader-dashboard"
          className="inline-flex items-center gap-2 text-blue-950 font-bold mb-6 hover:text-orange-500"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="flex justify-center mb-4">
          <div className="bg-orange-100/80 text-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center border border-orange-200">
            <Pencil size={34} />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-blue-950 text-center mb-2">
          Edit Event
        </h1>

        <p className="text-center text-blue-900 mb-6">
          Updating event for{" "}
          <span className="font-bold text-orange-500">
            {formData.club || "No club selected"}
          </span>
        </p>

        {message && (
          <p className="text-center mb-4 font-semibold text-orange-700 bg-orange-100/75 p-3 rounded-xl border border-orange-300">
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
            className="w-full bg-white/70 border border-white/70 px-4 py-3 rounded-xl text-blue-950 placeholder:text-blue-800/60 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full bg-white/70 border border-white/70 px-4 py-3 rounded-xl text-blue-950 placeholder:text-blue-800/60 focus:outline-none focus:ring-2 focus:ring-orange-400"
          ></textarea>

          <input
            type="text"
            name="venue"
            placeholder="Venue"
            value={formData.venue}
            onChange={handleChange}
            required
            className="w-full bg-white/70 border border-white/70 px-4 py-3 rounded-xl text-blue-950 placeholder:text-blue-800/60 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="date"
            name="date"
            min={today}
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full bg-white/70 border border-white/70 px-4 py-3 rounded-xl text-blue-950 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="number"
            name="capacity"
            min="1"
            placeholder="Maximum Participants / Capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            className="w-full bg-white/70 border border-white/70 px-4 py-3 rounded-xl text-blue-950 placeholder:text-blue-800/60 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="text"
            value={formData.club}
            disabled
            className="w-full bg-sky-100/70 border border-white/70 px-4 py-3 rounded-xl text-blue-950 font-bold"
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
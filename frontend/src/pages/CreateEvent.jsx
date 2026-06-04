import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CalendarPlus, ArrowLeft } from "lucide-react";
import campusBg from "../assets/campus-bg.jpg";

function CreateEvent() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    club: user?.leaderClub || "",
    createdBy: user?.name || "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.club) {
      setMessage("Club name is missing. Please login again as a club leader.");
      return;
    }

    if (formData.date < today) {
      setMessage("You cannot select a previous date");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/events", formData);

      setMessage("Event created successfully!");

      setTimeout(() => {
        navigate("/event-post", { state: { event: res.data.event } });
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Event creation failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center px-6 py-10 relative"
      style={{ backgroundImage: `url(${campusBg})` }}
    >
      <div className="absolute inset-0 bg-sky-100/35"></div>

      <div className="relative z-10 bg-sky-50/70 backdrop-blur-sm shadow-2xl rounded-3xl w-full max-w-2xl p-8 border border-white/60">
        <Link
          to="/club-leader-dashboard"
          className="inline-flex items-center gap-2 text-blue-950 font-bold mb-6 hover:text-orange-500"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="flex justify-center mb-4">
          <div className="bg-orange-100/90 text-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center border border-orange-200">
            <CalendarPlus size={34} />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-blue-950 text-center mb-2">
          Create New Event
        </h1>

        <p className="text-center text-blue-900 mb-6">
          Creating event for{" "}
          <span className="font-bold text-orange-500">
            {formData.club || "No club selected"}
          </span>
        </p>

        {message && (
          <p className="text-center mb-4 font-semibold text-orange-700 bg-orange-100/80 p-3 rounded-xl border border-orange-300">
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
            className="w-full bg-white/70 backdrop-blur-sm border border-white/70 px-4 py-3 rounded-xl text-blue-950 placeholder:text-blue-800/60 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full bg-white/70 backdrop-blur-sm border border-white/70 px-4 py-3 rounded-xl text-blue-950 placeholder:text-blue-800/60 focus:outline-none focus:ring-2 focus:ring-orange-400"
          ></textarea>

          <input
            type="text"
            name="venue"
            placeholder="Venue"
            value={formData.venue}
            onChange={handleChange}
            required
            className="w-full bg-white/70 backdrop-blur-sm border border-white/70 px-4 py-3 rounded-xl text-blue-950 placeholder:text-blue-800/60 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="date"
            name="date"
            min={today}
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full bg-white/70 backdrop-blur-sm border border-white/70 px-4 py-3 rounded-xl text-blue-950 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="text"
            value={formData.club || "Club name missing"}
            disabled
            className="w-full bg-sky-100/80 border border-white/70 px-4 py-3 rounded-xl text-blue-950 font-bold"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 shadow-lg"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
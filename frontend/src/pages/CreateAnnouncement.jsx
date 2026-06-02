import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Megaphone } from "lucide-react";

function CreateAnnouncement() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    club: user?.leaderClub || "",
    createdBy: user?.name || "",
  });

  const [info, setInfo] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.club) {
      setInfo("Club name is missing. Please login again.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/announcements", formData);
      setInfo("Announcement created successfully!");

      setTimeout(() => {
        navigate("/club-leader-dashboard");
      }, 1000);
    } catch (error) {
      setInfo(error.response?.data?.message || "Announcement creation failed");
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
            <Megaphone size={34} />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-blue-950 text-center mb-2">
          Create Announcement
        </h1>

        <p className="text-center text-slate-600 mb-6">
          Announcement for{" "}
          <span className="font-bold text-orange-500">{formData.club}</span>
        </p>

        {info && (
          <p className="text-center mb-4 font-semibold text-orange-600">
            {info}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Announcement Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-blue-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <textarea
            name="message"
            placeholder="Announcement Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="6"
            className="w-full border border-blue-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          ></textarea>

          <input
            type="text"
            value={formData.club || "Club name missing"}
            disabled
            className="w-full border border-blue-100 px-4 py-3 rounded-xl bg-blue-50 text-blue-950 font-bold"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 shadow-lg"
          >
            Publish Announcement
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAnnouncement;
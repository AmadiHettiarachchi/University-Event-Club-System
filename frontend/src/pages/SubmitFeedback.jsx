import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, MessageSquare } from "lucide-react";
import campusBg from "../assets/campus-bg.jpg";

function SubmitFeedback() {
  const navigate = useNavigate();
  const location = useLocation();
  const event = location.state?.event;
  const user = JSON.parse(localStorage.getItem("user"));

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  if (!event) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center px-6 py-10 relative"
        style={{ backgroundImage: `url(${campusBg})` }}
      >
        <div className="absolute inset-0 bg-sky-100/35"></div>

        <div className="relative z-10 bg-sky-50/70 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/60">
          <p className="text-blue-950 font-bold">No event selected.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const feedbackData = {
        eventId: event._id,
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email,
        club: event.club,
        rating,
        comment,
      };

      const res = await axios.post(
        "http://localhost:5000/api/feedback",
        feedbackData
      );

      setMessage(res.data.message);
      setTimeout(() => navigate("/student-dashboard"), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Feedback failed");
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
          to="/student-dashboard"
          className="inline-flex items-center gap-2 text-blue-950 font-bold mb-6 hover:text-orange-500"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="flex justify-center mb-4">
          <div className="bg-orange-100/90 text-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center border border-orange-200">
            <MessageSquare size={34} />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-blue-950 text-center mb-2">
          Submit Feedback
        </h1>

        <p className="text-center text-blue-900 mb-6">
          Feedback for{" "}
          <span className="font-bold text-orange-500">{event.title}</span>
        </p>

        {message && (
          <p className="text-center mb-4 font-semibold text-orange-700 bg-orange-100/80 p-3 rounded-xl border border-orange-300">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full bg-white/70 backdrop-blur-sm border border-white/70 px-4 py-3 rounded-xl text-blue-950 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Very Good</option>
            <option value={3}>3 - Good</option>
            <option value={2}>2 - Fair</option>
            <option value={1}>1 - Poor</option>
          </select>

          <textarea
            rows="5"
            placeholder="Write your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="w-full bg-white/70 backdrop-blur-sm border border-white/70 px-4 py-3 rounded-xl text-blue-950 placeholder:text-blue-800/60 focus:outline-none focus:ring-2 focus:ring-orange-400"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 shadow-lg"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitFeedback;
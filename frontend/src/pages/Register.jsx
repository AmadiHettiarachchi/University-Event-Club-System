import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, GraduationCap, ShieldCheck } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const allClubs = [
    "IT Club",
    "IEEE Club",
    "Rotaract Club",
    "Media Club",
    "Sports Club",
    "Art Circle",
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    clubs: [],
    leaderClub: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role") {
      setFormData({
        ...formData,
        role: value,
        clubs: [],
        leaderClub: "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleClubCheckbox = (club) => {
    if (formData.clubs.includes(club)) {
      setFormData({
        ...formData,
        clubs: formData.clubs.filter((item) => item !== club),
      });
    } else {
      setFormData({
        ...formData,
        clubs: [...formData.clubs, club],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.role === "student" && formData.clubs.length === 0) {
      setMessage("Please select at least one club");
      return;
    }

    if (formData.role === "clubLeader" && !formData.leaderClub) {
      setMessage("Please select your club");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/register", formData);
      setMessage("Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-6 py-10 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-300 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-blue-300 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-orange-400 rounded-full opacity-20 blur-2xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-blue-400 rounded-full opacity-20 blur-2xl"></div>

      <div className="relative z-10 grid lg:grid-cols-2 bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-5xl border border-blue-100">
        <div className="hidden lg:flex flex-col justify-center bg-blue-950 text-white p-12 relative overflow-hidden">
          <div className="absolute top-10 right-10 w-32 h-32 bg-orange-500 rounded-full opacity-20"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-500 rounded-full opacity-30"></div>

          <h1 className="text-4xl font-extrabold mb-5">
            Join Uni<span className="text-orange-400">Clubs</span>
          </h1>

          <p className="text-blue-100 leading-8 mb-8">
            Students can join several clubs at once, while club leaders can
            manage only their assigned club dashboard.
          </p>

          <div className="space-y-5">
            <Info icon={<GraduationCap />} text="Students can select multiple clubs" />
            <Info icon={<Users />} text="Club leaders manage one selected club" />
            <Info icon={<ShieldCheck />} text="Admin is created separately" />
          </div>
        </div>

        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-extrabold text-blue-950 text-center mb-2">
            Create Account
          </h2>

          <p className="text-center text-slate-600 mb-6">
            Select your role and club details
          </p>

          {message && (
            <p className="text-center mb-4 font-semibold text-orange-600">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="w-full border border-blue-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="w-full border border-blue-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full border border-blue-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-blue-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="student">Student</option>
              <option value="clubLeader">Club Leader</option>
            </select>

            {formData.role === "student" && (
              <div>
                <p className="font-bold text-blue-950 mb-3">Select Clubs</p>

                <div className="grid grid-cols-2 gap-3">
                  {allClubs.map((club) => (
                    <label
                      key={club}
                      className={`border rounded-xl px-4 py-3 cursor-pointer text-sm font-semibold ${
                        formData.clubs.includes(club)
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-blue-950 border-blue-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.clubs.includes(club)}
                        onChange={() => handleClubCheckbox(club)}
                        className="hidden"
                      />
                      {club}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {formData.role === "clubLeader" && (
              <select
                name="leaderClub"
                value={formData.leaderClub}
                onChange={handleChange}
                required
                className="w-full border border-blue-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Select Your Club</option>
                {allClubs.map((club) => (
                  <option key={club} value={club}>
                    {club}
                  </option>
                ))}
              </select>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 shadow-lg"
            >
              Register
            </button>
          </form>

          <p className="text-center mt-6 text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-800 font-bold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Info({ icon, text }) {
  return (
    <div className="flex items-center gap-4 relative z-10">
      <div className="bg-orange-500 text-white w-11 h-11 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <p className="text-blue-100 font-medium">{text}</p>
    </div>
  );
}

export default Register;
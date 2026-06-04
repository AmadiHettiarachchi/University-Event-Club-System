import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LogIn, ShieldCheck, Users, CalendarDays } from "lucide-react";
import PageBackground from "../components/PageBackground";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "student") {
        navigate("/student-dashboard");
      } else if (res.data.user.role === "clubLeader") {
        navigate("/club-leader-dashboard");
      } else if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <PageBackground>
      <div className="min-h-screen flex items-center justify-center px-6 py-10">
        <div className="grid lg:grid-cols-2 bg-white/95 shadow-2xl rounded-3xl overflow-hidden w-full max-w-5xl border border-white/40">
          <div className="hidden lg:flex flex-col justify-center bg-blue-950/95 text-white p-12">
            <h1 className="text-4xl font-extrabold mb-5">
              Welcome Back to Uni
              <span className="text-orange-400">Clubs</span>
            </h1>

            <p className="text-blue-100 leading-8 mb-8">
              Sign in to access your dashboard and continue managing club
              activities, event registrations, attendance, announcements, and
              feedback.
            </p>

            <div className="space-y-5">
              <Info icon={<CalendarDays />} text="View and manage events" />
              <Info icon={<Users />} text="Access your correct role dashboard" />
              <Info icon={<ShieldCheck />} text="Secure role-based access" />
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 text-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center">
                <LogIn size={34} />
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-blue-950 text-center mb-2">
              Login
            </h2>

            <p className="text-center text-slate-600 mb-6">
              Enter your email and password to continue.
            </p>

            {message && (
              <p className="text-center mb-4 font-semibold text-orange-600">
                {message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 shadow-lg"
              >
                Login
              </button>
            </form>

            <p className="text-center mt-6 text-slate-600">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-800 font-bold">
                Register
              </Link>
            </p>

            <p className="text-center mt-4">
              <Link to="/" className="text-sm text-slate-500 hover:text-blue-900">
                Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageBackground>
  );
}

function Info({ icon, text }) {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-orange-500 text-white w-11 h-11 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <p className="text-blue-100 font-medium">{text}</p>
    </div>
  );
}

export default Login;
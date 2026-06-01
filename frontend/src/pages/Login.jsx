import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LogIn, ShieldCheck, Users, CalendarDays } from "lucide-react";

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
      const res = await axios.post("http://localhost:5000/api/users/login", formData);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-orange-300 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-blue-300 rounded-full opacity-30 blur-3xl"></div>

      <div className="relative z-10 grid lg:grid-cols-2 bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-5xl border border-blue-100">
        <div className="hidden lg:flex flex-col justify-center bg-blue-950 text-white p-12 relative overflow-hidden">
          <h1 className="text-4xl font-extrabold mb-5">
            Welcome Back to Uni<span className="text-orange-400">Clubs</span>
          </h1>

          <p className="text-blue-100 leading-8 mb-8">
            Login to manage events, clubs, attendance, feedback, certificates and announcements.
          </p>

          <div className="space-y-5">
            <Info icon={<CalendarDays />} text="Manage university events" />
            <Info icon={<Users />} text="Access your club dashboard" />
            <Info icon={<ShieldCheck />} text="Secure role-based login" />
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 text-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center">
              <LogIn size={34} />
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-blue-950 text-center mb-2">
            Login Account
          </h2>

          <p className="text-center text-slate-600 mb-6">
            Enter your email and password
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
        </div>
      </div>
    </div>
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
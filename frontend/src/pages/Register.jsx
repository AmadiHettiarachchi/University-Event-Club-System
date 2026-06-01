import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/users/register", formData);
      setMessage("Registration successful!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-6">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8 border border-blue-100">
        <h1 className="text-3xl font-extrabold text-blue-950 text-center mb-2">
          Create Account
        </h1>

        <p className="text-center text-slate-600 mb-6">
          Join UniClubs and manage events easily
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
            onChange={handleChange}
            className="w-full border border-blue-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="student">Student</option>
            <option value="clubLeader">Club Leader</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600"
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
  );
}

export default Register;
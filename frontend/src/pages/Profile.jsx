import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowLeft, UserCircle } from "lucide-react";
import PageBackground from "../components/PageBackground";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");

  const dashboardPath =
    storedUser?.role === "student"
      ? "/student-dashboard"
      : storedUser?.role === "clubLeader"
      ? "/club-leader-dashboard"
      : "/admin-dashboard";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/profile/${storedUser.id}`
        );

        setUserData(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email,
          password: "",
        });
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/profile/${storedUser.id}`,
        formData
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUserData(res.data.user);
      setFormData({ ...formData, password: "" });
      setMessage("Profile updated successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Profile update failed");
    }
  };

  return (
    <PageBackground>
      <div className="min-h-screen flex items-center justify-center px-6 py-10">
        <div className="bg-white/95 shadow-2xl rounded-3xl w-full max-w-2xl p-8 border border-white/40">
          <Link
            to={dashboardPath}
            className="inline-flex items-center gap-2 text-blue-900 font-bold mb-6"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>

          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 text-orange-500 w-20 h-20 rounded-full flex items-center justify-center">
              <UserCircle size={48} />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-blue-950 text-center mb-2">
            My Profile
          </h1>

          <p className="text-center text-slate-600 mb-6">
            View and update your account details.
          </p>

          {message && (
            <p className="text-center mb-4 font-semibold text-orange-600">
              {message}
            </p>
          )}

          {userData && (
            <div className="bg-blue-50 rounded-2xl p-5 mb-6 border border-blue-100">
              <p className="text-slate-700">
                <span className="font-bold text-blue-950">Role:</span>{" "}
                {userData.role}
              </p>

              {userData.role === "student" && (
                <p className="text-slate-700 mt-2">
                  <span className="font-bold text-blue-950">Joined Clubs:</span>{" "}
                  {userData.clubs?.join(", ")}
                </p>
              )}

              {userData.role === "clubLeader" && (
                <p className="text-slate-700 mt-2">
                  <span className="font-bold text-blue-950">Managing Club:</span>{" "}
                  {userData.leaderClub}
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-blue-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-blue-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="password"
              name="password"
              placeholder="New Password (leave empty if no change)"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-blue-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 shadow-lg"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </PageBackground>
  );
}

export default Profile;
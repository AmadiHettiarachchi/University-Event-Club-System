import { Link } from "react-router-dom";
import {
  CalendarDays,
  Users,
  QrCode,
  Award,
  MessageSquare,
  UserPlus,
} from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 text-slate-900 overflow-hidden">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-10 py-5 flex items-center justify-between">
        <div className="text-3xl font-extrabold text-blue-950">
          Uni<span className="text-orange-500">Clubs</span>
        </div>

        <div className="hidden md:flex gap-10 font-semibold text-blue-950">
          <a className="text-orange-500 border-b-2 border-orange-500 pb-1">Home</a>
          <a>About</a>
          <a>Features</a>
          <a>Clubs</a>
          <a>Events</a>
          <a>Contact</a>
        </div>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="border border-blue-700 text-blue-900 px-6 py-2 rounded-xl font-semibold hover:bg-blue-50"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-orange-500 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:bg-orange-600"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-10 lg:px-24 py-16 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-bold mb-6">
            🚀 Smart University Event Platform
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-blue-950 mb-6">
            Manage University <br />
            <span className="text-orange-500">Events & Clubs</span> <br />
            Easily
          </h1>

          <div className="w-24 h-1 bg-orange-500 rounded-full mb-6"></div>

          <p className="text-lg text-slate-600 max-w-xl leading-8 mb-8">
            A modern system for event registration, club member management,
            QR attendance, feedback, certificates, and announcements.
          </p>

          <div className="flex gap-5">
            <Link
              to="/register"
              className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-orange-600"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="border border-blue-700 text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Right Illustration Card */}
        <div className="relative">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-blue-100">
            <div className="grid grid-cols-2 gap-6">
              <Feature icon={<CalendarDays size={34} />} title="Events" color="blue" />
              <Feature icon={<Users size={34} />} title="Clubs" color="orange" />
              <Feature icon={<QrCode size={34} />} title="QR Attendance" color="orange" />
              <Feature icon={<Award size={34} />} title="Certificates" color="blue" />
              <Feature icon={<MessageSquare size={34} />} title="Feedback" color="blue" />
              <Feature icon={<UserPlus size={34} />} title="Members" color="orange" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-10 lg:px-24 pb-16 grid md:grid-cols-5 gap-6">
        <Card title="Event Management" text="Create, view and manage university events easily." />
        <Card title="Club Management" text="Manage clubs, leaders and members in one place." />
        <Card title="QR Attendance" text="Mark attendance using QR code scanning." />
        <Card title="Feedback System" text="Collect feedback and improve events." />
        <Card title="Digital Certificates" text="Generate certificates automatically." />
      </section>
    </div>
  );
}

function Feature({ icon, title, color }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 text-center hover:scale-105 transition">
      <div
        className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center ${
          color === "orange"
            ? "bg-orange-100 text-orange-500"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {icon}
      </div>
      <h3 className="font-bold text-blue-950">{title}</h3>
    </div>
  );
}

function Card({ title, text }) {
  return (
    <div className="bg-white rounded-3xl p-6 text-center shadow-xl border border-blue-50 hover:-translate-y-2 transition">
      <h3 className="text-blue-950 font-extrabold text-lg mb-3">{title}</h3>
      <p className="text-slate-600 text-sm leading-6">{text}</p>
      <div className="w-12 h-1 bg-orange-500 rounded-full mx-auto mt-5"></div>
    </div>
  );
}

export default Home;
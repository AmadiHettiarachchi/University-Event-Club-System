import { Link } from "react-router-dom";
import campusBg from "../assets/campus-bg.jpg";

function Home() {
  return (
    <div className="min-h-screen text-white">
      <div
        className="min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: `url(${campusBg})` }}
      >
        <div className="absolute inset-0 bg-blue-950/70"></div>

        <nav className="relative z-10 px-8 md:px-16 py-6 flex items-center justify-between">
          <div className="text-3xl font-extrabold">
            Uni<span className="text-orange-400">Clubs</span>
          </div>

          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg border border-white/60 font-semibold hover:bg-white hover:text-blue-950"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2 rounded-lg bg-orange-500 font-semibold hover:bg-orange-600"
            >
              Register
            </Link>
          </div>
        </nav>

        <section className="relative z-10 px-8 md:px-16 pt-28 max-w-3xl">
          <p className="text-orange-300 font-semibold mb-4">
            University Event & Club Management System
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Find events, join clubs, and stay connected on campus.
          </h1>

          <p className="text-lg text-blue-100 leading-8 mb-8 max-w-2xl">
            UniClubs helps students discover club events, register easily,
            mark attendance with QR codes, receive announcements, and download
            participation certificates after attending events.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/register"
              className="bg-orange-500 px-7 py-3 rounded-xl font-bold hover:bg-orange-600"
            >
              Join a Club
            </Link>

            <Link
              to="/login"
              className="border border-white/60 px-7 py-3 rounded-xl font-bold hover:bg-white hover:text-blue-950"
            >
              Sign In
            </Link>
          </div>
        </section>

        <section className="relative z-10 px-8 md:px-16 mt-20 pb-12 grid md:grid-cols-3 gap-5 max-w-5xl">
          <InfoCard
            title="For Students"
            text="View events from your clubs, register, scan QR attendance, and access certificates."
          />

          <InfoCard
            title="For Club Leaders"
            text="Create events, post announcements, check registrations, and download attendance reports."
          />

          <InfoCard
            title="For Admin"
            text="Monitor users, events, analytics, and overall system activity from one dashboard."
          />
        </section>
      </div>
    </div>
  );
}

function InfoCard({ title, text }) {
  return (
    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-orange-300 mb-3">{title}</h3>
      <p className="text-blue-100 leading-7 text-sm">{text}</p>
    </div>
  );
}

export default Home;
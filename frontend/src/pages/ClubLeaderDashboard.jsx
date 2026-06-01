function ClubLeaderDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 p-10">
      <div className="bg-white shadow-xl rounded-3xl p-8 border border-blue-100">
        <p className="text-orange-500 font-bold mb-2">Club Leader Dashboard</p>

        <h1 className="text-4xl font-extrabold text-blue-950">
          {user?.leaderClub} Dashboard
        </h1>

        <p className="text-slate-600 mt-3">
          Welcome, <span className="font-bold">{user?.name}</span>. You are
          managing{" "}
          <span className="font-bold text-orange-500">
            {user?.leaderClub}
          </span>
          .
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card title="Create Events" text="Add and manage events for your club." />
          <Card title="Club Members" text="View students registered under your club." />
          <Card title="QR Attendance" text="Track event attendance using QR codes." />
        </div>
      </div>
    </div>
  );
}

function Card({ title, text }) {
  return (
    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 hover:-translate-y-1 transition">
      <h3 className="text-blue-950 font-extrabold text-xl mb-2">{title}</h3>
      <p className="text-slate-600">{text}</p>
    </div>
  );
}

export default ClubLeaderDashboard;
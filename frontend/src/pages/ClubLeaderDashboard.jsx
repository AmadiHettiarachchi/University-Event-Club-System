function ClubLeaderDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 p-10">
      <div className="bg-white shadow-xl rounded-3xl p-8 border border-blue-100">
        <p className="text-orange-500 font-bold mb-2">Club Leader Dashboard</p>

        <h1 className="text-4xl font-extrabold text-blue-950">
          {user?.leaderClub || "Your Club"} Dashboard
        </h1>

        <p className="text-slate-600 mt-3">
          Welcome, <span className="font-bold">{user?.name}</span>. You are managing{" "}
          <span className="font-bold text-orange-500">
            {user?.leaderClub}
          </span>.
        </p>
      </div>
    </div>
  );
}

export default ClubLeaderDashboard;
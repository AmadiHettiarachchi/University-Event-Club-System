function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 p-10">
      <div className="bg-white shadow-xl rounded-3xl p-8 border border-blue-100">
        <p className="text-orange-500 font-bold mb-2">Student Dashboard</p>

        <h1 className="text-4xl font-extrabold text-blue-950">
          Welcome, {user?.name}
        </h1>

        <p className="text-slate-600 mt-3">
          You have joined the following clubs:
        </p>

        <div className="flex flex-wrap gap-3 mt-5">
          {user?.clubs?.map((club) => (
            <span
              key={club}
              className="bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-bold"
            >
              {club}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 text-center border border-blue-100 max-w-lg">
        <h1 className="text-6xl font-extrabold text-orange-500 mb-4">404</h1>

        <h2 className="text-3xl font-extrabold text-blue-950 mb-3">
          Page Not Found
        </h2>

        <p className="text-slate-600 mb-6">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
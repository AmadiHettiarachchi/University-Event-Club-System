import { useLocation, Link } from "react-router-dom";
import { Copy, Share2, ArrowLeft } from "lucide-react";
import AutoEventPoster from "../components/AutoEventPoster";

function EventPost() {
  const location = useLocation();
  const event = location.state?.event;

  if (!event) {
    return <p className="p-10">No event post found.</p>;
  }

  const eventDate = new Date(event.date).toDateString();

  const postText = `🎉 Join us for ${event.title}!

Organized by: ${event.club}
📍 Venue: ${event.venue}
📅 Date: ${eventDate}

${event.description}

Register now through UniClubs!`;

  const copyPost = () => {
    navigator.clipboard.writeText(postText);
    alert("Post copied successfully!");
  };

  const sharePost = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(postText)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-8 border border-blue-100">
        <Link
          to="/club-leader-dashboard"
          className="inline-flex items-center gap-2 text-blue-900 font-bold mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-extrabold text-blue-950 mb-2">
          Auto-Generated Event Poster
        </h1>

        <p className="text-slate-600 mb-6">
          This poster is automatically generated from event details.
        </p>

        <AutoEventPoster event={event} />

        <textarea
          value={postText}
          readOnly
          rows="8"
          className="w-full border border-blue-100 rounded-2xl p-4 text-slate-700 my-5"
        ></textarea>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={copyPost}
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600"
          >
            <Copy size={20} />
            Copy Post
          </button>

          <button
            onClick={sharePost}
            className="flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800"
          >
            <Share2 size={20} />
            Share WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventPost;
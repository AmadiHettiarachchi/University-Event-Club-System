import { useLocation, Link } from "react-router-dom";
import { Copy, Share2, ArrowLeft } from "lucide-react";

function EventPost() {
  const location = useLocation();
  const event = location.state?.event;

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No event post found.</p>
      </div>
    );
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
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(postText)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 p-10">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl p-8 border border-blue-100">
        <Link
          to="/club-leader-dashboard"
          className="inline-flex items-center gap-2 text-blue-900 font-bold mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-extrabold text-blue-950 mb-2">
          Auto-Generated Event Post
        </h1>

        <p className="text-slate-600 mb-6">
          Copy or share this event announcement with students.
        </p>

        <div className="bg-blue-950 text-white rounded-3xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500 rounded-full opacity-30"></div>

          <p className="text-orange-400 font-bold mb-3">UniClubs Announcement</p>

          <h2 className="text-4xl font-extrabold mb-4">{event.title}</h2>

          <p className="text-blue-100 mb-4">{event.description}</p>

          <div className="space-y-2 text-lg">
            <p>🏛 Organized by: {event.club}</p>
            <p>📍 Venue: {event.venue}</p>
            <p>📅 Date: {eventDate}</p>
          </div>

          <div className="mt-6 bg-orange-500 inline-block px-5 py-2 rounded-full font-bold">
            Register through UniClubs
          </div>
        </div>

        <textarea
          value={postText}
          readOnly
          rows="8"
          className="w-full border border-blue-100 rounded-2xl p-4 text-slate-700 mb-5"
        ></textarea>

        <div className="flex gap-4">
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
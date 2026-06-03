function AutoEventPoster({ event }) {
  const eventDate = new Date(event.date).toDateString();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-blue-950 text-white p-6 mb-5 shadow-lg">
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-orange-500 rounded-full opacity-30"></div>

      <div className="relative z-10">
        <p className="text-orange-400 font-extrabold text-sm uppercase">
          UniClubs Event
        </p>

        <h2 className="text-2xl font-extrabold mt-2">{event.title}</h2>

        <p className="mt-3 text-blue-100 text-sm line-clamp-3">
          {event.description}
        </p>

        <div className="mt-4 bg-orange-500 inline-block px-4 py-2 rounded-xl font-bold text-sm">
          {event.club}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white text-blue-950 rounded-xl p-3">
            <p className="text-orange-500 font-bold">Date</p>
            <p className="font-bold">{eventDate}</p>
          </div>

          <div className="bg-white text-blue-950 rounded-xl p-3">
            <p className="text-orange-500 font-bold">Venue</p>
            <p className="font-bold">{event.venue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AutoEventPoster;
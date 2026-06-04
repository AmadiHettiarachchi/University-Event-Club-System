function EventStatusBadge({ date }) {
  const today = new Date();
  const eventDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  let status = "";
  let style = "";

  if (eventDate > today) {
    status = "🟢 Upcoming";
    style = "bg-green-100 text-green-700";
  } else if (eventDate.getTime() === today.getTime()) {
    status = "🟡 Today";
    style = "bg-yellow-100 text-yellow-700";
  } else {
    status = "🔴 Completed";
    style = "bg-red-100 text-red-700";
  }

  return (
    <span className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${style}`}>
      {status}
    </span>
  );
}

export default EventStatusBadge;
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ArrowLeft, CheckCircle } from "lucide-react";
import campusBg from "../assets/campus-bg.jpg";

function MarkAttendance() {
  const scannerRef = useRef(null);
  const [message, setMessage] = useState("");
  const [attendanceDetails, setAttendanceDetails] = useState(null);
  const [scannerStopped, setScannerStopped] = useState(false);

  const markAttendance = async (decodedText) => {
    try {
      let data;

      try {
        data = JSON.parse(decodedText);
      } catch {
        data = { qrToken: decodedText };
      }

      if (!data.qrToken) {
        setMessage("Invalid QR: QR token missing");
        return;
      }

      const res = await axios.post("http://localhost:5000/api/attendance", {
        qrToken: data.qrToken,
      });

      setAttendanceDetails(res.data.attendance);
      setMessage(res.data.message);
      setScannerStopped(true);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Invalid QR code or attendance failed"
      );
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 280, height: 280 },
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        await scanner.clear();
        await markAttendance(decodedText);
      },
      () => {}
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  const restartScanner = () => {
    window.location.reload();
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed p-10 relative"
      style={{ backgroundImage: `url(${campusBg})` }}
    >
      <div className="absolute inset-0 bg-sky-100/35"></div>

      <div className="relative z-10 max-w-3xl mx-auto bg-sky-50/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/60">
        <Link
          to="/club-leader-dashboard"
          className="inline-flex items-center gap-2 text-blue-950 font-bold mb-6 hover:text-orange-500"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-extrabold text-blue-950 mb-2">
          QR Attendance Scanner
        </h1>

        <p className="text-blue-900 mb-6">
          Scan a registered student's QR code. Each QR can be used only one time.
        </p>

        {message && (
          <div className="mb-5 bg-orange-100/80 text-orange-700 p-3 rounded-xl font-bold border border-orange-300">
            {message}
          </div>
        )}

        {!scannerStopped && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/70 shadow-sm">
            <div
              id="reader"
              className="overflow-hidden rounded-xl text-blue-950"
            ></div>
          </div>
        )}

        {attendanceDetails && (
          <div className="mt-6 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-green-600" size={28} />

              <h2 className="text-2xl font-extrabold text-green-700">
                Attendance Marked
              </h2>
            </div>

            <div className="space-y-2 text-blue-900">
              <p>
                <span className="font-bold">Student Name:</span>{" "}
                {attendanceDetails.studentName}
              </p>

              <p>
                <span className="font-bold">Student Email:</span>{" "}
                {attendanceDetails.studentEmail}
              </p>

              <p>
                <span className="font-bold">Club:</span>{" "}
                {attendanceDetails.club}
              </p>

              <p>
                <span className="font-bold">Status:</span>{" "}
                {attendanceDetails.status}
              </p>

              <p>
                <span className="font-bold">Marked At:</span>{" "}
                {new Date(attendanceDetails.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={restartScanner}
                className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600"
              >
                Scan Another QR
              </button>

              <Link
                to="/club-leader-dashboard"
                className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarkAttendance;
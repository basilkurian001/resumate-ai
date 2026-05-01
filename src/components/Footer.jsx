import { useState } from "react";
import ReportModal from "./ReportModal";

export default function Footer() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <footer className="bg-white border-t py-8 text-center text-sm text-gray-500">
        © 2026 ResuMate AI •{" "}
        <button
          onClick={() => setShowModal(true)}
          className="text-indigo-600 hover:underline font-medium"
        >
          Report an issue
        </button>
      </footer>

      {showModal && (
        <ReportModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
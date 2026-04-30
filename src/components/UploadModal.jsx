import { useState, useRef } from "react";
import { FileUp } from "lucide-react";

export default function UploadModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  const fileInputRef = useRef();

  // Handle file selection
  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    //verify that the file is pdf/docx
    const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only PDF or DOCX files are allowed");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (selectedFile.size > maxSize) {
      alert("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    setUploaded(false);   //reset file uploaded status
    setProgress(0);
  };

  // Simulate upload (replace with real API later)
  const uploadFile = (file) => {
        console.log("uploading");
        const formData = new FormData();
        formData.append("resume", file);

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
        };

        xhr.onload = () => {
            if (xhr.status === 201) {
                const data = JSON.parse(xhr.response);
                console.log(data);
                setUploaded(true);
            }
        };

        xhr.open("POST", "http://localhost:5000/api/resumes");
        xhr.send(formData);
  };

  // Drag handlers
  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-8 rounded-2xl w-[400px] text-center shadow-xl"
      >
        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-indigo-300 rounded-xl p-10 cursor-pointer hover:bg-gray-50 transition"
        >
          <div className="mb-4 flex justify-center">
            <FileUp size={44} color="#3949ab" strokeWidth={1.25} />
          </div>

          <h2 className="text-xl font-bold mb-2">
            Drop your resume here
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Support for PDF and DOCX files up to 10MB
          </p>

          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow-md"
          >
            Browse Files
          </button>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          <p className="text-gray-500 text-sm mt-6">
            You're data is encrypted and is never shared with third parties.
          </p>
        </div>

        {/* Progress Bar */}
        {file && (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">{file.name}</p>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs mt-2">{progress}%</p>
          </div>
        )}

        {/* Analyze Button */}
        {file && (
          <button
          onClick={() => uploadFile(file)}
          disabled={!file}
          className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-xl disabled:opacity-50"
          >
            Analyze Resume
          </button>
        )}
      </div>
    </div>
  );
}
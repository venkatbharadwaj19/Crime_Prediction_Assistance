import React, { useState } from "react";
import { motion } from "framer-motion";

const ObjectDetect: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [evidenceImage, setEvidenceImage] = useState<File | null>(null);
  const [matchResult, setMatchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const uploadVideo = async () => {
    if (!videoFile) return alert("Upload a crime scene video first!");
    setLoading(true);
    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const res = await fetch("http://localhost:5000/api/upload-video", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message || "Video processed!");
    } catch (err) {
      alert("Failed to upload video.");
    } finally {
      setLoading(false);
    }
  };

  const matchEvidence = async () => {
    if (!evidenceImage) return alert("Upload an evidence image!");
    setLoading(true);
    const formData = new FormData();
    formData.append("image", evidenceImage);

    try {
      const res = await fetch("http://localhost:5000/api/match-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.match_score) {
        setMatchResult(data);
      } else {
        alert(data.error || "No match found.");
      }
    } catch (err) {
      alert("Error matching image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-200 flex justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-3xl"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">🕵️‍♂️ Object Detection Module</h2>

        <div className="space-y-6">
          {/* Video Upload */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">🎥 Upload Crime Scene Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <button
              onClick={uploadVideo}
              className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl w-full transition"
            >
              Upload Video
            </button>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">🖼️ Upload Evidence Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEvidenceImage(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <button
              onClick={matchEvidence}
              className="mt-3 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl w-full transition"
            >
              Match with Video
            </button>
          </div>

          {loading && (
            <div className="text-center text-purple-600 font-medium mt-4 animate-pulse">
              🔄 Processing...
            </div>
          )}

          {/* Match Results */}
          {matchResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 p-5 rounded-2xl border border-gray-200 shadow-sm mt-6"
            >
              <h3 className="text-xl font-bold text-center text-gray-800 mb-4">✅ Match Found</h3>
              <p className="text-center text-lg text-green-700 font-semibold mb-4">
                Best Match Score: {(matchResult.match_score * 100).toFixed(2)}%
              </p>
              <img
                src={`data:image/jpeg;base64,${matchResult.matched_frame}`}
                alt="Matched Frame"
                className="w-full rounded-xl shadow-md"
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ObjectDetect;

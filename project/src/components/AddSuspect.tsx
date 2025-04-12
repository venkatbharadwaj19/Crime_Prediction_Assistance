// src/components/AddSuspect.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const AddSuspect: React.FC = () => {
  const [crimeVoice, setCrimeVoice] = useState<File | null>(null);
  const [suspectVoices, setSuspectVoices] = useState<FileList | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!crimeVoice || !suspectVoices) {
      alert("Please upload both crime voice and suspect voices.");
      return;
    }

    if (
      !crimeVoice.type.startsWith("audio/") ||
      Array.from(suspectVoices).some(file => !file.type.startsWith("audio/"))
    ) {
      alert("Please upload only valid audio files.");
      return;
    }

    const formData = new FormData();
    formData.append("crime_voice", crimeVoice);
    for (let i = 0; i < suspectVoices.length; i++) {
      formData.append("suspect_voices", suspectVoices[i]);
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/voice-match", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        alert("Server returned an error. See console for details.");
        return;
      }

      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      alert("Error during voice match.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-200 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8"
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-indigo-700 mb-6 text-center"
        >
          🎤 Voice Match Upload
        </motion.h2>

        <div className="space-y-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Crime Voice File
            </label>
            <input
              type="file"
              accept="audio/*"
              className="w-full p-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setCrimeVoice(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Suspect Voice Files
            </label>
            <input
              type="file"
              accept="audio/*"
              multiple
              className="w-full p-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setSuspectVoices(e.target.files)}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300"
          >
            {loading ? "Matching..." : "Submit"}
          </motion.button>
        </div>

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-gray-50 p-5 rounded-2xl border border-gray-200 shadow-sm"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🔍 Match Results</h3>
            <ul className="space-y-3">
              {results.map((r, index) => (
                <li
                  key={index}
                  className={`p-4 rounded-lg border ${
                    r.match
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-red-100 text-red-800 border-red-300"
                  }`}
                >
                  <div className="font-medium">
                    {r.filename}:{" "}
                    {r.similarity !== null
                      ? `${(r.similarity * 100).toFixed(2)}%`
                      : "❌ Error"}{" "}
                    - {r.match ? "✅ Match" : "❌ No Match"}
                  </div>
                  {r.error && <div className="text-sm text-gray-600">Error: {r.error}</div>}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AddSuspect;

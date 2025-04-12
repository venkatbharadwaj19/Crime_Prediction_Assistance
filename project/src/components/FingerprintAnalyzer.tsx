import React, { useState } from "react";
import { motion } from "framer-motion";

const FingerprintAnalyzer: React.FC = () => {
  const [queryImage, setQueryImage] = useState<File | null>(null);
  const [suspectImages, setSuspectImages] = useState<FileList | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!queryImage || !suspectImages) {
      alert("Please upload both the query fingerprint and suspect images.");
      return;
    }

    const formData = new FormData();
    formData.append("query_fingerprint", queryImage);
    for (let i = 0; i < suspectImages.length; i++) {
      formData.append("suspect_fingerprints", suspectImages[i]);
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/fingerprint", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error response:", text);
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Results from backend:", data);
      setResults(data.results);
    } catch (err) {
      alert("Error during fingerprint analysis.");
      console.error("Fingerprint match error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-red-100 to-pink-200 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8"
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-rose-700 mb-6 text-center"
        >
          🔬 Fingerprint Analyzer
        </motion.h2>

        <div className="space-y-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Crime Scene Fingerprint
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-rose-500"
              onChange={(e) => setQueryImage(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Suspect Fingerprint Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="w-full p-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-rose-500"
              onChange={(e) => setSuspectImages(e.target.files)}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleSubmit}
            className="w-full bg-rose-600 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-rose-700 transition duration-300"
          >
            {loading ? "Analyzing..." : "Submit"}
          </motion.button>
        </div>

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-gray-50 p-5 rounded-2xl border border-gray-200 shadow-sm"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🧪 Match Results</h3>
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
                    {r.filename}: Match Score ={" "}
                    {r.match_score !== null
                      ? `${r.match_score.toFixed(2)}%`
                      : "❌ Error"}{" "}
                    - {r.match ? "✅ Match" : "❌ No Match"}
                  </div>
                  {r.error && (
                    <div className="text-sm text-gray-600">Error: {r.error}</div>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default FingerprintAnalyzer;

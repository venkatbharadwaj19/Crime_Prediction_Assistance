import React, { useState } from "react";

const IrisMatch: React.FC = () => {
  const [crimeIris, setCrimeIris] = useState<File | null>(null);
  const [suspectIris, setSuspectIris] = useState<File | null>(null);
  const [matchResult, setMatchResult] = useState<any>(null);

  const uploadCrimeIris = async () => {
    if (!crimeIris) return alert("Upload crime iris image.");
    const formData = new FormData();
    formData.append("image", crimeIris);

    const res = await fetch("http://localhost:5000/api/upload-crime-iris", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Crime iris uploaded successfully.");
    } else {
      alert("Failed to upload crime iris.");
    }
  };

  const matchSuspectIris = async () => {
    if (!suspectIris) return alert("Upload suspect iris image.");
    const formData = new FormData();
    formData.append("image", suspectIris);

    const res = await fetch("http://localhost:5000/api/match-iris", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMatchResult(data);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">👁️ Iris Recognition</h2>

      <div className="mb-3">
        <label>Upload Crime Iris Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCrimeIris(e.target.files?.[0] || null)}
        />
        <button className="ml-2 bg-green-600 text-white px-3 py-1 rounded" onClick={uploadCrimeIris}>
          Upload
        </button>
      </div>

      <div className="mb-3">
        <label>Upload Suspect Iris Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSuspectIris(e.target.files?.[0] || null)}
        />
        <button className="ml-2 bg-blue-600 text-white px-3 py-1 rounded" onClick={matchSuspectIris}>
          Match
        </button>
      </div>

      {matchResult && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">🔎 Match Result</h3>
          <p>Match Score: {matchResult.match_score}%</p>
          <p>Status: {matchResult.matched ? "✅ Match" : "❌ No Match"}</p>
        </div>
      )}
    </div>
  );
};

export default IrisMatch;

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
import tempfile
import shutil
from resemblyzer import VoiceEncoder, preprocess_wav

app = Flask(__name__)
CORS(app)

# Load the voice encoder once
encoder = VoiceEncoder()

@app.route("/api/voice-match", methods=["POST"])
def voice_match():
    if "crime_voice" not in request.files or "suspect_voices" not in request.files:
        return jsonify({"error": "Missing files"}), 400

    crime_voice = request.files["crime_voice"]
    suspect_voices = request.files.getlist("suspect_voices")

    temp_dir = tempfile.mkdtemp()
    crime_path = os.path.join(temp_dir, "crime.wav")
    crime_voice.save(crime_path)

    try:
        crime_embedding = encoder.embed_utterance(preprocess_wav(crime_path))
    except Exception as e:
        shutil.rmtree(temp_dir)
        return jsonify({"error": f"Could not process crime voice: {str(e)}"}), 500

    results = []
    threshold = 0.75

    for suspect_file in suspect_voices:
        suspect_path = os.path.join(temp_dir, suspect_file.filename)
        suspect_file.save(suspect_path)

        try:
            suspect_embedding = encoder.embed_utterance(preprocess_wav(suspect_path))
            similarity = np.inner(crime_embedding, suspect_embedding)
            results.append({
               "filename": suspect_file.filename,
               "similarity": float(similarity),  # ✅ Already good
               "match": bool(similarity > threshold)  # ✅ Make sure it's a native Python bool
            })
        except Exception as e:
            results.append({
                "filename": suspect_file.filename,
                "similarity": None,
                "match": False,
                "error": str(e)
            })

    shutil.rmtree(temp_dir)
    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(debug=True, port=5000)

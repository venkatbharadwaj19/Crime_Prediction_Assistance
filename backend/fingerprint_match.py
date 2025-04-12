from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import os
import numpy as np
import tempfile

app = Flask(__name__)
CORS(app)

def load_image_gray(path):
    return cv2.imread(path, cv2.IMREAD_GRAYSCALE)

def match_fingerprints(query_img, suspect_img):
    orb = cv2.ORB_create()

    kp1, des1 = orb.detectAndCompute(query_img, None)
    kp2, des2 = orb.detectAndCompute(suspect_img, None)

    if des1 is None or des2 is None:
        return 0.0

    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(des1, des2)
    matches = sorted(matches, key=lambda x: x.distance)

    match_score = len(matches) / max(len(kp1), len(kp2)) * 100
    return match_score

@app.route("/api/fingerprint", methods=["POST"])
def fingerprint_match():
    if "query_fingerprint" not in request.files or "suspect_fingerprints" not in request.files:
        return jsonify({"error": "Missing files"}), 400

    query_fp = request.files["query_fingerprint"]
    suspect_files = request.files.getlist("suspect_fingerprints")

    temp_dir = tempfile.mkdtemp()
    query_path = os.path.join(temp_dir, "query.jpg")
    query_fp.save(query_path)

    try:
        query_img = load_image_gray(query_path)
    except Exception as e:
        return jsonify({"error": f"Failed to load query image: {str(e)}"}), 500

    results = []
    threshold = 50.0  # Match threshold in percent

    for suspect_file in suspect_files:
        suspect_path = os.path.join(temp_dir, suspect_file.filename)
        suspect_file.save(suspect_path)

        try:
            suspect_img = load_image_gray(suspect_path)
            score = match_fingerprints(query_img, suspect_img)
            results.append({
                "filename": suspect_file.filename,
                "match_score": round(score, 2),
                "match": score >= threshold
            })
        except Exception as e:
            results.append({
                "filename": suspect_file.filename,
                "match_score": None,
                "match": False,
                "error": str(e)
            })

    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(debug=True, port=5000)

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import shutil
import cv2
from PIL import Image
import torch
import torchvision.transforms as T
import numpy as np
import base64
import io
import clip
from numpy.linalg import norm


app = Flask(__name__)
CORS(app)

# Load models
yolo = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
clip_model, clip_preprocess = clip.load("ViT-B/32")
clip_model.eval()

frame_features = []
frame_images = []

def extract_frames(video_path):
    cap = cv2.VideoCapture(video_path)
    success, image = cap.read()
    frames = []
    while success:
        frames.append(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        success, image = cap.read()
    cap.release()
    return frames[::30]  # Sample 1 frame every second (30 fps)

@app.route("/api/upload-video", methods=["POST"])
def upload_video():
    global frame_features, frame_images
    frame_features.clear()
    frame_images.clear()

    if "video" not in request.files:
        return jsonify({"error": "Missing video file"}), 400

    video_file = request.files["video"]
    temp_dir = tempfile.mkdtemp()
    video_path = os.path.join(temp_dir, "video.mp4")
    video_file.save(video_path)

    try:
        frames = extract_frames(video_path)
        for frame in frames:
            pil = Image.fromarray(frame)
            frame_images.append(pil)
            with torch.no_grad():
                image_input = clip_preprocess(pil).unsqueeze(0)
                image_features = clip_model.encode_image(image_input)
                frame_features.append(image_features[0].cpu().numpy())
        shutil.rmtree(temp_dir)
        return jsonify({"message": f"Extracted {len(frame_features)} frames"}), 200
    except Exception as e:
        shutil.rmtree(temp_dir)
        return jsonify({"error": str(e)}), 500

@app.route("/api/match-image", methods=["POST"])
def match_image():
    if "image" not in request.files:
        return jsonify({"error": "Missing image file"}), 400

    if not frame_features:
        return jsonify({"error": "No video uploaded yet"}), 400

    img = Image.open(request.files["image"]).convert("RGB")

    with torch.no_grad():
        input_tensor = clip_preprocess(img).unsqueeze(0)
        evidence_feature = clip_model.encode_image(input_tensor)[0].cpu().numpy()

    similarities = [
    np.dot(evidence_feature, frame_feat) / (norm(evidence_feature) * norm(frame_feat))
    for frame_feat in frame_features
    ]
    max_index = int(np.argmax(similarities))
    max_score = float(similarities[max_index])

    # Convert best match frame to base64
    buffer = io.BytesIO()
    frame_images[max_index].save(buffer, format="JPEG")
    img_str = base64.b64encode(buffer.getvalue()).decode()

    match_threshold = 0.70
    is_match = max_score > match_threshold
    

    return jsonify({
       "match_score": max_score,
       "matched_frame": img_str,
       "match": is_match  # ✅ true if score > 0.70
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)

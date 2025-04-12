# 🕵️‍♂️ Crime Prediction Assistance

Crime Prediction Assistance is an AI-powered investigation support tool designed to help law enforcement identify suspects using biometric and visual evidence collected from crime scenes.

## 🚀 Features

### 🔬 Evidence Analysis Modules:
- **🔎 Fingerprint Matching** using OpenCV
- **🎤 Voice Recognition** with Resemblyzer
- **📦 Object Detection and Recognition** using YOLOv5

### 🎥 Crime Scene Video Support:
- Extracts frames from videos
- Matches suspect evidence (images) against those frames

### 🧠 Deep Learning Models:
- YOLOv5 for object detection

### 🖥️ Frontend + Backend:
- **Frontend**: ReactJS
- **Backend**: Flask (Python)
- **Local GUI**: Tkinter interface for training and uploading data

---

## 🛠️ Tech Stack

| Area              | Tech Used                            |
|-------------------|--------------------------------------|
| Backend           | Flask                                |
| Frontend          | ReactJS                              |
| GUI Tool          | Tkinter                              |
| Fingerprint Match | OpenCV                               |
| Voice Match       | Resemblyzer                          |
| Object Detection  | YOLOv5                               |

---

## 📂 Project Structure

```bash
crime_prediction_assistance/
├── backend/
│   ├── app.py
│   ├── fingerprint_module/
│   ├── voice_module/
│   └── object_detection_module/
├── frontend/
│   └── (React code here)
├── README.md

# # #importing libraries
# # import numpy as np
# # import tensorflow as tf
# # import cv2
# # from flask import Flask, request, jsonify

# # app = Flask(__name__)

# # #load model
# # model = tf.keras.models.load_model("emotion_detection.h5")

# # face_haar_cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

# # emotion_detection = (
# #     'You seem Angry.', 
# #     'You seem Disgusted.', 
# #     'Fear Detected!!', 
# #     "Yayy, You seem Happy.", 
# #     'You seem Sad.', 
# #     'Surprised!!!', 
# #     'You seem Neutral.'
# # )

# # @app.route('/predict', methods=['POST'])
# # def predict():
# #     file = request.files['image']

# #     # read image
# #     file_bytes = np.frombuffer(file.read(), np.uint8)
# #     img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

# #     gray_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# #     faces = face_haar_cascade.detectMultiScale(gray_image)

# #     results = []

# #     for (x,y,w,h) in faces:
# #         roi_gray = gray_image[y-5:y+h+5, x-5:x+w+5]
# #         roi_gray = cv2.resize(roi_gray,(48,48))

# #         image_pixels = tf.keras.preprocessing.image.img_to_array(roi_gray)
# #         image_pixels = np.expand_dims(image_pixels, axis=0)
# #         image_pixels /= 255

# #         predictions = model.predict(image_pixels)
# #         max_index = np.argmax(predictions[0])

# #         emotion_prediction = emotion_detection[max_index]
# #         results.append(emotion_prediction)

# #     return jsonify({
# #         "emotions": results
# #     })

# # if __name__ == '__main__':
# #     app.run(host="0.0.0.0", port=5000)








# # -----------------------------
# # IMPORTS
# # -----------------------------
# import os
# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # 🔇 hide TF logs

# import re
# import uuid
# import json
# import numpy as np
# import tensorflow as tf
# import cv2
# from datetime import datetime
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from faster_whisper import WhisperModel

# # -----------------------------
# # INIT
# # -----------------------------
# app = Flask(__name__)
# CORS(app)

# UPLOAD_FOLDER = "uploads"
# LOG_FILE = "uploads/logs.json"

# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# print("🚀 Starting backend...")

# # -----------------------------
# # LOAD MODELS
# # -----------------------------
# try:
#     print("⏳ Loading Emotion Model...")
#     emotion_model = tf.keras.models.load_model("emotion_detection.h5")

#     face_haar_cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

#     if face_haar_cascade.empty():
#         raise Exception("Haar cascade not loaded ❌")

#     emotion_labels = [
#         'Angry', 'Disgusted', 'Fear',
#         'Happy', 'Sad', 'Surprise', 'Neutral'
#     ]

#     print("⏳ Loading Whisper Model...")
#     whisper_model = WhisperModel("base", device="cpu", compute_type="int8")

#     print("✅ All models loaded successfully!")

# except Exception as e:
#     print("❌ Model loading failed:", e)

# # -----------------------------
# # CONFIG
# # -----------------------------
# ALLOWED_LANGS = ["hi", "en", "mr"]

# EMERGENCY_KEYWORDS = [
#     "help", "emergency", "save me", "attack", "unsafe", "sos",
#     "बचाओ", "मदद", "सहायता",
#     "वाचवा", "मदत", "धोक"
# ]

# # -----------------------------
# # UTILS
# # -----------------------------
# def clean_text(text):
#     return re.sub(r'\s+', ' ', text).strip().lower()

# def detect_emergency(text):
#     for word in EMERGENCY_KEYWORDS:
#         if word.lower() in text:
#             return True, word
#     return False, None

# def save_log(data):
#     try:
#         if os.path.exists(LOG_FILE):
#             with open(LOG_FILE, "r") as f:
#                 logs = json.load(f)
#         else:
#             logs = []

#         logs.append(data)

#         with open(LOG_FILE, "w") as f:
#             json.dump(logs, f, indent=2)

#     except Exception as e:
#         print("❌ Log save error:", e)

# # -----------------------------
# # HEALTH CHECK
# # -----------------------------
# @app.route("/", methods=["GET"])
# def home():
#     return jsonify({"message": "Backend running 🚀"})

# # -----------------------------
# # FACE EMOTION API
# # -----------------------------
# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         if 'image' not in request.files:
#             return jsonify({"error": "No image file"}), 400

#         file = request.files['image']

#         file_bytes = np.frombuffer(file.read(), np.uint8)
#         img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

#         if img is None:
#             return jsonify({"error": "Invalid image"}), 400

#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         faces = face_haar_cascade.detectMultiScale(gray, 1.3, 5)

#         results = []

#         for (x, y, w, h) in faces:
#             roi = gray[y:y+h, x:x+w]
#             roi = cv2.resize(roi, (48, 48))

#             roi = tf.keras.preprocessing.image.img_to_array(roi)
#             roi = np.expand_dims(roi, axis=0)
#             roi /= 255.0

#             preds = emotion_model.predict(roi, verbose=0)
#             max_index = int(np.argmax(preds[0]))

#             results.append(emotion_labels[max_index])

#         return jsonify({
#             "faces_detected": len(results),
#             "emotions": results
#         })

#     except Exception as e:
#         print("❌ Face API Error:", e)
#         return jsonify({"error": str(e)}), 500

# # -----------------------------
# # VOICE ANALYSIS API
# # -----------------------------
# @app.route("/analyze", methods=["POST"])
# def analyze():
#     try:
#         if 'file' not in request.files:
#             return jsonify({"error": "No audio file"}), 400

#         file = request.files["file"]

#         # save audio
#         filename = f"{UPLOAD_FOLDER}/audio_{uuid.uuid4().hex}.wav"
#         file.save(filename)

#         print("🎤 Processing audio:", filename)

#         segments, info = whisper_model.transcribe(filename)

#         text = " ".join([seg.text for seg in segments])
#         text = clean_text(text)

#         lang = info.language

#         is_emergency, keyword = detect_emergency(text)

#         # ---------------- LOG SAVE ----------------
#         log_data = {
#             "time": str(datetime.now()),
#             "file": filename,
#             "text": text,
#             "language": lang,
#             "emergency": is_emergency,
#             "keyword": keyword
#         }

#         save_log(log_data)

#         print("📝 TEXT:", text)
#         print("🌐 LANG:", lang)
#         print("🚨 EMERGENCY:", is_emergency, keyword)

#         return jsonify({
#             "text": text,
#             "language": lang,
#             "emergency": is_emergency,
#             "keyword": keyword
#         })

#     except Exception as e:
#         print("❌ Voice API Error:", e)
#         return jsonify({"error": str(e)}), 500

# # -----------------------------
# # RUN
# # -----------------------------
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=False)



















# -----------------------------
# IMPORTS
# -----------------------------
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import re
import uuid
import json
import string
import numpy as np
import tensorflow as tf
import cv2
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from faster_whisper import WhisperModel
from transformers import pipeline

# -----------------------------
# INIT
# -----------------------------
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
LOG_FILE = "uploads/logs.json"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

print("🚀 Starting backend...")

# -----------------------------
# LOAD MODELS
# -----------------------------
try:
    print("⏳ Loading Emotion Model...")
    emotion_model = tf.keras.models.load_model("emotion_detection.h5")

    face_haar_cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

    if face_haar_cascade.empty():
        raise Exception("Haar cascade not loaded ❌")

    emotion_labels = [
        'Angry', 'Disgusted', 'Fear',
        'Happy', 'Sad', 'Surprise', 'Neutral'
    ]

    print("⏳ Loading Whisper Model...")
    whisper_model = WhisperModel("medium", device="cpu", compute_type="float32")

    print("⏳ Loading Sentiment Model...")
    sentiment_pipeline = pipeline("sentiment-analysis")

    print("✅ All models loaded successfully!")

except Exception as e:
    print("❌ Model loading failed:", e)

# -----------------------------
# CONFIG
# -----------------------------
ALLOWED_LANGS = ["hi", "en", "mr"]

EMERGENCY_KEYWORDS = [
    "help", "emergency", "save me", "attack", "unsafe", "sos",
    "बचाओ", "मदद", "सहायता",
    "वाचवा", "मदत", "धोक"
]

# -----------------------------
# UTILS
# -----------------------------
def clean_text(text):
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    return text.strip()

def detect_emergency_advanced(text, sentiment):
    score = 0

    for word in EMERGENCY_KEYWORDS:
        if word in text:
            score += 2

    if sentiment["label"] == "NEGATIVE":
        score += 1

    if "urgent" in text or "please" in text:
        score += 1

    return score >= 2

def save_log(data):
    try:
        if os.path.exists(LOG_FILE):
            with open(LOG_FILE, "r") as f:
                logs = json.load(f)
        else:
            logs = []

        logs.append(data)

        with open(LOG_FILE, "w") as f:
            json.dump(logs, f, indent=2)

    except Exception as e:
        print("❌ Log save error:", e)

# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Backend running 🚀"})

# -----------------------------
# FACE EMOTION API
# -----------------------------
@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file"}), 400

        file = request.files['image']

        file_bytes = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Invalid image"}), 400

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_haar_cascade.detectMultiScale(gray, 1.3, 5)

        results = []

        for (x, y, w, h) in faces:
            roi = gray[y:y+h, x:x+w]
            roi = cv2.resize(roi, (48, 48))

            roi = tf.keras.preprocessing.image.img_to_array(roi)
            roi = np.expand_dims(roi, axis=0)
            roi /= 255.0

            preds = emotion_model.predict(roi, verbose=0)
            max_index = int(np.argmax(preds[0]))

            results.append(emotion_labels[max_index])

        return jsonify({
            "faces_detected": len(results),
            "emotions": results
        })

    except Exception as e:
        print("❌ Face API Error:", e)
        return jsonify({"error": str(e)}), 500

# -----------------------------
# VOICE ANALYSIS API
# -----------------------------
@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No audio file"}), 400

        file = request.files["file"]

        filename = f"{UPLOAD_FOLDER}/audio_{uuid.uuid4().hex}.wav"
        file.save(filename)

        print("🎤 Processing audio:", filename)

        # ---------------- TRANSCRIPTION ----------------
        segments, info = whisper_model.transcribe(filename)

        text = " ".join([seg.text for seg in segments])
        text = clean_text(text)

        lang = info.language

        if lang not in ALLOWED_LANGS:
            return jsonify({"error": "Unsupported language"}), 400

        # ---------------- SENTIMENT ----------------
        sentiment = sentiment_pipeline(text)[0]

        # ---------------- EMERGENCY DETECTION ----------------
        is_emergency = detect_emergency_advanced(text, sentiment)

        # ---------------- LOG ----------------
        log_data = {
            "time": str(datetime.now()),
            "file": filename,
            "text": text,
            "language": lang,
            "sentiment": sentiment,
            "emergency": is_emergency
        }

        save_log(log_data)

        print("📝 TEXT:", text)
        print("🌐 LANG:", lang)
        print("😊 SENTIMENT:", sentiment)
        print("🚨 EMERGENCY:", is_emergency)

        return jsonify({
            "text": text,
            "language": lang,
            "sentiment": sentiment["label"],
            "confidence": sentiment["score"],
            "emergency": is_emergency
        })

    except Exception as e:
        print("❌ Voice API Error:", e)
        return jsonify({"error": str(e)}), 500

# -----------------------------
# RUN
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
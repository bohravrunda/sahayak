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












import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import re
import uuid
import json
import string
import time
import numpy as np
import tensorflow as tf
import cv2
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from faster_whisper import WhisperModel
from transformers import pipeline

# -----------------------------
# INIT & FOLDER CONFIGURATION
# -----------------------------
app = Flask(__name__, static_folder="uploads")
CORS(app)

# 📂 Folder structure configuration
UPLOAD_FOLDER = "uploads"
DISTRESS_FOLDER = os.path.join(UPLOAD_FOLDER, "distress_recordings")
DISTRESS_IMAGE_FOLDER = os.path.join(UPLOAD_FOLDER, "distress_images")  # Folder for image/frame logs
LOG_FILE = os.path.join(UPLOAD_FOLDER, "logs.json")
VIDEO_LOGS_FILE = os.path.join(UPLOAD_FOLDER, "video_logs.json")        # Persisted log for image entries

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(DISTRESS_FOLDER, exist_ok=True)
os.makedirs(DISTRESS_IMAGE_FOLDER, exist_ok=True)

print("🚀 Starting optimized backend with Audio & Video Distress Archives...")

# -----------------------------
# LOAD MODELS (OPTIMIZED FOR CPU SPEED)
# -----------------------------
try:
    print("⏳ Loading Emotion Model...")
    emotion_model = tf.keras.models.load_model("emotion_detection.h5")
    face_haar_cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

    if face_haar_cascade.empty():
        raise Exception("Haar cascade not loaded ❌")

    emotion_labels = ['Angry', 'Disgusted', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

    print("⏳ Loading Whisper Model...")
    # OPTIMIZATION: compute_type="int8" configured for faster execution on CPU
    whisper_model = WhisperModel("medium", device="cpu", compute_type="int8")

    print("⏳ Loading Sentiment Model...")
    sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

    print("✅ All models loaded successfully with optimizations!")

except Exception as e:
    print("❌ Model loading failed:", e)

# -----------------------------
# CONFIG & KEYWORDS
# -----------------------------
ALLOWED_LANGS = ["hi", "en", "mr"]

EMERGENCY_KEYWORDS = [
    "help", "emergency", "save me", "attack", "unsafe", "sos", "police",
    "bachao", "madad", 
    "बचाओ", "मदद", "सहायता", "वाचवा", "मदत",
    "वाथ्स्वा", "वासवा", "वाचवा मला"
]

# -----------------------------
# UTILS & HELPERS
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
            break

    if sentiment["label"] == "NEGATIVE" and sentiment["score"] > 0.7:
        score += 1

    if "urgent" in text or "please" in text or "mal" in text:
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

# Helper to read/write image-video logging metadata securely
def get_persisted_video_logs():
    if not os.path.exists(VIDEO_LOGS_FILE):
        return []
    try:
        with open(VIDEO_LOGS_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []

def save_video_logs(logs):
    try:
        with open(VIDEO_LOGS_FILE, "w") as f:
            json.dump(logs, f, indent=2)
    except Exception as e:
        print("❌ Error writing video logs reference metadata:", e)

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

        return jsonify({"faces_detected": len(results), "emotions": results})
    except Exception as e:
        print("❌ Face API Error:", e)
        return jsonify({"error": str(e)}), 500

# -----------------------------
# VOICE & EMOTION ANALYSIS API
# -----------------------------
@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No audio file"}), 400

        file = request.files["file"]
        temp_filename = f"{UPLOAD_FOLDER}/temp_{uuid.uuid4().hex}.wav"
        file.save(temp_filename)

        print("🎤 Processing audio chunks...")

        # TRANSCRIPTION WITH PARAMETERS OPTIMIZATION
        segments, info = whisper_model.transcribe(
            temp_filename, 
            beam_size=1, 
            best_of=1,
            temperature=0.0,
            initial_prompt="help emergency bachao madad बचाओ मदद सहायता वाचवा मदत धोका",
        )

        text = " ".join([seg.text for seg in segments])
        text = clean_text(text)
        lang = info.language

        print(f"📝 Transcribed Text: '{text}' [Lang: {lang}]")

        # SENTIMENT ANALYSIS
        sentiment = {"label": "NEUTRAL", "score": 0.0}
        if text.strip():
            try:
                res_sentiment = sentiment_pipeline(text)[0]
                sentiment = {
                    "label": res_sentiment["label"],
                    "score": float(res_sentiment["score"])
                }
            except Exception as e:
                print("⚠️ Sentiment logic error:", e)

        # EMOTION DETECTION
        detected_emotion = "Neutral"
        if sentiment["label"] == "NEGATIVE" and sentiment["score"] > 0.7:
            detected_emotion = "Fear"

        is_emergency = detect_emergency_advanced(text, sentiment)
        final_filepath = temp_filename
        
        if is_emergency:
            distress_filename = f"distress_{int(time.time())}.wav"
            final_filepath = os.path.join(DISTRESS_FOLDER, distress_filename)
            os.rename(temp_filename, final_filepath)
            print(f"🚨 Distress File Saved: {final_filepath}")
        else:
            try:
                os.remove(temp_filename)
                final_filepath = "deleted_non_emergency"
            except Exception as ex:
                print("Temp file removal skipped", ex)

        # SAVE SYSTEM LOGS
        log_data = {
            "time": str(datetime.now()),
            "file": final_filepath,
            "text": text,
            "language": lang,
            "sentiment": sentiment,
            "emotion": detected_emotion,
            "emergency": is_emergency
        }
        save_log(log_data)

        # COUNTER LOGS FOR TERMINAL
        print("😊 SENTIMENT:", sentiment)
        print("🎭 EMOTION:", detected_emotion)
        print("🚨 EMERGENCY:", is_emergency)

        return jsonify({
            "text": text,
            "language": lang,
            "sentiment": sentiment["label"],
            "confidence": sentiment["score"],
            "emotion": detected_emotion,
            "emergency": is_emergency
        })

    except Exception as e:
        print("❌ Voice API Error:", e)
        return jsonify({"error": str(e)}), 500

# -----------------------------
# AUDIO STREAMING ROUTE
# -----------------------------
@app.route("/uploads/distress_recordings/<filename>", methods=["GET"])
def serve_audio(filename):
    try:
        return send_from_directory(DISTRESS_FOLDER, filename)
    except Exception as e:
        return jsonify({"error": "File not found"}), 404

# -----------------------------
# GET ALL DISTRESS RECORDINGS
# -----------------------------
@app.route("/api/recordings", methods=["GET"])
def get_recordings():
    try:
        files_list = []
        if os.path.exists(DISTRESS_FOLDER):
            for file_name in os.listdir(DISTRESS_FOLDER):
                if file_name.endswith(".wav"):
                    file_path = os.path.join(DISTRESS_FOLDER, file_name)
                    file_stat = os.stat(file_path)
                    
                    files_list.append({
                        "name": file_name,
                        "mtime": int(file_stat.st_mtime * 1000), 
                        "size": file_stat.st_size
                    })
                    
        files_list.sort(key=lambda x: x['mtime'], reverse=True)
        return jsonify(files_list), 200
    except Exception as e:
        print("❌ Error reading recordings directory:", e)
        return jsonify({"error": str(e)}), 500

# -----------------------------
# DELETE AUDIO RECORDING ROUTE
# -----------------------------
@app.route("/api/recordings/<filename>", methods=["DELETE"])
def delete_recording(filename):
    try:
        safe_filename = os.path.basename(filename)
        file_path = os.path.join(DISTRESS_FOLDER, safe_filename)

        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({"success": True, "message": "File deleted successfully"}), 200
        else:
            return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------
# DISTRESS IMAGE FRAME LOG PIPELINE
# -----------------------------

# 📥 1. GET ALL DISTRESS IMAGES LOG DATA
@app.route("/api/videos", methods=["GET"])
def get_distress_videos():
    try:
        logs = get_persisted_video_logs()
        logs.sort(key=lambda x: x.get('mtime', 0), reverse=True)
        return jsonify(logs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 📤 2. POST ROUTE: Receives cloud tracking pointers
@app.route("/api/videos", methods=["POST"])
def add_distress_video_log():
    try:
        data = request.json
        if not data or 'name' not in data:
            return jsonify({"error": "Missing payload data metadata structure"}), 400
        
        current_logs = get_persisted_video_logs()
        
        new_entry = {
            "id": str(uuid.uuid4().hex[:10]),
            "name": data.get("name"),
            "url": data.get("url"),       # Cloud active reference token
            "size": data.get("size", 0),
            "mtime": data.get("mtime", int(time.time() * 1000)),
            "aesKey": data.get("aesKey", "") # Core runtime decryptor key
        }
        
        current_logs.append(new_entry)
        save_video_logs(current_logs)
        
        print(f"🚨 New Video Log Saved on Pipeline Server: {new_entry['name']}")
        return jsonify({"success": True, "message": "Incident sync pipeline logs tracked"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 🗑️ 3. DELETE ROUTE: Clears data logs tracker pointer
@app.route("/api/videos/<string:filename>", methods=["DELETE"])
def delete_distress_video_log(filename):
    try:
        current_logs = get_persisted_video_logs()
        updated_logs = [log for log in current_logs if log.get('name') != filename]
        
        if len(current_logs) == len(updated_logs):
            return jsonify({"error": "Log record data trace asset target not found"}), 404
            
        save_video_logs(updated_logs)
        print(f"🗑️ Metadata entry trace removed from system logs: {filename}")
        return jsonify({"success": True, "message": "Incident record cleared successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 📡 MANUAL SYNC AUDIO PIPELINE VIA FRONTEND
@app.route("/api/save-distress", methods=["POST"])
def save_distress_manual():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file passed"}), 400
            
        file = request.files['file']
        filename = f"distress_sync_{int(time.time())}.wav"
        file.save(os.path.join(DISTRESS_FOLDER, filename))
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------
# APPLICATION RUNNER
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
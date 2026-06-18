import os
import cv2
import numpy as np
import tensorflow as tf
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# =========================================================
# LOAD MODEL
# =========================================================
print("\nLoading Model...")

model = tf.keras.models.load_model("emotion_detection.h5")

print("✅ Model Loaded Successfully")

# =========================================================
# IMPORTANT LABEL ORDER
# Most FER2013 pretrained models use:
#
# 0 Angry
# 1 Disgust
# 2 Fear
# 3 Happy
# 4 Sad
# 5 Surprise
# 6 Neutral
# =========================================================
emotion_labels = [
    'Angry',
    'Disgust',
    'Fear',
    'Happy',
    'Sad',
    'Surprise',
    'Neutral'
]

# =========================================================
# TEST DATASET PATH
# Folder Structure:
#
# test/
#   Angry/
#   Disgust/
#   Fear/
#   Happy/
#   Sad/
#   Surprise/
#   Neutral/
# =========================================================
test_path = "test"

# =========================================================
# CHECK TEST PATH
# =========================================================
if not os.path.exists(test_path):
    print(f"\n❌ Test folder not found: {test_path}")
    exit()

# =========================================================
# VARIABLES
# =========================================================
y_true = []
y_pred = []

total_images = 0
processed_images = 0
skipped_images = 0

print("\n==============================")
print("STARTING MODEL TESTING")
print("==============================")

# =========================================================
# LOOP THROUGH DATASET
# =========================================================
for label in emotion_labels:

    folder_path = os.path.join(test_path, label)

    # Skip missing folders
    if not os.path.exists(folder_path):
        print(f"\n⚠ Missing Folder: {label}")
        continue

    image_files = os.listdir(folder_path)

    print(f"\n📁 {label}: {len(image_files)} images")

    for image_name in image_files:

        image_path = os.path.join(folder_path, image_name)

        total_images += 1

        try:

            # -------------------------------------------------
            # LOAD IMAGE IN GRAYSCALE
            # FER2013 images are already cropped faces
            # -------------------------------------------------
            img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

            if img is None:
                skipped_images += 1
                continue

            # -------------------------------------------------
            # RESIZE TO MODEL INPUT SIZE
            # -------------------------------------------------
            img = cv2.resize(img, (48, 48))

            # -------------------------------------------------
            # NORMALIZE
            # -------------------------------------------------
            img = img.astype("float32") / 255.0

            # -------------------------------------------------
            # RESHAPE
            # Shape -> (1,48,48,1)
            # -------------------------------------------------
            img = np.expand_dims(img, axis=-1)
            img = np.expand_dims(img, axis=0)

            # -------------------------------------------------
            # PREDICT
            # -------------------------------------------------
            preds = model.predict(img, verbose=0)

            predicted_index = np.argmax(preds[0])

            predicted_label = emotion_labels[predicted_index]

            # -------------------------------------------------
            # STORE RESULTS
            # -------------------------------------------------
            y_true.append(label)
            y_pred.append(predicted_label)

            processed_images += 1

        except Exception as e:

            skipped_images += 1

            print(f"\n❌ Error processing: {image_name}")
            print(e)

# =========================================================
# CHECK RESULTS
# =========================================================
if len(y_true) == 0:
    print("\n❌ No images processed.")
    exit()

# =========================================================
# CALCULATE ACCURACY
# =========================================================
accuracy = accuracy_score(y_true, y_pred)

# =========================================================
# RESULTS
# =========================================================
print("\n==============================")
print("MODEL EVALUATION COMPLETE")
print("==============================")

print(f"\n📊 Total Images      : {total_images}")
print(f"✅ Processed Images  : {processed_images}")
print(f"⚠ Skipped Images    : {skipped_images}")

print(f"\n🎯 Accuracy          : {accuracy * 100:.2f}%")

# =========================================================
# CLASSIFICATION REPORT
# =========================================================
print("\n==============================")
print("CLASSIFICATION REPORT")
print("==============================")

print(
    classification_report(
        y_true,
        y_pred,
        zero_division=0
    )
)

# =========================================================
# CONFUSION MATRIX
# =========================================================
print("\n==============================")
print("CONFUSION MATRIX")
print("==============================")

cm = confusion_matrix(y_true, y_pred)

print(cm)






import face_recognition
from PIL import Image
import numpy as np

def load_rgb_image(path):
    with Image.open(path) as img:
        rgb_img = img.convert("RGB")  # Convert to RGB
        return np.array(rgb_img)

def compare_faces(image_path1, image_path2):
    img1 = load_rgb_image(image_path1)
    img2 = load_rgb_image(image_path2)

    encodings1 = face_recognition.face_encodings(img1)
    encodings2 = face_recognition.face_encodings(img2)

    if not encodings1:
        raise ValueError("No face found in the first image.")
    if not encodings2:
        raise ValueError("No face found in the second image.")

    result = face_recognition.compare_faces([encodings1[0]], encodings2[0])[0]
    distance = face_recognition.face_distance([encodings1[0]], encodings2[0])[0]

    return {
        "match": result,
        "similarity": round((1 - distance) * 100, 2)
    }

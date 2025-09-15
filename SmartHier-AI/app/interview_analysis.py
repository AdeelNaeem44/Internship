import cv2
import sounddevice as sd
import numpy as np
import scipy.io.wavfile
import tempfile
import subprocess
import os

def record_video_and_audio(duration=10, output_path="output.mp4", fps=20):
    # Setup video capture
    cap = cv2.VideoCapture(0)
    width  = int(cap.get(3))
    height = int(cap.get(4))

    temp_video = tempfile.mktemp(suffix=".avi")
    temp_audio = tempfile.mktemp(suffix=".wav")

    # Define video writer
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    video_writer = cv2.VideoWriter(temp_video, fourcc, fps, (width, height))

    # Audio recording setup
    fs = 44100
    audio_frames = []

    print(f"🎥 Recording {duration} seconds of video + audio...")

    # Start recording
    for _ in range(int(fps * duration)):
        ret, frame = cap.read()
        if not ret:
            break
        video_writer.write(frame)

        audio_frame = sd.rec(int(fs / fps), samplerate=fs, channels=1, dtype='int16')
        sd.wait()
        audio_frames.append(audio_frame)

    # Cleanup
    cap.release()
    video_writer.release()
    cv2.destroyAllWindows()

    # Save audio
    audio_data = np.concatenate(audio_frames, axis=0)
    scipy.io.wavfile.write(temp_audio, fs, audio_data)

    # Merge video and audio using ffmpeg
    cmd = [
        "ffmpeg", "-y",
        "-i", temp_video,
        "-i", temp_audio,
        "-c:v", "copy",
        "-c:a", "aac",
        "-strict", "experimental",
        output_path
    ]

    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Remove temporary files
    os.remove(temp_video)
    os.remove(temp_audio)

    print(f"✅ Saved recording to {output_path}")

# Example usage
if __name__ == "__main__":
    record_video_and_audio(duration=10, output_path="interview_recorded.mp4")

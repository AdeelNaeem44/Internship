import streamlit as st
import requests
from PyPDF2 import PdfReader
from streamlit.components.v1 import html

st.set_page_config(page_title="SmartHireAI", layout="wide")

API_BASE = "http://127.0.0.1:8000"

st.sidebar.title("🧠 SmartHireAI")
page = st.sidebar.radio("Go to", [
    "Resume Parser",
    "JD Matcher",
    "Face Match",
    "Video Interview",
    "Final Report"
])

# --------------------------------------
# Resume Parser
# --------------------------------------
if page == "Resume Parser":
    st.header("📄 Resume Parser")
    uploaded_resume = st.file_uploader("Upload Resume (PDF)", type="pdf")
    if uploaded_resume:
        try:
            with open("resume.pdf", "wb") as f:
                f.write(uploaded_resume.read())
            with open("resume.pdf", "rb") as f:
                res = requests.post(f"{API_BASE}/parse_resume/", files={"file": f})
                res.raise_for_status()
                parsed = res.json()
            st.success("✅ Resume Parsed")
            st.json(parsed)
        except Exception as e:
            st.error(f"❌ Resume parsing failed: {e}")

# --------------------------------------
# JD Matcher
# --------------------------------------
elif page == "JD Matcher":
    st.header("📜 Job Description Matcher")
    jd_text = st.text_area("Paste Job Description")
    resume_file = st.file_uploader("Upload Resume again", type="pdf")

    if jd_text and resume_file:
        try:
            files = {"file": resume_file}
            data = {"resume_text": resume_file.read().decode("latin1"), "job_description": jd_text}
            res = requests.post(f"{API_BASE}/compute_match_score/", data=data)
            res.raise_for_status()
            st.success("✅ Match Result")
            st.json(res.json())
        except Exception as e:
            st.error(f"❌ JD matching failed: {e}")

# --------------------------------------
# Face Match
# --------------------------------------
elif page == "Face Match":
    st.header("🧑‍💻 Face Verification")
    st.info("Please upload clear, front-facing images. Avoid group photos or blurry images.")
    img1 = st.file_uploader("Upload Resume Image (JPG/PNG)", type=["jpg", "png", "jpeg"], key="face1")
    img2 = st.file_uploader("Upload Live Image (JPG/PNG)", type=["jpg", "png", "jpeg"], key="face2")

    if img1 and img2:
        files = {"photo1": img1, "photo2": img2}
        try:
            res = requests.post(f"{API_BASE}/verify_identity/", files=files)
            res.raise_for_status()
            result_data = res.json()
            match = result_data.get("match", False)
            similarity = result_data.get("distance", 0.0)
            message = result_data.get("message", "")
            status = "✅ Match" if match else "❌ Mismatch"
            st.write(f"**{status}** | Distance: `{similarity:.3f}`")
            st.info(message)
        except Exception as e:
            st.error(f"❌ Face verification failed: {e}")

# --------------------------------------
# Video Interview
# --------------------------------------
elif page == "Video Interview":
    st.header("🎥 Video Interview – SmartHireAI")

    questions = [
        "Tell me about yourself.",
        "Why do you want to work at our company?",
        "Describe a challenging situation you faced.",
        "What are your strengths and weaknesses?",
        "Where do you see yourself in 5 years?"
    ]

    if "current_q" not in st.session_state:
        st.session_state.current_q = 0

    q_idx = st.session_state.current_q

    if q_idx < len(questions):
        st.subheader(f"Question {q_idx + 1}:")
        st.markdown(f"**{questions[q_idx]}**")

        st.info("Recording will be saved in `.webm` format. Ensure backend supports this or convert to `.mp4` later.")

        st.components.v1.html(f"""
        <video id="preview" width="400" autoplay muted></video><br/>
        <button id="startBtn">Start Recording</button>
        <button id="stopBtn">Stop & Upload</button>

        <script>
        let mediaRecorder;
        let recordedBlobs;

        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const preview = document.getElementById('preview');

        startBtn.onclick = async () => {{
            recordedBlobs = [];
            const stream = await navigator.mediaDevices.getUserMedia({{ audio: true, video: true }});
            preview.srcObject = stream;

            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (event) => {{
                if (event.data && event.data.size > 0) {{
                    recordedBlobs.push(event.data);
                }}
            }};

            mediaRecorder.onstop = async () => {{
                const blob = new Blob(recordedBlobs, {{ type: 'video/webm' }});
                const formData = new FormData();
                formData.append("file", blob, "question_{q_idx+1}.webm");

                try {{
                    const response = await fetch("{API_BASE}/analyze_interview/", {{
                        method: "POST",
                        body: formData
                    }});
                    if (!response.ok) throw new Error("Failed to upload");
                    const result = await response.text();
                    alert("✅ Upload complete: " + result);
                    window.location.reload();
                }} catch (error) {{
                    alert("❌ Upload failed: " + error.message);
                }}
            }};

            mediaRecorder.start();
        }};

        stopBtn.onclick = () => {{
            if (mediaRecorder && mediaRecorder.state !== "inactive") {{
                mediaRecorder.stop();
                preview.srcObject.getTracks().forEach(track => track.stop());
            }}
        }};
        </script>
        """, height=400)

        if st.button("Next Question"):
            st.session_state.current_q += 1
            st.rerun()

    else:
        st.success("✅ Interview Completed")


# --------------------------------------
# Final Report
# --------------------------------------
elif page == "Final Report":
    st.header("📊 Final Report Generator")
    try:
        res = requests.get(f"{API_BASE}/generate_report/")
        res.raise_for_status()
        with open("final_report.pdf", "wb") as f:
            f.write(res.content)
        st.success("PDF Generated!")
        with open("final_report.pdf", "rb") as f:
            st.download_button("⬇ Download Report", f, file_name="SmartHireAI_Report.pdf")
    except Exception as e:
        st.error(f"❌ Report generation failed: {e}")

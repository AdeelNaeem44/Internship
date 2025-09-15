from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
import os
import shutil
from app.resume_parser import parse_resume
from app.resume_matcher import compute_match_score
from app.face_check import compare_faces
from app.interview_analysis import record_video_and_audio
from app.report_generator import generate_candidate_report


app = FastAPI()

UPLOAD_DIR = "temp_uploads"
REPORTS_DIR = "reports"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)

@app.post("/parse_resume/")
async def upload_resume(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    parsed_data = parse_resume(file_path)
    return JSONResponse(content={"parsed_data": parsed_data})


@app.post("/compute_match_score/")
async def match_resume(resume_text: str = Form(...), job_description: str = Form(...)):
    score = compute_match_score(resume_text, job_description)
    return {"match_score": score}


@app.post("/verify_identity/")
async def verify_identity(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    # Save temporary files
    temp1 = f"temp1_{file1.filename}"
    temp2 = f"temp2_{file2.filename}"

    with open(temp1, "wb") as f:
        f.write(await file1.read())
    with open(temp2, "wb") as f:
        f.write(await file2.read())

    try:
        result = compare_faces(temp1, temp2)
        return {"status": "success", "result": result}
    finally:
        os.remove(temp1)
        os.remove(temp2)

@app.post("/analyze_interview/")
async def analyze_interview_video(file: UploadFile = File(...)):
    file_path = os.path.join("uploads", file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Optional: Analyze audio/video (e.g., transcribe or detect emotion)
    result = {"message": f"Saved {file.filename}"}
    return result


@app.post("/generate_report/")
async def generate_report(
    candidate_name: str = Form(...),
    resume_score: float = Form(...),
    interview_transcript: str = Form(...),
    interview_sentiment: str = Form(...),
    interview_confidence: float = Form(...),
    face_match: bool = Form(...),
    face_message: str = Form(...),
    face_distance: float = Form(...)
):
    interview = {
        "transcript": interview_transcript,
        "sentiment": interview_sentiment,
        "confidence": interview_confidence
    }
    face = {
        "match": face_match,
        "message": face_message,
        "distance": face_distance
    }

    report_path = os.path.join(REPORTS_DIR, f"{candidate_name}_report.pdf")
    generate_candidate_report(report_path, candidate_name, resume_score, interview, face)
    return {"message": "Report generated", "report_path": report_path}


@app.get("/")
async def root():
    return {"message": "SmartHireAI API is running."}

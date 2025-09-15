from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime

def generate_candidate_report(output_path, candidate_name, resume_score, interview_data, face_match_data):
    """
    Create a candidate report PDF.
    """
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4

    # Header
    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, height - 50, "SmartHireAI - Candidate Report")

    # Metadata
    c.setFont("Helvetica", 10)
    c.drawString(50, height - 70, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Candidate Info
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, height - 110, f"Candidate Name: {candidate_name}")

    # Resume Score
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 140, f"Resume Match Score: {resume_score}%")

    # Interview Analysis
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 180, "Interview Summary:")
    c.setFont("Helvetica", 11)
    c.drawString(60, height - 200, f"Sentiment: {interview_data['sentiment']}")
    c.drawString(60, height - 215, f"Confidence: {interview_data['confidence']}%")
    c.drawString(60, height - 230, "Transcript (first 250 chars):")
    transcript_preview = interview_data['transcript'][:250] + ("..." if len(interview_data['transcript']) > 250 else "")
    c.drawString(70, height - 245, transcript_preview)

    # Face Match
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 280, "Identity Verification:")
    c.setFont("Helvetica", 11)
    c.drawString(60, height - 295, f"Match: {'Yes' if face_match_data['match'] else 'No'}")
    c.drawString(60, height - 310, f"Message: {face_match_data['message']}")
    c.drawString(60, height - 325, f"Face Distance: {face_match_data.get('distance', 'N/A')}")

    # Footer
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(50, 30, "SmartHireAI Report Generator")

    c.save()

# Example usage
if __name__ == "__main__":
    interview = {
        "sentiment": "POSITIVE",
        "confidence": 94.23,
        "transcript": "I have five years of experience in full stack development, specializing in Python and React..."
    }

    face = {
        "match": True,
        "message": "Faces matched successfully",
        "distance": 0.38
    }

    generate_candidate_report("candidate_report.pdf", "John Doe", 85.7, interview, face)
    print("PDF generated!")

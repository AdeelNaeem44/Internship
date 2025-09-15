from sentence_transformers import SentenceTransformer, util
import numpy as np

# Load the embedding model once
model = SentenceTransformer('all-MiniLM-L6-v2')

def compute_match_score(resume_text: str, job_description: str) -> float:
    """
    Computes cosine similarity score between resume text and job description.
    """
    # Convert to embeddings
    resume_embedding = model.encode(resume_text, convert_to_tensor=True)
    jd_embedding = model.encode(job_description, convert_to_tensor=True)

    # Cosine similarity
    score = util.cos_sim(resume_embedding, jd_embedding).item()
    return round(score * 100, 2)  # return score out of 100

# Example usage
if __name__ == "__main__":
    resume = "Experienced Python developer with background in NLP and machine learning."
    jd = "Looking for a software engineer with experience in Python and ML."
    score = compute_match_score(resume, jd)
    print("Match Score:", score)

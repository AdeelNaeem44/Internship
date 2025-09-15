import os
from pdfminer.high_level import extract_text
import docx
import spacy

nlp = spacy.load("en_core_web_sm")

def extract_text_from_pdf(file_path):
    return extract_text(file_path)

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    return '\n'.join([para.text for para in doc.paragraphs])

def extract_text_from_resume(file_path):
    if file_path.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    elif file_path.endswith(".docx"):
        return extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file type")

def extract_entities(text):
    doc = nlp(text)
    name = ""
    education = []
    experience = []
    skills = []

    for ent in doc.ents:
        if ent.label_ == "PERSON" and not name:
            name = ent.text
        elif ent.label_ in ["ORG", "GPE"]:
            education.append(ent.text)

    # Example keyword match for skills and experience
    for line in text.split('\n'):
        if any(keyword in line.lower() for keyword in ['experience', 'worked at', 'responsibilities']):
            experience.append(line.strip())
        if any(skill in line.lower() for skill in ['python', 'machine learning', 'sql', 'communication']):
            skills.append(line.strip())

    return {
        "name": name,
        "education": list(set(education)),
        "experience": experience,
        "skills": list(set(skills))
    }

def parse_resume(file_path):
    raw_text = extract_text_from_resume(file_path)
    return extract_entities(raw_text)

# Example usage (for testing)
if __name__ == "__main__":
    result = parse_resume("sample_resume.pdf")

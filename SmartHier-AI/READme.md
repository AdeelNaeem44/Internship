# 🤖 SmartHier-AI

## 🧠 Project Overview  
**SmartHier-AI** is an intelligent hiring assistance system that automates key stages of the recruitment process — from parsing resumes and matching candidates to evaluating interviews and generating reports.  
The system combines multiple AI modules for text, facial, and behavioral analysis to streamline candidate evaluation.

---

## ⚙️ System Architecture  

```

SmartHier-AI/
│
├── app/
│   ├── face_check.py           # Performs facial recognition / emotion analysis during interviews
│   ├── interview_analysis.py   # Analyzes candidate responses and sentiment
│   ├── report_generator.py     # Generates summary report of candidate evaluation
│   ├── resume_matcher.py       # Matches candidate resume with job requirements
│   └── resume_parser.py        # Extracts key fields and structure from resumes
│
├── backend/
│   └── api.py                  # Backend API connecting modules and frontend interface
│
└── frontend/
└── streamlit_app.py        # Streamlit-based frontend interface for recruiters

````

---

## ✨ Key Features  

- 🧾 **Resume Parsing** – Automatically extracts candidate details (skills, education, experience) from uploaded resumes.  
- 🧩 **Resume Matching** – Compares extracted candidate data against job requirements for ranking and suitability scoring.  
- 🗣️ **Interview Analysis** – Evaluates candidate answers (text/audio) and sentiment for behavioral insights.  
- 🎭 **Face Check Module** – Performs facial emotion detection or liveness verification during interviews.  
- 📊 **Automated Report Generation** – Combines module outputs into a detailed summary report for HR use.  
- 🌐 **Interactive Frontend** – Simple and user-friendly Streamlit dashboard for managing all AI modules.  

---

## 🧰 Technology Stack  

| Layer | Technologies |
|-------|---------------|
| **Frontend** | Streamlit |
| **Backend** | Python (FastAPI or Flask) |
| **AI Modules** | OpenAI / Hugging Face Transformers, DeepFace, NLTK, Spacy |
| **Data Handling** | Pandas, JSON, OS |
| **Visualization** | Streamlit Components, Matplotlib/Plotly (optional) |

---

## 🧩 Installation & Setup  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/AdeelNaeem44/Internship.git
cd "SmartHier-AI"
````

### 2️⃣ Create a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

> If no `requirements.txt` exists, manually install core libraries:
>
> ```bash
> pip install streamlit openai pandas numpy deepface nltk
> ```

---

## ▶️ Running the Application

### 💻 Start the Frontend

```bash
cd frontend
streamlit run streamlit_app.py
```

Access the interface in your browser at:
➡️ **[http://localhost:8501](http://localhost:8501)**

### ⚙️ Start the Backend (if applicable)

```bash
cd backend
python api.py
```

---

## 🧠 How It Works

1. **Upload Resume** → The system parses candidate information (education, skills, etc.).
2. **Job Matching** → Matches resume with given job description using keyword and semantic similarity.
3. **Interview Phase** → Records answers and applies sentiment/emotion analysis.
4. **Face Verification** → Performs facial emotion or liveness check to ensure authenticity.
5. **Report Generation** → Aggregates all module results into a professional evaluation report.

---

## 🧾 Example Workflow

| Step | Module                  | Description                                   |
| ---- | ----------------------- | --------------------------------------------- |
| 1    | `resume_parser.py`      | Extracts structured data from resumes         |
| 2    | `resume_matcher.py`     | Compares resume with job JD                   |
| 3    | `interview_analysis.py` | Analyzes interview transcript for performance |
| 4    | `face_check.py`         | Detects candidate emotions or expressions     |
| 5    | `report_generator.py`   | Summarizes candidate evaluation               |

---

## 🚀 Future Enhancements

* Integration with ATS (Applicant Tracking Systems)
* Cloud-based database for candidate storage
* Video interview analysis (gesture & tone detection)
* Dashboard analytics for recruiter insights
* Automated shortlisting and recommendation ranking

---

## 👨‍💻 Author

**Adeel Naeem**

* 💼 [GitHub Profile](https://github.com/AdeelNaeem44)

> *“Empowering smarter recruitment decisions with AI-driven insights.”*

```


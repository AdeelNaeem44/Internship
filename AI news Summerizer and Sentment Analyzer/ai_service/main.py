
from fastapi import FastAPI, Request
from pydantic import BaseModel
from transformers import pipeline
import uvicorn
import nltk
from typing import List

app = FastAPI()

# Ensure NLTK stopwords are downloaded
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
from nltk.corpus import stopwords

# Load Hugging Face pipelines
summarizer = pipeline('summarization', model='sshleifer/distilbart-cnn-12-6')
sentiment_analyzer = pipeline('sentiment-analysis', model='distilbert-base-uncased-finetuned-sst-2-english')

class TextRequest(BaseModel):
    text: str

@app.post('/summarize')
def summarize_text(req: TextRequest):
    summary = summarizer(req.text, max_length=100, min_length=20, do_sample=False)
    return {"summary": summary[0]['summary_text']}

@app.post('/sentiment')
def analyze_sentiment(req: TextRequest):
    result = sentiment_analyzer(req.text)
    label = result[0]['label']
    if label == 'POSITIVE':
        sentiment = 'Positive'
    elif label == 'NEGATIVE':
        sentiment = 'Negative'
    else:
        sentiment = 'Neutral'
    return {"sentiment": sentiment, "score": result[0]['score']}

@app.post('/keywords')
def extract_keywords(req: TextRequest):
    try:
        words = nltk.word_tokenize(req.text)
        stop_words = set(stopwords.words('english'))
        keywords = [w for w in words if w.isalnum() and w.lower() not in stop_words]
        freq = {}
        for word in keywords:
            freq[word.lower()] = freq.get(word.lower(), 0) + 1
        sorted_keywords = sorted(freq.items(), key=lambda x: x[1], reverse=True)
        return {"keywords": sorted_keywords[:20]}
    except Exception as e:
        return {"keywords": [], "error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

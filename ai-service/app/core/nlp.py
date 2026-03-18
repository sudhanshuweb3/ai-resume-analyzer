import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

# Load the lightweight english model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import urllib.request
    print("Spacy model not found. Normally downloaded via 'python -m spacy download en_core_web_sm'")
    nlp = spacy.blank("en") # Fallback to blank if model isn't available

class NLPAnalyzer:
    def __init__(self):
        # A basic dictionary of tech skills we specifically want to look out for
        self.tech_vocabulary = {
            "java", "python", "javascript", "react", "spring boot", "fastapi",
            "docker", "kubernetes", "aws", "gcp", "azure", "sql", "postgresql",
            "mongodb", "git", "ci/cd", "machine learning", "nlp", "rest api",
            "microservices", "html", "css", "typescript", "node.js"
        }

    def clean_text(self, text: str) -> str:
        """Cleans the input text by lowering it and removing special characters."""
        text = text.lower()
        text = re.sub(r'[^a-z0-9\s#\++-]', '', text)
        return text

    def extract_keywords(self, text: str) -> set:
        """
        Uses spaCy's Named Entity Recognition and noun chunks to extract keywords.
        Also specifically flags items from our tech_vocabulary.
        """
        doc = nlp(self.clean_text(text))
        
        extracted = set()

        # Extract base vocabulary matches first
        for token in doc:
            if token.text in self.tech_vocabulary:
                extracted.add(token.text)
                
        # Look for multi-word phrases from vocabulary
        for phrase in self.tech_vocabulary:
            if " " in phrase and phrase in text.lower():
                extracted.add(phrase)

        # Use spaCy chunks for noun phrases (skills/technologies are usually nouns)
        for chunk in doc.noun_chunks:
            chunk_text = chunk.text.strip()
            # Only keep chunks of reasonable length to avoid whole sentences
            if 2 <= len(chunk_text) <= 25 and chunk_text.isalpha():
                extracted.add(chunk_text)

        # Extract entities that are ORG or PRODUCT
        for ent in doc.ents:
            if ent.label_ in ["ORG", "PRODUCT", "GPE"]:
                extracted.add(ent.text.lower())
                
        return extracted

    def calculate_similarity(self, resume_text: str, jd_text: str) -> float:
        """
        Computes the cosine similarity between the resume and JD using TF-IDF.
        Returns a float between 0 and 1.
        """
        clean_resume = self.clean_text(resume_text)
        clean_jd = self.clean_text(jd_text)
        
        if not clean_resume or not clean_jd:
            return 0.0

        vectorizer = TfidfVectorizer(stop_words='english')
        
        try:
            tfidf_matrix = vectorizer.fit_transform([clean_resume, clean_jd])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            # TF-IDF cosine similarity between short/mismatched docs is often artificially low.
            # We scale it slightly for a better visual representation.
            scaled_sim = min(1.0, similarity * 1.5) 
            return round(float(scaled_sim), 4)
        except ValueError:
            # Handles empty vocabulary exceptions
            return 0.0

    def analyze(self, resume_text: str, jd_text: str):
        jd_keywords = self.extract_keywords(jd_text)
        resume_keywords = self.extract_keywords(resume_text)
        
        matched_keywords = list(jd_keywords.intersection(resume_keywords))
        missing_keywords = list(jd_keywords.difference(resume_keywords))
        
        similarity_score = self.calculate_similarity(resume_text, jd_text)
        
        # Base Match Percentage calculation
        hard_match_ratio = len(matched_keywords) / max(len(jd_keywords), 1)
        
        # Formula: 60% hard keyword match, 40% contextual similarity
        overall_score = (hard_match_ratio * 0.6) + (similarity_score * 0.4)
        match_percentage = round(overall_score * 100, 2)
        
        return {
            "match_percentage": match_percentage,
            "matched_keywords": sorted(matched_keywords),
            "missing_keywords": sorted(missing_keywords)
        }

analyzer_instance = NLPAnalyzer()

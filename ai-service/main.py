from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Resume Analyzer NLP Service",
    description="Microservice for extracting text and analyzing compatibility between resumes and job descriptions.",
    version="1.0.0"
)

# Allow requests from Spring Boot backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update this in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "AI Service is running successfully."}

@app.get("/health")
def health_check():
    return {"status": "UP"}

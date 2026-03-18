from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.parser import router as parser_router
from app.api.analyzer import router as analyzer_router
from app.models.schemas import HealthResponse

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

app.include_router(parser_router, prefix="/api/v1/parser", tags=["Parser"])
app.include_router(analyzer_router, prefix="/api/v1/nlp", tags=["NLP Analysis"])

@app.get("/", response_model=HealthResponse)
def read_root():
    return HealthResponse(status="AI Service is running successfully.", version="1.0.0")

@app.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(status="UP", version="1.0.0")

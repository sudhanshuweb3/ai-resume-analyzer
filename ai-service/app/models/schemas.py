from pydantic import BaseModel, ConfigDict
from asgiref.sync import sync_to_async
from typing import Optional, List

class ExtractedTextResponse(BaseModel):
    text: str
    metadata: dict = {}
    
    model_config = ConfigDict(from_attributes=True)

class HealthResponse(BaseModel):
    status: str
    version: str

class AnalysisRequest(BaseModel):
    resume_text: str
    job_description_text: str

class AnalysisResponse(BaseModel):
    match_percentage: float
    matched_keywords: List[str]
    missing_keywords: List[str]
    readability_penalty: int = 0

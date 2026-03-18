from fastapi import APIRouter, HTTPException
from app.models.schemas import AnalysisRequest, AnalysisResponse
from app.core.nlp import analyzer_instance

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_compatibility(payload: AnalysisRequest):
    """
    Endpoint to process resume and job description texts.
    Calculates TF-IDF cosine similarity and extracts tech keywords using spaCy.
    """
    try:
        results = analyzer_instance.analyze(
            resume_text=payload.resume_text,
            jd_text=payload.job_description_text
        )
        
        return AnalysisResponse(
            match_percentage=results["match_percentage"],
            matched_keywords=results["matched_keywords"],
            missing_keywords=results["missing_keywords"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"NLP Analysis failed: {str(e)}")

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import ExtractedTextResponse
from app.core.extractor import extract_text_from_pdf

router = APIRouter()

@router.post("/extract", response_model=ExtractedTextResponse)
async def extract_resume_text(file: UploadFile = File(...)):
    """
    Endpoint to receive a PDF file, extract its text content securely,
    and return the string representation for further NLP processing.
    """
    text = await extract_text_from_pdf(file)
    
    if not text:
        raise HTTPException(status_code=400, detail="Could not extract text from the provided document. It may be an image-based PDF.")

    return ExtractedTextResponse(
        text=text,
        metadata={
            "filename": file.filename,
            "content_type": file.content_type,
            "size": file.size
        }
    )

import io
import fitz # PyMuPDF
from fastapi import UploadFile, HTTPException

async def extract_text_from_pdf(file: UploadFile) -> str:
    if file.content_type not in ["application/pdf"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF is supported for extraction.")

    try:
        # Read file asynchronously
        contents = await file.read()
        
        # Open the PDF with PyMuPDF
        pdf_document = fitz.open(stream=contents, filetype="pdf")
        
        extracted_text = ""
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            extracted_text += page.get_text() + "\n"
            
        pdf_document.close()
        return extracted_text.strip()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text from PDF: {str(e)}")

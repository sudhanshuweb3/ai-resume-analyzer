from pydantic import BaseModel, ConfigDict
from asgiref.sync import sync_to_async
from typing import Optional

class ExtractedTextResponse(BaseModel):
    text: str
    metadata: dict = {}
    
    model_config = ConfigDict(from_attributes=True)

class HealthResponse(BaseModel):
    status: str
    version: str

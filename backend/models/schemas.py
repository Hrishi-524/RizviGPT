from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class ChatRequest(BaseModel):
    query: str = Field(..., description="User's question")
    session_id: Optional[str] = Field(None, description="Session ID for conversation history")
    use_rag: bool = Field(True, description="Whether to use RAG for context")
    
class ChatResponse(BaseModel):
    response: str
    context_used: Optional[str] = None
    session_id: str
    
class IngestRequest(BaseModel):
    data_path: Optional[str] = Field("./data", description="Path to documents")
    
class IngestResponse(BaseModel):
    status: str
    message: str
    documents_processed: int = 0
    
class HealthResponse(BaseModel):
    status: str
    services: Dict[str, bool]
    timestamp: datetime
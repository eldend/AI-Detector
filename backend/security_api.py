from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
from security_log_analyzer import SecurityLogAnalyzer

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 보안 로그 분석기 인스턴스 생성
analyzer = SecurityLogAnalyzer()

class LogEntry(BaseModel):
    timestamp: datetime
    source_ip: str
    destination_ip: str
    event_type: str
    severity: str
    message: str
    user: Optional[str] = None
    protocol: Optional[str] = None
    port: Optional[int] = None
    bytes: Optional[int] = None
    status: Optional[str] = None

class SearchQuery(BaseModel):
    query: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

@app.post("/api/logs")
async def ingest_log(log_entry: LogEntry):
    """새로운 보안 로그를 저장합니다."""
    try:
        response = analyzer.ingest_log("security-logs", log_entry.dict())
        return {"status": "success", "id": response["_id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/logs/search")
async def search_logs(search_query: SearchQuery):
    """보안 로그를 검색합니다."""
    try:
        results = analyzer.search_logs(
            "security-logs",
            search_query.query,
            search_query.start_time,
            search_query.end_time
        )
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/logs/anomalies")
async def get_anomalies():
    """이상 탐지된 로그를 반환합니다."""
    try:
        anomalies = analyzer.detect_anomalies("security-logs")
        return {"anomalies": anomalies}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/metrics")
async def get_metrics():
    """보안 메트릭을 반환합니다."""
    try:
        metrics = analyzer.get_security_metrics("security-logs")
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002) 
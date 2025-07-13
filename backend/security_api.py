from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
from security_log_analyzer import SecurityLogAnalyzer
from elasticsearch_analyzer import TraceAnalyzer
import re

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 분석기 인스턴스 생성
analyzer = SecurityLogAnalyzer()
trace_analyzer = TraceAnalyzer()

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

# ============ TRACE 데이터 API ============

@app.get("/api/trace/status")
async def get_trace_status():
    """Trace 인덱스 상태를 반환합니다."""
    try:
        status = trace_analyzer.check_index_status("trace")
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trace/security-alerts")
async def get_security_alerts():
    """보안 알림이 포함된 trace 데이터를 반환합니다."""
    try:
        # 전체 데이터 가져오기
        data = trace_analyzer.get_all_data("trace", limit=1)
        if not data:
            return {"alerts": [], "total": 0}
        
        source = data[0]['_source']
        spans = source.get('spans', [])
        
        # 보안 알림 추출
        security_alerts = []
        for span in spans:
            span_tags = {tag['key']: tag['value'] for tag in span.get('tags', [])}
            
            if 'sigma.alert' in span_tags:
                alert = {
                    "id": span.get('spanID', ''),
                    "operationName": span.get('operationName', ''),
                    "alert": span_tags.get('sigma.alert', ''),
                    "image": span_tags.get('Image', ''),
                    "commandLine": span_tags.get('CommandLine', ''),
                    "pid": span_tags.get('sysmon.pid', ''),
                    "eventId": span_tags.get('sysmon.event_id', ''),
                    "startTime": span.get('startTime', 0),
                    "duration": span.get('duration', 0),
                    "status": "ERROR" if span_tags.get('error') == True else "OK"
                }
                security_alerts.append(alert)
        
        return {
            "alerts": security_alerts,
            "total": len(security_alerts),
            "traceID": source.get('traceID', '')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trace/metrics")
async def get_trace_metrics():
    """Trace 데이터 메트릭을 반환합니다."""
    try:
        # 전체 데이터 가져오기
        data = trace_analyzer.get_all_data("trace", limit=1)
        if not data:
            return {"error": "No data found"}
        
        source = data[0]['_source']
        spans = source.get('spans', [])
        
        # 메트릭 계산
        total_spans = len(spans)
        security_alerts = 0
        process_events = 0
        file_events = 0
        alert_types = set()
        
        for span in spans:
            span_tags = {tag['key']: tag['value'] for tag in span.get('tags', [])}
            
            if 'sigma.alert' in span_tags:
                security_alerts += 1
                alert_types.add(span_tags['sigma.alert'])
            
            if span_tags.get('sysmon.event_id') == '1':
                process_events += 1
            elif span_tags.get('sysmon.event_id') == '11':
                file_events += 1
        
        return {
            "totalSpans": total_spans,
            "securityAlerts": security_alerts,
            "processEvents": process_events,
            "fileEvents": file_events,
            "alertTypes": len(alert_types),
            "traceID": source.get('traceID', ''),
            "alertTypesList": list(alert_types)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== 전처리 함수 ==========
def clean_cmd(cmd: str) -> str:
    """CommandLine에서 주요 실행 파일만 추출"""
    if isinstance(cmd, str):
        match = re.search(r'([a-zA-Z0-9_-]+\.exe)', cmd)
        return match.group(1) if match else cmd
    return cmd

def get_user_action_description(event: Dict) -> str:
    """사용자 행동 설명 생성 (실행/종료 명시)"""
    event_id = event.get('eventType', '')
    image = event.get('image', '').split('\\')[-1] if event.get('image') else 'unknown'
    
    if event_id == '1':
        return f"{image} 실행"
    elif event_id == '5':
        return f"{image} 종료"
    elif event_id == '11':
        return f"{image} 파일생성"
    else:
        return f"{image} 작업"

@app.get("/api/trace/timeline")
async def get_trace_timeline():
    """Trace 이벤트 타임라인을 반환합니다 (14개 사용자 행동 정확히 추출)."""
    try:
        data = trace_analyzer.get_all_data("trace", limit=1)
        if not data:
            return {"timeline": []}
        
        source = data[0]['_source']
        spans = source.get('spans', [])
        
        # ========== 14개 사용자 행동 정확 추출 로직 시작 ==========
        
        # 1. 스팬들을 처리하여 기본 이벤트 리스트 생성
        all_events = []
        for span in spans:
            span_tags = {tag['key']: tag['value'] for tag in span.get('tags', [])}
            
            # CommandLine 정리
            raw_cmd = span_tags.get('CommandLine', '')
            cleaned_cmd = clean_cmd(raw_cmd)
            
            event = {
                "timestamp": span.get('startTime', 0),
                "operationName": span.get('operationName', ''),
                "eventType": span_tags.get('sysmon.event_id', 'unknown'),
                "image": span_tags.get('Image', ''),
                "hasAlert": 'sigma.alert' in span_tags,
                "alert": span_tags.get('sigma.alert', ''),
                "pid": span_tags.get('sysmon.pid', ''),
                "parentPid": span_tags.get('sysmon.ppid', ''),
                "commandLine": raw_cmd,
                "mainCommand": cleaned_cmd,
                "user": span_tags.get('User', ''),
                "duration": span.get('duration', 0),
                "eventName": span_tags.get('EventName', '')
            }
            all_events.append(event)
        
        # 2. 시간순 정렬
        all_events.sort(key=lambda x: x['timestamp'])
        
        # 3. 프로세스 시작/종료 이벤트만 추출
        process_events = []
        for event in all_events:
            event_id = event['eventType']
            
            # 프로세스 시작 (Event ID 1)
            if event_id == '1':
                event['behaviorDescription'] = get_user_action_description(event)
                process_events.append(event)
            # 프로세스 종료 (Event ID 5)
            elif event_id == '5':
                event['behaviorDescription'] = get_user_action_description(event)
                process_events.append(event)
        
        # 4. PID 기준으로 중복 제거
        final_events = []
        pid_status = {}  # {PID: 현재상태}
        
        for event in process_events:
            event_id = event['eventType']
            pid = event.get('pid', '')
            
            if not pid:  # PID가 없으면 건너뛰기
                continue
                
            current_status = pid_status.get(pid, '종료됨')
            
            if event_id == '1':  # 프로세스 시작
                if current_status == '종료됨':
                    final_events.append(event)
                    pid_status[pid] = '실행중'
            elif event_id == '5':  # 프로세스 종료
                if current_status == '실행중':
                    final_events.append(event)
                    pid_status[pid] = '종료됨'
        
        print(f"🔄 14개 사용자 행동 정확 추출 결과:")
        print(f"  - 전체 이벤트: {len(all_events)}개")
        print(f"  - 프로세스 이벤트: {len(process_events)}개")
        print(f"  - 최종 사용자 행동: {len(final_events)}개")
        
        # 프로세스별 통계
        process_counts = {}
        for event in final_events:
            image = event.get('image', '').split('\\')[-1]
            process_counts[image] = process_counts.get(image, 0) + 1
        
        print(f"  - 프로세스별 행동 수: {process_counts}")
        
        # 사용자 행동 시퀀스 출력
        print("📋 최종 사용자 행동 시퀀스:")
        for i, event in enumerate(final_events):
            print(f"  {i+1}. {event.get('behaviorDescription', 'Unknown')}")
        
        # ========== 14개 사용자 행동 정확 추출 로직 끝 ==========
        
        return {"timeline": final_events}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trace/process-tree")
async def get_process_tree():
    """프로세스 트리 구조를 반환합니다."""
    try:
        data = trace_analyzer.get_all_data("trace", limit=1)
        if not data:
            return {"processes": []}
        
        source = data[0]['_source']
        spans = source.get('spans', [])
        
        # 프로세스별 정보 수집
        processes = {}
        for span in spans:
            span_tags = {tag['key']: tag['value'] for tag in span.get('tags', [])}
            
            if span_tags.get('sysmon.event_id') == '1':  # Process creation event
                pid = span_tags.get('sysmon.pid', '')
                ppid = span_tags.get('sysmon.ppid', '')
                
                process_info = {
                    "pid": pid,
                    "ppid": ppid,
                    "image": span_tags.get('Image', ''),
                    "commandLine": span_tags.get('CommandLine', ''),
                    "startTime": span.get('startTime', 0),
                    "hasAlert": 'sigma.alert' in span_tags,
                    "alert": span_tags.get('sigma.alert', ''),
                    "children": []
                }
                processes[pid] = process_info
        
        return {"processes": list(processes.values())}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002) 
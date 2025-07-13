from elasticsearch import Elasticsearch
import json
import pandas as pd
from datetime import datetime
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class TraceAnalyzer:
    def __init__(self, hosts=None, username=None, password=None):
        """Elasticsearch 클라이언트를 초기화합니다."""
        # 환경변수에서 설정 가져오기
        if not hosts:
            hosts = [os.getenv('ELASTICSEARCH_HOST', 'https://localhost:9200')]
        if not username:
            username = os.getenv('ELASTICSEARCH_USERNAME')
        if not password:
            password = os.getenv('ELASTICSEARCH_PASSWORD')
        
        if username and password:
            self.client = Elasticsearch(
                hosts=hosts,
                basic_auth=(username, password),
                verify_certs=False,
                ssl_show_warn=False
            )
        else:
            self.client = Elasticsearch(
                hosts=hosts,
                verify_certs=False,
                ssl_show_warn=False
            )
        
    def check_index_status(self, index_name: str) -> Dict:
        """인덱스 상태를 확인합니다."""
        try:
            # 인덱스 존재 여부 확인
            if not self.client.indices.exists(index=index_name):
                return {"status": "error", "message": f"인덱스 '{index_name}'이 존재하지 않습니다."}
            
            # 인덱스 정보 가져오기
            index_info = self.client.indices.get(index=index_name)
            doc_count = self.client.count(index=index_name)
            
            return {
                "status": "success",
                "index_name": index_name,
                "document_count": doc_count['count'],
                "index_info": index_info
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def search_security_alerts(self, index_name: str, limit: int = 100) -> List[Dict]:
        """보안 알림이 포함된 이벤트를 검색합니다."""
        query = {
            "query": {
                "nested": {
                    "path": "spans",
                    "query": {
                        "bool": {
                            "must": [
                                {"nested": {
                                    "path": "spans.tags",
                                    "query": {
                                        "bool": {
                                            "must": [
                                                {"term": {"spans.tags.key": "sigma.alert"}},
                                                {"exists": {"field": "spans.tags.value"}}
                                            ]
                                        }
                                    }
                                }}
                            ]
                        }
                    }
                }
            },
            "size": limit
        }
        
        try:
            response = self.client.search(index=index_name, body=query)
            return response['hits']['hits']
        except Exception as e:
            print(f"검색 오류: {e}")
            return []
    
    def get_all_data(self, index_name: str, limit: int = 10) -> List[Dict]:
        """모든 데이터를 가져와서 구조를 확인합니다."""
        query = {
            "query": {"match_all": {}},
            "size": limit
        }
        
        try:
            response = self.client.search(index=index_name, body=query)
            return response['hits']['hits']
        except Exception as e:
            print(f"검색 오류: {e}")
            return []
    
    def get_process_events(self, index_name: str, limit: int = 100) -> List[Dict]:
        """프로세스 생성 이벤트를 검색합니다."""
        # 우선 간단한 쿼리로 테스트
        query = {
            "query": {"match_all": {}},
            "size": limit
        }
        
        try:
            response = self.client.search(index=index_name, body=query)
            return response['hits']['hits']
        except Exception as e:
            print(f"검색 오류: {e}")
            return []
    
    def get_file_events(self, index_name: str, limit: int = 100) -> List[Dict]:
        """파일 생성 이벤트를 검색합니다."""
        query = {
            "query": {
                "bool": {
                    "must": [
                        {"term": {"tags.sysmon.event_id": 11}},
                        {"match": {"operationName": "evt:11"}}
                    ]
                }
            },
            "sort": [
                {"startTime": {"order": "desc"}}
            ],
            "size": limit
        }
        
        try:
            response = self.client.search(index=index_name, body=query)
            return response['hits']['hits']
        except Exception as e:
            print(f"검색 오류: {e}")
            return []
    
    def analyze_security_patterns(self, index_name: str) -> Dict:
        """보안 패턴을 분석합니다."""
        # 보안 알림 유형별 집계
        alert_agg_query = {
            "aggs": {
                "alert_types": {
                    "terms": {
                        "field": "tags.sigma.alert.keyword",
                        "size": 10
                    }
                },
                "process_images": {
                    "terms": {
                        "field": "tags.Image.keyword",
                        "size": 10
                    }
                }
            },
            "size": 0
        }
        
        try:
            response = self.client.search(index=index_name, body=alert_agg_query)
            return {
                "alert_types": response['aggregations']['alert_types']['buckets'],
                "process_images": response['aggregations']['process_images']['buckets']
            }
        except Exception as e:
            print(f"분석 오류: {e}")
            return {}
    
    def search_by_process_id(self, index_name: str, process_id: int) -> List[Dict]:
        """특정 프로세스 ID의 모든 이벤트를 검색합니다."""
        query = {
            "query": {
                "term": {"tags.sysmon.pid": process_id}
            },
            "sort": [
                {"startTime": {"order": "asc"}}
            ]
        }
        
        try:
            response = self.client.search(index=index_name, body=query)
            return response['hits']['hits']
        except Exception as e:
            print(f"검색 오류: {e}")
            return []
            
    def get_timeline_analysis(self, index_name: str) -> Dict:
        """시간대별 이벤트 분석을 수행합니다."""
        query = {
            "aggs": {
                "events_over_time": {
                    "date_histogram": {
                        "field": "startTime",
                        "calendar_interval": "1s",
                        "format": "yyyy-MM-dd HH:mm:ss"
                    },
                    "aggs": {
                        "event_types": {
                            "terms": {
                                "field": "tags.sysmon.event_id"
                            }
                        }
                    }
                }
            },
            "size": 0
        }
        
        try:
            response = self.client.search(index=index_name, body=query)
            return response['aggregations']['events_over_time']['buckets']
        except Exception as e:
            print(f"분석 오류: {e}")
            return {} 
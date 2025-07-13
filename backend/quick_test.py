#!/usr/bin/env python3
"""
Elasticsearch 연결 및 기본 데이터 확인을 위한 간단한 테스트 스크립트
"""

from elasticsearch import Elasticsearch
import json
import os
from dotenv import load_dotenv

load_dotenv()

def test_elasticsearch_connection():
    """Elasticsearch 연결 테스트"""
    print("=== Elasticsearch 연결 테스트 ===")
    
    # 환경변수에서 설정 가져오기
    host = os.getenv('ELASTICSEARCH_HOST', 'https://localhost:9200')
    username = os.getenv('ELASTICSEARCH_USERNAME')
    password = os.getenv('ELASTICSEARCH_PASSWORD')
    
    try:
        # Elasticsearch 클라이언트 생성
        if username and password:
            client = Elasticsearch(
                [host],
                basic_auth=(username, password),
                verify_certs=False,  # SSL 인증서 검증 비활성화 (개발 환경용)
                ssl_show_warn=False  # SSL 경고 메시지 숨기기
            )
        else:
            client = Elasticsearch(
                [host],
                verify_certs=False,
                ssl_show_warn=False
            )
        
        # 클러스터 상태 확인
        health = client.cluster.health()
        print(f"✓ 클러스터 상태: {health['status']}")
        print(f"✓ 노드 수: {health['number_of_nodes']}")
        
        # 인덱스 목록 확인
        indices = client.cat.indices(format='json')
        print(f"\n=== 인덱스 목록 ===")
        
        if indices:
            for index in indices:
                print(f"- {index['index']}: {index['docs.count']} 문서")
        else:
            print("인덱스가 없습니다.")
            
        return client, True
        
    except Exception as e:
        print(f"✗ 연결 실패: {e}")
        return None, False

def find_trace_indices(client):
    """trace 관련 인덱스 찾기"""
    print(f"\n=== trace 관련 인덱스 검색 ===")
    
    try:
        indices = client.cat.indices(format='json')
        trace_indices = []
        
        for index in indices:
            index_name = index['index']
            if 'trace' in index_name.lower() or 'log' in index_name.lower():
                trace_indices.append(index_name)
                print(f"발견: {index_name} ({index['docs.count']} 문서)")
        
        return trace_indices
        
    except Exception as e:
        print(f"검색 실패: {e}")
        return []

def test_sample_data(client, index_name):
    """샘플 데이터 확인"""
    print(f"\n=== '{index_name}' 샘플 데이터 확인 ===")
    
    try:
        # 첫 번째 문서 가져오기
        query = {
            "query": {"match_all": {}},
            "size": 1
        }
        
        response = client.search(index=index_name, body=query)
        
        if response['hits']['total']['value'] > 0:
            first_doc = response['hits']['hits'][0]['_source']
            print(f"✓ 총 문서 수: {response['hits']['total']['value']}")
            print(f"✓ 첫 번째 문서 구조:")
            
            # 주요 필드 확인
            if isinstance(first_doc, dict):
                for key in list(first_doc.keys())[:5]:  # 처음 5개 필드만 표시
                    value = first_doc[key]
                    if isinstance(value, (str, int, float, bool)):
                        print(f"  - {key}: {value}")
                    else:
                        print(f"  - {key}: {type(value)} (복잡한 구조)")
            
            # 보안 관련 필드 확인
            print(f"\n✓ 보안 관련 필드 확인:")
            if 'tags' in first_doc:
                tags = first_doc['tags']
                if isinstance(tags, list):
                    for tag in tags[:3]:  # 처음 3개 태그만 표시
                        if isinstance(tag, dict) and 'key' in tag:
                            print(f"  - {tag.get('key')}: {tag.get('value')}")
            
        else:
            print("문서가 없습니다.")
            
    except Exception as e:
        print(f"데이터 확인 실패: {e}")

def main():
    """메인 함수"""
    print("Elasticsearch 빠른 테스트 시작")
    
    # 1. 연결 테스트
    client, connected = test_elasticsearch_connection()
    if not connected:
        print("Elasticsearch에 연결할 수 없습니다. 서비스가 실행 중인지 확인하세요.")
        return
    
    # 2. trace 인덱스 찾기
    trace_indices = find_trace_indices(client)
    
    if not trace_indices:
        print("\ntrace 관련 인덱스를 찾을 수 없습니다.")
        print("trace.json 파일을 업로드했는지 확인하세요.")
        return
    
    # 3. 샘플 데이터 확인
    for index_name in trace_indices[:2]:  # 처음 2개 인덱스만 테스트
        test_sample_data(client, index_name)
    
    print(f"\n=== 테스트 완료 ===")
    print("다음 단계:")
    print("1. analyze_trace_data.py 스크립트에서 인덱스 이름을 수정하세요")
    if trace_indices:
        print(f"   index_name = '{trace_indices[0]}'")
    print("2. python analyze_trace_data.py 를 실행하세요")

if __name__ == "__main__":
    main() 
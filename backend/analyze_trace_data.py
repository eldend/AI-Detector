#!/usr/bin/env python3
"""
Elasticsearch에 업로드된 trace 데이터를 분석하는 스크립트
"""

from elasticsearch_analyzer import TraceAnalyzer
import json
import pandas as pd
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

def main():
    # Elasticsearch 연결 (환경변수에서 설정 가져오기)
    analyzer = TraceAnalyzer()
    
    # 인덱스 이름 (실제 사용한 인덱스 이름으로 변경하세요)
    index_name = "trace"  # 실제 발견된 인덱스 이름
    
    print("=== Trace 데이터 분석 시작 ===")
    
    # 1. 인덱스 상태 확인
    print("\n1. 인덱스 상태 확인:")
    status = analyzer.check_index_status(index_name)
    if status["status"] == "success":
        print(f"   ✓ 인덱스: {status['index_name']}")
        print(f"   ✓ 문서 개수: {status['document_count']}")
    else:
        print(f"   ✗ 오류: {status['message']}")
        return
    
    # 2. 실제 데이터 구조 확인
    print("\n2. 실제 데이터 구조 확인:")
    all_data = analyzer.get_all_data(index_name, limit=1)
    if all_data:
        source = all_data[0]['_source']
        print(f"   ✓ 데이터 구조:")
        print(f"      - traceID: {source.get('traceID', 'N/A')}")
        print(f"      - spans 개수: {len(source.get('spans', []))}")
        
        if source.get('spans'):
            first_span = source['spans'][0]
            print(f"      - 첫 번째 span:")
            print(f"        * operationName: {first_span.get('operationName', 'N/A')}")
            print(f"        * tags 개수: {len(first_span.get('tags', []))}")
            
            # 보안 관련 태그 찾기
            security_tags = []
            for tag in first_span.get('tags', []):
                if 'sigma' in tag.get('key', '').lower() or 'alert' in tag.get('key', '').lower():
                    security_tags.append(f"{tag['key']}: {tag['value']}")
            
            if security_tags:
                print(f"        * 보안 관련 태그:")
                for tag in security_tags[:3]:
                    print(f"          - {tag}")
    else:
        print("   ✗ 데이터를 가져올 수 없습니다.")
    
    # 3. spans 분석
    print("\n3. spans 분석:")
    if all_data and all_data[0]['_source'].get('spans'):
        spans = all_data[0]['_source']['spans']
        print(f"   총 {len(spans)}개의 span 발견")
        
        security_spans = []
        for span in spans:
            for tag in span.get('tags', []):
                if 'sigma.alert' in tag.get('key', ''):
                    security_spans.append({
                        'operationName': span.get('operationName', 'N/A'),
                        'alert': tag.get('value', 'N/A'),
                        'span': span
                    })
        
        if security_spans:
            print(f"\n   보안 알림이 있는 span: {len(security_spans)}개")
            for i, sec_span in enumerate(security_spans[:3], 1):
                print(f"   {i}. {sec_span['operationName']}")
                print(f"      알림: {sec_span['alert']}")
                
                # 추가 정보 추출
                span_tags = {tag['key']: tag['value'] for tag in sec_span['span'].get('tags', [])}
                image = span_tags.get('Image', 'N/A')
                command_line = span_tags.get('CommandLine', 'N/A')
                if image != 'N/A':
                    print(f"      프로세스: {image}")
                if command_line != 'N/A':
                    print(f"      명령줄: {command_line[:80]}...")
        else:
            print("   보안 알림이 있는 span을 찾을 수 없습니다.")
    
    # 4. 전체 태그 분석
    print("\n4. 전체 태그 분석:")
    if all_data and all_data[0]['_source'].get('spans'):
        all_tags = {}
        for span in all_data[0]['_source']['spans']:
            for tag in span.get('tags', []):
                key = tag.get('key', '')
                if key not in all_tags:
                    all_tags[key] = []
                all_tags[key].append(tag.get('value', ''))
        
        print(f"   발견된 태그 유형: {len(all_tags)}개")
        
        # 중요한 태그들 표시
        important_tags = ['sigma.alert', 'Image', 'CommandLine', 'sysmon.event_id', 'sysmon.pid']
        for tag_key in important_tags:
            if tag_key in all_tags:
                values = list(set(all_tags[tag_key]))  # 중복 제거
                print(f"   - {tag_key}: {len(values)}개 값")
                for value in values[:3]:  # 처음 3개만 표시
                    print(f"     * {value}")
    
    # 5-6번은 잠시 주석 처리
    print("\n5-6. 고급 분석 기능은 데이터 구조 파악 후 구현 예정")
    
    print("\n=== 분석 완료 ===")
    print("\n다음 단계 제안:")
    print("1. Kibana 대시보드 생성으로 시각화")
    print("2. 보안 알림 모니터링 시스템 구축")
    print("3. 특정 프로세스 트레이스 분석")
    print("4. 이상 행위 탐지 알고리즘 적용")

if __name__ == "__main__":
    main() 
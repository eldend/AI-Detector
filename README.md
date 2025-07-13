# AI-Detector 🔍

실시간 보안 위협 탐지 및 시각화 시스템

## 📋 프로젝트 개요

AI-Detector는 Sysmon ETW (Event Tracing for Windows) 데이터를 실시간으로 분석하여 보안 위협을 탐지하고 시각화하는 종합 보안 솔루션입니다. Sigma 규칙을 기반으로 악성 행위를 탐지하고, React Flow를 통해 프로세스 트리와 보안 이벤트를 직관적으로 시각화합니다.

## 🛠️ 기술 스택

### Backend

- **Python FastAPI** - 고성능 API 서버
- **Elasticsearch** - 보안 데이터 저장 및 검색
- **Pandas** - 데이터 분석 및 전처리
- **Uvicorn** - ASGI 서버

### Frontend

- **Next.js 14** - React 풀스택 프레임워크
- **React Flow** - 인터랙티브 노드 그래프 시각화
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **TypeScript** - 타입 안전성

### 데이터베이스

- **Elasticsearch Cloud** - 확장 가능한 검색 엔진
- **Index**: `trace` - Sysmon ETW 데이터 저장

## 🚀 주요 기능

### 🔒 보안 위협 탐지

- **Sigma 규칙 기반** 악성 행위 탐지
- **실시간 이벤트 분석** (프로세스 생성, 파일 접근, 네트워크 연결)
- **18개 보안 알림** 자동 분류 및 우선순위 지정

### 📊 데이터 시각화

- **React Flow** 기반 프로세스 트리 시각화
- **시간대별 타임라인** 표시
- **보안 알림 상세 정보** 패널

### ⚡ 성능 최적화

- **데이터 전처리** - 70개 이벤트 → 15개 핵심 이벤트 필터링
- **캐싱 시스템** - 30초 캐시로 API 호출 최적화
- **AbortController** - 중복 요청 방지

## 📁 프로젝트 구조

```
AI-Detector/
├── backend/                    # Python FastAPI 백엔드
│   ├── security_api.py        # 메인 API 서버
│   ├── elasticsearch_analyzer.py  # Elasticsearch 분석 클래스
│   ├── analyze_trace_data.py  # 데이터 분석 스크립트
│   ├── .env                   # 환경 변수 (Elasticsearch 연결)
│   └── requirements.txt       # Python 의존성
├── frontend/                   # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/
│   │   │   ├── events/        # 이벤트 시각화 페이지
│   │   │   └── api/traces/    # 프론트엔드 API 라우트
│   │   ├── components/        # React 컴포넌트
│   │   └── lib/              # 유틸리티 함수
│   ├── package.json          # Node.js 의존성
│   └── next.config.js        # Next.js 설정
├── trace.json                 # 샘플 Sysmon ETW 데이터
└── README.md                 # 프로젝트 문서
```

## 🔧 설치 및 실행

### 1. 사전 요구사항

- Python 3.8+
- Node.js 18+
- Elasticsearch Cloud 계정

### 2. 백엔드 설정

```bash
# 백엔드 디렉토리로 이동
cd backend

# 가상환경 생성 및 활성화
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
# .env 파일 생성하고 다음 내용 추가:
ELASTICSEARCH_HOST=https://your-elasticsearch-url:443
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=your-password

# 서버 실행
python -m uvicorn security_api:app --reload --host 0.0.0.0 --port 8002
```

### 3. 프론트엔드 설정

```bash
# 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 4. 데이터 로드

```bash
# trace.json 데이터를 Elasticsearch에 로드
cd backend
python analyze_trace_data.py
```

## 🔍 API 엔드포인트

### 백엔드 API (Port 8002)

- `GET /api/trace/status` - 인덱스 상태 확인
- `GET /api/trace/security-alerts` - 보안 알림 목록
- `GET /api/trace/metrics` - 메트릭 통계
- `GET /api/trace/timeline` - 시간대별 이벤트 (전처리 적용)
- `GET /api/trace/process-tree` - 프로세스 트리 구조

### 프론트엔드 API (Port 3000)

- `GET /api/traces` - React Flow용 변환된 데이터

## 🛡️ 보안 탐지 규칙

### 탐지되는 위협 유형

1. **Suspicious LNK Command-Line Padding** - 악성 링크 파일
2. **Non Interactive PowerShell Process Spawned** - 비대화형 PowerShell 실행
3. **PSScriptPolicyTest Creation By Uncommon Process** - 스크립트 정책 우회 시도
4. **Potential CommandLine Path Traversal** - 경로 순회 공격
5. **기타 15개 Sigma 규칙**

## 📈 성능 지표

### 데이터 전처리 효과

- **원본 데이터**: 70개 Sysmon 이벤트
- **전처리 후**: 15개 핵심 이벤트 (78% 감소)
- **렌더링 성능**: 3-5배 향상

### 시스템 요구사항

- **메모리**: 최소 4GB RAM
- **CPU**: 2코어 이상 권장
- **네트워크**: Elasticsearch Cloud 연결

## 🔧 개발 가이드

### 전처리 로직 수정

백엔드의 `security_api.py`에서 `get_trace_timeline()` 함수를 수정하여 필터링 규칙을 조정할 수 있습니다.

### 새로운 시각화 추가

프론트엔드의 `/events` 페이지에서 React Flow 컴포넌트를 확장하여 새로운 시각화를 추가할 수 있습니다.

### 캐시 설정 변경

프론트엔드 API에서 30초 캐시 시간을 조정하려면 `next: { revalidate: 30 }`를 수정하세요.

## 🐛 문제 해결

### 캐시 문제

브라우저에서 `Ctrl+F5` 또는 개발자 도구의 "Disable cache" 옵션을 사용하여 캐시를 무시하세요.

### Elasticsearch 연결 오류

`.env` 파일의 연결 정보를 확인하고, 클라우드 인스턴스가 활성화되어 있는지 확인하세요.

### 포트 충돌

백엔드는 8002, 프론트엔드는 3000 포트를 사용합니다. 포트가 사용 중인 경우 다른 포트로 변경하세요.

## 🤝 기여 방법

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 📧 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해주세요.

---

**🔥 Python FastAPI를 선택한 이유:**

- Elasticsearch Python 클라이언트의 완벽한 호환성
- 보안 데이터 분석에 최적화된 pandas, numpy 라이브러리
- 빠른 개발 속도와 자동 API 문서 생성
- 높은 성능과 확장성

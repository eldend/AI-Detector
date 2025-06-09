# AI 악성프로세스 탐지 시스템

Next.js와 Spring Boot를 사용한 AI 악성프로세스 탐지 시스템입니다.

## 프로젝트 구조

```
ai-detector-project/
├── frontend/                # Next.js 프론트엔드
│   ├── public/              # 정적 파일
│   ├── src/
│   │   ├── app/             # Next.js 앱 라우터
│   │   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── hooks/           # 커스텀 훅
│   │   ├── lib/             # 유틸리티 함수
│   │   ├── services/        # API 서비스
│   │   └── types/           # TypeScript 타입 정의
│   ├── package.json
│   └── tsconfig.json
│
└── backend/                 # Spring Boot 백엔드
    ├── src/
    │   ├── main/
    │   │   ├── java/com/aidetector/
    │   │   │   ├── config/          # 설정 클래스
    │   │   │   ├── controller/      # REST 컨트롤러
    │   │   │   ├── dto/             # 데이터 전송 객체
    │   │   │   ├── model/           # 엔티티 모델
    │   │   │   ├── repository/      # 데이터 액세스 레이어
    │   │   │   ├── service/         # 비즈니스 로직
    │   │   │   └── AiDetectorApplication.java
    │   │   └── resources/
    │   │       ├── application.properties
    │   │       └── static/          # 정적 리소스
    │   └── test/                    # 테스트 코드
    ├── pom.xml
    └── README.md
```

## 기술 스택

### 프론트엔드
- Next.js 14 (React 프레임워크)
- TypeScript
- Tailwind CSS (스타일링)
- Chart.js (데이터 시각화)
- Framer Motion (애니메이션)

### 백엔드
- Spring Boot 3.2
- Java 17
- Spring Data JPA
- H2 Database (개발용)
- Spring Security
- RESTful API

## 실행 방법

### 백엔드 실행

1. 백엔드 디렉토리로 이동합니다.
   ```bash
   cd backend
   ```

2. Maven을 사용하여 프로젝트를 빌드합니다.
   ```bash
   ./mvnw clean install
   ```

3. Spring Boot 애플리케이션을 실행합니다.
   ```bash
   ./mvnw spring-boot:run
   ```

4. 백엔드 서버가 http://localhost:8080 에서 실행됩니다.

### 프론트엔드 실행

1. 프론트엔드 디렉토리로 이동합니다.
   ```bash
   cd frontend
   ```

2. 필요한 패키지를 설치합니다.
   ```bash
   npm install
   ```

3. 개발 서버를 실행합니다.
   ```bash
   npm run dev
   ```

4. 프론트엔드 서버가 http://localhost:3000 에서 실행됩니다.

## 주요 기능

### 대시보드
- 실시간 이벤트 모니터링
- 이상행위 탐지 통계 및 시각화
- 이벤트 타임라인 표시

### 이벤트 관리
- 이벤트 목록 조회 및 필터링
- 이벤트 상세 정보 확인
- 이벤트 처리 상태 관리

### 이상행위 탐지
- 머신러닝 기반 이상행위 탐지
- 이상행위 점수 계산 및 표시
- 임계값 설정 및 알림 기능

## API 엔드포인트

### 이벤트 API
- `GET /api/events`: 모든 이벤트 조회
- `GET /api/events/{id}`: 특정 이벤트 상세 정보 조회
- `GET /api/events/stats`: 이벤트 통계 정보 조회


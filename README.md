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
│   │   ├── context/         # React Context
│   │   ├── lib/             # 유틸리티 함수
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
    │   │   │   ├── security/        # 보안 관련 클래스
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
- Axios (HTTP 클라이언트)

### 백엔드

- Spring Boot 3.2
- Java 17
- Spring Data JPA
- MySQL Database
- Spring Security
- JWT 인증
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

### 인증 및 보안

- JWT 기반 인증
- 사용자 로그인/회원가입
- 보안된 API 엔드포인트

### 대시보드

- 실시간 이벤트 모니터링
- 이상행위 탐지 통계 및 시각화
- 이벤트 타임라인 표시

### 이벤트 관리

- 이벤트 목록 조회 및 필터링
- 이벤트 상세 정보 확인
- 이벤트 처리 상태 관리

## API 엔드포인트

### 인증 API

- `POST /api/auth/signin`: 사용자 로그인
- `POST /api/auth/signup`: 사용자 회원가입

### 이벤트 API

- `GET /api/events`: 모든 이벤트 조회
- `GET /api/events/{id}`: 특정 이벤트 상세 정보 조회
- `GET /api/events/stats`: 이벤트 통계 정보 조회

## 최근 업데이트

### 2024-06-15

- JWT 인증 시스템 구현
- 사용자 인증 및 권한 관리 추가
- 채팅 기능 제거
- 프론트엔드 보안 강화
- API 요청 인터셉터 구현

### 2024-06-14

- 프로젝트 초기 설정
- 기본 구조 구현
- 데이터베이스 연동
- 기본 UI 구현

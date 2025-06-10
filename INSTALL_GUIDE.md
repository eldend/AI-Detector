# AI 악성프로세스 탐지 시스템 설치 및 실행 가이드

이 문서는 AI 악성프로세스 탐지 시스템을 로컬 환경에 설치하고 실행하는 방법을 단계별로 안내합니다.

## 목차

1. [필수 요구사항](#필수-요구사항)
2. [프로젝트 구조](#프로젝트-구조)
3. [VSCode 환경 설정](#vscode-환경-설정)
4. [프론트엔드 설정 및 실행](#프론트엔드-설정-및-실행)
5. [백엔드 설정 및 실행](#백엔드-설정-및-실행)
6. [전체 시스템 실행](#전체-시스템-실행)
7. [문제 해결](#문제-해결)

## 필수 요구사항

프로젝트를 실행하기 위해 다음 소프트웨어가 필요합니다:

- **Node.js**: v14.0.0 이상 (v16 이상 권장)
- **npm**: v6.0.0 이상
- **Java**: JDK 11 이상
- **Maven**: v3.6.0 이상 (백엔드 빌드용)
- **Git**: 최신 버전
- **VSCode**: 최신 버전 (권장 에디터)

### 설치 확인

다음 명령어로 필요한 소프트웨어가 올바르게 설치되었는지 확인할 수 있습니다:

```bash
node -v
npm -v
java -version
mvn -v
git --version
```

## 프로젝트 구조

프로젝트는 다음과 같은 구조로 구성되어 있습니다:

```
ai-detector-system/
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
    └── pom.xml
```

## VSCode 환경 설정

### 1. VSCode 설치

[VSCode 공식 웹사이트](https://code.visualstudio.com/)에서 운영체제에 맞는 버전을 다운로드하여 설치합니다.

### 2. 권장 확장 프로그램 설치

VSCode에서 다음 확장 프로그램을 설치하는 것을 권장합니다:

- **ESLint**: JavaScript/TypeScript 코드 검사
- **Prettier**: 코드 포맷팅
- **JavaScript and TypeScript Nightly**: JavaScript/TypeScript 지원
- **Spring Boot Extension Pack**: Spring Boot 개발 지원
- **Java Extension Pack**: Java 개발 지원
- **Tailwind CSS IntelliSense**: Tailwind CSS 지원

확장 프로그램은 VSCode의 왼쪽 사이드바에서 확장 아이콘을 클릭하여 설치할 수 있습니다.

### 3. 프로젝트 열기

1. VSCode를 실행합니다.
2. `File > Open Folder`를 선택합니다.
3. 압축을 푼 프로젝트 폴더를 선택합니다.

### 4. 작업 영역 설정 (선택 사항)

프론트엔드와 백엔드를 함께 작업하기 위한 작업 영역을 설정할 수 있습니다:

1. `File > Add Folder to Workspace`를 선택합니다.
2. 프론트엔드 폴더를 추가합니다.
3. 다시 `File > Add Folder to Workspace`를 선택합니다.
4. 백엔드 폴더를 추가합니다.
5. `File > Save Workspace As...`를 선택하여 작업 영역을 저장합니다.

## 프론트엔드 설정 및 실행

### 1. 의존성 설치

프론트엔드 디렉토리로 이동하여 필요한 패키지를 설치합니다:

```bash
cd frontend
npm install
```

### 2. 개발 서버 실행

개발 모드로 프론트엔드 서버를 실행합니다:

```bash
npm run dev
```

서버가 성공적으로 시작되면 `http://localhost:3000`에서 애플리케이션에 접근할 수 있습니다.

### 3. 프론트엔드 빌드 (배포용)

프로덕션 환경을 위한 최적화된 빌드를 생성합니다:

```bash
npm run build
```

빌드된 파일은 `.next` 디렉토리에 생성됩니다.

### 4. 프로덕션 서버 실행

빌드된 애플리케이션을 실행합니다:

```bash
npm start
```

## 백엔드 설정 및 실행

### 1. Maven 래퍼 확인

백엔드 디렉토리로 이동하여 Maven 래퍼가 실행 가능한지 확인합니다:

```bash
cd backend
chmod +x mvnw    # Linux/Mac 환경에서만 필요
```

### 2. 의존성 설치 및 빌드

Maven을 사용하여 프로젝트를 빌드합니다:

```bash
./mvnw clean install -DskipTests    # Linux/Mac
# 또는
mvnw.cmd clean install -DskipTests  # Windows
```

### 3. 백엔드 서버 실행

Spring Boot 애플리케이션을 실행합니다:

```bash
./mvnw spring-boot:run    # Linux/Mac
# 또는
mvnw.cmd spring-boot:run  # Windows
```

서버가 성공적으로 시작되면 `http://localhost:8080`에서 API에 접근할 수 있습니다.

## 전체 시스템 실행

### 1. 백엔드 서버 먼저 실행

첫 번째 터미널에서:

```bash
cd backend
./mvnw spring-boot:run    # Linux/Mac
# 또는
mvnw.cmd spring-boot:run  # Windows
```

### 2. 프론트엔드 서버 실행

두 번째 터미널에서:

```bash
cd frontend
npm run dev
```

### 3. 애플리케이션 접속

웹 브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 사용할 수 있습니다.

## 문제 해결

### 프론트엔드 관련 문제

1. **모듈을 찾을 수 없음 오류**
   ```
   npm install
   ```
   명령을 다시 실행하여 모든 의존성이 올바르게 설치되었는지 확인합니다.

2. **포트 충돌**
   ```
   PORT=3001 npm run dev
   ```
   다른 포트를 지정하여 실행합니다.

### 백엔드 관련 문제

1. **Java 버전 오류**
   
   `pom.xml` 파일에서 Java 버전을 설치된 버전과 일치하도록 수정합니다:
   ```xml
   <properties>
       <java.version>11</java.version>
   </properties>
   ```

2. **포트 충돌**
   
   `application.properties` 파일에서 서버 포트를 변경합니다:
   ```
   server.port=8081
   ```

3. **데이터베이스 연결 오류**
   
   기본적으로 H2 인메모리 데이터베이스를 사용하므로 별도의 데이터베이스 설정이 필요하지 않습니다. 문제가 발생하면 `application.properties` 파일의 데이터베이스 설정을 확인하세요.

---


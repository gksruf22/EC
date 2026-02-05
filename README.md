# EC Project

## 기술 스택 (Tech Stack)

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot
- **Build Tool**: Gradle
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA
- **Security**: Spring Security, OAuth2 Client

### Frontend
- **Language**: TypeScript
- **Framework**: React
- **Build Tool**: Vite
- **Libraries**: React Router Dom, Axios, React Icons, ESLint

### Database & Environment
- **Docker**: 데이터베이스 환경 구성을 위해 Docker Compose 사용

## 프로젝트 구조 (Project Structure)

```
EC
├── backend/            # Spring Boot 백엔드 소스 코드
│   ├── src/
│   │   ├── main/java/com/EC/backend/
│   │   │   ├── controller/     # API 컨트롤러
│   │   │   ├── domain/         # 엔티티 (Member, Application 등)
│   │   │   ├── dto/            # 데이터 전송 객체
│   │   │   ├── repository/     # 데이터 접근 계층
│   │   │   ├── service/        # 비즈니스 로직
│   │   │   └── config/         # 설정 (Security 등)
│   │   └── resources/
│   │       └── application*.properties # 설정 파일
│   ├── build.gradle
│   └── docker-compose.yml
├── frontend/           # React + TypeScript 프론트엔드 소스 코드
└── .gitignore          # Git 제외 파일 설정
```

## 시작하기 (Getting Started)

### 1. 사전 요구사항 (Prerequisites)
- Java 17 이상
- Docker & Docker Compose

### 2. 데이터베이스 실행 (Run Database)
`backend` 디렉토리로 이동하여 Docker Compose를 통해 MySQL을 실행

```bash
cd backend
docker-compose up -d
```
* 기본적으로 `3306` 포트에서 실행되며, 데이터베이스 이름은 `ec_db`입니다.
* 설정 정보는 `backend/src/main/resources/application-dev.properties` 및 `docker-compose.yml`에서 확인할 수 있습니다.

### 3. 애플리케이션 실행 (Run Application)
데이터베이스가 실행된 상태에서 애플리케이션 시작

```bash
./gradlew bootRun
```
* 기본적으로 `dev` 프로필이 활성화되어 있습니다 (`application.properties` 참조).

### 4. 프론트엔드 실행 (Run Frontend)
`frontend` 디렉토리로 이동하여 의존성을 설치하고 개발 서버를 실행

```bash
cd frontend
npm install
npm run dev
```
* 기본적으로 `5173` 포트에서 실행됩니다 (`http://localhost:5173`).

## 주요 기능 (Features)
- **회원 관리**: 회원 가입 및 정보 관리
- **지원서 관리**: 지원서 생성, 상태 관리 (ApplicationStatus)
- **보안**: Role 기반 접근 제어

## 설정 (Configuration)
주요 설정 파일은 `backend/src/main/resources` 위치에 있습니다.
- `application.properties`: 공통 설정 (Active Profile 설정)
- `application-dev.properties`: 개발 환경 설정 (DB 연결 정보 등)

## API 문서 (API Documentation)
서버 실행 후 Swagger UI를 통해 API 문서를 확인할 수 있습니다.
- **URL**: `http://localhost:8080/swagger-ui/index.html`

## 에러 처리 (Error Handling)
모든 에러 응답은 다음과 같은 통일된 JSON 포맷으로 반환됩니다:
```json
{
  "status": 400,
  "message": "에러 메시지",
  "timestamp": "2024-01-01T12:00:00"
}
```

## 환경 변수 설정 (Environment Variables)
보안을 위해 다음 값들은 환경 변수나 별도의 설정 파일로 관리해야 합니다.
- `jwt.secret`: JWT 서명을 위한 비밀키
- `app.cors.allowed-origins`: CORS 허용 도메인 (예: `http://localhost:3000`)
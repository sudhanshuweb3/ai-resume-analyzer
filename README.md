# AI Resume Analyzer

> A production-quality SaaS application that analyzes resumes against job descriptions using AI and NLP — generating ATS compatibility scores, detecting missing skills, and suggesting targeted improvements.

[![Java](https://img.shields.io/badge/Java-17%2B-orange?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.x-6DB33F?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python)](https://python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)](https://postgresql.org/)

---

## Features

- **JWT Authentication** — Secure register/login with BCrypt password hashing
- **Resume Upload** — Drag-and-drop PDF/DOCX upload with server-side storage
- **Job Description Management** — Save and manage multiple job descriptions
- **AI-Powered Analysis** — Resume vs JD compatibility powered by Python NLP microservice
- **ATS Scoring** — Weighted 3-factor score: keyword match (50%), semantic similarity (30%), structure (20%)
- **Visual Dashboard** — Score gauge, keyword charts, improvement suggestions, and history tracking

---

## System Architecture

```
React Frontend  ──►  Spring Boot API  ──►  PostgreSQL
                           │
                           ▼
                   Python FastAPI (NLP)
                   spaCy + scikit-learn
```

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Backend API | Java 17, Spring Boot, Spring Security (JWT) |
| NLP Microservice | Python 3.10, FastAPI, spaCy, scikit-learn, PyMuPDF |
| Database | PostgreSQL 15 |
| Infrastructure | Docker, Docker Compose |

---

## Project Structure

```
ai-resume-analyzer/
├── backend/          # Spring Boot API server
│   └── src/main/java/com/analyzer/
│       ├── config/       # Security, CORS, beans
│       ├── controller/   # REST API endpoints
│       ├── domain/       # JPA entities
│       ├── dto/          # Request/Response objects
│       ├── exception/    # Global exception handling
│       ├── repository/   # Spring Data JPA
│       ├── security/     # JWT filter & service
│       └── service/      # Business logic
├── frontend/         # React 18 + Vite SPA
│   └── src/
│       ├── components/   # Layout, UploadResume, ProtectedRoute
│       ├── context/      # AuthContext
│       ├── pages/        # Dashboard, Analyze, Results, History
│       └── services/     # Axios API client
├── ai-service/       # Python FastAPI NLP service
│   └── app/
│       ├── api/          # Route handlers (parser, analyzer)
│       ├── core/         # PDF extractor, NLP engine
│       └── models/       # Pydantic schemas
├── docker/
└── docker-compose.yml
```

---

## Quick Start

### Prerequisites

- Java 17+ and Maven
- Node.js 18+ and npm
- Python 3.10+ and pip
- Docker & Docker Compose

### 1. Start the Database

```bash
docker-compose up -d
```

This starts a PostgreSQL 15 instance at `localhost:5432` with database `analyzer_db`.

### 2. Start the Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

API runs at **http://localhost:8080**

> **Note:** The JPA schema is auto-created on first run via `spring.jpa.hibernate.ddl-auto=update`.

### 3. Start the AI Service (Python)

```bash
cd ai-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8000
```

AI service runs at **http://localhost:8000** · API docs at **http://localhost:8000/docs**

### 4. Start the Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/login` | Login, receive JWT |

### Resumes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/resumes` | Upload PDF/DOCX |
| GET | `/api/v1/resumes` | List user's resumes |
| GET | `/api/v1/resumes/{id}` | Get resume metadata |

### Job Descriptions
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/jobs` | Save a job description |
| GET | `/api/v1/jobs` | List user's JDs |

### Analysis
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/analysis` | Trigger ATS analysis |
| GET | `/api/v1/analysis` | Get analysis history |
| GET | `/api/v1/analysis/{id}` | Get detailed result |

---

## ATS Scoring Algorithm

The final score (0–100) is computed as a **weighted combination of three factors**:

| Factor | Weight | Source |
|---|---|---|
| Hard keyword match | 50% | Intersection of extracted JD and resume keywords |
| Contextual similarity | 30% | TF-IDF cosine similarity via scikit-learn |
| Structure bonus | 20% | Deducted by readability penalty from AI service |

---

## Environment Variables

Copy the defaults in `backend/src/main/resources/application.properties` and update as needed:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/analyzer_db
spring.datasource.username=postgres
spring.datasource.password=password

application.security.jwt.secret-key=<your-256-bit-hex-key>
application.security.jwt.expiration=86400000

application.ai-service.base-url=http://localhost:8000
application.file.upload-dir=./uploads
```

---

## Development Roadmap

| Day | Focus |
|---|---|
| 1 | Project setup, monorepo skeleton, Docker Compose |
| 2 | Database schema, User entity, JWT authentication |
| 3 | React Router, AuthContext, Login/Register UI |
| 4 | Resume Upload API, file storage, drag-and-drop UI |
| 5 | Python FastAPI scaffold, PDF text extraction |
| 6 | spaCy NER, TF-IDF similarity, NLP analysis endpoint |
| 7 | Spring Boot → Python HTTP integration (RestTemplate) |
| 8 | Jobs API, ATS scoring algorithm, Analyze UI |
| 9 | Dashboard, results visualization, history table |
| 10 | Polish, refactoring, README, end-to-end testing |

---

## License

MIT © 2025 — Built for portfolio showcase.

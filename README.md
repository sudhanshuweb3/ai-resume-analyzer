# AI Resume Analyzer

A production-quality SaaS application designed to analyze resumes against job descriptions using AI and NLP to produce ATS compatibility scores, detect missing skills, and suggest improvements.

## Project Architecture

This is a monorepo containing three main components:

- **Frontend (`/frontend`)**: React 18 application powered by Vite, utilizing Tailwind CSS for styling.
- **Backend (`/backend`)**: Java 17+ Spring Boot application acting as the main API Gateway, handling authentication and database interactions.
- **AI Service (`/ai-service`)**: Python FastAPI microservice utilizing spaCy and Scikit-Learn for text extraction, NLP scoring, and similarity calculations.
- **Database (`/docker/docker-compose.yml`)**: PostgreSQL 15 database orchestrated via Docker.

## Setup Requirements

- Java 17+
- Maven 3.8+
- Node.js 18+
- Python 3.10+
- Docker & Docker Compose

## Quick Start (Local Development)

### 1. Database
```bash
docker-compose up -d
```

### 2. Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### 4. AI Service (Python)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

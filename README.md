# BhumiSetu (भूमिसेतु)
> *One Parcel. One Window.*
> AI-Enabled, GIS-Based Integrated Land Information & Single-Window Land Service Platform.

Bhumisetu is a parcel-centric e-governance platform connecting citizens, municipal and revenue departments, and land records into a single unified window.

---

## 🏛️ Platform Architecture
- **Backend**: Java 21, Spring Boot 3.3.4, Spring Security + JWT, Spring Data JPA, Hibernate Spatial
- **Database**: PostgreSQL 16 + PostGIS 3.4
- **Frontend**: React (Vite) + Tailwind CSS + Leaflet (react-leaflet) + Recharts + Lucide Icons
- **AI & OCR**: Tess4J (Tesseract OCR Engine) + Rule/Regex-based Metadata Extraction Engine with Confidence Scoring
- **Containerization**: Docker Compose

---

## 🚀 Quick Start with Docker
```bash
docker compose up -d --build
```
- Frontend: http://localhost:5173 (or http://localhost:3000)
- Backend API & Swagger: http://localhost:8080/swagger-ui.html

---

## 💻 Local Development Setup

### 1. Database
Ensure PostgreSQL with PostGIS extension is running on port 5432:
```bash
docker compose up -d postgis
```

### 2. Backend
```bash
cd backend
mvn clean spring-boot:run
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Repository Structure
```
BhumiSetu/
├── backend/            # Spring Boot REST API & Spatial JPA Domain
├── frontend/           # React + Vite + Tailwind CSS Citizen/Officer Portal
├── docs/               # System architecture and sample land documents
├── docker-compose.yml  # Multi-container orchestration (PostGIS, Backend, Frontend)
└── README.md           # Project documentation and demo guides
```
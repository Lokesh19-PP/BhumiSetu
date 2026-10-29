# Bhumisetu (भूमिसेतू) — Integrated Land Information & Single-Window Platform

> **"One Parcel. One Window."**  
> An AI-enabled, GIS-based e-governance platform uniting municipal clearances, cadastral mapping, and deed digitization under a parcel-centric single window.  
> *Final-Year Engineering Major Project Prototype for Academic Demonstration (Academic Year 2026–27).*

---

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21%20LTS-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![PostGIS](https://img.shields.io/badge/PostGIS-3.4-blue?logo=postgresql)](https://postgis.net/)
[![React](https://img.shields.io/badge/React-19.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Tesseract OCR](https://img.shields.io/badge/Tesseract%20OCR-5.12-555555?logo=google&logoColor=white)](https://github.com/tesseract-ocr/tesseract)
[![Docker](https://img.shields.io/badge/Docker%20Compose-3.8-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

---

## 📖 Master Academic Documentation

Complete, publication-grade academic documentation and viva preparation guides are available in the [`/docs`](docs/README.md) directory:

| Guide / Chapter | Document Link | Description |
| :--- | :--- | :--- |
| **Documentation Index** | [docs/README.md](docs/README.md) | Master index and suggested reading order for examiners and students. |
| **01. Project Overview** | [01_PROJECT_OVERVIEW.md](docs/01_PROJECT_OVERVIEW.md) | Problem statement, background in India, objectives, scope, comparative table, 2-min pitch. |
| **02. Requirements** | [02_REQUIREMENTS.md](docs/02_REQUIREMENTS.md) | 27 Functional Requirements (FR), Non-Functional Requirements (NFR), user stories. |
| **03. User Roles & RBAC** | [03_USER_ROLES_AND_RBAC.md](docs/03_USER_ROLES_AND_RBAC.md) | 6 roles, Permission Matrix, Spring Security & React route enforcement. |
| **04. System Architecture** | [04_SYSTEM_ARCHITECTURE.md](docs/04_SYSTEM_ARCHITECTURE.md) | Layered architecture, Docker deployment topology, and end-to-end request lifecycle. |
| **05. Technology Stack** | [05_TECH_STACK.md](docs/05_TECH_STACK.md) | Technology catalog with versions, architectural justifications, and trade-off analyses. |
| **06. Database & Spatial GIS** | [06_DATABASE_DESIGN.md](docs/06_DATABASE_DESIGN.md) | Mermaid ER diagram, 8 data dictionaries, PostGIS spatial queries, parcel-centric rationale. |
| **07. REST API Docs** | [07_API_DOCUMENTATION.md](docs/07_API_DOCUMENTATION.md) | Catalog of 22 REST endpoints, request/response JSON samples, Swagger UI reference. |
| **08. GIS Module** | [08_GIS_MODULE.md](docs/08_GIS_MODULE.md) | PostGIS polygon storage, GeoJSON generation, Leaflet rendering, map-to-dossier flow. |
| **09. AI & OCR Module** | [09_AI_MODULE.md](docs/09_AI_MODULE.md) | Tesseract 5 pipeline, heuristic regex rules, confidence scoring, smart search. |
| **10. Workflow Engine** | [10_WORKFLOW_ENGINE.md](docs/10_WORKFLOW_ENGINE.md) | 5-state lifecycle, automated departmental routing, approval sequence diagram. |
| **11. Security & Audit** | [11_SECURITY_AND_AUDIT.md](docs/11_SECURITY_AND_AUDIT.md) | Stateless JWT flow, BCrypt hashing, 3-tier authorization, immutable audit trail. |
| **12. UI/UX Guide** | [12_UI_UX_GUIDE.md](docs/12_UI_UX_GUIDE.md) | E-governance design system tokens, sitemap, user journey diagram, 12 screen inventory. |
| **13. Testing Suite** | [13_TESTING.md](docs/13_TESTING.md) | 7 automated test suites, 14 manual test execution cases with 100% pass status. |
| **14. Deployment & Setup** | [14_DEPLOYMENT_AND_SETUP.md](docs/14_DEPLOYMENT_AND_SETUP.md) | Turnkey Docker run, zero-setup H2GIS dev mode, environment variables, troubleshooting. |
| **15. 5-Min Demo Script** | [15_DEMO_SCRIPT.md](docs/15_DEMO_SCRIPT.md) | Timed 5-minute presentation script with exact clicks, talk tracks, and contingencies. |
| **16. Presentation Outline** | [16_PRESENTATION_OUTLINE.md](docs/16_PRESENTATION_OUTLINE.md) | 15-slide presentation deck outline with speaking notes and diagram placements. |
| **17. 40+ Viva Q&A** | [17_VIVA_QUESTIONS.md](docs/17_VIVA_QUESTIONS.md) | 43 rigorous viva questions with grounded answers, including tricky examiner traps. |
| **18. Limitations & Roadmap**| [18_LIMITATIONS_AND_FUTURE_SCOPE.md](docs/18_LIMITATIONS_AND_FUTURE_SCOPE.md) | Honest prototype boundaries and 4-phase engineering roadmap (NLRMP, eSign, pgvector). |
| **19. Technical Glossary** | [19_GLOSSARY.md](docs/19_GLOSSARY.md) | Alphabetical glossary defining 45 land revenue and computer science terms. |
| **Report Template** | [PROJECT_REPORT_TEMPLATE.md](docs/PROJECT_REPORT_TEMPLATE.md) | Ready-to-adapt university final-year project report structure. |
| **Screenshots Shotlist** | [screenshots/SHOTLIST.md](docs/screenshots/SHOTLIST.md) | Complete catalog of required interface screenshots. |

---

## 🌟 The Core Concept: Parcel-Centric Governance

In traditional governance, land administration operates in strict departmental silos: Revenue offices manage 7/12 land titles, Town Planning handles building permissions, and Utilities manage water pipelines.

**Bhumisetu** flips this model by establishing the **Cadastral Land Parcel as the single source of truth**. Every document, title deed, mutation entry, municipal application, and decision history anchors directly to the parcel polygon:

```
                 ┌─────────────────────────────────────────────────┐
                 │       CADASTRAL LAND PARCEL (PostGIS)           │
                 │  Survey No. 125/2  •  ULPIN: MH-PUN-HIN-001     │
                 └────────────────────────┬────────────────────────┘
                                          │
         ┌───────────────────┬────────────┴──────────┬──────────────────┐
         ▼                   ▼                       ▼                  ▼
┌─────────────────┐ ┌─────────────────┐     ┌─────────────────┐ ┌──────────────┐
│ Ownership Record│ │ Attached Deeds  │     │ Municipal Apps  │ │ Cadastral    │
│ Khata No. 402   │ │ 7/12 Satbara,   │     │ Building Perm,  │ │ Polygon      │
│ Ramesh N. Patil │ │ Sale Deeds (OCR)│     │ NA Conversion   │ │ Coordinates  │
└─────────────────┘ └─────────────────┘     └─────────────────┘ └──────────────┘
```

---

## 🚀 Key Features

1. **Interactive GIS Parcel Map**: Full-height Leaflet map rendering 25 sample Pune cadastral polygons (Hinjewadi, Baner, Wakad, Wagholi, Hadapsar, Kharadi) color-coded by land use with click-to-dossier navigation.
2. **360° Parcel Dossier**: Comprehensive inspection tabs (Overview, Ownership, Documents, Applications, Mutation History) with cadastral geometry mini-map.
3. **AI OCR & Metadata Extraction**: Upload scanned deeds or use the 1-click sample 7/12 Satbara Extract. Tesseract OCR with intelligent fallback extracts Survey Numbers, ULPINs, Villages, and Areas with confidence metrics and human-in-the-loop verification.
4. **Smart Document Search**: Full-text and metadata search with keyword snippet highlighting and filtering by village, document type, and verification status.
5. **Single-Window Application Wizard**: 3-step citizen workflow for **Building Permission** (Town Planning), **Land-Use Change** (Revenue), and **Water Connection** (Utility).
6. **Automated Departmental Routing & Officer Review**: Strict Role-Based Access Control (RBAC). Department officers review dossiers and sign decisions (**Approve**, **Reject**, **Request Info**). Citizens are strictly prevented from approving applications.
7. **Real-time Status Tracking & Digital Sanctions**: Public timeline tracking with verifiable digital sanction order certificates for approved applications.
8. **Executive Analytics & Audit Console**: Recharts visualizations for service distributions, department throughput, user directory, and immutable security audit logs.

---

## 📸 Interface Screenshots

*(Refer to [docs/screenshots/SHOTLIST.md](docs/screenshots/SHOTLIST.md) for full image specifications)*

| GIS Cadastral Map View | AI Document Digitizer & OCR |
| :---: | :---: |
| *(Placeholder: docs/screenshots/shot_03_gis_cadastral_map.png)* | *(Placeholder: docs/screenshots/shot_06_ai_document_upload.png)* |

| Unified Parcel Legal Dossier | Town Planning Officer Queue |
| :---: | :---: |
| *(Placeholder: docs/screenshots/shot_05_unified_parcel_dossier.png)* | *(Placeholder: docs/screenshots/shot_11_officer_review_queue.png)* |

---

## ⚡ Quick Start Guide

### Option 1: Turnkey Docker Deployment (Recommended)
```bash
# Clone the repository and navigate into it
git clone https://github.com/your-repo/bhumisetu.git
cd bhumisetu

# Build and start all services in Docker
docker-compose up --build
```
* Access the Web Application at [`http://localhost:5173`](http://localhost:5173) (or `http://localhost:3000`).
* Access the Swagger UI API Documentation at [`http://localhost:8080/swagger-ui/index.html`](http://localhost:8080/swagger-ui/index.html).

### Option 2: Standalone Local Development (Zero-Setup with H2GIS)
```powershell
# Terminal 1: Backend with in-memory H2GIS spatial database
cd backend
mvn spring-boot:run "-Dspring-boot.run.jvmArguments=-Dspring.profiles.active=dev"

# Terminal 2: Frontend Vite dev server
cd frontend
npm install
npm run dev
```

---

## 👥 Demo Personas & Credentials

All demo accounts use the standard password: **`Demo@123`** (available via 1-click login buttons on `/login`):

| Role | Persona / Full Name | Email Address | Password | Department / Responsibility |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen** | Ramesh Narayan Patil | `citizen@bhumisetu.in` | `Demo@123` | Landowner in Hinjewadi; applies for building permissions |
| **Planning Officer** | Neha Kulkarni (Town Planner) | `planning@bhumisetu.in` | `Demo@123` | PMRDA Town Planning; approves Building Permissions |
| **Revenue Officer** | Santosh Jadhav (Tahsildar) | `revenue@bhumisetu.in` | `Demo@123` | Collectorate; approves Land-Use NA conversions |
| **Utility Officer** | Sunita Deshpande (Exec. Eng.) | `utility@bhumisetu.in` | `Demo@123` | Water Supply Dept; approves municipal connections |
| **Tree Officer** | Rajesh Shinde (Tree Officer) | `tree@bhumisetu.in` | `Demo@123` | Urban Forestry & Environmental Compliance |
| **System Admin** | Amit Sharma (Municipal Admin)| `admin@bhumisetu.in` | `Demo@123` | Global Analytics, User Directory, Audit Logs |

---

## 📦 Repository Layout

```
BhumiSetu/
├── backend/                       # Spring Boot 3 REST API (Java 21)
│   ├── src/main/java/in/bhumisetu/
│   │   ├── config/                # DataSeeder, H2GisInitializer
│   │   ├── controller/            # Auth, Parcel, Document, Application, Admin
│   │   ├── domain/entity/         # JPA entities (LandParcel, Application, etc.)
│   │   ├── domain/enums/          # Role, ApplicationStatus, ServiceType, etc.
│   │   ├── dto/                   # Strong request/response DTOs
│   │   ├── repository/            # Spring Data JPA & Spatial Repositories
│   │   ├── security/              # SecurityConfig, JwtUtils, AuthTokenFilter
│   │   └── service/               # ParcelService, DocumentService, ApplicationService
│   ├── src/main/resources/        # application.yml, application-dev.yml
│   ├── src/test/java/             # 7 automated test suites (JUnit 5, Mockito)
│   ├── uploads/                   # Scanned property documents
│   ├── Dockerfile                 # Multi-stage build with OpenJDK 21
│   └── pom.xml                    # Maven dependencies
├── frontend/                      # React 19 Single Page Application (Vite)
│   ├── src/
│   │   ├── components/            # Leaflet map, Navbar, Footer, Dossier drawer
│   │   ├── context/               # AuthContext with 1-click demo switcher
│   │   ├── pages/                 # 12 React screens (Map, Dossier, Digitize, etc.)
│   │   ├── services/              # Axios API service clients
│   │   ├── App.jsx                # Protected routes and navigation shell
│   │   └── main.jsx
│   ├── Dockerfile                 # Multi-stage Node + Nginx build
│   └── package.json               # Frontend dependencies
├── docs/                          # Comprehensive Academic Documentation Suite
│   ├── 01_PROJECT_OVERVIEW.md     # Problem background & comparative study
│   ├── 02_REQUIREMENTS.md         # 27 FRs, NFRs, user stories, MVP scope
│   ├── 03_USER_ROLES_AND_RBAC.md  # 6 roles, Permission Matrix, RBAC enforcement
│   ├── 04_SYSTEM_ARCHITECTURE.md  # Layered architecture, Docker topology
│   ├── 05_TECH_STACK.md           # Tech catalog & architectural trade-offs
│   ├── 06_DATABASE_DESIGN.md      # Mermaid ER diagram, 8 data dictionaries
│   ├── 07_API_DOCUMENTATION.md    # 22 REST endpoints & request/response samples
│   ├── 08_GIS_MODULE.md           # PostGIS, GeoJSON, Leaflet vector layers
│   ├── 09_AI_MODULE.md            # Tesseract OCR, regex heuristics, smart search
│   ├── 10_WORKFLOW_ENGINE.md      # 5-state lifecycle, automated routing table
│   ├── 11_SECURITY_AND_AUDIT.md   # JWT authentication, BCrypt, audit logging
│   ├── 12_UI_UX_GUIDE.md          # E-governance design system & sitemap
│   ├── 13_TESTING.md              # 7 automated test suites, 14 manual test cases
│   ├── 14_DEPLOYMENT_AND_SETUP.md # Step-by-step Docker and local setup guide
│   ├── 15_DEMO_SCRIPT.md          # 5-minute timed demo script for guide/viva
│   ├── 16_PRESENTATION_OUTLINE.md # 15-slide presentation deck outline
│   ├── 17_VIVA_QUESTIONS.md       # 43 rigorous viva questions & honest answers
│   ├── 18_LIMITATIONS_AND_FUTURE_SCOPE.md # Prototype limits & 4-phase roadmap
│   ├── 19_GLOSSARY.md             # 45 technical and domain terms defined
│   ├── PROJECT_REPORT_TEMPLATE.md # University project report structure
│   ├── README.md                  # Master documentation index
│   ├── screenshots/SHOTLIST.md    # Required screenshot catalog
│   ├── seed-parcels.geojson       # 25 cadastral polygons for Pune
│   └── sample-documents/          # Sample 7/12 Satbara extract image
└── docker-compose.yml             # Turnkey multi-container orchestration
```

---

## 📜 Academic Attribution & License

* **Project:** Bhumisetu (भूमिसेतू)
* **Tagline:** *"One Parcel. One Window."*
* **Academic Year:** 2026–27
* **License:** Licensed under the [MIT License](LICENSE).
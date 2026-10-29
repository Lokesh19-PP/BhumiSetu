# Bhumisetu (भूमिसेतु) — Integrated Land Information & Single-Window Platform

> **"One Parcel. One Window."**  
> An AI-enabled, GIS-based e-governance platform uniting municipal clearances, cadastral mapping, and deed digitization under a parcel-centric single window.  
> *Final-Year Engineering Major Project Prototype for Academic Demonstration.*

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![PostGIS](https://img.shields.io/badge/PostGIS-16--3.4-blue?logo=postgresql)](https://postgis.net/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS-199900?logo=leaflet)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

---

## 🌟 The Core Concept: Parcel-Centric Governance

In traditional governance, land administration is fragmented across disconnected departments: Revenue offices manage 7/12 land titles, Town Planning handles building permissions, and Utilities handle pipeline connections. 

**Bhumisetu** flips this model by making the **Cadastral Land Parcel the single source of truth**. Every document, title deed, mutation entry, municipal application, and decision history anchors directly to the parcel polygon.

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

1. **Interactive GIS Parcel Map**: Full-height Leaflet map rendering 25 sample Pune cadastral polygons (Hinjewadi, Baner, Wakad, Wagholi, Hadapsar, Kharadi) color-coded by land use with search-to-zoom and parcel slide drawer.
2. **360° Parcel Dossier**: Comprehensive inspection tabs (Overview, Ownership, Documents, Applications, Mutation History) with cadastral geometry mini-map.
3. **AI OCR & Metadata Extraction**: Upload scanned deeds or use the 1-click sample 7/12 Satbara Extract. Tesseract OCR with intelligent fallback extracts Survey Numbers, ULPINs, Villages, and Areas with confidence metrics and human-in-the-loop verification.
4. **Smart Document Search**: Full-text and metadata search with keyword snippet highlighting and filtering by village, document type, and verification status.
5. **Single-Window Application Wizard**: 3-step citizen workflow for **Building Permission** (Town Planning), **Land-Use Change** (Revenue), and **Water Connection** (Utility).
6. **Departmental Routing & Officer Review Queue**: Strict Role-Based Access Control (RBAC). Department officers review dossiers and sign decisions (**Approve**, **Reject**, **Request Info**). Citizens are strictly prevented from approving applications.
7. **Real-time Status Tracking & Digital Sanctions**: Public timeline tracking with verifiable digital sanction order certificates for approved applications.
8. **Executive Analytics & Audit Console**: Recharts visualizations for service distributions, department throughput, user directory, and immutable security audit logs.

---

## 👥 Demo Personas & Credentials

All demo accounts use the standard password: **`Demo@123`**

| Role | Persona / Name | Email | Jurisdiction / Focus |
| :--- | :--- | :--- | :--- |
| **Citizen** | Ramesh Narayan Patil | `citizen@bhumisetu.in` | Landowner in Hinjewadi; submits applications |
| **Planning Officer** | Anita Deshmukh | `planning@bhumisetu.in` | PMRDA Town Planning; approves Building Permissions |
| **Revenue Officer** | Santosh Jadhav (Tahsildar) | `revenue@bhumisetu.in` | Collectorate; approves Land-Use NA conversions |
| **Utility Officer** | Vikas Shinde | `utility@bhumisetu.in` | Water Supply Dept; approves municipal connections |
| **Tree Officer** | Sunita More | `tree@bhumisetu.in` | Urban Forestry & Environmental Compliance |
| **System Admin** | Municipal Commissioner | `admin@bhumisetu.in` | Global Analytics, User Directory, Audit Logs |

> 💡 **Demo Shortcut**: Click the **"Demo Switcher"** dropdown at the top right of the navigation bar to switch between personas in 1 click!

---

## 🛠️ Technology Stack

- **Backend**: Java 21, Spring Boot 3.3.4, Spring Security 6 (JWT RBAC), Spring Data JPA, Hibernate Spatial, JTS (Java Topology Suite), Tess4J (Tesseract OCR), OpenAPI 3 / Swagger.
- **Database**: PostgreSQL 16 + PostGIS 3.4 (`postgis/postgis:16-3.4`).
- **Frontend**: React 19, Vite, Tailwind CSS, React Router v7, Leaflet + React-Leaflet, Recharts, Lucide Icons, Axios.
- **Containerization**: Root `docker-compose.yml` for 1-command startup.

---

## 📦 Monorepo Layout

```
BhumiSetu/
├── backend/                  # Spring Boot 3 REST API
│   ├── src/main/java/        # Domain entities, repositories, services, controllers
│   ├── src/main/resources/   # application.yml, schema.sql
│   ├── src/test/java/        # Unit & integration test suites
│   ├── uploads/              # Uploaded scanned property records
│   ├── Dockerfile            # Multi-stage build with native Tesseract OCR
│   └── pom.xml
├── frontend/                 # React 19 + Vite Single Page Application
│   ├── src/components/       # GIS map, OCR digitizer, common layout
│   ├── src/pages/            # Landing, Map, Dossier, Digitize, Apply, Track, Officer, Admin
│   ├── src/context/          # AuthContext with 1-click demo switcher
│   ├── src/services/         # Axios API clients
│   ├── Dockerfile            # Multi-stage Node + Nginx build
│   └── package.json
├── docs/                     # Academic documentation & guide materials
│   ├── ARCHITECTURE.md       # Comprehensive system architecture & diagrams
│   ├── DEMO_SCRIPT.md        # 5-minute step-by-step presentation script
│   ├── seed-parcels.geojson  # 25 cadastral polygons for Pune
│   └── sample-documents/     # Sample 7/12 Satbara extract image
├── docker-compose.yml        # Orchestration (PostGIS, Backend, Frontend)
└── README.md
```

---

## ⚡ Quick Start Instructions

### Option 1: One-Command Start (Docker Compose)

Make sure Docker Desktop is running, then execute:

```bash
docker compose up --build
```

- **Frontend Application**: `http://localhost:3000` or `http://localhost:5173`
- **Backend REST API**: `http://localhost:8080`
- **Interactive Swagger API Docs**: `http://localhost:8080/swagger-ui/index.html`
- **PostGIS Database**: `localhost:5432` (db: `bhumisetu`, user: `bhumisetu`, password: `bhumisetu_pwd`)

---

### Option 2: Local Development Setup

#### 1. Database (PostGIS)
Start PostGIS via Docker:
```bash
docker run --name bhumisetu-db -e POSTGRES_DB=bhumisetu -e POSTGRES_USER=bhumisetu -e POSTGRES_PASSWORD=bhumisetu_pwd -p 5432:5432 -d postgis/postgis:16-3.4
```

#### 2. Backend (Spring Boot)
```bash
cd backend
mvn clean spring-boot:run
```
*The backend automatically creates tables and seeds the 25 Pune parcels, sample applications, and demo accounts.*

#### 3. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📖 5-Minute Guide Demonstration Flow

Follow the detailed step-by-step walkthrough in [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md):
1. **0:00 - 1:00**: Explore the Pune GIS cadastral map (`/map`), land-use polygons, and parcel side drawer.
2. **1:00 - 2:00**: Inspect the 360° Parcel Dossier (`/parcel/1`) with ownership and mutation records.
3. **2:00 - 3:00**: Run AI OCR on a physical 7/12 Satbara extract (`/digitize`) with confidence scoring and human verification.
4. **3:00 - 4:00**: Citizen submits Building Permission application via 3-step wizard (`/apply`).
5. **4:00 - 5:00**: Planning Officer logs into Department Queue (`/officer`), reviews specifications, and signs the Sanction Order. Citizen receives verified digital clearance certificate and timeline audit trail.

---

## 📄 Documentation Links
- **Architecture & System Design**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **5-Minute Guide Demo Walkthrough**: [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md)
- **Sample 7/12 Scanned Extract**: [docs/sample-documents/sample_7_12_extract.jpg](docs/sample-documents/sample_7_12_extract.jpg)
- **GeoJSON Cadastral Geometry**: [docs/seed-parcels.geojson](docs/seed-parcels.geojson)
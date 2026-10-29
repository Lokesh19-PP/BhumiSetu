# 04. System Architecture — Bhumisetu (भूमिसेतू)

> **Academic Year:** 2026–27  
> **Project Title:** Bhumisetu: AI-Enabled, GIS-Based Integrated Land Information & Single-Window Land Service Platform  
> **Tagline:** *"One Parcel. One Window."*  

---

## What This Document Covers

This document details the architectural foundation of Bhumisetu. It illustrates the high-level system topology, provides a layered architectural breakdown from presentation to storage, diagrams software components and their communication interfaces, details containerized deployment using Docker Compose, and traces an end-to-end request lifecycle through every system boundary.

---

## 1. High-Level System Architecture

Bhumisetu is structured as a modern, decoupled client-server web platform optimized for spatial queries and asynchronous document digitization:

```mermaid
graph TB
    subgraph ClientLayer [Client Tier: Browser]
        SPA[React 19 SPA + Vite<br/>Tailwind CSS & Lucide Icons]
        LMap[Leaflet GIS Viewport<br/>GeoJSON Vector Polygon Layer]
    end

    subgraph GatewayLayer [API Security & Gateway Tier]
        Sec[Spring Security 6<br/>Stateless JWT Auth Filter]
        CORS[CORS & Preflight Handler]
        AuditF[Audit Logging Filter<br/>IP & Route Interceptor]
    end

    subgraph ServiceLayer [Application & Business Logic Tier]
        AuthSvc[AuthService<br/>BCrypt & Token Provider]
        ParcelSvc[ParcelService<br/>Spatial Query & Dossier Aggregator]
        DocSvc[DocumentService<br/>OCR Orchestrator & Heuristic Parser]
        AppSvc[ApplicationService<br/>Workflow Router & SLA Tracker]
        AdminSvc[AdminService<br/>Throughput Analytics & Audit Explorer]
    end

    subgraph AIWorkerLayer [Digitization & OCR Tier]
        Tess[Tess4J / Tesseract 5 OCR Engine<br/>Native OCR Bridge]
        RuleEngine[Heuristic Regex Extractor<br/>Confidence Scoring & Fallback]
    end

    subgraph PersistenceLayer [Data & Storage Tier]
        PostGIS[(PostgreSQL 16 + PostGIS 3.4<br/>Cadastral Polygons & Spatial GIST Index)]
        H2GIS[(H2 In-Memory DB + H2GIS<br/>Embedded Dev/Test Database)]
        DiskStore[File System Volume<br/>Uploaded Deeds & Scanned Extracts]
    end

    %% Client to Gateway
    SPA -->|HTTPS / REST + JWT| Sec
    LMap -->|GeoJSON Vector Queries| Sec
    Sec --> CORS
    CORS --> AuditF

    %% Gateway to Services
    AuditF --> AuthSvc
    AuditF --> ParcelSvc
    AuditF --> DocSvc
    AuditF --> AppSvc
    AuditF --> AdminSvc

    %% Services to OCR & Storage
    DocSvc --> Tess
    DocSvc --> RuleEngine
    DocSvc --> DiskStore

    %% Services to Database
    AuthSvc --> PostGIS
    ParcelSvc --> PostGIS
    AppSvc --> PostGIS
    AdminSvc --> PostGIS
    DocSvc --> PostGIS

    %% Fallback DB for dev
    ParcelSvc -.->|Dev Profile| H2GIS
```

---

## 2. Layered Architecture Explanation

The software implements a clean **Separation of Concerns (SoC)** partitioned across six well-defined architectural layers:

```mermaid
flowchart TD
    L1[1. Presentation Layer: React 19, Leaflet, Tailwind CSS]
    L2[2. Security & Routing Layer: Spring Security, JWT Filter, Audit Filter]
    L3[3. Controller Layer: REST Controllers, OpenAPI / Swagger Annotations]
    L4[4. Business Service Layer: Domain Logic, Workflow Routing, OCR Extraction]
    L5[5. Persistence & Data Access Layer: Spring Data JPA, Hibernate Spatial, JTS]
    L6[6. Infrastructure & Storage: PostgreSQL + PostGIS, Docker Containers, Local Disk]

    L1 <--> L2
    L2 <--> L3
    L3 <--> L4
    L4 <--> L5
    L5 <--> L6
```

### 1. Presentation Layer (Frontend Client)
* **Framework:** React 19 with Vite bundler.
* **Geospatial Rendering:** Leaflet and `react-leaflet` rendering GeoJSON polygon layers over OpenStreetMap tiles.
* **Styling & Icons:** Tailwind CSS with responsive e-governance design system (`#0B2545` deep navy, `#137547` forest green, `#DDA15E` warm gold) and Lucide React icons.
* **State Management:** Native React Context (`AuthContext`) handling session state and role privileges.

### 2. Security & Interception Layer (API Gateway)
* **Stateless Token Verification:** `AuthTokenFilter` intercepts every incoming HTTP request, validates the Bearer JWT signature against a 256-bit secret, and binds the principal to the Spring `SecurityContextHolder`.
* **Access Control:** `SecurityFilterChain` enforces route-level role checks, while `@EnableMethodSecurity` allows granular `@PreAuthorize` assertions at the method level.
* **System Auditing:** `AuditLoggingFilter` captures incoming request methods, URIs, remote IP addresses, and acting principals for immutable audit persistence.

### 3. Controller Layer (REST Web Service Tier)
* Exposes clean, standardized RESTful endpoints under `/api/*`.
* Validates incoming DTOs using Jakarta Validation annotations (`@Valid`, `@NotNull`, `@NotBlank`).
* Annotated with `io.swagger.v3` annotations, automatically generating interactive API documentation at `/swagger-ui/index.html`.

### 4. Business Service Layer (Core Domain Logic)
* **`ParcelService`:** Orchestrates spatial bounding box searches, point-in-polygon resolution, and compiles the 360-degree unified `ParcelDossierDto`.
* **`ApplicationService`:** Executes single-window application creation, generates human-readable reference numbers (e.g., `BS-2026-BP-00101`), automatically routes requests to designated departmental officer queues, and logs workflow history.
* **`DocumentService`:** Coordinates multipart file storage, triggers OCR text recognition via `Tess4J`, executes heuristic regex parsing for cadastral entities, and calculates extraction confidence scores.
* **`AuthService` & `AdminService`:** Manages user identity, password hashing via BCrypt, municipal throughput analytics, and system audit log aggregation.

### 5. Persistence & Spatial GIS Layer
* **ORM:** Spring Data JPA with Hibernate 6 and Hibernate Spatial.
* **Geometric Engine:** JTS (Java Topology Suite) `org.locationtech.jts.geom.Polygon` mapped directly to PostGIS geometries.
* **Spatial Repositories:** Leverages native SQL spatial queries (`ST_Contains`, `ST_Intersects`, `ST_MakeEnvelope`) for microsecond geospatial lookups.

### 6. Infrastructure & Storage Layer
* **Primary Database:** PostgreSQL 16 containerized with PostGIS 3.4 spatial extensions and spatial GIST indexing.
* **Development In-Memory Database:** H2 Database with H2GIS spatial functions enabled via `H2GisInitializer` for zero-setup local execution.
* **Document File Storage:** Configurable file storage volume (`/uploads` or `/app/uploads`) storing original deed PDFs and scanned property images.

---

## 3. Component Architecture

The diagram below details the concrete Spring components and React modules operating within the platform:

```mermaid
graph LR
    subgraph FrontendComponents [Frontend Components]
        MapComp[MapPage / CadastralViewer]
        DossierComp[ParcelDossierPage]
        OcrComp[AiDocumentPage]
        WizardComp[ApplicationWizardPage]
        OffComp[OfficerDashboardPage]
        AdminComp[AdminDashboardPage]
    end

    subgraph BackendControllers [REST Controllers]
        PC[ParcelController]
        DC[DocumentController]
        AC[ApplicationController]
        AUC[AuthController]
        ADC[AdminController]
    end

    subgraph BackendServices [Business Services]
        PS[ParcelService]
        DS[DocumentService]
        AS[ApplicationService]
        AUS[AuthService]
        ADS[AdminService]
    end

    subgraph Repositories [Spring Data Repositories]
        LPR[LandParcelRepository]
        ORR[OwnershipRecordRepository]
        DR[DocumentRepository]
        AR[ApplicationRepository]
        UR[UserRepository]
        ALR[AuditLogRepository]
        WHR[WorkflowHistoryRepository]
    end

    MapComp --> PC
    DossierComp --> PC
    OcrComp --> DC
    WizardComp --> AC
    OffComp --> AC
    AdminComp --> ADC

    PC --> PS
    DC --> DS
    AC --> AS
    AUC --> AUS
    ADC --> ADS

    PS --> LPR
    PS --> ORR
    DS --> DR
    AS --> AR
    AS --> WHR
    AUS --> UR
    ADS --> ALR
```

---

## 4. Deployment Topology (Docker Compose)

Bhumisetu is packaged for turnkey containerized deployment using Docker Compose, encapsulating the database, backend runtime, and frontend web server on an isolated bridge network:

```mermaid
graph TB
    subgraph Host [Host Machine / Cloud VM]
        subgraph Ports [Exposed Host Ports]
            P3000[Port 3000 / 5173: Frontend Web Port]
            P8080[Port 8080: Backend REST API]
            P5432[Port 5432: PostGIS Database Port]
        end

        subgraph DockerBridge [Docker Network: bhumisetu-network]
            FEContainer["bhumisetu-frontend (Nginx Container)<br/>Serves React SPA static assets<br/>Proxies /api requests to backend"]
            BEContainer["bhumisetu-backend (OpenJDK 21 Container)<br/>Spring Boot 3 REST Application<br/>Includes Tess4J & Tesseract binaries"]
            DBContainer["bhumisetu-db (PostGIS Container)<br/>Image: postgis/postgis:16-3.4<br/>PostgreSQL with spatial extensions"]
        end

        subgraph Volumes [Persistent Named Volumes]
            DBVol[(postgis_data<br/>Stores PostgreSQL data files)]
            UploadVol[(backend_uploads<br/>Stores uploaded deed scans & PDFs)]
        end
    end

    P3000 --> FEContainer
    P8080 --> BEContainer
    P5432 --> DBContainer

    FEContainer -->|Internal HTTP Proxy| BEContainer
    BEContainer -->|JDBC connection on :5432| DBContainer

    DBContainer --> DBVol
    BEContainer --> UploadVol
```

### Docker Compose Specifications ([`docker-compose.yml`](file:///docker-compose.yml))
1. **`postgis` Service:**
   * Image: `postgis/postgis:16-3.4`
   * Healthcheck: Executes `pg_isready -U bhumisetu -d bhumisetu` every 5 seconds.
   * Persistent Volume: `postgis_data` mapped to `/var/lib/postgresql/data`.
2. **`backend` Service:**
   * Multi-stage build compiling Java 21 Spring Boot JAR and provisioning Tesseract OCR language libraries.
   * Health-dependent on `postgis` container health status.
   * Persistent Volume: `backend_uploads` mapped to `/app/uploads`.
3. **`frontend` Service:**
   * High-performance Nginx Alpine container serving production-optimized static HTML/JS/CSS assets.
   * Exposes ports `3000` and `5173`.

---

## 5. End-to-End Request Lifecycle: Building Permission Application

The following sequence diagram traces the complete lifecycle of an end-to-end user transaction: a citizen submits an application for Building Permission, which is automatically routed to the Town Planning Officer, who reviews the cadastral dossier and grants formal approval.

```mermaid
sequenceDiagram
    autonumber
    actor Citizen as Citizen (Ramesh Patil)
    participant UI as React Frontend (SPA)
    participant Gateway as Security Filter & Gateway
    participant AppCtrl as ApplicationController
    participant AppSvc as ApplicationService
    participant DB as PostgreSQL + PostGIS
    actor Officer as Planning Officer (Neha Kulkarni)

    %% Step 1: Citizen Submission
    Citizen->>UI: Selects Parcel #125/2, fills Building Permission form
    UI->>Gateway: POST /api/applications<br/>[Payload: parcelId=1, serviceType=BUILDING_PERMISSION, height=14.5m]<br/>[Header: Authorization: Bearer <Citizen_JWT>]
    Gateway->>Gateway: Validate JWT signature & claims
    Gateway->>AppCtrl: Forward authenticated request
    AppCtrl->>AppSvc: createApplication(request, applicantUser)

    %% Step 2: Routing Logic
    AppSvc->>DB: Fetch LandParcel (ID: 1)
    AppSvc->>DB: Fetch Department by code ('PLANNING')
    AppSvc->>AppSvc: Generate App Number: 'BS-2026-BP-00101'
    AppSvc->>DB: INSERT into applications (status='SUBMITTED', department_id=2)
    AppSvc->>DB: INSERT into workflow_histories (action='SUBMITTED', comment='Application submitted')
    AppSvc->>DB: INSERT into audit_logs (action='SUBMIT_APPLICATION', user='citizen@bhumisetu.in')
    AppSvc-->>AppCtrl: Return ApplicationDto
    AppCtrl-->>UI: HTTP 200 OK (Application Created: BS-2026-BP-00101)
    UI-->>Citizen: Display Confirmation & Tracking Number

    %% Step 3: Officer Reviews Queue
    Note over Officer,UI: Later that day, Planning Officer logs in
    Officer->>UI: Opens Officer Review Dashboard
    UI->>Gateway: GET /api/applications/officer/queue<br/>[Header: Authorization: Bearer <Officer_JWT>]
    Gateway->>AppCtrl: Route to getOfficerQueue()
    AppCtrl->>AppSvc: getOfficerQueue(officerUser, status=null)
    AppSvc->>DB: SELECT * FROM applications WHERE department_id = officer.department_id
    DB-->>AppSvc: Returns pending applications (including BS-2026-BP-00101)
    AppSvc-->>UI: HTTP 200 OK (List of ApplicationDto)
    UI-->>Officer: Displays BS-2026-BP-00101 in pending review table

    %% Step 4: Officer Takes Decision
    Officer->>UI: Inspects Parcel Dossier & Clicks 'Approve Permission'
    UI->>Gateway: POST /api/applications/1/decision<br/>[Payload: action=APPROVED, remarks='Sanctioned under FSI Rule 15.4']<br/>[Header: Authorization: Bearer <Officer_JWT>]
    Gateway->>Gateway: Verify Officer Role ('ROLE_PLANNING_OFFICER')
    Gateway->>AppCtrl: Route to takeDecision(1, request, officerUser)
    AppSvc->>DB: UPDATE applications SET status='APPROVED', remarks='Sanctioned...'
    AppSvc->>DB: INSERT into workflow_histories (action='APPROVED', acted_by=officer.id)
    AppSvc->>DB: INSERT into audit_logs (action='OFFICER_DECISION', entity='Application:1')
    AppSvc-->>UI: HTTP 200 OK (Updated ApplicationDto)
    UI-->>Officer: Display success toast notification

    %% Step 5: Citizen Real-time Tracking
    Note over Citizen,UI: Citizen checks tracking portal
    Citizen->>UI: Visits /track/BS-2026-BP-00101
    UI->>Gateway: GET /api/applications/track/BS-2026-BP-00101
    Gateway->>DB: Query application + complete workflowHistories
    DB-->>UI: HTTP 200 OK
    UI-->>Citizen: Green 'APPROVED' badge with chronological timeline!
```

---

## Key Takeaways

1. **Decoupled Modern Architecture:** Strictly separates the client presentation layer (React 19, Leaflet) from the backend API, enabling independent scaling and evolution.
2. **Geospatial-First Persistence:** Utilizes PostgreSQL 16 with PostGIS 3.4 for spatial polygon storage and sub-100ms spatial geometric indexing.
3. **Stateless Security Gateway:** Employs Spring Security 6 with JWT Bearer tokens to protect API endpoints and enforce fine-grained role constraints.
4. **Turnkey Docker Topology:** Encapsulates the frontend web server, Spring Boot backend, and PostGIS database into a unified Docker Compose network with persistent storage.
5. **Traceable Request Lifecycle:** Every transactional state transition automatically records historical workflow timeline items and immutable audit logs.

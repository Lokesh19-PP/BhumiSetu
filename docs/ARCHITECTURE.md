# Bhumisetu (भूमिसेतु) — Architecture & Technical Design

Bhumisetu is an AI-enabled, GIS-based integrated land information and single-window service platform. It replaces fragmented municipal and revenue clearance processes with a **parcel-centric** paradigm where all land rights, spatial geometry, scanned deeds, and department applications attach directly to a verified cadastral unit.

---

## 1. System Architecture Overview

```mermaid
graph TD
    subgraph ClientLayer ["Client Layer (Single Page Application)"]
        UI["React 19 + Vite + Tailwind CSS"]
        GISMap["Leaflet GIS Map Engine (react-leaflet)"]
        AnalyticsUI["Recharts Analytics Dashboard"]
        OCRUI["AI Review & Verify Digitizer"]
    end

    subgraph Gateway ["Security & API Gateway (Spring Boot 3)"]
        Security["Spring Security 6 + JWT RBAC Filter"]
        Audit["AuditLoggingFilter (IP & Action Tracking)"]
        Swagger["OpenAPI 3 / Swagger Documentation"]
    end

    subgraph ServiceLayer ["Core Service Orchestration"]
        ParcelSvc["Parcel & Spatial Query Service"]
        WorkSvc["Application Workflow & Routing Service"]
        AISvc["Tesseract OCR & Regex Rule Extractor"]
        DocSvc["Smart Full-Text Search Service"]
        AdminSvc["Executive Analytics & Audit Service"]
    end

    subgraph DataStorage ["Persistence & Spatial Engine"]
        PostGIS[("PostgreSQL 16 + PostGIS 3.4 Spatial Database")]
        FileStore[("Local Disk Scanned Upload Storage")]
    end

    UI --> Gateway
    Gateway --> ServiceLayer
    ParcelSvc --> PostGIS
    WorkSvc --> PostGIS
    DocSvc --> PostGIS
    AISvc --> FileStore
    AdminSvc --> PostGIS
```

---

## 2. Parcel-Centric Data Model

In Bhumisetu, a **LandParcel** (with its PostGIS geometry and 14-character ULPIN) is the root aggregate:

```mermaid
erDiagram
    LAND_PARCEL ||--o{ OWNERSHIP_RECORD : "held by"
    LAND_PARCEL ||--o{ DOCUMENT : "attached deeds"
    LAND_PARCEL ||--o{ APPLICATION : "services applied"
    
    APPLICATION ||--o{ WORKFLOW_HISTORY : "audit timeline"
    APPLICATION }|--|| DEPARTMENT : "routed to"
    APPLICATION }|--|| USER : "applicant (citizen)"
    APPLICATION }|--o| USER : "assigned officer"
    
    DOCUMENT }|--|| USER : "uploaded by"
    USER ||--o{ AUDIT_LOG : "initiated by"

    LAND_PARCEL {
        bigint id PK
        string ulpin UK
        string survey_number
        string village
        string taluka
        string district
        double area_sq_m
        geometry boundary_polygon
        string land_use
    }

    APPLICATION {
        bigint id PK
        string application_number UK
        string service_type
        string status
        bigint parcel_id FK
        bigint applicant_id FK
        bigint department_id FK
        bigint assigned_officer_id FK
    }

    DOCUMENT {
        bigint id PK
        string document_type
        string file_name
        text full_text
        text extracted_metadata
        boolean verified
        bigint parcel_id FK
    }
```

---

## 3. Single-Window Workflow State Machine & RBAC

Bhumisetu enforces strict Separation of Concerns. Citizens can submit applications but are mathematically blocked from approving them. Only departmental officers and administrators can record review decisions.

```mermaid
stateDiagram-v2
    [*] --> SUBMITTED : Citizen submits via Application Wizard
    SUBMITTED --> UNDER_REVIEW : Officer picks up from Queue
    UNDER_REVIEW --> INFO_REQUESTED : Officer queries field documents
    INFO_REQUESTED --> UNDER_REVIEW : Citizen responds with clarification
    UNDER_REVIEW --> APPROVED : Officer grants Sanction Order
    UNDER_REVIEW --> REJECTED : Officer rejects with statutory bye-law clause
    APPROVED --> [*]
    REJECTED --> [*]
```

### Department Routing Rules:
| Service | Routing Department | Competent Officer | Standard SLAs |
| :--- | :--- | :--- | :--- |
| **Building Permission** | Town Planning & Municipal Sanctions (`PLANNING`) | `PLANNING_OFFICER` | 7 Days |
| **Land-Use Change** | Revenue & Land Records / Collectorate (`REVENUE`) | `REVENUE_OFFICER` (Tahsildar) | 15 Days |
| **Water Connection** | Water Supply & Public Utilities (`UTILITY`) | `UTILITY_OFFICER` | 3 Days |

---

## 4. AI OCR & Metadata Extraction Pipeline

Scanned land documents (such as 7/12 Satbara Extracts) undergo a hybrid digitization process:

```mermaid
sequenceDiagram
    autonumber
    actor User as Citizen / Officer
    participant Frontend as Review & Verify UI
    participant Backend as DocumentController & OcrService
    participant Engine as Tess4J / Native Tesseract
    participant Extractor as MetadataExtractorService
    participant DB as PostGIS & Documents DB

    User->>Frontend: Upload property scan (e.g., sample_7_12_extract.jpg)
    Frontend->>Backend: POST /api/documents/upload-ocr
    Backend->>Engine: Run optical character recognition (Devnagari + English)
    Engine-->>Backend: Raw extracted text
    Backend->>Extractor: Parse Gat No., ULPIN, Village, Area, Holder
    Extractor-->>Backend: ExtractedMetadataDto + Field Confidence Scores
    Backend->>DB: Save unverified Document linked to matched Parcel
    Backend-->>Frontend: Return OCR text, detected fields & confidence scores
    User->>Frontend: Human-In-The-Loop: Confirm & Verify parameters
    Frontend->>Backend: PUT /api/documents/{id}/verify
    Backend->>DB: Update verified=true, timestamp, and audit trail
    Backend-->>Frontend: 200 OK (Cadastral link finalized)
```

---

## 5. Security Architecture (RBAC & Audit Trail)

1. **Stateless JWT Authentication**: Tokens issued using HMAC-SHA256 with user roles and email claims.
2. **Role Hierarchy**:
   - `CITIZEN`: Search parcels, view dossiers, upload documents, submit applications, track status.
   - `PLANNING_OFFICER`: Review Town Planning queue, approve/reject building permissions.
   - `REVENUE_OFFICER`: Review Revenue queue, approve/reject land-use NA conversions.
   - `UTILITY_OFFICER`: Review Water Supply queue, approve/reject pipeline sanctions.
   - `TREE_OFFICER`: Environmental oversight and felling NOCs.
   - `ADMIN`: Global analytics, cross-department queue management, user directory, security audit log access.
3. **Immutable Audit Logs**: Automatically recorded on every security event, document upload, and workflow state transition with IP address, user identity, and target entity IDs.

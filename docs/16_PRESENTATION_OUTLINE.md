# 16. Presentation Slide Outline — Bhumisetu (भूमिसेतू)

> **Academic Year:** 2026–27  
> **Project Title:** Bhumisetu: AI-Enabled, GIS-Based Integrated Land Information & Single-Window Land Service Platform  
> **Tagline:** *"One Parcel. One Window."*  

---

## What This Document Covers

This document provides a slide-by-slide blueprint for preparing an academic project presentation deck (approximately 15 slides) for project guides, department review committees, and external viva examiners. For every slide, it specifies the slide title, core bullet points, recommended visual diagrams or screenshots from the `/docs/` repository, and concise speaking notes.

---

## Slide-by-Slide Presentation Blueprint

```mermaid
graph LR
    S1[Slide 1: Title] --> S2[Slide 2: Problem]
    S2 --> S3[Slide 3: Existing vs Proposed]
    S3 --> S4[Slide 4: Concept: Parcel-Centric]
    S4 --> S5[Slide 5: Architecture]
    S5 --> S6[Slide 6: Tech Stack]
    S6 --> S7[Slide 7: GIS Module]
    S7 --> S8[Slide 8: AI / OCR Module]
    S8 --> S9[Slide 9: Workflow Engine]
    S9 --> S10[Slide 10: Security & RBAC]
    S10 --> S11[Slide 11: Database Design]
    S11 --> S12[Slide 12: Implementation Walkthrough]
    S12 --> S13[Slide 13: Testing & Results]
    S13 --> S14[Slide 14: Limitations & Future Scope]
    S14 --> S15[Slide 15: Conclusion & Q&A]
```

---

### Slide 1: Title & Project Identity
* **Slide Title:** **Bhumisetu (भूमिसेतू)**
* **Subtitle:** AI-Enabled, GIS-Based Integrated Land Information & Single-Window Land Service Platform
* **Tagline:** *"One Parcel. One Window."*
* **Metadata:** Academic Year 2026–27 | Final Year Capstone Project
* **Recommended Visual:** Bhumisetu official logo and dual-pane interface mockups showing GIS Cadastre alongside AI OCR review.
* **Speaker Notes:**
  > *"Good morning respected evaluators. We present Bhumisetu, a platform designed to modernize citizen-to-government land administration through geospatial integration, AI document digitization, and automated single-window service routing."*

---

### Slide 2: The Problem: Fragmented Land Administration in India
* **Slide Title:** **The Challenge: Departmental Silos in Land Governance**
* **Key Bullet Points:**
  * Citizen journey fragmented across disjointed authorities: Revenue (7/12 records), Town Planning (building sanctions), Registration (sale deeds), and Utilities (water).
  * Manual paper submission creates weeks of bureaucratic churn and duplicate title verification.
  * Information asymmetry between physical spatial boundaries and textual land registries.
  * Absence of unified transparency breeds corruption, land disputes, and delays.
* **Recommended Visual:** Diagram from [`01_PROJECT_OVERVIEW.md`](file:///docs/01_PROJECT_OVERVIEW.md) showing a citizen running between 5 separate departmental sinks.
* **Speaker Notes:**
  > *"Today in India, land records exist in silos. If a citizen wants to build a house, they must independently obtain a 7/12 extract from revenue, building permission from the municipal corporation, and utility connections from public works. Each office re-verifies ownership from scratch."*

---

### Slide 3: Motivation & Existing System Gaps
* **Slide Title:** **Comparative Analysis: Ordinary Portals vs. Bhumisetu**
* **Key Bullet Points:**
  * **Mahabhulekh / State RoR Portals:** Static text viewers; cannot apply for permissions or view interactive GIS polygons.
  * **Municipal Planning Portals:** Isolated from revenue title encumbrances; requires physical paper attachments.
  * **Bhumisetu:** Unifies spatial polygons, legal title history, AI-digitized extracts, and multi-department service delivery into a single portal.
* **Recommended Visual:** Comparison table from [`01_PROJECT_OVERVIEW.md`](file:///docs/01_PROJECT_OVERVIEW.md#7-comparative-analysis-ordinary-portals-vs-bhumisetu).
* **Speaker Notes:**
  > *"Existing government portals like Mahabhulekh are merely record viewers. They don't allow you to execute transactions. Bhumisetu bridges this gap by unifying spatial boundaries with single-window service workflows."*

---

### Slide 4: The Proposed Solution: "One Parcel. One Window."
* **Slide Title:** **Paradigm Shift: From Department-Centric to Parcel-Centric**
* **Key Bullet Points:**
  * **The Core Premise:** The **Land Parcel** (anchored by its spatial polygon and ULPIN) is the root entity.
  * **All Records Hang Off the Parcel:** Ownership deeds, mutation records, zoning designations, utility connections, and active building permissions.
  * **Single-Window Workflow:** Automated routing directs citizen applications directly to responsible municipal officers.
* **Recommended Visual:** Parcel-Centric Core diagram from [`01_PROJECT_OVERVIEW.md`](file:///docs/01_PROJECT_OVERVIEW.md#3-the-bhumisetu-solution-one-parcel-one-window).
* **Speaker Notes:**
  > *"Instead of forcing the citizen to know which department does what, Bhumisetu organizes all data around the land parcel. Opening one parcel gives the citizen and the government complete 360-degree visibility."*

---

### Slide 5: High-Level System Architecture
* **Slide Title:** **Layered System Architecture**
* **Key Bullet Points:**
  * **Client Tier:** React 19 SPA, Leaflet GIS vector map, Tailwind CSS e-governance UI tokens.
  * **Security Gateway Tier:** Spring Security 6 with stateless HMAC-SHA256 JWT tokens.
  * **Business Service Tier:** Spatial query handlers, OCR heuristic extraction, and single-window workflow router.
  * **Persistence Tier:** PostgreSQL 16 with PostGIS 3.4 spatial extensions and spatial GIST indexing.
* **Recommended Visual:** Layered architecture diagram from [`04_SYSTEM_ARCHITECTURE.md`](file:///docs/04_SYSTEM_ARCHITECTURE.md#1-high-level-system-architecture).
* **Speaker Notes:**
  > *"Our architecture features clean separation of concerns across presentation, stateless security, business services, and spatial persistence, fully deployable via Docker Compose."*

---

### Slide 6: Technology Stack & Architectural Decisions
* **Slide Title:** **Technology Stack & Design Justification**
* **Key Bullet Points:**
  * **PostgreSQL + PostGIS 3.4:** Chosen over MongoDB for ACID transactional integrity and OGC-compliant spatial topological queries (`ST_Contains`).
  * **Spring Boot 3 (Java 21):** Chosen over Node.js for robust Hibernate Spatial ORM support and enterprise RBAC method security.
  * **Leaflet 1.9.4:** Lightweight open-source mapping engine without proprietary commercial API billing or citizen tracking.
  * **Tess4J / Tesseract 5:** Local, containerized OCR preserving citizen data privacy with heuristic fallback.
* **Recommended Visual:** Technology inventory table from [`05_TECH_STACK.md`](file:///docs/05_TECH_STACK.md#1-complete-technology-inventory).
* **Speaker Notes:**
  > *"Every technology was chosen to meet strict enterprise and data privacy standards. We chose PostGIS for rock-solid spatial integrity and local Tesseract OCR to ensure citizen property scans are never leaked to cloud APIs."*

---

### Slide 7: GIS Cadastral Engine & Spatial Operations
* **Slide Title:** **Cadastral GIS: Storing & Serving Land Geometries**
* **Key Bullet Points:**
  * Stored as native 2D Polygon geometries in WGS-84 (SRID 4326) coordinate system.
  * Served as standard GeoJSON FeatureCollections for vector client rendering.
  * Color-coded by land-use zoning: Blue (Residential), Amber (Commercial), Green (Agricultural).
  * Rapid point-in-polygon queries (`ST_Contains`) and viewport bounding box queries (`ST_Intersects`).
* **Recommended Visual:** GeoJSON data flow diagram and Leaflet screenshot from [`08_GIS_MODULE.md`](file:///docs/08_GIS_MODULE.md).
* **Speaker Notes:**
  > *"On our map, 25 realistic cadastral parcels in Pune are rendered directly from PostGIS. Clicking any coordinate executes an instantaneous point-in-polygon query, opening that parcel's legal dossier."*

---

### Slide 8: AI & OCR Document Digitization
* **Slide Title:** **Automated Extraction of Land Record Metadata**
* **Key Bullet Points:**
  * Ingestion pipeline converts scanned paper extracts (7/12 Satbara, sale deeds) into structured records.
  * Custom heuristic regular expression engine parses bilingual (Marathi & English) text.
  * Extracts 9 key attributes: ULPIN, Survey/Gat Number, Village, Area, Registration Number, and Owner Names.
  * Individual and composite confidence scoring with interactive human-in-the-loop review.
* **Recommended Visual:** OCR pipeline flowchart from [`09_AI_MODULE.md`](file:///docs/09_AI_MODULE.md#1-document-ingestion--ocr-pipeline).
* **Speaker Notes:**
  > *"Our AI module uses Tesseract OCR combined with a domain-specific heuristic parser. It extracts complex bilingual fields like the ULPIN and Marathi owner names, assigning confidence scores before attaching them to the cadastre."*

---

### Slide 9: Single-Window Workflow Engine & Routing
* **Slide Title:** **Automated Routing & Multi-Department Lifecycle**
* **Key Bullet Points:**
  * Deterministic Finite State Machine: `SUBMITTED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `INFO_REQUESTED` $\rightarrow$ `APPROVED` / `REJECTED`.
  * Automated departmental routing based on service type:
    * Building Permission $\rightarrow$ Town Planning Department (`PLANNING_OFFICER`)
    * Land-Use Change $\rightarrow$ Revenue Department (`REVENUE_OFFICER`)
    * Water Connection $\rightarrow$ Public Utility Department (`UTILITY_OFFICER`)
  * Generates sequential tracking numbers (e.g., `BS-2026-BP-00101`).
* **Recommended Visual:** State diagram and routing flowchart from [`10_WORKFLOW_ENGINE.md`](file:///docs/10_WORKFLOW_ENGINE.md#1-application-lifecycle-state-machine).
* **Speaker Notes:**
  > *"When a citizen submits an application, the workflow engine automatically routes it to the designated officer's queue based on service type, eliminating misdirected files and human error."*

---

### Slide 10: Security Architecture & Role-Based Access Control
* **Slide Title:** **Multi-Layered Security & Immutable Auditing**
* **Key Bullet Points:**
  * Six discrete roles (`CITIZEN`, 4 Department Officers, `ADMIN`).
  * Three-tier defense: URL filter patterns, method-level `@PreAuthorize`, and departmental jurisdiction checks.
  * Passwords hashed with salted BCrypt (cost factor 10).
  * Dual auditing: Citizen-facing `WorkflowHistory` timeline and administrative `AuditLog` capturing IP addresses.
* **Recommended Visual:** Sequence diagram and RBAC architecture from [`11_SECURITY_AND_AUDIT.md`](file:///docs/11_SECURITY_AND_AUDIT.md#3-multi-layered-rbac--departmental-boundary-enforcement).
* **Speaker Notes:**
  > *"Security is enforced in depth. Citizens are strictly forbidden from officer decision endpoints. Every single state change is recorded in an immutable audit trail capturing user IDs, timestamps, and IP addresses."*

---

### Slide 11: Database Design & Entity Architecture
* **Slide Title:** **Normalized Relational & Spatial Database Model**
* **Key Bullet Points:**
  * Eight normalized tables: `land_parcels`, `ownership_records`, `documents`, `applications`, `departments`, `users`, `workflow_histories`, `audit_logs`.
  * Spatial geometry column indexed with PostGIS GIST index.
  * Foreign key cascading and orphan removal enforce cadastral relational integrity.
* **Recommended Visual:** Mermaid ER diagram from [`06_DATABASE_DESIGN.md`](file:///docs/06_DATABASE_DESIGN.md#1-entity-relationship-er-diagram).
* **Speaker Notes:**
  > *"Our database model centers on the land_parcels table. By anchoring ownerships, uploaded documents, and service applications directly to the parcel, we eliminate data fragmentation."*

---

### Slide 12: Live Prototype Walkthrough
* **Slide Title:** **System Demonstration Walkthrough**
* **Key Bullet Points:**
  * Step 1: Citizen explores Pune GIS map and views Hinjewadi Survey 125/2 Dossier.
  * Step 2: Citizen uploads 7/12 extract; OCR extracts metadata with 91% confidence.
  * Step 3: Citizen applies for Building Permission (`BS-2026-BP-00101`).
  * Step 4: Planning Officer logs in, reviews file, and issues official approval.
  * Step 5: Citizen tracks approval timeline in real time.
* **Recommended Visual:** Montage of 4 screenshots (Map, Dossier, OCR Review, and Tracking Timeline).
* **Speaker Notes:**
  > *"Now let's examine the live working prototype, demonstrating the complete end-to-end user transaction in five simple steps."*

---

### Slide 13: Testing & Experimental Results
* **Slide Title:** **Verification, Test Results & Performance Metrics**
* **Key Bullet Points:**
  * **Automated Test Suite:** 7 test suites (21 unit/integration tests) with 100% pass rate.
  * **Manual Verification:** 14 rigorous test scenarios covering auth, RBAC, GIS, and workflows.
  * **Performance Metrics:**
    * Spatial query latency: $< 15$ ms for point-in-polygon queries.
    * GeoJSON payload: $< 200$ KB for 25 cadastral parcels.
    * OCR metadata parsing: $< 2.5$ seconds per scanned document.
* **Recommended Visual:** Testing summary table from [`13_TESTING.md`](file:///docs/13_TESTING.md#3-comprehensive-manual-test-case-execution-matrix).
* **Speaker Notes:**
  > *"The prototype was verified through 7 automated test suites and 14 end-to-end manual scenarios. Spatial lookups execute in under 15 milliseconds, proving the efficiency of our spatial indexing."*

---

### Slide 14: Limitations & Future Roadmap
* **Slide Title:** **Academic Prototype Limitations & Production Roadmap**
* **Key Bullet Points:**
  * **Current Prototype Limitations:** Synthetic dataset of 25 Pune parcels; simulated e-signatures; local Tesseract OCR on printed text.
  * **Production Roadmap:**
    * Live integration with National Land Record Modernization Programme (NLRMP) / Mahabhulekh VPN APIs.
    * Aadhaar eSign integration (eMudhra) for legally binding digital signatures.
    * Semantic vector search using `pgvector` and transformer models for handwritten *Modi script*.
    * Hybrid mobile app with geofenced mobile inspection for field talathis.
* **Recommended Visual:** Roadmap timeline from [`18_LIMITATIONS_AND_FUTURE_SCOPE.md`](file:///docs/18_LIMITATIONS_AND_FUTURE_SCOPE.md).
* **Speaker Notes:**
  > *"While our prototype fully demonstrates the single-window paradigm, production deployment will integrate live government VPN gateways, Aadhaar eSign, and dense vector embeddings for handwritten scripts."*

---

### Slide 15: Conclusion & Acknowledgments
* **Slide Title:** **Conclusion: Transforming Land Governance**
* **Key Bullet Points:**
  * Successfully demonstrated a working, parcel-centric single-window land service platform.
  * Unifies GIS cadastral mapping, AI document OCR, and automated municipal workflow routing.
  * Transforms weeks of bureaucratic paper chasing into an instant, transparent digital transaction.
  * Tagline: *"One Parcel. One Window."*
* **Recommended Visual:** Contact information, GitHub repository URL, and team member acknowledgments.
* **Speaker Notes:**
  > *"Bhumisetu proves that shifting from department silos to a parcel-centric model delivers transparency, eliminates title disputes, and empowers citizens. Thank you, and we welcome your questions."*

---

## Key Takeaways

1. **Structured 15-Slide Presentation:** Covers problem context, architectural choices, GIS/AI modules, security, database design, live demo, and testing results.
2. **Clear Speaking Notes:** Provides students with concise, professional talking tracks for every slide.
3. **Referenced Visual Assets:** Directly points to diagrams and tables created throughout the documentation suite.
4. **Honest Academic Tone:** Accurately distinguishes working prototype capabilities from future enterprise roadmaps.
5. **Examiner Focused:** Pre-emptively addresses common evaluator questions regarding database choices, OCR accuracy, and single-window routing.

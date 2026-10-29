# Bhumisetu Documentation Index (दस्तावेज सूची)

> **Academic Year:** 2026–27  
> **Project Title:** Bhumisetu: AI-Enabled, GIS-Based Integrated Land Information & Single-Window Land Service Platform  
> **Tagline:** *"One Parcel. One Window."*  

---

## Welcome to the Bhumisetu Technical Documentation

This repository contains the complete architectural, design, testing, and academic evaluation documentation for **Bhumisetu** (भूमिसेतू). The documentation is structured into six logical groups to guide students, academic mentors, project guides, and external examiners through every layer of the prototype.

*Note on Diagrams:* All architectural, sequence, and entity diagrams use standard GitHub-compatible Mermaid (` ```mermaid `) blocks. They render natively on GitHub or in markdown viewers with Mermaid support.

---

## Suggested Reading Order

### Group 1: Project Understanding & Governance
1. [01. Project Overview](01_PROJECT_OVERVIEW.md) — Problem statement, background of fragmented land services in India, objectives, scope, comparative analysis table, and a 2-minute viva elevator pitch.
2. [02. Requirements Specification](02_REQUIREMENTS.md) — 27 numbered functional requirements (FR), non-functional requirements (security, performance, usability), user stories per role, and MVP vs out-of-scope boundaries.
3. [03. User Roles & RBAC](03_USER_ROLES_AND_RBAC.md) — Technical definitions of all six roles, role $\times$ feature permission matrix, backend and frontend security enforcement, and demo credentials.

### Group 2: Architecture & Design
4. [04. System Architecture](04_SYSTEM_ARCHITECTURE.md) — High-level tiered architecture, layered component breakdown, Docker deployment topology, and end-to-end request lifecycle.
5. [05. Technology Stack](05_TECH_STACK.md) — Technology catalog with exact library versions from `pom.xml` and `package.json`, architectural justifications, and comparative trade-off analyses.
6. [06. Database Design & Spatial GIS](06_DATABASE_DESIGN.md) — Entity-Relationship (ER) diagram, comprehensive data dictionary for all 8 entities, PostGIS spatial geometries, and parcel-centric design rationale.
7. [07. REST API Documentation](07_API_DOCUMENTATION.md) — Complete catalog of 22 backend endpoints with roles, parameters, request/response JSON samples, and OpenAPI/Swagger references.

### Group 3: Module Deep Dives
8. [08. GIS & Cadastral Mapping Module](08_GIS_MODULE.md) — PostGIS spatial polygon storage, GeoJSON rendering with Leaflet, point-in-polygon queries, land-use color palettes, and map-to-dossier flow.
9. [09. AI & OCR Digitization Module](09_AI_MODULE.md) — Tesseract 5 OCR ingestion pipeline, heuristic regex parsers for bilingual 7/12 extracts, confidence scoring, intelligent fallback, and smart search.
10. [10. Single-Window Workflow Engine](10_WORKFLOW_ENGINE.md) — 5-state application lifecycle state machine, automated departmental routing table, officer decision queues, and dual-auditing architecture.
11. [11. Security & Audit Architecture](11_SECURITY_AND_AUDIT.md) — Stateless JWT authentication mechanics, salted BCrypt password hashing, 3-tier authorization, and immutable audit logs.

### Group 4: UI/UX, Testing & Deployment
12. [12. UI/UX & Design System Guide](12_UI_UX_GUIDE.md) — E-governance design system, color palette tokens, sitemap, user journey diagram, and 12-screen catalog.
13. [13. Testing & Verification Suite](13_TESTING.md) — Testing strategy, 7 automated JUnit/integration test suites, and 14 comprehensive manual test cases covering all critical paths.
14. [14. Deployment & Operation Guide](14_DEPLOYMENT_AND_SETUP.md) — System prerequisites, Docker Compose deployment, zero-setup local dev with H2/H2GIS, environment variables, and troubleshooting.

### Group 5: Academic Presentation & Viva Support
15. [15. Timed Demonstration Script](15_DEMO_SCRIPT.md) — Step-by-step 5-minute timed demo script with exact click streams, talk tracks, and fallback contingencies.
16. [16. Presentation Slide Outline](16_PRESENTATION_OUTLINE.md) — 15-slide presentation deck outline with speaking notes and recommended visual placements.
17. [17. Comprehensive Viva Q&A Guide](17_VIVA_QUESTIONS.md) — 43 rigorous academic and technical viva questions with honest, project-grounded answers.
18. [18. Limitations & Future Scope](18_LIMITATIONS_AND_FUTURE_SCOPE.md) — Transparent prototype constraints and a forward-looking 4-phase engineering roadmap.
19. [19. Technical & Domain Glossary](19_GLOSSARY.md) — Alphabetical dictionary defining 45 land revenue and computer science terms.

### Group 6: Report Templates & Assets
* [Project Report Template](PROJECT_REPORT_TEMPLATE.md) — Complete final-year project report structure aligning with university guidelines.
* [Screenshots Shotlist](screenshots/SHOTLIST.md) — Comprehensive catalog of interface screenshots required for the report and slides.

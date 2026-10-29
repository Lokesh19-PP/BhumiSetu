# Bhumisetu Documentation Index (दस्तावेज सूची)

> **Academic Year:** 2026–27  
> **Project Title:** Bhumisetu: AI-Enabled, GIS-Based Integrated Land Information & Single-Window Land Service Platform  
> **Tagline:** *"One Parcel. One Window."*  

---

## Welcome to the Bhumisetu Technical Documentation

This repository contains the complete architectural, design, testing, and academic evaluation documentation for **Bhumisetu** (भूमिसेतू). The documentation is structured into six logical groups to guide students, academic mentors, project guides, and external examiners through every layer of the prototype.

---

## Suggested Reading Order

### Group 1: Project Understanding & Governance
1. [01. Project Overview](01_PROJECT_OVERVIEW.md) — Problem statement, fragmented land administration in India, objectives, scope, comparative analysis, and a 2-minute viva elevator pitch.
2. [02. Requirements Specification](02_REQUIREMENTS.md) — 27 numbered functional requirements (FR), non-functional requirements (security, performance, usability), user stories per role, and MVP vs out-of-scope boundaries.
3. [03. User Roles & RBAC](03_USER_ROLES_AND_RBAC.md) — Technical definitions of all six roles, role $\times$ feature permission matrix, backend and frontend security enforcement, and demo credentials.

### Group 2: Architecture & Design
4. [04. System Architecture](04_SYSTEM_ARCHITECTURE.md) *(Coming next)* — High-level tiered architecture, layered component breakdown, Docker deployment topology, and end-to-end request lifecycle.
5. [05. Technology Stack](05_TECH_STACK.md) *(Coming next)* — Technology catalog with exact library versions, architectural justifications, and comparative trade-off analyses.
6. [06. Database Design & Spatial GIS](06_DATABASE_DESIGN.md) *(Coming next)* — Entity-Relationship (ER) diagram, comprehensive data dictionary, PostGIS spatial geometries, and parcel-centric design rationale.
7. [07. REST API Documentation](07_API_DOCUMENTATION.md) *(Coming next)* — Complete catalog of backend endpoints with roles, parameters, request/response JSON samples, and OpenAPI/Swagger references.

### Group 3: Module Deep Dives
8. [08. GIS & Cadastral Mapping Module](08_GIS_MODULE.md) *(Coming next)* — PostGIS spatial polygon storage, GeoJSON rendering with Leaflet, point-in-polygon queries, and map-to-dossier flow.
9. [09. AI & OCR Digitization Module](09_AI_MODULE.md) *(Coming next)* — Tesseract 5 OCR ingestion pipeline, heuristic regex parsers for 7/12 extracts, confidence scoring, and smart search.
10. [10. Single-Window Workflow Engine](10_WORKFLOW_ENGINE.md) *(Coming next)* — Application state lifecycle, automated departmental routing, officer decision queues, and audit timelines.
11. [11. Security & Audit Architecture](11_SECURITY_AND_AUDIT.md) *(Coming next)* — JWT authentication mechanics, BCrypt password hashing, method-level authorization, and immutable audit logs.

### Group 4: UI/UX, Testing & Deployment
12. [12. UI/UX & Design System Guide](12_UI_UX_GUIDE.md) *(Coming next)* — E-governance design system, color palette tokens, sitemap, and screen catalog.
13. [13. Testing & Verification Suite](13_TESTING.md) *(Coming next)* — Testing strategy, automated unit/integration test coverage, and comprehensive manual test cases.
14. [14. Deployment & Operation Guide](14_DEPLOYMENT_AND_SETUP.md) *(Coming next)* — Prerequisites, Docker Compose deployment, local dev setup (with H2/H2GIS and PostgreSQL/PostGIS), and troubleshooting.

### Group 5: Academic Presentation & Viva Support
15. [15. Demo Script & Walkthrough](15_DEMO_SCRIPT.md) *(Coming next)* — Step-by-step 5-minute timed demo script with exact click streams, talk tracks, and fallback contingencies.
16. [16. Presentation Slide Outline](16_PRESENTATION_OUTLINE.md) *(Coming next)* — 15-slide presentation deck outline with speaking notes and recommended visual placements.
17. [17. Comprehensive Viva Q&A Guide](17_VIVA_QUESTIONS.md) *(Coming next)* — 40+ rigorous academic and technical viva questions with honest, project-grounded answers.
18. [18. Limitations & Future Scope](18_LIMITATIONS_AND_FUTURE_SCOPE.md) *(Coming next)* — Transparent prototype constraints and a forward-looking engineering roadmap.
19. [19. Technical Glossary](19_GLOSSARY.md) *(Coming next)* — Alphabetical dictionary defining all domain and technical terminology used across the project.

### Group 6: Report Templates & Assets
* [Project Report Template](PROJECT_REPORT_TEMPLATE.md) *(Coming next)* — Ready-to-adapt final-year project report structure aligning with university guidelines.
* [Screenshots Shotlist](screenshots/SHOTLIST.md) *(Coming next)* — Comprehensive catalog of interface screenshots required for the report and slides.

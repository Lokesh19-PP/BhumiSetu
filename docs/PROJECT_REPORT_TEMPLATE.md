# Final-Year Engineering Project Report Template — Bhumisetu (भूमिसेतू)

> **Academic Year:** 2026–27  
> **Degree:** Bachelor of Engineering / Technology in Computer Science & Engineering / Information Technology  
> **Project Title:** Bhumisetu: AI-Enabled, GIS-Based Integrated Land Information & Single-Window Land Service Platform  
> **Tagline:** *"One Parcel. One Window."*  

---

## What This Document Covers

This document provides a complete, standardized university project report template tailored for final-year engineering students. It synthesizes all technical, architectural, and experimental findings from the Bhumisetu documentation suite into standard university dissertation chapters: Abstract, Introduction, Literature Survey, System Design, Implementation, Testing, Results, and Future Scope. Each chapter includes ready-to-use prose and cross-references pointing directly to the corresponding deep-dive technical documents in `/docs/`.

---

# [UNIVERSITY / INSTITUTE NAME]
### [DEPARTMENT OF COMPUTER ENGINEERING / INFORMATION TECHNOLOGY]

---

## PROJECT REPORT ON

# **BHUMISETU (भूमिसेतू)**
### **AI-Enabled, GIS-Based Integrated Land Information & Single-Window Land Service Platform**

*Submitted in partial fulfillment of the requirements for the award of the degree of*  
**BACHELOR OF ENGINEERING IN COMPUTER ENGINEERING**

---

### **Submitted by:**
* **Student Name 1** (Roll No: XXXXX)
* **Student Name 2** (Roll No: XXXXX)
* **Student Name 3** (Roll No: XXXXX)
* **Student Name 4** (Roll No: XXXXX)

### **Under the Guidance of:**
**Prof. [Guide Name]**  
*Department of Computer Engineering*  
[Institute Name, City] — Academic Year 2026–2027

---

## CERTIFICATE OF APPROVAL

This is to certify that the project entitled **"Bhumisetu: AI-Enabled, GIS-Based Integrated Land Information & Single-Window Land Service Platform"** is a bona fide work carried out by **[Student Names]** in partial fulfillment of the requirements for the award of the degree of **Bachelor of Engineering in Computer Engineering** from **[University Name]** during the academic year 2026–2027.

\
__________________________  
**Prof. [Guide Name]**  
*Project Guide*

\
__________________________  
**Prof. [HOD Name]**  
*Head of Department*

\
__________________________  
**Internal Examiner**

\
__________________________  
**External Examiner**

---

## ABSTRACT

In India, land governance and citizen-facing land services are severely fragmented across independent departmental silos. While state governments have digitized textual Records of Rights (such as Maharashtra’s *Mahabhulekh* and Karnataka’s *Bhoomi*), these portals function merely as read-only record viewers. A citizen seeking to develop a plot must physically navigate between the Revenue Department (for 7/12 extracts and Non-Agricultural conversions), Town Planning (for sanctioned building permissions and FSI compliance), the Sub-Registrar (for registered title deeds), and public utility boards (for water connections). Each authority conducts redundant paper scrutiny without spatial cross-verification, resulting in administrative delays, corruption, and pervasive property title disputes.

To resolve these systemic challenges, this project presents **Bhumisetu** (*"Bridge to Land Services"*), an integrated, parcel-centric single-window platform anchored by the principle: **"One Parcel. One Window."** Rather than organizing records by government department, Bhumisetu organizes all municipal, revenue, and utility records around the canonical **Land Parcel**, uniquely identified by its spatial boundary polygon and its 14-character **ULPIN** (Unique Land Parcel Identification Number). 

The platform features three foundational technical innovations:
1. **Interactive GIS Cadastre:** Implemented in PostgreSQL 16 with PostGIS 3.4 and rendered via Leaflet vector polygon layers, enabling microsecond spatial point-in-polygon (`ST_Contains`) and bounding box queries color-coded by land use.
2. **AI-Driven Document Digitization:** An optical character recognition (OCR) pipeline utilizing Tesseract 5 and custom bilingual (Marathi/English) heuristic parsers that extracts cadastral metadata (ULPIN, survey numbers, areas, owners) with calculated confidence scores.
3. **Automated Single-Window Workflow Engine:** A deterministic state machine that automatically routes citizen service requests to designated municipal officer queues based on service type, secured by stateless JWT Role-Based Access Control (RBAC) and immutable system audit trails.

The working prototype was implemented using Java 21, Spring Boot 3, React 19, and Tailwind CSS, verified through seven automated test suites and fourteen manual verification scenarios across twenty-five realistic Pune municipal cadastral parcels. Experimental results demonstrate sub-15ms spatial query latency and sub-3s document OCR extraction, validating the architecture's suitability for enterprise public-sector deployment.

---

## TABLE OF CONTENTS

* **Certificate of Approval**
* **Abstract**
* **List of Figures & Tables**
* **1. Introduction**
  * 1.1 Background & Domain Context
  * 1.2 Problem Statement
  * 1.3 Project Motivation
  * 1.4 Objectives of the Project
  * 1.5 Scope & Deliverables
* **2. Literature Survey & Existing Systems**
  * 2.1 Study of State Land Portals (Mahabhulekh, AnyRoR, Bhoomi)
  * 2.2 Digital India Land Records Modernization Programme (DILRMP)
  * 2.3 Limitations of Current Approaches
  * 2.4 Comparative Analysis Table
* **3. System Requirements & Specifications**
  * 3.1 Functional Requirements (FR-1 to FR-27)
  * 3.2 Non-Functional Requirements (Security, Performance, Usability)
  * 3.3 User Stories per Role Persona
  * 3.4 Minimum Viable Product vs. Out-of-Scope Roadmap
* **4. System Architecture & Design**
  * 4.1 High-Level Tiered Architecture
  * 4.2 Spatial Cadastral Design & PostGIS Storage
  * 4.3 Database Entity-Relationship (ER) Model & Data Dictionary
  * 4.4 RESTful Web API Specification
  * 4.5 Deployment Topology (Docker Compose)
* **5. Methodology & Implementation**
  * 5.1 GIS Cadastral Vector Engine & Leaflet Rendering
  * 5.2 AI Document Ingestion & Heuristic Regex Extractor
  * 5.3 Automated Single-Window Workflow Engine
  * 5.4 Security Architecture, JWT & Multi-Layered RBAC
  * 5.5 Dual-Auditing Architecture
* **6. Testing, Results & Discussion**
  * 6.1 Testing Methodology & Automated Test Suites
  * 6.2 Comprehensive Manual Test-Case Execution Matrix
  * 6.3 Performance Metrics & Latency Evaluation
* **7. Conclusion & Future Scope**
  * 7.1 Achievements & Conclusion
  * 7.2 Current Prototype Limitations
  * 7.3 Phased Future Engineering Roadmap
* **References & Bibliography**

---

## CHAPTER-BY-CHAPTER CONTENT SYNTHESIS & REPOSITORY MAPPING

### Chapter 1: Introduction
* **Source Document:** [`01_PROJECT_OVERVIEW.md`](file:///docs/01_PROJECT_OVERVIEW.md)
* **Key Content to Incorporate:**
  * Background of India's land administration challenges and fragmented departmental desks.
  * Formal definition of ULPIN, GIS, PostGIS, GeoJSON, and OCR.
  * Formal Problem Statement and Project Objectives.
  * Include the diagram showing fragmented department silos vs the parcel-centric core model.

### Chapter 2: Literature Survey & Existing Systems
* **Source Document:** [`01_PROJECT_OVERVIEW.md`](file:///docs/01_PROJECT_OVERVIEW.md#7-comparative-analysis-ordinary-portals-vs-bhumisetu) and [`18_LIMITATIONS_AND_FUTURE_SCOPE.md`](file:///docs/18_LIMITATIONS_AND_FUTURE_SCOPE.md)
* **Key Content to Incorporate:**
  * Review of National Land Records Modernization Programme (NLRMP/DILRMP).
  * In-depth comparison table: Mahabhulekh vs Municipal Town Planning portals vs Bhumisetu.
  * Presumptive vs conclusive titling in India (Torrens system context).

### Chapter 3: System Requirements & Specifications
* **Source Document:** [`02_REQUIREMENTS.md`](file:///docs/02_REQUIREMENTS.md) and [`03_USER_ROLES_AND_RBAC.md`](file:///docs/03_USER_ROLES_AND_RBAC.md)
* **Key Content to Incorporate:**
  * Enumerate all 27 numbered Functional Requirements (FR-1 through FR-27).
  * Non-Functional Requirements (NFR-SEC, NFR-PERF, NFR-USA, NFR-SCA).
  * User Persona stories for Citizens, Revenue Officers, Planning Officers, Tree Officers, Utility Engineers, and Administrators.
  * Include the comprehensive Role $\times$ Feature Permission Matrix.

### Chapter 4: System Architecture & Design
* **Source Documents:** [`04_SYSTEM_ARCHITECTURE.md`](file:///docs/04_SYSTEM_ARCHITECTURE.md), [`05_TECH_STACK.md`](file:///docs/05_TECH_STACK.md), and [`06_DATABASE_DESIGN.md`](file:///docs/06_DATABASE_DESIGN.md)
* **Key Content to Incorporate:**
  * Layered architecture diagram spanning React, Spring Security, Business Services, and PostGIS.
  * Trade-off analyses: PostgreSQL/PostGIS vs MongoDB; Spring Boot vs Node.js; Leaflet vs Google Maps.
  * Full Mermaid Entity-Relationship (ER) diagram connecting all eight database entities.
  * Complete data dictionaries for `land_parcels`, `ownership_records`, `documents`, `applications`, `departments`, `users`, `workflow_histories`, and `audit_logs`.
  * Spatial query mechanics: `ST_Contains`, `ST_Intersects`, and WGS-84 (SRID 4326) coordinate storage.

### Chapter 5: Methodology & Implementation
* **Source Documents:** [`08_GIS_MODULE.md`](file:///docs/08_GIS_MODULE.md), [`09_AI_MODULE.md`](file:///docs/09_AI_MODULE.md), [`10_WORKFLOW_ENGINE.md`](file:///docs/10_WORKFLOW_ENGINE.md), and [`11_SECURITY_AND_AUDIT.md`](file:///docs/11_SECURITY_AND_AUDIT.md)
* **Key Content to Incorporate:**
  * GIS Cadastral Vector Engine: GeoJSON serialization, centroid extraction, and Leaflet vector layer styling.
  * AI OCR Pipeline: Tesseract 5 integration via Tess4J, heuristic regex rules for bilingual extracts, and confidence calculation.
  * Workflow Engine: Finite State Machine (`SUBMITTED` $\rightarrow$ `APPROVED`), automated departmental routing table, and sequence diagram for Building Permission approval.
  * Security: HMAC-SHA256 stateless JWT generation, salted BCrypt password hashing, method-level `@PreAuthorize` assertions, and immutable audit logging.

### Chapter 6: Testing, Results & Discussion
* **Source Document:** [`13_TESTING.md`](file:///docs/13_TESTING.md) and [`docs/screenshots/SHOTLIST.md`](file:///docs/screenshots/SHOTLIST.md)
* **Key Content to Incorporate:**
  * Detailed breakdown of the seven automated test suites in the codebase.
  * Full 14-scenario manual test execution matrix with step-by-step results and PASS status.
  * Experimental performance findings: sub-15ms spatial query latency and sub-3s OCR processing time.
  * Insert corresponding screenshots captured according to the SHOTLIST catalog.

### Chapter 7: Conclusion & Future Scope
* **Source Document:** [`18_LIMITATIONS_AND_FUTURE_SCOPE.md`](file:///docs/18_LIMITATIONS_AND_FUTURE_SCOPE.md)
* **Key Content to Incorporate:**
  * Summary of project contributions and problem resolution.
  * Honest evaluation of prototype limitations (synthetic 25 parcels, local disk storage, simulated e-signatures).
  * Detailed four-phase engineering roadmap: real-time DILRMP API synchronization, Aadhaar eSign (eMudhra), `pgvector` semantic search, mobile field inspection app, and Hyperledger Fabric blockchain auditing.

---

## REFERENCES & BIBLIOGRAPHY

1. **Department of Land Resources (DoLR), Ministry of Rural Development, Government of India.** (2021). *Unique Land Parcel Identification Number (ULPIN) Technical Standard Specifications & Operational Guidelines.* New Delhi: Government of India.
2. **Open Geospatial Consortium (OGC).** (2011). *OpenGIS Implementation Standard for Geographic information - Simple feature access - Part 1: Common architecture (OGC 06-103r4).*
3. **PostGIS Project Steering Committee.** (2024). *PostGIS 3.4 Spatial Database Extender for PostgreSQL Documentation.* Available online: `https://postgis.net/documentation/`
4. **Smith, R.** (2007). *An Overview of the Tesseract OCR Engine.* In Proceedings of the Ninth International Conference on Document Analysis and Recognition (ICDAR 2007), IEEE, Curitiba, Brazil, pp. 629–633.
5. **Spring Boot Engineering Team.** (2024). *Spring Boot Reference Documentation (Version 3.3.4).* VMware Tanzu. Available online: `https://docs.spring.io/spring-boot/docs/3.3.4/reference/html/`
6. **React Engineering Team.** (2024). *React Documentation: Components, State and Declarative Rendering (React 19).* Meta Open Source.
7. **National Council of Applied Economic Research (NCAER).** (2020). *NCAER Land Records and Services Index (N-LRSI 2020).* New Delhi: NCAER.
8. **Mishra, P., & Suhag, R.** (2017). *Land Records and Titles in India: Governance Challenges and Technical Solutions.* PRS Legislative Research, New Delhi.
9. **Internet Engineering Task Force (IETF).** (2015). *JSON Web Token (JWT) - RFC 7519.* IETF Standards Track.
10. **Provos, N., & Mazières, D.** (1999). *A Future-Adaptable Password Scheme.* In Proceedings of the FREENIX Track: 1999 USENIX Annual Technical Conference, Monterey, California, pp. 81–91.

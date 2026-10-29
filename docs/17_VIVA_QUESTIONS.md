# 17. Comprehensive Viva & Guide Examination Q&A — Bhumisetu (भूमिसेतू)

> **Academic Year:** 2026–27  
> **Project Title:** Bhumisetu: AI-Enabled, GIS-Based Integrated Land Information & Single-Window Land Service Platform  
> **Tagline:** *"One Parcel. One Window."*  

---

## What This Document Covers

This document provides a comprehensive compendium of 43 rigorous, academic viva-voce questions and project-grounded answers. Organized into eight categories, it equips final-year students with precise, technically accurate, and candid responses covering problem motivation, GIS spatial theory, OCR heuristics, security enforcement, and tricky examiner trap questions.

---

## Section 1: Problem Statement & Domain Context

#### Q1: What is the primary problem Bhumisetu solves that existing portals like Mahabhulekh do not?
**Answer:** Existing state portals like Mahabhulekh are read-only textual record viewers. They do not allow citizens to apply for municipal permissions, they lack interactive cadastral GIS polygon layers, and they remain isolated from town planning and utility boards. Bhumisetu is a transactional, parcel-centric single-window platform where citizens can discover parcels, verify AI-digitized extracts, apply for multi-department services, and track approvals in one place.

#### Q2: What is ULPIN, and why is it crucial for Indian land governance?
**Answer:** ULPIN stands for **Unique Land Parcel Identification Number**. Often referred to as the *"Aadhaar for Land"*, it is a 14-character alphanumeric identifier generated from the geographic latitude and longitude coordinates of a parcel's boundary vertices. It uniquely identifies every plot of land in India, preventing duplicate survey numbers across different revenue villages.

#### Q3: What is a 7/12 (Satbara) extract?
**Answer:** A 7/12 extract is an official land register document maintained by the Revenue Department in Maharashtra and Gujarat under the Land Revenue Code. Form VII records ownership details, tenancy rights, and liabilities, while Form XII records agricultural crop classifications, uncultivated land, and irrigation sources.

#### Q4: Why do title disputes occur frequently in India?
**Answer:** India practices **presumptive land titling** rather than conclusive titling. A registered sale deed merely registers the financial transaction between two parties, not the guaranteed ownership of the state. Because spatial cadastral maps, revenue mutation registers, and municipal encumbrances exist in separate departments, conflicting claims easily emerge.

#### Q5: Who are the target user cohorts of Bhumisetu?
**Answer:** Citizens/Property Buyers, Revenue Officers (Tahsildars/Talathis), Town Planning Officers (Architects/Engineers), Urban Tree Authority Officers, Utility Engineers (Water Supply Board), and Municipal System Administrators.

---

## Section 2: Architecture & Design Decisions

#### Q6: Explain the architectural style of Bhumisetu.
**Answer:** Bhumisetu implements a decoupled, layered client-server architecture. The presentation tier is a React 19 Single Page Application (SPA) with Leaflet GIS mapping; the API and business tier is an enterprise Spring Boot 3 REST application secured with stateless JWT tokens; and the data tier is a relational and spatial PostgreSQL 16 database running PostGIS 3.4 extensions.

#### Q7: Why did you build a decoupled SPA and REST API instead of a server-rendered application like Thymeleaf or JSP?
**Answer:** Cadastral GIS exploration requires intense client-side responsiveness. Navigating vector parcel polygons, clicking map features, and filtering officer queues requires instant UI updates without jarring full-page browser reloads. A REST API also enables future integration with native mobile apps for on-ground field officers.

#### Q8: What does "Parcel-Centric Architecture" mean?
**Answer:** In traditional department-centric software, records are organized around departmental file numbers. In Bhumisetu, the physical **Land Parcel** (identified by its spatial polygon and ULPIN) is the root entity. Ownership chains, scanned title deeds, non-agricultural orders, and municipal building sanctions all hang off the parcel as child foreign keys.

#### Q9: How are microservices different from your current architecture?
**Answer:** Bhumisetu is structured as a modular monolith. It maintains distinct domain packages (`parcel`, `service`, `security`, `ai`) within a single deployable Spring Boot application. This avoids distributed transaction complexities (e.g., SAGA patterns) while maintaining clean architectural separation of concerns that could be split into microservices in the future.

#### Q10: How is containerization used in your project?
**Answer:** We provide a standard `docker-compose.yml` that orchestrates three isolated services: `postgis` (database), `backend` (Spring Boot API with Tesseract), and `frontend` (Nginx serving the React bundle), interconnected via an internal bridge network with persistent named volumes.

---

## Section 3: GIS & Spatial Database (PostGIS)

#### Q11: Why is PostgreSQL with PostGIS better suited for this project than MongoDB?
**Answer:** Land ownership represents high-value legal property that demands strict ACID transactional guarantees, foreign key relational integrity, and standard OGC-compliant spatial operations. While MongoDB supports basic GeoJSON queries, PostGIS provides industrial-strength topological functions (`ST_Contains`, `ST_Intersects`, `ST_MakeEnvelope`) backed by spatial GIST indexes that resolve queries in single-digit milliseconds.

#### Q12: What coordinate reference system (CRS) does Bhumisetu use?
**Answer:** We use **WGS-84 (World Geodetic System 1984)**, designated by standard **EPSG / SRID 4326**. Coordinates are stored in decimal degrees as `(Longitude, Latitude)`.

#### Q13: How does the point-in-polygon query work when a user clicks the map?
**Answer:** The frontend Leaflet map captures the clicked GPS coordinate `(lat, lon)` and passes it to `/api/parcels/spatial/point`. The backend uses PostGIS `ST_Contains(boundary, ST_SetSRID(ST_Point(lon, lat), 4326))`. The spatial GIST index rapidly narrows the search to the exact polygon containing that point.

#### Q14: What is a spatial GIST index, and why is it necessary?
**Answer:** GIST stands for **Generalized Search Tree**. Without a spatial index, determining whether a coordinate falls inside a polygon requires sequentially testing every vertex of every parcel in the entire database. A GIST index builds a hierarchical R-Tree of bounding boxes, allowing the database to prune non-intersecting parcels in logarithmic time $O(\log N)$.

#### Q15: How does the backend convert JTS Polygons into GeoJSON for Leaflet?
**Answer:** In `ParcelService.java`, the backend extracts the exterior ring coordinate array from the JTS `Polygon`, formats them into standard GeoJSON coordinates `[[[lon, lat], ...]]`, wraps them with cadastral properties (ULPIN, area, zoning, owner), and packages them into a `GeoJsonFeatureCollection`.

#### Q16: How do you handle parcels with curved boundaries or complex shapes?
**Answer:** In standard vector GIS, curves are represented as piecewise linear approximations—dense sequences of linear coordinates forming closed polygons. PostGIS supports complex polygons with hundreds of vertices, including inner rings representing holes (e.g., a lake or enclave inside a parcel).

---

## Section 4: AI & OCR Document Digitization

#### Q17: What is actually "AI" in your document digitizer?
**Answer:** Our AI subsystem utilizes **Optical Character Recognition (OCR)** powered by Tesseract 5 (via Tess4J) combined with a **heuristic natural language extraction engine**. Tesseract uses deep LSTM (Long Short-Term Memory) neural network models trained on text line images to recognize characters. Our metadata extractor then parses these character sequences using pattern recognition rules, language dictionaries, and confidence scoring.

#### Q18: How does the heuristic regex extractor handle bilingual (Marathi and English) documents?
**Answer:** In `MetadataExtractorService.java`, patterns support Unicode Devanagari character ranges (`\p{IsDevanagari}`) alongside English phrases. For instance, to detect a 7/12 extract, it searches for tokens: `VII-XII`, `SATBARA`, `7/12`, and `सात-बारा`. For village names, it scans after `गाव` or `Village` and validates against a dictionary of known revenue villages.

#### Q19: How is the confidence score calculated?
**Answer:** Every extracted field receives a confidence weight between `0.0` and `1.0`. Highly specific patterns (like a 14-char ULPIN matching `MH-[A-Z]{3}-...`) receive `0.98`, while secondary fallback lookups receive `0.50` to `0.70`. The composite confidence score is the arithmetic mean of all extracted field weights.

#### Q20: What is your fallback mechanism if Tesseract is not installed on the system?
**Answer:** In `OcrService.java`, the OCR call is wrapped in a `try-catch` block capturing any native library linkage error. If Tesseract binaries are missing, the system activates an intelligent rule-based fallback that inspects the file name and returns official digitized text for demonstration continuity.

#### Q21: What are the primary failure cases of your current OCR module?
**Answer:** 
1. Cursive handwritten Marathi (*Modi script*) common in historical land registers.
2. Low-resolution camera photos with shadows, perspective skew, or torn edges.
3. Complex nested tables where plain OCR flattens row and column alignments.

#### Q22: How could you upgrade this OCR system for production?
**Answer:** In production, we would replace local Tesseract with a fine-tuned vision-language transformer like **Donut** or **TrOCR** trained on Indian land record datasets, combined with OpenCV image pre-processing (deskewing, binarization, contrast adjustment).

---

## Section 5: Workflow Engine & Departmental Routing

#### Q23: What are the five states of an application in Bhumisetu?
**Answer:** 
1. `SUBMITTED`: Newly created by the citizen.
2. `UNDER_REVIEW`: Officer has opened the file for formal scrutiny.
3. `INFO_REQUESTED`: Officer requests missing documents or clarifications.
4. `APPROVED`: Regulatory compliance verified and municipal sanction granted.
5. `REJECTED`: Application denied with mandatory legal reasons.

#### Q24: How does automated departmental routing work?
**Answer:** In `ApplicationService.java`, the routing engine uses a switch on the `ServiceType`:
* `BUILDING_PERMISSION` $\rightarrow$ routes to `PLANNING` department (`ROLE_PLANNING_OFFICER`).
* `LAND_USE_CHANGE` $\rightarrow$ routes to `REVENUE` department (`ROLE_REVENUE_OFFICER`).
* `WATER_CONNECTION` $\rightarrow$ routes to `UTILITY` department (`ROLE_UTILITY_OFFICER`).

#### Q25: How does the system generate unique application tracking numbers?
**Answer:** The system generates standardized alphanumeric codes formatted as `BS-YYYY-[SERVICE_CODE]-[SEQUENCE]`. For example, a Building Permission application submitted in 2026 receives `BS-2026-BP-00101`.

#### Q26: Can a citizen approve their own application using Postman or direct API calls?
**Answer:** **No.** The decision endpoint `/api/applications/{id}/decision` is protected by Spring Security at two levels: the URL filter chain rejects non-officer tokens, and the controller method enforces `@PreAuthorize("hasAnyRole('PLANNING_OFFICER', ...)")`. A citizen attempting this receives an immediate `HTTP 403 Forbidden`.

#### Q27: What is the difference between `WorkflowHistory` and `AuditLog`?
**Answer:** `WorkflowHistory` tracks business domain state transitions for a specific application and is visible to the citizen on their tracking timeline. `AuditLog` is a system-wide, security and operational audit trail capturing user IDs, timestamps, and client IP addresses, accessible solely to System Administrators.

---

## Section 6: Security, Authentication & RBAC

#### Q28: How does JWT authentication work in Bhumisetu?
**Answer:** When a user logs in with valid credentials, `AuthController` generates an HMAC-SHA256 signed JSON Web Token containing the user's email subject and assigned role. The client stores this in `localStorage` and includes it in the `Authorization: Bearer <token>` header for all subsequent API requests. `AuthTokenFilter` intercepts and verifies the token on the server.

#### Q29: What happens if a JWT token is intercepted or tampered with?
**Answer:** If an attacker modifies the payload (for example, changing `"role": "ROLE_CITIZEN"` to `"ROLE_ADMIN"`), the HMAC-SHA256 signature verification fails because the attacker does not possess the server's private 256-bit secret key. Spring Security immediately rejects the request with `HTTP 401 Unauthorized`.

#### Q30: How are user passwords stored in the database?
**Answer:** Passwords are never stored in plaintext. They are hashed using **BCrypt** with a work factor of 10. BCrypt incorporates a 128-bit cryptographically secure random salt, ensuring identical passwords yield completely different database hashes and protecting against rainbow table attacks.

#### Q31: How do you prevent cross-departmental unauthorized approvals?
**Answer:** In `ApplicationService.java`, even if a user is an authenticated officer, the system verifies that the officer's assigned department matches the application's department (`application.getDepartment().getCode()`). A Planning Officer cannot approve a Revenue application.

#### Q32: How is SQL injection prevented?
**Answer:** All database operations utilize Spring Data JPA, Hibernate, and parameterized queries. User inputs are bound as strongly-typed parameters rather than concatenated into raw SQL strings.

#### Q33: How does your frontend protect officer routes?
**Answer:** The React frontend uses a `ProtectedRoute` component wrapping authenticated routes. If an unauthenticated user or an unauthorized role attempts to access `/officer` or `/admin`, they are redirected with an *"Access Restricted"* modal.

---

## Section 7: Database Design & Optimization

#### Q34: What is the primary key and foreign key structure in your database?
**Answer:** Every table uses a 64-bit synthetic primary key (`BIGSERIAL` / `Long`). Relationships use explicit foreign keys: `ownership_records.parcel_id`, `documents.parcel_id`, and `applications.parcel_id` all reference `land_parcels.id`.

#### Q35: Why did you use synthetic surrogate keys (`id`) instead of ULPIN as the primary key?
**Answer:** While ULPIN is unique, using synthetic numeric surrogate keys (`BIGINT`) provides superior indexing performance in B-Tree indexes, minimizes foreign key storage overhead across child tables, and protects database referential integrity if a government agency ever re-surveys and modifies a parcel's ULPIN string.

#### Q36: How do you prevent memory exhaustion when citizens upload large PDF scans?
**Answer:** We enforce strict multipart file constraints in `application.yml` (`max-file-size: 20MB`, `max-request-size: 20MB`) and stream file transfers directly to disk using `Files.newOutputStream()` rather than holding entire file byte buffers in JVM heap memory.

#### Q37: How does Bhumisetu support both H2 in-memory and PostgreSQL databases?
**Answer:** Through Spring profiles. The default profile connects to PostgreSQL with PostGIS via `hibernate-spatial`. The `dev` profile connects to an in-memory H2 database with H2GIS spatial functions initialized via our custom `H2GisInitializer` bean, allowing the platform to run with zero installation overhead.

---

## Section 8: Tricky, Skeptical & Examiner Trap Questions

#### Q38: "Is this connected to the real government ULPIN or Bhulekh database?"
**Answer:** *"No, sir/madam. State revenue APIs (like Maharashtra’s Mahabhulekh NIC API) operate on secure government intranet networks accessible only through official government VPN gateways and department-issued digital tokens. For our academic capstone prototype, we seeded 25 realistic cadastral parcels matching official Pune municipal coordinates (in Hinjewadi, Wakad, Baner) using the exact same standard ULPIN format and WGS-84 polygon geometries mandated by the Government of India."*

#### Q39: "Is the ownership verification in your system legally valid in court?"
**Answer:** *"In our prototype, verification represents administrative confirmation by a municipal officer. In a real-world legal rollout, this would be tied to the state's licensed Certifying Authority (such as eMudhra) using **Aadhaar eSign** or physical USB cryptotokens (DSC Class 3), which we have documented under Future Scope."*

#### Q40: "Why didn't you just use Python and Django, since GeoDjango has GIS built-in?"
**Answer:** *"While GeoDjango is popular for GIS scripting, Spring Boot 3 with Java 21 offers superior enterprise concurrency, strict compile-time type safety across complex financial/cadastral transactions, and seamless integration with native desktop OCR wrappers (Tess4J via JNA). Furthermore, Hibernate Spatial 6 fully matches GeoDjango's spatial capabilities while providing enterprise Spring Security RBAC out of the box."*

#### Q41: "What happens if two citizens submit conflicting applications for the exact same parcel?"
**Answer:** *"Because our architecture is parcel-centric, all applications reference the unique parcel ID. When an officer reviews an application, the unified Parcel Dossier displays all historical and active applications on that plot. If an active building permission is already pending or approved, the officer immediately spots the duplicate or conflicting claim and rejects it with remarks."*

#### Q42: "What happens if an uploaded document is blurry, upside-down, or completely unreadable?"
**Answer:** *"Tesseract will produce low-confidence or garbled text, resulting in low field confidence scores ($< 70\%$). Our system flags these extractions in red and prompts the user or officer to manually review and edit fields before saving. Furthermore, in production, an OpenCV image-preprocessing stage would automatically rotate and enhance low-contrast scans."*

#### Q43: "How does your system prevent a rogue officer from altering audit logs to hide corruption?"
**Answer:** *"The `audit_logs` table has no `UPDATE` or `DELETE` endpoints in the REST API. The Spring Data repository only exposes `save()` and read queries. In a production government deployment, audit logs would be continuously streamed to a write-once-read-many (WORM) storage bucket or a permissioned blockchain (like Hyperledger Fabric) to ensure tamper-proof mathematical immutability."*

---

## Key Takeaways

1. **43 Comprehensive Viva Answers:** Covers problem motivation, spatial GIS theory, OCR heuristics, workflow state machines, security, and database design.
2. **Honest & Grounded:** Clearly demarcates working prototype capabilities from future production integrations.
3. **Pre-Empts Examiner Trap Questions:** Directly addresses skeptical questions on legal validity, real government connectivity, and "what is actually AI".
4. **Highlights Architectural Strengths:** Emphasizes PostGIS spatial indexing, stateless JWT defense-in-depth, and parcel-centric domain modeling.
5. **Ready for Defense:** Formatted for rapid memorization and confident verbal delivery during project evaluation.

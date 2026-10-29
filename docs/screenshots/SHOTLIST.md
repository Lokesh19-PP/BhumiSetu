# Screenshots Shotlist & Asset Catalog — Bhumisetu (भूमिसेतू)

> **Academic Year:** 2026–27  
> **Project Title:** Bhumisetu: AI-Enabled, GIS-Based Integrated Land Information & Single-Window Land Service Platform  
> **Tagline:** *"One Parcel. One Window."*  

---

## What This Document Covers

This document details the complete inventory of visual screen captures required for the academic project report, presentation slide deck, and viva demonstration portfolio. For every screenshot, it specifies the target URL route, the user persona/role to authenticate as, the exact UI interaction state to capture, key visual elements to highlight, and the corresponding placement in the final-year report chapters and presentation slides.

---

## Master Screenshot Inventory

| Shot ID | Screen / Route | User Persona / Role | UI Interaction State | Visual Elements to Highlight | Report & Slide Placement |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **SHOT-01** | Landing Page (`/`) | Unauthenticated Visitor | Full viewport landing page hero | Hero headline: *"One Parcel. One Window."*, live statistics counters, and "Explore Map" primary CTA button. | Report: Ch. 1 (Introduction)<br/>Slide: 1, 4 |
| **SHOT-02** | Login Screen (`/login`) | Unauthenticated Visitor | Login card with demo shortcuts | Email/password form and the 6 one-click demo login buttons for rapid persona switching. | Report: Ch. 4 (Implementation)<br/>Slide: 10 |
| **SHOT-03** | GIS Cadastral Viewer (`/map`) | Public Visitor | 25 Pune parcels rendered on map | Leaflet map with colored polygon boundaries (Residential Blue, Commercial Amber, Agricultural Green) and layer legend. | Report: Ch. 3 (GIS Design)<br/>Slide: 7, 12 |
| **SHOT-04** | Cadastral Polygon Click Popup (`/map`) | Public Visitor | Parcel 125/2 selected with popup | Gold selection border on Survey 125/2, Hinjewadi; popup displaying ULPIN `MH-PUN-HIN-001` and "View Full Dossier" button. | Report: Ch. 3 (GIS Design)<br/>Slide: 7, 12 |
| **SHOT-05** | Unified Parcel Dossier (`/parcel/1`) | Public / Citizen | Full 360-degree legal dossier view | Header with ULPIN, cadastral properties, current ownership table (Ramesh Patil), verified documents list, and active applications. | Report: Ch. 3 & Ch. 4<br/>Slide: 4, 12 |
| **SHOT-06** | AI Document Upload & Scan (`/digitize`) | Citizen (`citizen@bhumisetu.in`) | Uploaded sample 7/12 extract | Side-by-side layout: original bilingual Marathi/English 7/12 image preview on left; "Run AI / OCR" CTA button. | Report: Ch. 4 (AI Digitization)<br/>Slide: 8, 12 |
| **SHOT-07** | OCR Extraction & Verification (`/digitize`) | Citizen (`citizen@bhumisetu.in`) | Extracted metadata with confidence | Parsed fields table (ULPIN, Survey No, Area, Village, Owners), green 90%+ confidence badges, and "Confirm & Save" button. | Report: Ch. 4 (AI Digitization)<br/>Slide: 8, 12 |
| **SHOT-08** | Smart Full-Text Search (`/search`) | Public Visitor | Search query for *"Ramesh Patil"* | Search input, filter facets (document type, village), matching result cards with yellow-highlighted text snippets. | Report: Ch. 4 (Search Module)<br/>Slide: 8 |
| **SHOT-09** | Application Wizard (`/apply`) | Citizen (`citizen@bhumisetu.in`) | Building Permission form filled | Step-by-step wizard: Parcel #1 selected, service type "Building Permission", height 18.5m, area 2100 sq.m, and submit button. | Report: Ch. 4 (Single-Window)<br/>Slide: 9, 12 |
| **SHOT-10** | Submission Confirmation Modal (`/apply`) | Citizen (`citizen@bhumisetu.in`) | Application successfully submitted | Modal displaying generated reference number `BS-2026-BP-XXXXX`, status `SUBMITTED`, and routed department `PLANNING`. | Report: Ch. 4 (Workflow)<br/>Slide: 9 |
| **SHOT-11** | Town Planning Officer Queue (`/officer`) | Planning Officer (`planning@bhumisetu.in`) | Filtered departmental queue | Casework table displaying only Town Planning files (`BP` prefix), status badges, applicant names, and "Review & Decide" action. | Report: Ch. 4 (Officer Module)<br/>Slide: 10, 12 |
| **SHOT-12** | Officer Decision Modal (`/officer`) | Planning Officer (`planning@bhumisetu.in`) | Decision form with remarks | Officer approval dialog: Action radio buttons (`APPROVE`, `REJECT`, `INFO_REQUESTED`), statutory remarks text box, and submit CTA. | Report: Ch. 4 (Workflow)<br/>Slide: 10 |
| **SHOT-13** | Public Application Tracking (`/track/:appNumber`) | Public / Citizen | Full lifecycle tracking timeline | Chronological visual stepper: `SUBMITTED` event by citizen, followed by green `APPROVED` badge with Planning Officer's remarks. | Report: Ch. 4 (Tracking)<br/>Slide: 12 |
| **SHOT-14** | Citizen Personal Dashboard (`/dashboard`) | Citizen (`citizen@bhumisetu.in`) | Citizen overview portal | Summary cards (Total Applications, In Review, Approved), list of active applications with progress bars, and quick actions. | Report: Ch. 4 (User Interface)<br/>Slide: 12 |
| **SHOT-15** | Admin Municipal Analytics (`/admin`) | Admin (`admin@bhumisetu.in`) | Executive charts & statistics | Recharts visual graphs: applications by service type, approval vs rejection ratios, and department processing velocity. | Report: Ch. 4 (Admin Analytics)<br/>Slide: 13 |
| **SHOT-16** | System Audit Log Explorer (`/admin`) | Admin (`admin@bhumisetu.in`) | Chronological audit log table | Audit records displaying user IDs, action names (`OFFICER_DECISION`, `DOCUMENT_OCR_DIGITIZED`), client IP addresses, and timestamps. | Report: Ch. 4 (Security & Audit)<br/>Slide: 10 |
| **SHOT-17** | Interactive Swagger UI (`/swagger-ui/index.html`) | Developer / Evaluator | OpenAPI 3.0 interactive console | Swagger endpoint groups (`GIS & Land Parcel`, `AI Document & OCR`, `Application & Workflow`) with "Authorize" dialog. | Report: Ch. 4 (API Design)<br/>Slide: 6 |

---

## Capture Guidelines & Recommended Settings
* **Browser Viewport:** Standard 1080p desktop display resolution (1920 $\times$ 1080) at 100% browser scaling.
* **Format:** 24-bit PNG with crisp typography (avoid lossy JPEG compression for data tables and text).
* **Naming Convention:** Save files into `/docs/screenshots/` using the exact identifier (e.g., `shot_03_gis_cadastral_map.png`).
* **Tooling:** Use Chrome DevTools Device Mode (Command Palette $\rightarrow$ *"Capture full size screenshot"*) or Windows Snipping Tool.

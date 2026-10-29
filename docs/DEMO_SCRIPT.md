# Bhumisetu (भूमिसेतु) — 5-Minute Guide Demonstration Script

This script walks through an end-to-end demonstration designed to highlight the core technical requirements of the final-year project:
1. **Parcel-Centric Concept** (everything anchors to cadastral polygons).
2. **Interactive PostGIS Spatial GIS Map** (coloring by land use, search-to-zoom).
3. **AI Optical Character Recognition (OCR)** (digitizing physical 7/12 extracts with confidence metrics and human-in-the-loop verification).
4. **Single-Window Citizen Application Wizard** (building permission submission).
5. **Role-Based Workflow & Officer Decision** (Planning Officer reviews, approves with comment, and citizen receives a verifiable digital sanction order).
6. **Executive Admin Analytics & Immutable Audit Trail** (Recharts graphs and security logs).

---

## Pre-requisites & Demo Accounts
All demo accounts are pre-seeded with password: `Demo@123`
| Persona | Email | Purpose |
| :--- | :--- | :--- |
| **Citizen** | `citizen@bhumisetu.in` | Land parcel owner (Ramesh Patil), submits application |
| **Planning Officer** | `planning@bhumisetu.in` | Town Planning officer (Anita Deshmukh), reviews & approves building permissions |
| **Revenue Officer** | `revenue@bhumisetu.in` | Tahsildar (Santosh Jadhav), oversees land-use conversions |
| **Utility Officer** | `utility@bhumisetu.in` | Water Department engineer |
| **Admin** | `admin@bhumisetu.in` | Municipal Commissioner oversight & analytics |

> **Pro-Tip**: Use the **"Demo Switcher"** button on the top right of the navigation bar to switch between personas in 1 click without typing passwords!

---

## 5-Minute Step-by-Step Flow

### Minute 0:00 - 1:00 — Project Concept & GIS Parcel Map
1. **Open Landing Page** (`http://localhost:5173` or `http://localhost:3000`).
   - *Key Talking Point*: Explain that Bhumisetu solves India's fragmented land governance by unifying municipal services under a **parcel-centric** model.
2. Click **"Explore GIS Map"** on the navbar or hero section (`/map`).
   - Observe the 25 realistic cadastral polygons around Pune (Hinjewadi, Baner, Wakad, Wagholi, Hadapsar, Kharadi).
   - Point out the color coding: Blue for Residential, Amber for Agricultural, Purple for Commercial.
   - Click on the Pune Presets pill: **"Hinjewadi IT Zone"**. The map smoothly flies to Hinjewadi.
3. Click on **Survey No. 125/2** (ULPIN `MH-PUN-HIN-001`).
   - The side drawer slides open showing parcel metadata, registered owner Ramesh Patil, area (3,450 m²), and active applications.
   - Click **"Open 360° Parcel Dossier"**.

---

### Minute 1:00 - 2:00 — Parcel Dossier Inspection
1. You are now on the **Parcel Dossier Page** (`/parcel/1`).
   - Show the interactive cadastral mini-map with exact coordinates.
   - Switch between the tabs:
     - **Overview**: Dimensions, administrative hierarchy (Village: Hinjewadi, Taluka: Mulshi, District: Pune).
     - **Ownership**: Khata No. 402, 100% undivided share of Ramesh Narayan Patil.
     - **Documents**: Existing deeds and tax receipts.
     - **Applications**: Service request history.
     - **History**: Mutation records and property transfers.
2. Note the **"Apply for Service"** button, which citizens can use directly from any parcel.

---

### Minute 2:00 - 3:00 — AI OCR Document Digitization
1. Click **"AI Digitize"** on the top navigation bar (`/digitize`).
   - *Key Talking Point*: Millions of land records in India exist as physical scans. Bhumisetu bridges the physical and digital domains using AI.
2. Click the orange button: **"Use Sample 7/12 Extract (1-Click Demo)"**.
   - Watch the animated OCR pipeline running in real-time.
   - The split-screen **Review & Verify Panel** appears:
     - Left: The authentic scanned Maharashtra Revenue 7/12 Satbara Extract. Toggle to "View OCR Text" to see the extracted text.
     - Right: Extracted metadata with **Confidence Badges** (Survey No: `125/2` [95%], ULPIN: `MH-PUN-HIN-001` [98%], Village: `Hinjewadi` [94%], Area: `3450 m²` [92%], Owner: `Ramesh Narayan Patil` [95%]).
3. Click **"Confirm & Link to Parcel Record"**.
   - The document is verified and linked permanently to the cadastral parcel.

---

### Minute 3:00 - 4:00 — Citizen Single-Window Application Submission
1. Ensure you are signed in as **Citizen** (`citizen@bhumisetu.in` via Demo Switcher).
2. Click **"My Dashboard"** -> **"Apply for Service"** (`/apply`).
   - **Step 1 (Service & Parcel)**: Select **"Building Permission"** (Town Planning Department). Choose parcel `Survey No. 125/2 — Hinjewadi`. Click Next.
   - **Step 2 (Parameters)**: Enter Built-up Area: `1200` m², Building Height: `15.0` m. Add remarks: *"Construction of G+4 commercial development."* Click Next.
   - **Step 3 (Review & Submit)**: Review the routing authority (Town Planning), check the Citizen Undertaking declaration, and click **"Confirm & Submit to Department"**.
3. A success confirmation appears with an Application Number (e.g. `BS-2026-BP-00106`).
4. Click **"Track Status Timeline"**. The vertical workflow timeline shows the initial **SUBMITTED** state.

---

### Minute 4:00 - 4:45 — Officer Scrutiny & Sanction Order
1. Switch to the **Planning Officer** persona:
   - Click **"Demo Switcher"** on the top right -> select **"Planning Officer (Anita Deshmukh)"**.
2. Notice the navigation changes to **"Officer Queue"** (`/officer`).
   - *Key Talking Point*: Role-Based Access Control (RBAC) dynamically adjusts the UI. Citizens can never access this queue.
3. In the Town Planning Pending Queue, find the newly submitted application (`BS-2026-BP-00106`).
4. Click **"Review"** to open the comprehensive scrutiny modal:
   - Inspect the submitted structural specifications (`1200 m²`, `15m` height) and parcel dossier.
   - Select **"APPROVE"**.
   - Note the pre-filled official remark: *"Sanction granted in compliance with PMRDA development regulations."*
   - Click **"Sign & Submit Decision"**.
5. The application is officially updated to **APPROVED**!

---

### Minute 4:45 - 5:00 — Verification & Executive Analytics
1. Switch back to **Citizen** (`citizen@bhumisetu.in`) and view `/track/BS-2026-BP-00106`.
   - The timeline now displays the green **APPROVED** badge signed by Planning Officer Anita Deshmukh.
   - The official **Digital Sanction Order & Certificate** card is unlocked, with sanction reference numbers and print/download actions!
2. Switch to **System Admin** (`admin@bhumisetu.in`) and open **"Admin Analytics"** (`/admin`).
   - Show the live **Recharts** charts: Applications by Service (Donut), Status Distribution (Bar), and Departmental Throughput.
   - Click the **"Immutable Audit Logs"** tab to show the tamper-evident chronological security log of all citizen submissions and officer sanctions with IP addresses.

---

## Key Answers to Potential Guide Questions

1. **"How does the GIS spatial integration work?"**
   - Parcels are stored in PostgreSQL using the PostGIS extension (`Polygon` geometries with SRID 4326). Queries use JTS (Java Topology Suite) and spatial indices for point-in-polygon (`ST_Contains`) and bounding-box (`ST_Intersects`) retrieval.
2. **"What if native Tesseract is not installed on the host machine?"**
   - The backend includes Tess4J for OCR, and automatically falls back to an intelligent rule/regex-based extractor if native libraries are unavailable. The demo is 100% resilient and will never crash.
3. **"How is RBAC enforced?"**
   - Spring Security uses method-level `@PreAuthorize("hasAnyRole(...)")`. Even if a citizen crafted an HTTP POST to `/api/applications/{id}/decision`, the backend throws a 403 Forbidden with security audit logging.

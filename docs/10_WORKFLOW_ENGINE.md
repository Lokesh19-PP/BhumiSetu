# 10. Single-Window Workflow Engine — Bhumisetu (भूमिसेतू)

> **Academic Year:** 2026–27  
> **Project Title:** Bhumisetu: AI-Enabled, GIS-Based Integrated Land Information & Single-Window Land Service Platform  
> **Tagline:** *"One Parcel. One Window."*  

---

## What This Document Covers

This document provides a comprehensive technical breakdown of the Single-Window Workflow Engine in Bhumisetu. It models the application lifecycle state machine, explains the deterministic routing table directing citizen service requests to municipal departments, diagrams the complete approval lifecycle, and contrasts the dual-auditing architecture composed of citizen-facing `WorkflowHistory` timelines and administrative `AuditLog` security records.

---

## 1. Application Lifecycle State Machine

Every land service application submitted through Bhumisetu progresses through a deterministic Finite State Machine (FSM) governed by `in.bhumisetu.domain.enums.ApplicationStatus`:

```mermaid
stateDiagram-v2
    [*] --> SUBMITTED: Citizen submits application via single-window wizard
    
    SUBMITTED --> UNDER_REVIEW: Department Officer opens file for formal scrutiny
    
    UNDER_REVIEW --> INFO_REQUESTED: Officer requests missing documents or clarifications
    INFO_REQUESTED --> UNDER_REVIEW: Citizen uploads required documents
    
    UNDER_REVIEW --> APPROVED: Officer validates compliance and grants formal sanction
    UNDER_REVIEW --> REJECTED: Officer denies application with mandatory legal reasons
    
    APPROVED --> [*]
    REJECTED --> [*]

    note right of SUBMITTED
        Generated tracking code:
        BS-2026-[CODE]-[SEQUENCE]
        Auto-assigned to department
    end note

    note right of APPROVED
        Legal sanction issued.
        Recorded in parcel dossier.
    end note
```

### State Definitions & Trigger Events

| Application Status | Triggering Event | Authorized Persona | Next Allowable States |
| :--- | :--- | :--- | :--- |
| **`SUBMITTED`** | Citizen completes the application wizard and uploads supporting files. | `ROLE_CITIZEN` | `UNDER_REVIEW` |
| **`UNDER_REVIEW`** | Department officer opens the application from their queue and initiates technical scrutiny. | Departmental Officer (`PLANNING`, `REVENUE`, `UTILITY`) or `ADMIN` | `INFO_REQUESTED`, `APPROVED`, `REJECTED` |
| **`INFO_REQUESTED`** | Officer discovers discrepancies (e.g., missing structural certificate, unverified mutation) and demands clarification. | Departmental Officer or `ADMIN` | `UNDER_REVIEW` |
| **`APPROVED`** | Officer confirms regulatory compliance and issues official municipal sanction. | Departmental Officer or `ADMIN` | Terminal State |
| **`REJECTED`** | Officer rejects the proposal due to non-compliance with bylaws or zoning restrictions. | Departmental Officer or `ADMIN` | Terminal State |

---

## 2. Deterministic Departmental Routing Table

In traditional municipal administration, citizens frequently submit applications to the wrong office or desk. Bhumisetu completely eliminates misdirection through **automated rule-based departmental routing** implemented in [`ApplicationService.java`](file:///backend/src/main/java/in/bhumisetu/service/ApplicationService.java#L46-L53):

```mermaid
graph LR
    subgraph Services [Citizen Service Types]
        BP[Building Permission]
        LU[Land-Use Change / NA]
        WC[Water & Sewerage Connection]
    end

    subgraph Router [Workflow Auto-Router]
        Engine{Switch on ServiceType}
    end

    subgraph Departments [Responsible Department]
        PlanDept[Town Planning & Municipal Sanctions<br/>Code: PLANNING]
        RevDept[Revenue & Land Records<br/>Code: REVENUE]
        UtilDept[Water Supply & Public Utilities<br/>Code: UTILITY]
    end

    subgraph OfficerQueues [Department Officer Role Queue]
        PlanQueue[ROLE_PLANNING_OFFICER Queue]
        RevQueue[ROLE_REVENUE_OFFICER Queue]
        UtilQueue[ROLE_UTILITY_OFFICER Queue]
    end

    BP --> Engine
    LU --> Engine
    WC --> Engine

    Engine -->|BP| PlanDept --> PlanQueue
    Engine -->|LU| RevDept --> RevQueue
    Engine -->|WC| UtilDept --> UtilQueue
```

### Routing Specification

| Citizen Service Type | Target Department | Department Code | Officer Role Required | Tracking Prefix | Review Jurisdiction & Bylaw Checks |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Building Permission** | Town Planning & Municipal Sanctions | `PLANNING` | `ROLE_PLANNING_OFFICER` | `BS-2026-BP-XXXXX` | Floor Space Index (FSI), setback distances, building height limits, structural stability. |
| **Land-Use Change (NA Conversion)** | Revenue & Land Records Department | `REVENUE` | `ROLE_REVENUE_OFFICER` | `BS-2026-LU-XXXXX` | Verification of 7/12 extract title, payment of agricultural cess, absence of revenue encumbrance. |
| **Water & Sewerage Connection** | Water Supply & Public Utilities | `UTILITY` | `ROLE_UTILITY_OFFICER` | `BS-2026-WC-XXXXX` | Distance to primary water mains, sewer gradient feasibility, pipeline diameter sanction. |

---

## 3. End-to-End Workflow Sequence: Building Permission Approval

The sequence diagram below details the entire transaction flow from citizen submission through officer review to public tracking verification:

```mermaid
sequenceDiagram
    autonumber
    actor C as Citizen (Ramesh Patil)
    participant UI as React Frontend
    participant AC as ApplicationController
    participant AS as ApplicationService
    participant DB as PostgreSQL
    actor O as Planning Officer (Neha Kulkarni)

    %% Citizen Submits
    C->>UI: Selects Parcel #125/2, fills Building Height (18.5m), Area (2100 sq.m)
    UI->>AC: POST /api/applications<br/>[Payload: parcelId=1, serviceType=BUILDING_PERMISSION]
    AC->>AS: createApplication(request, citizenUser)
    AS->>DB: Query Department by code 'PLANNING'
    AS->>AS: Generate App Number 'BS-2026-BP-00101'
    AS->>DB: INSERT INTO applications (status='SUBMITTED', department_id=2)
    AS->>DB: INSERT INTO workflow_histories (action='SUBMITTED', acted_by=citizenUser.id)
    AS->>DB: INSERT INTO audit_logs (action='APPLICATION_SUBMITTED')
    AS-->>UI: Return ApplicationDto (Status: SUBMITTED)
    UI-->>C: Display Success Modal with tracking number BS-2026-BP-00101

    %% Officer Processes
    Note over O,UI: Next morning: Planning Officer logs into Dashboard
    O->>UI: Opens Officer Review Queue
    UI->>AC: GET /api/applications/officer/queue
    AC->>AS: getOfficerQueue(officerUser, null)
    AS->>DB: SELECT * FROM applications WHERE department_id = 2
    DB-->>AS: Return list containing BS-2026-BP-00101
    AS-->>UI: Return applications list
    UI-->>O: Displays BS-2026-BP-00101 in Pending Review table

    %% Officer Reviews Dossier & Decides
    O->>UI: Clicks "Review Dossier & Decide"
    UI->>DB: GET /api/parcels/1/dossier
    O->>UI: Reviews ownership chain, zoning (COMMERCIAL), uploads
    O->>UI: Selects "APPROVE", enters remarks: "Sanctioned under FSI 1.8"
    UI->>AC: POST /api/applications/1/decision<br/>[Action: APPROVE, Remarks: "Sanctioned under FSI 1.8"]
    AC->>AS: takeDecision(1L, request, officerUser)
    AS->>AS: Validate officer.getRole() == PLANNING_OFFICER
    AS->>DB: UPDATE applications SET status='APPROVED', remarks='Sanctioned...'
    AS->>DB: INSERT INTO workflow_histories (action='APPROVED', acted_by=officerUser.id)
    AS->>DB: INSERT INTO audit_logs (action='OFFICER_DECISION')
    AS-->>UI: Return updated ApplicationDto
    UI-->>O: Toast: "Application BS-2026-BP-00101 Approved!"

    %% Citizen Tracks
    Note over C,UI: Citizen checks tracking portal
    C->>UI: Enters 'BS-2026-BP-00101' in Track Application page
    UI->>AC: GET /api/applications/track/BS-2026-BP-00101
    AC->>DB: Query application + complete workflow_histories
    DB-->>UI: Return ApplicationDto with 2 timeline events
    UI-->>C: Visual timeline shows: Submitted -> Approved by Neha Kulkarni!
```

---

## 4. Dual-Auditing Architecture: WorkflowHistory vs. AuditLog

Bhumisetu implements a sophisticated **dual-auditing** pattern that decouples business workflow events from system security logs:

```mermaid
graph TD
    subgraph ActionEvent [System Action / State Change]
        Event[Application Transition / Data Access]
    end

    subgraph BusinessAudit [1. Business Domain Audit]
        WH[(workflow_histories Table)]
        WH_Desc[Tracks Application Lifecycle<br/>Citizen-Visible Timeline<br/>Shows Officer Name, Action, Comments]
        WH --- WH_Desc
    end

    subgraph SecurityAudit [2. Security & Compliance Audit]
        AL[(audit_logs Table)]
        AL_Desc[Tracks Security & System Operations<br/>Admin-Only Inspection<br/>Records IP Address, User ID, HTTP Method]
        AL --- AL_Desc
    end

    Event -->|Business State Change| WH
    Event -->|Security / Compliance Trace| AL
```

### Architectural Comparison

| Attribute | `WorkflowHistory` (Business Audit) | `AuditLog` (Security Audit) |
| :--- | :--- | :--- |
| **Primary Audience** | **Citizens, Landowners, and Officers** | **System Administrators & Vigilance Officers** |
| **Target Entity** | Bound strictly to a single `Application` record | Spans all entities (`LandParcel`, `Document`, `User`, `Auth`) |
| **Visibility Scope** | Public / Authenticated tracking screens | Admin Dashboard only (`/api/admin/audit-logs`) |
| **Recorded Attributes** | `action`, `acted_by`, `comment`, `timestamp` | `action`, `user_id`, `user_email`, `ip_address`, `details`, `timestamp` |
| **Network Tracing** | Does not capture network attributes | Captures client IP address (`X-Forwarded-For` or remote socket) |
| **Lifecycle** | Cascades with application lifecycle | Permanently retained immutable system log |

---

## Key Takeaways

1. **Deterministic 5-State FSM:** Governs applications across `SUBMITTED`, `UNDER_REVIEW`, `INFO_REQUESTED`, `APPROVED`, and `REJECTED` states.
2. **Automated Departmental Routing:** Service types automatically map to Town Planning, Revenue, or Utility departments, eliminating human routing errors.
3. **Strict Separation of Privileges:** Citizens can never access officer queues or trigger approval decisions, returning `HTTP 403 Forbidden` on unauthorized calls.
4. **Transparent Public Tracking:** Anyone with a tracking code (`BS-2026-BP-XXXXX`) can view current status and chronological decision remarks.
5. **Dual-Auditing Architecture:** Separates citizen-visible business timelines (`workflow_histories`) from immutable security audit logs (`audit_logs`).

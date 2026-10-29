# 19. Technical & Domain Glossary — Bhumisetu (भूमिसेतू)

> **Academic Year:** 2026–27  
> **Project Title:** Bhumisetu: AI-Enabled, GIS-Based Integrated Land Information & Single-Window Land Service Platform  
> **Tagline:** *"One Parcel. One Window."*  

---

## What This Document Covers

This document provides an exhaustive, alphabetical technical and domain glossary for Bhumisetu. It defines all domain-specific Indian land administration terms, legal terminology, geographic information system (GIS) standards, security concepts, and software engineering terms utilized across the project's documentation, code, and academic presentations.

---

## Alphabetical Terminology Directory

### 7/12 Extract (Satbara Utara / सात-बारा उतारा)
An official land register document maintained by the Revenue Department in Maharashtra and Gujarat under the Land Revenue Code. Form VII records village name, survey number, occupant (owner) names, tenure, and registered mutation liabilities. Form XII records agricultural crop classifications, uncultivated land, and irrigation sources.

### 8-A Extract (Khate Pustika / खाते उतारा)
A revenue extract that aggregates all land parcels and survey numbers owned by a specific individual or family within a village, indicating their cumulative revenue assessment and tax liability.

### Aadhaar
A 12-digit unique identity number issued by the Unique Identification Authority of India (UIDAI) based on biometric and demographic data. In Bhumisetu, Aadhaar numbers are stored in a privacy-compliant masked format (e.g., `XXXX-XXXX-4819`).

### ACID (Atomicity, Consistency, Isolation, Durability)
A standard set of properties of database transactions intended to guarantee validity even in the event of errors or hardware failures. Crucial in land registries to prevent orphaned, corrupted, or duplicate land titles.

### API (Application Programming Interface)
A set of defined rules and protocols that allow different software components to communicate. Bhumisetu exposes a RESTful HTTP API documented via OpenAPI/Swagger.

### Audit Trail
A chronological, cryptographically traceable sequence of records providing documentary evidence of the sequence of activities that have affected a specific transaction, user session, or data entity.

### BCrypt
A password-hashing function designed by Niels Provos and David Mazières based on the Blowfish cipher. It incorporates a salt to protect against rainbow table attacks and features an adaptive work factor (cost parameter) to defend against brute-force attacks.

### Bounding Box (BBOX)
A rectangular spatial envelope defined by two geographic coordinates: minimum longitude/latitude (bottom-left) and maximum longitude/latitude (top-right). Used in GIS to filter features within an active map viewport.

### Cadastre / Cadastral Map (भूमापन नकाशा)
A comprehensive, high-precision land survey map displaying the physical boundaries, dimensions, and ownership lines of individual land parcels within an administrative jurisdiction.

### CRS (Coordinate Reference System)
A coordinate-based local, regional, or global system used to locate geographical entities. Bhumisetu standardizes on the global WGS-84 (EPSG:4326) CRS.

### Devanagari (देवनागरी)
An Indic alphasyllabary script used to write official Marathi, Hindi, and Sanskrit documents, featured prominently on historical 7/12 land records.

### DILRMP
Digital India Land Records Modernization Programme; a central sector scheme launched by the Government of India to digitize textual RoRs, survey cadastral maps, and computerize land registration offices.

### Encumbrance Certificate (बोजा दाखला)
A legal certificate issued by the Sub-Registrar confirming whether a land parcel has registered financial liabilities, bank mortgages, court attachments, or title disputes.

### EPSG:4326 (WGS-84)
The standard spatial reference identifier representing the World Geodetic System 1984, expressing coordinates as spherical latitude and longitude in decimal degrees.

### Floor Space Index (FSI / FAR)
The ratio of the total gross built-up floor area of a building to the total area of the land parcel upon which it is erected, regulated by municipal town planning bylaws.

### Gat Number (गट क्रमांक)
The consolidation or block survey number assigned to a parcel of land in Maharashtra revenue administration, often interchangeable with "Survey Number".

### GeoJSON
An open standard geospatial data interchange format based on JSON (JavaScript Object Notation), representing points, lines, polygons, and feature properties.

### GIS (Geographic Information System)
A computer system designed to capture, store, manipulate, analyze, manage, and present all types of geographical and spatial data.

### GIST Index (Generalized Search Tree)
A high-performance indexing mechanism in PostgreSQL that enables rapid multi-dimensional spatial queries (such as bounding box containment and intersection) in logarithmic time.

### H2GIS
A spatial extension for the H2 Java in-memory database that provides OGC-compliant spatial functions and geometry types for rapid development and testing.

### Hibernate Spatial
An extension of the Hibernate Object-Relational Mapping (ORM) framework that allows Java entities to map spatial geometries directly to database types.

### JTS (Java Topology Suite)
An open-source Java software library providing a spatial object model and fundamental 2D geometric functions and topological algorithms.

### JWT (JSON Web Token)
An open, industry-standard (RFC 7519) compact, URL-safe means of representing signed claims between two parties, used in Bhumisetu for stateless session management.

### Land-Use Zoning
The municipal classification of land into designated use zones (Residential, Commercial, Agricultural, Industrial, Public Utility) to guide orderly urban development.

### Leaflet
A widely used, open-source JavaScript library for mobile-friendly interactive web maps, used in Bhumisetu to render GeoJSON parcel vector layers.

### Mutation (Ferfar / फेरफार)
The formal process of altering the title ownership or encumbrance details in the Record of Rights following a legal transaction (sale, inheritance, partition, or mortgage).

### NA Conversion (Non-Agricultural Permission / बिनशेती परवाना)
The statutory permission granted by the Revenue Collector or Tahsildar allowing agricultural land to be utilized for residential, commercial, or industrial construction.

### NOC (No-Objection Certificate)
A formal legal document issued by an authority (e.g., Tree Authority, Fire Department, Pollution Control Board) stating that they have no objection to a proposed development.

### OCR (Optical Character Recognition)
The electronic or mechanical conversion of images of typed, handwritten, or printed text into machine-encoded text.

### OpenStreetMap (OSM)
A collaborative, open-source project to create a free, editable geographic database of the world, used as the base cartographic tile provider in Bhumisetu.

### Parcel Dossier
The unified, 360-degree digital legal profile in Bhumisetu that aggregates a parcel's spatial boundaries, ownership chain, verified documents, utility sanctions, and pending municipal applications.

### PostGIS
A powerful open-source spatial database extender for the PostgreSQL object-relational database, adding support for geographic objects and spatial SQL queries.

### RBAC (Role-Based Access Control)
A security method of restricting system access to authorized users based on their organizational roles (e.g., Citizen, Planning Officer, Admin).

### RoR (Record of Rights / अधिकार अभिलेख)
The primary legal register maintained by state revenue departments recording the title holders, tenant rights, cultivated areas, and revenue liabilities for land parcels.

### Setback
The mandatory open space required by municipal bylaws between a building structure and the property boundary lines.

### Single-Window System (SWS)
A public administration facility that enables parties involved in a regulatory process to submit standardized information and documents through a single point of entry.

### Spatial Geometry
A geometric representation of the physical shape, location, and boundary of an entity in space (e.g., `Point`, `LineString`, `Polygon`).

### Spring Boot
A production-ready, convention-over-configuration Java framework built on top of the Spring ecosystem for building enterprise microservices and web APIs.

### ST_Contains
A PostGIS spatial SQL function returning `true` if and only if no points of geometry B lie in the exterior of geometry A, and at least one point of the interior of B lies in the interior of A.

### ST_Intersects
A PostGIS spatial SQL function returning `true` if two geometries spatially overlap or touch at any point.

### Tahsildar (तहसीलदार)
A key gazetted revenue administrative officer in charge of a taluka (sub-district), responsible for land records, revenue collection, and non-agricultural conversion sanctions.

### Talathi (तलाठी / पटवारी)
The village-level revenue officer responsible for maintaining the daily village 7/12 registers, recording crop surveys, and documenting mutation entries.

### Tess4J
A Java JNA (Java Native Access) wrapper for the open-source Google Tesseract OCR engine, allowing Java programs to process document images directly.

### Tesseract OCR
An open-source optical character recognition engine sponsored by Google that uses deep LSTM neural networks to transcribe text from images.

### ULPIN (Unique Land Parcel Identification Number)
The 14-character alphanumeric identifier generated from the geographic centroid and boundary vertices of a parcel, standardizing land records across India.

### Vite
A next-generation, ultra-fast frontend build tool and dev server featuring native ES modules and sub-second Hot Module Replacement (HMR).

### WGS-84
The World Geodetic System 1984, the standard geodetic reference frame used by GPS satellites and global mapping systems.

### WKT (Well-Known Text)
An ASCII text markup language standardized by the Open Geospatial Consortium (OGC) for representing geometric objects (e.g., `POLYGON((lon lat, ...))`).

---

## Key Takeaways

1. **45 Domain and Technical Terms Defined:** Provides comprehensive, clear definitions bridging Indian revenue terminology with computer science and GIS concepts.
2. **Standardizes Vocabulary:** Eliminates confusion between vernacular Marathi administrative terms (Satbara, Ferfar, Talathi) and English system concepts.
3. **Explains GIS and Spatial Standards:** Clarifies foundational geospatial concepts including WGS-84, EPSG:4326, WKT, GIST indexes, and PostGIS spatial functions.
4. **Clarifies Security & System Architecture:** Outlines core cryptographic and architectural concepts including JWT, BCrypt, RBAC, and ACID.
5. **Academic Reference Standard:** Serves as a quick reference guide for students preparing for project reviews, report writing, and viva evaluations.

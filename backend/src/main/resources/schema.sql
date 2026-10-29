-- Enable PostGIS spatial extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Spatial and standard indexing is managed by Hibernate, but explicit spatial GIST index guarantees high performance
CREATE INDEX IF NOT EXISTS idx_land_parcels_boundary_gist ON land_parcels USING GIST (boundary);
CREATE INDEX IF NOT EXISTS idx_land_parcels_ulpin ON land_parcels (ulpin);
CREATE INDEX IF NOT EXISTS idx_land_parcels_survey ON land_parcels (survey_number);
CREATE INDEX IF NOT EXISTS idx_land_parcels_village ON land_parcels (village);

-- Documents full-text search index
CREATE INDEX IF NOT EXISTS idx_documents_parcel_id ON documents (parcel_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON applications (applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_department ON applications (department_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications (status);

-- Initialize databases and users
-- This file is run by PostgreSQL during container startup

-- Ensure the linguaaccess database exists (should already exist via POSTGRES_DB)
-- The linguaaccess database is created automatically by the postgres image

-- Additional initialization can be added here if needed
-- For now, we'll just ensure the postgres user has password authentication enabled
SELECT 1;

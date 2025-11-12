# Database Migration Guide

This directory contains SQL migration scripts for the Pyscape database schema.

## Migrations

| File | Description | Prerequisites |
|------|-------------|---------------|
| [001_create_core_tables.sql](./001_create_core_tables.sql) | Initial creation of core tables | Supabase project with auth enabled |

## How to Apply Migrations

### Option 1: Using Supabase Studio

1. Log in to your Supabase project
2. Go to the SQL Editor
3. Copy and paste the contents of the migration file
4. Click "Run" to execute the SQL statements

### Option 2: Using Supabase CLI (for local development)

If you're using the Supabase CLI for local development:

```bash
# Start Supabase local development
supabase start

# Apply migration
supabase db reset
```

## Important Notes

- These migrations include Row Level Security (RLS) policies to protect your data
- Ensure proper backups before running migrations on production data
- Review the SQL before executing to ensure it aligns with your requirements

## Schema Overview

The Pyscape database schema includes these core tables:

1. `profiles` - User profile information (already exists)
2. `modules` - Learning modules that form the curriculum
3. `lessons` - Individual lesson units within modules
4. `problems` - Coding problems for auto-grading
5. `submissions` - User code submissions and grading results
6. `events` - Event tracking for analytics
7. `progress` - User progress tracking per lesson
8. `gamification` - User gamification data (points, badges, streaks)
9. `projects` - Project lab definitions
10. `artifacts` - Saved outputs from project steps
11. `recommendations` - Personalized module roadmaps

Each table has appropriate indexes, constraints, and RLS policies to ensure data integrity and security.

## Post-Migration Verification

After applying migrations, verify the schema was created correctly:

```sql
-- List all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verify RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';
```
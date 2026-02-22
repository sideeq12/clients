-- Adding a dynamic workflow 'stage' column to the cases table
-- We use TEXT to allow for flexibility between 'accounting' and 'law-firm' specific stages.

ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'intake';

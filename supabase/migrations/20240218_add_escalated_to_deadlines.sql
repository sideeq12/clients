-- Migration: Add 'escalated' column to deadlines table

ALTER TABLE public.deadlines 
ADD COLUMN IF NOT EXISTS escalated BOOLEAN DEFAULT FALSE;

-- Optional: Randomly escalate a few active deadlines for demonstration purposes
UPDATE public.deadlines
SET escalated = TRUE
WHERE id IN (
    SELECT id FROM public.deadlines 
    WHERE status != 'Completed' 
    ORDER BY RANDOM() 
    LIMIT 2
);

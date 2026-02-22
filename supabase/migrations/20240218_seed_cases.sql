-- This script inserts 10 sample cases with different stages for the first user profile it finds.
-- Run this in the Supabase SQL editor.

DO $$
DECLARE
    v_profile_id UUID;
BEGIN
    -- Get the first profile ID to assign the cases to
    SELECT id INTO v_profile_id FROM public.profiles LIMIT 1;
    
    IF v_profile_id IS NULL THEN
        RAISE NOTICE 'No profile found. Please create a user account first.';
        RETURN;
    END IF;

    -- Insert 10 mock cases with various stages, statuses, and recent opening dates
    INSERT INTO public.cases (profile_id, case_id_string, client_name, case_type, solicitor, status, stage, opened_date)
    VALUES
        (v_profile_id, 'CASE-101', 'Acme Corp', 'Corporate structuring', 'Jane Doe', 'Active', 'intake', CURRENT_DATE),
        (v_profile_id, 'CASE-102', 'Smith LLC', 'Tax preparation', 'John Smith', 'Active', 'initial_consultation', CURRENT_DATE - INTERVAL '1 day'),
        (v_profile_id, 'CASE-103', 'Beta Tech', 'Commercial lease', 'Sarah Jenkins', 'Urgent', 'documentation', CURRENT_DATE - INTERVAL '1 day'),
        (v_profile_id, 'CASE-104', 'Global Industries', 'Annual audit', 'Mark Roberts', 'Pending', 'documents_requested', CURRENT_DATE - INTERVAL '2 days'),
        (v_profile_id, 'CASE-105', 'Echo Innovations', 'IP filing', 'Jane Doe', 'Active', 'filing', CURRENT_DATE - INTERVAL '3 days'),
        (v_profile_id, 'CASE-106', 'Charlie & Co', 'Financial planning', 'John Smith', 'Active', 'documents_received', CURRENT_DATE - INTERVAL '4 days'),
        (v_profile_id, 'CASE-107', 'Delta Logistics', 'Employment contract', 'Sarah Jenkins', 'Active', 'processing', CURRENT_DATE - INTERVAL '4 days'),
        (v_profile_id, 'CASE-108', 'Sigma Retail', 'Tax dispute', 'Mark Roberts', 'Urgent', 'review', CURRENT_DATE - INTERVAL '5 days'),
        (v_profile_id, 'CASE-109', 'Omega Trading', 'Litigation', 'Jane Doe', 'Active', 'court_scheduled', CURRENT_DATE - INTERVAL '6 days'),
        (v_profile_id, 'CASE-110', 'Alpha Ventures', 'Merger agreement', 'John Smith', 'Closed', 'completed', CURRENT_DATE - INTERVAL '7 days');
        
    RAISE NOTICE '10 sample cases inserted successfully!';
END $$;

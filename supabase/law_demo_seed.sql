-- Law Firm Demo Seed Script
-- Usage: Run this in your Supabase SQL Editor to populate the database with realistic Law Firm data.
-- IMPORTANT: Update the 'profile_id' below with your actual User UUID.

DO $$ 
DECLARE 
    v_profile_id UUID := '5cf8e797-8804-4e54-9ee8-5c281cfe3630'; -- REPLACE WITH YOUR UUID
    v_folder_id_deeds UUID := gen_random_uuid();
    v_folder_id_contracts UUID := gen_random_uuid();
BEGIN
    -- 0. Clear existing data (Optional/Recommended for clean demo)
    -- DELETE FROM public.cases WHERE profile_id = v_profile_id;
    -- DELETE FROM public.deadlines WHERE profile_id = v_profile_id;
    -- DELETE FROM public.client_leads WHERE profile_id = v_profile_id;
    -- DELETE FROM public.company WHERE profile_id = v_profile_id;

    -- 1. Ensure Profile is Law Firm
    UPDATE public.profiles SET category = 'law-firm', company_name = 'Sterling & Associates Legal' WHERE id = v_profile_id;

    -- 2. Seed Clients (Companies)
    INSERT INTO public.company (profile_id, name, contact_person, email, phone, services, status, health)
    VALUES 
    (v_profile_id, 'Horizon Property Group', 'Elena Rossi', 'elena@horizon-prop.com', '+44 20 7888 1234', ARRAY['Conveyancing', 'Commercial Lease'], 'Active', 'Good'),
    (v_profile_id, 'TechnoCore Solutions', 'James Miller', 'j.miller@technocore.io', '+44 20 8999 5678', ARRAY['IP Litigation', 'Employment Law'], 'Active', 'Good'),
    (v_profile_id, 'Heritage Estates Ltd', 'Alice Thorne', 'alice@heritage-estates.co.uk', '+44 161 222 3333', ARRAY['Probate', 'Trust Management'], 'Active', 'Warning');

    -- 3. Seed Leads (client_leads / enquiries)
    INSERT INTO public.client_leads (profile_id, client_name, company_name, service_requested, lead_status, created_at)
    VALUES 
    (v_profile_id, 'Robert Vance', 'Vance Logistics', 'Contract Dispute', 'new', NOW() - INTERVAL '2 hours'),
    (v_profile_id, 'Sophia Chen', NULL, 'Will Execution', 'new', NOW() - INTERVAL '1 day'),
    (v_profile_id, 'Marcus Wright', 'Wright Builders', 'Planning Permission Appeal', 'Active', NOW() - INTERVAL '3 days'),
    (v_profile_id, 'Diana Prince', 'Themyscira Exports', 'International Trade Compliance', 'Converted', NOW() - INTERVAL '5 days');

    -- 4. Seed Cases
    INSERT INTO public.cases (profile_id, case_id_string, client_name, case_type, solicitor, status, stage, opened_date)
    VALUES 
    (v_profile_id, 'LF-2024-042', 'Horizon Property Group', 'Commercial Conveyancing', 'Sarah Jenkins', 'Active', 'Due Diligence', CURRENT_DATE - 15),
    (v_profile_id, 'LF-2024-051', 'TechnoCore Solutions', 'Patent Dispute', 'Marcus Thorne', 'Urgent', 'Escalated', CURRENT_DATE - 5),
    (v_profile_id, 'LF-2024-055', 'Heritage Estates Ltd', 'Probate Admin', 'Jane Doe', 'Active', 'Asset Valuation', CURRENT_DATE - 20),
    (v_profile_id, 'LF-2024-060', 'Marcus Wright', 'Planning Appeal', 'Sarah Jenkins', 'Active', 'intake', CURRENT_DATE - 2);

    -- 5. Seed Deadlines
    INSERT INTO public.deadlines (profile_id, task, company_name, client_name, type, due_date, priority, status, escalated)
    VALUES 
    (v_profile_id, 'High Court Hearing - TechnoCore', 'TechnoCore Solutions', 'James Miller', 'Court', CURRENT_DATE + 3, 'Critical', 'In Progress', TRUE),
    (v_profile_id, 'Exchange Contracts - Plot 4', 'Horizon Property Group', 'Elena Rossi', 'Conveyancing', CURRENT_DATE + 1, 'High', 'Pending', FALSE),
    (v_profile_id, 'Inheritance Tax Filing', 'Heritage Estates Ltd', 'Alice Thorne', 'Tax', CURRENT_DATE + 14, 'Medium', 'In Progress', FALSE),
    (v_profile_id, 'Initial Consultation Meeting', 'Vance Logistics', 'Robert Vance', 'Meeting', CURRENT_DATE + 2, 'Medium', 'Pending', FALSE),
    (v_profile_id, 'Discovery Response Deadline', 'TechnoCore Solutions', 'James Miller', 'Legal', CURRENT_DATE - 1, 'Critical', 'Overdue', TRUE);

    -- 6. Seed Folders & Documents
    INSERT INTO public.document_folders (id, profile_id, name, color)
    VALUES 
    (v_folder_id_deeds, v_profile_id, 'Title Deeds', 'bg-blue-500/10 text-blue-500'),
    (v_folder_id_contracts, v_profile_id, 'Client Contracts', 'bg-purple-500/10 text-purple-500');

    INSERT INTO public.documents (profile_id, folder_id, name, file_type, file_size, company_name)
    VALUES 
    (v_profile_id, v_folder_id_deeds, 'Horizon_Reg_Copy_Title.pdf', 'pdf', '2.4 MB', 'Horizon Property Group'),
    (v_profile_id, v_folder_id_contracts, 'TechnoCore_Service_Agreement.docx', 'word', '850 KB', 'TechnoCore Solutions');

    -- 7. Practice Areas
    -- Note: Ensure practice_areas table exists and uses profile_id
    INSERT INTO public.practice_areas (profile_id, name, category, description)
    VALUES 
    (v_profile_id, 'Corporate Law', 'law-firm', 'Mergers, acquisitions, and trade compliance.'),
    (v_profile_id, 'Property Law', 'law-firm', 'Residential and commercial conveyancing.'),
    (v_profile_id, 'Family Law', 'law-firm', 'Divorce, custody, and estate planning.'),
    (v_profile_id, 'Litigation', 'law-firm', 'Civil and commercial court disputes.');

END $$;

-- ==========================================
-- Lovissa Consulting Portal - Consolidated Migration Script
-- ==========================================
-- This script sets up the entire database schema, security policies, and seed data.
-- 
-- IMPORTANT: Update the 'user_id' variable below with your actual Supabase User ID
-- from the Authentication -> Users section of your new project.
-- ==========================================

-- 1. CLEANUP (Optional - uncomment if you want to wipe existing tables)
-- DROP TABLE IF EXISTS public.reports CASCADE;
-- DROP TABLE IF EXISTS public.documents CASCADE;
-- DROP TABLE IF EXISTS public.document_folders CASCADE;
-- DROP TABLE IF EXISTS public.automation_activity CASCADE;
-- DROP TABLE IF EXISTS public.automation_workflows CASCADE;
-- DROP TABLE IF EXISTS public.cases CASCADE;
-- DROP TABLE IF EXISTS public.deadlines CASCADE;
-- DROP TABLE IF EXISTS public.enquiries CASCADE;
-- DROP TABLE IF EXISTS public.company CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- ==========================================
-- 2. SCHEMA DEFINITION
-- ==========================================

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    category TEXT CHECK (category IN ('accounting', 'law-firm')),
    full_name TEXT,
    company_name TEXT,
    email TEXT,
    phone_number TEXT,
    location TEXT,
    address TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Clients/Companies
CREATE TABLE IF NOT EXISTS public.company (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    services TEXT[],
    status TEXT DEFAULT 'Active',
    health TEXT DEFAULT 'Good',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enquiries
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    service_name TEXT,
    status TEXT DEFAULT 'Active',
    priority TEXT DEFAULT 'Medium',
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Deadlines
CREATE TABLE IF NOT EXISTS public.deadlines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    task TEXT NOT NULL,
    client_name TEXT,
    type TEXT,
    due_date DATE NOT NULL,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'In Progress',
    escalated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cases
CREATE TABLE IF NOT EXISTS public.cases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    case_id_string TEXT,
    client_name TEXT NOT NULL,
    case_type TEXT,
    solicitor TEXT,
    status TEXT DEFAULT 'Active',
    stage TEXT DEFAULT 'intake',
    opened_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Automation Workflows
CREATE TABLE IF NOT EXISTS public.automation_workflows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Idle',
    uptime TEXT DEFAULT '100%',
    efficiency_gain TEXT,
    icon_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Automation Activity
CREATE TABLE IF NOT EXISTS public.automation_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    event_name TEXT NOT NULL,
    status TEXT DEFAULT 'Success',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Document Folders
CREATE TABLE IF NOT EXISTS public.document_folders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Documents
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    folder_id UUID REFERENCES public.document_folders(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    file_type TEXT,
    file_size TEXT,
    client_name TEXT,
    storage_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reports
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('accounting', 'law-firm')),
    icon_name TEXT,
    color TEXT,
    count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    type TEXT,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'Scheduled',
    contact_person TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. SECURITY & POLICIES (RLS)
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own clients" ON public.company FOR ALL USING (profile_id = auth.uid());
CREATE POLICY "Users can manage own enquiries" ON public.enquiries FOR ALL USING (profile_id = auth.uid());
CREATE POLICY "Users can manage own deadlines" ON public.deadlines FOR ALL USING (profile_id = auth.uid());
CREATE POLICY "Users can manage own cases" ON public.cases FOR ALL USING (profile_id = auth.uid());
CREATE POLICY "Users can manage own workflows" ON public.automation_workflows FOR ALL USING (profile_id = auth.uid());
CREATE POLICY "Users can manage own activity" ON public.automation_activity FOR ALL USING (profile_id = auth.uid());
CREATE POLICY "Users can manage own folders" ON public.document_folders FOR ALL USING (profile_id = auth.uid());
CREATE POLICY "Users can manage own documents" ON public.documents FOR ALL USING (profile_id = auth.uid());
CREATE POLICY "Users can manage own reports" ON public.reports FOR ALL USING (profile_id = auth.uid());
CREATE POLICY "Users can manage own appointments" ON public.appointments FOR ALL USING (profile_id = auth.uid());

-- ==========================================
-- 4. SEED DATA
-- ==========================================

DO $$
DECLARE
    -- !!! CHANGE THESE UUIDS TO YOUR ACTUAL SUPABASE USER IDS !!!
    v_accounting_id UUID := '451f0bd5-cde5-4df7-b1a7-026053e6ff91'; 
    v_law_id UUID := '03dbce3a-486f-4f98-9b0c-dc63c0874b2d';
    
    v_folder_tax UUID := gen_random_uuid();
    v_folder_payroll UUID := gen_random_uuid();
BEGIN
    -- Only proceed if the users actually exist in auth.users
    
    -- 1. ACCOUNTING FIRM PROFILE & DATA
    INSERT INTO public.profiles (id, category, full_name, company_name, email, phone_number, location, address)
    VALUES (v_accounting_id, 'accounting', 'Accounting Admin', 'Lovissa Accounting Services', 'accounting@test.com', '+44 123 456 789', 'London, UK', '123 Finance St, London')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.company (profile_id, name, contact_person, email, phone, services, status, health)
    VALUES (v_accounting_id, 'Acme Corp Ltd', 'John Smith', 'john@acmecorp.com', '+44 20 7123 4567', ARRAY['VAT', 'Payroll', 'Corp Tax'], 'Active', 'Good');

    INSERT INTO public.enquiries (profile_id, client_name, service_name, status, priority, source)
    VALUES (v_accounting_id, 'Acme Corp', 'Tax Advisory', 'Active', 'High', 'Website');

    INSERT INTO public.deadlines (profile_id, task, client_name, type, due_date, priority, status, escalated)
    VALUES (v_accounting_id, 'VAT Q4 Submission', 'Acme Corp Ltd', 'VAT', '2024-03-31', 'Critical', 'Action Required', TRUE);

    INSERT INTO public.automation_workflows (profile_id, name, status, uptime, efficiency_gain, icon_name)
    VALUES (v_accounting_id, 'Document Intake', 'Running', '99.9%', '+15%', 'Zap');

    INSERT INTO public.document_folders (id, profile_id, name, color)
    VALUES (v_folder_tax, v_accounting_id, 'Tax Returns', 'bg-blue-500/10 text-blue-500');

    INSERT INTO public.reports (profile_id, name, description, category, icon_name, color, count)
    VALUES (v_accounting_id, 'Profit & Loss', 'Summary of revenues, costs, and expenses.', 'accounting', 'BarChart3', 'text-blue-500', 12);

    -- 2. LAW FIRM PROFILE & DATA
    INSERT INTO public.profiles (id, category, full_name, company_name, email, phone_number, location, address)
    VALUES (v_law_id, 'law-firm', 'Legal Admin', 'Lovissa Legal Chambers', 'law@test.com', '+44 20 8987 6543', 'Manchester, UK', 'Legal Square, Manchester')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.company (profile_id, name, contact_person, email, phone, services, status, health)
    VALUES (v_law_id, 'Urban Dev Group', 'Alice Wong', 'alice@gl.com', '+44 20 8123 4567', ARRAY['Corporate', 'Property'], 'Active', 'Good');

    INSERT INTO public.enquiries (profile_id, client_name, service_name, status, priority, source)
    VALUES (v_law_id, 'Urban Dev', 'Contract Review', 'Active', 'High', 'direct');

    INSERT INTO public.cases (profile_id, case_id_string, client_name, case_type, solicitor, status, stage, opened_date)
    VALUES 
        (v_law_id, 'CASE-101', 'Urban Dev', 'Corporate structuring', 'Jane Doe', 'Active', 'intake', CURRENT_DATE),
        (v_law_id, 'CASE-103', 'Beta Tech', 'Commercial lease', 'Sarah Jenkins', 'Urgent', 'documentation', CURRENT_DATE - INTERVAL '1 day');

    INSERT INTO public.automation_workflows (profile_id, name, status, uptime, efficiency_gain, icon_name)
    VALUES (v_law_id, 'Conflict Check', 'Active', '98.5%', '+10%', 'Shield');

    INSERT INTO public.reports (profile_id, name, description, category, icon_name, color, count)
    VALUES (v_law_id, 'Case Outcomes', 'Success rates and resolution summaries.', 'law-firm', 'BarChart3', 'text-purple-500', 8);

END $$;

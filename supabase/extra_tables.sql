-- ==========================================
-- Extra Data Tables for Lovissa Consulting
-- ==========================================

-- 1. Client Leads Table
CREATE TABLE IF NOT EXISTS public.client_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    company_name TEXT,
    contact_email TEXT,
    service_requested TEXT,
    lead_status TEXT DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Automation Events Table
CREATE TABLE IF NOT EXISTS public.automation_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL,
    company_name TEXT,
    service_requested TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- Security & Policies (RLS)
-- ==========================================

ALTER TABLE public.client_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_events ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can manage own lead data" ON public.client_leads
    FOR ALL USING (profile_id = auth.uid());

CREATE POLICY "Users can manage own automation events" ON public.automation_events
    FOR ALL USING (profile_id = auth.uid());

-- ==========================================
-- 3. Staff Table
-- ==========================================

CREATE TABLE IF NOT EXISTS public.staff (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT,           -- e.g. 'Solicitor', 'Paralegal', 'Accountant', 'Admin'
    department TEXT,     -- e.g. 'Corporate', 'Tax', 'Litigation'
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own staff" ON public.staff
    FOR ALL USING (profile_id = auth.uid());

-- ==========================================
-- 4. Add Staff Assignment to Deadlines & Cases
-- ==========================================

ALTER TABLE public.deadlines ADD COLUMN IF NOT EXISTS assigned_staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL;
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS assigned_staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL;

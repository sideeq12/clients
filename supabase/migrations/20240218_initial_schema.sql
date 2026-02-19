-- Create profiles table
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

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
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

-- Create enquiries table
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

-- Create deadlines table
CREATE TABLE IF NOT EXISTS public.deadlines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    task TEXT NOT NULL,
    client_name TEXT,
    type TEXT,
    due_date DATE NOT NULL,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'In Progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create cases table (specific to law-firm)
CREATE TABLE IF NOT EXISTS public.cases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    case_id_string TEXT,
    client_name TEXT NOT NULL,
    case_type TEXT,
    solicitor TEXT,
    status TEXT DEFAULT 'Active',
    opened_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own clients." ON public.clients FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can insert their own clients." ON public.clients FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Users can update their own clients." ON public.clients FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "Users can view their own enquiries." ON public.enquiries FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can insert their own enquiries." ON public.enquiries FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can view their own deadlines." ON public.deadlines FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can insert their own deadlines." ON public.deadlines FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can view their own cases." ON public.cases FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can insert their own cases." ON public.cases FOR INSERT WITH CHECK (profile_id = auth.uid());

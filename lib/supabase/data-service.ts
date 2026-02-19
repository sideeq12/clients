import { createClient } from '@/utils/supabase/server';
// Manual types are defined below until supabase types are generated

export type Profile = {
    id: string;
    category: 'accounting' | 'law-firm';
    full_name: string;
    company_name: string;
    email: string;
    phone_number: string;
    location: string;
    address: string;
};

export type Client = {
    id: string;
    name: string;
    contact_person: string;
    email: string;
    phone: string;
    services: string[];
    status: string;
    health: string;
};

export type Enquiry = {
    id: string;
    client_name: string;
    service_name: string;
    status: string;
    priority: string;
    source: string;
    created_at: string;
};

export type Deadline = {
    id: string;
    task: string;
    client_name: string;
    type: string;
    due_date: string;
    priority: string;
    status: string;
};

export type Case = {
    id: string;
    case_id_string: string;
    client_name: string;
    case_type: string;
    solicitor: string;
    status: string;
    opened_date: string;
};

export interface AutomationWorkflow {
    id: string;
    profile_id: string;
    name: string;
    status: string;
    uptime: string;
    efficiency_gain: string;
    icon_name: string;
    created_at: string;
}

export interface AutomationActivity {
    id: string;
    profile_id: string;
    event_name: string;
    status: string;
    created_at: string;
}

export interface DocumentFolder {
    id: string;
    profile_id: string;
    name: string;
    color: string;
    created_at: string;
}

export interface Document {
    id: string;
    profile_id: string;
    folder_id: string | null;
    name: string;
    file_type: string;
    file_size: string;
    client_name: string;
    storage_path: string | null;
    created_at: string;
}

export interface Report {
    id: string;
    profile_id: string;
    name: string;
    description: string;
    category: 'accounting' | 'law-firm';
    icon_name: string;
    color: string;
    count: number;
    created_at: string;
}

export async function getProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data as Profile;
}

export async function getClients() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }

    return data as Client[];
}

export async function getEnquiries() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching enquiries:', error);
        return [];
    }

    return data as Enquiry[];
}

export async function getDeadlines() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('deadlines')
        .select('*')
        .order('due_date', { ascending: true });

    if (error) {
        console.error('Error fetching deadlines:', error);
        return [];
    }

    return data as Deadline[];
}

export async function getCases() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('opened_date', { ascending: false });

    if (error) {
        console.error('Error fetching cases:', error);
        return [];
    }

    return data as Case[];
}

export async function getAutomationWorkflows() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('automation_workflows')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching workflows:', error);
        return [];
    }

    return data as AutomationWorkflow[];
}

export async function getAutomationActivity() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('automation_activity')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching activity:', error);
        return [];
    }

    return data as AutomationActivity[];
}

export async function getDocumentFolders() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('document_folders')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching folders:', error);
        return [];
    }

    return data as DocumentFolder[];
}

export async function getDocuments() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching documents:', error);
        return [];
    }

    return data as Document[];
}

export async function getReports() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching reports:', error);
        return [];
    }

    return data as Report[];
}

export async function getDashboardStats() {
    const [clients, enquiries, deadlines, cases, workflows] = await Promise.all([
        getClients(),
        getEnquiries(),
        getDeadlines(),
        getCases(),
        getAutomationWorkflows()
    ]);

    // Simple aggregation for Service Distribution
    const serviceCounts: Record<string, number> = {};
    clients.forEach(c => {
        c.services?.forEach(s => {
            serviceCounts[s] = (serviceCounts[s] || 0) + 1;
        });
    });

    const serviceDistribution = Object.keys(serviceCounts).map(name => ({
        name,
        value: serviceCounts[name],
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}` // Better to have a fixed palette
    }));

    // Simple aggregation for Enquiry Trends (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    const enquiriesTrend = last7Days.map(date => ({
        day: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        count: enquiries.filter(e => e.created_at.startsWith(date)).length
    }));

    // Legal Aggregations
    const caseStageCounts: Record<string, number> = {};
    cases.forEach(c => {
        caseStageCounts[c.status] = (caseStageCounts[c.status] || 0) + 1;
    });

    const practiceAreaCounts: Record<string, number> = {};
    cases.forEach(c => {
        practiceAreaCounts[c.case_type] = (practiceAreaCounts[c.case_type] || 0) + 1;
    });

    const practiceAreas = Object.keys(practiceAreaCounts).map(name => ({
        name,
        value: Math.round((practiceAreaCounts[name] / (cases.length || 1)) * 100),
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
    }));

    return {
        serviceDistribution,
        enquiriesTrend,
        caseStageCounts,
        practiceAreas,
    };
}

export async function updateProfile(updates: Partial<Profile>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

    if (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

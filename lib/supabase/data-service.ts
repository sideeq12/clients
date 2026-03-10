'use server'

import { createClient } from '@/utils/supabase/server';
import {
    Profile,
    Company,
    Enquiry,
    Deadline,
    Case,
    Staff,
    AutomationWorkflow,
    AutomationActivity,
    DocumentFolder,
    Document,
    Report,
    PracticeArea,
    Appointment
} from './types';

// Mock Data Definitions
const MOCK_PROFILES: Record<string, Profile> = {
    'accounting-firm': {
        id: '1',
        category: 'accounting',
        full_name: 'Sarah Jenkins',
        company_name: 'Jenkins & Co Accountants',
        email: 'sarah@jenkins-accounting.co.uk',
        phone_number: '+44 20 7123 4567',
        location: 'London, UK',
        address: '12-14 Financial Row, London, EC1A 1BB'
    },
    'law-firm': {
        id: '2',
        category: 'law-firm',
        full_name: 'Marcus Thorne',
        company_name: 'Thorne & Associates Legal',
        email: 'm.thorne@thorne-legal.com',
        phone_number: '+44 20 8987 6543',
        location: 'Manchester, UK',
        address: 'Legal Chambers, 5 Victory Square, Manchester, M2 4WL'
    }
};

const MOCK_COMPANIES: Record<string, Company[]> = {
    'accounting-firm': [
        { id: 'c1', name: 'TechStart Ltd', contact_person: 'John Doe', email: 'john@techstart.io', phone: '07700 900123', services: ['VAT Services', 'Bookkeeping'], status: 'Active', health: 'Good' },
        { id: 'c2', name: 'Green Gardeners', contact_person: 'Jane Smith', email: 'jane@green.co', phone: '07700 900456', services: ['Payroll & PAYE', 'Tax Advisory'], status: 'Active', health: 'Good' },
        { id: 'c3', name: 'Elite Builders', contact_person: 'Bob Builder', email: 'bob@elite.com', phone: '07700 900789', services: ['Audit & Assurance'], status: 'Active', health: 'Fair' },
    ],
    'law-firm': [
        { id: 'l1', name: 'Global Logistics', contact_person: 'Alice Wong', email: 'alice@gl.com', phone: '07711 100111', services: ['Corporate & Commercial'], status: 'Active', health: 'Good' },
        { id: 'l2', name: 'Heritage Homes', contact_person: 'Peter Parker', email: 'peter@heritage.com', phone: '07711 100222', services: ['Property & Conveyancing'], status: 'Active', health: 'Good' },
        { id: 'l3', name: 'Swift Solutions', contact_person: 'Diana Prince', email: 'diana@swift.io', phone: '07711 100333', services: ['Employment Law'], status: 'Active', health: 'Fair' },
    ]
};

const MOCK_ENQUIRIES: Record<string, Enquiry[]> = {
    'accounting-firm': [
        { id: 'e1', company_name: 'New Ventures Ltd', service_name: 'Company Formation', status: 'Active', priority: 'High', source: 'Website', created_at: new Date().toISOString() },
        { id: 'e2', company_name: 'Solo Trader', service_name: 'Self Assessment', status: 'Pending', priority: 'Medium', source: 'Referral', created_at: new Date(Date.now() - 86400000).toISOString() },
    ],
    'law-firm': [
        { id: 'le1', company_name: 'Urban Dev Group', service_name: 'Planning Dispute', status: 'Active', priority: 'High', source: 'direct', created_at: new Date().toISOString() },
        { id: 'le2', company_name: 'Family Estate', service_name: 'Will Writing', status: 'Resolved', priority: 'Low', source: 'Referral', created_at: new Date(Date.now() - 172800000).toISOString() },
    ]
};

const MOCK_DEADLINES: Record<string, Deadline[]> = {
    'accounting-firm': [
        { id: 'd1', task: 'VAT Return Filing', company_name: 'TechStart Ltd', type: 'Filing', due_date: '2024-03-31', priority: 'High', status: 'In Progress', created_at: new Date().toISOString() },
        { id: 'd2', task: 'Corporation Tax Payment', company_name: 'Elite Builders', type: 'Payment', due_date: '2024-04-15', priority: 'Medium', status: 'Pending', created_at: new Date().toISOString() },
    ],
    'law-firm': [
        { id: 'ld1', task: 'Court Appearance', company_name: 'Urban Dev Group', type: 'Court', due_date: '2024-03-25', priority: 'High', status: 'In Progress', escalated: true, created_at: new Date().toISOString() },
        { id: 'ld2', task: 'Contract Signature', company_name: 'Swift Solutions', type: 'Legal', due_date: '2024-04-01', priority: 'Medium', status: 'Pending', created_at: new Date().toISOString() },
    ]
};

const MOCK_CASES: Record<string, Case[]> = {
    'accounting-firm': [
        { id: 'ac1', case_id_string: 'ACC-2024-001', company_name: 'TechStart Ltd', case_type: 'Corporation Tax', solicitor: 'Sarah Jenkins', status: 'Active', stage: 'In Review', opened_date: '2024-02-20' },
        { id: 'ac2', case_id_string: 'ACC-2024-002', company_name: 'Green Gardeners', case_type: 'VAT Dispute', solicitor: 'David Blake', status: 'Overdue', stage: 'Escalated', opened_date: '2024-02-22' },
        { id: 'ac3', case_id_string: 'ACC-2024-003', company_name: 'Elite Builders', case_type: 'Payroll Audit', solicitor: 'Sarah Jenkins', status: 'Active', stage: 'Data Collection', opened_date: '2024-02-18' },
        { id: 'ac4', case_id_string: 'ACC-2024-004', company_name: 'Bright Interiors', case_type: 'Self Assessment', solicitor: 'Anna Lee', status: 'Paused', stage: 'Awaiting Documents', opened_date: '2024-02-15' },
        { id: 'ac5', case_id_string: 'ACC-2024-005', company_name: 'Falcon Logistics', case_type: 'HMRC Enquiry', solicitor: 'David Blake', status: 'Overdue', stage: 'Response Drafting', opened_date: '2024-02-10' },
        { id: 'ac6', case_id_string: 'ACC-2023-041', company_name: 'Northern Foods Co.', case_type: 'Annual Accounts', solicitor: 'Anna Lee', status: 'Completed', stage: 'Completed', opened_date: '2023-11-01' },
        { id: 'ac7', case_id_string: 'ACC-2024-006', company_name: 'Summit Retail', case_type: 'Tax Planning', solicitor: 'Sarah Jenkins', status: 'Cancelled', stage: 'N/A', opened_date: '2024-01-20' },
    ],
    'law-firm': [
        { id: 'lc1', case_id_string: 'LF-2024-001', company_name: 'Global Logistics', case_type: 'Merger & Acquisition', solicitor: 'Marcus Thorne', status: 'Active', stage: 'Due Diligence', opened_date: '2024-01-15' },
        { id: 'lc2', case_id_string: 'LF-2024-002', company_name: 'Heritage Homes', case_type: 'Property Conveyancing', solicitor: 'Jane Doe', status: 'Active', stage: 'Exchange Contracts', opened_date: '2024-02-01' },
        { id: 'lc3', case_id_string: 'LF-2024-003', company_name: 'Swift Solutions', case_type: 'Employment Dispute', solicitor: 'Marcus Thorne', status: 'Overdue', stage: 'Escalated', opened_date: '2024-02-10' },
        { id: 'lc4', case_id_string: 'LF-2024-004', company_name: 'Urban Dev Group', case_type: 'Planning Appeal', solicitor: 'Rachel Green', status: 'Paused', stage: 'Discovery', opened_date: '2024-02-14' },
        { id: 'lc5', case_id_string: 'LF-2024-005', company_name: 'Family Estate', case_type: 'Probate & Wills', solicitor: 'Rachel Green', status: 'Overdue', stage: 'Escalated', opened_date: '2024-02-20' },
        { id: 'lc6', case_id_string: 'LF-2024-006', company_name: 'Midtown Retail', case_type: 'Commercial Lease', solicitor: 'Jane Doe', status: 'Active', stage: 'Negotiation', opened_date: '2024-02-22' },
        { id: 'lc7', case_id_string: 'LF-2023-089', company_name: 'Apex Corp', case_type: 'Litigation', solicitor: 'Marcus Thorne', status: 'Completed', stage: 'Settled', opened_date: '2023-10-05' },
        { id: 'lc8', case_id_string: 'LF-2024-007', company_name: 'Riverstone Group', case_type: 'Corporate Restructuring', solicitor: 'Jane Doe', status: 'Cancelled', stage: 'N/A', opened_date: '2024-01-30' },
    ]
};

const MOCK_STAFF: Record<string, Staff[]> = {
    'accounting-firm': [
        { id: 'st1', profile_id: '1', full_name: 'Sarah Jenkins', email: 'sarah@jenkins-accounting.co.uk', phone: '07700 900001', role: 'Accountant', department: 'Tax', status: 'Active', created_at: new Date().toISOString() },
        { id: 'st2', profile_id: '1', full_name: 'David Blake', email: 'david@jenkins-accounting.co.uk', phone: '07700 900002', role: 'Accountant', department: 'VAT', status: 'Active', created_at: new Date().toISOString() },
        { id: 'st3', profile_id: '1', full_name: 'Anna Lee', email: 'anna@jenkins-accounting.co.uk', phone: '07700 900003', role: 'Admin', department: 'General', status: 'Active', created_at: new Date().toISOString() },
    ],
    'law-firm': [
        { id: 'st4', profile_id: '2', full_name: 'Marcus Thorne', email: 'm.thorne@thorne-legal.com', phone: '07711 200001', role: 'Solicitor', department: 'Corporate', status: 'Active', created_at: new Date().toISOString() },
        { id: 'st5', profile_id: '2', full_name: 'Jane Doe', email: 'jane@thorne-legal.com', phone: '07711 200002', role: 'Solicitor', department: 'Property', status: 'Active', created_at: new Date().toISOString() },
        { id: 'st6', profile_id: '2', full_name: 'Rachel Green', email: 'rachel@thorne-legal.com', phone: '07711 200003', role: 'Paralegal', department: 'Litigation', status: 'Active', created_at: new Date().toISOString() },
    ]
};

// Fixed colour palette
const PALETTE = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

// --- Supabase Data Fetching Functions ---

export async function getProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return profile as Profile;
}

export async function getCompanies() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: companies } = await supabase
        .from('companies')
        .select('*')
        .eq('profile_id', user.id);

    return (companies || []) as Company[];
}

export async function getEnquiries() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: enquiries } = await supabase
        .from('enquiries')
        .select('*')
        .eq('profile_id', user.id);

    return (enquiries || []) as Enquiry[];
}

export async function getDeadlines() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: deadlines } = await supabase
        .from('deadlines')
        .select('*')
        .eq('profile_id', user.id);

    return (deadlines || []) as Deadline[];
}

export async function getCases() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: cases } = await supabase
        .from('cases')
        .select('*')
        .eq('profile_id', user.id);

    return (cases || []) as Case[];
}

export async function getDashboardStats(category: 'accounting' | 'law-firm' = 'accounting') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const companies = await getCompanies();
    const enquiries = await getEnquiries();
    const cases = await getCases();

    // Enquiry Trends (last 7 days - real data)
    const enquiriesTrend = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - (6 - i));

        const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

        // Filter enquiries for this specific day
        const dayEnquiries = enquiries.filter(enq => {
            const enqDate = new Date(enq.created_at);
            return enqDate.getDate() === d.getDate() &&
                enqDate.getMonth() === d.getMonth() &&
                enqDate.getFullYear() === d.getFullYear();
        });

        return {
            day: dateStr,
            count: dayEnquiries.length,
            items: dayEnquiries.map(enq => ({
                id: enq.id,
                title: `${enq.client_name || enq.company_name} - ${enq.service_name}`,
                status: enq.status,
                priority: enq.priority,
                source: enq.source
            }))
        };
    });

    // Practice Areas / Service Categories - Fetch from DB
    let practiceAreas: { name: string; value: number; color: string }[] = [];

    if (user) {
        const { data: dbPracticeAreas } = await supabase
            .from('practice_areas')
            .select('*')
            .eq('profile_id', user.id);

        if (dbPracticeAreas && dbPracticeAreas.length > 0) {
            practiceAreas = dbPracticeAreas.map((pa: PracticeArea, index: number) => ({
                name: pa.name,
                // Assign a mock value for the chart since we don't have real cases tied to these yet
                value: Math.floor(Math.random() * 40) + 10,
                color: PALETTE[index % PALETTE.length]
            }));
        } else {
            // Fallback to mock data if no practice areas are found in DB for the user
            if (category === 'law-firm') {
                practiceAreas = [
                    { name: 'Corporate', value: 45, color: PALETTE[0] },
                    { name: 'Property', value: 30, color: PALETTE[1] },
                    { name: 'Employment', value: 15, color: PALETTE[2] },
                    { name: 'Other', value: 10, color: PALETTE[3] }
                ];
            } else {
                practiceAreas = [
                    { name: 'VAT Services', value: 40, color: PALETTE[0] },
                    { name: 'Payroll', value: 25, color: PALETTE[1] },
                    { name: 'Tax Advisory', value: 20, color: PALETTE[2] },
                    { name: 'Audit', value: 15, color: PALETTE[3] }
                ];
            }
        }
    }

    return {
        serviceDistribution: [],
        enquiriesTrend,
        caseStageCounts: {},
        practiceAreas,
        casesTrend: [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - (6 - i));

            const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

            const dayCases = cases.filter(c => {
                const cDate = new Date(c.opened_date);
                return cDate.getDate() === d.getDate() &&
                    cDate.getMonth() === d.getMonth() &&
                    cDate.getFullYear() === d.getFullYear();
            });

            return {
                day: dateStr,
                count: dayCases.length,
                items: dayCases.map(c => ({
                    id: c.id,
                    title: `${c.client_name || c.company_name} - ${c.case_type}`,
                    solicitor: c.solicitor,
                    stage: c.stage
                }))
            };
        })
    };
}

export async function getAutomationWorkflows() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Note: Table name might need creation if not in seed, but following existing mock pattern
    const { data } = await supabase
        .from('automation_workflows')
        .select('*')
        .eq('profile_id', user.id);

    return (data || []) as AutomationWorkflow[];
}

export async function getAutomationActivity() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from('automation_activity')
        .select('*')
        .eq('profile_id', user.id);

    return (data || []) as AutomationActivity[];
}

export async function getAppointments() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from('appointments')
        .select('*')
        .eq('profile_id', user.id)
        .order('appointment_date', { ascending: true });

    return (data || []) as Appointment[];
}

export async function getDocumentFolders() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from('document_folders')
        .select('*')
        .eq('profile_id', user.id);

    return (data || []) as DocumentFolder[];
}

export async function getDocuments() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('profile_id', user.id);

    return (data || []) as Document[];
}

export async function getReports() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from('reports')
        .select('*')
        .eq('profile_id', user.id);

    return (data || []) as Report[];
}

export async function getStaff() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from('staff')
        .select('*')
        .eq('profile_id', user.id);

    return (data || []) as Staff[];
}

export async function updateProfile(updates: Partial<Profile>) {
    // Mock update
    return;
}

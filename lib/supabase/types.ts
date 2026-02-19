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

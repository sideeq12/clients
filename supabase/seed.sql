-- IMPORTANT: Replace '5cf8e797-8804-4e54-9ee8-5c281cfe3630' with the actual UUID from your auth.users table
-- You can find this in the Supabase Dashboard under Authentication -> Users

-- 1. Insert Profile
INSERT INTO public.profiles (id, category, full_name, company_name, email, phone_number, location, address)
VALUES ('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'accounting', 'John Doe', 'Acme Accounting Ltd', 'john@acme.com', '+44 123 456 789', 'London, UK', '123 Finance St, London');

-- 2. Seed Clients
INSERT INTO public.clients (profile_id, name, contact_person, email, phone, services, status, health)
VALUES 
('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'Acme Corp Ltd', 'John Smith', 'john@acmecorp.com', '+44 20 7123 4567', ARRAY['VAT', 'Payroll', 'Corp Tax'], 'Active', 'Good'),
('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'Global Tech Solutions', 'Sarah Williams', 'sarah@globaltech.io', '+44 20 8234 5678', ARRAY['Bookkeeping', 'Self Assessment'], 'Active', 'Warning');

-- 3. Seed Enquiries
INSERT INTO public.enquiries (profile_id, client_name, service_name, status, priority, source)
VALUES 
('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'Acme Corp', 'Tax Advisory', 'Active', 'High', 'Website'),
('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'Global Tech', 'Payroll Setup', 'Pending', 'Medium', 'Referral');

-- 4. Seed Deadlines
INSERT INTO public.deadlines (profile_id, task, client_name, type, due_date, priority, status)
VALUES 
('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'VAT Q4 Submission', 'Acme Corp Ltd', 'VAT', '2024-02-29', 'Critical', 'Action Required'),
('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'Payroll Jan processing', 'Global Tech Solutions', 'PAYE', '2024-02-19', 'High', 'In Progress');

-- 5. Seed Cases (if law-firm)
-- Insert mock cases
INSERT INTO public.cases (id, profile_id, case_id_string, client_name, case_type, solicitor, status)
VALUES 
    (gen_random_uuid(), '5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'LL-2024-001', 'John Smith', 'Family Law', 'Sarah Jenkins', 'Active'),
    (gen_random_uuid(), '5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'LL-2024-002', 'Alice Brown', 'Conveyancing', 'Michael Ross', 'Urgent');

-- Insert mock automation workflows
INSERT INTO public.automation_workflows (profile_id, name, status, uptime, efficiency_gain, icon_name)
VALUES
    ('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'Document Intake', 'Running', '99.9%', '+15%', 'Zap'),
    ('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'Client Onboarding', 'Idle', '100%', '+22%', 'Play'),
    ('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'Conflict Check', 'Active', '98.5%', '+10%', 'Shield');

-- Insert mock automation activity
INSERT INTO public.automation_activity (profile_id, event_name, status)
VALUES
    ('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'Document signed by client', 'Success'),
    ('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'Conflict check completed', 'Success'),
    ('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'Auto-file generation failed', 'Error');

-- Insert mock document folders
INSERT INTO public.document_folders (id, profile_id, name, color)
VALUES
    ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', '5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'Tax Returns', 'bg-blue-500/10 text-blue-500'),
    ('f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2', '5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'Payroll Docs', 'bg-purple-500/10 text-purple-500');

-- Insert mock documents
INSERT INTO public.documents (profile_id, folder_id, name, file_type, file_size, client_name)
VALUES
    ('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', 'VAT_Return_Q4_2023.pdf', 'pdf', '1.2 MB', 'Acme Corp Ltd'),
    ('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2', 'Payroll_Report_Jan.xlsx', 'excel', '450 KB', 'Global Tech');

-- Insert mock reports
INSERT INTO public.reports (profile_id, name, description, category, icon_name, color, count)
VALUES
    ('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'Profit & Loss', 'Summary of revenues, costs, and expenses.', 'accounting', 'BarChart3', 'text-blue-500', 12),
    ('5cf8e797-8804-4e54-9ee8-5c281cfe3630', 'Case Outcomes', 'Success rates and resolution summaries.', 'law-firm', 'BarChart3', 'text-purple-500', 8);

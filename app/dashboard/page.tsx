import { DashboardClient } from "./DashboardClient";
import {
    getProfile,
    getClients,
    getEnquiries,
    getDeadlines,
    getCases,
    getDashboardStats,
} from "@/lib/supabase/data-service";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    // If no profile exists, the user might need to complete onboarding or it's a new account
    // For now, we'll allow it and show an empty state or default to accounting

    // Fetch all relevant data concurrently
    const [profile, clients, enquiries, deadlines, cases, stats] = await Promise.all([
        getProfile(),
        getClients(),
        getEnquiries(),
        getDeadlines(),
        getCases(),
        getDashboardStats(),
    ]);

    return (
        <DashboardClient
            profile={profile}
            clients={clients}
            enquiries={enquiries}
            deadlines={deadlines}
            cases={cases}
            stats={stats}
        />
    );
}

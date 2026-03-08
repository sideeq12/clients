import { DashboardClient } from "./DashboardClient";
import {
    getProfile,
    getCompanies,
    getEnquiries,
    getDeadlines,
    getCases,
    getDashboardStats,
} from "@/lib/supabase/data-service";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    // Fetch profile first so we can pass category into stats computation
    const profile = await getProfile();
    const category = profile?.category ?? 'accounting';

    // Fetch all remaining data concurrently
    const [companies, enquiries, deadlines, cases, stats] = await Promise.all([
        getCompanies(),
        getEnquiries(),
        getDeadlines(),
        getCases(),
        getDashboardStats(category),
    ]);

    return (
        <DashboardClient
            profile={profile}
            companies={companies}
            enquiries={enquiries}
            deadlines={deadlines}
            cases={cases}
            stats={stats}
        />
    );
}

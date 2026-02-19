import { ReportsClient } from "./ReportsClient";
import { getProfile, getReports } from "@/lib/supabase/data-service";

export default async function ReportsPage() {
    const [profile, reports] = await Promise.all([
        getProfile(),
        getReports(),
    ]);

    return (
        <ReportsClient
            profile={profile}
            reports={reports}
        />
    );
}

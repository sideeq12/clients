import { CasesClient } from "./CasesClient";
import { getProfile, getCases } from "@/lib/supabase/data-service";

export default async function CasesPage() {
    const [profile, cases] = await Promise.all([
        getProfile(),
        getCases(),
    ]);

    return (
        <CasesClient
            profile={profile}
            cases={cases}
        />
    );
}

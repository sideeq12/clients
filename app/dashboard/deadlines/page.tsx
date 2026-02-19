import { DeadlinesClient } from "./DeadlinesClient";
import { getProfile, getDeadlines } from "@/lib/supabase/data-service";

export default async function DeadlinesPage() {
    const [profile, deadlines] = await Promise.all([
        getProfile(),
        getDeadlines(),
    ]);

    return (
        <DeadlinesClient
            profile={profile}
            deadlines={deadlines}
        />
    );
}

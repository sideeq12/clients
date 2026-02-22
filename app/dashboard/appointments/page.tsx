import { AppointmentsClient } from "./AppointmentsClient";
import { getProfile } from "@/lib/supabase/data-service";

export default async function AppointmentsPage() {
    const profile = await getProfile();

    return (
        <AppointmentsClient
            profile={profile}
        />
    );
}

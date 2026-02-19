import { SettingsClient } from "./SettingsClient";
import { getProfile } from "@/lib/supabase/data-service";

export default async function SettingsPage() {
    const profile = await getProfile();

    return (
        <SettingsClient
            profile={profile}
        />
    );
}

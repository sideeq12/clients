import { ClientsClient } from "./ClientsClient";
import { getProfile, getCompanies } from "@/lib/supabase/data-service";

export default async function ClientsPage() {
    const [profile, clients] = await Promise.all([
        getProfile(),
        getCompanies(),
    ]);

    return (
        <ClientsClient
            profile={profile}
            clients={clients}
        />
    );
}

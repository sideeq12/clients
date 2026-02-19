import { ClientsClient } from "./ClientsClient";
import { getProfile, getClients } from "@/lib/supabase/data-service";

export default async function ClientsPage() {
    const [profile, clients] = await Promise.all([
        getProfile(),
        getClients(),
    ]);

    return (
        <ClientsClient
            profile={profile}
            clients={clients}
        />
    );
}

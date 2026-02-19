import { EnquiriesClient } from "./EnquiriesClient";
import { getProfile, getEnquiries } from "@/lib/supabase/data-service";

export default async function EnquiriesPage() {
    const [profile, enquiries] = await Promise.all([
        getProfile(),
        getEnquiries(),
    ]);

    return (
        <EnquiriesClient
            profile={profile}
            enquiries={enquiries}
        />
    );
}

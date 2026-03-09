import { AppointmentsClient } from "./AppointmentsClient";
import { getProfile, getAppointments } from "@/lib/supabase/data-service";

export default async function AppointmentsPage() {
    const [profile, appointments] = await Promise.all([
        getProfile(),
        getAppointments()
    ]);

    return (
        <AppointmentsClient
            profile={profile}
            appointments={appointments}
        />
    );
}

import { AutomationClient } from "./AutomationClient";
import { getProfile, getAutomationWorkflows, getAutomationActivity } from "@/lib/supabase/data-service";

export default async function AutomationPage() {
    const [profile, workflows, activity] = await Promise.all([
        getProfile(),
        getAutomationWorkflows(),
        getAutomationActivity(),
    ]);

    return (
        <AutomationClient
            profile={profile}
            workflows={workflows}
            activity={activity}
        />
    );
}

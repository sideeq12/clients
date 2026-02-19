import { DocumentsClient } from "./DocumentsClient";
import { getProfile, getDocumentFolders, getDocuments } from "@/lib/supabase/data-service";

export default async function DocumentsPage() {
    const [profile, folders, documents] = await Promise.all([
        getProfile(),
        getDocumentFolders(),
        getDocuments(),
    ]);

    return (
        <DocumentsClient
            profile={profile}
            folders={folders}
            documents={documents}
        />
    );
}

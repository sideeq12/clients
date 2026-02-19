"use client";

import React from "react";
import {
    Folder,
    File,
    FileText,
    Upload,
    Download,
    Search,
    MoreHorizontal,
    FolderPlus,
    ShieldCheck,
} from "lucide-react";
import { DocumentFolder, Document, Profile } from "@/lib/supabase/data-service";

interface DocumentsClientProps {
    folders: DocumentFolder[];
    documents: Document[];
    profile: Profile | null;
}

export function DocumentsClient({ folders, documents, profile }: DocumentsClientProps) {
    const category = profile?.category || "accounting";

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground/90">Document Management</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {category === "law-firm" ? "Securely manage legal files, filings and case evidence." : "Securely upload, store, and share financial documents with clients."}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors">
                        <FolderPlus className="h-4 w-4" />
                        New Folder
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all active:scale-[0.98]">
                        <Upload className="h-4 w-4" />
                        Upload File
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {folders.map((folder) => {
                    const fileCount = documents.filter(d => d.folder_id === folder.id).length;
                    return (
                        <div key={folder.id} className="p-4 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                            <div className={`p-2 rounded-lg w-fit mb-3 ${folder.color}`}>
                                <Folder className="h-5 w-5 fill-current opacity-80" />
                            </div>
                            <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{folder.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{fileCount} files</p>
                        </div>
                    );
                })}
                {folders.filter(f => !f.id).length === 0 && folders.length === 0 && (
                    <div className="col-span-4 py-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                        No folders created.
                    </div>
                )}
            </div>

            <div className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border/50 flex items-center justify-between gap-4 bg-muted/20">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search document name or client..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">AES-256 Encrypted</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="text-muted-foreground font-medium border-b border-border/50 bg-muted/10">
                                <th className="py-3 px-4">File Name</th>
                                <th className="py-3 px-4">Client</th>
                                <th className="py-3 px-4">Size</th>
                                <th className="py-3 px-4">Last Updated</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                {doc.file_type === 'pdf' ? <FileText className="h-4 w-4" /> : <File className="h-4 w-4" />}
                                            </div>
                                            <span className="font-medium">{doc.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-muted-foreground">{doc.client_name}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{doc.file_size}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-1 px-2 rounded hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all flex items-center gap-1.5 text-xs font-bold">
                                                <Download className="h-3.5 w-3.5" />
                                                Download
                                            </button>
                                            <button className="p-1.5 rounded hover:bg-muted transition-colors">
                                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {documents.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                                        No documents found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

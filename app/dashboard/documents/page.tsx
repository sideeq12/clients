"use client";

import React from "react";
import {
    Folder,
    File,
    FileText,
    Upload,
    Download,
    Search,
    Filter,
    MoreHorizontal,
    Plus,
    FolderPlus,
    Archive,
    ShieldCheck,
} from "lucide-react";

const accountingFolders = [
    { name: "Tax Returns", count: 24, color: "bg-blue-500/10 text-blue-500" },
    { name: "Payroll Docs", count: 12, color: "bg-purple-500/10 text-purple-500" },
    { name: "Bank Statements", count: 45, color: "bg-green-500/10 text-green-500" },
    { name: "Correspondence", count: 18, color: "bg-orange-500/10 text-orange-500" },
];

const lawFolders = [
    { name: "Case Files", count: 32, color: "bg-purple-500/10 text-purple-500" },
    { name: "Court Filings", count: 15, color: "bg-red-500/10 text-red-500" },
    { name: "Evidence Docs", count: 28, color: "bg-amber-500/10 text-amber-500" },
    { name: "Legal Research", count: 12, color: "bg-blue-500/10 text-blue-500" },
];

const accountingDocs = [
    { id: 1, name: "VAT_Return_Q4_2023.pdf", type: "pdf", size: "1.2 MB", client: "Acme Corp Ltd", date: "2024-02-10" },
    { id: 2, name: "Payroll_Report_Jan.xlsx", type: "excel", size: "450 KB", client: "Global Tech", date: "2024-02-05" },
];

const lawDocs = [
    { id: 1, name: "Witness_Statement_Smith.pdf", type: "pdf", size: "2.4 MB", client: "John Smith", date: "2024-02-15" },
    { id: 2, name: "Conveyance_Deed_Final.pdf", type: "pdf", size: "4.1 MB", client: "Alice Brown", date: "2024-02-16" },
];

export default function DocumentsPage() {
    const [category, setCategory] = React.useState<string | null>(null);

    React.useEffect(() => {
        const stored = localStorage.getItem("portal_category");
        setCategory(stored);
    }, []);

    const folders = category === "law-firm" ? lawFolders : accountingFolders;
    const documents = category === "law-firm" ? lawDocs : accountingDocs;

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
                {folders.map((folder) => (
                    <div key={folder.name} className="p-4 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <div className={`p-2 rounded-lg w-fit mb-3 ${folder.color}`}>
                            <Folder className="h-5 w-5 fill-current opacity-80" />
                        </div>
                        <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{folder.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{folder.count} files</p>
                    </div>
                ))}
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
                                                {doc.type === 'pdf' ? <FileText className="h-4 w-4" /> : <File className="h-4 w-4" />}
                                            </div>
                                            <span className="font-medium">{doc.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-muted-foreground">{doc.client}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{doc.size}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{doc.date}</td>
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

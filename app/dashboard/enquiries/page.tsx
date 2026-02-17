"use client";

import React from "react";
import {
    MessageSquare,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    AlertCircle,
} from "lucide-react";

const accountingEnquiries = [
    { id: "ENQ-001", client: "Acme Corp", service: "Tax Advisory", status: "Active", priority: "High", date: "2024-02-15", source: "Website" },
    { id: "ENQ-002", client: "Global Tech", service: "Payroll Setup", status: "Pending", priority: "Medium", date: "2024-02-16", source: "Referral" },
    { id: "ENQ-003", client: "Stark Industries", service: "VAT Audit", status: "Resolved", priority: "Critical", date: "2024-02-14", source: "Direct" },
    { id: "ENQ-004", client: "Wayne Enterprises", service: "Bookkeeping", status: "Active", priority: "Low", date: "2024-02-17", source: "LinkedIn" },
];

const lawEnquiries = [
    { id: "ENQ-L01", client: "John Smith", service: "Family Law", status: "Active", priority: "High", date: "2024-02-15", source: "Website" },
    { id: "ENQ-L02", client: "Alice Brown", service: "Conveyancing", status: "Pending", priority: "Medium", date: "2024-02-16", source: "Referral" },
    { id: "ENQ-L03", client: "Robert Wilson", service: "Litigation", status: "Resolved", priority: "Critical", date: "2024-02-14", source: "Direct" },
    { id: "ENQ-L04", client: "Tech Corp", service: "Corporate", status: "Active", priority: "Low", date: "2024-02-17", source: "Website" },
];

export default function EnquiriesPage() {
    const [category, setCategory] = React.useState<string | null>(null);

    React.useEffect(() => {
        const stored = localStorage.getItem("portal_category");
        setCategory(stored);
    }, []);

    const data = category === "law-firm" ? lawEnquiries : accountingEnquiries;

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {category === "law-firm" ? "Legal Enquiries" : "Client Enquiries"}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage and track all incoming service requests.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors">
                        <Filter className="h-4 w-4" />
                        Sort & Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all active:scale-[0.98]">
                        <Plus className="h-4 w-4" />
                        {category === "law-firm" ? "New Request" : "New Enquiry"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Active", count: 12, icon: Clock, color: "text-blue-500" },
                    { label: "Pending", count: 8, icon: AlertCircle, color: "text-amber-500" },
                    { label: "Completed", count: 145, icon: CheckCircle2, color: "text-green-500" },
                ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl bg-card border border-border/50 shadow-sm flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase">{stat.label}</p>
                            <h3 className="text-xl font-bold">{stat.count}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border/50 flex items-center justify-between gap-4 bg-muted/20">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search enquiries, clients, or services..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="text-muted-foreground font-medium border-b border-border/50 bg-muted/10">
                                <th className="py-3 px-4">ID</th>
                                <th className="py-3 px-4">Client</th>
                                <th className="py-3 px-4">
                                    {category === "law-firm" ? "Practice Area" : "Service"}
                                </th>
                                <th className="py-3 px-4">Priority</th>
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {data.map((enq) => (
                                <tr key={enq.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="py-4 px-4 font-mono text-xs font-semibold">{enq.id}</td>
                                    <td className="py-4 px-4">
                                        <div className="font-semibold">{enq.client}</div>
                                        <div className="text-[10px] text-muted-foreground">{enq.source}</div>
                                    </td>
                                    <td className="py-4 px-4 text-muted-foreground">{enq.service}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${enq.priority === 'Critical' ? 'bg-red-500/10 text-red-500' :
                                            enq.priority === 'High' ? 'bg-orange-500/10 text-orange-500' :
                                                enq.priority === 'Medium' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-slate-500/10 text-slate-500'
                                            }`}>
                                            {enq.priority}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-muted-foreground">{enq.date}</td>
                                    <td className="py-4 px-4">
                                        <span className={`flex items-center gap-1.5 ${enq.status === 'Active' ? 'text-blue-500' :
                                            enq.status === 'Resolved' ? 'text-green-500' :
                                                'text-amber-500'
                                            }`}>
                                            <div className={`h-1.5 w-1.5 rounded-full ${enq.status === 'Active' ? 'bg-blue-500' :
                                                enq.status === 'Resolved' ? 'bg-green-500' :
                                                    'bg-amber-500'
                                                }`} />
                                            <span className="font-medium">{enq.status}</span>
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button className="p-1 rounded hover:bg-muted transition-colors">
                                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                        </button>
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
